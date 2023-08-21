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
        <div class="attendance">
          <div class="d-flex align-items-center justify-content-between">
            <ion-title class="title">Attendance Trend</ion-title>
          </div>
          <div class="block attendance">
            <custom-chart :chartData="chartData" :chartOptions="customChartOptions" :selected="selected" />
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
import SummaryItem from "@/general/components/dashboard/SummaryItem.vue";
import CustomChart from "@/general/components/dashboard/CustomChart.vue";

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

const datas = [97, 53, 72, 27, 97, 105, 50, 53, 105, 105];
const chartData = {
  labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
  datasets: [
    {
      label: "",
      backgroundColor: (ctx: any) => {
        const canvas = ctx.chart.ctx;
        const gradientColors = [
          '#E53030',
          '#FFDE67',
          '#109CF1',
          '#2ED47A',
        ];
        const gradients = datas.map((data) => {

          const gradient = canvas.createLinearGradient(0,0,0,160);
          for(let step = 0; step < data / 25; step ++) {
            gradient.addColorStop(step * (25 / data), gradientColors[step % 4]);
          }
          return gradient;
        });

        return gradients;
      },
      data: datas,
      barThickness: 15,
      borderRadius: 4
    }
  ]
};
const customChartOptions = {
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
.block {
  width: 100%;
  background-color: #262626;
  border-radius: 4px;
  margin-bottom: 1rem;
  padding: 1rem 1rem 1rem 1rem;
}
</style>
