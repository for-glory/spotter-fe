<template>
 <div class="banner__background-image hide-if-web">
        <ion-icon id="header" @click="onBack" src="assets/icon/arrow-back.svg" />
        <img class="banner" src="assets/backgrounds/forget-banner.png" alt="">
      </div>
  <div class="page--content">
    <!-- <ion-icon id="header" @click="onBack" src="assets/icon/arrow-back.svg" />  -->
    <div class="page--title">
   <ion-title> Uh oh! Forgot your password?</ion-title>
      <ion-text>
        Don't sweat it! Enter your email below to receive instructions to reset
        your password1
      </ion-text>
    </div>
    <forgot-password-form
      v-model:email="form.email"
      :error="error"
      :is-loading="loading"
      @handle-submit="resetPassword"
      class="forgot-password-form"
    />
  </div>
</template>

<script setup lang="ts">
import { IonText, IonTitle } from "@ionic/vue";
import { useMutation } from "@vue/apollo-composable";
import {
  ForgotPasswordMutationVariables,
  ForgotPasswordDocument,
} from "@/generated/graphql";
import { ref } from "vue";
import ForgotPasswordForm from "@/general/components/forms/ForgotPasswordForm.vue";
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";

const router = useRouter();

const {
  mutate: forgotPassword,
  onDone,
  loading,
  error,
} = useMutation(ForgotPasswordDocument);

const form = ref<ForgotPasswordMutationVariables>({
  email: "",
});

const onBack = () => {
  router.go(-1);
};

const resetPassword = (formData: ForgotPasswordMutationVariables) => {
  forgotPassword({ ...formData });
};


onDone(() => {
  localStorage.setItem("temporary_email", JSON.stringify(form.value.email));
  router.push({ name: EntitiesEnum.ForgotPasswordCheckEmail });
});
</script>

<style scoped lang="scss">
ion-title {
  padding: 0;
  margin: 20px auto;
  font-size: 20px;
  --color: var(--gold);
}

#header {
position: absolute;
left: 3%;
top: 7%;
}

.banner {
  width: -webkit-fill-available;
}

ion-text {
  display: block;
  margin: 0 auto;
  font-weight: 300;
  font-size: 14px;
  max-width: 300px;
  --color: var(--gray-400);
}

.page {
  &--title {
    text-align: center;
    margin-top:5%;
    margin: 20px auto 32px;
  }

  &--content {
    display: flex;
    margin: 0 24px;
    flex-direction: column;
    height: calc(100% - 337px - var(--ion-safe-area-top));
  }
}

.forgot-password-form {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
