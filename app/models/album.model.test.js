const db = require("../db");
const Album = require("./album.model");

const albumData = {
  title: "a",
  import_timestamp: new Date(),
  album_id: 1000,
  num_tracks: 10,
};
let album;

describe("Album model", () => {
  afterEach(async () => {
    if (album.entityKey.id) {
      await Album.delete(parseInt(album.entityKey.id, 10));
    }
    album = null;
  });

  test.each(["title", "import_timestamp", "album_id", "num_tracks"])(
    "The album should require a %s property",
    async (property) => {
      expect.assertions(1);
      const error = {
        code: "ERR_PROP_REQUIRED",
        message: `Property "${property}" is required but no value has been provided`,
        ref: undefined,
      };

      try {
        album = new Album({});
        await album.save();
      } catch (err) {
        expect(err.errors).toEqual(expect.arrayContaining([error]));
      }
    }
  );

  test.each([
    ["pronunciation", "ayyyy"],
    ["label", "Label"],
    ["year", 2020],
    ["disc_number", 1],
    ["num_comments", 1],
    ["num_reviews", 1],
    ["revoked", true],
    ["is_reviewed", true],
    ["is_compilation", true],
    ["lastfm_sm_image_url", "https://some.url"],
    ["lastfm_med_image_url", "https://some.url"],
    ["lastfm_lg_image_url", "https://some.url"],
    ["lastfm_xl_image_url", "https://some.url"],
    ["lastfm_retrieval_time", new Date()],
  ])(
    "The album should accept an optional %s property",
    async (property, value) => {
      const entityData = { ...albumData };
      entityData[property] = value;
      album = new Album(entityData);
      await album.save();
      expect(album[property]).toBe(value);
    }
  );

  test.each([
    ["is_compilation", false],
    ["is_reviewed", false],
    ["revoked", false],
    ["num_reviews", 0],
    ["num_comments", 0],
  ])("The default value of %s should be %p", async (property, value) => {
    album = new Album(albumData);
    await album.save();
    expect(album[property]).toBe(value);
  });

  describe("album_id", () => {
    const largeAlbumIdData = {
      title: "a",
      import_timestamp: new Date(),
      album_id: 9007199254740992,
      num_tracks: 10,
    };

    test("Should wrap album_id values in a Datastore Integer object to accept values larger than Number.MAX_SAFE_INTEGER", async () => {
      album = new Album(largeAlbumIdData);
      await album.save();
      const isInt = db.gstore.ds.isInt(album.album_id);
      expect(isInt).toBe(true);
    })
  });
});

describe("Album and artist integration", () => {
  const Artist = require("./artist.model");
  let artist;

  beforeEach(async () => {
    artist = new Artist({ name: "Prince" });
    await artist.save();
  });

  afterEach(async () => {
    if (artist.entityKey.id) {
      await Artist.delete(parseInt(artist.entityKey.id, 10));
    }

    if (album.entityKey.id) {
      await Album.delete(parseInt(album.entityKey.id, 10));
    }
  });

  test("The album should accept an optional album_artist property", async () => {
    const entityData = { ...albumData };
    entityData.album_artist = artist.entityKey;
    album = new Album(entityData);
    await album.save();
    expect(album.album_artist).toBe(artist.entityKey);
  });
});
