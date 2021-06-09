import { createApp } from "vue";
import { Dropdown } from "../node_modules/bootstrap/js/dist/dropdown"; // eslint-disable-line no-unused-vars
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueGtag from "vue-gtag-next";

const debug = process.env.NODE_ENV !== "production";

createApp(App)
  .use(store)
  .use(router)
  .use(VueGtag, {
    property: {
      id: "G-M6XM24GCTX",
    },
    useDebugger: debug,
  })
  .mount("#app");
