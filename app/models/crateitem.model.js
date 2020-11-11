const gstore = require("../db").gstore;
const { Schema } = gstore;

const crateItemSchema = new Schema({
  album: { type: String },
  artist: { type: String },
  label: { type: String },
  notes: { type: String },
  track: { type: String },
});

module.exports = gstore.model("CrateItem", crateItemSchema);
