const router = require("express").Router();
const { AlbumService, ArtistService } = require("../../services");

router.get("/:id", async function (req, res, next) {
  try {
    const key = ArtistService.getArtistKey(req.params.id);
    const artist = await ArtistService.getArtistWithRenamedKey(key);
    res.json(artist);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/albums", async function (req, res, next) {
  try {
    const key = ArtistService.getArtistKey(req.params.id);
    const response = await AlbumService.getAlbumsByAlbumArtist({ key });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
