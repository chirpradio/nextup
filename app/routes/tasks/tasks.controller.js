const { AlbumService, ArtistService, DocumentService, SearchService } = require('../../services');

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
  const album = albumResponse.entityData;

  if (album.album_artist) {
    const artist = await ArtistService.getArtist(album.album_artist);
    await updateIndexWithAlbumArtist(artist);
    album.album_artist = artist;
    await AlbumService.addImagesFromLastFm(album);
  }

  await SearchService.update('album', SearchService.getAlbumId(album), album);    
  await updateIndexWithAlbumTracks(album);
  await updateIndexWithAlbumDocuments(album);
}

function updateCurrentTags(doc, body) {
  if(!doc.current_tags) {
    doc.current_tags = [];
  }
  if(body.added) {       
    for(const tag of body.added) {
      if(!doc.current_tags.includes(tag)) {
        doc.current_tags.push(tag);        
      }
    }
  }
  if(body.removed) {
    for(const tag of req.body.removed) {
      const tagIndex = doc.current_tags.findIndex(tag => tag);
      if(tagIndex > -1) {
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
    if(index === 'album') {
      /* 
        It's overkill to update everything, but it doesn't happen often
        and it keeps the code simpler 
      */
      await reindexAlbumEverywhere(id);
    } else {
      const subject = await SearchService.get(index, id);
    
      if(subject._source) {
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
