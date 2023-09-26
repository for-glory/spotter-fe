<template>
  <ion-page v-if="trialMode">
    <ion-content :fullscreen="true">
      <ion-spinner v-if="loadingDaily" name="lines" class="spinner" />
      <my-video-player
        ref="trialVideoPlayer"
        v-else
        :pathUrl="trialVideo || ''"
        :photoUrl="previewUrl || ''"
        :height="800"
        :width="400"
        :freeDuration="10"
        class="trial-video-player"
        @back="closeVideo"
        @ended="videoEndedHandle"
        @trialEnd="onTrialEnd"
        autoplay
      >
        <template #custom-header-btn>
          <ion-button
            @click="isOpenInstructionTipModal = !isOpenInstructionTipModal"
            class="header-btn"
          >
            <ion-icon src="assets/icon/info.svg"></ion-icon>
          </ion-button>
        </template>
      </my-video-player>
    </ion-content>
  </ion-page>

  <blurred-screen-modal
    :is-open="isOpenBlurredScreenModal"
    :preview-url="previewUrl"
    @visibility="isOpenBlurredScreenModal = false"
    @watch-trial-video="trialMode = true"
    @purchase-daily="purchaseWorkout"
    :disabled="addToCartLoading"
  />

  <instruction-tip-modal
    :is-open="isOpenInstructionTipModal"
    @visibility="isOpenInstructionTipModal = false"
    :instruction-tip="workoutInstructionTip"
  />
</template>

<script lang="ts">
export default {
  name: "WorkoutPreview",
};
</script>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  AddToCartDocument,
  AddToCartPurchasableEnum,
  WorkoutDocument,
} from "@/generated/graphql";
import MyVideoPlayer from "@/general/components/VideoPlayer.vue";

import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  toastController,
} from "@ionic/vue";
import { ref, computed } from "vue";
import InstructionTipModal from "./components/InstructionTipModal.vue";
import BlurredScreenModal from "./components/BlurredScreenModal.vue";
import { EntitiesEnum } from "@/const/entities";
import router from "@/router";

const trialMode = ref(true);
const isOpenInstructionTipModal = ref(false);
const isOpenBlurredScreenModal = ref(false);
const trialVideoPlayer = ref(null);

const { mutate: addToCartMutation, loading: addToCartLoading } =
  useMutation(AddToCartDocument);

const route = useRoute();

const { result, onResult: gotWorkout, loading: loadingDaily } = useQuery(WorkoutDocument, {
  id: route.params.id,
});

gotWorkout((response) => {
  if (response.data.workout.was_ordered_by_me) {
    isOpenBlurredScreenModal.value = isOpenInstructionTipModal.value = false;
    router.push({
      name: EntitiesEnum.UserWorkouts,
    });
  }
});

const trialVideo = computed<string>(
  () => result?.value?.workout?.video ?? ""
);
const previewUrl = computed<string>(
  () => result?.value?.workout?.previewUrl ?? ""
);
const workoutInstructionTip = computed<string>(
  () => result?.value?.workout?.description ?? ""
);

const onTrialEnd = () => {
  isOpenBlurredScreenModal.value = true;
};

const closeVideo = () => {
  trialMode.value = false;
  isOpenBlurredScreenModal.value = true;
};

const purchaseWorkout = () => {
  addToCartMutation({
    input: {
      purchasable_id: route.params.id,
      purchasable: AddToCartPurchasableEnum.Workout,
    },
  })
    .then((res) => {
      isOpenBlurredScreenModal.value = false;
      router.push({
        name: EntitiesEnum.WorkoutOrder,
        params: {
          id: route.params.id,
        },
        query: {
          cart_id: res?.data?.addToCart?.id,
        },
      });
    })
    .catch(async () => {
      const toast = await toastController.create({
        message: "Something went wrong. Try again.",
        duration: 2000,
        icon: "assets/icon/info.svg",
        cssClass: "warning-toast",
      });
      toast.present();
    });
};

const videoEndedHandle = () => {
  purchaseWorkout();
};
</script>

<style scoped lang="scss">
.trial-video-player {
  width: auto;
  height: 100%;
}

.blurred-bg {
  opacity: 0.5;
  filter: blur(8px);
  -webkit-filter: blur(8px);
  padding: 0;
  margin: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  /* background: no-repeat center/cover url(https://spotter-dev-space.sfo3.cdn.digitaloceanspaces.com/workout-preview/6351c7f468639.png) */
}

.header {
  top: 0;
  left: 0;
  right: 0;
  position: absolute;
}

ion-modal,
ion-content {
  background: transparent;
  --background: transparent;
}

.blurred-modal {
  opacity: 0.7;
  filter: blur(10px);
}

.header-btn {
  height: 32px;
  margin: 0 5px;
  font-size: 24px;
  display: block;
  min-width: 32px;
  color: var(--ion-color-light);
  --border-radius: 50% !important;
  --icon-font-size: 24px;
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  --icon-padding-bottom: 0;
  --icon-padding-end: 0;
  --icon-padding-start: 0;
  --icon-padding-top: 0;
  --min-height: 32px;
  --min-width: 32px;
  --background: rgba(var(--ion-color-black-rgb), 0.12);

  ion-icon {
    font-size: 1em;
  }
}

.modal-buttons {
  left: 0;
  right: 0;
  bottom: 0;
  padding-bottom: calc(20px + var(--ion-safe-area-bottom));

  .button {
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 0;

    &:first-child {
      margin-top: 0;
    }

    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
</style>
