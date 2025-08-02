const { Document } = require("../models");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

module.exports = {
  async createDocument(data) {
    const window = new JSDOM("").window;
    const DOMPurify = createDOMPurify(window);
    data.unsafe_text = DOMPurify.sanitize(data.unsafe_text);
    const document = new Document(data);
    await document.save();
    return document.populate("author");
  },
  async listDocumentsBySubject(subject) {
    const options = {
      filters: [["subject", subject.entityKey || subject.__key]],
      showKey: true,
    };

    const { entities: documents } = await Document.list(options);
    return documents;
  },
};
