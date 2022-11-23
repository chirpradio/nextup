const { PlaylistEvent } = require("../models");
const { gstore, getPlaylistKey } = require("../db");
const PubSubService = require("./pubsub");
const TOPIC = PubSubService.topicIds.PLAYLIST_EVENT;

async function getTrackOptions({ start, end, category, type = "track" } = {}) {
  const playlist = await getPlaylistKey();
  const options = {
    filters: [["playlist", playlist]],
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
  const trackOptions = await getTrackOptions(options);
  const { entities: tracks } = await PlaylistEvent.list(trackOptions)
    .populate("artist", "name")
    .populate("track", "title")
    .populate("selector", ["dj_name", "first_name", "last_name"]);
  return tracks;
}

async function getTrackEntitiesBetween(start, end) {
  const playlist = await getPlaylistKey();
  const { entities } = await PlaylistEvent.list({
    filters: [
      ["class", "PlaylistTrack"],
      ["playlist", playlist],
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
  return breakEntity.plain({
    showKey: true,
  });
}

async function publish(message) {
  console.log(message);
  await PubSubService.publish(TOPIC, message);
}

async function addTrack(
  { album, artist, categories, label, notes, track } = {},
  user
) {
  const playlistTrack = new PlaylistEvent({
    album,
    artist,
    categories,
    class: ["PlaylistEvent", "PlaylistTrack"],
    freeform_label: label,
    notes,
    selector: user,
    track,
  });
  await playlistTrack.save();

  const plain = playlistTrack.plain({
    showKey: true,
  });
  await publish(
    JSON.stringify({
      action: "added",
      track: plain,
    })
  );

  return plain;
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

  const plain = freeformTrack.plain({
    showKey: true,
  });
  await publish(
    JSON.stringify({
      action: "added",
      track: plain,
    })
  );

  return plain;
}

async function deleteTrack(id) {
  const transaction = gstore.transaction();
  await transaction.run();
  const event = await PlaylistEvent.get(id);
  const plain = event.plain({
    showKey: true,
  });
  await PlaylistEvent.delete(id, null, null, transaction);
  await publish(
    JSON.stringify({
      action: "deleted",
      track: plain,
    })
  );
  await transaction.commit();
}

async function updateTrack(id, { notes } = {}) {
  const transaction = gstore.transaction();
  await transaction.run();
  const event = await PlaylistEvent.update(
    id,
    { notes },
    null,
    null,
    transaction
  );
  const plain = event.plain({
    showKey: true,
  });
  await publish(
    JSON.stringify({
      action: "updated",
      track: plain,
    })
  );
  await transaction.commit();
}

module.exports = {
  addBreak,
  addFreeformTrack,
  addTrack,
  deleteTrack,
  getTracksBetweenDates,
  getTrackEntitiesBetween,
  updateTrack,
};
