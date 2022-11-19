const { CrateService } = require("../../../services");
const { datastore, parseIndexerTransaction } = require("../../../db");
const { errorMessages } = require("../errors");

module.exports = {
  getCrateAndCheckAuth: async function (req, res, next) {
    try {
      const crate = await CrateService.getCrate(req.params.id);
      const auth =
        req.method !== "GET"
          ? CrateService.userIsAuthorizedToEdit
          : CrateService.userIsAuthorizedToView;
      if (auth.call(this, req.user, crate)) {
        req.crate = crate;
        next();
      } else {
        throw new Error(errorMessages.FORBIDDEN);
      }
    } catch (error) {
      next(error);
    }
  },
  listCrates: async function (req, res, next) {
    try {
      const crates = await CrateService.listCrates(req.user);
      res.json(crates);
    } catch (error) {
      next(error);
    }
  },
  addCrate: async function (req, res, next) {
    try {
      const crate = await CrateService.addCrate(
        req.user.entityKey,
        req.body.name
      );
      res.status(201).json(crate.plain({ showKey: true, virtuals: true }));
    } catch (error) {
      next(error);
    }
  },
  getCrate: async function (req, res) {
    res.json(req.crate.plain({ showKey: true, virtuals: true }));
  },
  renameCrate: async function (req, res, next) {
    try {
      if (req.body.name) {
        await CrateService.renameCrate(req.crate, req.body.name);
      }
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  },
  deleteCrate: async function (req, res, next) {
    try {
      await CrateService.deleteCrate(req.crate);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  },
  getCrateItems: async function (req, res, next) {
    try {
      const crate = req.crate;
      const orderedItems = await CrateService.getItems(crate);
      res.json(orderedItems);
    } catch (error) {
      next(error);
    }
  },
  addItem: async function (req, res, next) {
    try {
      if (req.body.path) {
        const path = parseIndexerTransaction(req.body.path);
        const key = datastore.key(path);
        await CrateService.addItem(req.crate, key, req.body.index);
      } else if (req.body.item) {
        await CrateService.createAndAddCrateItem(
          req.crate,
          req.body.item,
          req.body.index
        );
      } else {
        throw new Error(errorMessages.BAD_REQUEST);
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  removeItem: async function (req, res, next) {
    try {
      await CrateService.removeItem(req.crate, req.params.index);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  },
  reorderItem: async function (req, res, next) {
    try {
      await CrateService.reorderItem(
        req.crate,
        req.params.index,
        req.params.newIndex
      );
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  },
};
