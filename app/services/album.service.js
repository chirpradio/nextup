const { Album, Document, Track } = require("../models");
const { datastore, renameKey } = require("../db");
const LastFm = require("lastfm-node-client");
const lastFm = new LastFm(process.env.LASTFM_API_KEY);

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

function albumInRotation(album) {
  return (
    album.current_tags &&
    (album.current_tags.includes("heavy_rotation") ||
      album.current_tags.includes("light_rotation"))
  );
}

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
      console.error(err);
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
      ["subject", album.entityKey],
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

async function sortAlbums(albums) {
  albums.sort((a, b) => {
    if (b.year !== a.year) {
      return b.year - a.year;
    }

    if (a.title === b.title) {
      return a.disc_number - b.disc_number;
    }

    return a.title - b.title;
  });
}

async function listAlbumsByCurrentTag(tag) {
  const query = Album.query()
    .filter("current_tags", tag)
    .filter("revoked", false);
  const { entities: albums } = await query
    .run(options)
    .populate("album_artist");
  return albums;
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
  const query = getBaseQuery({ limit, offset }).filter("current_tags", tag);
  return await runAndRenameKeys(query);
}

async function getAlbumsImportedSince({ date, limit, offset } = {}) {
  const query = getBaseQuery({ limit, offset })
    .filter("import_timestamp", ">=", date)
    .order("import_timestamp", { descending: true });
  return await runAndRenameKeys(query);
}

async function listAlbumsByImportDate(
  date,
  { format = "ENTITY", populate = true } = {}
) {
  const query = Album.query()
    .filter("import_timestamp", ">=", date)
    .filter("revoked", false);
  const runOptions = format === "JSON" ? jsonOptions : options;

  const { entities: albums } = await (populate
    ? query.run(runOptions).populate("album_artist")
    : query.run(runOptions));
  return albums;
}

function flattenArtists(albums) {
  return albums.map((album) => {
    album.artist = album.album_artist
      ? album.album_artist.name
      : "Various Artists";
    return album;
  });
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

module.exports = {
  albumInRotation,
  flattenArtists,
  getAlbumById,  
  getFullAlbumDetails,    
  addImagesFromLastFm,
  listAlbumTracks,  
  listAlbumsByCurrentTag,
  listAlbumsByImportDate,  
  options,
  getAlbumsByAlbumArtist,
  getAlbumsWithTag,
  getAlbumsImportedSince,
};
