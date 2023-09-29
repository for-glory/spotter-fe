<template>
  <div
    class="base-toggle-container"
    :class="{ 'base-toggle-container--loading': loading, 'base-toggle-trainer': (role === RoleEnum.Trainer || role === RoleEnum.User) }"
  >
    <ion-spinner v-if="loading" name="lines" class="spinner" />
    <ion-label class="label" v-if="label">{{ label }}</ion-label>
    <div class="toggle-container">
      <div class="toggle-content">
        <div class="start">
          <IonImg v-if="img" :src="`assets/icon/${img}`" />
          <ion-text :class="{ 'font-lato': fontLato }">
            {{ content }}
          </ion-text>
        </div>
        <ion-toggle
        @ionChange="onChange($event.target.checked)"
        :checked="inputValue"
        />
      </div>
      <div v-if="description" :class="['description',  { 'active-dec': inputValue }]">
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "BaseToggle",
};
</script>

<script setup lang="ts">
import { RoleEnum } from "@/generated/graphql";
import useRoles from "@/hooks/useRole";
import { IonText, IonToggle, IonLabel, IonSpinner, IonIcon, IonImg } from "@ionic/vue";
import { defineProps, defineEmits, computed, ref } from "vue";

const { role } = useRoles();
const props = defineProps<{
  label?: string;
  value?: boolean;
  content: string;
  loading?: boolean;
  class?: string;
  img?:string
  description?:string
  fontLato?:boolean
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
  &.toggle-wrapper {
    .toggle-container {
      padding-right: 4px;
    }
  }
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
  flex-direction: column;
  gap: 14px;
  border-radius: 8px;
  padding: 8px 16px 8px;
  background: var(--gray-700);
  justify-content: space-between;

  .base-toggle-container--loading & {
    opacity: 0.5;
  }

  .description {
    color: var(--gray-500);
    font-family: Lato;
    font-size: 12px;
    font-weight: 400;
  }
}
.toggle-content {
  font-weight: 300;
  font-size: 14px;
  color: var(--ion-color-white);
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;

  .start {
    display: flex;
    gap: 8px;
    align-items: center;
    ion-img {
      width: 24px;
      height: 24px;
    }
  }
}

.spinner {
  left: 50%;
  z-index: 5;
  bottom: 10px;
  margin-left: -14px;
  position: absolute;
}
.base-toggle-trainer {
  ion-toggle {
      padding-right: 0;
  }
  .toggle-content {
    color: var(--fitnesswhite);
    font-family: "Yantramanav";
  }
}

.font-lato {
  font-family: Lato;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
}

.active-dec {
  color: var(--gold) !important;
}

</style>
