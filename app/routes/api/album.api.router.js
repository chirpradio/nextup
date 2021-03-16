const router = require("express").Router();
const { query } = require('express-validator');
const { checkErrors } = require("./errors");
const { AlbumService, DateService } = require("../../services");

const validateLimit = query('limit').optional().isInt({ min: 1, max: 100 });
const validateOffset = query('offset').optional().isInt();

router.get("/tag", 
  query('tag').isIn(["heavy_rotation", "light_rotation", "local_current", "local_classic"]),
  validateLimit,
  validateOffset,
  checkErrors,
  async function (req, res, next) {
    try {    
      const response = await AlbumService.getAlbumsWithTag(req.query);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/recent", 
  query('timestamp').optional().isInt(),
  validateLimit,
  validateOffset,
  checkErrors,
  async function (req, res, next) {
    try {
      const date = new Date(parseInt(req.query.timestamp, 10));
      const response = await AlbumService.getAlbumsImportedSince({
        date: date || DateService.getXDaysPrevious(28),
        limit: req.query.limit,
        offset: req.query.offset
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/:album_id", async function (req, res, next) {
  try {
    const {
      album,
      tracks,
      reviews,
      comments,
    } = await AlbumService.getFullAlbumDetails(req.params.album_id);

    const response = album.entityData;
    response.key = album.entityKey;
    response.tracks = tracks;
    response.reviews = reviews;
    response.comments = comments;

    res.json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
