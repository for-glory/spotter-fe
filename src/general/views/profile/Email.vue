<template>
  <base-layout>
    <template #header>
      <page-header back-btn title="Change email" @back="onBack" />
    </template>
    <template #content>
      <base-input
        v-model:value="emailInput"
        :error-message="emailInputError"
        type="email"
        :disabled="loading"
        placeholder="Enter new email"
        class="email-input"
      />
    </template>
    <transition>
      <ion-text v-if="errorMessage" class="error" color="danger">
        {{ errorMessage }}
      </ion-text>
    </transition>
    <template #footer>
      <buttons-footer
        main-button-text="Change email"
        @click="onSubmit"
        :disabled="!emailInput"
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
import { IonText } from "@ionic/vue";
import { useField } from "vee-validate";
import { emailSchema } from "@/validations/authValidations";
import { computed } from "vue";
import { humanizeString } from "@/utils/textUtils";
import { UpdateUserDocument } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import useId from "@/hooks/useId";
import { EntitiesEnum } from "@/const/entities";

const router = useRouter();

const { id } = useId();

const { mutate, error, loading } = useMutation(UpdateUserDocument);

const { value: emailInput, errorMessage: emailInputError } = useField<string>(
  "email",
  emailSchema,
  {
    modelPropName: "email",
  }
);

const errorMessage = computed(() => {
  return error.value ? humanizeString(error.value.message) : null;
});

const isValidForm = computed(() => !emailInputError.value && emailInput.value);

const onBack = () => {
  router.go(-1);
};

const onSubmit = () => {
  if (isValidForm.value) {
    mutate({
      id,
      input: {
        email: emailInput.value,
      },
    })
      .then(() => {
        router.push({
          name: EntitiesEnum.CheckEmail,
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
};
</script>
<style scoped lang="scss">
.email-input {
  padding: 24px;
}
.error {
  margin: calc(-10px - var(--ion-safe-area-bottom)) 0
    calc(20px + var(--ion-safe-area-bottom));
}
</style>
