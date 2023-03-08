import {
  NavigationGuardNext,
  RouteLocationNormalized,
  Router,
} from "vue-router";

export type RouterContext = {
  from: RouteLocationNormalized;
  next: NavigationGuardNext;
  router: Router;
  to: RouteLocationNormalized;
};

export type Middleware = (
  middlewareParams: RouterContext & { next: NavigationGuardNext }
) => ReturnType<NavigationGuardNext>;
