<template>
  <div class="multiselect" v-if="loaded">
    <ion-item
      lines="none"
      class="checkbox"
      :key="option.id"
      v-for="option in values"
      :class="{ 'checkbox--checked': option.isChecked }"
    >
      <ion-icon
        v-if="option.iconUrl"
        :src="option.iconUrl"
        class="checkbox-group__icon"
      />
      <ion-label>{{ option?.label }}</ion-label>
      <ion-checkbox
        :modelValue="option.isChecked"
        @update:modelValue="checkboxChangeHandle($event, option)"
      >
      </ion-checkbox>
    </ion-item>
  </div>
</template>

<script lang="ts" setup>
import { CheckboxValueType } from "@/ts/types/checkbox-value";
import { IonItem, IonCheckbox, IonIcon, IonLabel } from "@ionic/vue";
import { ref, watch, defineProps, defineEmits, onMounted } from "vue";

const props = defineProps<{
  options: CheckboxValueType[];
  selected?: string[];
}>();

const emits = defineEmits<{
  (
    e: "change",
    value: (string | number | undefined)[],
    option?: CheckboxValueType
  ): void;
}>();

const loaded = ref<boolean>();

const values = ref<CheckboxValueType[]>(props.options);

watch(
  () => props.options,
  (newVal) => {
    values.value = newVal;
  }
);

onMounted(() => {
  props.options.map((option) => {
    if (props.selected) {
      option.isChecked = props.selected.indexOf(String(option.value)) > -1;
    }
  });
  loaded.value = true;
});

const checkboxChangeHandle = (
  event: boolean,
  option: CheckboxValueType
): void => {
  option.isChecked = event;
  const checkedValues = values.value
    .filter((option: CheckboxValueType) => option.isChecked)
    .map((option: CheckboxValueType) => option.value);

  emits("change", checkedValues, option);
};
</script>

<style lang="scss" scoped>
.multiselect {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -6px;
  align-items: flex-start;
  justify-content: flex-start;
}

.checkbox {
  font-size: 14px;
  line-height: 1.5;
  font-weight: 300;
  margin: 0 6px 12px;
  --min-height: 40.4px;
  --border-radius: 8px;
  --padding-top: 0;
  --padding-bottom: 0;
  --color: var(--gray-500);
  --inner-padding-top: 0;
  --inner-padding-bottom: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  --background: transparent;
  --border-width: 0.8px;
  --border-style: solid;
  --border-color: var(--gray-600);
  --padding-start: 0;
  --padding-end: 0;

  &--checked {
    --color: var(--ion-color-white);
    --border-color: var(--ion-color-primary);
  }

  ion-label {
    margin: 0;
    padding: 8px 16px;
  }

  ion-checkbox {
    margin: 0;
    --size: 0;
  }
  .checkbox-group {
    &__icon {
      margin-left: 16px;
    }
  }
}
</style>
