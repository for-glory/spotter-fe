<template>
  <base-layout content-full-height>
    <template #header>
      <div class="d-flex align-items-center header">
        <ion-avatar class="header__photo">
					<ion-img v-if="avatarUrl" :src="avatarUrl"></ion-img>
					<template v-else>
						{{ facilityName?.charAt(0) }}
					</template>
				</ion-avatar>
        <ion-title class="header__title">Overview</ion-title>
      </div>
    </template>
    <template #content>
      <div class="profile">
        <div>
          <ion-title class="title">Revenue</ion-title>
          <div class="block">
            <div class="revenue">
              <div class="type">Total revenue</div>
              <div class="period">Today</div>
              <div class="percent">
                0.8%
                <ion-icon class="arrow" src="assets/icon/arrow-down-light.svg" />
              </div>
              <div class="chain">$3,689,076</div>
            </div>
            <div class="revenue">
              <div>
                <div class="type">Quarterly revenue</div>
                <div class="period">Earned</div>
                <div class="percent">70%</div>
                <div class="chain">
                  $1068<span class="period">/ day</span>
                </div>
              </div>
              <ion-icon
                class="vector"
                src="assets/icon/chat/Vector.svg"
              />
            </div>
            <div class="revenue">
              <div class="type">Earned revenue</div>
              <div class="period">This year</div>
              <div class="percent">
                0.8%
                <ion-icon class="arrow" src="assets/icon/call_made.svg" />
              </div>
              <div class="chain">$689,076</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import {
  IonRadioGroup,
  IonButton,
  IonIcon,
  IonModal,
  IonTitle,
  IonImg,
  IonAvatar
} from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  Query,
  RoleEnum,
  SettingsCodeEnum,
  UserDocument,
  DeleteProfileDocument,
  SubscriptionsTypeEnum,
} from "@/generated/graphql";
import ProgressAvatar from "@/general/components/ProgressAvatar.vue";
import AddressItem from "@/general/components/AddressItem.vue";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import { EntitiesEnum } from "@/const/entities";
import { clearAuthItems } from "@/router/middleware/auth";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";
import useRoles from "@/hooks/useRole";
import useId from "@/hooks/useId";
import ChoiceLocation from "@/general/components/ChoiceLocation.vue";
import { Capacitor } from "@capacitor/core";
import useSubscription from "@/hooks/useSubscription";
import DashboardItem from "@/general/components/DashboardItem.vue";

const router = useRouter();
const route = useRoute();
const { showConfirmationModal, hideModal, showModal } = useConfirmationModal();
const {
  showConfirmationModal: isDeleteConfirmationModalVisible,
  hideModal: hideDeleteConfirmationModal,
  showModal: showDeleteConfirmationModal,
} = useConfirmationModal();

const { id } = useId();
const { role } = useRoles();
const { type: currentSubscriptionType } = useSubscription();

const defaultAddress = process.env.VUE_APP_DEFAULT_POSITION_ADDRESS;

const {
  result,
  refetch,
  onResult: gotUser,
} = useQuery<Pick<Query, "user">>(UserDocument, { id });
const progress = ref<string | number>("");

const isTrusted = computed(() =>
  role === RoleEnum.User ? Number(progress.value) >= 100 : true
);

onMounted(() => {
  refetch();
});

const facilities = computed(() => {
  switch (role) {
    case RoleEnum.OrganizationOwner: {
      return result.value?.user?.owned_facilities;
    }

    case RoleEnum.Manager:
    case RoleEnum.FacilityOwner:
      return result.value?.user?.facilities;

    default:
      return [];
  }
});

const activeFacilityId = ref<string | null>(null);

watch(
  () => activeFacilityId.value,
  (newVal) => {
    router.push({
      name: router?.currentRoute?.value?.name,
      query: { facilityId: newVal },
    });
  }
);

const avatarUrl = computed(() => {
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
});
const facilityName = computed<string>(
  () =>
    facilities.value?.find(
      (focility: any) => focility.id === activeFacilityId.value
    )?.name ??
    result.value?.user?.email ??
    ""
);
const facilityAddress = computed<string>(
  () =>
    facilities.value?.find(
      (focility: any) => focility.id === activeFacilityId.value
    )?.address?.street ?? defaultAddress
);
const symbols = computed<string>(() => {
  switch (role) {
    case RoleEnum.User:
    case RoleEnum.Trainer:
      return `${result.value?.user?.first_name?.charAt(0) || ""}${
        result.value?.user?.last_name?.charAt(0) || ""
      }`;

    case RoleEnum.Manager:
    case RoleEnum.FacilityOwner:
    case RoleEnum.OrganizationOwner:
      return facilityName.value?.charAt(0) || "";

    default:
      return "";
  }
});

gotUser(({ data }) => {
  activeFacilityId.value =
    facilities.value?.length && facilities.value[0]
      ? facilities.value[0].id
      : null;

  progress.value = data?.user?.settings?.find(
    (settings: any) => settings.setting.code === SettingsCodeEnum.VerifiedUser
  )?.value
    ? 100
    : 0;
});

const onLogout = () => {
  showModal();
};

const onLogoutConfirmed = () => {
  clearAuthItems();
  router.push({ name: EntitiesEnum.Login });
  hideModal();
};

const menuType =
  role === RoleEnum.OrganizationOwner ||
  role === RoleEnum.FacilityOwner ||
  role === RoleEnum.Manager
    ? EntitiesEnum.Facility
    : role;

const isGymModalOpen = ref<boolean>(false);
const showGymModal = () => {
  isGymModalOpen.value = true;
};

const addNewFacility = () => {
  isGymModalOpen.value = false;
  router.push({
    name: EntitiesEnum.AddNewGym,
  });
};

const {
  mutate: deleteProfile,
  loading: profileOnDeleting,
  onDone: profileDeleted,
} = useMutation(DeleteProfileDocument);

const onDeleteProfileConfirmed = () => {
  deleteProfile();
  hideDeleteConfirmationModal();
};

profileDeleted(() => {
  clearAuthItems();
  router.push({ name: EntitiesEnum.Login });
});
</script>
<style scoped lang="scss">
.profile {
  padding: 16px 24px;

  &__head {
    text-align: center;
    margin-bottom: 24px;
  }

  &__address {
    .address {
      margin: 0 auto;
      display: block;
      line-height: 28px;
      text-overflow: ellipsis;
      justify-content: center;
    }
  }

  &__avatar {
    margin-bottom: 10px;
  }

  &__fullname {
    padding: 0;
    font-family: "Yantramanav", serif;
    font-weight: 500;
    font-size: 20px;
    line-height: 1.5;
    color: var(--ion-color-white);
  }

  &__fullname-icon {
    display: inline-block;
    vertical-align: middle;
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &:deep(.choose-place__icon--start) {
    height: 20px;
    width: 20px;
  }

  &:deep(.choose-place__label) {
    display: flex;
  }

  .title {
    padding: 8px 0px;
    font-size: 1.6rem;
    line-height: 1.3;
    font-weight: 400;
  }
}
.background-content {
  background-color: #202020;
}
.header {
  padding: 16px 7px;

  &__title {
    padding: 0;
    font-family: "Yantramanav", serif;
    font-size: 20px;
    line-height: 1.5;
    font-weight: 500;
    text-align: center;
  }

  &__photo {
    min-width: 28px;
    min-height: 28px;
    max-width: 28px;
    max-height: 28px;
  }
}
.revenue {
  margin: 0.3rem 0.3rem;
  padding: 1rem 0 1rem 1rem;
  border: 1px solid white;
  border-radius: 8px;

  .type {
    font-size: 1rem;
    color: white;
    padding-bottom: 10px;
  }
  .percent {
    font-size: 1.625rem;
    color: #2ed47a;
    padding-bottom: 5px;
  }
  .chain {
    font-size: 1.625rem;
    color: white;
  }
  .arrow {
    padding-left: 0.6rem;
  }
}
.block {
  width: 100%;
  background-color: #262626;
  border-radius: 4px;
  margin-bottom: 1rem;
  padding: 1rem 1rem 1rem 1rem;
}
</style>
