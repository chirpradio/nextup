const { Gstore } = require("gstore-node");
const { Datastore } = require("@google-cloud/datastore");

const gstore = new Gstore();
const datastore = new Datastore();
gstore.connect(datastore);
console.log(`datastore connected to: ${process.env.DATASTORE_PROJECT_ID}`);


function parseIndexerTransaction(path) {
  if(path[0] === "IndexerTransaction") {
    return [path[0], parseInt(path[1], 10), path[2], path[3]];
  } else {
    return path;
  }
}

/*
  gstore-node sometimes returns an entity's key as the property "__key",
  and sometimes as a Symbol that can be accessed with datastore.KEY. The
  Symbol version does not serialize to JSON. This function renames the Symbol 
  property to a "__key" property.
*/
function renameKey(obj) {
  let prop;
  
  if (obj && obj.hasOwnProperty(datastore.KEY)) {
    prop = datastore.KEY;
    obj.__key = obj[prop];
    delete obj[prop];
  }
}

module.exports = {
  gstore,
  datastore: gstore.ds,
  parseIndexerTransaction,
  renameKey,
};
