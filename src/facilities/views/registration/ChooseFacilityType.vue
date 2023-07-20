<template>
  <base-auth-layout>
    <template #left-section>
      <!-- <authentication-header back-button @back="onBack" /> -->
      <div class="content">
        <div class="head">
          <ion-title class="title" color="primary">
            Choose your facility type
          </ion-title>
          <ion-text class="font-20 grey-text">
            Select between creating a new gym or join a franchise
          </ion-text>
        </div>
        <div class="buttons">
          <ion-text class="font-20 grey-text">
            Create your facility
          </ion-text>
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
        <div class="info">
          <div>
            <div>
              <ion-text class="font-20 gray-400">
                Setup a new facility or gym
              </ion-text>
            </div>
            <div class="mt-2">
              <ion-text class="font-20 grey-text mt-2">
                Create and customize your gym or facility to  your clients
              </ion-text>
            </div>
          </div>
          <div>
            <div>
              <ion-text class="font-20 gray-400">
                Link to existing franchise
              </ion-text>
            </div>
            <div class="mt-2">
              <ion-text class="font-20 grey-text">
                Use the pass code sent from gym owner to access existing franchise
              </ion-text>
            </div>
          </div>
          <ion-icon src="assets/icon/warning-2.svg" class="warning" />
        </div>
      </div>
    </template>
  </base-auth-layout>
</template>

<script setup lang="ts">
import { IonTitle, IonText, IonButton, IonIcon } from "@ionic/vue";
import AuthenticationHeader from "@/general/components/blocks/headers/AuthenticationHeader.vue";
import BaseAuthLayout from "@/general/components/base/BaseAuthLayout.vue";
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
  margin: 0 0 32px;
}

.title {
  padding: 0;
  margin-bottom: 20px;
  color: var(--gold);
  font-family: Lato;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
}

.buttons {
  .button {
    margin: 0;
    text-align: center;
    font-family: Lato;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;

    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}
.info {
  background: linear-gradient(0deg, rgba(11, 11, 11, 0.10) 0%, rgba(11, 11, 11, 0.10) 100%), #2D2D2D;
  display: flex;
  flex-direction: column;
  gap: 27px;
  padding: 20px 60px;
  margin-top: 5rem;
  position: relative;

  .warning {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
</style>
