import { RouteRecordRaw } from "vue-router";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/landing/views/Landing.vue"),
  },
];
