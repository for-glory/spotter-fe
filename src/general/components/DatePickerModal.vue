<template>
  <ion-modal ref="modal" class="modal" swipeToClose cssClass="auto-height">
    <div :class="['modal__content', { 'user-modal-content': role === RoleEnum.User }]">
      <span class="modal__closed"></span>
      <ion-label class="modal__title" v-if="role !== RoleEnum.User">
        {{ props?.options?.title || "Start date" }}
      </ion-label>
      <IonButtons v-else>
        <ion-button fill="clear" class="back-btn" @click="modal?.$el.dismiss()">
          <IonIcon src="assets/icon/arrow-back.svg"></IonIcon>
        </ion-button>
      </IonButtons>
      <base-calendar
        :selected="selectedDate"
        @change-day="dayChanged"
        :showAdditionalContent="false"
        :min="props?.options?.min"
        :max="props?.options?.max"
      />
      <ion-button expand="block" class="choose-btn" @click="chooseDate">
        Choose date
      </ion-button>
    </div>
  </ion-modal>
</template>

<script lang="ts" setup>
import { IonButton, IonButtons, IonIcon, IonLabel, IonModal } from "@ionic/vue";
import BaseCalendar from "@/general/components/base/BaseCalendar.vue";
import { defineExpose, defineEmits, ref } from "vue";
import {
  DatePickerModalResult,
  DatePickerModalOptions,
} from "@/interfaces/DatePickerModal";
import { RoleEnum } from "@/generated/graphql";
import useRoles from "@/hooks/useRole";

const modal = ref<typeof IonModal | null>(null);
const { role } = useRoles()
const emits = defineEmits<{
  (e: "cancel"): void;
  (e: "select", selected?: DatePickerModalResult): void;
}>();

const props = ref<DatePickerModalOptions>();
const selectedDate = ref<number>(Date.now());

const present = (p?: DatePickerModalOptions) => {
  props.value = p;
  selectedDate.value = p?.value || p?.options?.min || Date.now();
  modal?.value?.$el.present();
};

defineExpose({
  present,
});

const dayChanged = (event: any) => {
  selectedDate.value = new Date(event).getTime();
};

const chooseDate = () => {
  emits("select", {
    date: selectedDate.value,
    field: props.value?.field,
  });
  resetAndClose();
};

const resetAndClose = () => {
  props.value = undefined;
  selectedDate.value = Date.now();
  modal?.value?.$el.dismiss();
};
</script>

<style scoped lang="scss">
.modal {
  --ion-backdrop-opacity: 0.6;
  --ion-backdrop-color: var(--ion-color-black);

  &__content {
    background: var(--gray-800);
    border-radius: 18px 18px 0 0;
    padding: 24px 16px calc(16px + var(--ion-safe-area-bottom));
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

  .calendar {
    margin-bottom: 16px;
  }

  .choose-btn {
    margin: 0 8px;
  }
  .back-btn {
    height: 36px;
    width: 36px;
    --border-radius: 50%;
    margin-left: 0;
    margin-right: 0;
    margin-top: 0;
    margin-bottom: 5px;
  }
}

.user-modal-content {
  .choose-btn {
    color: var(--gray-700);
    font-family: Yantramanav;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
