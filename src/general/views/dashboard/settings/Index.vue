<template>
  <div
    class="holder-content ion-padding-horizontal"
    :class="{ 'holder-content--empty': !loading }"
    v-if="(role !== RoleEnum.Trainer && role !== RoleEnum.User)"
  >
    <div class="banner">
      <ion-icon src="assets/icon/arrow-back.svg" />
      <ion-title class="banner__title">Settings</ion-title>
    </div>
    <div class="settings">
      <div class="settings-menu">
        <div
          :class="filter === 'profile' ? 'menu-item__active' : 'menu-item'"
          @click="handleClick('profile')"
        >
          My Profile
        </div>
        <div
          :class="filter === 'security' ? 'menu-item__active' : 'menu-item'"
          @click="handleClick('security')"
        >
          Password and Security
        </div>
        <div
          :class="filter === 'services' ? 'menu-item__active' : 'menu-item'"
          @click="handleClick('services')"
        >
          Connected Services
        </div>
        <div
          class="menu-item__delete"
          @click="onDeleteAccount"
          :disabled="profileOnDeleting"
        >
          Delete Account
        </div>
      </div>
      <div class="settings-panel">
        <profile v-if="filter === 'profile'" />
        <security v-else-if="filter === 'security'" />
        <services v-else />
      </div>
    </div>
  </div>
  <div v-else class="h-100">
    <edit class="h-100"></edit>
  </div>
  <confirmation
    :is-visible="showConfirmationModal"
    title="Do you want delete your account?"
    description="Your account will be lost"
    button-text="Delete"
    @discard="onDeleteConfirmed"
    @decline="hideModal"
  />
</template>

<script setup lang="ts">
import { IonTitle, IonIcon } from "@ionic/vue";
import { IonButton, IonSpinner } from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import { DeleteProfileDocument, RoleEnum } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { ref } from "vue";
import { useRouter } from "vue-router";
import useId from "@/hooks/useId";
import useFacilityId from "@/hooks/useFacilityId";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";
// import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";
import Profile from "@/general/views/dashboard/settings/Profile.vue";
import Security from "@/general/views/dashboard/settings/Security.vue";
import Services from "@/general/views/dashboard/settings/Services.vue";
import { clearAuthItems } from "@/router/middleware/auth";
import Edit from "./Edit.vue";
import UserProfile from "./UserProfile.vue";

const filter = ref<string>("profile");

const { id: myId } = useId();
const { id: myFacilityId } = useFacilityId();
const { role } = useRoles();
const { showConfirmationModal, hideModal, showModal } = useConfirmationModal();

const { id } = JSON.parse(localStorage.getItem("user") || "{}");

const router = useRouter();

const {
  mutate: deleteProfile,
  loading: profileOnDeleting,
  onDone: profileDeleted,
} = useMutation(DeleteProfileDocument);

const handleClick = (value: string) => {
  filter.value = value;
};
const onDeleteAccount = () => {
  showModal();
};
const onDeleteConfirmed = () => {
  deleteProfile();
  hideModal();
};

profileDeleted(() => {
  clearAuthItems();
  router.push({ name: EntitiesEnum.Login });
});
</script>

<style scoped lang="scss">
.holder-content {
  padding-left: 50px;
  padding-right: 37px;
  padding-top: -40px;
}

.infinite-scroll {
  margin-top: 16px;
  margin-bottom: -24px;
}

.settings {
  background-color: var(--gray-700);
  margin-top: 50px;
  min-height: 766px;
  display: flex;
}
.settings-menu {
  padding-left: 31px;
  padding-right: 31px;
  padding-top: 106px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 18px;
}
.settings-panel {
  padding-left: 32px;
  padding-right: 82px;
  padding-top: 41px;
  flex: auto;
}
.menu-item {
  padding: 10px;
  cursor: pointer;

  &:hover {
    color: #e1dbc5;
  }
  &__active {
    color: #e1dbc5;
    padding: 10px;
    border-radius: 32px;
    background-color: #e1dbc51a;
    cursor: pointer;
  }
  &__delete {
    padding: 10px;
    color: #dc5858;
    cursor: pointer;
  }
}
.banner {
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  &__title {
    padding: 0;
    color: var(--gold);
    font-family: Lato;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
}
</style>
