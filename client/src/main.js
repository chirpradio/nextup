import { createApp } from "vue";
import { Collapse } from "../node_modules/bootstrap/js/dist/collapse"; // eslint-disable-line no-unused-vars
import { Dropdown } from "../node_modules/bootstrap/js/dist/dropdown"; // eslint-disable-line no-unused-vars
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueGtag from "vue-gtag-next";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faGripLines,
  faCheckCircle,
  faExclamationCircle,
  faStar,
  faBan,
  faEdit,
  faCheckSquare,
  faTimes,
  faCircle,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faGripLines,
  faCheckCircle,
  faCheckSquare,
  faExclamationCircle,
  faStar,
  faBan,
  faEdit,
  faTimes,
  faCircle,
  faPlay
);

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
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
