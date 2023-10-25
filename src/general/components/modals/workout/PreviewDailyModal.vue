<template>
    <ion-modal 
      ref="workoutModal"
      class="modal"
      swipeToClose 
    >
      <div class="modal-content">
        <video 
          autoplay 
          :src="daily.video" 
          :poster="daily.preview"
          ref="videoRef"
          @click.stop="tooglePlay"
          class="w-100 h-100"
        >
        </video>
        <ion-icon src="assets/icon/close.svg" class="close-btn" @click="closeModal" />
        <div v-if="isSettingModalOpen" class="shadow"></div>
      </div>
    </ion-modal>
  </template>
  
  <script setup lang="ts">
  import {
    IonModal,
    IonIcon,
  } from "@ionic/vue";

  import { defineExpose, defineEmits, ref } from "vue";
  
  const workoutModal = ref<typeof IonModal | null>(null);
  const daily = ref<any>();
  const videoRef = ref<any>();
  
  const emits = defineEmits<{
    (e: "delete"): void;
  }>();

  const present = ( props: any ) => {
    daily.value = props;
    daily.value.video = `${process.env.VUE_APP_MEDIA_URL}${props.video}`;
    daily.value.preview = `${process.env.VUE_APP_MEDIA_URL}${props.preview}`;
    workoutModal?.value?.$el.present();
  };
  
  const tooglePlay = () => {
    if(videoRef.value.paused) {
      videoRef.value.play();
    } else {
      videoRef.value.pause();
    }
    videoRef.value.blur();
  };
  const isSettingModalOpen = ref<boolean>(false);
  
  const closeModal = () => {
    workoutModal.value?.$el.dismiss();
  }
  
  defineExpose({
    present,
  });
  
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
    cursor: pointer;
  }
  .shadow {
    position: absolute;
    inset: 0;
    background-color: #0000006a;
    z-index: 100;
  }
  </style>
  