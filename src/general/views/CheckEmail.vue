<template>
  <div class="page--content">
    <div class="page--title">
      <ion-title>Activation Link Sent</ion-title>
      <ion-text>
        We sent you an email, please follow the link to activate your profile.
      </ion-text>
    </div>
    <div class="buttons">
      <ion-button
        class="button"
        expand="block"
        v-if="showEmailBtn"
        @click="onCheckEmail"
      >
        Check email
      </ion-button>
      <ion-button
        expand="block"
        :disabled="loading"
        @click="onResendEmail"
        class="button secondary"
      >
        Resend email
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonText, IonTitle, IonButton, isPlatform } from "@ionic/vue";
import { useMutation } from "@vue/apollo-composable";
import { ResendEmailConfirmationInput } from "@/generated/graphql";
import { ResendEmailConfirmationDocument } from "@/graphql/documents/authDocuments";
import { AppLauncher } from "@capacitor/app-launcher";
import { ref } from "vue";

const { mutate: resendEmailConfirmation, loading } =
  useMutation<ResendEmailConfirmationInput>(ResendEmailConfirmationDocument);

const emailAppUrl = ref<string | null>(
  isPlatform("capacitor")
    ? isPlatform("android")
      ? "com.google.android.gm"
      : isPlatform("ios")
      ? "message://"
      : null
    : null
);
const showEmailBtn = ref<boolean>(!!emailAppUrl.value);

const checkMailBoxCanOpen = async (): Promise<boolean> => {
  const { value } = await AppLauncher.canOpenUrl({
    url: emailAppUrl.value || "",
  });
  showEmailBtn.value = value;
  return value;
};

if (showEmailBtn.value) {
  checkMailBoxCanOpen();
}

const onCheckEmail = async () => {
  const canOpen = await checkMailBoxCanOpen();
  if (!canOpen) return;
  await AppLauncher.openUrl({ url: emailAppUrl.value || "" });
};

const onResendEmail = () => {
  const temporaryEmail = JSON.parse(
    localStorage.getItem("temporary_email") || "{}"
  );

  if (temporaryEmail) {
    resendEmailConfirmation({ email: temporaryEmail });
  }
};
</script>

<style scoped lang="scss">
ion-title {
  margin: 20px auto;
  font-size: 28px;
  --color: var(--gold);
}

ion-text {
  font-weight: 300;
  font-size: 14px;
  --color: var(--gray-400);
}

.page {
  &--title {
    margin: 20px auto;
    text-align: center;
    padding: 0 36px;
  }

  &--content {
    display: flex;
    margin: 0 24px;
    flex-direction: column;
    height: calc(100% - 337px - var(--ion-safe-area-top));
  }
}

.buttons {
  margin-top: auto;
  margin-bottom: calc(32px + var(--ion-safe-area-bottom));
}

.button {
  margin: 0;

  &:not(:first-child) {
    margin-top: 16px;
  }
}
</style>
