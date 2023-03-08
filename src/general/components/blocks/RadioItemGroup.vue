<template>
  <div v-if="options?.length">
    <ion-radio-group
      @ionChange="onChange"
      :value="value?.id"
      class="radio-item-group"
    >
      <ion-item
        lines="none"
        class="radio-item"
        :key="option?.id || index"
        v-for="(option, index) in options"
        :class="{ 'radio-item--checked': value?.name === option?.name }"
      >
        {{ option?.name }}
        <ion-radio :value="option.id" class="radio-input" />
      </ion-item>
    </ion-radio-group>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { WorkoutType } from "@/generated/graphql";
import { IonRadioGroup, IonItem, IonRadio } from "@ionic/vue";
import {
  IonRadioGroupCustomEvent,
  RadioGroupChangeEventDetail,
} from "@ionic/core";

const props = defineProps<{
  options: WorkoutType[] | [];
  value: WorkoutType | null;
}>();

const emits = defineEmits<{
  (e: "on-change", value: WorkoutType[]): void;
}>();

const onChange = (
  ev: IonRadioGroupCustomEvent<RadioGroupChangeEventDetail<WorkoutType>>
) => {
  emits(
    "on-change",
    props.options.find((option: WorkoutType) => option.id == ev.target.value)
  );
};
</script>

<style scoped lang="scss">
.radio-item-group {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -6px;
  align-items: flex-start;
  justify-content: flex-start;
}
.radio-item {
  font-size: 14px;
  line-height: 1.5;
  font-weight: 300;
  margin: 0 6px 12px;
  --min-height: 21px;
  --border-radius: 8px;
  --padding-top: 10.5px;
  --padding-bottom: 10.5px;
  --color: var(--gray-500);
  --inner-padding-top: 0;
  --inner-padding-bottom: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  --background: transparent;
  --border-width: 0.8px;
  --border-style: solid;
  --border-color: var(--gray-600);
  --padding-start: var(--container-offset);
  --padding-end: var(--container-offset);

  &--checked {
    --color: var(--ion-color-white);
    --border-color: var(--ion-color-primary);
  }
}

.radio-input {
  width: 100%;
  height: 100%;
}

ion-radio {
  &:first-child {
    opacity: 0;
    position: absolute;
    width: 100%;
  }
}
</style>
