const { CrateService } = require("../../../services");
const { Crate, CrateItem } = require("../../../models");
const { datastore } = require("../../../db");

const queryOptions = {
  wrapNumbers: {
    integerTypeCastFunction: datastore.int,
    properties: ["album_id"],
  },
};

function userOwnsCrate(user, crate) {
  return user.entityKey.id === crate.user.id;
}

function replaceArtistKeysWithEntities(entities, artists, prop) {
  for (const entity of entities) {
    if (entity[prop]) {
      const keyString = JSON.stringify(entity[prop]);
      const artist = artists.find(
        (artist) => JSON.stringify(artist[datastore.KEY]) === keyString
      );
      artist.key = artist[datastore.KEY];
      entity[prop] = artist;
    }
  }
}

async function populateEntities(entities) {
  const tracks = entities.filter(
    (item) => item[datastore.KEY].kind === "Track"
  );
  const trackAlbumKeys = tracks.map((track) => track.album);
  const [trackAlbums] = trackAlbumKeys.length
    ? await datastore.get(trackAlbumKeys, queryOptions)
    : [[]];

  const albums = entities.filter(
    (item) => item[datastore.KEY].kind === "Album"
  );
  const albumArtistKeys = albums.map((album) => album.album_artist);
  const trackAlbumArtistKeys = trackAlbums.map((album) => album.album_artist);
  const trackArtistKeys = tracks.map((track) => track.track_artist);
  const allArtistKeys = albumArtistKeys
    .concat(trackAlbumArtistKeys, trackArtistKeys)
    .filter(Boolean);
  const [artists] = allArtistKeys.length
    ? await datastore.get(allArtistKeys)
    : [[]];

  replaceArtistKeysWithEntities(trackAlbums, artists, "album_artist");
  replaceArtistKeysWithEntities(albums, artists, "album_artist");
  replaceArtistKeysWithEntities(tracks, artists, "track_artist");
  for (const track of tracks) {
    const keyString = JSON.stringify(track.album);
    track.album = trackAlbums.find(
      (album) => JSON.stringify(album[datastore.KEY]) === keyString
    );
  }
}

function normalizeItem(item) {
  let album, artist, track, notes;

  switch (item[datastore.KEY].kind) {
    case "Track":
      track = item;
      album = item.album;
      album.key = album[datastore.KEY];
      artist = item.track_artist ? item.track_artist : item.album.album_artist;
      break;
    case "Album":
      album = item;
      album.key = album[datastore.KEY];
      artist = item.album_artist;
      break;
    case "Artist":
      artist = item;
      artist.key = artist[datastore.KEY];
      break;
    case "CrateItem":
      track = {
        title: item.track,
      };
      album = {
        title: item.album,
        label: item.label,
      };
      artist = {
        name: item.artist,
      };
      notes = item.notes;
  }

  return {
    album,
    artist,
    track,
    notes,
  };
}

async function deleteHandler(req, res) {
  try {
    const crate = await Crate.get(parseInt(req.params.crate_id, 10));
    if (!userOwnsCrate(req.user, crate)) {
      res.status(401).send("You're not authorized to delete this crate");
      return;
    }

    if (crate.items && crate.items.length) {
      const crateItemIds = crate.items
        .filter((item) => item.kind === "CrateItem")
        .map((item) => parseInt(item.id, 10));
      await CrateItem.delete(crateItemIds);
    }

    await Crate.delete(null, null, null, null, crate.entityKey);
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.send("Could not delete crate");
  }
}

async function deleteItemsHandler(req, res) {
  try {
    const crate = await Crate.get(parseInt(req.params.crate_id, 10));
    if (!userOwnsCrate(req.user, crate)) {
      res.status(401).send("You're not authorized to update this crate");
      return;
    }

    const index = parseInt(req.params.index, 10);
    const itemIndex = crate.order.splice(index, 1)[0];
    const item = crate.items.splice(itemIndex - 1, 1)[0];
    crate.order = crate.order.map((i) => (i > itemIndex ? i - 1 : i));
    await crate.save();

    if (item.kind === "CrateItem") {
      await CrateItem.delete(null, null, null, null, item);
    }

    if (req.query.redirect) {
      res.redirect("back");
    } else {
      res.status(200).send();
    }
  } catch (err) {
    console.error(err);
    res.send("Could not delete items");
  }
}

async function getHandler(req, res) {
  try {
    const crate = await Crate.get(parseInt(req.params.crate_id, 10));
    if (!userOwnsCrate(req.user, crate)) {
      // res.status(401).send("You're not authorized to view this crate");
      // return;
    }

    const orderedItems = [];
    if (crate.items && crate.items.length) {
      // this is the simplest way to get an Array of keys of multiple kinds
      const [entities] = await datastore.get(crate.items, queryOptions);
      // but since it doesn't use gstore-node we can't easily populate albums and artists
      await populateEntities(entities);

      for (const index of crate.order) {
        const keyString = JSON.stringify(crate.items[index - 1]);
        const item = entities.find(
          (entity) => JSON.stringify(entity[datastore.KEY]) === keyString
        );
        orderedItems.push(normalizeItem(item));
      }
    }

    res.render("music/crate/crateItems", {
      crate,
      orderedItems,
      title: `${crate.getCrateName()} - CHIRP NextUp`,
    });
  } catch (err) {
    console.error(err);
    res.send("Crate could not be displayed");
  }
}

async function indexHandler(req, res) {
  try {
    const crates = await CrateService.listCratesForUser(req.user);

    res.render("music/crate/crateIndex", {
      crates,
      title: "Crates - CHIRP NextUp",
    });
  } catch (err) {
    console.error(err);
    res.send("Crates could not be returned");
  }
}

async function patchHandler(req, res) {
  try {
    const crate = await Crate.get(parseInt(req.params.crate_id, 10));
    if (!userOwnsCrate(req.user, crate)) {
      res.status(401).send("You're not authorized to update this crate");
      return;
    }

    for (const key in req.body) {
      switch (key) {
        case "order":
          crate.order = req.body.order.map((x) => parseInt(x, 10));
          break;
        default:
          crate[key] = req.body[key];
      }
    }
    await crate.save();
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.send("Crate could not be patched");
  }
}

async function postHandler(req, res) {
  try {
    if (!req.body.name) {
      res.status(400).send("name is a required field");
      return;
    }

    const crate = new Crate({ name: req.body.name, user: req.user.entityKey });
    await crate.save();
    res.redirect(`/music/crate/${crate.entityKey.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Crate could not be created");
  }
}

async function postItemsHandler(req, res) {
  try {
    const crate = await Crate.get(parseInt(req.params.crate_id, 10));
    if (!userOwnsCrate(req.user, crate)) {
      res.status(401).send("You're not authorized to update this crate");
      return;
    }

    let key;
    if (req.body.key) {
      key = datastore.key(JSON.parse(req.body.key));
    } else {
      const item = new CrateItem(req.body);
      await item.save();
      key = item.entityKey;
    }

    if (crate.items) {
      crate.items.push(key);
    } else {
      crate.items = [key];
    }

    if (crate.order) {
      let max = crate.order.reduce((a, b) => Math.max(a, b));
      max++;
      crate.order.push(max);
    } else {
      crate.order = [1];
    }

    await crate.save();

    if (req.body.flash) {
      req.flash("successMessages", [
        `${req.body.name} added to <a href="/music/crate/${
          crate.entityKey.id
        }">${crate.getCrateName()}</a>`,
      ]);
    }
    res.redirect("back");
  } catch (err) {
    console.error(err);
    res.send("Could not add to crate");
  }
}

module.exports = {
  deleteHandler,
  deleteItemsHandler,
  getHandler,
  indexHandler,
  patchHandler,
  postHandler,
  postItemsHandler,
};
