<template>
  <ion-text :class="isNative && 'native ion-padding'">
    Already A Member?
    <router-link :to="{ name: EntitiesEnum.Login }"> Log In </router-link>
  </ion-text>
  <div
  :class="{ 'mt-2': !isNative, 'native login-form-container ion-padding' : isNative }"
  >
    <base-form class="authentication-form" @submit.prevent="onSubmit">
      <base-input
        v-model:value="emailInput"
        :error-message="emailInputError"
        :disabled="isLoading"
        type="email"
        placeholder="Enter your email"
      />
      <!-- <base-input
        v-model:value="firstNameInput"
        :error-message="firstNameInputError"
        :disabled="isLoading"
        type="text"
        placeholder="Enter your first name"
      />
      <base-input
        v-model:value="lastNameInput"
        :error-message="lastNameInputError"
        :disabled="isLoading"
        type="text"
        placeholder="Enter your last name"
      /> -->
      <base-input
        v-model:value="passwordInput"
        :error-message="passwordInputError"
        :disabled="isLoading"
        type="password"
        placeholder="Enter your password"
      />
      <base-input
        v-model:value="passwordConfirmationInput"
        :error-message="passwordConfirmationError"
        :disabled="isLoading"
        type="password"
        placeholder="Enter your password again"
      />
      <ion-button
        :disabled="isLoading"
        class="button--submit"
        type="submit"
        expand="block"
      >
        Sign Up
      </ion-button>
      <transition>
        <ion-text v-if="errorMessage" class="error" color="danger">
          {{ errorMessage }}
        </ion-text>
      </transition>
    </base-form>
  </div>
</template>

<script setup lang="ts">
import BaseInput from "@/general/components/base/BaseInput.vue";
import BaseForm from "@/general/components/base/BaseForm.vue";
import { IonButton, IonText } from "@ionic/vue";
import { EntitiesEnum } from "@/const/routes";
import { useField } from "vee-validate";
import { computed, defineEmits, defineProps } from "vue";
import { RegisterInput } from "@/generated/graphql";
import { passwordSchema, userNameSchema, requiredFieldSchema } from "@/validations/authValidations";
import { ApolloError } from "@apollo/client";
import { humanizeString } from "@/utils/textUtils";
import { Capacitor } from "@capacitor/core";

let isNative = Capacitor.isNativePlatform();

const props = defineProps<{
  error: ApolloError | null;
  isLoading: boolean;
}>();

const emits = defineEmits<{
  (
    e: "handle-submit",
    formData: Pick<
      RegisterInput,
      "email" | "first_name" | "last_name" | "password" | "password_confirmation"
    >
  ): void;
}>();

const { value: emailInput, errorMessage: emailInputError } = useField<string>(
  "email",
  userNameSchema
);

const { value: firstNameInput, errorMessage: firstNameInputError } = useField<string>(
  "first name", requiredFieldSchema
);

const { value: lastNameInput, errorMessage: lastNameInputError } = useField<string>(
  "last name", requiredFieldSchema
);

const { value: passwordInput, errorMessage: passwordInputError } =
  useField<string>("password", passwordSchema);

const {
  value: passwordConfirmationInput,
  errorMessage: passwordConfirmationError,
} = useField<string>(
  "password confirmation",
  (inputValue) => inputValue === passwordInput.value
);

const errorMessage = computed(() => {
  return props.error ? humanizeString(props.error.message) : null;
});

const isValidForm = computed(
  () =>
    !emailInputError.value &&
    // !firstNameInputError.value &&
    // !lastNameInputError.value &&
    !passwordInputError.value &&
    !passwordConfirmationError.value &&
    passwordInput.value &&
    passwordConfirmationInput.value &&
    emailInput.value
    // firstNameInput.value &&
    // lastNameInput.value
);

const onSubmit = () => {
  if (isValidForm.value) {
    emits("handle-submit", {
      email: emailInput.value,
      first_name: firstNameInput.value?lastNameInput.value:"default",
      last_name: lastNameInput.value?lastNameInput.value:"default",
      password: passwordInput.value,
      password_confirmation: passwordConfirmationInput.value,
    });
  }
};
</script>

<style scoped>
.authentication-form {
  display: flex;
  flex-direction: column;
  max-width: unset;
  padding: 0;
}

.button--submit {
  margin-top: auto;
  margin-bottom: calc(32px + var(--ion-safe-area-bottom));
}

.form-info {
  margin: -2px 0 24px;
  display: flex;
  justify-content: space-between;
  color: var(--gray-500);
  font-size: 14px;
}

ion-button {
  --color: var(--gray-700);
  --border-radius: 8px;
  font-weight: 500;
  text-transform: none;
  --padding-top: 13px;
  --padding-bottom: 13px;
  width: 100%;
  height: 48px;
}

a {
  text-decoration: none;
}

.error {
  margin: calc(-10px - var(--ion-safe-area-bottom)) 0
    calc(20px + var(--ion-safe-area-bottom));
}
</style>
