import { Middleware } from "@/ts/types/router";
import { getToken } from "@/router/middleware/auth";
import navigationAfterLogin from "@/general/helpers/navigationAfterLogin";

const guest: Middleware = async ({ next }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (getToken() && user) {
    navigationAfterLogin(user);
  }

  return next();
};

export default guest;
