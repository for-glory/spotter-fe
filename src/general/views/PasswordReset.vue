<template>
  <base-layout hide-navigation-menu>
    <template #content>
      <authentication-header back-button @back="onBack" />
      <div class="page--content">
        <div class="page--title">
          <ion-title>Create your new password</ion-title>
          <ion-text> Follow reset instructions from your email </ion-text>
        </div>
        <create-new-password-form
          v-model:password="form.password"
          v-model:password_confirmation="form.password_confirmation"
          :error="error"
          :is-loading="loading"
          @handle-submit="resetPassword"
          class="forgot-password-form"
        />
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import AuthenticationHeader from "@/general/components/blocks/headers/AuthenticationHeader.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { IonText, IonTitle } from "@ionic/vue";
import { useMutation } from "@vue/apollo-composable";
import {
  RegisterInput,
  UpdateForgottenPasswordDocument,
} from "@/generated/graphql";
import { ref } from "vue";
import CreateNewPasswordForm from "@/general/components/forms/CreateNewPasswordForm.vue";
import { EntitiesEnum } from "@/const/routes";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const onBack = () => {
  router.push({ name: EntitiesEnum.Login });
};

const {
  mutate: updateForgottenPassword,
  onDone,
  loading,
  error,
} = useMutation(UpdateForgottenPasswordDocument);

const form = ref<Pick<RegisterInput, "password" | "password_confirmation">>({
  password: "",
  password_confirmation: "",
});

const token = route.params.id;

const resetPassword = (
  formData: Pick<RegisterInput, "password" | "password_confirmation">
) => {
  updateForgottenPassword({
    ...formData,
    token,
    email: JSON.parse(localStorage.getItem("temporary_email") || "{}"),
  });
};

onDone(() => {
  localStorage.removeItem("temporary_email");
  router.push({ name: EntitiesEnum.Login });
});
</script>

<style scoped lang="scss">
ion-title {
  padding: 0;
  margin: 20px auto;
  font-size: 28px;
  --color: var(--gold);
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
