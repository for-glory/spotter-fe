<template>
  <div class="common-style">
    <div class="d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center gap-8">
        <ion-img :src="avatarUrl" class="w-68 h-68" />
        <div class="d-flex-col gap-2">
          <ion-text class="font-medium font-16 color-white">
            {{ name }}
          </ion-text>
          <ion-text class="font-medium font-12 color-gray">
            {{ email }}
          </ion-text>
        </div>
      </div>
      <div v-if="reviewMessage">
        <ion-icon src="assets/icon/messages.svg" class="w-24 h-24" @click="openDescriptionModal" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonModal } from "@ionic/vue";
import { defineProps, withDefaults, defineEmits } from "vue";

withDefaults(
  defineProps<{
    name?: string;
    avatarUrl?: string;
    email?: string;
    reviewMessage?: string;
  }>(),
  {
    name: 'Amina Sally',
    email: 'aminasaliat@gmail.com',
    reviewMessage: 'Had such an amazing session. She instantly picked up on the level of my fitness and adjusted the workout to suit me.',
    avatarUrl: 'assets/mock/profile.jpeg',
  }
);

const emits = defineEmits<{
  (e: 'openDescriptionModal'): void;
}>();

const openDescriptionModal = () => {
  emits('openDescriptionModal');
}
</script>

<style lang="scss" scoped>
.common-style {
  .w-24 {
    width: 24px;
  }
  .w-68 {
    width: 68px;
  }
  .h-24 {
    height: 24px;
  }
  .h-68 {
    height: 68px;
  }

  .d-flex-col {
    display: flex;
    flex-direction: column;
  }
  .gap-24 {
    gap: 24px;
  }
  .gap-12 {
    gap: 12px;
  }
  .gap-8 {
    gap: 8px;
  }
  .gap-6 {
    gap: 6px;
  }
  .gap-4 {
    gap: 4px;
  }
  .gap-2 {
    gap: 4px;
  }


  .font-bold {
    font-weight: 700;
  }
  .font-semibold {
    font-weight: 600;
  }
  .font-medium {
    font-weight: 500;
  }
  .font-light {
    font-weight: 300;
  }

  .font-12 {
    font-size: 12px;
  }
  .font-14 {
    font-size: 14px;
  }
  .font-16 {
    font-size: 16px;
  }
  .font-18 {
    font-size: 18px;
  }
  .font-20 {
    font-size: 20px;
  }
  .font-24 {
    font-size: 24px;
  }

  .color-gray {
    color: #afafaf;
  }
  .color-gold {
    color: #E1DBC5;
  }
  .color-gray-400 {
    color: var(--gray-400);
  }
  .color-white {
    color: white;
  }
  .color-fitness-white{
    color: #EFEFEF;
  }
}
ion-img{
  &::part(image) {
    border-radius: 100px;
  }
}
</style>
