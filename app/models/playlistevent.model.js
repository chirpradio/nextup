const gstore = require("../db").gstore;
const { Schema } = gstore;

function validateArray(obj, validator, validItems) {
  if (Array.isArray(obj)) {
    return obj.every((item) => validItems.includes(item));
  }

  return false;
}

const playlistEventSchema = new Schema({
  album: { type: Schema.Types.Key, ref: "Album" },
  artist: { type: Schema.Types.Key, ref: "Artist" },
  categories: {
    type: Array,
    validate: {
      rule: validateArray,
      args: [
        ["local_current", "local_classic", "heavy_rotation", "light_rotation"],
      ],
    },
  },
  class: {
    type: Array,
    validate: {
      rule: validateArray,
      args: [["PlaylistEvent", "PlaylistTrack", "PlaylistBreak"]],
    },
  },
  established: { type: Date, required: true },
  freeform_album_title: { type: String },
  freeform_artist_name: { type: String },
  freeform_label: { type: String },
  freeform_track_title: { type: String },
  lastfm_url_large_image: { type: String },
  lastfm_url_med_image: { type: String },
  lastfm_url_sm_image: { type: String },
  lastfm_urls_processed: { type: Boolean },
  modified: { type: Date },
  notes: { type: String },
  playlist: { type: Schema.Types.Key, ref: "Playlist", required: true },
  selector: { type: Schema.Types.Key, ref: "User" },
  track: { type: Schema.Types.Key, ref: "Track" },
  track_number: { type: Number },
});

module.exports = gstore.model("PlaylistEvent", playlistEventSchema);
