const { Spot, SpotConstraint, SpotCopy } = require("../models");
const { gstore } = require("../db");

async function getConstraintsForSpot(key) {
  const result = await SpotConstraint.query()
    .filter("spots", key)
    .select(["dow", "hour", "slot"])
    .run();
  return result.entities;
}

async function getAllCopyForSpot(key, includeExpired = false) {
  const options = {
    filters: [["spot", key]],
  };
  if (includeExpired === false) {
    options.filters.push(["expire_on", null]);
  }

  const { entities: copy } = await SpotCopy.list(options);
  return copy;
}

async function getSpot(id) {
  const spot = await Spot.get(id);
  const plain = spot.plain({ showKey: true });
  const [constraints, copy] = await Promise.all([
    await getConstraintsForSpot(spot.entityKey),
    await getAllCopyForSpot(spot.entityKey),
  ]);
  plain.constraints = constraints;
  plain.copy = copy;
  return plain;
}

async function listSpots(active = true, includeCopy = true) {
  const options = {
    format: "ENTITY",
    filters: ["active", active],
  };
  const { entities: spots } = await Spot.list(options);
  const response = await Promise.all(
    spots.map(async function (spot) {
      const plain = spot.plain({ showKey: true });
      if (includeCopy) {
        plain.copy = await getAllCopyForSpot(plain.__key);
      }
      return plain;
    })
  );
  return response;
}

async function addSpotToConstraint(spot, id, transaction) {
  const constraint = await SpotConstraint.get(id);
  if (constraint) {
    constraint.spots.push(spot);
    return await constraint.save(transaction);
  }
}

async function removeSpotFromConstraint(spot, id, transaction) {
  const constraint = await SpotConstraint.get(id);
  const index = constraint.spots.findIndex((key) => key.id == spot.id);
  if (index !== -1) {
    constraint.spots.splice(index, 1);
    return await constraint.save(transaction);
  }
}

async function updateSpot(id, data) {
  const transaction = gstore.transaction();
  await transaction.run();
  if (data.constraints) {
    const spotKey = Spot.key(id);
    const current = await getConstraintsForSpot(spotKey);
    const currentIds = current.map((constraint) => constraint.id);
    const providedIds = data.constraints.map((constraint) => constraint.id);
    const removed = currentIds.filter((id) => !providedIds.includes(id));
    const added = providedIds.filter((id) => !currentIds.includes(id));

    const addPromises = added.map((id) => {
      return addSpotToConstraint(spotKey, id, transaction);
    });
    const removePromises = removed.map((id) => {
      return removeSpotFromConstraint(spotKey, id, transaction);
    });
    await Promise.all([...addPromises, ...removePromises]);
    delete data.constraints;
  }
  await Spot.update(id, data, null, null, transaction);

  const { err } = await transaction.commit();
  if (err) {
    throw err;
  }
}

async function deleteSpot(id) {
  await updateSpot(id, {
    active: false,
    constraints: [],
  });
}

async function addSpot(data) {
  const spot = new Spot(data);
  await spot.save();
  return spot.plain({ showKey: true });
}

async function addCopy(id, data, user) {
  const key = Spot.key(id);
  data.spot = key;
  data.author = user.entityKey;
  const copy = new SpotCopy(data);
  await copy.save();
  return copy.plain({ showKey: true });
}

async function updateCopy(id, data) {
  if (data.spot && Number.isInteger(data.spot)) {
    data.spot = Spot.key(data.spot);
  }
  const copy = await SpotCopy.update(id, data);
  return copy.plain({ showKey: true });
}

async function deleteCopy(id) {
  return await updateCopy(id, {
    expire_on: new Date(),
  });
}

module.exports = {
  addCopy,
  addSpot,
  deleteCopy,
  deleteSpot,
  getSpot,
  listSpots,
  updateCopy,
  updateSpot,
};
