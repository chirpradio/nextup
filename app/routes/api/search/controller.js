const { SearchService } = require("../../../services");

module.exports = {
  async handleSearch(req, res, next) {
    try {
      const from = req.query.offset || 0;
      const size = req.query.limit || 50;
      const results = await SearchService.search(req.query, req.query.type, {
        from,
        size,
      });
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
};
