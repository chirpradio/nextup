const { Gstore } = require("gstore-node");
const { Datastore } = require("@google-cloud/datastore");

const gstore = new Gstore();
const datastore = new Datastore();
gstore.connect(datastore);
console.log(`datastore connected to: ${process.env.DATASTORE_PROJECT_ID}`);

/*
  gstore-node sometimes returns an entity's key as the property "__key",
  and sometimes as a Symbol that can be accessed with datastore.KEY. The
  Symbol version does not serialize to JSON. This function renames the Symbol 
  property to a "__key" property.
*/
function renameKey(obj) {
  let prop;
  
  if (obj.hasOwnProperty(datastore.KEY)) {
    prop = datastore.KEY;
    obj.__key = obj[prop];
    delete obj[prop];
  }
}

module.exports = {
  gstore,
  datastore: gstore.ds,
  renameKey,
};
