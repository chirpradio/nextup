const { PlaylistEvent } = require("../models");
const { datastore } = require("../db");

function getTrackOptions({ start, end, category, type = "track" } = {}) {
  const options = {
    filters: [["playlist", datastore.key(["Playlist", 24001])]],
  };

  if (start) {
    options.filters.push(["established", ">", start]);
  }
  if (end) {
    options.filters.push(["established", "<", end]);
  }
  if (category) {
    options.filters.push(["categories", "=", category]);
  }
  if (type === "track") {
    options.filters.push(["class", "PlaylistTrack"]);
  }

  return options;
}

async function getTracksBetweenDates(options = {}) {
  const trackOptions = getTrackOptions(options);
  const { entities: tracks } = await PlaylistEvent.list(trackOptions)
    .populate("artist", "name")
    .populate("track", "title")
    .populate("selector", ["dj_name", "first_name", "last_name"]);
  return tracks;
}

async function getTrackEntitiesBetween(start, end) {
  const { entities } = await PlaylistEvent.list({
    filters: [
      ["class", "PlaylistTrack"],
      ["playlist", datastore.key(["Playlist", 24001])],
      ["established", ">", start],
      ["established", "<", end],
    ],
    format: "ENTITY",
  });
  return entities;
}

async function addBreak() {
  const breakEntity = new PlaylistEvent({
    class: ["PlaylistEvent", "PlaylistBreak"],
  });
  await breakEntity.save();
}

async function addTrack(
  { album, artist, categories, label, notes, track } = {},
  user
) {
  const playlistTrack = new PlaylistEvent({
    album,
    artist, // track_artist when compilation?
    categories,
    class: ["PlaylistEvent", "PlaylistTrack"],
    freeform_label: label,
    notes,
    selector: user,
    track,
  });
  await playlistTrack.save();
}

async function addFreeformTrack(
  { album, artist, categories, notes, track } = {},
  user
) {
  const freeformTrack = new PlaylistEvent({
    categories,
    class: ["PlaylistEvent", "PlaylistTrack"],
    freeform_album_title: album ? album.title : undefined,
    freeform_artist_name: artist ? artist.name : undefined,
    freeform_label: album ? album.label : undefined,
    freeform_track_title: track.title,
    notes,
    selector: user,
  });
  await freeformTrack.save();
}

module.exports = {
  addBreak,
  addFreeformTrack,
  addTrack,
  getTracksBetweenDates,
  getTrackEntitiesBetween,
};
