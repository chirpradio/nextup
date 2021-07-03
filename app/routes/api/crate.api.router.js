const router = require("express").Router();
const { body, param, query } = require("express-validator");
const { CrateService } = require("../../services");
const { datastore, parseIndexerTransaction } = require("../../db");
const { checkErrors, errorMessages } = require("./errors");

const validateLimit = query("limit")
  .optional()
  .isInt({ min: 1, max: 100 })
  .toInt();
const validateOffset = query("offset").optional().isInt({ min: 0 }).toInt();
const validateName = body("name").optional().isString();
const validateId = param("id").isInt({ min: 0 }).toInt();
const validateIndex = param("index").isInt({ min: 0 }).toInt();
const validateNewIndex = param("newIndex").isInt({ min: 0 }).toInt();

const getCrateAndCheckAuth = async function (req, res, next) {
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
};

router.get("/", async function (req, res, next) {
  try {
    const crates = await CrateService.listCrates(req.user);
    res.json(crates);
  } catch (error) {
    next(error);
  }
});

router.post("/", validateName, async function (req, res, next) {
  try {
    const crate = await CrateService.addCrate(
      req.user.entityKey,
      req.body.name
    );
    res.status(201).json(crate.plain({ showKey: true, virtuals: true }));
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  validateId,
  getCrateAndCheckAuth,
  checkErrors,
  async function (req, res) {
    res.json(req.crate.plain({ showKey: true, virtuals: true }));
  }
);

router.patch(
  "/:id",
  validateId,
  validateName,
  getCrateAndCheckAuth,
  checkErrors,
  async function (req, res, next) {
    try {
      if (req.body.name) {
        await CrateService.renameCrate(req.crate, req.body.name);
      }
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  validateId,
  getCrateAndCheckAuth,
  checkErrors,
  async function (req, res, next) {
    try {
      await CrateService.deleteCrate(req.crate);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id/items",
  validateId,
  validateLimit,
  validateOffset,
  getCrateAndCheckAuth,
  checkErrors,
  async function (req, res, next) {
    try {
      const limit = req.query.limit || 100;
      const offset = req.query.offset || 0;
      const crate = req.crate;
      const orderedItems = await CrateService.getItems(crate, {
        limit,
        offset,
      });
      res.json(orderedItems);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/:id/item",
  validateId,
  body("path").optional().isArray(),
  body("item").optional().isObject(),
  body("index").optional().isInt({ min: 0 }).toInt(),
  getCrateAndCheckAuth,
  checkErrors,
  async function (req, res, next) {
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

      res.send();
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id/item/:index",
  validateId,
  validateIndex,
  getCrateAndCheckAuth,
  checkErrors,
  async function (req, res, next) {
    try {
      await CrateService.removeItem(req.crate, req.params.index);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:id/item/:index/reorder/:newIndex",
  validateId,
  validateIndex,
  validateNewIndex,
  getCrateAndCheckAuth,
  checkErrors,
  async function (req, res, next) {
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
  }
);

module.exports = router;
