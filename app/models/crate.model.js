const gstore = require("../db").gstore;
const { Schema } = gstore;

const crateSchema = new Schema({
  name: { type: String },
  user: { type: Schema.Types.Key, ref: "User", required: true },
  is_default: { type: Boolean },
  /*
    items is an array of keys for Track, Album, Artist, or CrateItem entities.
  */
  items: { type: Array },
  /*
    order values correspond to the one-based index of keys in the items array.

    Let's say we have a crate with the following items array: [Key1, Key2, Key3].

    An order of [1, 2, 3] indicates the user wants to see the items in this order:
    - Key1
    - Key2
    - Key3

    An order of [1, 3, 2] indicates the user wants to see the items in this order:
    - Key1
    - Key3
    - Key2
  */
  order: { type: Array },
  /*
    Current DJDB behavior is to match the sequence of order and items when a crate is loaded.
    The order property will only be out of sequence right after a user drags and drops an item
    but hasn't reloaded the page yet.
  */
});

crateSchema.virtual("totalItems").get(function totalItems() {
  return this.items && Array.isArray(this.items) ? this.items.length : 0;
});

module.exports = gstore.model("Crate", crateSchema);
