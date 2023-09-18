<template>
  <ion-spinner
    v-if="isLoading"
    name="lines"
    class="spinner"
    id="main-content"
  />
  <div class="dashboard-container" v-else>
    <div class="dashboard-container__sidebar">
      <dashboard-sidebar :facilities="facilities" />
    </div>
    <div
      class="dashboard-container__right-section"
      :class="role === RoleEnum.Trainer ? 'scrollable-content' : ''"
    >
      <slot name="right-section"></slot>
    </div>
  </div>
  <add-manager-menu />
</template>

<script lang="ts" setup>
import DashboardSidebar from "@/general/components/blocks/DashboardSidebar.vue";
import AddManagerMenu from "@/general/components/dashboard/AddManagerMenu.vue";
import { IonSpinner, IonMenu } from "@ionic/vue";
import { useQuery } from "@vue/apollo-composable";
import useId from "@/hooks/useId";
import { useProfileStore } from "../../stores/profile";
import { ref, watch } from "vue";
import { Query, RoleEnum, UserDocument } from "@/generated/graphql";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import useRoles from "@/hooks/useRole";

const isLoading = ref(true);
const facilities = ref();
const store = useProfileStore();
const facilityStore = useFacilityStore();
const { role } = useRoles();
const activeFacilityId = ref<string | null>(null);

const setIsLoading = () => {
  isLoading.value = false;
};

const { id } = useId();
const {
  result,
  refetch,
  onResult: gotUser,
} = useQuery<Pick<Query, "user">>(UserDocument, { id });

const getAvatarUrl = () => {
  switch (role) {
    case RoleEnum.User:
    case RoleEnum.Trainer:
      return result.value?.user?.avatarUrl;

    case RoleEnum.Manager:
    case RoleEnum.FacilityOwner:
    case RoleEnum.OrganizationOwner: {
      const facility = facilities.value?.find(
        (focility) => focility?.id === activeFacilityId.value
      );
      return facility?.media
        ? facility?.media[0]?.pathUrl
        : result.value?.user?.avatarUrl;
    }

    default:
      return "";
  }
};

gotUser(({ data }) => {
  console.log("User Store: ", data?.user);

  if (data.user?.role === RoleEnum.Manager) {
    facilities.value = result.value?.user?.facilities;
  } else {
    facilities.value = result.value?.user?.owned_facilities;
  }

  if (role !== RoleEnum.FacilityOwner) {
    activeFacilityId.value =
      facilities.value?.length && facilities.value[0]
        ? facilities.value[0].id
        : null;
  }

  activeFacilityId.value = facilityStore.facility?.id;

  if (data.user) {
    store.setValue("first_name", data.user?.first_name ?? "Default");
    store.setValue("last_name", data.user?.last_name ?? "Default");
    store.setValue("email", data.user?.email ?? "");
    store.setValue("avatarUrl", getAvatarUrl());
  }

  setIsLoading();
});

watch(
  () => facilityStore.facility.id,
  () => {
    refetch();
  }
);
</script>
<style scoped lang="scss">
.dashboard-container {
  width: 100%;
  min-height: 100vh;
  display: flex;

  &__sidebar {
    width: 256px;
    box-shadow: 6px 0px 18px 0px rgba(0, 0, 0, 0.25);
    background: var(--gray-700);
  }

  &__right-section {
    width: calc(100% - 256px);
  }
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

.scrollable-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
</style>
