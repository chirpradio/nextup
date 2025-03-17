const gstore = require("../db").gstore;
const { Schema } = gstore;
const { CURRENT_TAGS } = require("../config/constants");

function validateCurrentTags(obj, validator, validTags) {
  if (Array.isArray(obj)) {
    return obj.every((tag) => validTags.includes(tag));
  }

  return false;
}

const artistSchema = new Schema({
  current_tags: {
    type: Array,
    validate: {
      rule: validateCurrentTags,
      args: [CURRENT_TAGS],
    },
  },
  image: { type: String },
  is_reviewed: { type: Boolean, default: false },
  name: { type: String, required: true },
  pronunciation: { type: String },
  revoked: { type: Boolean, default: false },
});

module.exports = gstore.model("Artist", artistSchema);
