<template>
  <ion-modal
    class="instruction-tip-modal"
    :is-open="isOpen"
    ref="modal"
    trigger="open-modal"
    :initial-breakpoint="0.4"
    :breakpoints="[0, 0.4, 1]"
    :backdrop-dismiss="true"
    @didDismiss="handleOpen"
  >
    <ion-content class="instruction-tip-content">
      <ion-label class="instruction-tip-label">Instruction Tip</ion-label>
      <ion-text color="secondary" v-html="instructionTip" />
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
export default {
  name: "WorkoutPreviewInstructionTipModal",
};
</script>

<script setup lang="ts">
import { IonModal, IonContent, IonText, IonLabel } from "@ionic/vue";
import { defineProps, defineEmits } from "vue";

defineProps<{
  isOpen: boolean;
  instructionTip: string;
}>();

const emits = defineEmits<{
  (e: "visibility", isOpen: boolean): void;
}>();

const handleOpen = () => {
  emits("visibility", false);
};
</script>

<style scoped lang="scss">
.instruction-tip-modal {
  --backdrop-opacity: 0.6;
  --border-radius: 20px 20px 0 0;
  --ion-backdrop-color: var(--ion-color-black);

  &::part(handle) {
    top: 0;
    left: 0;
    right: 0;
    padding: 0;
    width: auto;
    z-index: 15;
    height: 20px;
    display: block;
    position: absolute;
    bottom: calc(100% - 20px);
    transition-duration: 0.2s;
    border-radius: 20px 20px 0 0;
    transition-timing-function: ease;
    transition-property: border-radius;
    background: var(--ion-background-color);

    &:after {
      left: 50%;
      content: "";
      bottom: 4px;
      width: 48px;
      height: 4px;
      margin-left: -24px;
      border-radius: 2px;
      position: absolute;
      pointer-events: none;
      background: rgba(255, 255, 255, 0.12);
    }
  }
}

.instruction-tip-content {
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  --padding-top: 24px;
  --padding-start: 24px;
  --padding-end: 24px;
}

.instruction-tip-label {
  display: block;
  font-size: 16px;
  margin: 0 0 16px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--ion-color-light);
}
</style>
