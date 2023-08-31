<template>
  <base-auth-layout >
    <template #left-section>
      <div class="page--content">
        <div class="page--title">
          <ion-title>Create your password</ion-title>
        </div>
        <create-new-password-form
          v-model:password="form.password"
          v-model:password_confirmation="form.password_confirmation"
          :error="error"
          :is-loading="loading"
          @handle-submit="setPassword"
          class="password-form"
        />
      </div>
    </template>
  </base-auth-layout>
</template>

<script setup lang="ts">
import BaseAuthLayout from "@/general/components/base/BaseAuthLayout.vue";
import { IonText, IonTitle } from "@ionic/vue";
import { useMutation } from "@vue/apollo-composable";
import {
  RegisterInput,
  ManagerPasswordSetDocument,
} from "@/generated/graphql";
import { ref } from "vue";
import CreateNewPasswordForm from "@/general/components/forms/CreateNewPasswordForm.vue";
import { EntitiesEnum } from "@/const/routes";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const {
  mutate: managerPasswordSet,
  onDone,
  loading,
  error,
} = useMutation(ManagerPasswordSetDocument);

const form = ref<Pick<RegisterInput, "password" | "password_confirmation">>({
  password: "",
  password_confirmation: "",
});

const email = route.params.email;

const setPassword = (
  formData: Pick<RegisterInput, "password" | "password_confirmation">
) => {
	console.log(formData)
  managerPasswordSet({
		input: {
			...formData,
			email: email,
		}
  });
};

onDone(() => {
  localStorage.removeItem("temporary_email");
  router.push({ name: EntitiesEnum.Login });
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

.password-form {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
