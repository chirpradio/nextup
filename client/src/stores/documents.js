import { defineStore } from "pinia";
import { api } from "../services/api.service";

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
    async updateDocument(documentKey, unsafe_text) {
      const { data: updatedDocument } = await api.patch("/document", {
        __key: documentKey,
        unsafe_text,
      });
      return updatedDocument;
    },
  },
});
