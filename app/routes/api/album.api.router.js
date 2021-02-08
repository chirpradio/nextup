const router = require("express").Router();
const { AlbumService } = require("../../services");

router.get("/:album_id", async function (req, res, next) {
  try {
    const {
      album,
      tracks,
      reviews,
      comments,
    } = await AlbumService.getFullAlbumDetails(req.params.album_id);

    const response = album.entityData;
    response.albumKey = album.entityKey;
    response.tracks = tracks;
    response.reviews = reviews;
    response.comments = comments;

    res.json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
