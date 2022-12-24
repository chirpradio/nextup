const { datastore, gstore } = require("../db");
const { Schema } = gstore;
const { SPOT__VALID_SLOTS } = require("../config/constants");

function allSpotKeys(obj) {
  if (!Array.isArray(obj)) {
    return false;
  }

  return obj.every((key) => {
    return datastore.isKey(key) && key.kind === "Spot";
  });
}

const spotConstraintSchema = new Schema({
  dow: {
    // day of the week
    // Monday is 1, Sunday is 7
    type: Number,
    validate: {
      rule: "isInt",
      args: [{ min: 1, max: 7 }],
    },
    required: true,
  },
  hour: {
    type: Number,
    validate: {
      rule: "isInt",
      args: [{ min: 0, max: 23 }],
    },
    required: true,
  },
  slot: {
    // minute
    type: Number,
    validate: {
      rule: "isIn",
      args: [SPOT__VALID_SLOTS],
    },
    required: true,
  },
  spots: {
    type: Array,
    default: [],
    validate: {
      rule: allSpotKeys,
    },
  },
});

module.exports = gstore.model("SpotConstraint", spotConstraintSchema);
