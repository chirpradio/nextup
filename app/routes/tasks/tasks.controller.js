const {
  AlbumService,
  ArtistService,
  DocumentService,
  SearchService,
} = require("../../services");

async function updateIndexWithAlbumArtist(artist) {
  await SearchService.update(
    "artist",
    SearchService.getArtistId(artist),
    artist
  );
}

async function updateIndexWithAlbumDocuments(album) {
  const documents = await DocumentService.listDocumentsBySubject(album);
  for (const document of documents) {
    document.subject = album;
    await SearchService.update(
      "document",
      SearchService.getDocumentId(document, album.album_id.value),
      document
    );
  }
}

async function updateIndexWithAlbumTracks(album) {
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

async function reindexAlbumEverywhere(albumId) {
  const albumResponse = await AlbumService.getAlbumById(albumId);
  const albumJson = albumResponse.entityData;

  if (albumJson.album_artist) {
    const artist = await ArtistService.getArtist(albumJson.album_artist);
    await updateIndexWithAlbumArtist(artist);
    albumJson.album_artist = artist;

    const albumInstance = AlbumService.getAlbumById(albumId, {
      format: "ENTITY",
    });
    await AlbumService.addImagesFromLastFm(albumInstance);
  }

  await SearchService.update(
    "album",
    SearchService.getAlbumId(albumJson),
    albumJson
  );
  await updateIndexWithAlbumTracks(albumJson);
  await updateIndexWithAlbumDocuments(albumJson);
}

function updateCurrentTags(doc, body) {
  if (!doc.current_tags) {
    doc.current_tags = [];
  }
  if (body.added) {
    for (const tag of body.added) {
      if (!doc.current_tags.includes(tag)) {
        doc.current_tags.push(tag);
      }
    }
  }
  if (body.removed) {
    for (const removed of body.removed) {
      const tagIndex = doc.current_tags.findIndex((tag) => tag === removed);
      if (tagIndex > -1) {
        doc.current_tags.splice(tagIndex, 1);
      }
    }
  }
}

async function reindexAlbumHandler(req, res) {
  try {
    await reindexAlbumEverywhere(req.params.album_id);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}

async function reindexTagsHandler(req, res) {
  const index = req.params.index.toLowerCase();
  const id = req.params.id;

  try {
    if (index === "album") {
      /* 
        It's overkill to update everything, but it doesn't happen often
        and it keeps the code simpler 
      */
      await reindexAlbumEverywhere(id);
    } else {
      const subject = await SearchService.get(index, id);

      if (subject._source) {
        const doc = subject._source;
        updateCurrentTags(doc, req.body);
        await SearchService.update(index, id, doc);
      } else {
        console.log(subject);
      }
    }
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}

module.exports = {
  reindexAlbumHandler,
  reindexTagsHandler,
};
