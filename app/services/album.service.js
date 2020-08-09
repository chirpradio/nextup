const { Album, Document, Track } = require("../models");
const { datastore } = require("../db");
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

function albumIsReviewed(album) {
  return album.is_reviewed;
}

function albumInRotation(album) {
  return (
    album.current_tags &&
    (album.current_tags.includes("heavy_rotation") ||
      album.current_tags.includes("light_rotation"))
  );
}

function albumNotInRotation(album) {
  return !albumInRotation(album);
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

async function getPopulatedAlbumByKey(
  key,
  { format = "JSON", populate = true } = {}
) {
  const runOptions = format === "JSON" ? jsonOptions : options;
  const album = await Album.findOne(
    { __key__: key, revoked: false },
    null,
    null,
    runOptions
  );
  return await (populate ? album.populate("album_artist") : album);
}

async function getAlbumByKey(key, { format = "JSON" } = {}) {
  const runOptions = format === "JSON" ? jsonOptions : options;
  const response = await Album.query().filter("__key__", key).run(runOptions);
  return response.entities[0];
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
      console.log("getting images from LastFM", options);
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

async function getRandomAlbumsWithArt(albums, count) {
  const indexes = [];
  const selected = [];
  const imagePromises = [];

  if (!albums || albums.length === 0) {
    return selected;
  }

  while (indexes.length < count) {
    const index = Math.floor(Math.random() * albums.length);
    if (!indexes.includes(index)) {
      indexes.push(index);
      const album = albums[index];
      selected.push(album);
      imagePromises.push(await addImagesFromLastFm(album));
    }
  }

  await Promise.all(imagePromises);
  return selected;
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
  };
  const { entities: tracks } = await Track.list(listOptions).populate(
    "track_artist"
  );
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

async function listAlbumsByArtist(key) {
  const query = Album.query()
    .filter("album_artist", key)
    .filter("revoked", false);
  const { entities: albums } = await query.run(options);
  sortAlbums(albums);
  return albums;
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

async function loadAlbumImages(albums, artist) {
  const imagePromises = [];
  albums.forEach((album) => {
    if (album.lastfm_retrieval_time === null) {
      album.album_artist = artist;
      imagePromises.push(addImagesFromLastFm(album));
    }
  });
  if (imagePromises.length > 0) {
    await Promise.all(imagePromises);
  }
}

function flattenArtists(albums) {
  return albums.map((album) => {
    album.artist = album.album_artist
      ? album.album_artist.name
      : "Various Artists";
    return album;
  });
}

module.exports = {
  albumIsReviewed,
  albumInRotation,
  albumNotInRotation,
  flattenArtists,
  getAlbumByKey,
  getPopulatedAlbum,
  getPopulatedAlbumByKey,
  getRandomAlbumsWithArt,
  addImagesFromLastFm,
  listAlbumComments,
  listAlbumReviews,
  listAlbumTracks,
  listAlbumsByArtist,
  listAlbumsByCurrentTag,
  listAlbumsByImportDate,
  loadAlbumImages,
  options,
};
