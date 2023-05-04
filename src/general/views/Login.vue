<template>
  <div class="content">
    <login-form
      v-model:username="form.username"
      v-model:password="form.password"
      :error="error"
      :is-loading="loading"
      @handle-submit="handleSubmit"
      class="login-form"
    />
    <socials />
  </div>
</template>

<script setup lang="ts">
import LoginForm from "@/general/components/forms/LoginForm.vue";
import Socials from "@/general/components/Socials.vue";
import { ref } from "vue";
import { LoginDocument, LoginMutationVariables } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { setAuthItems } from "@/router/middleware/auth";
import navigationAfterAuth from "../helpers/navigationAfterLogin";
import useVerified from "@/hooks/useVerified";

let {
  mutate: login,
  onDone,
  onError,
  loading,
  error,
} = useMutation(LoginDocument);

const form = ref<LoginMutationVariables>({
  username: "",
  password: "",
});

onDone(({ data, errors }) => {
  if(!data && errors){
    throw new Error(String(errors[0].extensions.reason))
  }
  
  setAuthItems(data.login);

  const { verified } = useVerified();
  if (!verified) {
    localStorage.setItem(
      "temporary_email",
      JSON.stringify(data.login.user.email)
    );
  }
  navigationAfterAuth(data.login.user)
});

onError(() => {
  form.value.password = "";
});

const handleSubmit = (formData: LoginMutationVariables) => {
  login({ ...formData });
};
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  height: calc(100% - 337px - var(--ion-safe-area-bottom));
}

.login-form {
  flex: 1 1 100%;
}
</style>
