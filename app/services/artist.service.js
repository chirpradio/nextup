const { Artist } = require("../models");
const { datastore } = require("../db");

function getArtistKey(artistId) {
  let args;

  if (artistId.startsWith("artist")) {
    const parts = artistId.split("-");
    /*
      some artists are stored with an alphanumeric hash that begins with
      "artist:" *and* have an IndexerTransaction parent that needs to be
      included in the query
    */
    args = ["IndexerTransaction", parseInt(parts[1], 10), "Artist", parts[0]];
  } else {
    // but some artists are stored with simple numeric ids
    args = ["Artist", parseInt(artistId, 10)];
  }

  return datastore.key(args);
}

async function getArtist(key) {
  const result = await Artist.query().filter("__key__", key).run({
    showKey: true,
  });

  return result.entities[0];
}

function getKeyValue(artist) {
  if (artist) {
    const key =
      artist.key || artist[datastore.KEY] || artist.entityKey || artist.__key;

    if (key) {
      return key.id || `${key.name}-${key.parent.id}`;
    } else {
      console.error(`No key in ${JSON.stringify(artist)}`);
    }
  }

  return "";
}

module.exports = {
  getArtist,
  getArtistKey,
  getKeyValue,
};
