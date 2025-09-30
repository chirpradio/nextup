const gstore = require("../db").gstore;
const { Schema } = gstore;
const { CURRENT_TAGS } = require("../config/constants");

function validateCategories(obj, validator, validTags) {
  if (Array.isArray(obj)) {
    return obj.every((tag) => validTags.includes(tag));
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
      args: [CURRENT_TAGS],
    },
  },
});

module.exports = gstore.model("CrateItem", crateItemSchema);
