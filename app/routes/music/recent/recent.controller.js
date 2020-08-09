const { AlbumService, DateService } = require("../../../services");

async function indexHandler(req, res) {
  try {
    const albums = await AlbumService.listAlbumsByImportDate(
      DateService.getXDaysPrevious(28)
    );
    const newButNotRotation = albums
      .filter(AlbumService.albumNotInRotation)
      .filter(AlbumService.albumIsReviewed);

    res.render("music/tag/tag", {
      albums: newButNotRotation,
      tag: "More Recently Added",
      title: `More Recently Added - CHIRP NextUp`,
    });
  } catch (err) {
    console.error(err);
    res.send("Albums could not be returned");
  }
}

module.exports = {
  indexHandler,
};
