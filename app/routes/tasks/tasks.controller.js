const {
  AlbumService,
  ArtistService,
  DateService,
  DocumentService,
  PlaylistEventService,
  SearchService,
} = require("../../services");
const levenshtein = require("js-levenshtein");
const { CURRENT_TAGS } = require("../../config/constants");

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
    await AlbumService.addImagesFromLastFm(albumResponse);
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
  const albumId = req.params.album_id;
  try {
    await reindexAlbumEverywhere(albumId);
    req.log.info(`Reindexed album ${albumId}`);
    res.end();
  } catch (err) {
    req.log.error(err, `Failed to reindex album ${albumId}`);
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
        req.log.warn(subject, "No _source to reindex");
      }
    }
    res.end();
  } catch (err) {
    req.log.error(err);
    res.status(500).end();
  }
}

async function matchPlaylistTracktoAlbumTrack(playlistTrack, album) {
  const albumDistance = levenshtein(
    playlistTrack.freeform_album_title,
    album.title
  );
  if (albumDistance > 2) {
    return;
  }

  let artistDistance;
  if (!album.is_compilation) {
    // remove "The" from the beginning of both strings when calculating distance
    artistDistance = levenshtein(
      playlistTrack.freeform_artist_name.replace(/^the\s/i, ""),
      album.album_artist.name.replace(/^the\s/i, "")
    );
    if (artistDistance > 2) {
      return;
    }
  }

  const tracks = await AlbumService.listAlbumTracks(album);
  return tracks.find(
    (track) => levenshtein(track.title, playlistTrack.freeform_track_title) < 2
  );
}

async function updateFreeformRotationPlays(req, res) {
  try {
    // get all rotation albums and their tracks
    const [heavyAlbums, lightAlbums] = await Promise.all([
      await AlbumService.getAlbumsWithTag({
        tag: "heavy_rotation",
        limit: 1000,
      }),
      await AlbumService.getAlbumsWithTag({
        tag: "light_rotation",
        limit: 1000,
      }),
    ]);
    const rotationAlbums = [...heavyAlbums.albums, ...lightAlbums.albums];

    // get PlaylistTracks since last run
    const end = new Date();
    const start = new Date();
    start.setHours(start.getHours() - 3);
    const playlistTracks = await PlaylistEventService.getTrackEntitiesBetween(
      start,
      end
    );

    for (const playlistTrack of playlistTracks) {
      const isFreeform =
        playlistTrack.freeform_album_title !== null &&
        playlistTrack.freeform_artist_name !== null;
      if (isFreeform) {
        for (const album of rotationAlbums) {
          const track = await matchPlaylistTracktoAlbumTrack(
            playlistTrack,
            album
          );
          if (track) {
            req.log.info(
              `Updating PlaylistTrack ${playlistTrack.id} with Track ${track.id}`
            );
            playlistTrack.album = track.album;
            playlistTrack.artist = album.album_artist.__key;
            playlistTrack.track = track.__key;
            playlistTrack.categories = album.current_tags.filter((tag) =>
              CURRENT_TAGS.includes(tag)
            );
            const { error } = playlistTrack.validate();
            if (!error) {
              await playlistTrack.save();
            } else {
              req.log.error(error.errors);
            }
            break;
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (err) {
    req.log.error(err);
    res.status(500).end();
  }
}

module.exports = {
  reindexAlbumHandler,
  reindexTagsHandler,
  updateFreeformRotationPlays,
};
