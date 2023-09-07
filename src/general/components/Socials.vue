<template>
  <div class="socials" :class="isNative && 'ion-padding'">
    <ion-button
      v-if="isSafari === 'safari' || isIos"
      expand="block"
      class="social-btn"
      @click="loginWithApple"
    >
      <ion-icon slot="icon-only" src="assets/icon/apple.svg"></ion-icon>
      Continue with Apple
    </ion-button>
    <ion-button expand="block" class="social-btn" @click="loginWithGoogle">
      <ion-icon slot="icon-only" src="assets/icon/google-colors.svg"></ion-icon>
      Continue with Google
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { IonButton, IonIcon, isPlatform } from "@ionic/vue";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { onMounted, ref } from "vue";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { SocialProvidersEnum, SocialLoginDocument } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { setAuthItems } from "@/router/middleware/auth";
import navigationAfterAuth from "../helpers/navigationAfterLogin";
import { Capacitor } from "@capacitor/core";

const firebaseConfig = {
  apiKey: "AIzaSyB7Q_qpCuFziaz_6VMopuqlnskb_TmtEgU",
  authDomain: "spotter-fitness-d49be.firebaseapp.com",
  databaseURL: "https://spotter-fitness-d49be-default-rtdb.firebaseio.com",
  projectId: "spotter-fitness-d49be",
  storageBucket: "spotter-fitness-d49be.appspot.com",
  messagingSenderId: "388599372628",
  appId: "1:388599372628:web:657e47d366f80b48bf46c1",
  measurementId: "G-BY1L904251",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();

const isIos = isPlatform("ios");
const isSafari = ref<string>("");

let isNative = Capacitor.isNativePlatform();
// isNative = true;

const fnBrowserDetect = () => {
  let userAgent = navigator.userAgent;
  let browserName;

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "firefox";
  } else if (userAgent.match(/safari/i)) {
    browserName = "safari";
  } else if (userAgent.match(/opr\//i)) {
    browserName = "opera";
  } else if (userAgent.match(/edg/i)) {
    browserName = "edge";
  } else {
    browserName = "";
  }
  return browserName;
};

onMounted(async () => {
  if (Capacitor.isNativePlatform()) {
    console.log("Got to capacitor check");
    GoogleAuth.initialize({
      clientId:
        "212274388127-do3mri75u9m54m0110b551tt3t1mlfci.apps.googleusercontent.com",
      scopes: ["profile", "email"],
      grantOfflineAccess: true,
    });
  }
  isSafari.value = fnBrowserDetect();
});

const {
  mutate: login,
  onDone: afterLogin,
  onError,
} = useMutation(SocialLoginDocument);

const loginWithGoogle = async () => {
  try {
    if (!Capacitor.isNativePlatform()) {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          // debugger;
          if (credential) {
            login({
              token: credential.accessToken,
              provider: SocialProvidersEnum.Google,
            });
          } else {
            console.error("Google Auth credentials is invalid: ", credential);
          }
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    } else {
      GoogleAuth.signIn().then(
        (res) => {
          // debugger;
          if (res.authentication?.accessToken) {
            login({
              token: res.authentication.accessToken,
              provider: SocialProvidersEnum.Google,
            });
          }
        },
        (err) => {
          // debugger;
          console.error(err);
        }
      );
    }
  } catch (error) {
    // debugger;
    console.log("error: ", error);
  }
};

const loginWithApple = async () => {
  const provider = new OAuthProvider("apple.com");
  signInWithPopup(auth, provider)
    .then((result) => {
      // Apple credential
      const credential = OAuthProvider.credentialFromResult(result);
      login({
        token: credential?.idToken,
        provider: SocialProvidersEnum.Apple,
      });
    })
    .catch((error) => {
      console.log("error: ", error);
    });
};

afterLogin(({ data }) => {
  setAuthItems(data.socialLogin);
  navigationAfterAuth(data.socialLogin.user);
});

onError((error) => {
  console.log("onerror: ", error);
});
</script>

<style lang="scss" scoped>
.socials {
  width: 100%;
  margin: 24px auto 0;
}

.social-btn {
  margin: 0;
  font-size: 16px;
  line-height: 1.3;
  --box-shadow: none;
  --border-width: 1px;
  --border-style: solid;
  --background: var(--gray-700);
  --color: var(--ion-color-white);
  --border-color: var(--ion-color-primary);

  &:not(:first-child) {
    margin-top: 12px;
  }

  ion-icon {
    font-size: 24px;
    margin-right: 8px;
  }
}
</style>
