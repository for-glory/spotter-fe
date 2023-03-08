<template>
  <base-layout hide-navigation-menu>
    <template #content>
      <authentication-header back-button @back="onBack" />
      <div class="content">
        <div class="head">
          <ion-title class="title" color="primary">
            Choose your facility type
          </ion-title>
          <ion-text color="secondary">
            Select between creating a new gym or join a franchise
          </ion-text>
        </div>
        <div class="buttons">
          <ion-button
            expand="block"
            @click="newFacility"
            :disabled="isRoleUpdating"
          >
            Setup a new facility or gym
          </ion-button>
          <ion-button
            expand="block"
            class="secondary"
            @click="existingFacility"
            :disabled="isRoleUpdating"
          >
            Link to existing franchise
          </ion-button>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonTitle, IonText, IonButton } from "@ionic/vue";
import AuthenticationHeader from "@/general/components/blocks/headers/AuthenticationHeader.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { useMutation } from "@vue/apollo-composable";
import { setSettings } from "@/hooks/useSettings";
import useId from "@/hooks/useId";
import { ProfileSettings } from "@/ts/enums/user";
import {
  RoleEnum,
  UpdateUserRoleDocument,
  UpdateUserSettingsDocument,
} from "@/generated/graphql";

const router = useRouter();

const onBack = () => {
  router.go(-1);
};

const {
  mutate: updateUserRole,
  onDone: userRoleUpdated,
  loading: isRoleUpdating,
} = useMutation(UpdateUserRoleDocument);

const newFacility = () => {
  const { id } = useId();
  updateUserRole({
    id,
    role: RoleEnum.OrganizationOwner,
  });
};

userRoleUpdated((response) => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  localStorage.setItem(
    "user",
    JSON.stringify({
      ...currentUser,
      role: response.data.updateUser.role,
    })
  );
  updateSettings();
});

const { mutate: updateUserSettings, onDone: settingsUpdated } = useMutation(
  UpdateUserSettingsDocument
);

const updateSettings = () => {
  setSettings([{ isRoleSelected: true }]);
  const { id } = useId();

  const front_settings = localStorage.getItem(ProfileSettings.UserSettings);

  updateUserSettings({
    id,
    front_settings,
  });
};

settingsUpdated(() => {
  router.push({
    name: EntitiesEnum.CreateFacility,
  });
});

const existingFacility = () => {
  router.push({
    name: EntitiesEnum.EnterCode,
  });
};
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px 24px calc(32px + var(--ion-safe-area-bottom));
  min-height: calc(100% - 337px - var(--ion-safe-area-top));
}

.head {
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  max-width: 260px;
  text-align: center;
  margin: 0 auto 32px;
}

.title {
  padding: 0;
  font-size: 28px;
  line-height: 1.3;
  font-weight: 400;
  margin-bottom: 20px;
}

.buttons {
  .button {
    margin: 0;

    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}
</style>
