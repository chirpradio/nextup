const router = require("express").Router();
const { SpotService } = require("../../services");
const { query } = require("express-validator");
const { authorizeTrafficLogAdmins, validateId } = require("./validators");
const { checkErrors, errorMessages } = require("./errors");

const validateActive = query("active").optional().toBoolean();

router.get("/", validateActive, checkErrors, async function (req, res, next) {
  try {
    const active =
      typeof req.query.active === "boolean" ? req.query.active : true;
    const spots = await SpotService.listSpots(active);
    res.json(spots);
  } catch (error) {
    next(error);
  }
});

router.post("/", authorizeTrafficLogAdmins, checkErrors, async function (
  req,
  res,
  next
) {
  try {
    const spot = await SpotService.addSpot(req.body);
    res.status(201).json(spot);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", validateId, checkErrors, async function (req, res, next) {
  try {
    const spot = await SpotService.getSpot(req.params.id);
    res.json(spot);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", validateId, checkErrors, async function (req, res, next) {
  try {
    await SpotService.updateSpot(req.params.id, req.body);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", validateId, checkErrors, async function (req, res, next) {
  try {
    await SpotService.deleteSpot(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:id/copy",
  validateId,
  authorizeTrafficLogAdmins,
  checkErrors,
  async function (req, res, next) {
    try {
      const copy = await SpotService.addCopy(req.params.id, req.body, req.user);
      res.status(201).json(copy);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/copy/:id",
  validateId,
  authorizeTrafficLogAdmins,
  checkErrors,
  async function (req, res, next) {
    try {
      await SpotService.updateCopy(req.params.id, req.body);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/copy/:id",
  validateId,
  authorizeTrafficLogAdmins,
  checkErrors,
  async function (req, res, next) {
    try {
      const success = await SpotService.deleteCopy(req.params.id);
      if (success) {
        res.sendStatus(204);
      } else {
        throw new Error(errorMessages.NOT_FOUND);
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
