const gstore = require("../db").gstore;
const { Schema } = gstore;

function validateCurrentTags(obj, validator, validTags) {
  if (Array.isArray(obj)) {
    return obj.every((tag) => validTags.includes(tag.toLowerCase()));
  }

  return false;
}

const albumSchema = new Schema({
  title: { type: String, required: true },
  album_artist: { type: Schema.Types.Key, ref: "Artist" },
  import_timestamp: { type: Date, required: true },
  album_id: { type: Number, required: true },
  num_tracks: { type: Number, required: true },
  pronunciation: { type: String },
  label: { type: String },
  year: { type: Number },
  disc_number: { type: Number },
  num_comments: { type: Number, default: 0 },
  num_reviews: { type: Number, default: 0 },
  revoked: { type: Boolean, default: false },
  is_reviewed: { type: Boolean, default: false },
  is_compilation: { type: Boolean, default: false },
  current_tags: {
    type: Array,
    validate: {
      rule: validateCurrentTags,
      args: [
        [
          "local_current",
          "local_classic",
          "heavy_rotation",
          "light_rotation",
          "clean",
          "ep",
          "Disc 1",
          "Disc 2",
          "Disc 3",
          "Disc 4",
        ],
      ],
    },
    default: [],
  },
  lastfm_sm_image_url: { type: String },
  lastfm_med_image_url: { type: String },
  lastfm_lg_image_url: { type: String },
  lastfm_xl_image_url: { type: String },
  lastfm_retrieval_time: { type: Date },
});

function wrapAlbumId(propsValues) {
  if (propsValues.album_id) {
    propsValues.album_id = gstore.ds.int(propsValues.album_id);
  }

  return Promise.resolve();
}
albumSchema.pre("findOne", wrapAlbumId);

function wrapAlbumIdPreSave() {
  if (this.album_id && !gstore.ds.isInt(this.album_id)) {
    this.album_id = gstore.ds.int(this.album_id);
  }

  return Promise.resolve();
}
albumSchema.pre("save", wrapAlbumIdPreSave);

module.exports = gstore.model("Album", albumSchema);
