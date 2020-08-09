const gstore = require("../db").gstore;
const { Schema } = gstore;

const documentSchema = new Schema({
  author: { type: Schema.Types.Key, ref: "User", required: true },
  created: { type: Date, required: true },
  doctype: { type: String, required: true },
  is_hidden: { type: Boolean, required: true, default: false },
  modified: { type: Date, required: true },
  revoked: { type: Boolean, required: true, default: false },
  subject: { type: Schema.Types.Key, required: true },
  unsafe_text: { type: String },
});

/**
  properties intentionally left out:
  - author_name: only eight reviews are by users with no User record,
                  not worth the added confusion
  - timestamp: seems to always match created value
  - title: null for all records
**/

module.exports = gstore.model("Document", documentSchema);
