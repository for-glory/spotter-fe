export {};

import "vue-router";

declare module "vue-router" {
  import { AuthenticationMode } from "@/ts/enums/authentification";

  interface RouteMeta {
    mode?: AuthenticationMode;
  }
}
