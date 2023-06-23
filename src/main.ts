import { createApp, provide, h } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { createPinia } from "pinia";

import { IonicVue } from "@ionic/vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import initializeApollo from "@/apollo";
import VueGoogleMaps from "@fawmi/vue-google-maps";
import components from "@/general/components";
import VueVideoPlayer from "@videojs-player/vue";
import mitt from "mitt";
import { Calendar, DatePicker } from "v-calendar";
import SetupCalendar from "v-calendar";

import ToastPlugin from 'vue-toast-notification';
// Import one of the available themes
//import 'vue-toast-notification/dist/theme-default.css';
import 'vue-toast-notification/dist/theme-bootstrap.css';

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";
import "v-calendar/dist/style.css";

import Vue3TouchEvents from "vue3-touch-events";

/* Theme variables */
import "./theme/variables.css";
import "./theme/core.scss";

const pinia = createPinia();

const emitter = mitt();

const app = createApp({
  setup() {
    provide(DefaultApolloClient, initializeApollo());
  },

  render: () => h(App),
})
  .use(IonicVue, {
    mode: "md",
  })
  .use(Vue3TouchEvents)
  .use(store)
  .use(router)
  .use(pinia)
  .use(VueVideoPlayer)
  .use(VueGoogleMaps, {
    load: {
      key: process.env.VUE_APP_GOOGLE_MAP_API_KEY,
    },
  });

app.provide("emitter", emitter);

app.use(SetupCalendar, {});
app.component("Calendar", Calendar);
app.component("DatePicker", DatePicker);
app.use(ToastPlugin, {
  position: 'top'
});

components.forEach((component) => {
  app.component(component.name, component);
});

router.isReady().then(() => {
  app.mount("#app");
});
