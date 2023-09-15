<template>
  <div class="common-style">
    <div class="d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center gap-8">
        <ion-img :src="avatarUrl" class="" />
        <div class="d-flex-col gap-2">
          <ion-text class="font-medium font-16 color-white">
            {{ name }}
          </ion-text>
        </div>
      </div>
      <div v-if="hasMessage">
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
    hasMessage?: boolean;
  }>(),
  {
    name: 'Amina Sally',
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
}
ion-img{
  &::part(image) {
    border-radius: 100px;
    width: 68px !important;
    height: 68px !important;
  }
}
</style>
