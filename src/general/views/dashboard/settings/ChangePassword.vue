<template>
    <ComponentBaseLayout title="Change password" sub-title="Follow steps to change your password" @save="onSubmit"
        :disabled="loading || !isValidForm">
        <template #content>
            <div class="password__form flex-2">
                <base-input from-settings type="password" label="Current password" placeholder="Enter your current password" class="password__input"
                    v-model:value="passwordInput" :error-message="passwordInputError" :disabled="loading"
                    v-if="hasPassword" />
                <base-input from-settings v-model:value="newPasswordInput" label="New password" :error-message="newPasswordError" :disabled="loading"
                    type="password" placeholder="Enter your new password" class="password__input" />
                <base-input from-settings v-model:value="passwordConfirmationInput" label="Confirm password" :error-message="passwordConfirmationError"
                    type="password" :placeholder="role === RoleEnum.User ? 'Confirm password' : 'Enter your new password again'" class="password__input" />
            </div>
        </template>
    </ComponentBaseLayout>
</template>
  
<script setup lang="ts">
import BaseInput from "@/general/components/base/BaseInput.vue";
import { useRouter } from "vue-router";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { MeDocument, UpdatePasswordDocument } from "@/generated/graphql";
import { useField } from "vee-validate";
import { passwordSchema } from "@/validations/authValidations";
import { computed } from "vue";
import { humanizeString } from "@/utils/textUtils";
import { toastController } from "@ionic/vue";
import ComponentBaseLayout from "./ComponentBaseLayout.vue";
import useRoles from "@/hooks/useRole";
import { RoleEnum } from "@/generated/graphql";

const router = useRouter();
const { role } = useRoles();
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

const { result: userResult } = useQuery(MeDocument);

const hasPassword = computed<boolean>(() => userResult.value?.me.has_password);
</script>
<style scoped lang="scss">
.password__form {
    margin-top: 25px;
    max-width: 473px;
}

.error {
    margin: calc(-10px - var(--ion-safe-area-bottom)) 0 calc(20px + var(--ion-safe-area-bottom));
}
</style>
  