import { createRouter, createWebHistory } from "@ionic/vue-router";
import { routes } from "@/router/routes";
import nextFactory from "@/router/utils/nextFactory";
import { Capacitor } from "@capacitor/core";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];
    const context = {
      from,
      next,
      router,
      to,
    };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({ ...context, next: nextMiddleware });
  }

  if (to.path === "/") {
    console.log("root path");
    if (Capacitor.isNativePlatform()) {
      next("/auth/login");
    }
  }

  return next();
});

export default router;
