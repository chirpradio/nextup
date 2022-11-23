const {
  AlbumService,
  DateService,
  PlaylistEventService,
} = require("../../../services");

async function getAlbums(events) {
  const albumKeys = events.map((event) => event.album);
  const filteredKeys = albumKeys.filter((key) => {
    return key !== null && key !== undefined;
  });
  return await AlbumService.getAlbumsByKeys(filteredKeys);
}

function replaceAlbumKeysWithAlbums(events, albums) {
  events.forEach((event) => {
    if (event.album) {
      event.album = albums.find(
        (album) => event.album.name === album.__key.name
      );
    }
  });
}

async function deleteTrack(req, res, next) {
  try {
    await PlaylistEventService.deleteTrack(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

async function getPlaylistEvents(req, res, next) {
  try {
    // default range: last three hours to now
    const start = req.query.start
      ? new Date(req.query.start)
      : DateService.getXHoursPrevious(3);
    const end = req.query.end ? new Date(req.query.end) : new Date();

    const events = await PlaylistEventService.getTracksBetweenDates({
      start,
      end,
      type: "all",
    });
    const albums = await getAlbums(events);
    replaceAlbumKeysWithAlbums(events, albums);

    res.json(events);
  } catch (error) {
    next(error);
  }
}

async function postPlaylistBreak(req, res, next) {
  try {
    const event = await PlaylistEventService.addBreak();
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
}

async function postPlaylistTrack(req, res, next) {
  try {
    const track = await PlaylistEventService.addTrack(
      req.body,
      req.user.entityKey
    );
    res.status(201).json(track);
  } catch (error) {
    next(error);
  }
}

async function postFreeformPlaylistTrack(req, res, next) {
  try {
    const track = await PlaylistEventService.addFreeformTrack(
      req.body,
      req.user.entityKey
    );
    res.status(201).json(track);
  } catch (error) {
    next(error);
  }
}

async function getRotationPlays(req, res, next) {
  try {
    // default range: last seven days to now
    const start = req.query.start
      ? new Date(req.query.start)
      : DateService.getXDaysPrevious(6);
    const end = req.query.end ? new Date(req.query.end) : new Date();

    const [heavyTracks, lightTracks] = await Promise.all([
      await PlaylistEventService.getTracksBetweenDates({
        start,
        end,
        category: "heavy_rotation",
      }),
      await PlaylistEventService.getTracksBetweenDates({
        start,
        end,
        category: "light_rotation",
      }),
    ]);
    const rotationTracks = [...heavyTracks, ...lightTracks];
    const tracksWithAlbums = rotationTracks.filter(
      (track) => track.album !== null
    );

    res.json({
      plays: tracksWithAlbums,
      start: start.getTime(),
      end: end.getTime(),
    });
  } catch (error) {
    next(error);
  }
}

async function updateTrack(req, res, next) {
  try {
    const notes = req.body.notes;
    await PlaylistEventService.updateTrack(req.params.id, { notes });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  deleteTrack,
  getPlaylistEvents,
  getRotationPlays,
  postFreeformPlaylistTrack,
  postPlaylistBreak,
  postPlaylistTrack,
  updateTrack,
};
