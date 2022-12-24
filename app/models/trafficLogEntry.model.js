const gstore = require("../db").gstore;
const { Schema } = gstore;
const { SPOT__VALID_SLOTS } = require("../config/constants");

const trafficLogEntrySchema = new Schema({
  created: { type: Date, default: gstore.defaultValues.NOW },
  dow: {
    // day of the week
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
  log_date: { type: Date, required: true },
  reader: { type: Schema.Types.Key, ref: "User", required: true },
  readtime: { type: Date },
  scheduled: { type: Schema.Types.Key, ref: "SpotConstraint", required: true },
  spot: { type: Schema.Types.Key, ref: "Spot", required: true },
  spot_copy: { type: Schema.Types.Key, ref: "SpotCopy", required: true },
});

module.exports = gstore.model("TrafficLogEntry", trafficLogEntrySchema);
