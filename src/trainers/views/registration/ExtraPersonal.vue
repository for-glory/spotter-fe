<template>
  <base-layout :header-fixed="false">
    <template #header>
      <ion-header class="ion-no-border">
        <page-header @back="onBack" back-btn />
      </ion-header>
    </template>
    <template #content>
      <ion-title class="main-title">Verification Setup</ion-title>
      <ion-text class="subtitle">
        To ensure the safety of our trainers and users, we need to verify your
        Identity
      </ion-text>
      <div class="inputs-form">
        <base-input
          v-model:value="firstName"
          :error-message="firstNameError"
          placeholder="Enter your first name"
          name="firstName"
          label="Your full name as it appears on Gov issued I.D."
          required
        />
        <base-input
          v-model:value="lastName"
          :error-message="lastNameError"
          placeholder="Enter your last name"
          name="lastName"
          required
        />
      </div>
    </template>
    <template #footer>
      <div class="buttons">
        <ion-button @click="handleSubmit" type="submit" expand="block">
          Next
        </ion-button>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useField } from "vee-validate";
import { useStore } from "vuex";
import { requiredFieldSchema } from "@/validations/authValidations";
import { IonButton, IonHeader, IonText, IonTitle } from "@ionic/vue";
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { useMutation } from "@vue/apollo-composable";
import useId from "@/hooks/useId";
import useUser from "@/hooks/useUser";
import {
  UpdateUserNameDocument,
  UpdateUserSettingsDocument,
} from "@/generated/graphql";
import { ProfileSettings } from "@/ts/enums/user";
import { setSettings } from "@/hooks/useSettings";

const router = useRouter();
const store = useStore();

const { id } = useId();
const { first_name, last_name } = useUser();
const { mutate: updateUser } = useMutation(UpdateUserNameDocument);

let { value: firstName, errorMessage: firstNameError } = useField<string>(
  "firstName",
  requiredFieldSchema
);

firstName.value = first_name;

let { value: lastName, errorMessage: lastNameError } = useField<string>(
  "lastName",
  requiredFieldSchema
);

lastName.value = last_name;

const isValidForm = computed(
  () =>
    !firstNameError.value &&
    !lastNameError.value &&
    firstName.value &&
    lastName.value
);

const handleSubmit = () => {
  const extraPersonal = [
    {
      name: "firstName",
      value: firstName.value,
    },
    {
      name: "lastName",
      value: lastName.value,
    },
  ];

  if (isValidForm.value) {
    extraPersonal.forEach((info) => {
      store.dispatch("setExtraPersonalData", {
        key: info.name,
        value: info.value,
      });
    });

    updateUser({
      id,
      first_name: firstName.value,
      last_name: lastName.value,
    })
      .then(() => afterTrainerTypeUpdated())
      .catch((error) => {
        throw new Error(error);
      });
  }
};

const { mutate: updateUserSettings, onDone: settingsUpdated } = useMutation(
  UpdateUserSettingsDocument
);

const afterTrainerTypeUpdated = () => {
  setSettings([{ isIdentityVerified: true }]);

  const { id } = useId();
  const front_settings = localStorage.getItem(ProfileSettings.UserSettings);

  updateUserSettings({
    id,
    front_settings,
  });
};

settingsUpdated(() => {
  router.push({ name: EntitiesEnum.Quizz });
});

const onBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.main-title {
  margin-top: 32px;
}

.subtitle {
  margin: 0 43px 30px;
}

.inputs-form {
  padding: 32px 24px 16px;
  justify-content: center;
  width: 100%;
  display: grid;

  .base-input-container {
    display: grid;
    align-self: center;
    flex: 1;

    .ion-item {
      flex: 1;
      align-self: center;
      width: 100%;
    }
  }
}

.buttons {
  margin-top: 1rem;
  width: 30%;
  margin: 0 auto;
  padding: 0 24px calc(32px + var(--ion-safe-area-bottom));

  @media (max-width: 992px) {
    width: 100%;
  }

  .button {
    margin: 0 auto;
    text-align: center;
    font-family: Lato;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
  }
}
</style>
