const {
  AlbumService,
  DateService,
  PlaylistEventService,
  ReportsService,
} = require("../../../services");
const { promisify } = require("util");
const stringify = promisify(require("csv-stringify"));

async function createCSV(albums) {
  const flattened = AlbumService.flattenArtists(albums);

  return await stringify(flattened, {
    header: true,
    columns: [
      {
        key: "artist",
      },
      {
        key: "title",
        header: "album",
      },
      {
        key: "label",
      },
      {
        key: "play_count",
        header: "count",
      },
      {
        key: "current_tags",
        header: "tags",
      },
      {
        key: "date_added",
      },
    ],
    cast: {
      date: DateService.convertDateToHTMLValue,
    },
  });
}

async function albumsHandler(req, res) {
  try {
    const start = req.query.start
      ? DateService.getStartDateFromHTMLValue(req.query.start)
      : DateService.getXDaysPrevious(6);
    const newAlbums = await AlbumService.listAlbumsByImportDate(start);
    const rotationAlbums = newAlbums.filter(AlbumService.albumInRotation);
    const flattened = AlbumService.flattenArtists(rotationAlbums);
    flattened.sort((a, b) => (a.artist < b.artist ? -1 : 1));

    res.render("reports/rotation/albums", {
      albums: flattened,
      start: DateService.convertDateToHTMLValue(start),
      title: "Rotation Albums - CHIRP NextUp",
    });
  } catch (err) {
    console.error(err);
    res.send("Report could not be returned");
  }
}

async function playsHandler(req, res) {
  try {
    const [heavyAlbums, lightAlbums] = await Promise.all([
      await AlbumService.listAlbumsByCurrentTag("heavy_rotation"),
      await AlbumService.listAlbumsByCurrentTag("light_rotation"),
    ]);
    let albums = heavyAlbums.concat(lightAlbums);

    const startDate = req.query.start
      ? DateService.getStartDateFromHTMLValue(req.query.start)
      : DateService.getXDaysPrevious(6);
    const endDate = req.query.end
      ? DateService.getEndDateFromHTMLValue(req.query.end)
      : new Date();
    const tracks = await PlaylistEventService.listTracksBetweenDates(
      startDate,
      endDate
    );

    albums = await ReportsService.countRotationAlbumPlays(albums, tracks);
    albums.sort(ReportsService.sortAlbumsByPlaysThenLocal);

    if (req.query.download && req.query.download === "csv") {
      const csv = await createCSV(albums);
      const filename = `chirp_rotation_${DateService.convertDateToHTMLValue(
        startDate
      )}_${DateService.convertDateToHTMLValue(endDate)}.csv`;
      res
        .set({
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=${filename}`,
        })
        .status(200)
        .send(csv);
    } else {
      res.render("reports/rotation/plays", {
        albums,
        topFifty: albums.slice(0, 50),
        start: DateService.convertDateToHTMLValue(startDate),
        end: DateService.convertDateToHTMLValue(endDate),
        query: req.query,
        title: "Rotation Report - CHIRP NextUp",
      });
    }
  } catch (err) {
    console.error(err);
    res.send("Report could not be returned");
  }
}

module.exports = {
  albumsHandler,
  playsHandler,
};
