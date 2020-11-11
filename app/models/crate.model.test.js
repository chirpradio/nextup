const { datastore } = require("../db");
const Crate = require("./crate.model");

const userKey = datastore.key(["User", 123]);
let crate;

describe("Crate model", () => {
  afterEach(async () => {
    if (crate.entityKey.id) {
      await Crate.delete(parseInt(crate.entityKey.id, 10));
    }
  });

  test.each(["user"])(
    "The crate should require a %s property",
    async (property) => {
      expect.assertions(1);
      const error = {
        code: "ERR_PROP_REQUIRED",
        message: `Property "${property}" is required but no value has been provided`,
        ref: undefined,
      };

      try {
        crate = new Crate({});
        await crate.save();
      } catch (err) {
        expect(err.errors).toEqual(expect.arrayContaining([error]));
      }
    }
  );

  test("The user property should be a User key", async () => {
    expect.assertions(1);
    const error = {
      code: "ERR_PROP_TYPE",
      message: 'Property "user" must be a entityKey',
      ref: "key.base",
    };

    try {
      crate = new Crate({ user: { name: "DJ" } });
      await crate.save();
    } catch (err) {
      expect(err.errors).toEqual(expect.arrayContaining([error]));
    }
  });

  test("The order property should reject values that are not integers", async () => {
    expect.assertions(1);

    const badValue = ["1"];
    const error = {
      code: "ERR_PROP_VALUE",
      message: `"${badValue}" is not a valid value for property "order"`,
      ref: undefined,
    };

    try {
      crate = new Crate({
        user: userKey,
        order: badValue,
      });
      await crate.save();
    } catch (err) {
      expect(err.errors).toEqual(expect.arrayContaining([error]));
    }
  });

  test("The items property should reject values that are not keys", async () => {
    expect.assertions(1);

    const badValue = ["123"];
    const error = {
      code: "ERR_PROP_VALUE",
      message: `"${badValue}" is not a valid value for property "items"`,
      ref: undefined,
    };

    try {
      crate = new Crate({
        user: userKey,
        items: badValue,
      });
      await crate.save();
    } catch (err) {
      expect(err.errors).toEqual(expect.arrayContaining([error]));
    }
  });
});
