<template>
  <div>
    <ion-title class="title">
      Connected Services
    </ion-title>
    <div class="content-box ">
      <ion-title class="content-box__title">Sign in with Google</ion-title>
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex">
          <ion-icon slot="icon-only" src="assets/icon/google-colors.svg" class="custom-icon"></ion-icon>
          <div class="column-box">
            <ion-text>Sign into  Spotter with one click</ion-text>
            <div class="d-flex align-items-center justify-content-center">
              <ion-icon slot="icon-only" src="assets/icon/checkmark-circle-green.svg"></ion-icon>
              <ion-label>You’re signed in with nickfox@gmail.com</ion-label>
            </div>
          </div>
        </div>
        <ion-button expand="block" fill="outline">
          Disconnect
        </ion-button>
        <!-- <ion-button expand="block" class="social-btn">
          <ion-icon slot="icon-only" src="assets/icon/google-colors.svg"></ion-icon>
          Continue with Google
        </ion-button> -->
      </div>
    </div>
    <div class="content-box">
      <ion-title class="content-box__title">Sign in with Google</ion-title>
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex">
          <ion-icon slot="icon-only" src="assets/icon/apple.svg" class="custom-icon"></ion-icon>
          <div class="column-box">
            <ion-text>Sign into  Spotter with one click</ion-text>
            <div class="d-flex align-items-center justify-content-center">
              <!-- <ion-icon slot="icon-only" src="assets/icon/check-mark.svg" /> -->
              <ion-label>You’re not signed in with nickfox@gmail.com</ion-label>
            </div>
          </div>
        </div>
        <ion-button
          expand="block"
          class="social-btn"
        >
          <ion-icon slot="icon-only" src="assets/icon/apple.svg"></ion-icon>
          Continue with Apple
        </ion-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, ref, inject } from "vue";
import {
	IonTitle,
  IonButton,
  IonLabel,
  IonInput,
  PickerColumnOption,
  PickerOptions,
	IonGrid,
	IonRow,
	IonCol
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { minutesDuration } from "@/const/minutes-durations";
import { useField } from "vee-validate";
import { EntitiesEnum } from "@/const/entities";
import { useWorkoutsStore } from "../../../../trainers/store/workouts";
import { requiredFieldSchema } from "@/validations/authValidations";
import WheelPicker from "@/general/components/blocks/WheelPicker.vue";
import { v4 as uuidv4 } from "uuid";
import { FilePreloadDocument } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { dataURItoFile } from "@/utils/fileUtils";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import PhotoLoader from "@/general/components/blocks/PhotoLoader.vue";
import { Emitter, EventType } from "mitt";

const percentLoaded = ref(0);

const router = useRouter();

const store = useWorkoutsStore();

</script>

<style lang="scss" scoped>

.title {
  padding: 0;
  font-size: 28px;
  line-height: 1.3;
  font-weight: 400;
  margin-bottom: 24px;
}
.top-buttons {
  display: flex;
  justify-content: space-between;
}
.dashboard-btn {
  margin-top: 10px;
}
.content-box {
  background-color: #0000001a;
  margin-top: 20px;
  margin-bottom: 20px;
  padding-top: 23px;
  padding-left: 35px;
  padding-right: 6px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  &__top {
    display: flex;
    padding-right: 13px;
  }

  &__title {
    padding: 0;
  }

}
.column-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.text-value {
  color: var(--grey-text);
  background-color: var(--gray-600);
  font: 600 18px/1 var(--ion-font-family);
}
.custom-icon {
  font-size: 40px;
  margin-right: 14px;
}
.social-btn {
  margin: 0;
  font-size: 16px;
  line-height: 1.3;
  --box-shadow: none;
  --border-width: 1px;
  --border-style: solid;
  --background: var(--gray-700);
  --color: #ffffff6a;
  --border-color: var(--gray-600);
  font: 500 14px/1 var(--ion-font-family);

  ion-icon {
    color: white;
    font-size: 20px;
    margin-right: 8px;
  }
}

ion-label {
  font: 400 14px/1 var(--ion-font-family);
}
ion-button {
  font: 500 14px/1 var(--ion-font-family);
  max-height: 36px;
}
</style>
