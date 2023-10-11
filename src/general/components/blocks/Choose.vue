<template>
  <ion-item :disabled="disabled" class="choose-place"  @click="onClick" :class="{'web-item': isWebItem, 'light-item': isLightItem, 'in-active': isInactive, 'active': isActive, 'font-lato-bold': fontLatoBold, 'dark-value': webEventItem, 'item-border': addBorder }" :fill="itemOutline ? 'outline' : undefined" :lines="isWebItem ? 'none' : undefined"
   :style="{
    '--end-icon-color': endIconColor,
    '--item-border': borderColor
   }">
    <ion-text class="choose-place__label" :class="{'trainer-label-color': role === RoleEnum.Trainer, 'danger-title': dangerTitle}" slot="start">
      <ion-icon
        v-if="icon"
        :src="`assets/icon/${icon}.svg`"
        class="choose-place__icon--start"
      />
      {{ title }}
    </ion-text>
    <ion-text class="choose-place__value" :class="{'native-app': role === RoleEnum.Trainer }">
      {{ value }}
    </ion-text>
    <ion-icon v-if="detailIcon"
      class="choose-place__icon"
      slot="end"
      src="assets/icon/arrow-next.svg"
    />
  </ion-item>
</template>

<script lang="ts">
export default {
  name: "ChooseBlock",
};
</script>

<script setup lang="ts">
import { IonItem, IonText, IonIcon } from "@ionic/vue";
import { defineProps, defineEmits, withDefaults } from "vue";
import useRoles from "@/hooks/useRole";
import { RoleEnum } from "@/generated/graphql";

const { role } = useRoles();

withDefaults(
  defineProps<{
    title: string;
    value?: string;
    icon?: string;
    disabled?: boolean;
    isWebItem?: boolean;
    itemOutline?: boolean;
    isLightItem?: boolean;
    detailIcon?: boolean;
    dangerTitle?:boolean;
    isInactive?: boolean;
    isActive?:boolean;
    fontLatoBold?: boolean;
    webEventItem?: boolean;
    addBorder?: boolean;
    endIconColor?:string
    borderColor?:string
  }>(),
  {
    disabled: false,
    isWebItem: false,
    itemOutline: false,
    isLightItem: false,
    detailIcon: true,
    isInactive: false,
    isActive: false,
    fontLatoBold: false,
    webEventItem: false,
    addBorder: false,
    endIconColor: "var(--gray-400)",
    borderColor: "var(--gray-600)"
  }
);

const emits = defineEmits<{
  (e: "handle-click"): void;
}>();

const onClick = () => {
  emits("handle-click");
};
</script>

<style scoped lang="scss">
.choose-place {
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  --background: var(--gray-700);
  --border-radius: 8px;
  --inner-padding-start: 14px;
  --inner-padding-end: 14px;
  font-family: "Yantramanav";
  &::part(native){
    border-radius: 8px;
  }
  &.web-item {
    --background: transparent;
    // --border-color: var(--gold);
  }

  &__label {
    margin-inline-end: 4px;
    color: var(--ion-color-white);
  }

  &__value {
    flex: 1 1 100%;
    display: block;
    overflow: hidden;
    text-align: right;
    white-space: nowrap;
    align-items: center;
    color: var(--gray-400);
    text-overflow: ellipsis;
    margin-inline-start: 4px;
  }

  &__icon {
    width: 1em;
    flex-shrink: 0;
    line-height: 1;
    font-size: 24px;
    margin-right: 2px;
    margin-left: 4px;
    color: var(--end-icon-color);
  }

  &__icon--start {
    padding-right: 8px;
  }
}

.trainer-label-color {
  color: #EFEFEF !important;
}

.light-item {
  .choose-place__value, 
  .choose-place__label {
      color: var(--fitnesswhite);
      font-family: Lato !important;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
    }
}

.danger-title {
  color: var(--color-red);
  font-family: Lato;
  font-size: 14px;
  font-weight: 300;
}
.in-active {
  .choose-place {
    &__label {
      color: var(--gray-500);
      font-size: 14px;
      font-weight: 400;
    }
    &__value {
      font-family: Lato;
      color: var(--gold);
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
    }
  }
}

.active {
  .choose-place {
    &__label {
      color: var(--fitnesswhite) !important;
    }
  }
}

.font-lato-bold {
    border: 1px solid rgba(255, 255, 255, 0.60);
    border-radius: 8px;
    .choose-place__value, .choose-place__label {
      font-family: Lato !important;
      color: var(--fitnesswhite) !important;
      font-weight: 400 !important;

    }
}

.dark-value {
  .choose-place__label {
    color: var(--gray-500) !important;
  }
  .choose-place__value {
    color: var(--gray-500);
  }
}

.item-border {
  &::part(native){
    border: 1px solid var(--item-border);
  }
}

</style>
