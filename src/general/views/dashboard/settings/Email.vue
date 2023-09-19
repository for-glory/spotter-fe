<template>
    <ComponentBaseLayout title="Change email" @save="onSubmit" :disabled="!emailInput">
        <template #content>
            <div class="flex-2">
        <base-input from-settings v-model:value="emailInput" :error-message="emailInputError" label="Email" type="email"
            :disabled="loading" @change="changeInput" placeholder="Enter new email" class="email-input" />
        <transition name="fade" mode="out-in" :duration="500">
            <ion-text v-if="errorMessage" class="error errormessaje" color="danger">
                {{ errorMessage }}
            </ion-text>
        </transition>
    </div>
        </template>
    </ComponentBaseLayout>
</template>
  
<script setup lang="ts">
import BaseInput from "@/general/components/base/BaseInput.vue";
import ButtonsFooter from "@/general/components/blocks/footers/ButtonsFooter.vue";
import { useRouter } from "vue-router";
import { IonButton, IonText } from "@ionic/vue";
import { useField } from "vee-validate";
import { emailSchema } from "@/validations/authValidations";
import { computed } from "vue";
import { humanizeString } from "@/utils/textUtils";
import { UpdateUserDocument } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { clearAuthItems } from "@/router/middleware/auth";
import useId from "@/hooks/useId";
import useUser from "@/hooks/useUser";
import { EntitiesEnum } from "@/const/entities";
import ComponentBaseLayout from "./ComponentBaseLayout.vue";

const router = useRouter();

const { id } = useId();
const { email } = useUser();

const { mutate, error, loading } = useMutation(UpdateUserDocument);

let { value: emailInput, errorMessage: emailInputError } = useField<string>(
    "email",
    emailSchema,
    {
        modelPropName: "email",
    }
);

emailInput.value = email;

let errorMessage = computed(() => {
    return error.value ? humanizeString(error.value.message) : null;
});

const isValidForm = computed(() => {
    return !emailInputError.value && emailInput.value;
});

const changeInput = () => {
    error.value = null;
};

const onSubmit = () => {
    error.value = null;
    if (isValidForm.value) {
        if (isValidForm.value != email) {

            mutate({
                id,
                input: {
                    email: emailInput.value,
                },
            })
                .then((result: any) => {
                    console.log(result, result.data, result.errors);
                    if (result.data !== undefined) {
                        //cerrar sesion
                        clearAuthItems();
                        router.push({
                            name: EntitiesEnum.CheckEmail,
                        });
                    } else if (result.errors) {

                        //let error :any = result.errors
                        if (result.errors[0].extensions.validation == 'unique') {
                            console.log("aqui estab bn");
                            error.value = result.errors[0];
                        }
                    }
                });

        }
    }
};
</script>
<style scoped lang="scss">
.email-input {
    margin-top: 35px;
}

.error {
    margin: calc(-10px - var(--ion-safe-area-bottom)) 0 calc(20px + var(--ion-safe-area-bottom));
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
.flex-2 {
    max-width: 473px;
}
</style>
  