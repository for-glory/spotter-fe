<template>
  <div class="socials">
    <ion-button
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
import { onMounted } from "vue";
import { SocialProvidersEnum, SocialLoginDocument } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { setAuthItems } from "@/router/middleware/auth";
import navigationAfterAuth from "../helpers/navigationAfterLogin";
import {
  SignInWithApple,
  AppleSignInResponse,
  AppleSignInErrorResponse,
  ASAuthorizationAppleIDRequest,
} from "@awesome-cordova-plugins/sign-in-with-apple";
import {
  FacebookLogin,
  FacebookError,
  FacebookLoginResponse,
} from "@capacitor-community/facebook-login";

const isIos = isPlatform("ios");

onMounted(async () => {
  if (!isPlatform("capacitor")) {
    GoogleAuth.initialize({
      clientId: process.env.VUE_APP_GOOGLE_AUTH_CLIENT_ID,
      scopes: ["profile", "email"],
      grantOfflineAccess: true,
    });
  }
});

const {
  mutate: login,
  onDone: afterLogin,
  onError,
} = useMutation(SocialLoginDocument);

const loginWithGoogle = async () => {
  try {
    const user = await GoogleAuth.signIn();
    login({
      token: user.authentication.accessToken,
      provider: SocialProvidersEnum.Google,
    });
  } catch (error) {
    console.log("error: ", error);
  }
};

const loginWithApple = async () => {
  SignInWithApple.signin({
    requestedScopes: [
      ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
      ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail,
    ],
  })
    .then((response: AppleSignInResponse) => {
      login({
        token: response.identityToken,
        provider: SocialProvidersEnum.Apple,
      });
    })
    .catch((error: AppleSignInErrorResponse) => {
      console.log("error: ", error);
    });
};

const loginWithFB = () => {
  const FACEBOOK_PERMISSIONS = ["email", "public_profile"];
  FacebookLogin.login({
    permissions: FACEBOOK_PERMISSIONS,
  })
    .then((response: FacebookLoginResponse) => {
      if (response.accessToken?.token) {
        login({
          token: response.accessToken.token,
          provider: SocialProvidersEnum.Facebook,
        });
      }
    })
    .catch((error: FacebookError) => {
      console.log("error: ", error);
    });
};

afterLogin(({ data }) => {
  setAuthItems(data.socialLogin);
  navigationAfterAuth(data.socialLogin.user);
});

onError((error) => {
  console.log("error: ", error);
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
