const { AlbumService } = require("../../../services");

async function albumHandler(req, res) {
  try {
    const album = await AlbumService.getPopulatedAlbum(req.params.album_id);
    if (album.lastfm_retrieval_time === null) {
      await AlbumService.addImagesFromLastFm(album);
    }
    const [tracks, reviews, comments] = await Promise.all([
      AlbumService.listAlbumTracks(album),
      AlbumService.listAlbumReviews(album),
      AlbumService.listAlbumComments(album),
    ]);

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
