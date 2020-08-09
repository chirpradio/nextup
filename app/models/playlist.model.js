const gstore = require("../db").gstore;
const { Schema } = gstore;

function validateArray(obj, validator, validItems) {
  if (Array.isArray(obj)) {
    return obj.every((item) => validItems.includes(item));
  }

  return false;
}

const playlistSchema = new Schema({
  channel: { type: String },
  class: {
    type: Array,
    validate: {
      rule: validateArray,
      args: [["Playlist", "BroadcastPlaylist"]],
    },
  },
  established: { type: Date },
  modified: { type: Date },
});

module.exports = gstore.model("Playlist", playlistSchema);
