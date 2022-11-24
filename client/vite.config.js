import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "../app/client"),
    rollupOptions: {
      // https://rollupjs.org/guide/en/#outputmanualchunks
      output: {
        manualChunks: {
          "library": [            
            "./src/views/music/AlbumView.vue",
            "./src/views/music/MusicHome.vue",
            "./src/views/music/MusicView.vue",
            "./src/views/music/TagView.vue",
            "./src/views/music/LibraryAdds.vue",
            "./src/views/music/ArtistView.vue",
          ],
          "playlist": [
            "./src/views/playlist/PlaylistView.vue",
          ],
          "search": [
            "./src/components/music/search/EverythingFilters.vue",
            "./src/components/music/search/EverythingResults.vue",
            "./src/components/music/search/album/AlbumFilters.vue",
            "./src/components/music/search/album/AlbumResults.vue",
            "./src/components/music/search/track/TrackFilters.vue",
            "./src/components/music/search/track/TrackResults.vue",
            "./src/components/music/search/artist/ArtistResults.vue",
            "./src/components/music/search/document/DocumentResults.vue",
            "./src/components/music/search/TermFilter.vue",
            "./src/views/music/SearchView.vue",
          ],
          "crates": [
            "./src/views/crates/CratesView.vue",
            "./src/views/crates/CrateView.vue",            
          ], 
          "traffic-log": [
            "./src/views/traffic-log/SpotsView.vue",            
          ],       
          "reports": [
            "./src/views/reports/RotationAlbums.vue",
            "./src/views/reports/RotationPlays.vue",
          ],
        },
      },
    },
  },
});
