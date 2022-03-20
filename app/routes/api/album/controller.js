const { AlbumService, DateService } = require("../../../services");

async function getAlbumById(req, res, next) {
  try {
    const {
      album,
      tracks,
      reviews,
      comments,
    } = await AlbumService.getFullAlbumDetails(req.params.album_id);

    const response = album.entityData;
    response.__key = album.entityKey;
    response.tracks = tracks;
    response.reviews = reviews;
    response.comments = comments;

    res.json(response);
  } catch (error) {
    next(error);
  }
}

async function getAlbumsWithTag(req, res, next) {
  try {
    const response = await AlbumService.getAlbumsWithTag(req.query);
    res.json(response);
  } catch (error) {
    next(error);
  }
}

async function getRecentAlbums(req, res, next) {
  try {
    const date = new Date(parseInt(req.query.timestamp, 10));
    const response = await AlbumService.getAlbumsImportedSince({
      date: date || DateService.getXDaysPrevious(28),
      limit: req.query.limit,
      offset: req.query.offset,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAlbumById,
  getAlbumsWithTag,
  getRecentAlbums,
};
