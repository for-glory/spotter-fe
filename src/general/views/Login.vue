<template>
  <div :class="!isNative && 'content'">
    <div class="welcome-text" :class="isNative && 'ion-padding'">
      <ion-text class="hide-if-native show-if-web">Welcome to Spotter</ion-text>
      <ion-text class="show-if-native hide-if-web">Log In or Sign Up <br />to Get Started</ion-text>
    </div>
    <login-form
      v-model:username="form.username"
      v-model:password="form.password"
      :error="error"
      :is-loading="loading"
      @handle-submit="handleSubmit"
      class="login-form"
    />
    <socials />
  </div>
</template>

<script setup lang="ts">
import { IonText, IonImg} from '@ionic/vue';
import LoginForm from "@/general/components/forms/LoginForm.vue";
import Socials from "@/general/components/Socials.vue";
import { ref } from "vue";
import { LoginDocument, LoginMutationVariables } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { setAuthItems } from "@/router/middleware/auth";
import navigationAfterAuth from "../helpers/navigationAfterLogin";
import useVerified from "@/hooks/useVerified";
import { Capacitor } from '@capacitor/core';
import { setSettings } from "@/hooks/useSettings";

let {
  mutate: login,
  onDone,
  onError,
  loading,
  error,
} = useMutation(LoginDocument);

let isNative = Capacitor.isNativePlatform();
// isNative = true;
const form = ref<LoginMutationVariables>({
  username: "",
  password: "",
});

onDone(({ data, errors }) => {
  if (!data && errors) {
    throw new Error(String(errors[0].extensions.errors.message))
  }
  
  setAuthItems(data.login);
  if (data.login.user.role === "MANAGER") {
    setSettings([{ isRoleSelected: true }]);
  }

  const { verified } = useVerified();
  if (!verified) {
    localStorage.setItem(
      "temporary_email",
      JSON.stringify(data.login.user.email)
    );
  }
  navigationAfterAuth(data.login.user)
});

onError(() => {
  form.value.password = "";
});

const handleSubmit = (formData: LoginMutationVariables) => {
  login({ ...formData });
};
</script>

<style scoped lang="scss">
.content {
  margin-top: 72px;
  display: flex;
  flex-direction: column;
  width: calc(100%);
}

.login-form {
  flex: 1 1 100%;
}

.welcome-text {
  color: var(--gold);
  font-family: Lato;
  font-size: 40px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
}

.native-app .welcome-text {
  min-height: 250px;
  height: 36%;
  max-height: 298px;
  background-image: url(/public/assets/mobile/auth-bg.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  font-family: Yantramanav;
  display: flex;
  width: 100%;

  & ion-text {
    margin-top: auto;
    font-size: 28px;
  }
}
</style>
