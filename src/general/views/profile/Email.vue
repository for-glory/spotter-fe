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
        @change="changeInput"
        placeholder="Enter new email"
        class="email-input"
      />
      <transition name="fade" mode="out-in" :duration="500">
        <ion-text v-if="errorMessage" class="error errormessaje" color="danger">
          {{ errorMessage }}
        </ion-text>
      </transition>
    </template>
    
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
import { clearAuthItems } from "@/router/middleware/auth";
import useId from "@/hooks/useId";
import useUser from "@/hooks/useUser";
import { EntitiesEnum } from "@/const/entities";

const router = useRouter();

const { id } = useId()
const { email } = useUser()

const { mutate, error, loading } = useMutation(UpdateUserDocument);

let { value: emailInput, errorMessage: emailInputError } = useField<string>(
  "email",
  emailSchema,
  {
    modelPropName: "email",
  }
);

emailInput.value = email

let errorMessage = computed(() => {
  return error.value ? humanizeString(error.value.message) : null;
});

const isValidForm = computed(() => {
  return !emailInputError.value && emailInput.value
});

const onBack = () => {
  router.go(-1);
};

const changeInput = () => {
  error.value = null
}

const onSubmit = () => {
  error.value = null
  if (isValidForm.value) {
    if(isValidForm.value != email){
      
      mutate({
        id,
        input: {
          email: emailInput.value,
        },
      })
        .then((result: any) => {
          console.log(result, result.data, result.errors)
          if(result.data !== undefined){
            //cerrar sesion
            clearAuthItems()
            router.push({
              name: EntitiesEnum.CheckEmail,
            }); 
          } else if(result.errors){

            //let error :any = result.errors
            if(result.errors[0].extensions.validation == 'unique'){
              console.log("aqui estab bn")
              error.value = result.errors[0]
            }
          }
        })

    }
  }
};
</script>
<style scoped lang="scss">
.email-input {
  padding: 24px;
}
.error {
  padding: 24px;
  margin: calc(-10px - var(--ion-safe-area-bottom)) 0
    calc(20px + var(--ion-safe-area-bottom));
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>
