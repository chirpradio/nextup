const { gstore, datastore } = require("../db");
const { Schema } = gstore;

function itemsAreIntegers(obj) {
  if (Array.isArray(obj)) {
    return obj.every(Number.isInteger);
  }

  return false;
}

function itemsAreKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.every(datastore.isKey);
  }

  return false;
}

const crateSchema = new Schema({
  name: { type: String },
  user: { type: Schema.Types.Key, ref: "User", required: true },
  items: { type: Array, default: [], validate: { rule: itemsAreKeys } },
  order: {
    type: Array,
    default: [],
    validate: {
      rule: itemsAreIntegers,
    },
  },
  is_default: { type: Boolean, default: false },
});

crateSchema.methods.getCrateName = function getCrateName() {
  if (this.is_default) {
    return this.name || `Default`;
  } else {
    return this.name || `Unnamed (${this.id})`;
  }
};

module.exports = gstore.model("Crate", crateSchema);
