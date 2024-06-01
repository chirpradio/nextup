const { SearchService } = require("../../../services");

module.exports = {
  async handleSearch(req, res, next) {
    try {
      const from = req.query.offset || 0;
      const size = req.query.limit || 50;
      const results = await SearchService.search(req.query, req.query.index, {
        from,
        size,
        as_you_type: req.query.as_you_type,
      });
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
};
