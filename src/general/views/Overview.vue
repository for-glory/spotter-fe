<template>
  <base-layout 
    content-full-height 
    :hideNavigationMenu="loadingUser || loadingDashboarData" 
    :class="{ 'trainer-overview': role === RoleEnum.Trainer }" 
  >
    <template #header>
      <page-header title="Overview" title-class="header_overview__title">
        <template #avatar-field>
          <ion-avatar v-if="!loadingUser || !loadingDashboarData" class="header__photo" @click="openSettings">
            <ion-img v-if="avatarUrl" :src="avatarUrl"></ion-img>
            <template v-else>
              {{ facilityName?.charAt(0) }}
            </template>
          </ion-avatar>
        </template>
        <template #custom-btn>
          <ion-button v-if="(role !== RoleEnum.FacilityOwner) && (!loadingUser || !loadingDashboarData)" @click="onViewChat" class="header-btn">
            <ion-icon src="assets/icon/chat.svg" />
            <span v-if="unreadMessages.length || role === RoleEnum.Trainer" class="header-btn__badge"></span>
          </ion-button>
          <ion-button v-if="!loadingUser || !loadingDashboarData" @click="openQR" class="header-btn">
            <ion-icon src="assets/icon/scan.svg" />
          </ion-button>
        </template>
      </page-header>
    </template>
    <template #content>
      <ion-spinner
        v-if="loadingUser || loadingDashboarData"
        name="lines"
        class="spinner"
      />
      <div v-else class="profile">
        <fitness-center-stats :overviewData="overviewData"  />
        <revenue v-if="role !== RoleEnum.Trainer" :overviewData="overviewData" />
        <attendance-trend v-if="role !== RoleEnum.Trainer" :overviewData="overviewData" />
        <market-stats />
        <event-status />
        <event-status :title="'Training Status'" />
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
  IonAvatar,
  IonSpinner
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
  FacilityDashboardWidgetDocument,
  Facility
} from "@/generated/graphql";
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
import CustomChart from "@/general/components/dashboard/CustomChart.vue";
import EventItem from "@/general/components/dashboard/EventItem.vue";
import FitnessCenterStats from "@/general/components/overview/FitnessCenterStats.vue";
import Revenue from "@/general/components/overview/Revenue.vue";
import AttendanceTrend from "@/general/components/overview/AttendanceTrend.vue";
import MarketStats from "@/general/components/overview/MarketStats.vue";
import EventStatus from "@/general/components/overview/EventStatus.vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  ArcElement
} from 'chart.js';
import { Doughnut } from 'vue-chartjs';
import { onValue } from "firebase/database";
import { chatsRef } from "@/firebase/db";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import { useUserStore } from "@/general/stores/user";
import { useTrainerStore } from "@/general/stores/useTrainerStore";

ChartJS.register(CategoryScale, ArcElement, Title, Tooltip, Legend);

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

const defaultAddress = process.env.VUE_APP_DEFAULT_POSITION_ADDRESS;
const unreadMessages = ref<number[]>([]);
const facilityStore = useFacilityStore();
const userStore = useUserStore();
const trainerStore = useTrainerStore();
const overviewData = ref<any>({});
const modal = ref<typeof IonModal | null>(null);

onMounted(() => {
  fetchChats();
});

const activeFacilityId = computed(() => facilityStore?.facility?.id );

const {
  result: dashboardData,
  loading: loadingDashboarData,
  refetch,
  onResult: gotData,
} = useQuery(FacilityDashboardWidgetDocument, { id: activeFacilityId.value });

watch(
  () => activeFacilityId.value,
  (newVal) => {
    router.push({
      name: router?.currentRoute?.value?.name,
      query: { facilityId: newVal },
    });
    refetch({ id: facilityStore?.facility.id });
  }
);

const avatarUrl = computed(() => {
  switch (role) {
    case RoleEnum.User:
    case RoleEnum.Trainer:
      return userStore.avatarUrl;

    case RoleEnum.Manager:
    case RoleEnum.FacilityOwner:
    case RoleEnum.OrganizationOwner: {
      return facilityStore.facility?.media
        ? facilityStore.facility?.media[0]?.pathUrl
        : userStore.avatarUrl;
    }

    default:
      return "";
  }
});

gotData(({ data }) => {
  overviewData.value = data?.facilityDashboardWidget;
})

const fetchChats = () => {
  if (unreadMessages.value.length) unreadMessages.value = [];
  onValue(chatsRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const chat = childSnapshot.val();
      if (chat.unread && chat.unread[id]) {
        unreadMessages.value.push(chat.unread[id]);
      }
    });
  });
};

const openQR = () => {
  router.push({
    name: EntitiesEnum.TrainersUpcomingTrainings,
  });
};

const onViewChat = () => {
  router.push({ name: EntitiesEnum.ChatList });
};

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

const openSettings = () => {
  router.push({
    name: EntitiesEnum.Profile,
  });
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
    color: var(--fitnesswhite);
  }
  .view-option {
    color: #E1DBC5;
    display: flex;
    align-items: center;
    gap: 3px;

    ion-text {
      font: 500 14px/1 Lato;
    }
    ion-img {
      width: 16px;
      height: 16px;
    }
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
.membership {
  .count {
    font-size: 1.625rem;
    color: var(--gold);
    padding-left: 0.6rem;
    font-weight: bold;
  }
  .period {
    font-size: 1rem;
    color: grey;
    padding-bottom: 0.6rem;
  }
  .time {
    font-size: 0.875rem;
    color: var(--gold);
  }
  .content {
    font-size: 1rem;
    color: #797979;
  }

  ion-row {
    justify-content: space-between;
    gap: 24px;
  }
}
.attendance {
  min-height: 275px;

  .chart-container {
    position: static;
    display: block;
    height: auto;
  }

  .split {
    width: 100%;
    height: 1px;
    background-color: var(--gray-600);
    margin-top: 14px;
    margin-bottom: 14px;
  }

  .description {
    min-width: 95px;

    .poor {
      color: #F7685B;
      margin-bottom: 7px;
    }
    .fair {
      color: #FFB946;
      margin-bottom: 7px;
    }
    .good {
      color: #2F9BFF;
      margin-bottom: 7px;
    }
    .excellent {
      color: #2ED47A;
      margin-bottom: 7px;
    }
  }
  .warning-box {
    min-height: 80px;
    padding: 1px 7px 10px 6px;
    background-color: var(--ion-color-gray-900-tint);
    position: relative;

    ion-text {
      color: var(--ion-gray-400);
      font: 300 10px/1 Lato;
    }
    ion-img {
      width: 24px;
      height: 24px;
      position: absolute;
      bottom: 3px;
      right: 6px;
      flex: auto;
    }
  }
  .gap {
    gap: 25px;
  }
}
.market-description {
  gap: 8px;

  ion-icon {
    margin-right: 4px;
  }
  ion-text {
    font: 10px/1 Lato;
    color: #ffffff6a;
  }
}
.stats {
  font: 600 20px/1 Lato;
  color: #F7685B;
}
.block {
  width: 100%;
  background-color: #262626;
  border-radius: 4px;
  margin-bottom: 1rem;
  padding: 1rem 1rem 1rem 1rem;
}
.perform {
  margin: 0 1.5rem;
}
.red-text {
  color: #DC5858;
}

.upcomming {
  border-radius: 12px;
  background-color: var(--gray-800);
  padding: 16px 6px;

  .main-box {
    padding: 16px 6px;
  }
  .description {
    font: 300 12px/1 Lato;
    color: var(--gray-400);
  }
  .input-wrapper {
    display: block;
  }
  
  ion-img {
    width: 62px;
    height: 62px;
    margin-right: 14px;

    --border-radius: 12px;
  }

  ion-button#count {
    --border-radius: 12px;
    width: 62px;
    height: 20px;
    color: #F7685B;
    font: 500 10px/1 Lato;
  }
}
.red-title {
  padding: 8px 0px;
  font-size: 1.6rem;
  line-height: 1.3;
  font-weight: 400;
  color: #DC5858;
}
.doughnut {
  margin-top: -100px;
  margin-bottom: -50px;
}
.header-btn {
  height: 32px;
  margin: 0 5px;
  font-size: 24px;
  display: block;
  min-width: 32px;
  --border-radius: 50% !important;
  --icon-font-size: 24px;
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  --icon-padding-bottom: 0;
  --icon-padding-end: 0;
  --icon-padding-start: 0;
  --icon-padding-top: 0;
  --min-height: 32px;
  --min-width: 32px;

  ion-icon {
    font-size: 1em;
  }

  &__badge {
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: absolute;
    margin: -12px 0 0 4px;
    background: var(--ion-color-danger-tint);
  }
}
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
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
img#cover {
  width: 62px;
  height: 62px;
  border-radius: 12px;
}
.time-icon {
  width: 12px;
  height: 12px;
}

.trainer-overview {
  .header-btn__badge {
    background: var(--color-red);
  }
}
</style>
