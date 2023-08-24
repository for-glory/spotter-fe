<template>
  <base-layout content-full-height>
    <template #header>
      <page-header title="Overview">
        <template #avatar-field>
          <ion-avatar class="header__photo" @click="role === RoleEnum.OrganizationOwner || role === RoleEnum.FacilityOwner && showGymModal()">
            <ion-img v-if="avatarUrl" :src="avatarUrl"></ion-img>
            <template v-else>
              {{ facilityName?.charAt(0) }}
            </template>
          </ion-avatar>
        </template>
        <template #custom-btn>
          <ion-button v-if="!loadingUser" @click="onViewChat" class="header-btn">
            <ion-icon src="assets/icon/chat.svg" />
            <span class="header-btn__badge" v-if="unreadMessages.length"></span>
          </ion-button>
        </template>
      </page-header>
    </template>
    <template #content>
      <ion-spinner
        v-if="loadingUser"
        name="lines"
        class="spinner"
      />
      <div v-else class="profile">
        <div class="membership">
          <ion-title class="title">Membership Summary</ion-title>
          <ion-grid class="block">
            <ion-row>
              <ion-col size="5">
                <summary-item title="Total" keyText="New Signs-up" value="14"/>
              </ion-col>
              <ion-col size="5">
                <summary-item title="Total" keyText="Active" value="60"/>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="5">
                <summary-item title="Today's" keyText="Event counts" value="23"/>
              </ion-col>
              <ion-col size="5">
                <summary-item title="Today's" keyText="Message counts" value="13"/>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="5">
                <summary-item title="Total" keyText="Expiring membership" value="24"/>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
        <div>
          <ion-title class="title">Revenue</ion-title>
          <div class="block">
            <div class="revenue">
              <div class="type">Total revenue</div>
              <div class="period">Today</div>
              <div class="percent">
                0.8%
                <ion-icon
                  class="vector"
                  src="assets/icon/vector.svg"
                />
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
        <div class="attendance">
          <div class="d-flex align-items-center justify-content-between">
            <ion-title class="title">Market Stats</ion-title>
            <div class="view-option">
              <ion-text>This Year</ion-text>
              <ion-img src="assets/icon/arrow-down-light.svg"></ion-img>
            </div>
          </div>
          <div class="block attendance">
            <custom-chart :chartData="attendanceChartData" :chartOptions="attendanceChartOption" />
            <div class="split" />
            <div class="d-flex align-items-center justify-content-between gap">
              <div class="description">
                <div class="poor">
                  <ion-text>0 - 25%</ion-text>&nbsp;&nbsp;<ion-text>Poor</ion-text>
                </div>
                <div class="fair">
                  <ion-text>25 - 25%</ion-text>&nbsp;&nbsp;<ion-text>Fair</ion-text>
                </div>
                <div class="good">
                  <ion-text>50 - 25%</ion-text>&nbsp;&nbsp;<ion-text>Good</ion-text>
                </div>
                <div class="excellent">
                  <ion-text>75 - 25%</ion-text>&nbsp;&nbsp;<ion-text>Excellent</ion-text>
                </div>
              </div>
              <div class="warning-box">
                <ion-text >Here’s a visualization chart which depict attendance trends over a specified period. Gym owner can identify peak and low attendance periods.</ion-text>
                <ion-img src="assets/icon/warning-2.svg"></ion-img>
              </div>
            </div>
          </div>
        </div>
        <div class="attendance">
          <div class="d-flex align-items-center justify-content-between">
            <ion-title class="title">Market Stats</ion-title>
            <div class="view-option">
              <ion-text>This Month</ion-text>
              <ion-img src="assets/icon/arrow-down-light.svg"></ion-img>
            </div>
          </div>
          <div class="block attendance">
            <custom-chart :chartData="marketChartData" :chartOptions="marketChartOption"/>
            <div class="split" />
            <div class="d-flex align-items-center justify-content-between">
              <div class="market-description d-flex align-items-center justify-content-center">
                <div class="d-flex aling-items-center">
                  <ion-icon class="yellow" src="assets/icon/Ellipse-yellow.svg" slot="icon-only"></ion-icon>
                  <ion-text>Workout</ion-text>
                </div>
                <div class="d-flex aling-items-center">
                  <ion-icon class="green" src="assets/icon/Ellipse-green.svg" slot="icon-only"></ion-icon>
                  <ion-text>Gym pass</ion-text>
                </div>
                <div class="d-flex aling-items-center">
                  <ion-icon class="purple" src="assets/icon/Ellipse-purple.svg" slot="icon-only"></ion-icon>
                  <ion-text>Drop-ins</ion-text>
                </div>
                <div class="d-flex aling-items-center">
                  <ion-icon class="red" src="assets/icon/Ellipse-red.svg" slot="icon-only"></ion-icon>
                  <ion-text>Event pass</ion-text>
                </div>
              </div>
              <div class="stats d-flex align-items-center">
                <ion-text>{{-0.88}}%</ion-text>
                <ion-icon src="assets/icon/arrow-square-up.svg"></ion-icon>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="title">Event Status</div>
          <div class="block">
            <div class="perform">
              <doughnut 
                :data="chartData"
                :options="chartOptions"
                :width="null"
                :height="null"
                class="doughnut"
              />
              <div class="d-flex align-items-center justify-content-between">
                <div class="title white-text">Completed</div>
                <div class="view-option">View All <ion-img src="assets/icon/arrow-down-light.svg"></ion-img></div>
              </div>
              <event-item
                title="Swimming & Cycling1111"
                dateTime="Saturday, April 14 | 08:00 AM"
                status="Closed"
              />
              <event-item
                title="Swimming & Cycling"
                dateTime="Saturday, April 14 | 08:00 AM"
                status="Closed"
              />
              <event-item
                title="Swimming & Cycling"
                dateTime="Saturday, April 14 | 08:00 AM"
                status="Closed"
              />
              <event-item
                title="Swimming & Cycling"
                dateTime="Saturday, April 14 | 08:00 AM"
                status="Closed"
              />
              <!-- <div class="d-flex align-items-center justify-content-between">
                <div class="red-title">Upcoming</div>
                <div class="view-option">View All <ion-img src="assets/icon/arrow-down-light.svg"></ion-img></div>
              </div>
              <div>
                <div class="upcomming">
                  <div class="main-box d-flex align-items-center">
                    <img src="assets/backgrounds/banner1.jpeg" id="cover" />
                    <div>
                      <div class="d-flex align-items-center justify-content-between">
                        <ion-text>Run competition</ion-text>
                        <ion-text>$100.00</ion-text>
                      </div>
                      <div class="d-flex align-items-center justify-content-between">
                        <ion-text>10 July</ion-text>
                        <ion-text>Entry</ion-text>
                      </div>
                      <div class="d-flex justify-content-between">
                        <div>
                          <div>
                            <ion-icon src="assets/icon/time.svg" class="time-icon" />
                            08:30 AM
                          </div>
                          <address-item class="event__address">
                            Light Street 1
                          </address-item>
                        </div>
                        <div>
                          <ion-button id="count">10 Round</ion-button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <ion-text class="description">
                      Ready to take the biggest 2022 competition event? Join our event and win the best trophies as: one-time pass to “Summer Gym”, personal training with fitness trainer Jenny Cooper and much more interesting!
                    </ion-text>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </template>
  </base-layout>
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
import SummaryItem from "@/general/components/dashboard/SummaryItem.vue";
import CustomChart from "@/general/components/dashboard/CustomChart.vue";
import EventItem from "@/general/components/dashboard/EventItem.vue";
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
const { type: currentSubscriptionType } = useSubscription();

const defaultAddress = process.env.VUE_APP_DEFAULT_POSITION_ADDRESS;

const {
  result,
  refetch,
  loading: loadingUser,
  onResult: gotUser,
} = useQuery<Pick<Query, "user">>(UserDocument, { id });
const progress = ref<string | number>("");

const isTrusted = computed(() =>
  role === RoleEnum.User ? Number(progress.value) >= 100 : true
);

const unreadMessages = ref<number[]>([]);
const facilityStore = useFacilityStore();
const modal = ref<typeof IonModal | null>(null);

onMounted(() => {
  refetch();
  fetchChats();
});

const attendanceDatas = [97, 53, 72, 27, 97, 105, 50, 53, 105, 105];
const attendanceBackgroundColors = ['#F7685B', '#FFB946', '#2F9BFF', '#2ED47A'];
const attendanceChartData = {
  labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
  datasets: [
    {
      label: "",
      backgroundColor: attendanceDatas.map((data) => {
        if(data >= 0 && data < 75) return attendanceBackgroundColors[Math.floor(data / 25)];
        else return attendanceBackgroundColors[3];
      }),
      data: attendanceDatas,
      barThickness: 15,
      borderRadius: 4
    }
  ]
};
const attendanceChartOption = {
  responsive: true,
  scales: {
    y: {
      ticks: {
        callback: (value: number) => `${value}%`, // Display percentage symbol
        stepSize: 25, // Set step size to 25
        max: 100, // Set maximum value to 100
        min: 0, // Set minimum value to 0
      },
      grid: {
        display: true, // Display y-axis grid lines
        drawBorder: false
      }
    },
    x: {
      ticks: {
        angle: 45,
      },
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      xAlign: "center",
      yAlign: "top",
    }
  },
  elements: {
    bar: {
      backgroundColor: (context: any) => {
        const value = context.parsed.y;
        if (value >= 0 && value < 25) {
          return 'red';
        } else if (value >= 25 && value < 50) {
          return 'blue';
        } else if (value >= 50 && value < 75) {
          return 'lightblue';
        } else {
          return 'green';
        }
      },
      borderRadius: 10
    }
  }
};

const marketDatas = [
    [30, 30, 30, 30, 30, 30, 30],
    [58, 58, 58, 58, 58, 58, 58],
    [18, 18, 18, 18, 18, 18, 18],
    [78, 78, 78, 78, 78, 78, 78]];
const backgroundColors = ['#FFB946', '#2ED47A', '#7C4EFF', '#F7685B'];
const marketChartData = {
  labels: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
  datasets: backgroundColors.map((colors, index) => {
    return {
      label: `Dataset ${index + 1}`,
      backgroundColor: colors,
      data: marketDatas[index],
      barThickness: 3,
      borderRadius: 4,
    };
  }),
};
const marketChartOption = {
  responsive: true,
  scales: {
    y: {
      ticks: {
        callback: (value: number) => `${value}%`, // Display percentage symbol
        stepSize: 25, // Set step size to 25
        max: 100, // Set maximum value to 100
        min: 0, // Set minimum value to 0
      },
      grid: {
        display: true, // Display y-axis grid lines
        drawBorder: false
      }
    },
    x: {
      ticks: {
        angle: 45,
      },
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      xAlign: "center",
      yAlign: "top",
    }
  },
  elements: {
    bar: {
      backgroundColor: (context: any) => {
        const value = context.parsed.y;
        if (value >= 0 && value < 25) {
          return 'red';
        } else if (value >= 25 && value < 50) {
          return 'blue';
        } else if (value >= 50 && value < 75) {
          return 'lightblue';
        } else {
          return 'green';
        }
      },
      borderRadius: 10
    }
  }
};

const chartData = {
  labels: [
    'Completed',
    'Upcoming events',
  ],
  datasets: [{
    data: [60, 40],
    backgroundColor: [
      '#E1DBC5',
      '#F7685B',
    ],
    circumference: 180,
    rotation: -90,
    borderJoinStyle: 'rounded',
    cutout: 50,
    borderWidth: 0,
    pointStyle: 'circle'
  }]
};
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
      useBorderRadius: true,
      borderRadius: 100,
      labels: {
        usePointStyle: true,
      },
    },
    title: {
      display: false,
    }
  }
};

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

const onViewChat = () => {
  router.push({ name: EntitiesEnum.ChatList });
};

const facilities = computed(() => {
  switch (role) {
    case RoleEnum.OrganizationOwner: {
      return result.value?.user?.owned_facilities;
    }

    case RoleEnum.Manager:
    case RoleEnum.FacilityOwner:
      return result.value?.user?.owned_facilities;

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

  facilityStore.setFacility(facilities.value[0]);

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
</style>
