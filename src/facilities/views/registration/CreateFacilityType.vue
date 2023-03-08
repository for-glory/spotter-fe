<template>
  <base-layout hide-navigation-menu>
    <template #content>
      <authentication-header back-button @back="onBack" />
      <div class="content">
        <div class="head">
          <ion-title class="title" color="primary">
            Create facility type
          </ion-title>
          <ion-text color="secondary">
            Select between creating a new gym or join a franchise
          </ion-text>
        </div>
        <div class="buttons">
          <ion-button
            expand="block"
            :disabled="isRoleUpdating"
            @click="updateRole(RoleEnum.FacilityOwner)"
          >
            Create a new franchise gym
          </ion-button>
          <ion-button
            expand="block"
            class="secondary"
            :disabled="isRoleUpdating"
            @click="updateRole(RoleEnum.Manager)"
          >
            Become the manager of an existing gym
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
import { RoleEnum, UpdateUserRoleDocument } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import useId from "@/hooks/useId";

const router = useRouter();

const onBack = () => {
  router.go(-1);
};

const {
  mutate: updateUserRole,
  onDone: userRoleUpdated,
  loading: isRoleUpdating,
} = useMutation(UpdateUserRoleDocument);

const updateRole = (role: RoleEnum) => {
  const { id } = useId();
  updateUserRole({ id, role });
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
  router.push({
    name:
      response.data.updateUser.role === RoleEnum.FacilityOwner
        ? EntitiesEnum.CreateFacility
        : EntitiesEnum.SelectExistingFacility,
  });
});
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
