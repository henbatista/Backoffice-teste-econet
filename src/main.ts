import { createApp, watch } from "vue";
import { createPinia } from "pinia";
import VueTippy from "vue-tippy";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from "./App.vue";
import "./assets/scss/tailwind.scss";
import router from "./router";
import { useLayoutStore } from "./stores/layout";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(VueTippy);
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
});

const layoutStore = useLayoutStore(pinia);
layoutStore.initFromStorage();

app.config.globalProperties.$store = {
  state: layoutStore,
  dispatch(action: string, payload?: unknown) {
    if (typeof (layoutStore as any)[action] === "function") {
      return (layoutStore as any)[action](payload);
    }
    return Promise.reject(new Error(`Unknown action: ${action}`));
  },
  watch(getter: (state: unknown) => unknown, callback: (value: unknown) => void) {
    return watch(() => getter(layoutStore), callback);
  },
};

app.use(router).mount("#app");
