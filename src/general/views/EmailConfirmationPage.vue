<template>
  <base-auth-layout hide-navigation-menu>
    <template #left-section>
      <ion-spinner name="lines" class="spinner" />
    </template>
  </base-auth-layout>
</template>
<script setup lang="ts">
import { IonSpinner, toastController } from "@ionic/vue";
import BaseAuthLayout from "@/general/components/base/BaseAuthLayout.vue";
import { useRoute, useRouter } from "vue-router";
import { useMutation } from "@vue/apollo-composable";
import { onMounted } from "vue";
import { setAuthItems } from "@/router/middleware/auth";
import { EntitiesEnum } from "@/const/entities";
import { humanizeString } from "@/utils/textUtils";
import { VerifyEmailDocument } from "@/generated/graphql";
import navigationAfterAuth from "../helpers/navigationAfterLogin";

const route = useRoute();
const router = useRouter();
const {
  mutate: verifyEmail,
  onDone,
  onError,
} = useMutation(VerifyEmailDocument);

onMounted(() => {
  verifyEmail({ token: route.query.token });
});

onDone(({ data }) => {
  setAuthItems(data.verifyEmail);
  navigationAfterAuth(data.verifyEmail.user);
});

onError(async (error) => {
  console.error(error);
  const toast = await toastController.create({
    message: humanizeString(error.message),
    duration: 2000,
    icon: "assets/icon/info.svg",
    cssClass: "danger-toast",
  });
  toast.present();
  router.push({
    name: EntitiesEnum.CheckEmail,
  });
});
</script>
<style scoped lang="scss">
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
</style>
