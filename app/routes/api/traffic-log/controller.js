const { DateService, TrafficLogService } = require("../../../services");

module.exports = {
  async getLog(req, res, next) {
    try {
      const entries = await TrafficLogService.getLog(
        DateService.currentChicagoWeekday(),
        DateService.currentChicagoHour()
      );
      res.json(entries);
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
