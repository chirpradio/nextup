const { PlaylistEvent } = require("../models");
const { datastore } = require("../db");

function getTrackOptions({ start, end, category } = {}) {
  const options = {
    filters: [
      ["class", "PlaylistTrack"],
      ["playlist", datastore.key(["Playlist", 24001])],
    ],
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

module.exports = {
  getTracksBetweenDates,
  getTrackEntitiesBetween,
};
