const { TrafficLogService } = require("../services");

describe("TrafficLogService", () => {
  describe("copyIsRunning", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const pastDateString = pastDate.toISOString();
    const futureDateString = futureDate.toISOString();

    test.each([
      [
        "empty start",
        "empty expiration",
        true,
        { start_on: null, expire_on: null },
      ],
      [
        "future start",
        "empty expiration",
        false,
        { start_on: futureDateString, expire_on: null },
      ],
      [
        "past start",
        "empty expiration",
        true,
        { start_on: pastDateString, expire_on: null },
      ],
      [
        "empty start",
        "past expiration",
        false,
        { start_on: null, expire_on: pastDateString },
      ],
      [
        "empty start",
        "future expiration",
        true,
        { start_on: null, expire_on: futureDateString },
      ],
      [
        "past start",
        "future expiration",
        true,
        { start_on: pastDateString, expire_on: futureDateString },
      ],
      [
        "future start",
        "past expiration",
        false,
        { start_on: futureDateString, expire_on: pastDateString },
      ],
    ])("%s and %s should return %p", async (s1, s2, validity, copy) => {
      expect(TrafficLogService.copyIsRunning(copy)).toBe(validity);
    });
  });

  describe("createDayAndHourPairs", () => {
    test.each([
      [1, 12, 1, [[1, 12]]],
      [
        1,
        12,
        2,
        [
          [1, 12],
          [1, 13],
        ],
      ],
      [
        1,
        12,
        3,
        [
          [1, 12],
          [1, 13],
          [1, 14],
        ],
      ],
      [
        1,
        23,
        3,
        [
          [1, 23],
          [2, 0],
          [2, 1],
        ],
      ],
      [
        7,
        23,
        3,
        [
          [7, 23],
          [1, 0],
          [1, 1],
        ],
      ],
    ])("%i, %i, %i should return %o", async (dow, hour, length, output) => {
      expect(
        TrafficLogService.createDayAndHourPairs(dow, hour, length)
      ).toEqual(output);
    });
  });
});
