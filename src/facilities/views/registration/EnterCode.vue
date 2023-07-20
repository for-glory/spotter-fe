<template>
  <base-auth-layout>
    <template #left-section>
      <div class="content">
        <div class="main">
          <div class="head">
            <ion-title class="title" color="primary">Enter code</ion-title>
            <ion-text class="font-20 grey-text">
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
  </base-auth-layout>
</template>

<script setup lang="ts">
import {
  IonTitle,
  IonText,
  IonButton,
  IonSpinner,
  toastController,
} from "@ionic/vue";
import BaseAuthLayout from "@/general/components/base/BaseAuthLayout.vue";
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
  padding: 57px 0px calc(60px + var(--ion-safe-area-bottom));
}

.head {
  margin: 0 0 32px;
}

.title {
  padding: 0;
  margin-bottom: 20px;
  color: var(--gold);
  font-family: Lato;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
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
