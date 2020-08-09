const gstore = require("../db").gstore;
const { Schema } = gstore;

const crateSchema = new Schema({
  name: { type: String },
  user: { type: Schema.Types.Key, ref: "User", required: true },
  items: { type: Array },
  order: { type: Array },
  is_default: { type: Boolean },
});

crateSchema.methods.getCrateName = function getCrateName() {
  if (this.is_default) {
    return this.name || `Default (${this.id})`;
  } else {
    return this.name || `Unnamed (${this.id})`;
  }
};

module.exports = gstore.model("Crate", crateSchema);
