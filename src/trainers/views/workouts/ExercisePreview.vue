<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <my-video-player
        ref="trialVideoPlayer"
        :pathUrl="trialVideo || ''"
        :photoUrl="previewUrl || ''"
        :height="800"
        :width="400"
        class="trial-video-player"
        @back="closeVideo"
        autoplay
      >
        <template #custom-header-btn v-if="workoutInstructionTip?.length">
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

  <instruction-tip-modal
    :is-open="isOpenInstructionTipModal"
    @visibility="isOpenInstructionTipModal = false"
    :instruction-tip="workoutInstructionTip"
  />
</template>

<script setup lang="ts">
import MyVideoPlayer from "@/general/components/VideoPlayer.vue";

import { IonPage, IonContent, IonButton, IonIcon } from "@ionic/vue";
import { ref, computed } from "vue";
import router from "@/router";
import { useWorkoutsStore } from "@/trainers/store/workouts";
import { useRoute } from "vue-router";
import InstructionTipModal from "@/users/views/workouts/components/InstructionTipModal.vue";

const route = useRoute();
const store = useWorkoutsStore();

const isOpenInstructionTipModal = ref(false);
const trialVideoPlayer = ref(null);

const trialVideo = computed<string>(() => exercise?.videoPath);
const previewUrl = computed<string>(() => exercise?.previewUrl);

const workoutInstructionTip = computed<string>(
  () => exercise?.description ?? ""
);

const closeVideo = () => {
  router.go(-1);
};

const exercise = store.exercises[route.params.id.toString()];

if (!exercise) {
  closeVideo();
}
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
</style>
