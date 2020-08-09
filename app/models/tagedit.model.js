const gstore = require("../db").gstore;
const { Schema } = gstore;

const tagEditSchema = new Schema({
  added: { type: Array },
  removed: { type: Array },
  author: { type: Schema.Types.Key, ref: "User" },
  subject: { type: Schema.Types.Key },
  timestamp: { type: Date },
});

module.exports = gstore.model("TagEdit", tagEditSchema);
