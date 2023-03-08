<template>
  <base-form class="authentication-form" @submit.prevent="onSubmit">
    <base-input
      v-model:value="usernameInput"
      :error-message="usernameInputError"
      :disabled="isLoading"
      type="email"
      placeholder="Enter your email"
    />
    <base-input
      v-model:value="passwordInput"
      :error-message="passwordInputError"
      :disabled="isLoading"
      type="password"
      placeholder="Enter your password"
    />
    <div class="form-info">
      <ion-text>
        No account?
        <router-link :to="{ name: EntitiesEnum.Register }">
          Sign up
        </router-link>
      </ion-text>
      <router-link :to="{ name: EntitiesEnum.ForgotPassword }">
        <ion-button class="forgot-password-btn" fill="clear" color="medium">
          Forgot password?
        </ion-button>
      </router-link>
    </div>
    <ion-button
      :disabled="isLoading"
      class="button--submit"
      type="submit"
      expand="block"
    >
      Log In
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
import { LoginMutationVariables } from "@/generated/graphql";
import { useField } from "vee-validate";
import { passwordSchema, userNameSchema } from "@/validations/authValidations";
import { ApolloError } from "@apollo/client";
import { EntitiesEnum } from "@/const/routes";
import { humanizeString } from "@/utils/textUtils";

const props = defineProps<{
  username: string;
  password: string;
  error: ApolloError | null;
  isLoading: boolean;
}>();

const emits = defineEmits<{
  (e: "handle-submit", formData: LoginMutationVariables): void;
  (e: "update:username", updatedUsername: string): void;
  (e: "update:password", updatedPassword: string): void;
}>();

const { value: usernameInput, errorMessage: usernameInputError } =
  useField<string>(toRef(props, "username"), userNameSchema, {
    modelPropName: "username",
  });

const { value: passwordInput, errorMessage: passwordInputError } =
  useField<string>(toRef(props, "username"), passwordSchema, {
    modelPropName: "password",
  });

const errorMessage = computed(() => {
  return props.error ? humanizeString(props.error.message) : null;
});

const isValidForm = computed(
  () =>
    !usernameInputError.value &&
    !passwordInputError.value &&
    passwordInput.value &&
    usernameInput.value
);

const onSubmit = () => {
  if (isValidForm.value) {
    emits("handle-submit", {
      username: usernameInput.value,
      password: passwordInput.value,
    });
  }
};
</script>

<style scoped>
.authentication-form {
  display: flex;
  flex-direction: column;
}

.button--submit {
  margin-top: auto;
  margin-bottom: 0;
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
  margin-top: 8px;
}

.forgot-password-btn {
  height: 20px;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 300;
  vertical-align: top;
  margin: 0 -8px 0 8px;
  --border-radius: 4px;
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 8px;
  --padding-end: 8px;
}
</style>
