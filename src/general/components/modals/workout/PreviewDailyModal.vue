<template>
  <ion-modal 
    ref="workoutModal"
    class="modal"
    :is-open="isOpen" 
    backdropDismiss="false"
  >
    <div class="modal-content">
      <my-video-player
          ref="trialVideoPlayer"
          :pathUrl="daily?.video || ''"
          :photoUrl="daily?.previewUrl || ''"
          :freeDuration="duration"
          :daily="daily"
          :backBtn="false"
          @trialEnd="emits('trialEnd')"
          :autoplay="true"
        >
      </my-video-player>
      <ion-icon src="assets/icon/close.svg" class="close-btn" @click="emits('closeModal')" />
      <div v-if="isSettingModalOpen" class="shadow"></div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonIcon,
} from "@ionic/vue";
import MyVideoPlayer from "@/general/components/VideoPlayer.vue";
import { defineExpose, defineEmits, ref, computed } from "vue";

const workoutModal = ref();

const daily = computed(() => props.daily);
const isOpen = computed(() => props.isOpen);
const duration = computed(() => props.duration);

const props = defineProps<{
  daily: any;
  isOpen: boolean;
  duration: number;
}>();

const emits = defineEmits<{
  (e: "trialEnd"): void;
  (e: "closeModal"): void;
}>();

</script>

<style scoped lang="scss">
.modal {
  --ion-backdrop-opacity: 0.6;
  --ion-backdrop-color: var(--ion-color-black);
  --width: 640px;
  --height: 720px;
  .backdrop {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: #0000006a;
  }

  &__content {
    background: var(--gray-800);
    border-radius: 18px 18px 0 0;
    min-height: 60%;
    padding: 30px 0;
    position: relative;
  }

  &__closed {
    top: 12px;
    left: 50%;
    width: 48px;
    height: 4px;
    display: block;
    border-radius: 2px;
    margin-left: -24px;
    position: absolute;
    background: rgba(var(--ion-color-dark-contrast-rgb), 0.12);
  }

  &__title {
    display: block;
    margin-bottom: 16px;
    font-weight: 500;
    font-size: 16px;
    line-height: 1.5;
    color: var(--ion-color-white);
  }
}
.modal-content {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  position: relative;
}

video {
  max-height: 100%;
  cursor: pointer;
}
.box {
  background-color: #262626;
}
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.close-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 1000;
  cursor: pointer;
}
.shadow {
  position: absolute;
  inset: 0;
  background-color: #0000006a;
  z-index: 100;
}
</style>
