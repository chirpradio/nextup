<template>
  <div class="container-fluid">
    <h1>Traffic Log Report</h1>

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

    <div class="row mb-3">
      <div class="col">
        <label for="spotType" class="form-label">Spot Type</label>
        <select id="spotType" class="form-select" v-model="filters.spotType">
          <option value="">All Types</option>
          <option v-for="type in spotTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>
      <div class="col">
        <label for="underwriter" class="form-label">Underwriter</label>
        <input
          id="underwriter"
          class="form-control"
          type="text"
          v-model="filters.underwriter"
          placeholder="Optional"
        />
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
import { types as spotTypes } from "../constants";

export default {
  name: "TrafficLogReport",
  title: "Traffic Log Report",
  components: {
    LoadingButton,
  },
  data() {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const now = new Date();

    return {
      from: lastWeek.toISOString().split("T")[0],
      to: now.toISOString().split("T")[0],
      filters: {
        spotType: "",
        underwriter: "",
      },
      downloading: false,
      error: null,
    };
  },
  computed: {
    spotTypes() {
      return spotTypes;
    },
  },
  methods: {
    async downloadReport() {
      this.error = null;
      this.downloading = true;

      try {
        // Build query parameters
        const params = {
          start: this.from,
          end: this.to,
        };

        if (this.filters.spotType) {
          params.spot_type = this.filters.spotType;
        }

        if (this.filters.underwriter.trim()) {
          params.underwriter = this.filters.underwriter.trim();
        }

        // Make API call to download CSV
        const response = await api.get("/traffic-log/report", {
          params,
          responseType: "blob",
        });

        // Create download link
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        // Generate filename
        let filename = `chirp-traffic-log-${this.from}-to-${this.to}`;
        if (this.filters.spotType) {
          filename += `-${this.filters.spotType.replace(/\s+/g, "_")}`;
        }
        if (this.filters.underwriter.trim()) {
          filename += `-${this.filters.underwriter
            .trim()
            .replace(/[^a-zA-Z0-9]/g, "_")}`;
        }
        filename += ".csv";

        link.href = url;
        link.download = filename;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Failed to download traffic log report:", error);
        if (error.response?.status === 403) {
          this.error = "Access denied. Traffic log admin privileges required.";
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
