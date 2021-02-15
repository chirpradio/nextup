const router = require("express").Router();
const { CrateService } = require("../../services");

router.get("/", async function (req, res, next) {
  try {
    const crates = await CrateService.listCratesForUser(req.user);
    res.json(crates);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
