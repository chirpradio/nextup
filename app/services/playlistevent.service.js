const { PlaylistEvent } = require("../models");
const { datastore } = require("../db");

async function listTracksBetweenDates(start, end, additionalOptions = {}) {
  const options = Object.assign(
    {
      filters: [
        ["class", "PlaylistTrack"],
        ["playlist", datastore.key(["Playlist", 24001])],
        ["established", "<", end],
        ["established", ">", start],
      ],
    },
    additionalOptions
  );

  const { entities: tracks } = await PlaylistEvent.list(options).populate([
    "track",
    "selector",
  ]);
  return tracks;
}

module.exports = {
  listTracksBetweenDates,
};
