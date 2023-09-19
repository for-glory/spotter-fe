<template>
  <slot name="button"></slot>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, inject, onUnmounted } from "vue";
import { pickerController, PickerOptions } from "@ionic/vue";
import { Emitter, EventType } from "mitt";
import useRoles from "@/hooks/useRole";
import { Capacitor } from "@capacitor/core";

const { role } = useRoles();
const props = withDefaults(
  defineProps<{
    options: PickerOptions;
    name: string;
    values?: string[];
  }>(),
  {
    name: "",
  }
);

const openPicker = async () => {
  const values = props.values;
  const columns = props.options.columns.map((column, index) => {
    const options = column.options.map((option) => {
      return {
        value: option.value,
        text: option.text,
      };
    });
    return {
      name: column.name,
      options,
      selectedIndex: values
        ? column.options.findIndex((option) => option.value === values[index])
        : -1,
    };
  });

  const picker = await pickerController.create({
    buttons: props.options.buttons,
    mode: "ios",
    columns,
    cssClass: Capacitor.isNativePlatform() ? "trainer-picker" : "trainer-picker  web-trainer-picker"
  });
  await picker.present();
};

const emitter: Emitter<Record<EventType, string>> | undefined =
  inject("emitter");

emitter?.on("open-picker", (name: string) => {
  if (name === props.name) {
    openPicker();
  }
});

onUnmounted(() => {
  emitter?.off("open-picker");
});
</script>

<style lang="scss">
.picker-toolbar-button {
  .picker-button {
    font-weight: 400 !important;
  }

  &.picker-toolbar-cancel {
    .picker-button {
      color: var(--ion-color-light);
    }
  }
}

.picker-opt.picker-opt-selected {
  font-weight: 400;
  font-size: 23px;
  line-height: 28px;
  color: var(--ion-color-white);
}

.picker-opt {
  font-weight: 400;
  font-size: 21px;
  line-height: 28px;
  letter-spacing: 0.7px;
  color: #9a99a2;
}

.picker-wrapper {
  padding: 0 24px;
}

.picker-ios {
  .picker-wrapper {
    border: none;
  }

  .picker-toolbar {
    border: none;
  }

  .picker-columns {
    margin-bottom: 0 !important;

    &:before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      height: 35px;
      background-color: var(--gray-700);
      border: 0.8px solid var(--gray-600);
      border-radius: 8px;
      margin-top: -26px;
      box-sizing: border-box;
    }
  }

  .picker-above-highlight,
  .picker-below-highlight {
    background: transparent;
    border: none;
  }
}
</style>
