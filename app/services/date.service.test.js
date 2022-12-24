const { DateService } = require("../services");

describe("DateService", () => {
  describe("fullChicagoISOFromISODate", () => {
    test.each([
      ["2021-11-17", "start", "2021-11-17T00:00:00"],
      ["2021-11-17", "end", "2021-11-17T23:59:59"],
      ["2021-11-17", undefined, "2021-11-17T00:00:00"],
    ])(
      "%s adjusted to %s should return string matching %s",
      async (value, adjustTo, output) => {
        expect(DateService.fullChicagoISOFromISODate(value, adjustTo)).toEqual(
          expect.stringMatching(output)
        );
      }
    );

    test("Should throw an error when invalid", async () => {
      expect.assertions(1);

      try {
        DateService.fullChicagoISOFromISODate("11-17-2021");
      } catch (err) {
        expect(err.message).toEqual(
          expect.stringMatching("can't be parsed as ISO 8601")
        );
      }
    });
  });
});
