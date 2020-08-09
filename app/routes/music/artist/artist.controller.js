const { ArtistService, AlbumService } = require("../../../services");

async function artistHandler(req, res) {
  try {
    const key = ArtistService.getArtistKey(req.params.artist_id);
    const [artist, albums] = await Promise.all([
      ArtistService.getArtist(key),
      AlbumService.listAlbumsByArtist(key),
    ]);

    await AlbumService.loadAlbumImages(albums, artist);

    res.render("music/artist/artist", {
      artist,
      albums,
      title: `${artist.name} - CHIRP NextUp`,
    });
  } catch (err) {
    console.error(err);
    res.send("Artist could not be returned");
  }
}

module.exports = {
  artistHandler,
};
