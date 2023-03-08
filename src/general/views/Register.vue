<template>
  <div class="register__container">
    <registration-form
      :is-loading="loading"
      :error="error"
      @handle-submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import RegistrationForm from "@/general/components/forms/RegistrationForm.vue";
import { RegisterDocument } from "@/graphql/documents/authDocuments";
import { RegisterInput, RoleEnum } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";

const {
  mutate: register,
  onDone,
  loading,
  error,
} = useMutation(RegisterDocument);

const handleSubmit = (
  form: Pick<RegisterInput, "email" | "password" | "password_confirmation">
) => {
  register({ ...form, role: RoleEnum.User });
  localStorage.setItem("temporary_email", JSON.stringify(form.email));
};

const router = useRouter();

onDone(() => {
  router.push({
    name: EntitiesEnum.CheckEmail,
  });
});
</script>

<style scoped lang="scss">
.register__container {
  display: grid;
  grid-template-rows: auto 1fr;
  height: calc(100% - 337px - var(--ion-safe-area-top));
}
</style>
