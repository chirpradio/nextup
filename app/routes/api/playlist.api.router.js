const router = require("express").Router();
const {
  DateService,
  PlaylistEventService,
  TagEditService,
} = require("../../services");
const { query } = require("express-validator");
const { checkErrors } = require("./errors");

router.get(
  "/rotation",
  query("start").optional().isInt().toInt(),
  query("end").optional().isInt().toInt(),
  checkErrors,
  async function (req, res, next) {
    try {
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

      // const addedDates = {};
      // for(const track of tracksWithAlbums) {
      //   if(!addedDates[track.album.name]) {
      //     const timestamp = await TagEditService.getTimestampByTag(track.album, track.categories.find(category => category.endsWith("_rotation")));
      //     addedDates[track.album.name] = timestamp;
      //   }
      // }

      res.json({
        plays: tracksWithAlbums,
        // addedDates,
        start: start.getTime(),
        end: end.getTime(),
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
