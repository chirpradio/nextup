const { Document } = require("../models");

async function listDocumentsBySubject(subject) {
  const options = {
    filters: [["subject", subject.entityKey || subject.__key]],
    showKey: true,
  };

  const { entities: documents } = await Document.list(options);
  return documents;
}

module.exports = {
  listDocumentsBySubject,
};
