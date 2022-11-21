const router = require("express").Router();
const { validateLimit, validateOffset } = require("./validators");
const { checkErrors } = require("../errors");
const controller = require("./controller");

router.get("/", validateLimit, validateOffset, checkErrors, controller.handleSearch);

module.exports = router;
