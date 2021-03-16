const { Crate } = require("../models");
const { renameKey } = require("../db");

async function getCrate(id) {
  return await Crate.get(id);
}

async function listCratesForUser(user) {
  if (!user) {
    return [];
  }

  const options = {
    filters: [["user", user.entityKey]],
    format: "ENTITY",
    showKey: true,
  };

  const { entities: crates } = await Crate.list(options);
  return crates;
}

async function listCrates(user) {
  if (!user) {
    return [];
  }

  const options = {
    filters: [["user", user.entityKey]],
    showKey: true,
  };

  const { entities: crates } = await Crate.list(options);
  return crates;
}

function userIsAuthorized(user, crate) {
  return user.entityKey.id === crate.user.id || user.is_superuser;
}

module.exports = {
  getCrate,
  listCrates,
  listCratesForUser,
  userIsAuthorized,
};
