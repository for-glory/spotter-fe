<template>
  <ion-app :class="isNative && 'native-app'">
    <router-view />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, isPlatform } from "@ionic/vue";
import { onMounted } from "vue";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useRouter } from "vue-router";
import { App } from "@capacitor/app";
import { EntitiesEnum } from "./const/entities";
import { SplashScreen } from "@capacitor/splash-screen";
import usePushNotifications from "@/hooks/usePushNotifications";
import { navigationAfterPaymentCompleted } from "@/helpers/purchaseRouterNavigation";
import { setAuthItemsFromMe } from "./router/middleware/auth";
import { useLazyQuery } from "@vue/apollo-composable";
import { MeDocument } from "./generated/graphql";
import { Capacitor } from "@capacitor/core";

onMounted(async () => {
  getMyProfile();

  if (!isPlatform("desktop") && !isPlatform("mobileweb")) {
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: '#202020' });
  }

  const { registerPushNotifications } = usePushNotifications();
  registerPushNotifications();
  await SplashScreen.hide();
});

let isNative = Capacitor.isNativePlatform();
// isNative = true;
const router = useRouter();

App.addListener("appUrlOpen", function (data: any) {
  const slug = data.url.split(process.env.VUE_APP_URL)[1]?.split("?")[0];

  const passwordReset = slug.split("/password-reset/");

  if (passwordReset?.length && passwordReset.includes("/password-reset/")) {
    const token = slug.split("/password-reset/")[1];
    router.push({
      name: EntitiesEnum.PasswordReset,
      params: {
        id: token,
      },
    });
    return;
  }

  switch (slug) {
    case "/email-verify": {
      const token = data.url.split("?token=")[1];
      router.push({
        name: EntitiesEnum.VerifyEmail,
        query: {
          token,
        },
      });
      break;
    }
    case "/payment-success": {
      const productId = data.url
        .split("?purchasable_product_id=")[1]
        ?.split("&type=")[0];
      const cartId = data.url.split("&cart_id=")[1];
      navigationAfterPaymentCompleted(productId, cartId);
      break;
    }
    case "/card-added": {
      const id = data.url.split("?product_id=")[1];
      router.push({
        name: EntitiesEnum.PaymentsMethods,
        params: { orderId: id },
      });
      break;
    }
    case "/profile-card-added": {
      router.push({
        name: EntitiesEnum.ProfilePaymentMethods,
      });
      break;
    }
    case "/payment-failure": {
      // @TODO call Failed Payment route
      break;
    }
    default:
      console.log("URL not found");
  }
});

App.addListener("resume", () => {
  updateMyProfile();
});

const {
  load: getMyProfile,
  onResult: gotMyProfile,
  refetch: updateMyProfile,
} = useLazyQuery(MeDocument);

gotMyProfile(({ data }) => {
  // Use optional chaining to access data.me safely
  const me = data?.me;
  if (me) {
    // me is not null or undefined, setAuthItemsFromMe can be safely called
    setAuthItemsFromMe(me);
  }
});
</script>
