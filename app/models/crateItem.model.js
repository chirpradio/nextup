const gstore = require("../db").gstore;
const { Schema } = gstore;

function validateCategories(obj, validator, validTags) {
  if (Array.isArray(obj)) {
    return obj.every((tag) => validTags.includes(tag.toLowerCase()));
  }

  return false;
}

const crateItemSchema = new Schema({
  album: { type: String },
  artist: { type: String },
  label: { type: String },
  notes: { type: String },
  track: { type: String },
  categories: {
    type: Array,
    required: true,
    default: [],
    validate: {
      rule: validateCategories,
      args: [
        ["local_current", "local_classic", "heavy_rotation", "light_rotation"],
      ],
    },
  },
});

module.exports = gstore.model("CrateItem", crateItemSchema);
