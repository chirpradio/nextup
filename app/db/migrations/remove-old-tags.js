const { Album } = require("../../models");
const { datastore } = require("../../db");

const oldTags = [
  "clean",
  "EP",
  "Disc 1",
  "Disc 2",
  "Disc 3",
  "Disc 4",
  "Disc 5",
];

async function up() {
  for (const tag of oldTags) {
    const query = Album.query()
      .filter("revoked", false)
      .filter("current_tags", tag);
    const { entities: albums } = await query.run({
      format: "ENTITY",
      wrapNumbers: {
        integerTypeCastFunction: datastore.int,
        properties: ["album_id"],
      },
    });
    
    for (const album of albums) {
      console.log(album.album_id.value, album.title);
      const index = album.current_tags.findIndex((item) => item === tag);
      album.current_tags.splice(index, 1);      
      await album.save();
    }
  }
}

up();
