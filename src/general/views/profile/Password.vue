<template>
  <base-layout>
    <template #header>
      <page-header
        back-btn
        :title="`${hasPassword ? 'Change' : 'Set'} password`"
        @back="onBack"
      />
    </template>
    <template #content>
      <div class="password__form">
        <base-input
          type="password"
          placeholder="Enter your current password"
          class="password__input"
          v-model:value="passwordInput"
          :error-message="passwordInputError"
          :disabled="loading"
          v-if="hasPassword"
        />
        <base-input
          v-model:value="newPasswordInput"
          :error-message="newPasswordError"
          :disabled="loading"
          type="password"
          placeholder="Enter your new password"
          class="password__input"
        />
        <base-input
          v-model:value="passwordConfirmationInput"
          :error-message="passwordConfirmationError"
          type="password"
          placeholder="Enter your new password again"
          class="password__input"
        />
      </div>
    </template>
    <template #footer>
      <buttons-footer
        main-button-text="Change password"
        @click="onSubmit"
        :disabled="loading || !isValidForm"
      />
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import BaseInput from "@/general/components/base/BaseInput.vue";
import ButtonsFooter from "@/general/components/blocks/footers/ButtonsFooter.vue";
import { useRouter } from "vue-router";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { MeDocument, UpdatePasswordDocument } from "@/generated/graphql";
import { useField } from "vee-validate";
import { passwordSchema } from "@/validations/authValidations";
import { computed } from "vue";
import { humanizeString } from "@/utils/textUtils";
import { toastController } from "@ionic/vue";

const router = useRouter();

const { mutate, onDone, loading, error } = useMutation(UpdatePasswordDocument);

const { value: passwordInput, errorMessage: passwordInputError } =
  useField<string>("password", passwordSchema);

const { value: newPasswordInput, errorMessage: newPasswordError } =
  useField<string>("new password", passwordSchema);

const {
  value: passwordConfirmationInput,
  errorMessage: passwordConfirmationError,
} = useField<string>(
  "password confirmation",
  (inputValue) => inputValue === newPasswordInput.value
);

const errorMessage = computed(() => {
  return humanizeString(
    error.value?.message || "Something went wrong. Please try again."
  );
});

const showToast = async (message: string, style = "success") => {
  const toast = await toastController.create({
    message: message,
    duration: 2000,
    icon: "assets/icon/success.svg",
    cssClass: `${style}-toast`,
  });
  return toast.present();
};

onDone(({ data }) => {
  showToast(data.updatePassword.message);
  router.go(-1);
});

const isValidForm = computed(() =>
  hasPassword.value
    ? !passwordInputError.value &&
      !passwordConfirmationError.value &&
      !newPasswordError.value &&
      passwordInput.value &&
      passwordConfirmationInput.value &&
      newPasswordInput.value
    : !passwordConfirmationError.value &&
      !newPasswordError.value &&
      passwordConfirmationInput.value &&
      newPasswordInput.value
);

const onSubmit = () => {
  if (isValidForm.value) {
    mutate({
      input: {
        old_password: hasPassword.value ? passwordInput.value : "",
        password: newPasswordInput.value,
        password_confirmation: passwordConfirmationInput.value,
      },
    }).catch(() => {
      showToast(errorMessage.value, "danger");
    });
  }
};

const onBack = () => {
  router.go(-1);
};

const { result: userResult } = useQuery(MeDocument);

const hasPassword = computed<boolean>(() => userResult.value?.me.has_password);
</script>
<style scoped lang="scss">
.password__form {
  padding: 24px;
}
.error {
  margin: calc(-10px - var(--ion-safe-area-bottom)) 0
    calc(20px + var(--ion-safe-area-bottom));
}
</style>
