const { Album, Document, Track } = require("../models");
const { datastore, renameKey } = require("../db");
const LastFm = require("lastfm-node-client");
const lastFm = new LastFm(process.env.LASTFM_API_KEY);
const logger = require("../logger");

const options = {
  format: "ENTITY",
  showKey: true,
  wrapNumbers: {
    integerTypeCastFunction: datastore.int,
    properties: ["album_id"],
  },
};

const jsonOptions = {
  format: "JSON",
  showKey: true,
  wrapNumbers: {
    integerTypeCastFunction: datastore.int,
    properties: ["album_id"],
  },
};

async function getPopulatedAlbum(albumId) {
  const options = {
    wrapNumbers: {
      integerTypeCastFunction: datastore.int,
      properties: ["album_id"],
    },
  };
  const album = await Album.findOne(
    { album_id: albumId, revoked: false },
    null,
    null,
    options
  );
  return await album.populate("album_artist");
}

async function getAlbumById(
  albumId,
  { format = "JSON", populate = false } = {}
) {
  const runOptions = format === "JSON" ? jsonOptions : options;
  const album = await Album.findOne(
    { album_id: albumId, revoked: false },
    null,
    null,
    runOptions
  );
  return await (populate ? album.populate("album_artist") : album);
}

async function addImagesFromLastFm(album) {
  if (!album || !album.album_artist) {
    return Promise.resolve();
  }

  if (album.lastfm_retrieval_time !== null) {
    return Promise.resolve(album);
  } else {
    try {
      const options = {
        artist: album.album_artist.name,
        album: album.title,
      };

      const data = await lastFm.albumGetInfo(options);

      if (
        data &&
        data.album &&
        data.album.image &&
        data.album.image.length > 0
      ) {
        const images = data.album.image;
        album.lastfm_sm_image_url = images.filter(
          (image) => image.size === "small"
        )[0]["#text"];
        album.lastfm_med_image_url = images.filter(
          (image) => image.size === "medium"
        )[0]["#text"];
        album.lastfm_lg_image_url = images.filter(
          (image) => image.size === "large"
        )[0]["#text"];
        album.lastfm_xl_image_url = images.filter(
          (image) => image.size === "extralarge"
        )[0]["#text"];
        album.lastfm_retrieval_time = new Date();
        await album.save();
        await album.populate("album_artist");
      }
    } catch (err) {
      logger.info(err, "LastFM images not found");
    }
  }
}

async function listAlbumComments(album) {
  const options = {
    filters: [
      ["doctype", "comment"],
      ["subject", album.entityKey],
      ["is_hidden", false],
      ["revoked", false],
    ],
  };
  const { entities: comments } = await Document.list(options).populate(
    "author"
  );
  return comments;
}

async function listAlbumReviews(album) {
  const options = {
    filters: [
      ["doctype", "review"],
      ["subject", album.entityKey || album.__key],
      ["is_hidden", false],
      ["revoked", false],
    ],
  };
  const { entities: reviews } = await Document.list(options).populate("author");
  return reviews;
}

async function listAlbumTracks(album) {
  const listOptions = {
    filters: [
      ["album", album.entityKey || album.__key],
      ["revoked", false],
    ],
    order: { property: "track_num" },
    showKey: true,
  };
  const { entities: tracks } = await Track.list(listOptions).populate(
    "track_artist"
  );
  tracks.forEach((track) => {
    if (track.track_artist) {
      renameKey(track.track_artist);
    }
  });
  return tracks;
}

function getBaseQuery({ limit = 25, offset = 0 } = {}) {
  return Album.query().filter("revoked", false).offset(offset).limit(limit);
}

async function runAlbumsQuery(query) {
  return await query.run(jsonOptions).populate("album_artist");
}

function renameKeys(albums) {
  return albums.map((album) => {
    renameKey(album.album_artist);
    return album;
  });
}

async function runAndRenameKeys(query) {
  const { entities, nextPageCursor } = await runAlbumsQuery(query);
  const albums = renameKeys(entities);
  return { albums, nextPageCursor };
}

async function getAlbumsByAlbumArtist({ key, limit, offset } = {}) {
  const query = getBaseQuery({ limit, offset }).filter("album_artist", key);
  return await runAndRenameKeys(query);
}

async function getAlbumsWithTag({ tag, limit, offset } = {}) {
  const query = getBaseQuery({ limit, offset })
    .filter("current_tags", tag)
    .order("import_timestamp", { descending: true });
  return await runAndRenameKeys(query);
}

async function getAlbumsImportedSince({ date, limit, offset } = {}) {
  const query = getBaseQuery({ limit, offset })
    .filter("import_timestamp", ">=", date)
    .order("import_timestamp", { descending: true });
  return await runAndRenameKeys(query);
}

async function getFullAlbumDetails(albumId) {
  const album = await getPopulatedAlbum(albumId);

  if (album.lastfm_retrieval_time === null) {
    await addImagesFromLastFm(album);
  }

  if (album.album_artist) {
    album.album_artist.__key = album.album_artist[datastore.KEY];
  }

  const [tracks, reviews, comments] = await Promise.all([
    listAlbumTracks(album),
    listAlbumReviews(album),
    listAlbumComments(album),
  ]);

  return {
    album,
    tracks,
    reviews,
    comments,
  };
}

async function getAlbumsByKeys(keys) {
  if (!Array.isArray(keys) || keys.length === 0) {
    return [];
  }

  const result = await datastore.get(keys, {
    wrapNumbers: {
      integerTypeCastFunction: datastore.int,
      properties: ["album_id"],
    },
  });
  return result[0].map(renameKey);
}

module.exports = {
  getAlbumById,
  getAlbumsByKeys,
  getFullAlbumDetails,
  addImagesFromLastFm,
  listAlbumReviews,
  listAlbumTracks,
  options,
  getAlbumsByAlbumArtist,
  getAlbumsWithTag,
  getAlbumsImportedSince,
};
