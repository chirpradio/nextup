import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import updateTitle from "./mixins/updateTitle"
import VueGtag from "vue-gtag-next";

createApp(App).use(store).use(router).use(VueGtag, {
  property: {
    id: 'G-M6XM24GCTX'
  },
  useDebugger: true,
}).mixin(updateTitle).mount('#app')
