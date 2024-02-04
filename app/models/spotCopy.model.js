const gstore = require("../db").gstore;
const { Schema } = gstore;

const spotCopySchema = new Schema({
  author: { type: Schema.Types.Key, ref: "User", required: true },
  name: { type: String },
  body: { type: String, required: true },
  spot: { type: Schema.Types.Key, ref: "Spot", required: true },
  start_on: { type: Date },
  expire_on: { type: Date },
  created: { type: Date, default: gstore.defaultValues.NOW },
  updated: { type: Date },
  underwriter: { type: String },
});

function setUpdated() {
  this.updated = new Date();
  return Promise.resolve();
}
spotCopySchema.pre("save", setUpdated);

module.exports = gstore.model("SpotCopy", spotCopySchema);
