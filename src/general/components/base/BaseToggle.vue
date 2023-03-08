<template>
  <div
    class="base-toggle-container"
    :class="{ 'base-toggle-container--loading': loading }"
  >
    <ion-spinner v-if="loading" name="lines" class="spinner" />
    <ion-label class="label" v-if="label">{{ label }}</ion-label>
    <div class="toggle-container">
      <ion-text class="toggle-content">
        {{ content }}
      </ion-text>
      <ion-toggle
        @ionChange="onChange($event.target.checked)"
        :checked="inputValue"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "BaseToggle",
};
</script>

<script setup lang="ts">
import { IonText, IonToggle, IonLabel, IonSpinner } from "@ionic/vue";
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps<{
  label?: string;
  value?: boolean;
  content: string;
  loading?: boolean;
}>();

const emits = defineEmits<{
  (e: "change", updatedValue: boolean): void;
  (e: "update:value", value: boolean): void;
}>();

const onChange = (value: boolean) => {
  emits("change", value);
  emits("update:value", value);
};

const inputValue = computed({
  get() {
    return props.value;
  },
  set(updatedValue: boolean) {
    emits("update:value", updatedValue);
  },
});
</script>

<style scoped lang="scss">
.base-toggle-container {
  position: relative;
}

ion-toggle {
  height: 28px;
  width: 48px;
  padding-bottom: 0;
  padding-top: 0;
  --handle-height: 24px;
  --handle-width: 24px;
  --handle-spacing: 3px;
  --background: var(--gray-600);
  --background-checked: var(--gold);
  --handle-background: var(--gray-700);
  --handle-background-checked: var(--gray-700);
}
.toggle-container {
  display: flex;
  min-height: 48px;
  flex-direction: row;
  border-radius: 8px;
  align-items: center;
  padding: 8px 16px 8px;
  background: var(--gray-700);
  justify-content: space-between;

  .base-toggle-container--loading & {
    opacity: 0.5;
  }
}
.toggle-content {
  font-weight: 300;
  font-size: 14px;
  color: var(--ion-color-white);
}

.spinner {
  left: 50%;
  z-index: 5;
  bottom: 10px;
  margin-left: -14px;
  position: absolute;
}
</style>
