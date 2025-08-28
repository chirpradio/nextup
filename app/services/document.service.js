const { Document } = require("../models");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

async function getDocument(key, populate = true) {
  const result = await Document.query().filter("__key__", key).run({
    format: "ENTITY",
  });
  if (!result) {
    throw new Error("Document not found");
  }    
  const document = result.entities[0];
  return populate ? document.populate("author") : document;
}

function sanitize(text) {
  const window = new JSDOM("").window;
  const DOMPurify = createDOMPurify(window);
  return DOMPurify.sanitize(text);
}

module.exports = {
  async createDocument(data) {
    data.unsafe_text = sanitize(data.unsafe_text);
    const document = new Document(data);
    await document.save();
    return document.populate("author");
  },
  getDocument,
  async updateDocument(key, data) {    
    const document = await getDocument(key, false);
    document.unsafe_text = sanitize(data.unsafe_text);
    await document.save();
    return document.populate("author");
  },
  async listDocumentsBySubject(subject) {
    const options = {
      filters: [["subject", subject.entityKey || subject.__key]],
      order: { property: "created", descending: true },
      showKey: true,
    };

    const { entities: documents } = await Document.list(options);
    return documents;
  },
};
