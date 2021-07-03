const { Crate, CrateItem } = require("../models");
const { datastore, gstore, renameKey } = require("../db");

const queryOptions = {
  wrapNumbers: {
    integerTypeCastFunction: datastore.int,
    properties: ["album_id"],
  },
};

async function getCrate(id) {
  return await Crate.get(id);
}

async function listCrates(user) {
  if (!user) {
    return [];
  }

  const options = {
    filters: [["user", user.entityKey]],
    format: "ENTITY",
    showKey: true,
  };

  const { entities: crates } = await Crate.list(options);
  return crates.map((crate) => crate.plain({ showKey: true, virtuals: true }));
}

function replaceArtistKeysWithEntities(entities, artists, prop) {
  for (const entity of entities) {
    if (entity[prop]) {
      const keyString = JSON.stringify(entity[prop]);
      const artist = artists.find(
        (artist) => JSON.stringify(artist[datastore.KEY]) === keyString
      );
      artist.__key = artist[datastore.KEY];
      entity[prop] = artist;
    }
  }
}

async function populateEntities(entities) {
  // Get all the album keys associated with tracks in the crate
  const tracks = entities.filter(
    (item) => item[datastore.KEY].kind === "Track"
  );
  const trackAlbumKeys = tracks.map((track) => track.album);
  const [trackAlbums] = trackAlbumKeys.length
    ? await datastore.get(trackAlbumKeys, queryOptions)
    : [[]];

  // Get all the album keys in the crate
  const albums = entities.filter(
    (item) => item[datastore.KEY].kind === "Album"
  );

  // Get all the artists associated with albums or tracks in the crate
  const albumArtistKeys = albums.map((album) => album.album_artist);
  const trackAlbumArtistKeys = trackAlbums.map((album) => album.album_artist);
  const trackArtistKeys = tracks.map((track) => track.track_artist);
  const allArtistKeys = [
    ...albumArtistKeys,
    ...trackAlbumArtistKeys,
    ...trackArtistKeys,
  ].filter(Boolean);
  const [artists] = allArtistKeys.length
    ? await datastore.get(allArtistKeys)
    : [[]];

  // Replace artist keys with the artist data
  replaceArtistKeysWithEntities(trackAlbums, artists, "album_artist");
  replaceArtistKeysWithEntities(albums, artists, "album_artist");
  replaceArtistKeysWithEntities(tracks, artists, "track_artist");

  // Replace album keys on tracks with the album data
  for (const track of tracks) {
    const keyString = JSON.stringify(track.album);
    track.album = trackAlbums.find(
      (album) => JSON.stringify(album[datastore.KEY]) === keyString
    );
  }
}

function normalizeItem(item) {
  let album, artist, track, notes;
  const key = item[datastore.KEY] || item.__key;
  const kind = key.kind;

  switch (kind) {
    case "Track":
      track = renameKey(item);
      album = renameKey(item.album);
      artist = item.track_artist
        ? renameKey(item.track_artist)
        : renameKey(item.album.album_artist);
      break;
    case "Album":
      album = renameKey(item);
      artist = renameKey(item.album_artist);
      break;
    case "Artist":
      artist = renameKey(item);
      break;
    case "CrateItem":
      if (item.track) {
        track = {
          title: item.track,
        };
      }
      if (item.album) {
        album = {
          title: item.album,
        };
        if (item.label) {
          album.label = item.label;
        }
      }
      if (item.artist) {
        artist = {
          name: item.artist,
        };
      }
      notes = item.notes;
  }

  return {
    album,
    artist,
    track,
    notes,
    kind,
  };
}

async function getItems(crate, { limit, offset } = {}) {
  const orderedEntities = [];
  const orderedItems = [];
  if (crate && crate.items && crate.items.length) {
    const itemIndexes = crate.order.slice(offset, limit + offset);
    const keys = [];
    for (const itemIndex of itemIndexes) {
      keys.push(crate.items[itemIndex - 1]);
    }
    if (keys.length === 0) {
      return orderedItems;
    }

    // This method is the easiest way to get a mixed set of entities
    const [entities] = await datastore.get(keys, queryOptions);

    /*
      Populate the related albums and artists for each album and track
      Since we're using Datastore directly in the above query, we can't
      use gstore-node .populate() to do the work for us
    */
    await populateEntities(entities);

    // Order the items to return
    for (const key of keys) {
      const keyStr = JSON.stringify(key);
      const entity = entities.find(
        (entity) => JSON.stringify(entity[datastore.KEY]) === keyStr
      );
      orderedEntities.push(entity);
    }

    // Then normalize them
    for (const entity of orderedEntities) {
      orderedItems.push(normalizeItem(entity));
    }
  }
  return orderedItems;
}

async function addItem(crate, key, index) {
  if (!datastore.isKey(key)) {
    throw new TypeError("Invalid key");
  }
  const indexIsInteger = Number.isInteger(index);
  if (
    indexIsInteger &&
    (index < 0 || (crate.items && index > crate.items.length - 1))
  ) {
    throw new RangeError("Invalid index");
  }

  if (!crate.items || crate.items === []) {
    crate.items = [key];
    crate.order = [1];
  } else {
    // add to the end by default
    const itemIndex = indexIsInteger ? index : crate.items.length;
    const oneBasedItemIndex = Math.max(itemIndex + 1, 1);
    crate.items.splice(itemIndex, 0, key);
    // increment any order value greater than the added item's index
    crate.order = crate.order.map((element) => {
      return element >= oneBasedItemIndex ? element + 1 : element;
    });
    crate.order.splice(itemIndex, 0, oneBasedItemIndex);
  }

  await crate.save();
}

async function createAndAddCrateItem(crate, item, index) {
  const crateItem = new CrateItem(item);
  await crateItem.save();
  await addItem(crate, crateItem.entityKey, index);
  return crateItem;
}

async function removeItem(crate, index) {
  if (index < 0 || index > crate.order.length - 1) {
    throw new RangeError("Invalid index");
  }

  const itemIndex = crate.order.splice(index, 1)[0];
  const oneBasedItemIndex = itemIndex - 1;
  const item = crate.items.splice(oneBasedItemIndex, 1)[0];
  // decrement any order value greater than the deleted index
  crate.order = crate.order.map((element) => {
    return element > oneBasedItemIndex ? element - 1 : element;
  });
  await crate.save();

  if (item.kind === "CrateItem") {
    await CrateItem.delete(null, null, null, null, item);
  }
}

async function reorderItem(crate, index, newIndex) {
  if (index < 0 || index > crate.order.length - 1) {
    throw new RangeError("Invalid index");
  }
  if (newIndex < 0 || newIndex > crate.order.length - 1) {
    throw new RangeError("Invalid new index");
  }

  const itemIndex = crate.order.splice(index, 1)[0];
  crate.order.splice(newIndex, 0, itemIndex);
  await crate.save();
}

async function renameCrate(crate, name) {
  crate.name = name;
  await crate.save();
}

async function addCrate(userKey, name) {
  const crate = new Crate({
    user: userKey,
    name,
    items: [],
    order: [],
  });
  await crate.save();
  return crate;
}

async function deleteCrate(crate) {
  const transaction = gstore.transaction();
  await transaction.run();

  if (crate.items && Array.isArray(crate.items)) {
    for (const item of crate.items) {
      if (item.kind === "CrateItem") {
        await CrateItem.delete(null, null, null, transaction, item);
      }
    }
  }

  await Crate.delete(null, null, null, transaction, crate.entityKey);

  await transaction.commit();
}

function userIsAuthorizedToView(user, crate) {
  return user.entityKey.id === crate.user.id || user.is_superuser === true;
}

function userIsAuthorizedToEdit(user, crate) {
  return user.entityKey.id === crate.user.id;
}

module.exports = {
  addCrate,
  addItem,
  createAndAddCrateItem,
  deleteCrate,
  getCrate,
  getItems,
  listCrates,
  removeItem,
  renameCrate,
  reorderItem,
  userIsAuthorizedToEdit,
  userIsAuthorizedToView,
};
