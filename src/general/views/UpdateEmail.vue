<template>
  <div class="page--content">
    <div class="page--title">
      <ion-title>Enter your Email</ion-title>
      <ion-text>
        You did not provide an email address when you registered. Please enter
        and confirm your email.
      </ion-text>
    </div>
    <update-email-form
      v-model:email="form.email"
      :error="error"
      :is-loading="loading"
      @handle-submit="formSubmit"
      class="forgot-password-form"
    />
  </div>
</template>

<script setup lang="ts">
import { IonText, IonTitle } from "@ionic/vue";
import { useMutation } from "@vue/apollo-composable";
import {
  UpdateUserEmailMutationVariables,
  UpdateUserEmailDocument,
} from "@/generated/graphql";
import { ref } from "vue";
import UpdateEmailForm from "@/general/components/forms/ForgotPasswordForm.vue";
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import useId from "@/hooks/useId";

const router = useRouter();

const {
  mutate: updateEmail,
  onDone,
  loading,
  error,
} = useMutation(UpdateUserEmailDocument);

const form = ref({
  email: "",
});

const formSubmit = (formData: UpdateUserEmailMutationVariables) => {
  const { id } = useId();
  updateEmail({ id, email: formData.email });
};

onDone(() => {
  localStorage.setItem("temporary_email", JSON.stringify(form.value.email));
  router.push({ name: EntitiesEnum.CheckEmail });
});
</script>

<style scoped lang="scss">
ion-title {
  padding: 0;
  margin: 20px auto;
  font-size: 28px;
  --color: var(--gold);
}

ion-text {
  display: block;
  margin: 0 auto;
  font-weight: 300;
  font-size: 14px;
  max-width: 300px;
  --color: var(--gray-400);
}

.page {
  &--title {
    text-align: center;
    margin: 20px auto 32px;
  }

  &--content {
    display: flex;
    margin: 0 24px;
    flex-direction: column;
    height: calc(100% - 337px - var(--ion-safe-area-top));
  }
}

.forgot-password-form {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
