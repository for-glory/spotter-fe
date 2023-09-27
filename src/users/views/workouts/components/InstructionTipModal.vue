<template>
  <div v-if="props.isOpen" class="w-100 h-100">
    <ion-modal
      class="instruction-tip-modal"
      :is-open="props.isOpen"
      ref="modal"
      trigger="open-modal"
      :initial-breakpoint="0.4"
      :breakpoints="[0, 0.4, 1]"
      :backdrop-dismiss="true"
      @didDismiss="handleOpen"
    >
      <ion-content class="instruction-tip-content">
        <ion-label class="instruction-tip-label">Instruction Tip</ion-label>
        <ion-text color="secondary" v-html="props.instructionTip" />
      </ion-content>
    </ion-modal>
    <div v-if="props.showFooter" class="d-flex align-items-center justify-content-between w-100 footer">
      <div class="d-flex-col align-items-start" style="gap: 4px;">
        <ion-text class="font-bold font-16 color-fitness-white">{{ title }}</ion-text>
        <ion-text class="font-medium font-14 color-gray">{{ props.trainer.first_name + " " + props.trainer.last_name }}</ion-text>
      </div>
      <ion-button clas="color-dark-gray" style="flex: 1;" @click="handleAddReview" >Add review</ion-button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "WorkoutPreviewInstructionTipModal",
};
</script>

<script setup lang="ts">
import { IonModal, IonContent, IonText, IonLabel, } from "@ionic/vue";
import { defineProps, defineEmits, ref } from "vue";
import { useRouter } from "vue-router";
import { EntitiesEnum } from '@/const/entities';

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    instructionTip: string;
    title?: string;
    trainer?: any;
    showFooter?: boolean;
    id?: number;
  }>(),
  {
    showFooter: false,
  }
);

const router = useRouter();
const modal = ref<typeof IonModal>();

const emits = defineEmits<{
  (e: "visibility", isOpen: boolean): void;
}>();

const handleOpen = () => {
  emits("visibility", false);
};

const handleAddReview = () => {
  emits("visibility", false);
  modal.value?.$el.dismiss();
  router.push({
    name: EntitiesEnum.UserWriteReview,
    params: { id: props.id }
  });
}
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
.footer {
  background-color: #161616;
  position: fixed;
  bottom: 0;
  z-index: 3000000;
  padding: 20px 24px 44px 24px;
  gap: 12px;
}
.font-16 {
  font-size: 16px;
}
ion-button {
  font-weight: bold;
  font-size: 16px;
}
</style>
