const router = require("express").Router();
const { body } = require("express-validator");
const { CrateService } = require("../../services");
const { datastore, parseIndexerTransaction } = require("../../db");
const { checkErrors } = require("./errors");

const getCrateAndCheckAuth = async function (req, res, next) {
  try {
    const crate = await CrateService.getCrate(parseInt(req.params.id, 10));
    if (CrateService.userIsAuthorized(req.user, crate)) {
      req.crate = crate;
      next();
    } else {
      throw new Error("Forbidden");
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

router.post(
  "/:id/item",
  body("path").isArray(),
  checkErrors,
  getCrateAndCheckAuth,
  async function (req, res, next) {
    try {
      const crate = req.crate;
      const path = parseIndexerTransaction(req.body.path);
      const key = datastore.key(path);

      if (crate.items) {
        crate.items.push(key);
      } else {
        crate.items = [key];
      }

      if (crate.order) {
        let max = crate.order.reduce((a, b) => Math.max(a, b));
        max++;
        crate.order.push(max);
      } else {
        crate.order = [1];
      }

      await crate.save();
      res.send();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
