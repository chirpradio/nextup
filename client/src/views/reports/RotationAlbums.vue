<template>
  <div class="container-fluid">
    <h1>Rotation Albums</h1>
    <RecordSpinner v-if="loading" />
    <div v-if="!loading">
      <div class="row d-flex mb-3">
        <label for="daysAgo" class="col-auto col-form-label"
          >Imported since</label
        >
        <div class="col-auto me-auto">
          <input class="form-control" type="date" v-model="htmlSince" />
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
      </div>
      <div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <div class="row">
              <div class="col fw-bold">Artist</div>
              <div class="col fw-bold">Album</div>
              <div class="col fw-bold">Label</div>
              <div class="col fw-bold">Tags</div>
            </div>
          </li>
          <li
            v-for="album in rotationAlbums"
            :key="album.__key"
            class="list-group-item"
          >
            <div class="row">
              <div class="col">
                <span
                  v-if="album.is_compilation"
                  class="badge rounded-pill bg-secondary"
                >
                  Compilation
                </span>
                <ArtistLink
                  class="col"
                  v-if="!album.is_compilation"
                  :artist="album.album_artist"
                />
              </div>
              <AlbumTitleLink class="col" :album="album" />
              <div class="col">{{ album.label }}</div>
              <TagList class="col" :tags="album.current_tags" />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-leave-to {
  opacity: 0;
}
</style>

<script>
import RecordSpinner from "../../components/RecordSpinner";
import AlbumTitleLink from "../../components/music/AlbumTitleLink";
import ArtistLink from "../../components/music/ArtistLink";
import TagList from "../../components/music/TagList";

export default {
  name: "RotationAlbums",
  title: "Rotation Albums",
  components: { RecordSpinner, AlbumTitleLink, ArtistLink, TagList },
  data() {
    const date = new Date();
    date.setDate(date.getDate() - 7);

    return {
      since: date,
      loading: true,
      copied: false,
    };
  },
  computed: {
    htmlList() {
      const tokens = this.rotationAlbums.map((album) => {
        const artistName = album.is_compilation
          ? "Various Artists"
          : album.album_artist.name;
        return `<li><strong>${artistName}</strong> &ndash; <em>${album.title}</em> (${album.label})</li>`;
      });
      tokens.unshift("<ol>");
      tokens.push("</ol>");
      return tokens.join("\n");
    },
    htmlSince: {
      /*
        get a value that the date input will accept
      */
      get() {
        const dateTokens = this.since.toLocaleDateString("en-US").split("/");
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
        this.since = new Date(utcTime + offsetInMilliseconds);
      },
    },
    rotationAlbums() {
      return this.$store.getters.rotationAlbums(this.since);
    },
  },
  created() {
    this.loadAllTaggedAlbums();
  },
  methods: {
    async loadAllTaggedAlbums() {
      await this.$store.dispatch("getTaggedAlbums", {
        tag: "heavy_rotation",
        limit: 100,
      });
      while (this.$store.getters.moreAlbumsWithTag("heavy_rotation")) {
        await this.$store.dispatch("getMoreTaggedAlbums", {
          tag: "heavy_rotation",
          limit: 100,
        });
      }

      await this.$store.dispatch("getTaggedAlbums", {
        tag: "light_rotation",
        limit: 100,
      });
      while (this.$store.getters.moreAlbumsWithTag("light_rotation")) {
        await this.$store.dispatch("getMoreTaggedAlbums", {
          tag: "light_rotation",
          limit: 100,
        });
      }
      this.loading = false;
    },
    async copyToClipboard() {
      await navigator.clipboard.writeText(this.htmlList);
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    },
  },
};
</script>
