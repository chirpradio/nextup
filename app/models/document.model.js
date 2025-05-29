const { gstore, datastore } = require("../db");
const { Schema } = gstore;

const documentSchema = new Schema({
  author: { type: Schema.Types.Key, ref: "User" },
  // if the author is not a user
  author_name: { type: String },
  created: {
    type: Date,
    required: true,
    default: gstore.defaultValues.NOW,
    write: false,
  },
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

async function hasAuthorOrName() {
  const hasAuthor = datastore.isKey(this.author);
  const hasName = typeof this.author_name === "string";

  if (hasAuthor || hasName) {
    return Promise.resolve();
  }

  return Promise.reject("Requires author or author_name");
}
documentSchema.pre("save", hasAuthorOrName);

async function updateModified() {
  this.modified = new Date();
  return Promise.resolve();
}
documentSchema.pre("save", updateModified);

module.exports = gstore.model("Document", documentSchema);
