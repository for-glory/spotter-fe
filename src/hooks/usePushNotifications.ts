import { isPlatform, toastController } from "@ionic/vue";
import {
  PushNotifications,
  ActionPerformed,
  PushNotificationSchema,
  Token,
  PermissionStatus,
} from "@capacitor/push-notifications";
import { CreateDeviceTokenDocument } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { humanizeString } from "@/utils/textUtils";
import useId from "./useId";

const { mutate: createDeviceToken, onError } = useMutation(
  CreateDeviceTokenDocument
);

onError(async (error) => {
  console.error(error);
  const toast = await toastController.create({
    message: humanizeString(error.message),
    duration: 2000,
    icon: "assets/icon/info.svg",
    cssClass: "danger-toast",
  });
  toast.present();
});

export default function usePushNotifications() {
  const registerPushNotifications = () => {
    if (isPlatform("capacitor")) {
      PushNotifications.requestPermissions().then(
        (permission: PermissionStatus) => {
          if (permission.receive === "granted") {
            PushNotifications.register();
          }
        }
      );

      PushNotifications.addListener("registration", (token: Token) => {
        const curToken = localStorage.getItem("FCM_TOKEN");
        if (curToken === token.value) return;

        localStorage.setItem("FCM_TOKEN", token.value);
        const { id } = useId();
        if (id) {
          updateDeviceToken(token.value);
        }
      });

      PushNotifications.addListener("registrationError", (error: any) => {
        console.log("registrationError: ", error);
      });

      PushNotifications.addListener(
        "pushNotificationReceived",
        async (notification: PushNotificationSchema) => {
          console.log("Push reveived: ", notification);
        }
      );

      PushNotifications.addListener(
        "pushNotificationActionPerformed",
        async (notification: ActionPerformed) => {
          console.log("Push action: ", notification);
        }
      );
    }
  };

  const updateDeviceToken = (token: string) => {
    if (token && isPlatform("capacitor")) {
      createDeviceToken({ token });
    }
  };

  return { registerPushNotifications, updateDeviceToken };
}
