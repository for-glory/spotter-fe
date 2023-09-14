import { AuthPayload } from "@/generated/graphql";
import { RefreshTokenDocument } from "@/graphql/documents/authDocuments";
import { Middleware } from "@/ts/types/router";

import initializeApollo from "@/apollo";
import dayjs from "dayjs";
import { EntitiesEnum } from "@/const/entities";
import usePushNotifications from "@/hooks/usePushNotifications";
import { getSettings } from "@/hooks/useSettings";
import { ProfileSettings } from "@/ts/enums/user";

export const getToken = () => {
  const accessToken = localStorage.getItem("access_token");
  const expiresIn = localStorage.getItem("expires_in");

  if (accessToken && dayjs().isBefore(expiresIn)) {
    return accessToken;
  }

  return "";
};

export const getNewToken = () => {
  const apolloClient = initializeApollo();
  const refreshToken = JSON.parse(
    localStorage.getItem("refresh_token") || "{}"
  );

  return apolloClient
    .mutate({
      mutation: RefreshTokenDocument,
      variables: { refresh_token: refreshToken },
    })
    .then((response) => {
      return response.data.refreshToken;
    })
    .catch((error) => {
      console.error(error);
    });
};

export const setAuthItems = (authItems: AuthPayload) => {
  for (const [key, value] of Object.entries(authItems)) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  if (authItems.user) {
    localStorage.setItem(
      "currentSubscription",
      authItems.user?.currentSubscription
    );
  }
  const token = localStorage.getItem("FCM_TOKEN");
  const { updateDeviceToken, registerPushNotifications } =
    usePushNotifications();
  token ? updateDeviceToken(token) : registerPushNotifications();

  if (authItems.user?.front_settings) {
    getSettings(JSON.parse(authItems.user.front_settings));
  }
};

export const setAuthItemsFromMe = (user: any) => {
  for (const [key, value] of Object.entries(user)) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  if (user) {
    localStorage.setItem("currentSubscription", user?.currentSubscription);
  }
  const token = localStorage.getItem("FCM_TOKEN");
  const { updateDeviceToken, registerPushNotifications } =
    usePushNotifications();
  token ? updateDeviceToken(token) : registerPushNotifications();

  if (user?.front_settings) {
    getSettings(JSON.parse(user.front_settings));
  }
};

export const clearAuthItems = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  localStorage.removeItem(ProfileSettings.UserSettings);
  localStorage.removeItem("organization");
  localStorage.removeItem("dashboard_active_tab");
  localStorage.removeItem("preferred_booking_tab");
  localStorage.removeItem("trainer_schedule_active_tab");
  localStorage.removeItem("selectedGym");
  localStorage.removeItem("facilities");
};

const auth: Middleware = async ({ next, router }) => {
  if (!getToken()) {
    await getNewToken()
      .then((data) => {
        setAuthItems(data);

        return next();
      })
      .catch(() => {
        return router.push({ name: EntitiesEnum.Login });
      });
  }

  return next();
};

export default auth;
