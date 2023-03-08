<template>
  <ion-page ref="page">
    <base-layout>
      <template #header>
        <page-header />
      </template>
      <template #content>
        <div class="page--content">
          <div class="page--title">
            <ion-title>Please select your role</ion-title>
            <ion-text> Tell us how you will be utilizing Spotter</ion-text>
          </div>
          <ion-radio-group v-model="selectedRole">
            <ion-item
              lines="none"
              :key="role.name"
              class="radiobutton"
              v-for="role in profileTypes"
              :class="{ 'radiobutton--checked': selectedRole === role.name }"
            >
              {{ role.label }}
              <ion-radio slot="end" :value="role.name" />
            </ion-item>
          </ion-radio-group>
        </div>
      </template>
      <template #footer>
        <div class="holder-button">
          <ion-button class="button--submit" expand="block" @click="next">
            Next
          </ion-button>
        </div>
      </template>
    </base-layout>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonButton,
  IonText,
  IonRadio,
  IonTitle,
  IonItem,
  IonRadioGroup,
} from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { ref } from "vue";
import useRoles from "@/hooks/useRole";
import {
  RoleEnum,
  UpdateUserRoleDocument,
  UpdateUserSettingsDocument,
} from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { setSettings } from "@/hooks/useSettings";
import useId from "@/hooks/useId";
import { ProfileSettings } from "@/ts/enums/user";

enum ProfileType {
  Client = "Client",
  Trainer = "Trainer",
  Owner = "Gym owner",
}

const profileTypes = [
  {
    label: ProfileType.Client,
    name: RoleEnum.User,
  },
  {
    label: ProfileType.Trainer,
    name: RoleEnum.Trainer,
  },
  {
    label: ProfileType.Owner,
    name: RoleEnum.Manager,
  },
];

const { role } = useRoles();

const selectedRole = ref<RoleEnum>(role);

const router = useRouter();

const { mutate: updateUserRole } = useMutation(UpdateUserRoleDocument);

const next = () => {
  if (selectedRole.value !== role && selectedRole.value !== RoleEnum.Manager) {
    const { id } = useId();
    updateUserRole({
      id,
      role: selectedRole.value,
    })
      .then(() => {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...currentUser,
            role: selectedRole.value,
          })
        );
        updateSettings();
      })
      .catch((error) => {
        throw new Error(error);
      });
  } else {
    updateSettings();
  }
};

const updateSettings = () => {
  setSettings([{ isRoleSelected: true }]);
  const { id } = useId();

  const front_settings = localStorage.getItem(ProfileSettings.UserSettings);

  updateUserSettings({
    id,
    front_settings,
  });
};

const { mutate: updateUserSettings, onDone: settingsUpdated } = useMutation(
  UpdateUserSettingsDocument
);

settingsUpdated(() => {
  forward();
});

const forward = () => {
  switch (selectedRole.value) {
    case RoleEnum.User:
      router.push({
        name: EntitiesEnum.Quizz,
      });
      break;

    case RoleEnum.Trainer:
      router.push({
        name: EntitiesEnum.FreelancerTrainer,
      });
      break;

    case RoleEnum.Manager:
      router.push({
        name: EntitiesEnum.ChooseFacilityType,
      });
      break;
  }
};
</script>

<style scoped lang="scss">
.header {
  margin-bottom: 15px;
}

ion-title {
  margin: 20px auto;
  font-size: 28px;
  --color: var(--gold);
}

ion-text {
  font-weight: 300;
  font-size: 14px;
  --color: var(--gray-400);
}

.page {
  &--title {
    margin: 20px auto 110px;
    text-align: center;
    padding: 0 36px;
  }

  &--content {
    display: flex;
    margin: 0 24px;
    flex-direction: column;
    height: calc(100% - 337px - var(--ion-safe-area-top));
  }
}

.radiobutton {
  font-size: 14px;
  line-height: 1.5;
  --min-height: 24px;
  --padding-top: 12px;
  --border-radius: 8px;
  --padding-bottom: 12px;
  --color: var(--gray-500);
  --inner-padding-top: 0;
  --inner-padding-bottom: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  --background: var(--gray-700);
  --padding-start: var(--container-offset);
  --padding-end: var(--container-offset);
  --border-width: 0.8px;
  --border-style: solid;

  &:not(:first-child) {
    margin-top: 16px;
  }

  &--checked {
    --color: var(--ion-color-white);
    --border-color: var(--ion-color-primary);
  }

  ion-radio {
    width: 18px;
    height: 18px;
    border-width: 1.8px;
    margin: 3px 3px 3px 20px;
    --color: var(--ion-color-medium);
    --mark-width: 12px;
    --mark-height: 9px;

    &::part(mark) {
      background-position: 50% 50%;
      background-repeat: no-repeat;
      width: calc(100% + var(--border-width));
      height: calc(100% + var(--border-width));
      background-size: var(--mark-width) var(--mark-height);
      background-image: url(/public/assets/icon/check-mark.svg);
    }
  }
}

.holder-button {
  padding: 20px 24px calc(32px + var(--ion-safe-area-bottom));

  .button {
    margin: 0;
  }
}
</style>
