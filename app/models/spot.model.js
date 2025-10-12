const gstore = require("../db").gstore;
const { Schema } = gstore;
const { SPOT_TYPES } = require("../config/constants");

const spotSchema = new Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    required: true,
    validate: {
      rule: "isIn",
      args: [SPOT_TYPES],
    },
  },
  active: { type: Boolean, default: true },
  created: { type: Date, default: gstore.defaultValues.NOW },
  updated: { type: Date },
  random_spot_copies: { type: Array, default: [], read: false },
  deleted: { type: Boolean, default: false },
});

function setUpdated() {
  this.updated = new Date();
  return Promise.resolve();
}
spotSchema.pre("save", setUpdated);

module.exports = gstore.model("Spot", spotSchema);
