import { RouteRecordRaw } from "vue-router";
import { routes as generalRoutes } from "@/general/routes";
import { routes as usersRoutes } from "@/users/routes";
import { routes as trainersRoutes } from "@/trainers/routes";
import { routes as facilitiesRoutes } from "@/facilities/routes";
import { routes as landingRoutes } from "@/landing/routes";

export const routes: Array<RouteRecordRaw> = [
  ...generalRoutes,
  ...usersRoutes,
  ...trainersRoutes,
  ...facilitiesRoutes,
  ...landingRoutes,
];
