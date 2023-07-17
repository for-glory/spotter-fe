<template>
  <ion-text>
    Don't have an account?
    <a :href="'#'" @click.prevent="openModal">
      Sign up
    </a>
  </ion-text>
  <div class="mt-2">
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
      <ion-text class="mt-2">
        Forgot password?
        <router-link :to="{ name: EntitiesEnum.ForgotPassword }">
          Click here
        </router-link>
      </ion-text>
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
  </div>
  
  <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
    <ion-content class="block">
        <div style="padding: 5% ">
          <p>
            To ensure the safety of our trainers and users, we need to verify your identity.
            <br>
            Enter Your full name as it appears on your government-issued ID.
          </p>
          <router-link :to="{ name: EntitiesEnum.Register }">
            <ion-button
              class="button--submit"
              expand="block"
              @click="closeModal"
              tag="router-link"
            >
              Register
            </ion-button>
          </router-link>
        </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import BaseInput from "@/general/components/base/BaseInput.vue";
import BaseForm from "@/general/components/base/BaseForm.vue";
import { IonButton, IonText, IonModal, IonContent } from "@ionic/vue";
import { defineProps, defineEmits, toRef, computed, ref } from "vue";
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

let isModalOpen = ref(false),
  openModal = () => {
    console.log("Entra en modal")
    isModalOpen.value = true
  },
  closeModal = () => {
    isModalOpen.value = false
  }
</script>

<style scoped>
.authentication-form {
  display: flex;
  flex-direction: column;
  max-width: unset;
  padding: 0;
}

.button--submit {
  margin-top: 8px;
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

.block {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

ion-modal {
  --height: auto;
}
</style>
