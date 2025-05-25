const { DocumentService } = require("../../../services");
const { errorMessages } = require("../errors");

module.exports = {
  createDocument: async function (req, res, next) {
    try {
      if (req.body.doctype === "review") {
        const authorized =
          req.user.isMusicDirector() || req.user.is_superuser === true;
        if (!authorized) {
          throw new Error(errorMessages.FORBIDDEN);
        }
      }
      const document = await DocumentService.createDocument(req.body);
      res.status(201).json(document.plain({ showKey: true }));
    } catch (error) {
      next(error);
    }
  },
};
