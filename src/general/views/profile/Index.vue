<template>
  <base-layout content-full-height>
    <template #header>
      <page-header title="Settings" />
    </template>
    <template #content>
      <div class="profile">
        <progress-avatar
          :src="avatarUrl || ''"
          :progress="progress"
          :radius="52"
          :stroke="2"
          class="profile__avatar"
          :symbols="symbols"
          :disabled="
            role === RoleEnum.OrganizationOwner ||
            role === RoleEnum.FacilityOwner ||
            role === RoleEnum.Manager ||
            role === RoleEnum.Trainer
          "
        />
        <div class="profile__head">
          <ion-title
            @click="role === RoleEnum.OrganizationOwner && showGymModal()"
            class="profile__fullname"
          >
            <template
              v-if="role === RoleEnum.User || role === RoleEnum.Trainer"
            >
              {{ result?.user?.first_name }} {{ result?.user?.last_name }}
            </template>
            <template v-else>
              {{ facilityName }}
            </template>
            <ion-icon
              class="profile__fullname-icon"
              icon="assets/icon/arrow-down.svg"
              v-if="role === RoleEnum.OrganizationOwner"
            />
          </ion-title>
          <div class="profile__address">
            <address-item large>
              <template
                v-if="role === RoleEnum.User || role === RoleEnum.Trainer"
              >
                <template v-if="result?.user?.address">
                  {{ result?.user.address?.city?.state.name }},
                  {{ result?.user.address?.city?.name }},
                  {{ result?.user.address?.street }}
                </template>
                <template v-else>{{ defaultAddress }}</template>
              </template>
              <template v-else>
                {{ facilityAddress }}
              </template>
            </address-item>
          </div>
        </div>
        <div class="profile__options">
          <choose-block
            :key="menuItem.name"
            v-for="menuItem in menu"
            :title="menuItem.label"
            :icon="menuItem.icon"
            @click="goTo(menuItem.name)"
            :disabled="menuItem.isTrusted && !isTrusted"
          />
        </div>
        <div class="buttons">
          <ion-button
            expand="block"
            class="secondary"
            @click="onLogout"
            :disabled="profileOnDeleting"
          >
            Log out
          </ion-button>
          <ion-button
            fill="outline"
            color="danger"
            expand="block"
            :disabled="profileOnDeleting"
            @click="showDeleteConfirmationModal"
          >
            Delete profile
          </ion-button>
        </div>
      </div>
    </template>
  </base-layout>
  <confirmation
    :is-visible="showConfirmationModal"
    title="Do you want to log out?"
    description="You will be logged out"
    button-text="Log out"
    @discard="onLogoutConfirmed"
    @decline="hideModal"
  />

  <confirmation
    :is-visible="isDeleteConfirmationModalVisible"
    title="Are you sure you want to delete your profile?"
    description="All your profile data and history will be deleted without the possibility for recovery."
    button-text="Delete"
    @discard="onDeleteProfileConfirmed"
    @decline="hideDeleteConfirmationModal"
  />

  <ion-modal
    ref="modal"
    :is-open="isGymModalOpen"
    class="choose-facility-modal"
    @willDismiss="isGymModalOpen = false"
    v-if="facilities?.length && activeFacilityId"
  >
    <div class="modal-gym__content">
      <ion-radio-group
        v-model="activeFacilityId"
        @ionChange="isGymModalOpen = false"
      >
        <choice-location
          :id="facility?.id"
          :key="facility?.id"
          :facility="facility"
          v-for="facility in facilities"
        />
      </ion-radio-group>
      <ion-button
        @click="addNewFacility"
        class="add-facility-button secondary"
        expand="block"
      >
        Add new gym
      </ion-button>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonRadioGroup,
  IonButton,
  IonIcon,
  IonModal,
  IonTitle,
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
import { profileMenu } from "@/const/profile-menu";
import useId from "@/hooks/useId";
import ChoiceLocation from "@/general/components/ChoiceLocation.vue";
import { Capacitor } from "@capacitor/core";
import useSubscription from "@/hooks/useSubscription";

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
const menu = profileMenu[menuType];

const goTo = (name: EntitiesEnum) => {
  switch (name) {
    case EntitiesEnum.Facility:
      router.push({
        name,
        params: {
          id: route.query.facilityId as string,
        },
      });

      break;
    case EntitiesEnum.ProfileEdit:
      router.push({
        name,
        query: {
          facilityId: route?.query?.facilityId || "",
        },
      });

      break;
    case EntitiesEnum.ProfileMembership:
      console.log({currentSubscriptionType});
      if(Capacitor.isNativePlatform()) {
        if(currentSubscriptionType === 'BASIC') {
          router.push({
            name: EntitiesEnum.StartMembership,
          });
          break;
        }
        router.push({
          name: EntitiesEnum.ChangeMembership,
          query: {
            facilityId: route?.query?.facilityId || "",
          },
        });
        break;
      }
      router.push({
        name,
        query: {
          facilityId: route?.query?.facilityId || "",
        },
      });

      break;
    default:
      router.push({
        name,
      });

      break;
  }
};

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
  text-align: center;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;

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
}

.buttons {
  margin-top: 24px;

  .button {
    margin: 0;

    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}

.choose-facility-modal {
  --height: auto;
  align-items: flex-end;
  --backdrop-opacity: 0.6;
  --ion-backdrop-color: var(--ion-color-black);

  &::part(content) {
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
    border-radius: 20px 20px 0 0;
    -webkit-overflow-scrolling: touch;
    padding: 16px 24px calc(16px + var(--ion-safe-area-bottom));
    max-height: calc(
      100vh - 136px - var(--ion-safe-area-top) - var(--ion-safe-area-bottom)
    );
  }
}

.add-facility-button {
  margin: 0 8px;
}
</style>
