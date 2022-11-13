import { defineStore } from "pinia";
import api from "../services/api.service";

export const useSearchStore = defineStore("search", {
  state: () => ({
    loading: false,
    query: {},
    results: {},
  }),
  actions: {
    async search(query) {
      if (query) {
        this.loading = true;
        this.query = query;

        const results = await api.search(query);
        if (query.type) {
          this.results[query.type] = results;
        } else {
          this.results = results;
        }

        this.loading = false;
      }
    },
    async setOffset(offset) {
      this.query.offset = offset;
      await this.search(this.query);
    },
  },
});
