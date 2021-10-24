const { datastore } = require("../db");
const { Crate, CrateItem, User } = require("../models");
const { CrateService } = require("../services");

const key1 = datastore.key(["Album", 123]);
const key2 = datastore.key(["Track", 123]);
const key3 = datastore.key(["Track", 456]);
const key4 = datastore.key(["Track", 789]);

async function buildCrateWithItems(user) {
  const crate = new Crate({
    user: user.entityKey,
    items: [key1, key2, key3],
    order: [1, 2, 3],
  });
  await crate.save();
  return crate;
}

describe("CrateService", () => {
  let owner, crate;
  let incompleteCrateData, emptyCrateData;

  beforeAll(async () => {
    owner = new User({
      date_joined: new Date(),
      email: "crate@owner.com",
      first_name: "Crate",
      last_name: "Owner",
      password: "abc",
    });

    await owner.save();

    incompleteCrateData = {
      user: owner.entityKey,
      // new crates created in the DJDB do not
      // have empty items or order Array props
    };

    emptyCrateData = {
      user: owner.entityKey,
      items: [],
      order: [],
    };
  });

  describe("Authorization", () => {
    let pretender, superUser;

    beforeAll(async () => {
      pretender = new User({
        date_joined: new Date(),
        email: "not@owner.com",
        first_name: "Not the Crate",
        last_name: "Owner",
        password: "def",
      });
      superUser = new User({
        date_joined: new Date(),
        email: "super@owner.com",
        first_name: "Super",
        last_name: "User",
        password: "ghi",
        is_superuser: true,
      });

      try {
        await pretender.save();
        await superUser.save();

        crate = new Crate({
          user: owner.entityKey,
          items: [],
          order: [],
        });
        await crate.save();
      } catch (err) {
        console.error(err);
      }
    });

    afterAll(async () => {
      await owner.delete();
      await pretender.delete();
      await superUser.delete();
      await crate.delete();
    });

    test("The owner is  authorized to view", () => {
      const authorized = CrateService.userIsAuthorizedToView(owner, crate);
      expect(authorized).toEqual(true);
    });

    test("The owner is authorized to edit", () => {
      const authorized = CrateService.userIsAuthorizedToEdit(owner, crate);
      expect(authorized).toEqual(true);
    });

    test("A superuser is authorized to view", () => {
      const authorized = CrateService.userIsAuthorizedToView(superUser, crate);
      expect(authorized).toEqual(true);
    });

    test("A superuser is not authorized to edit", () => {
      const authorized = CrateService.userIsAuthorizedToEdit(superUser, crate);
      expect(authorized).toEqual(false);
    });

    test("All other users are not authorized to view", () => {
      const authorized = CrateService.userIsAuthorizedToView(pretender, crate);
      expect(authorized).toEqual(false);
    });

    test("All other users are not authorized to edit", () => {
      const authorized = CrateService.userIsAuthorizedToEdit(pretender, crate);
      expect(authorized).toEqual(false);
    });
  });

  describe("Add item", () => {
    afterEach(async () => {
      await Crate.delete(crate.entityKey.id);
    });

    test("Adds successfully to a new and incomplete crate created from DJDB without providing an index", async () => {
      crate = new Crate({
        user: owner.entityKey,
        // new crates created in the DJDB do not
        // have empty items or order Array props
      });
      await crate.save();
      await CrateService.addItem(crate, key1);
      expect(crate.items).toEqual([key1]);
      expect(crate.order).toEqual([1]);
    });

    test("Adds successfully to new and empty crate without providing an index", async () => {
      crate = new Crate({
        user: owner.entityKey,
        items: [],
        order: [],
      });
      await crate.save();
      await CrateService.addItem(crate, key1);
      expect(crate.items).toEqual([key1]);
      expect(crate.order).toEqual([1]);
    });

    test("Adds to the end of a crate with items without providing an index", async () => {
      const crate = await buildCrateWithItems(owner);
      await CrateService.addItem(crate, key4);
      expect(crate.items).toEqual([key1, key2, key3, key4]);
      expect(crate.order).toEqual([1, 2, 3, 4]);
    });

    test("Adds item at the provided index", async () => {
      const crate = await buildCrateWithItems(owner);
      await CrateService.addItem(crate, key4, 1);
      expect(crate.items).toEqual([key1, key4, key2, key3]);
      expect(crate.order).toEqual([1, 2, 3, 4]);
    });

    test("Trying to add something besides a key throws a TypeError", async () => {
      crate = new Crate({
        user: owner.entityKey,
        items: [],
        order: [],
      });
      await crate.save();

      try {
        await CrateService.addItem(crate, {});
      } catch (error) {
        expect(error instanceof TypeError).toEqual(true);
      }
    });

    test("Passing a negative index throws a RangeError", async () => {
      const crate = await buildCrateWithItems(owner);

      try {
        await CrateService.addItem(crate, {}, -1);
      } catch (error) {
        expect(error instanceof TypeError).toEqual(true);
      }
    });

    test("Passing an index greater than the number of items throws a RangeError", async () => {
      crate = new Crate({
        user: owner.entityKey,
        items: [key1, key2, key3],
        order: [1, 2, 3],
      });
      await crate.save();

      try {
        await CrateService.addItem(crate, key4, 10);
      } catch (error) {
        expect(error instanceof RangeError).toEqual(true);
      }
    });
  });

  describe("Add a CrateItem", () => {
    let item;

    afterEach(async () => {
      await Crate.delete(crate.entityKey.id);
      await CrateItem.delete(item.entityKey.id);
    });

    test("Creates a CrateItem and adds it at the provided index", async () => {
      const crate = await buildCrateWithItems(owner);
      item = await CrateService.createAndAddCrateItem(
        crate,
        { artist: "Name" },
        1
      );
      expect(crate.items).toEqual([key1, item.entityKey, key2, key3]);
      expect(crate.order).toEqual([1, 2, 3, 4]);
    });

    test("Creates a CrateItem and adds it at the end without a provided index", async () => {
      const crate = await buildCrateWithItems(owner);
      item = await CrateService.createAndAddCrateItem(crate, {
        artist: "Name",
      });
      expect(crate.items).toEqual([key1, key2, key3, item.entityKey]);
      expect(crate.order).toEqual([1, 2, 3, 4]);
    });
  });

  describe("Remove item", () => {
    afterEach(async () => {
      await Crate.delete(crate.entityKey.id);
    });

    test("Item is removed from ordered crate", async () => {
      crate = new Crate({
        user: owner.entityKey,
        items: [key1, key2, key3],
        order: [1, 2, 3],
      });
      await crate.save();
      await CrateService.removeItem(crate, 1);
      expect(crate.items).toEqual([key1, key3]);
      expect(crate.order).toEqual([1, 2]);
    });

    test("Item is removed from re-ordered crate", async () => {
      crate = new Crate({
        user: owner.entityKey,
        items: [key1, key2, key3, key4],
        order: [1, 3, 4, 2],
      });
      await crate.save();
      await CrateService.removeItem(crate, 1);
      expect(crate.items).toEqual([key1, key2, key4]);
      expect(crate.order).toEqual([1, 3, 2]);
    });

    test("Crate item is also deleted", async () => {
      const item = new CrateItem({});
      await item.save();
      crate = new Crate({
        user: owner.entityKey,
        items: [item.entityKey],
        order: [1],
      });
      await crate.save();
      await CrateService.removeItem(crate, 0);
      expect(crate.items).toEqual([]);
      expect(crate.order).toEqual([]);

      try {
        await CrateItem.get(item.entityKey.id);
      } catch (err) {
        expect(err.code).toEqual("ERR_ENTITY_NOT_FOUND");
      }
    });
  });

  describe("Reorder item", () => {
    afterEach(async () => {
      await Crate.delete(crate.entityKey.id);
    });

    test("Item is moved in ordered crate", async () => {
      crate = new Crate({
        user: owner.entityKey,
        items: [key1, key2, key3],
        order: [1, 2, 3],
      });
      await crate.save();

      await CrateService.reorderItem(crate, 2, 1);
      expect(crate.items).toEqual([key1, key2, key3]);
      expect(crate.order).toEqual([1, 3, 2]);
    });

    test("Item is moved in re-ordered crate", async () => {
      crate = new Crate({
        user: owner.entityKey,
        items: [key1, key2, key3],
        order: [1, 3, 2],
      });
      await crate.save();

      await CrateService.reorderItem(crate, 2, 1);
      expect(crate.items).toEqual([key1, key2, key3]);
      expect(crate.order).toEqual([1, 2, 3]);
    });

    test.each([-1, 3])(
      "Providing an out of range index throws a RangeError",
      async (value) => {
        crate = new Crate({
          user: owner.entityKey,
          items: [key1, key2, key3],
          order: [1, 3, 2],
        });
        await crate.save();

        try {
          await CrateService.reorderItem(crate, value, 1);
        } catch (error) {
          expect(error instanceof RangeError).toEqual(true);
        }
      }
    );

    test.each([-1, 3])(
      "Providing an out of range new index throws a RangeError",
      async (value) => {
        crate = new Crate({
          user: owner.entityKey,
          items: [key1, key2, key3],
          order: [1, 3, 2],
        });
        await crate.save();

        try {
          await CrateService.reorderItem(crate, 1, value);
        } catch (error) {
          expect(error instanceof RangeError).toEqual(true);
        }
      }
    );
  });

  describe("Add crate", () => {
    afterEach(async () => {
      await Crate.delete(crate.entityKey.id);
    });

    test("Crate is added with the provided name", async () => {
      const name = "New crate";
      crate = await CrateService.addCrate(owner.entityKey, name);
      expect(datastore.isKey(crate.entityKey)).toEqual(true);
      expect(crate.name).toEqual(name);
    });
  });

  describe("Rename crate", () => {
    afterEach(async () => {
      await Crate.delete(crate.entityKey.id);
    });

    test("Crate is renamed with the provided name", async () => {
      const name = "New name";
      crate = new Crate({
        user: owner.entityKey,
        name: "Old name",
      });
      await crate.save();
      await CrateService.renameCrate(crate, name);
      expect(crate.name).toEqual(name);
    });
  });

  describe("Delete crate", () => {
    const code = "ERR_ENTITY_NOT_FOUND";

    test("Crate is deleted", async () => {
      crate = new Crate({
        user: owner.entityKey,
        name: "New crate",
      });
      await crate.save();
      await CrateService.deleteCrate(crate);

      try {
        await Crate.get(crate.entityKey.id);
      } catch (error) {
        expect(error.code).toEqual(code);
      }
    });

    test("Crate items are deleted", async () => {
      const item = new CrateItem({});
      await item.save();
      crate = new Crate({
        user: owner.entityKey,
        items: [item.entityKey],
        order: [1],
      });
      await crate.save();
      await CrateService.deleteCrate(crate);

      try {
        await CrateItem.get(item.entityKey.id);
      } catch (error) {
        expect(error.code).toEqual(code);
      }
    });
  });
});
