<template>
  <div class="sidebar">
    <div class="menu-section">
      <div class="logo">
        <router-link to="/">
          <ion-img src="assets/icon/logo-complete.png" class="logo__img" alt="logo" />
        </router-link>
      </div>
      <div class="facility-list">
        <div class="facility" @click="openFacilityDropdown">
          <ion-avatar class="photo">
            <ion-img v-if="avatarUrl" :src="avatarUrl"></ion-img>
            <template v-else>
              {{ facilityName ? facilityName?.charAt(0) : symbols }}
            </template>
          </ion-avatar>
          <div class="facility__item-content">
            <div class="d-flex ion-align-items-center ion-justify-content-center" style="gap: 8px" v-if="name">
              <ion-title class="name selected">{{ name }}
              </ion-title>
              <ion-icon size="12px" src="assets/icon/arrow-down-light.svg"
                v-if="role !== RoleEnum.Trainer && role !== RoleEnum.User"></ion-icon>
            </div>
            <ion-text class="address">{{
              address
            }}</ion-text>
          </div>
        </div>
        <div class="facility-list__dropdown" v-if="facilities.length > 1 && isOpenFacilityDropdown">
          <div class="facility" v-for="facilityItem in facilities" :key="facilityItem.id"
            @click="selectFacility(facilityItem.id)">
            <ion-avatar class="photo">
              <ion-img v-if="facilityItem.media[0]?.pathUrl" :src="facilityItem.media[0]?.pathUrl"></ion-img>
              <template v-else>
                {{ facilityItem.name?.charAt(0) }}
              </template>
            </ion-avatar>
            <div class="facility__item-content">
              <ion-title class="name">{{ facilityItem.name }}</ion-title>
              <ion-text class="address">{{
                facilityItem.address?.street
              }}</ion-text>
            </div>
          </div>
        </div>
      </div>
      <div class="main-menu" v-if="role === RoleEnum.FacilityOwner">
        <div :class="getMenuItemClass(EntitiesEnum.DashboardOverview)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardOverview)">
          <ion-icon src="assets/icon/dashboard.svg" />
          <ion-text>Overview</ion-text>
        </div>
        <div :class="getMenuItemClass(EntitiesEnum.DashboardEvent)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardEvent)">
          <ion-icon src="assets/icon/events.svg" />
          <ion-text>Events</ion-text>
        </div>
        <div class="menu-item" @click="onHandleClickMenu(EntitiesEnum.DashboardPassList)">
          <ion-icon src="assets/icon/gym-user-icon.svg" />
          <ion-text>Passes</ion-text>
        </div>
        <div class="menu-item" @click="onHandleClickMenu(EntitiesEnum.DashboardDropinList)">
          <ion-icon src="assets/icon/dropin.svg" />
          <ion-text>Drop-ins</ion-text>
        </div>
        <div :class="getMenuItemClass(EntitiesEnum.DashboardWorkout)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardWorkout)">
          <ion-icon src="assets/icon/daily.svg" />
          <ion-text>Dailys</ion-text>
        </div>
        <div v-if="role === RoleEnum.FacilityOwner" :class="getMenuItemClass(EntitiesEnum.DashboardMembership)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardMembership)">
          <ion-icon src="assets/icon/add-user.svg" />
          <ion-text>Membership</ion-text>
        </div>
        <!-- <div class="menu-item" @click="onHandleClickMenu(EntitiesEnum.DashboardMessage)">
          <ion-icon src="assets/icon/email.svg" />
          <ion-text>Message</ion-text>
        </div> -->
      </div>
      <div class="main-menu" v-if="role === RoleEnum.User">
        <div
          :class="getMenuItemClass(role === RoleEnum.User ? EntitiesEnum.DashboardUserOverview : EntitiesEnum.DashboardOverview)"
          @click="onHandleClickMenu(role === RoleEnum.User ? EntitiesEnum.DashboardUserOverview : EntitiesEnum.DashboardOverview)">
          <ion-icon src="assets/icon/dashboard.svg" />
          <ion-text>Dashboard</ion-text>
        </div>
        <div :class="getMenuItemClass(EntitiesEnum.DashboardClientDailys)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardClientDailys)">
          <ion-icon src="assets/icon/dailys.svg" />
          <ion-text>Dailys</ion-text>
        </div>
        <!-- @todo: need to done this view -->
        <div :class="getMenuItemClass(EntitiesEnum.Trainers)"
          @click="onHandleClickMenu(EntitiesEnum.Trainers, EntitiesEnum.Trainers)">
          <ion-icon src="assets/icon/trainers.svg" />
          <ion-text>Trainers</ion-text>
        </div>
        <div :class="getMenuItemClass(role === RoleEnum.User ? EntitiesEnum.DashboardDiscover : EntitiesEnum.Discover)"
          @click="onHandleClickMenu(role === RoleEnum.User ? EntitiesEnum.DashboardDiscover : EntitiesEnum.Discover)">
          <ion-icon src="assets/icon/discover.svg" />
          <ion-text>Discover</ion-text>
        </div>
        <div :class="getMenuItemClass(EntitiesEnum.Gyms)"
          @click="onHandleClickMenu(EntitiesEnum.Gyms, EntitiesEnum.Facilities)">
          <ion-icon src="assets/icon/booking.svg" />
          <ion-text>Gym</ion-text>
        </div>
        <div :class="getMenuItemClass(EntitiesEnum.DashboardMessage)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardMessage)">
          <ion-icon src="assets/icon/email.svg" />
          <ion-text>Message</ion-text>
        </div>
      </div>
      <div class="setting-menu" v-if="role === RoleEnum.User">
        <div
          :class="getMenuItemClass(role === RoleEnum.User ? EntitiesEnum.DashboardBookingsHistory : EntitiesEnum.ProfileBookingHistory)"
          @click="onHandleClickMenu(role === RoleEnum.User ? EntitiesEnum.DashboardBookingsHistory : EntitiesEnum.ProfileBookingHistory)">
          <ion-icon src="assets/icon/add-user.svg" />
          <ion-text>Booking History</ion-text>
        </div>
        <div
          :class="getMenuItemClass(role === RoleEnum.User ? EntitiesEnum.GymPaymentMethod : EntitiesEnum.PaymentsMethods)"
          @click="onHandleClickMenu(role === RoleEnum.User ? EntitiesEnum.GymPaymentMethod : EntitiesEnum.DashboardGettingPaid)">
          <ion-icon src="assets/icon/Card.svg" />
          <ion-text>Payment Method</ion-text>
        </div>
        <!-- <div
          :class="getMenuItemClass(role === RoleEnum.User ? EntitiesEnum.UserDashboardCalendar : EntitiesEnum.DashboardCalendar)"
          @click="onHandleClickMenu(role === RoleEnum.User ? EntitiesEnum.UserDashboardCalendar : EntitiesEnum.DashboardCalendar)">
          <ion-icon src="assets/icon/calendar.svg" />
          <ion-text>Calender</ion-text>
        </div> -->
        <div :class="getMenuItemClass(EntitiesEnum.DashboardSettings)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardSettings)">
          <ion-icon src="assets/icon/Setting.svg" />
          <ion-text>Settings</ion-text>
        </div>
      </div>
      <div class="main-menu trainer-menu" v-if="role === RoleEnum.Trainer">
        <div :class="getMenuItemClass(EntitiesEnum.DashboardOverview)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardOverview)">
          <ion-icon src="assets/icon/dashboard.svg" />
          <ion-text>Overview</ion-text>
        </div>
        <div :class="getMenuItemClass(EntitiesEnum.DashboardBookings)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardBookings)">
          <ion-icon src="assets/icon/calendar.svg" />
          <ion-text>Bookings</ion-text>
        </div>
        <div :class="getMenuItemClass(EntitiesEnum.DashboardWorkout)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardWorkout)">
          <ion-icon src="assets/icon/daily.svg" />
          <ion-text>Dailys</ion-text>
        </div>
        <div :class="getMenuItemClass(EntitiesEnum.DashboardEvent)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardEvent)">
          <ion-icon src="assets/icon/events.svg" />
          <ion-text>Events</ion-text>
        </div>
        <div class="menu-item" :class="getMenuItemClass(EntitiesEnum.DashboardMessage)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardMessage)">
          <ion-icon src="assets/icon/email.svg" />
          <ion-text>Message</ion-text>
        </div>
      </div>
      <div class="setting-menu trainer-setting-menu" v-if="role === RoleEnum.Trainer">
        <div
          :class="getMenuItemClass(EntitiesEnum.DashboardBookingsHistory)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardBookingsHistory)">
          <ion-icon src="assets/icon/add-user.svg" />
          <ion-text>Booking History</ion-text>
        </div>
        <div :class="getMenuItemClass(EntitiesEnum.DashboardMembership)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardMembership)">
          <ion-icon src="assets/icon/add-user.svg" />
          <ion-text>Membership</ion-text>
        </div>
        <div :class="getMenuItemClass(EntitiesEnum.DashboardGettingPaid)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardGettingPaid)">
          <ion-icon src="assets/icon/Card.svg" />
          <ion-text>Getting Paid</ion-text>
        </div>
        <div :class="getMenuItemClass(EntitiesEnum.DashboardSettings)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardSettings)">
          <ion-icon src="assets/icon/Setting.svg" />
          <ion-text>Settings</ion-text>
        </div>
      </div>
      <div class="setting-menu" v-if="role === RoleEnum.FacilityOwner">
        <div :class="getMenuItemClass(EntitiesEnum.DashboardListGyms)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardListGyms)">
          <ion-icon src="assets/icon/gym-icon.svg" />
          <ion-text>Location</ion-text>
        </div>
        <div :class="getMenuItemClass(EntitiesEnum.DashboardGymManager)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardGymManager)">
          <ion-icon src="assets/icon/profile.svg" />
          <ion-text>Teams</ion-text>
        </div>
        <div :class="getMenuItemClass(EntitiesEnum.DashboardGettingPaid)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardGettingPaid)">
          <ion-icon src="assets/icon/Card.svg" />
          <ion-text>Accounting</ion-text>
        </div>
        <div :class="getMenuItemClass(EntitiesEnum.DashboardSettings)"
          @click="onHandleClickMenu(EntitiesEnum.DashboardSettings)">
          <ion-icon src="assets/icon/Setting.svg" />
          <ion-text>Settings</ion-text>
        </div>
      </div>
    </div>
    <div class="logout">
      <div class="menu-item" @click="onLogout">
        <ion-icon src="assets/icon/Logout.svg" />
        <ion-text>Logout</ion-text>
      </div>
    </div>
  </div>
  <confirmation :is-visible="showConfirmationModal" title="Do you want to log out?" description="You will be logged out"
    button-text="Log out" @discard="onLogoutConfirmed" @decline="hideModal" />
</template>

<script lang="ts" setup>
import { IonText, IonImg, IonIcon, IonAvatar, IonTitle } from "@ionic/vue";
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { clearAuthItems } from "@/router/middleware/auth";
import { ref, computed, watch, defineProps, withDefaults } from "vue";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import { useTrainerStore } from "@/general/stores/useTrainerStore";
import { useProfileStore } from "../../stores/profile";
import { setSelectedGym } from "@/router/middleware/gymOwnerSubscription";
import useRoles from "@/hooks/useRole";
import { RoleEnum } from "@/generated/graphql";
import useId from "@/hooks/useId";
import { Query, UserDocument } from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";


const props = withDefaults(
  defineProps<{
    facilities: any;
  }>(),
  {
    facilities: [],
  }
);

const { role } = useRoles();
const facilityStore = useFacilityStore();
const trainerStore = useTrainerStore();
const router = useRouter();
const activeFacilityId = ref<string | null>(props.facilities[0]?.id);
const isOpenFacilityDropdown = ref<boolean>(false);
const { showConfirmationModal, hideModal, showModal } = useConfirmationModal();
const { id } = useId();

if (!facilityStore.facility?.id && props.facilities.length) {
  facilityStore.setFacility(props.facilities[0]);
  setSelectedGym(props.facilities[0]?.id);
}

const {
  result,
  refetch,
  onResult: gotUser,
} = useQuery<Pick<Query, "user">>(UserDocument, { id });

const facilities = computed(() => {
  return props.facilities;
});

const avatarUrl = computed(() => {
  const profileStore = useProfileStore();
  return profileStore.avatarUrl;
});

const openFacilityDropdown = () => {
  if (role === RoleEnum.Trainer) {
    router.push({
      name: EntitiesEnum.DashboardUserProfilePreview,
    });
    return;
  }
  isOpenFacilityDropdown.value = !isOpenFacilityDropdown.value;
};

const selectFacility = (id) => {
  const f = props.facilities.find((facility) => facility?.id === id);
  console.log('facilitity',f);
  
  facilityStore.setFacility(f);
  setSelectedGym(id);
  isOpenFacilityDropdown.value = false;

  router.push({
    name: EntitiesEnum.DashboardOverview,
  });
};

watch(
  () => facilityStore.facility.id,
  () => {
    activeFacilityId.value = facilityStore.facility.id;
  }
);

const facilityName = computed<string>(
  () =>
    facilities.value?.find(
      (facility: any) => facility.id === activeFacilityId.value
    )?.name ?? ""
);
const facilityAddress = computed<string>(
  () =>
    facilities.value?.find(
      (facility: any) => facility.id === activeFacilityId.value
    )?.address?.street ?? ""
);

const symbols = computed<string>(() => {
  const symb = name.value?.split(' ');
  if (symb?.length) {
    return (symb[0]?.charAt(0) + symb[1]?.charAt(0)).toUpperCase();
  }
});

const name = computed(() => {
  switch (role) {
    case RoleEnum.FacilityOwner:
    case RoleEnum.OrganizationOwner:
      return facilityName.value;

    case RoleEnum.Trainer:
      return trainerStore.trainer.first_name + ' ' + trainerStore.trainer.last_name;
    case RoleEnum.User:
      return result.value?.user?.first_name + ' ' + result.value?.user?.last_name;
  }
});

const address = computed(() => {
  switch (role) {
    case RoleEnum.FacilityOwner:
    case RoleEnum.OrganizationOwner:
      return facilityAddress.value;

    case RoleEnum.Trainer:
      return trainerStore.trainer.address?.street + ' ' + trainerStore.trainer.last_name;
    case RoleEnum.User:
      return result.value?.user?.address?.street + ' ' + result.value?.user?.address?.city?.name;
  }
});

const onHandleClickMenu = (pathName: string, type: EntitiesEnum | null = null) => {
  if (role === RoleEnum.User) {
    let params = {};
    if (type && pathName !== EntitiesEnum.GymPaymentMethod) {
      params = {
        type: type
      };
    }
    else {
      params = {
        id: id
      };
    }
    return router.push({
      name: pathName,
      params
    });
  }
  router.push({ name: pathName });
};

const onLogout = () => {
  showModal();
};

const onLogoutConfirmed = () => {
  clearAuthItems();
  router.push({ name: EntitiesEnum.Login });
  hideModal();
};

const getMenuItemClass = (name: string) => {
  return {
    "menu-item": true,
    current: router.currentRoute.value.name === name,
  };
};
</script>
<style scoped lang="scss">
.sidebar {
  position: relative;
  height: 100vh;

  .menu-section {
    height: calc(100vh - 45px);
    overflow: auto;
  }

  .main-menu {
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  }

  .setting-menu {
    padding: 12px 0;
    display: flex;
    flex-direction: column;
  }

  .menu-item {
    padding: 12px 24px;
    display: flex;
    align-items: center;
    gap: 14px;
    color: var(--gray-500);
    font-family: Lato;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    cursor: pointer;

    &:hover,
    &.current {
      color: var(--gold);
    }
  }

  .logo {
    padding: 24px;
  }

  .facility-list {
    position: relative;

    .facility {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 16px;
      cursor: pointer;

      &:hover {
        background-color: var(--gray-800);
      }

      .photo {
        width: 46px;
        height: 46px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--main-color);
        line-height: 16px;
      }

      .name {
        padding: 0;
        color: var(--FITNESS-WHITE, #efefef);
        font-family: Poppins;
        font-size: 1.25rem;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }

      .name.selected {
        width: calc(100% - 24px);
      }

      .address {
        color: var(--gray-400);
        font-family: Yantramanav;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%;
        /* 21px */
      }

      &__item-content {
        width: calc(100% - 64px);
      }
    }

    &__dropdown {
      width: 240px;
      position: absolute;
      z-index: 9999;
      top: 100%;
      left: 8px;
      padding: 12px 0;
      background-color: var(--main-color);
      border-end-end-radius: 8px;
      border-end-start-radius: 8px;
    }
  }

  .logout {
    width: 100%;
    position: absolute;
    bottom: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.6);
  }
}

.trainer-menu,
.trainer-setting-menu {
  ion-icon {
    font-size: 20px;
  }
}
</style>
