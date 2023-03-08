<template>
  <div class="radiobutton__group" v-if="options?.length">
    <ion-radio-group @ionChange="onChange" :value="value?.id">
      <ion-item
        lines="none"
        class="radiobutton"
        :key="option?.id || index"
        v-for="(option, index) in options"
        :class="{ 'radiobutton--checked': value?.name === option?.name }"
      >
        <ion-label>{{ option?.name }}</ion-label>
        <ion-radio slot="end" :value="option.id" />
      </ion-item>
    </ion-radio-group>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { BodyPart, WorkoutType } from "@/generated/graphql";
import { IonRadioGroup, IonItem, IonRadio, IonLabel } from "@ionic/vue";
import {
  IonRadioGroupCustomEvent,
  RadioGroupChangeEventDetail,
} from "@ionic/core";

const props = defineProps<{
  options: WorkoutType[] | BodyPart[] | [];
  value: WorkoutType | null;
}>();

const emits = defineEmits<{
  (e: "on-change", value: WorkoutType[] | BodyPart[]): void;
}>();

const onChange = (
  ev: IonRadioGroupCustomEvent<RadioGroupChangeEventDetail<WorkoutType>>
) => {
  emits(
    "on-change",
    props.options.find(
      (option: WorkoutType | BodyPart) => option.id == ev.target.value
    )
  );
};
</script>

<style scoped lang="scss">
.radiobutton {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  --padding-top: 0;
  --padding-bottom: 0;
  --min-height: 46px;
  --border-radius: 8px;
  --color: var(--gray-500);
  --inner-padding-top: 0;
  --inner-padding-bottom: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  --background: var(--gray-700);
  --padding-start: var(--container-offset);
  --padding-end: var(--container-offset);
  --border-width: 0.8px;
  --border-style: solid;

  &:not(:first-child) {
    margin-top: 16px;
  }

  &--checked {
    --color: var(--white);
    --border-color: var(--ion-color-primary);
  }

  ion-label {
    margin-top: 12px;
    margin-bottom: 12px;
  }

  ion-radio {
    width: 18px;
    height: 18px;
    border-width: 1.8px;
    margin: 3px 3px 3px 20px;
    --color: var(--ion-color-medium);
    --mark-width: 12px;
    --mark-height: 9px;

    &::part(mark) {
      background-position: 50% 50%;
      background-repeat: no-repeat;
      width: calc(100% + var(--border-width));
      height: calc(100% + var(--border-width));
      background-size: var(--mark-width) var(--mark-height);
      background-image: url(/public/assets/icon/check-mark.svg);
    }
  }
}
</style>
