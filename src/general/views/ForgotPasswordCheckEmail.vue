<template>
  <div class="page--content">
    <div class="page--title">
      <ion-title>Check your Inbox!</ion-title>
      <ion-text>
        Follow the link sent to your inbox to reset password
      </ion-text>
    </div>

    <div class="buttons">
      <ion-button @click="onCheckEmail" class="button" expand="block">
        Open Inbox
      </ion-button>
      <ion-button
        expand="block"
        :disabled="loading"
        @click="resetPassword"
        class="button secondary"
      >
        Resend email
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonText, IonTitle } from "@ionic/vue";
import { useMutation } from "@vue/apollo-composable";
import { ForgotPasswordDocument } from "@/generated/graphql";

const { mutate: forgotPassword, loading } = useMutation(ForgotPasswordDocument);

const resetPassword = () => {
  const temporaryEmail = JSON.parse(
    localStorage.getItem("temporary_email") || "{}"
  );

  if (temporaryEmail) {
    forgotPassword({ email: temporaryEmail });
  }
};

const onCheckEmail = () => {
  console.log("Open mailbox");
};
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
