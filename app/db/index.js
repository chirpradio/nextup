const { Gstore } = require("gstore-node");
const { Datastore } = require("@google-cloud/datastore");

const gstore = new Gstore();
const datastore = new Datastore();
gstore.connect(datastore);
console.log(`datastore connected to: ${process.env.DATASTORE_PROJECT_ID}`);

/*
  There is only one Playlist entity in the Datastore, 
  but the id differs between environments.
*/
let PLAYLIST_KEY;
async function getPlaylistKey() {
  if (!PLAYLIST_KEY) {
    const result = await datastore.createQuery("Playlist").limit(1).run();
    PLAYLIST_KEY = result[0][0][datastore.KEY];
  }
  return PLAYLIST_KEY;
}

/*
  Most albums and artists are imported with an "IndexerTransaction" ancestor
  that must be included in queries. This function ensures that the id value
  for that part of the path is parsed into an integer so the query will run
  successfully.
*/
function parseIndexerTransaction(path) {
  if (path[0] === "IndexerTransaction") {
    return [path[0], parseInt(path[1], 10), path[2], path[3]];
  } else if (typeof path[1] === "string" && path[1].match(/^\d*$/)) {
    return [path[0], parseInt(path[1], 10)];
  } else {
    return path;
  }
}

/*
  gstore-node sometimes returns an entity's key as the property "__key",
  and sometimes as a Symbol that can be accessed with datastore.KEY. The
  Symbol version does not serialize to JSON. By default this function renames 
  the Symbol property to a "__key" property.
*/
function renameKey(obj) {
  const prop = datastore.KEY;
  if (obj && Object.prototype.hasOwnProperty.call(obj, prop)) {
    obj.__key = obj[prop];
    delete obj[prop];
  }
  return obj;
}

module.exports = {
  gstore,
  datastore: gstore.ds,
  getPlaylistKey,
  parseIndexerTransaction,
  renameKey,
};
