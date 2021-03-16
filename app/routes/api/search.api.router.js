const router = require("express").Router();
const { query } = require('express-validator');
const { checkErrors } = require("./errors");
const { SearchService } = require("../../services");

const validateLimit = query('limit').optional().isInt({ min: 1, max: 100 }).toInt();
const validateOffset = query('offset').optional().isInt({ min: 0 }).toInt();

router.get("/", 
  validateLimit,
  validateOffset,
  checkErrors,
  async function (req, res, next) {
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
  }
);

module.exports = router;
