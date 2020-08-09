const gstore = require("../db").gstore;
const { Schema } = gstore;

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
      args: [
        ["local_current", "local_classic", "heavy_rotation", "light_rotation"],
      ],
    },
  },
  image: { type: String },
  is_reviewed: { type: Boolean, default: false },
  name: { type: String, required: true },
  pronunciation: { type: String },
  revoked: { type: Boolean, default: false },
});

module.exports = gstore.model("Artist", artistSchema);
