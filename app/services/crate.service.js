const { Crate } = require("../models");

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

module.exports = {
  listCratesForUser,
};
