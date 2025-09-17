const {
  AlbumService,
  DateService,
  TrackService,
} = require("../../../services");

async function addReviewsToAlbum(album) {
  album.reviews = await AlbumService.listAlbumReviews(album);
}

module.exports = {
  async getAlbumById(req, res, next) {
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
  },
  async getAlbumsWithTag(req, res, next) {
    try {
      const response = await AlbumService.getAlbumsWithTag(req.query);
      await Promise.all(response.albums.map(addReviewsToAlbum));
      res.json(response);
    } catch (error) {
      next(error);
    }
  },
  async getAlbumAndRequireEditAccess(req, res, next) {
    try {
      const album = await AlbumService.getAlbumById(req.params.album_id);
      const isMusicDirector = req.user.isMusicDirector();
      const isSuperuser = req.user.is_superuser === true;

      if ( isMusicDirector || isSuperuser) {
        req.album = album;
        return next();
      }

      return res.status(403).json({
        error:
          "Forbidden: You can only edit album info if you are a music director or superuser",
      });
    } catch (error) {
      next(error);
    }	  
  },
  async getRecentAlbums(req, res, next) {
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
  },
  async updateTrack(req, res, next) {
    try {
      const track = await TrackService.getByAlbumAndNumber(
        req.params.album_id,
        req.params.track_num
      );
      await TrackService.updateCurrentTags(track, req.body.tags, req.user);
      res.json(track.plain({ showKey: true }));
    } catch (error) {
      next(error);
    }
  },
  async updateAlbumTags(req, res, next) {
    try {
      const album = await AlbumService.getAlbumById(req.params.album_id);
      await AlbumService.updateCurrentTags(album, req.body.tags, req.user);
      res.json(album.plain({ showKey: true }));
    } catch (error) {
      next(error);
    }
  },
  async updateAlbumInfo(req, res, next) {
    try {
      const album = await AlbumService.getAlbumById(req.params.album_id);
      await AlbumService.updateAlbumInfo(
        album,
        {
          label: req.body.label,
          year: req.body.year,
          pronunciation: req.body.pronunciation,
        },
        req.user
      );
      res.json(album.plain({ showKey: true }));
    } catch (error) {
      next(error);
    }
  },
};

