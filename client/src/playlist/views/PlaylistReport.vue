<template>
  <div class="container-fluid">
    <h1>Playlist Report</h1>

    <div class="row mb-3">
      <div class="col">
        <label for="from" class="form-label">From</label>
        <input id="from" class="form-control" type="date" v-model="from" />
      </div>
      <div class="col">
        <label for="to" class="form-label">To</label>
        <input id="to" class="form-control" type="date" v-model="to" />
      </div>
    </div>

    <div class="row px-2 mb-3">
      <LoadingButton
        :loading="downloading"
        label="Download CSV"
        loadingLabel="Downloading..."
        @click="downloadReport"
      />
    </div>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
  </div>
</template>

<script>
import LoadingButton from "../../components/LoadingButton.vue";
import { api } from "../../services/api.service";

export default {
  name: "PlaylistReport",
  title: "Playlist Report",
  components: {
    LoadingButton,
  },
  data() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const today = new Date();

    return {
      from: yesterday.toISOString().split("T")[0],
      to: today.toISOString().split("T")[0],
      downloading: false,
      error: null,
    };
  },
  methods: {
    async downloadReport() {
      this.error = null;
      this.downloading = true;

      try {
        // Make API call to download CSV
        const response = await api.get("/playlist/report", {
          params: {
            start: this.from,
            end: this.to,
          },
          responseType: "blob",
        });

        // Create download link
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        // Generate filename
        const filename = `playlist-report-${this.from}-to-${this.to}.csv`;

        link.href = url;
        link.download = filename;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Failed to download playlist report:", error);
        if (error.response?.status === 403) {
          this.error = "Access denied. Music director privileges required.";
        } else if (error.response?.status === 400) {
          this.error = "Invalid request parameters. Please check your input.";
        } else {
          this.error = "Failed to download report. Please try again.";
        }
      } finally {
        this.downloading = false;
      }
    },
  },
};
</script>
