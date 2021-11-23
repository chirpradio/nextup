const router = require("express").Router();
const { query } = require("express-validator");
const { checkErrors } = require("./errors");
const { DateService, TrafficLogService } = require("../../services");

const validateStart = query("start").isISO8601();
const validateEnd = query("end").isISO8601();

router.get("/", async function (req, res, next) {
  try {
    const entries = await TrafficLogService.getLog(
      DateService.currentChicagoWeekday(),
      DateService.currentChicagoHour()
    );
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post("/", async function (req, res, next) {
  try {
    const entry = await TrafficLogService.addEntry(
      req.body,
      req.user.entityKey
    );
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
});

router.get("/report", validateStart, validateEnd, checkErrors, async function (
  req,
  res,
  next
) {
  try {
    const fullStartISO = DateService.fullChicagoISOFromISODate(
      req.query.start,
      "start"
    );
    const fullEndISO = DateService.fullChicagoISOFromISODate(
      req.query.end,
      "end"
    );
    const report = await TrafficLogService.getReport(
      new Date(fullStartISO),
      new Date(fullEndISO)
    );

    const filename = `chirp-traffic-log-${req.query.start}-to-${req.query.end}.csv`;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.status(200).send(report);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
