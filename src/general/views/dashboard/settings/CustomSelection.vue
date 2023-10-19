<template>
  <div
    class="position-relative"
    :style="{
      '--border-color': borderColor,
      '--active-bg': activeBgColor,
    }"
  >
    <div
      :class="[
        'select-container',
        {
          'client-select': role === RoleEnum.User,
          'choose-block': chooseBlock,
        },
      ]"
    >
      <div class="select-content" :class="{ active: isSelect }">
        <div class="select-wrapper" @click="isSelect = !isSelect">
          <IonLabel class="item-label">{{ label }}</IonLabel>
          <div
            class="custom-select d-flex align-items-center justify-content-between"
          >
            <IonLabel
              class="placeholder"
              v-if="placeholder && !selectedValue"
              >{{ placeholder }}</IonLabel
            >
            <IonLabel v-else>{{ selectedValue.title }}</IonLabel>
            <ion-icon
              :class="{ rotate: chooseBlock && isSelect }"
              src="assets/icon/arrow-next.svg"
            />
          </div>
        </div>
      </div>
    </div>
    <Transition v-if="isSelect">
      <div class="select-option-wrapper hide-scrollbar">
        <div class="sticky-header">
          <hr class="divider" />
        </div>
        <div
          class="select-option"
          v-for="option in props.options"
          :key="option?.value"
          :class="{ active: selectedValue?.value === option?.value }"
          @click="
            $emit('selectChange', option);
            isSelect = false;
          "
        >
          <IonLabel>{{ option.title }}</IonLabel>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IonIcon, IonLabel } from "@ionic/vue";
import useRoles from "@/hooks/useRole";
import { RoleEnum } from "@/generated/graphql";

interface SelectValue {
  title: string;
  value: string;
}

const props = withDefaults(
  defineProps<{
    label: string;
    options: SelectValue[];
    selectedValue: SelectValue;
    chooseBlock?: boolean;
    placeholder?: string;
    borderColor?: string;
    activeBgColor?: string;
  }>(),
  {
    label: "Language",
    borderColor: "var(--gray-60)",
    activeBgColor: "var(--gray-800)",
  }
);
const emit = defineEmits<{
  (e: "selectChange", value: SelectValue): void;
}>();

console.log(props);

const isSelect = ref<boolean>(false);
const { role } = useRoles();
</script>
<style scoped lang="scss">
.select-container {
  margin-top: 25px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-width: 493px;

  .select-content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    &.active {
      background: var(--active-bg);

      // .divider {
      //     display: block;
      // }
    }
  }
}

.select-wrapper {
  margin: 10px;
  cursor: pointer;

  .item-label {
    margin-bottom: 8px;
    color: var(--60, rgba(255, 255, 255, 0.6));
    font-size: 14px;
    font-weight: 500;
    display: block;
  }

  .placeholder {
    color: var(--gray-500) !important;
  }

  .custom-select {
    padding: 13px 16px;
    border: 0.5px solid var(--border-color);
    border-radius: 8px;

    ion-label {
      font-size: 14px;
      color: var(--fitnesswhite);
    }
  }
}

.rotate {
  rotate: 90deg;
}

.divider {
  background: var(--grey-text);
  margin: 16px 0;
  display: block;
  width: 100%;
}

.select-option-wrapper {
  padding: 10px;
  padding-top: 0;
  overflow: auto;
  max-height: 210px;
  position: absolute;
  z-index: 99;
  background: var(--active-bg);
  width: 100%;

  .sticky-header {
    height: 22px;
    position: sticky;
    top: 0;
    background: var(--active-bg);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .select-option {
    &.active,
    &:hover {
      background: rgba(225, 219, 197, 0.1);
      cursor: pointer;
    }

    padding: 16px;

    ion-label {
      color: var(--fitnesswhite);
      font-size: 14px;
    }
  }
}

.client-select {
  .custom-select {
    background: var(--gray-700);
  }
}

.choose-block {
  margin: 0;

  .select-content {
    padding: 5px;
  }

  .select-wrapper {
    margin: 0;

    .item-label {
      color: var(--fitnesswhite);
    }
  }
  .custom-select {
    height: 50px;
    background: var(--gray-700);

    ion-icon {
      color: var(--gray-500);
      font-size: 22px;
    }
  }
}

.position-relative {
  position: relative;
  max-width: 493px;
}
</style>
