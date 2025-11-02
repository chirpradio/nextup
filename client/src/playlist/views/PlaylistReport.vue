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
        :disabled="!isValidDateRange"
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
    const defaultDate = yesterday.toISOString().split("T")[0]

    return {
      from: defaultDate,
      to: defaultDate,
      downloading: false,
      error: null,
    };
  },
  computed: {
    isValidDateRange() {
      // Check if both dates are valid
      if (!this.from || !this.to) {
        return false;
      }
      
      const startDate = new Date(this.from);
      const endDate = new Date(this.to);
      
      // Check if dates are valid and start is not after end
      return !isNaN(startDate.getTime()) && 
             !isNaN(endDate.getTime()) && 
             startDate <= endDate;
    }
  },
  methods: {
    async downloadReport() {
      this.error = null;
      
      // Validate date span
      const startDate = new Date(this.from);
      const endDate = new Date(this.to);
      const diffInMs = endDate - startDate;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      const MAX_DATE_RANGE_IN_DAYS = 100;
      
      if (diffInDays > MAX_DATE_RANGE_IN_DAYS) {
        this.error = `Date range cannot exceed ${MAX_DATE_RANGE_IN_DAYS} days`;
        return;
      }
      
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
