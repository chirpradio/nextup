const { AlbumService } = require("../../../services");

async function indexHandler(req, res) {
  try {
    const tag = req.params.tag;
    const albums = await AlbumService.listAlbumsByCurrentTag(tag);

    res.render("music/tag/tag", {
      albums,
      tag,
      activeNav: "music",
      title: `${tag
        .split("_")
        .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
        .join(" ")} - CHIRP NextUp`,
    });
  } catch (err) {
    console.error(err);
    res.send("Albums could not be returned");
  }
}

module.exports = {
  indexHandler,
};
