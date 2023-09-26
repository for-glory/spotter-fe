<template>
  <div :class="!isNative && 'register__container'">
    <div class="welcome-text" :class="isNative && 'ion-padding'">
      <ion-text class="show-if-web hide-if-native"> Sign up and Create Your Profile</ion-text>
      <ion-text class="show-if-native hide-if-web"
        >Sign up and Create <br />Your Profile</ion-text
      >
    </div>
    <registration-form
      :is-loading="loading"
      :error="error"
      @handle-submit="handleSubmit"
    />
    <socials />
  </div>
</template>

<script setup lang="ts">
import { IonText } from "@ionic/vue";
import RegistrationForm from "@/general/components/forms/RegistrationForm.vue";
import Socials from "@/general/components/Socials.vue";
import { RegisterDocument } from "@/graphql/documents/authDocuments";
import { LoginDocument, LoginMutationVariables } from "@/generated/graphql";
import { RegisterInput, RoleEnum } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { setAuthItems } from "@/router/middleware/auth";
import navigationAfterAuth from "../helpers/navigationAfterLogin";
import { Capacitor } from "@capacitor/core";

let isNative = Capacitor.isNativePlatform();
const {
  mutate: register,
  onDone,
  loading,
  error,
} = useMutation(RegisterDocument);

let { mutate: login, onDone: loginDone, onError } = useMutation(LoginDocument);

const onBack = () => {
  router.go(-1);
};

const handleSubmit = async (
  form: Pick<
    RegisterInput,
    "email" | "first_name" | "last_name" | "password" | "password_confirmation"
  >
) => {
  await register({ ...form, role: RoleEnum.User });
  localStorage.setItem("temporary_email", JSON.stringify(form.email));
  await login({ username: form.email, password: form.password });
};

const router = useRouter();

onDone(({ data, errors }) => {
  if (data) {
    // router.push({
    //   name: EntitiesEnum.CheckEmail,
    // });
  } else if (errors) {
    let error: any = errors;

    if (error[0].extensions.validation == "unique") {
      throw new Error(error[0].message);
    }
  }
});

loginDone(({ data, errors }) => {
  if (!data && errors) {
    throw new Error(String(errors[0].extensions.reason));
  }
  setAuthItems(data.login);

  router.push({
    name: EntitiesEnum.CheckEmail,
  });
});
</script>

<style scoped lang="scss">
.register__container {
  display: flex;
  flex-direction: column;
  width: calc(100%);
  margin-top: 5rem;
}

.registration-form {
  flex: 1 1 100%;
}

.welcome-text {
  color: var(--gold);
  font-family: Lato;
  font-size: 3rem;
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
