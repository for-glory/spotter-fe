<template>
  <ion-item
    lines="none"
    class="radiobutton"
    :class="{
      'radiobutton--checked': isChecked,
      'radiobutton--light': light,
      'radiobutton__trainer': role === RoleEnum.Trainer
    }"
  >
    <slot name="icon"></slot>
    <ion-label class="radiobutton__label">{{ title }}</ion-label>
    <ion-radio slot="end" :value="value" />
  </ion-item>
</template>

<script setup lang="ts">
import { RoleEnum } from "@/generated/graphql";
import useRoles from "@/hooks/useRole";
import { IonItem, IonRadio, IonLabel } from "@ionic/vue";
import { defineProps, withDefaults } from "vue";

const { role } = useRoles();
withDefaults(
  defineProps<{
    title: string;
    value: string;
    isChecked?: boolean;
    light?: boolean;
  }>(),
  {
    light: false,
    isChecked: false,
  }
);
</script>

<style scoped lang="scss">
.radiobutton {
  font-size: 14px;
  line-height: 1.5;
  --border-radius: 8px;
  --color: var(--gray-500);
  --inner-padding-top: 0;
  --inner-padding-bottom: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  --padding-start: var(--container-offset);
  --padding-end: var(--container-offset);
  --border-width: 0.8px;
  --border-style: solid;
  --border-color: var(--gray-600);

  &--light {
    --background: var(--gray-700);
    --color: var(--ion-color-white);
    font-weight: 300;
    font-size: 14px;
    line-height: 150%;
  }

  &:not(:first-child) {
    margin-top: 16px;
  }

  &--checked {
    --color: var(--ion-color-white);
    --border-color: var(--gold);
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
  &__trainer {
    .radiobutton__label {
      font-family: "Yantramanav";
      color: var(--fitnesswhite);
    }
  }
}
</style>
