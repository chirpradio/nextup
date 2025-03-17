const { datastore, gstore, getPlaylistKey } = require("../db");
const { Schema } = gstore;
const { CURRENT_TAGS } = require("../config/constants");

let PLAYLIST_KEY;

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
      args: [CURRENT_TAGS],
    },
  },
  class: {
    type: Array,
    validate: {
      rule: validateArray,
      args: [["PlaylistEvent", "PlaylistTrack", "PlaylistBreak"]],
    },
  },
  established: {
    type: Date,
    required: true,
    default: gstore.defaultValues.NOW,
    write: false,
  },
  freeform_album_title: { type: String },
  freeform_artist_name: { type: String },
  freeform_label: { type: String },
  freeform_track_title: { type: String },
  lastfm_url_large_image: { type: String },
  lastfm_url_med_image: { type: String },
  lastfm_url_sm_image: { type: String },
  lastfm_urls_processed: { type: Boolean },
  modified: { type: Date, default: gstore.defaultValues.NOW },
  notes: { type: String },
  playlist: {
    type: Schema.Types.Key,
    ref: "Playlist",
    required: true,
  },
  selector: { type: Schema.Types.Key, ref: "User" },
  track: { type: Schema.Types.Key, ref: "Track" },
  track_number: { type: Number, default: 1 },
});

async function setDefaultPlaylist() {
  this.playlist = await getPlaylistKey();
  return Promise.resolve();
}
playlistEventSchema.pre("save", setDefaultPlaylist);

module.exports = gstore.model("PlaylistEvent", playlistEventSchema);
