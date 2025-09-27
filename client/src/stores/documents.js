import { defineStore } from "pinia";
import { api } from "../services/api.service";
import { useAlbumsStore } from "./albums";

export const useDocumentsStore = defineStore("documents", {
  actions: {
    async addDocument({ album, text, user, doctype } = {}) {
      const { data: newDocument } = await api.post("/document", {
        author: user.entityKey.path,
        subject: album.__key.path,
        doctype,
        unsafe_text: text,
      });
      album[`${doctype}s`].push(newDocument);
    },
    async updateDocument(document, unsafe_text) {
      const { data: updatedDocument } = await api.patch("/document", {
        __key: document.__key.path,
        unsafe_text,
      });
      const albums = useAlbumsStore();
      albums.updateDocument(updatedDocument);
    },
    async deleteDocument(document) {
      await api.delete("/document", {
        data: { __key: document.__key.path },
      });
      const albums = useAlbumsStore();
      albums.removeDocument(document);
    },
  },
});
