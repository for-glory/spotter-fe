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

  // Set Title and Description for Static pages
  const siteName = "Spotter Fitness || Connect with hundreds of top Trainers and world-class Gyms near you.";
  let pageDescription: any = "Your journey to a healthier, happier you starts now. Take the first step and let Spotter be your partner in reaching new heights of wellness. Together we'll build a stronger fitter, and more confident YOU!";
  document.title = siteName;

  if (to.matched[0].meta.title) {
    document.title = to.matched[0].meta.title + " | " + siteName;
  }

  if (to.matched[0].meta.description) {
    const metaDescription = to.matched[0].meta.description;
    pageDescription = metaDescription
    const metaElement = document.querySelector("meta[name='description']");
    metaElement?.setAttribute("content", pageDescription);
  }

  return next();
});

export default router;
