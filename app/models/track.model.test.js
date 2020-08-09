require("../db");
const Track = require("./track.model");

const trackData = {
  title: "a",
  track_num: 1,
  sampling_rate_hz: 44100,
  bit_rate_kbps: 320,
  duration_ms: 180000,
  channels: "stereo",
};
let track;

describe("Track model", () => {
  afterEach(async () => {
    if (track.entityKey.id) {
      await Track.delete(parseInt(track.entityKey.id, 10));
    }
  });

  test.each([
    "title",
    "track_num",
    "sampling_rate_hz",
    "bit_rate_kbps",
    "duration_ms",
    "channels",
  ])("The track should require a %s property", async (property) => {
    expect.assertions(1);
    const error = {
      code: "ERR_PROP_REQUIRED",
      message: `Property "${property}" is required but no value has been provided`,
      ref: undefined,
    };

    try {
      track = new Track({});
      await track.save();
    } catch (err) {
      expect(err.errors).toEqual(expect.arrayContaining([error]));
    }
  });

  test.each([
    ["track_num", 2.5],
    ["sampling_rate_hz", 44100.5],
    ["bit_rate_kbps", 320.5],
    ["duration_ms", 1000.5],
  ])("The %s property should be an integer", async (property, value) => {
    expect.assertions(1);
    const error = {
      code: "ERR_PROP_TYPE",
      message: `Property "${property}" must be a number`,
      ref: "int.base",
    };
    const entityData = {};
    entityData[property] = value;

    try {
      track = new Track(entityData);
      await track.save();
    } catch (err) {
      expect(err.errors).toEqual(expect.arrayContaining([error]));
    }
  });

  test.each(["mono", "joint_stereo", "dual_mono", "stereo"])(
    'The channels property should accept "%s"',
    async (value) => {
      const entityData = { ...trackData };
      entityData.channels = value;

      track = new Track(entityData);
      await track.save();
      expect(track.channels).toBe(value);
    }
  );

  test('The channels property should reject values that are not "stereo", "joint_stereo", "dual_mono", or "mono"', async () => {
    expect.assertions(1);

    const badValue = "5.1 surround";
    const error = {
      code: "ERR_PROP_VALUE",
      message: `"${badValue}" is not a valid value for property "channels"`,
      ref: undefined,
    };

    try {
      track = new Track({
        channels: badValue,
      });
      await track.save();
    } catch (err) {
      expect(err.errors).toEqual(expect.arrayContaining([error]));
    }
  });

  test.each([
    ["pronunciation", "ayyyy"],
    ["revoked", true],
    ["is_reviewed", true],
  ])(
    "The track should accept an optional %s property",
    async (property, value) => {
      const entityData = { ...trackData };
      entityData[property] = value;

      try {
        track = new Track(entityData);
        await track.save();
      } catch (err) {
        console.error(err);
      }

      expect(track[property]).toBe(value);
    }
  );

  test.each(["revoked", "is_reviewed"])(
    "The default value of %s should be false",
    async (property) => {
      try {
        track = new Track(trackData);
        await track.save();
      } catch (err) {
        console.error(err);
      }

      expect(track[property]).toBe(false);
    }
  );

  test.each([[["explicit"]], [["recommended"]], [["explicit", "recommended"]]])(
    "The track should accept an optional current_tags property with a value of %p",
    async (value) => {
      track = new Track({ current_tags: value, ...trackData });
      await track.save();
      expect(track.current_tags).toEqual(value);
    }
  );

  test('The current_tags property should reject values that are not "explicit" or "recommended"', async () => {
    expect.assertions(1);

    const badValue = "explosive";
    const error = {
      code: "ERR_PROP_VALUE",
      message: `"${badValue}" is not a valid value for property "current_tags"`,
      ref: undefined,
    };

    try {
      track = new Track({
        current_tags: [badValue],
      });
      await track.save();
    } catch (err) {
      expect(err.errors).toEqual(expect.arrayContaining([error]));
    }
  });
});

describe("Track and artist integration", () => {
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

    if (track.entityKey.id) {
      await Track.delete(parseInt(track.entityKey.id, 10));
    }
  });

  test("The track should accept an optional track_artist property", async () => {
    const entityData = { ...trackData };
    entityData.track_artist = artist.entityKey;
    track = new Track(entityData);
    await track.save();
    expect(track.track_artist).toBe(artist.entityKey);
  });
});

// album
