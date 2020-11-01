const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const argv = require("yargs").argv;
const LIMIT = argv.limit || 1;
const INDEX = argv.index;

const { datastore } = require("../app/db");
const { Artist, Album, Document, Track } = require("../app/models");
const { SearchService } = require("../app/services");

let artistMap, albumMap;

async function getArtists(limit, nextPageCursor) {
  let query = Artist.query().filter("revoked", false).limit(limit);

  if (nextPageCursor) {
    query = query.start(nextPageCursor);
  }

  const options = {
    format: "JSON",
    showKey: true,
  };

  return await query.run(options);
}

async function buildArtistMap() {
  console.log('Getting artists...');
  const { entities: artists } = await getArtists(20000);
  console.log(`Retrieved ${artists.length} artists`);
  artistMap = new Map(); 
  artists.forEach(artist => artistMap.set(JSON.stringify(artist.__key), artist));   
}

async function getAlbums(limit, nextPageCursor) {
  let query = Album.query().filter("revoked", false).limit(limit);
  if (nextPageCursor) {
    query = query.start(nextPageCursor);
  }

  if(typeof artistMap === 'undefined') {
    await buildArtistMap();
  }

  const albums = await query.run({
    showKey: true,
    wrapNumbers: {
      integerTypeCastFunction: datastore.int,
      properties: ["album_id"],
    },
  });
  
  albums.entities.forEach(album => {
    if (datastore.isKey(album.album_artist)) {
      album.album_artist = artistMap.get(JSON.stringify(album.album_artist));
    }
  })

  return albums;
}

async function buildAlbumMap() {
  console.log('Getting albums...');
  const { entities: albums } = await getAlbums(20000);
  console.log(`Retrieved ${albums.length} albums`);
  
  albumMap = new Map();
  albums.forEach(album => {
    if (datastore.isKey(album.album_artist)) {
      album.album_artist = artistMap.get(JSON.stringify(album.album_artist));
    }
    albumMap.set(JSON.stringify(album.__key), album);
  });
}

async function buildMaps() {
  await buildArtistMap();
  await buildAlbumMap();
}

async function getDocuments(limit, nextPageCursor) {
  let query = Document.query()
    .filter("revoked", false)
    .filter("is_hidden", false)
    .limit(limit);
  
  if (nextPageCursor) {
    query = query.start(nextPageCursor);
  }

  const response = await query.run({ 
    format: "JSON",   
    showKey: true,
  });
  console.log(`Retrieved ${response.entities.length} documents`);
  
  if(typeof artistMap === 'undefined') {
    await buildMaps();  
  }
  console.log('Populating documents...');
  const documents = response.entities.filter(document => albumMap.has(JSON.stringify(document.subject)));
  for (const document of documents) {
    const album = albumMap.get(JSON.stringify(document.subject));
    document.subject = album;
  }

  return {
    entities: documents,
    nextPageCursor: response.nextPageCursor
  };
}

async function getTracks(limit, nextPageCursor) {
  let query = Track.query()
    .filter("revoked", false)    
    .limit(limit);
  
  if (nextPageCursor) {
    query = query.start(nextPageCursor);
  }

  const options = { 
    format: "JSON",   
    showKey: true,
  }

  const response = await query.run(options);
  console.log(`Retrieved ${response.entities.length} tracks`);
  
  if(typeof artistMap === 'undefined') {
    await buildMaps();  
  }
  console.log('Populating tracks...');
  for (const track of response.entities) {
    const album = albumMap.get(JSON.stringify(track.album));
    track.album = album;

    if (datastore.isKey(track.track_artist)) {
      track.track_artist = artistMap.get(JSON.stringify(track.track_artist));
    }
  }

  return response;
}

function buildMultilineJson(index, entities, idFunction) {
  const lines = [];
  entities.forEach((entity) => {
    lines.push(
      `{ "index" : { "_index" : "${index}", "_id" : "${idFunction(entity)}" } }`
    );
    lines.push(JSON.stringify(entity));
  });  
  return lines.join("\n") + "\n";
}

function logErrors(bulkResponse) {
  const erroredDocuments = []
  // The items array has the same order of the dataset we just indexed.
  // The presence of the `error` key indicates that the operation
  // that we did for the document has failed.
  bulkResponse.items.forEach((action, i) => {
    const operation = Object.keys(action)[0]
    if (action[operation].error) {
      erroredDocuments.push({
        // If the status is 429 it means that you can retry the document,
        // otherwise it's very likely a mapping error, and you should
        // fix the document before to try it again.
        status: action[operation].status,
        error: action[operation].error,
        operation: body[i * 2],
        document: body[i * 2 + 1]
      });
    }
  })
  console.log(erroredDocuments);
}

function getFunctions() {
  switch(INDEX) {
    case 'artist':
      return {
        getFunction: getArtists,
        idFunction: SearchService.getArtistId,
      }
    case 'album':
      return {
        getFunction: getAlbums,
        idFunction: SearchService.getAlbumId,
      }      
    case 'document':
      return {
        getFunction: getDocuments,
        idFunction: document => SearchService.getDocumentId(document, SearchService.getAlbumId(document.subject)),
      }
    case 'track':
      return {
        getFunction: getTracks,
        idFunction: track => SearchService.getTrackId(track, track.album),
      } 
    default:
      console.error(`Unknown index: ${INDEX}`);
      process.exit();     
  }
}

async function bulkUpdate() {
  let i = 0;
  let nextPageCursor;

  const { getFunction, idFunction } = getFunctions();

  while (i === 0 || typeof nextPageCursor !== "undefined") {
    i++;

    try {
      const response = await getFunction(LIMIT, nextPageCursor);
      nextPageCursor = response.nextPageCursor;     
      const body = buildMultilineJson(INDEX, response.entities, idFunction);
      console.log('Sending bulk update...');    
      const bulkResponse = await SearchService.bulk(body);

      if (bulkResponse.errors) {
        logErrors(bulkResponse);
      }

      const count = await SearchService.count(INDEX);
      console.log(count);
    } catch (err) {
      console.error(err);
    }
  }
}

bulkUpdate().catch(err => console.error(err));