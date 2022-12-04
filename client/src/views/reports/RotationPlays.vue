<template>
  <div class="container-fluid">
    <h1>Rotation Plays</h1>
    <RecordSpinner v-if="loading" />
    <div v-if="!loading">
      <div class="row d-flex mb-3">
        <label for="from" class="col-auto col-form-label">From</label>
        <div class="col-auto">
          <input
            id="from"
            class="form-control"
            type="date"
            v-model="htmlFrom"
          />
        </div>
        <label for="to" class="col-auto col-form-label"> To </label>
        <div class="col-auto">
          <input id="to" class="form-control" type="date" v-model="htmlTo" />
        </div>
        <div class="col-auto me-auto">
          <button class="btn btn-chirp-red" @click="loadData">Update</button>
        </div>
        <div class="col-auto">
          <transition name="fade">
            <span v-if="copied" class="text-muted small me-3" role="alert">
              copied
            </span>
          </transition>
          <button
            type="button"
            class="btn btn-chirp-red col-auto"
            @click="copyToClipboard"
          >
            Copy HTML to Clipboard
          </button>
        </div>
        <div class="col-auto">
          <button type="button" class="btn btn-chirp-red" @click="downloadCSV">
            Download CSV
          </button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th scole="col"></th>
            <th scope="col">#</th>
            <th scope="col">Artist</th>
            <th scope="col">Album</th>
            <th scope="col">Label</th>
            <th scope="col">Play Count</th>
            <th scope="col">Tags</th>
          </tr>
        </thead>
        <tbody>
          <RotationPlayRow
            v-for="(play, index) in rotationPlays"
            :key="play.album.__key"
            :play="play"
            :index="index"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import RecordSpinner from "@/components/RecordSpinner.vue";
import RotationPlayRow from "@/components/reports/RotationPlayRow.vue";
import { mapStores } from "pinia";
import { useAlbumsStore } from "@/stores/albums";
import { useReportsStore } from "@/stores/reports";

function sortByPlayCountThenLocal(a, b) {
  // sort by play count first
  if (a.plays.length !== b.plays.length) {
    return b.plays.length - a.plays.length;
  }

  // then sort Local Current albums above others
  const aIsLocalCurrent =
    a.album.current_tags.includes("local_current") === true ? 1 : 0;
  const bIsLocalCurrent =
    b.album.current_tags.includes("local_current") === true ? 1 : 0;
  if (aIsLocalCurrent !== bIsLocalCurrent) {
    return bIsLocalCurrent - aIsLocalCurrent;
  }

  // then sort Local Classic above the rest
  const aIsLocalClassic =
    a.album.current_tags.includes("local_classic") === true ? 1 : 0;
  const bIsLocalClassic =
    b.album.current_tags.includes("local_classic") === true ? 1 : 0;
  return bIsLocalClassic - aIsLocalClassic;
}

export default {
  name: "RotationPlays",
  title: "Rotation Plays",
  components: { RecordSpinner, RotationPlayRow },
  data() {
    const date = new Date();
    date.setDate(date.getDate() - 6);
    const now = new Date();

    return {
      from: date,
      to: now,
      loading: true,
      copied: false,
    };
  },
  computed: {
    ...mapStores(useAlbumsStore, useReportsStore),
    htmlFrom: {
      /*
        get a value that the date input will accept
      */
      get() {
        const dateTokens = this.from.toLocaleDateString("en-US").split("/");
        const year = dateTokens[2];
        const month = dateTokens[0].padStart(2, "0");
        const day = dateTokens[1].padStart(2, "0");

        return `${year}-${month}-${day}`;
      },
      /*
        set a value that will display accurately on the page
        and compare accurately to the UTC times returned from the server
      */
      set(newValue) {
        const utcDate = new Date(`${newValue}T00:00:00Z`);
        const utcTime = utcDate.getTime();
        const localDate = new Date();
        const offsetInMilliseconds = localDate.getTimezoneOffset() * 60000;
        this.from = new Date(utcTime + offsetInMilliseconds);
      },
    },
    htmlTo: {
      /*
        get a value that the date input will accept
      */
      get() {
        const dateTokens = this.to.toLocaleDateString("en-US").split("/");
        const year = dateTokens[2];
        const month = dateTokens[0].padStart(2, "0");
        const day = dateTokens[1].padStart(2, "0");

        return `${year}-${month}-${day}`;
      },
      /*
        set a value that will display accurately on the page
        and compare accurately to the UTC times returned from the server
      */
      set(newValue) {
        const utcDate = new Date(`${newValue}T11:59:59Z`);
        const utcTime = utcDate.getTime();
        const localDate = new Date();
        const offsetInMilliseconds = localDate.getTimezoneOffset() * 60000;
        this.to = new Date(utcTime + offsetInMilliseconds);
      },
    },
    rotationPlays() {
      const plays = this.reportsStore.rotationPlays.plays;
      const albums = [
        ...this.albumsStore.taggedAlbums("heavy_rotation"),
        ...this.albumsStore.taggedAlbums("light_rotation"),
      ];

      const grouped = albums.map((album) => {
        const albumPlays = plays.filter(
          (play) => play.album.name === album.__key.name
        );
        return {
          album,
          plays: albumPlays,
        };
      });
      grouped.sort(sortByPlayCountThenLocal);

      return grouped;
    },
    htmlList() {
      const tokens = this.rotationPlays.slice(0, 50).map((play) => {
        const artistName = play.album.is_compilation
          ? "Various Artists"
          : play.album.album_artist.name;
        return `<li><strong>${artistName}</strong> – <em>${play.album.title}</em> (${play.album.label})</li>`;
      });
      tokens.unshift("<ol>");
      tokens.push("</ol>");
      return tokens.join("\n");
    },
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      await Promise.all([
        this.loadAllTaggedAlbums(),
        this.reportsStore.getRotationPlays({
          start: this.from.getTime(),
          end: this.to.getTime(),
        }),
      ]);
      this.loading = false;
    },
    async loadAllTaggedAlbums() {
      await this.albumsStore.getTaggedAlbums({
        tag: "heavy_rotation",
        limit: 100,
      });
      while (this.albumsStore.moreAlbumsWithTag("heavy_rotation")) {
        await this.albumsStore.getMoreTaggedAlbums({
          tag: "heavy_rotation",
          limit: 100,
        });
      }

      await this.albumsStore.getTaggedAlbums({
        tag: "light_rotation",
        limit: 100,
      });
      while (this.albumsStore.moreAlbumsWithTag("light_rotation")) {
        await this.albumsStore.getMoreTaggedAlbums({
          tag: "light_rotation",
          limit: 100,
        });
      }
    },
    generateCSV() {
      const csvLines = ["artist,album,label,count,tags"];
      for (const play of this.rotationPlays) {
        const line = [];
        line[0] = play.album.album_artist
          ? `"${play.album.album_artist.name.replace('"', '""')}"`
          : "Compilation";
        line.push(`"${play.album.title.replace('"', '""')}"`);
        line.push(`"${play.album.label.replace('"', '""')}"`);
        line.push(`${play.plays.length}`);
        line.push(`${play.album.current_tags.join(";")}`);
        csvLines.push(line.join(","));
      }
      return csvLines.join("\n");
    },
    async downloadCSV() {
      const csv = this.generateCSV();
      const filename = `chirp_rotation__${this.htmlFrom}_${this.htmlTo}.csv`;
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
      );
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    async copyToClipboard() {
      await navigator.clipboard.writeText(this.htmlList);
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    },
  },
};
</script>
