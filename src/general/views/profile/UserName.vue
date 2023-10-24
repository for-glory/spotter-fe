<template>
    <base-layout>
        <template #header>
            <page-header back-btn title="Change profile" @back="onBack" />
        </template>
        <template #content>
            <base-input v-model:value="firstName" :error-message="firstNameError" type="email" :disabled="loading"
                placeholder="Enter first name" class="form-input" />
            <base-input v-model:value="lastName" :error-message="lastNameError" type="email" :disabled="loading"
                placeholder="Enter last name" class="form-input" />
        </template>

        <template #footer>
            <buttons-footer main-button-text="Update profile" @click="onSubmit" :disabled="!isValidForm" />
        </template>
    </base-layout>
</template>
  
<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import BaseInput from "@/general/components/base/BaseInput.vue";
import ButtonsFooter from "@/general/components/blocks/footers/ButtonsFooter.vue";
import { useRouter } from "vue-router";
import { useField } from "vee-validate";
import { requiredFieldSchema } from "@/validations/authValidations";
import { computed } from "vue";
import { MeDocument, UpdateUserDocument } from "@/generated/graphql";
import { useMutation, useQuery } from "@vue/apollo-composable";
import useId from "@/hooks/useId";

const router = useRouter();

const { id } = useId();

const { mutate, error, loading } = useMutation(UpdateUserDocument);

const { value: firstName, errorMessage: firstNameError } = useField<string>(
    "firstName",
    requiredFieldSchema
);

const { value: lastName, errorMessage: lastNameError } = useField<string>(
    "lastName",
    requiredFieldSchema
);

const { onResult, refetch } = useQuery(MeDocument, { id });

onResult(({ data }) => {
    firstName.value = data.me.first_name;
    lastName.value = data.me.last_name;
});

const isValidForm = computed(
    () =>
        !!(
            !firstNameError.value &&
            !lastNameError.value &&
            firstName.value &&
            lastName.value
        )
);

const onBack = () => {
    router.go(-1);
};

const onSubmit = () => {
    error.value = null;
    if (isValidForm.value) {
        mutate({
            id,
            input: {
                first_name: firstName.value,
                last_name: lastName.value,
            },
        })
            .then(() => {
                onBack();
            });

    }
};
</script>
<style scoped lang="scss">
.form-input {
    margin-top: 24px;
    padding: 0 24px;
}
</style>
  