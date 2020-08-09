require("../db");
const Artist = require("./artist.model");

describe("Artist model", () => {
  let artist;

  afterEach(async () => {
    if (artist.entityKey.id) {
      await Artist.delete(parseInt(artist.entityKey.id, 10));
    }
  });

  test("The artist should require a name", async () => {
    const nameError = {
      code: "ERR_PROP_REQUIRED",
      message: 'Property "name" is required but no value has been provided',
      ref: undefined,
    };

    expect.assertions(1);

    try {
      artist = new Artist({});
      await artist.save();
    } catch (err) {
      expect(err.errors).toEqual(expect.arrayContaining([nameError]));
    }
  });

  test('The current_tags property should reject values that are not "local_classic", "local_current", "heavy_rotation", or "light_rotation"', async () => {
    expect.assertions(1);

    const badValue = "Local H";
    const error = {
      code: "ERR_PROP_VALUE",
      message: `"${badValue}" is not a valid value for property "current_tags"`,
      ref: undefined,
    };

    try {
      artist = new Artist({
        current_tags: [badValue],
      });
      await artist.save();
    } catch (err) {
      expect(err.errors).toEqual(expect.arrayContaining([error]));
    }
  });
});
