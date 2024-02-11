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

async function addSpotToConstraint(spotKey, id, transaction) {
  const constraint = await SpotConstraint.get(id);
  if (constraint) {
    constraint.spots.push(spotKey);
    return await constraint.save(transaction);
  }
}

async function removeSpotFromConstraint(spotKey, id, transaction) {
  const constraint = await SpotConstraint.get(id);
  const index = constraint.spots.findIndex((key) => key.id == spotKey.id);
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
    const removed = currentIds.filter((id) => !data.constraints.includes(id));
    const added = data.constraints.filter((id) => !currentIds.includes(id));
    console.log(added, removed);

    const addPromises = added.map(async function (id) {
      return addSpotToConstraint(spotKey, id, transaction);
    });
    const removePromises = removed.map(async function (id) {
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
  const transaction = gstore.transaction();
  await transaction.run();

  const spot = new Spot(data);
  await spot.save();

  const promises = data.constraints.map(async function (constraint) {
    return addSpotToConstraint(spot.entityKey, constraint, transaction);
  });
  await Promise.all(promises);

  const { err } = await transaction.commit();
  if (err) {
    await transaction.rollback();
    await spot.delete(spot.entityKey);
    throw err;
  }

  const plain = spot.plain({ showKey: true });
  plain.copy = [];
  return plain;
}

async function addCopy(id, data, user) {
  const key = Spot.key(id);
  data.spot = key;
  data.author = user.entityKey;
  const copy = new SpotCopy(data);
  await copy.save();
  const plain = copy.plain({ showKey: true });
  plain.spot = key;
  return plain;
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
