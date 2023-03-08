<template>
  <base-form class="authentication-form" @submit.prevent="onSubmit">
    <base-input
      v-model:value="emailInput"
      :error-message="emailInputError"
      :disabled="isLoading"
      type="email"
      placeholder="Enter your email"
    />
    <ion-button
      :disabled="isLoading || !isValidForm"
      class="button--submit"
      type="submit"
      expand="block"
    >
      Update
    </ion-button>
    <transition>
      <ion-text v-if="errorMessage" class="error" color="danger">
        {{ errorMessage }}
      </ion-text>
    </transition>
  </base-form>
</template>

<script setup lang="ts">
import BaseInput from "@/general/components/base/BaseInput.vue";
import BaseForm from "@/general/components/base/BaseForm.vue";
import { IonButton, IonText } from "@ionic/vue";
import { defineProps, defineEmits, toRef, computed } from "vue";
import { ForgotPasswordMutationVariables } from "@/generated/graphql";
import { useField } from "vee-validate";
import { emailSchema } from "@/validations/authValidations";
import { ApolloError } from "@apollo/client";
import { humanizeString } from "@/utils/textUtils";

const props = defineProps<{
  email: string;
  error: ApolloError | null;
  isLoading: boolean;
}>();

const emits = defineEmits<{
  (e: "handle-submit", formData: ForgotPasswordMutationVariables): void;
  (e: "update:email", updatedUsername: string): void;
}>();

const { value: emailInput, errorMessage: emailInputError } = useField<string>(
  toRef(props, "email"),
  emailSchema,
  {
    modelPropName: "email",
  }
);

const errorMessage = computed(() => {
  return props.error ? humanizeString(props.error.message) : null;
});

const isValidForm = computed(() => !emailInputError.value && emailInput.value);

const onSubmit = () => {
  if (isValidForm.value) {
    emits("handle-submit", {
      email: emailInput.value,
    });
  }
};
</script>

<style scoped lang="scss">
.button--submit {
  margin: auto 0 calc(32px + var(--ion-safe-area-bottom));
}

.form-info {
  margin: -2px 0 24px;
  display: flex;
  justify-content: space-between;
  color: var(--gray-500);
  font-size: 14px;
}

.error {
  margin: calc(-10px - var(--ion-safe-area-bottom)) 0
    calc(20px + var(--ion-safe-area-bottom));
}
</style>
