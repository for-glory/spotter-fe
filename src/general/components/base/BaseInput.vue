<template>
  <div class="base-input-container" :class="role === RoleEnum.Trainer ? 'form-row__input' : ''">
    <ion-label class="label" v-if="label">{{ label }}</ion-label>
    <transition name="border">
      <ion-item
        :disabled="disabled"
        :class="{ 'ion-invalid': errorMessage }"
        class="input-container"
        lines="none"
      >
        <ion-input
          v-if="rows <= 1"
          v-model="inputValue"
          :type="type"
          :placeholder="placeholder"
          :required="required"
          :maxlength="maxLength"
          @ionChange="inputChangeHandle"
        />
        <ion-textarea
          :auto-grow="autoGrow"
          v-model="inputValue"
          :placeholder="placeholder"
          :required="required"
          :maxlength="maxLength"
          :rows="rows"
          @ionChange="inputChangeHandle"
          v-else
        />
      </ion-item>
    </transition>
    <transition>
      <ion-note v-if="errorMessage">
        {{ errorMessage }}
      </ion-note>
    </transition>
  </div>
</template>

<script lang="ts">
export default {
  name: "BaseInput",
};
</script>

<script setup lang="ts">
import { RoleEnum } from "@/generated/graphql";
import useRoles from "@/hooks/useRole";
import {
  IonItem,
  IonInput,
  IonTextarea,
  IonNote,
  IonLabel,
  InputCustomEvent,
  TextareaCustomEvent,
} from "@ionic/vue";
import { defineProps, defineEmits, computed, withDefaults } from "vue";

const props = withDefaults(
  defineProps<{
    value: string;
    disabled?: boolean;
    placeholder?: string;
    errorMessage?: string;
    required?: boolean;
    label?: string;
    type?:
      | "date"
      | "email"
      | "month"
      | "number"
      | "password"
      | "search"
      | "tel"
      | "text"
      | "time";
    rows?: number;
    maxLength?: number;
    autoGrow?: boolean;
  }>(),
  {
    placeholder: "",
    type: "text",
    disabled: false,
    value: "",
    rows: 1,
    autoGrow: false,
  }
);
const { role } = useRoles();
const emits = defineEmits<{
  (e: "update:value", updatedValue: string): void;
  (e: "change", updatedValue: string | undefined | null): void;
}>();

const inputValue = computed({
  get() {
    return props.value;
  },
  set(updatedValue: string) {
    emits("update:value", updatedValue);
  },
});

const inputChangeHandle = (event: InputCustomEvent | TextareaCustomEvent) => {
  emits("change", event.detail.value);
};
</script>

<style scoped lang="scss">
.base-input-container {
  margin-bottom: 16px;
}

ion-item.input-container {
  --color: var(--ion-color-white);
  --background: var(--gray-700);
  --border-radius: 8px;
  --border-width: 1px;
  --border-color: var(--gray-600);
  --highlight-color-focused: var(--gray-500);
  --padding-top: 0;
  --padding-bottom: 0;
  --min-height: 46px;
  font-size: 12px;

  &.item-has-focus {
    --border-color: var(--gray-500);
  }

  &.item-has-focus.ion-invalid {
    --border-color: var(--ion-color-danger);
  }

  &.ion-invalid {
    --border-color: var(--ion-color-danger);
    --transition: border-color 0.5s ease-in;
  }
}

ion-input,
ion-textarea {
  --placeholder-color: var(--gray-500);
  padding: 0;
  font-size: 14px;
  line-height: 1.5;
}

ion-input {
  min-height: 36px;
  max-height: 36px;
}

ion-textarea {
  margin: 0;
  --padding-top: 12px;
  --padding-bottom: 12px;
}

input::placeholder {
  font-size: 28px;
}

ion-note {
  margin-bottom: 2px;
  font-size: 12px;
  padding: 0 16px;
  --color: var(--ion-color-danger);
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.form-row__input {
  ion-label {
    font-family: "Yantramanav";
  }
  &-web {
    ion-label {
      font-family: "Lato";
      color: var(--fitnesswhite);
    }
  }
  ion-item {
    ion-input {
      font-family: "Yantramanav";
      font-weight: 300;
      --placeholder-opacity: 1;
      --color: var(--fitnesswhite);
    }
  }
}
</style>
