const {
  AlbumService,
  DateService,
  PlaylistEventService,
} = require("../../../services");
const { DateTime } = require("luxon");

async function getAlbums(events) {
  const albumKeys = events.map((event) => event.album);
  const filteredKeys = albumKeys.filter((key) => {
    return key !== null && key !== undefined;
  });  
  const uniqueKeys = [...new Set(filteredKeys.map(key => key.name))].map(name => 
    filteredKeys.find(key => key.name === name)
  );
  
  // Datastore can only fetch up to 1000 keys at a time
  const batchSize = 1000;
  const batchPromises = [];
  for (let i = 0; i < uniqueKeys.length; i += batchSize) {
    const batch = uniqueKeys.slice(i, i + batchSize);
    batchPromises.push(AlbumService.getAlbumsByKeys(batch));
  }

  const batchResults = await Promise.all(batchPromises);
  return batchResults.flat();
}

function replaceAlbumKeysWithAlbums(events, albums) {
  const albumMap = new Map(albums.map(album => [album.__key.name, album]));
  events.forEach((event) => {
    if (event.album) {
      event.album = albumMap.get(event.album.name);
    }
  });
}

async function deleteTrack(req, res, next) {
  try {
    const id = Number.parseInt(req.params.id, 10);
    await PlaylistEventService.deleteTrack(id);
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

async function exportPlaylistReport(req, res, next) {
  try {
    const start = DateService.getStartDateFromHTMLValue(req.query.start);
    const end = DateService.getEndDateFromHTMLValue(req.query.end);
    const tracks = await PlaylistEventService.getTracksBetweenDates({
      start,
      end,
    });
    const albums = await getAlbums(tracks);
    replaceAlbumKeysWithAlbums(tracks, albums);

    const headers = [
      "date",
      "time",
      "station",
      "artist",
      "track",
      "album",
      "label",
      "local",
    ];
    const csvRows = [headers.join(",")];

    tracks.forEach((track) => {
      const trackTitle = track.track?.title || track.freeform_track_title || "";
      const artistName = track.artist?.name || track.freeform_artist_name || "";
      const albumTitle = track.album?.title || track.freeform_album_title || "";
      const label = track.album?.label || track.freeform_label || "";

      const chicagoDateTime = DateTime.fromJSDate(
        new Date(track.established)
      ).setZone("America/Chicago");
      const date = chicagoDateTime.toFormat("yyyy-MM-dd"); // YYYY-MM-DD
      const time = chicagoDateTime.toFormat("HH:mm:ss"); // HH:MM:SS
      
      // Check if track has local categories
      const isLocal = track.categories?.includes("local_current") || 
                     track.categories?.includes("local_classic") ? 1 : 0;

      const row = [
        date,
        time,
        "WCXP-LP",
        `"${artistName.replace(/"/g, '""')}"`,
        `"${trackTitle.replace(/"/g, '""')}"`,
        `"${albumTitle.replace(/"/g, '""')}"`,
        `"${label.replace(/"/g, '""')}"`,
        isLocal,
      ];
      csvRows.push(row.join(","));
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="playlist-report-${req.query.start}-to-${req.query.to}.csv"`
    );
    res.send(csvRows.join("\n"));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  deleteTrack,
  exportPlaylistReport,
  getPlaylistEvents,
  getRotationPlays,
  postFreeformPlaylistTrack,
  postPlaylistBreak,
  postPlaylistTrack,
  updateTrack,
};
