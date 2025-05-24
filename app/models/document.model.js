const gstore = require("../db").gstore;
const { Schema } = gstore;

const documentSchema = new Schema({
  author: { type: Schema.Types.Key, ref: "User" },
  // if the author is not a user
  author_name: { type: String },
  created: { type: Date, required: true, default: gstore.defaultValues.NOW },
  doctype: { type: String, required: true, values: ["review", "comment"] },
  is_hidden: { type: Boolean, required: true, default: false },
  modified: { type: Date, required: true, default: gstore.defaultValues.NOW },
  revoked: { type: Boolean, required: true, default: false },
  subject: { type: Schema.Types.Key, required: true },
  unsafe_text: { type: String, required: true },
});

/**
  properties intentionally left out:
  - timestamp: early records always match created value, missing from latest entities
  - title: null for all records
**/

module.exports = gstore.model("Document", documentSchema);
