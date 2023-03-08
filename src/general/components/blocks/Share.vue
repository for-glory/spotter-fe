<template>
  <ion-button @click="share" class="share-btn">
    <ion-icon src="assets/icon/share.svg" />
  </ion-button>
</template>

<script setup lang="ts">
import { IonIcon, IonButton } from "@ionic/vue";
import { defineEmits } from "vue";

const emits = defineEmits<{
  (e: "share"): void;
}>();

const share = () => {
  emits("share");
};
</script>

<style scoped lang="scss">
.share-btn {
  margin: 0;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  line-height: 1;
  font-size: 24px;
  --border-radius: 50%;
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 0;
  --padding-end: 0;

  ion-icon {
    line-height: 1;
    font-size: 1em;
  }
}
</style>
