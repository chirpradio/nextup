const { Gstore } = require("gstore-node");
const { Datastore } = require("@google-cloud/datastore");

const gstore = new Gstore();
const datastore = new Datastore();
gstore.connect(datastore);
console.log(`datastore connected to: ${process.env.DATASTORE_PROJECT_ID}`);

module.exports = {
  gstore,
  datastore: gstore.ds,
};
