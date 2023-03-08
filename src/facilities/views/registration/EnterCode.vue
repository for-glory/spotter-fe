<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn @back="onBack" />
    </template>
    <template #content>
      <div class="content">
        <div class="main">
          <div class="head">
            <ion-title class="title" color="primary">Enter code</ion-title>
            <ion-text color="secondary">
              Enter the code sent to your email to login
            </ion-text>
          </div>
          <div class="form-row">
            <base-input
              :max-length="8"
              v-model:value="code"
              placeholder="Enter code"
              :disabled="isCodeOnChecking"
              label="Secret code can have up to 8 symbols"
            />
          </div>
        </div>
        <div class="buttons">
          <ion-button
            expand="block"
            @click="checkCodeHandle"
            :disabled="code.length < 8 || isCodeOnChecking"
          >
            <template v-if="!isCodeOnChecking">Next</template>
            <ion-spinner v-else name="lines" class="spinner" />
          </ion-button>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import {
  IonTitle,
  IonText,
  IonButton,
  IonSpinner,
  toastController,
} from "@ionic/vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useLazyQuery } from "@vue/apollo-composable";
import { CheckOrganizationRegistrationCodeDocument } from "@/generated/graphql";

const router = useRouter();

const code = ref<string>("");

const onBack = () => {
  router.go(-1);
};

const {
  load: checkCode,
  onResult: codeCheckedSuccess,
  onError: codeCheckedError,
  loading: isCodeOnChecking,
} = useLazyQuery(CheckOrganizationRegistrationCodeDocument, {
  code: code.value,
});

localStorage.removeItem("organization");

codeCheckedSuccess((response) => {
  localStorage.setItem(
    "organization",
    JSON.stringify({
      ...response.data.checkOrganizationRegistrationCode,
      registration_code: code.value,
    })
  );
  router.push({
    name: EntitiesEnum.CreateFacilityType,
  });
});

codeCheckedError(async () => {
  const toast = await toastController.create({
    message: "Entered code is invalid. Try again.",
    duration: 2000,
    icon: "assets/icon/info.svg",
    cssClass: "danger-toast",
  });
  toast.present();
  code.value = "";
});

const checkCodeHandle = () => {
  checkCode(CheckOrganizationRegistrationCodeDocument, {
    code: code.value,
  });
};
</script>

<style scoped lang="scss">
.content {
  display: flex;
  min-height: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding: 57px 24px calc(32px + var(--ion-safe-area-bottom));
}

.head {
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  max-width: 260px;
  text-align: center;
  margin: 0 auto 32px;
}

.title {
  padding: 0;
  font-size: 28px;
  line-height: 1.3;
  font-weight: 400;
  margin-bottom: 20px;
}

.buttons {
  .button {
    margin: 0;

    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}
</style>
