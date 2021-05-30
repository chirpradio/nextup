const { AlbumService, DateService } = require("../../services");

async function indexHandler(req, res) {
  try {
    const [heavyAlbums, lightAlbums, newAlbums] = await Promise.all([
      await AlbumService.listAlbumsByCurrentTag("heavy_rotation"),
      await AlbumService.listAlbumsByCurrentTag("light_rotation"),
      await AlbumService.listAlbumsByImportDate(
        DateService.getXDaysPrevious(28)
      ),
    ]);

    const newButNotRotation = newAlbums
      .filter(AlbumService.albumNotInRotation)
      .filter(AlbumService.albumIsReviewed);

    const [heavyPreview, lightPreview, recentPreview] = await Promise.all([
      await AlbumService.getRandomAlbumsWithArt(heavyAlbums, 4),
      await AlbumService.getRandomAlbumsWithArt(lightAlbums, 4),
      await AlbumService.getRandomAlbumsWithArt(newButNotRotation, 4),
    ]);

    res.render("music/music", {
      heavy_rotation: heavyPreview,
      light_rotation: lightPreview,
      recent: recentPreview,
      title: "Music - CHIRP NextUp",
      hideSearch: true,
    });
  } catch (err) {
    console.error(err);
    res.send("Albums could not be returned");
  }
}

module.exports = {
  indexHandler,
};
