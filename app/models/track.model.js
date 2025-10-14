const gstore = require("../db").gstore;
const { Schema } = gstore;

function validateCurrentTags(obj, validator, validTags) {
  if (Array.isArray(obj)) {
    return obj.every((tag) => validTags.includes(tag));
  }

  return false;
}

const trackSchema = new Schema({
  title: { type: String, required: true },
  album: { type: Schema.Types.Key, ref: "Album" },
  bit_rate_kbps: { type: Number, required: true },
  duration_ms: { type: Number, required: true },
  sampling_rate_hz: { type: Number, required: true },
  track_num: { type: Number, required: true },
  channels: {
    type: String,
    required: true,
    validate: {
      rule: "isIn",
      args: [["mono", "joint_stereo", "dual_mono", "stereo"]],
    },
  },
  current_tags: {
    type: Array,
    default: [],
    validate: {
      rule: validateCurrentTags,
      args: [["explicit", "recommended"]],
    },
  },
  pronunciation: { type: String },
  is_reviewed: { type: Boolean, default: false },
  revoked: { type: Boolean, default: false },
  track_artist: { type: Schema.Types.Key, ref: "Artist" },
});

module.exports = gstore.model("Track", trackSchema);
