const { AlbumService } = require("../../../services");

async function albumHandler(req, res) {
  try {
    const {
      album,
      tracks,
      reviews,
      comments,
    } = await AlbumService.getFullAlbumDetails(req.params.album_id);

    res.render("music/album/album", {
      album,
      tracks,
      reviews,
      comments,
      title: `${album.title} - CHIRP NextUp`,
    });
  } catch (err) {
    console.error(err);
    res.send("Album could not be returned");
  }
}

module.exports = {
  albumHandler,
};
