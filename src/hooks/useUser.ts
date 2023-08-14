import { getToken } from "@/router/middleware/auth";

export default function useUser() {
  const {first_name, last_name, email} = JSON.parse(localStorage.getItem("user") || "{}");

  const isLoggedIn = getToken() ? true : false;

  return {
    first_name, last_name, email, isLoggedIn
  };
}
