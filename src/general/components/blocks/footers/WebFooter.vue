<template>
  <div class="buttons__container">
    <ion-button
      @click="$emit('handle-click')"
      class="submit-btn"
      :disabled="disabled"
    >
      {{ mainButtonText }}
    </ion-button>
    <ion-button
      v-if="secondaryButtonText"
      class="secondary secondary-btn"
      @click="$emit('handle-secondary-click')"
    >
      {{ secondaryButtonText }}
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { IonButton } from "@ionic/vue";
import { defineProps, defineEmits, withDefaults } from "vue";

withDefaults(
  defineProps<{
    mainButtonText: string;
    secondaryButtonText?: string;
    disabled: boolean;
  }>(),
  {
    secondaryButtonText: "",
    disabled: false,
  }
);
defineEmits<{
  (e: "handle-click"): void;
  (e: "handle-secondary-click"): void;
}>();
</script>

<style lang="scss" scoped>
.buttons {
  &__container {
    padding: 20px 24px calc(20px + var(--ion-safe-area-bottom));
  }
}

.submit-btn,
.secondary-btn {
  margin: 0;
  width: 100%;
}
</style>
