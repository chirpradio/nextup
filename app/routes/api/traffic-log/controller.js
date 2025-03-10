const { DateService, TrafficLogService } = require("../../../services");

module.exports = {
  async getLog(req, res, next) {
    try {
      const dow = req.query.dow || DateService.currentChicagoWeekday();
      const hour = Number.isInteger(req.query.hour) ? req.query.hour : DateService.currentChicagoHour();
      const length = req.query.length || 1;
      const log = await TrafficLogService.getLog(dow, hour, length);
      res.json(log);
    } catch (error) {
      next(error);
    }
  },
  async addEntry(req, res, next) {
    try {
      const entry = await TrafficLogService.addEntry(
        req.body,
        req.user.entityKey
      );
      res.status(201).json(entry);
    } catch (error) {
      next(error);
    }
  },
  async exportLog(req, res, next) {
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
  },
};
