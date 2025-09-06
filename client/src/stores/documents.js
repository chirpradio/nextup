import { defineStore } from "pinia";
import { api } from "../services/api.service";
import { useAlbumsStore } from "./albums";

export const useDocumentsStore = defineStore("documents", {
  actions: {
    async addComment({ album, comment, user } = {}) {
      const { data: newComment } = await api.post("/document", {
        author: user.entityKey.path,
        subject: album.__key.path,
        doctype: "comment",
        unsafe_text: comment,
      });
      album.comments.push(newComment);
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
