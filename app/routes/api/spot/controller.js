const { SpotService } = require("../../../services");
const { errorMessages } = require("../errors");

module.exports = {
  async getSpots(req, res, next) {
    try {
      const active =
        typeof req.query.active === "boolean" ? req.query.active : true;
      const spots = await SpotService.listSpots(active);
      res.json(spots);
    } catch (error) {
      next(error);
    }
  },
  async addSpot(req, res, next) {
    try {
      const spot = await SpotService.addSpot(req.body);
      res.status(201).json(spot);
    } catch (error) {
      next(error);
    }
  },
  async getSpot(req, res, next) {
    try {
      const spot = await SpotService.getSpot(req.params.id);
      res.json(spot);
    } catch (error) {
      next(error);
    }
  },
  async updateSpot(req, res, next) {
    try {
      await SpotService.updateSpot(req.params.id, req.body);
      const spot = await SpotService.getSpot(req.params.id);
      res.status(200).json(spot);
    } catch (error) {
      next(error);
    }
  },
  async deleteSpot(req, res, next) {
    try {
      await SpotService.deleteSpot(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
  async addCopy(req, res, next) {
    try {
      const copy = await SpotService.addCopy(req.params.id, req.body, req.user);
      res.status(201).json(copy);
    } catch (error) {
      next(error);
    }
  },
  async updateCopy(req, res, next) {
    try {
      const copy = await SpotService.updateCopy(req.params.id, req.body);
      res.status(200).json(copy);
    } catch (error) {
      next(error);
    }
  },
  async deleteCopy(req, res, next) {
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
  },
};
