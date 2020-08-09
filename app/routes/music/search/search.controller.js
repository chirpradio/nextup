const {
  AlbumService,
  DateService,
  DocumentService,
  SearchService,
  TagEditService,
  ArtistService,
} = require("../../../services");
const { datastore } = require("../../../db");

async function indexHandler(req, res) {
  try {
    const results = await SearchService.search(req.query.term);

    res.render("music/search/searchResults", {
      title: `${req.query.term} - CHIRP NextUp`,
      term: req.query.term,
      artists: results.artists,
      albums: results.albums,
      tracks: results.tracks,
      documents: results.documents,
      showAllLink: {
        artists: results.artists.count > 10,
        albums: results.albums.count > 10,
        tracks: results.tracks.count > 10,
        documents: results.documents.count > 10,
      },
      showPagination: false,
    });
  } catch (err) {
    console.trace(err.message);
    res.status(500).send();
  }
}

async function typeHandler(req, res) {
  try {
    const from = parseInt(req.query.from, 10) || 0;
    const size = 50;
    const results = await SearchService.search(
      req.query.term,
      req.params.type,
      {
        from,
        size,
      }
    );
    const renderOptions = {
      title: `${req.params.type} Search - CHIRP NextUp`,
      term: req.query.term,
      next: from + size,
      previous: Math.max(from - size, 0),
      first: from + 1,
      last: Math.min(from + 50, results.count),
      enablePrevious: from !== 0,
      enableNext: from + size < results.count,
      resultType: `search/${req.params.type}.results`,
      results,
    };

    res.render("music/search/searchType", renderOptions);
  } catch (err) {
    console.trace(err.message);
  }
}

async function updateAlbumsHandler(req, res) {
  try {
    const date = req.query.since
      ? DateService.getStartDateFromHTMLValue(req.query.since)
      : DateService.getXDaysPrevious(1);
    const albums = await AlbumService.listAlbumsByImportDate(date, {
      format: "JSON",
      populate: false,
    });
    const reviewedAlbums = albums.filter((album) => album.is_reviewed);

    for (const album of reviewedAlbums) {
      const albumId = SearchService.getAlbumId(album);
      let artist;

      if (album.album_artist) {
        artist = await ArtistService.getArtist(album.album_artist);
        await SearchService.update(
          "artist",
          SearchService.getArtistId(artist),
          artist
        );
        album.album_artist = artist;
      }

      await SearchService.update("album", albumId, album);

      const documents = await DocumentService.listDocumentsBySubject(album);
      for (const document of documents) {
        document.subject = album;
        await SearchService.update(
          "document",
          SearchService.getDocumentId(document, albumId),
          document
        );
      }

      const tracks = await AlbumService.listAlbumTracks(album);
      for (const track of tracks) {
        track.album = album;
        await SearchService.update(
          "track",
          SearchService.getTrackId(track, album),
          track
        );
      }
    }

    res.send(`Updated ${reviewedAlbums.length} albums`);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}

async function updateTagsHandler(req, res) {
  try {
    const date = req.query.since
      ? DateService.getStartDateFromHTMLValue(req.query.since)
      : DateService.getXDaysPrevious(1);
    const edits = await TagEditService.listTagEditsSinceDate(date);

    for (const edit of edits) {
      const kind = edit.subject.kind;
      const result = await datastore
        .createQuery(kind)
        .filter("__key__", edit.subject)
        .run(AlbumService.options);
      const subject = result[0][0];
      subject.__key = subject[datastore.KEY];
      let subjectId;

      switch (kind) {
        case "Track":
          subject.album = await AlbumService.getPopulatedAlbumByKey(
            subject.album
          );
          subjectId = SearchService.getTrackId(
            subject,
            SearchService.getAlbumId(subject.album)
          );
          break;
        case "Artist":
          subjectId = SearchService.getArtistId(subject);
          break;
        case "Album":
          subjectId = SearchService.getAlbumId(subject);
          break;
      }

      await SearchService.update(kind.toLowerCase(), subjectId, subject);
    }

    res.send(`Updated ${edits.length} entities`);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}

module.exports = {
  indexHandler,
  typeHandler,
  updateAlbumsHandler,
  updateTagsHandler,
};
