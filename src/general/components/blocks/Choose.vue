<template>
  <ion-item :disabled="disabled" class="choose-place"  @click="onClick">
    <ion-text class="choose-place__label" :class="{'trainer-label-color': role === RoleEnum.Trainer}" slot="start">
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
    <ion-icon
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
  }>(),
  {
    disabled: false,
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
    color: var(--gray-400);
  }

  &__icon--start {
    padding-right: 8px;
  }
}

.trainer-label-color {
  color: #EFEFEF !important;
}
</style>
