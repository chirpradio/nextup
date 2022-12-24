import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { PiniaSharedState } from "pinia-shared-state";

const store = createPinia();
store.use(piniaPluginPersistedstate);
store.use(PiniaSharedState({}));

export default store;
