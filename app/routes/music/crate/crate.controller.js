const { AlbumService, CrateService } = require("../../../services");
const { Crate } = require("../../../models");
const { datastore } = require("../../../db");

const queryOptions = {
  wrapNumbers: {
    integerTypeCastFunction: datastore.int,
    properties: ["album_id"],
  }
};

function replaceArtistKeysWithEntities(entities, artists, prop) {
  for(const entity of entities) {
    if(entity[prop]) {
      const keyString = JSON.stringify(entity[prop]);
      entity[prop] = artists.find(artist => JSON.stringify(artist[datastore.KEY]) === keyString);
    }    
  }
}

// tests: all artists, all crateItems, all tracks
async function populateEntities(entities) {
  const tracks = entities.filter(item => item[datastore.KEY].kind === 'Track');
  const trackAlbumKeys = tracks.map(track => track.album);
  const [trackAlbums] = trackAlbumKeys.length ? await datastore.get(trackAlbumKeys, queryOptions) : [[]];

  const albums = entities.filter(item => item[datastore.KEY].kind === 'Album');
  const albumArtistKeys = albums.map(album => album.album_artist);
  const trackAlbumArtistKeys = trackAlbums.map(album => album.album_artist);
  const trackArtistKeys = tracks.map(track => track.track_artist);
  const allArtistKeys = albumArtistKeys.concat(trackAlbumArtistKeys, trackArtistKeys).filter(Boolean);
  const [artists] = allArtistKeys.length ? await datastore.get(allArtistKeys) : [[]];
  
  replaceArtistKeysWithEntities(trackAlbums, artists, 'album_artist');
  replaceArtistKeysWithEntities(albums, artists, 'album_artist');
  replaceArtistKeysWithEntities(tracks, artists, 'track_artist');
  for(const track of tracks) {
    const keyString = JSON.stringify(track.album);
    track.album = trackAlbums.find(album => JSON.stringify(album[datastore.KEY]) === keyString);
  }
}

function normalizeItem(item) {
  let album, artist, track, notes;

  switch(item[datastore.KEY].kind) {
    case "Track":
      track = item;
      album = item.album;
      artist = item.track_artist ? item.track_artist : item.album.album_artist;
      break;
    case "Album":
      album = item;
      artist = item.album_artist;
      break;
    case "Artist":
      artist = item;
      break;
    case "CrateItem":
      track = {
        title: item.track
      };
      album = {
        title: item.album,
        label: item.label,
      };
      artist = {
        name: item.artist
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

async function getHandler(req, res) {
  try {
    const crate = await Crate.get(parseInt(req.params.crate_id, 10));
    if(req.user.entityKey.id !== crate.user.id) {
        res.status(401).send("You're not authorized to view this crate");
        return;
    }

    const orderedItems = [];
    if(crate.items && crate.items.length) {
      // this is the simplest way to get an Array of keys of multiple kinds
      const [entities] = await datastore.get(crate.items, queryOptions);  
      // but since it doesn't use gstore-node we can't easily populate albums and artists 
      await populateEntities(entities);

      for(const index of crate.order) {
        const keyString = JSON.stringify(crate.items[index - 1]);
        const item = entities.find(entity => JSON.stringify(entity[datastore.KEY]) === keyString);
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

async function postHandler(req, res) {
  try {
    const crate = await Crate.get(parseInt(req.params.crate_id, 10));
    const key = datastore.key(JSON.parse(req.body.key));
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

    req.flash("successMessages", [
      `${
        req.body.name
      } added to <a href="https://chirpradio-hrd.appspot.com/djdb/crate">${crate.getCrateName()}</a>`,
    ]);
    res.redirect("back");
  } catch (err) {
    console.error(err);
    res.send("Could not add to crate");
  }
}

module.exports = {
  getHandler,
  indexHandler,
  postHandler,
};
