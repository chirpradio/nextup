const { DocumentService } = require("../../../services");
const { errorMessages } = require("../errors");

module.exports = {
  async createDocument(req, res, next) {
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
  async getDocumentAndRequireEditAccess(req, res, next) {
    try {
      const documentKey = req.body.__key;
      const document = await DocumentService.getDocument(documentKey);

      const isAuthor =
        document.author && document.author.id === req.user.entityKey.id;
      const isMusicDirector = req.user.isMusicDirector();
      const isSuperuser = req.user.is_superuser === true;

      if (isAuthor || isMusicDirector || isSuperuser) {
        req.document = document;
        return next();
      }

      return res.status(403).json({
        error:
          "Forbidden: You can only edit documents you authored, or you must be a music director or superuser",
      });
    } catch (error) {
      next(error);
    }
  },
  async updateDocument(req, res, next) {
    try {
      const documentKey = req.body.__key;
      const document = await DocumentService.updateDocument(
        documentKey,
        req.body
      );
      res.json(document.plain({ showKey: true }));
    } catch (error) {
      next(error);
    }
  },
};
