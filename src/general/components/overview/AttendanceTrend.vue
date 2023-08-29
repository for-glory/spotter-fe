<template>
  <div class="attendance">
    <div class="d-flex align-items-center justify-content-between">
      <ion-title class="title">Attendance Trend</ion-title>
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
import { 
  computed, 
  onMounted, 
  ref, 
  watch,
  withDefaults,
  defineProps,
} from "vue";
import useRoles from "@/hooks/useRole";
import useId from "@/hooks/useId";
import { Capacitor } from "@capacitor/core";
import CustomChart from "@/general/components/dashboard/CustomChart.vue";

const router = useRouter();
const route = useRoute();

const props = defineProps<{ overviewData?: any; }>();
const checkinData = computed(() => props.overviewData?.checkin_data);
const attendanceDatas = ref<Array<number>>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

watch(
  () => checkinData.value,
  (newVal: any) => {
    newVal.map((val: any) => {
      attendanceDatas.value[val.month] = val.value;
    });
  }
);

const attendanceBackgroundColors = ['#F7685B', '#FFB946', '#2F9BFF', '#2ED47A'];
const attendanceChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "",
      backgroundColor: attendanceDatas.value?.map((data) => {
        if(data >= 0 && data < 75) return attendanceBackgroundColors[Math.floor(data / 25)];
        else return attendanceBackgroundColors[3];
      }),
      data: attendanceDatas.value,
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
        angle: -45,
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

</script>
<style scoped lang="scss">
.attendance {

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
.title {
  padding: 8px 0px;
  font-size: 1.6rem;
  line-height: 1.3;
  font-weight: 400;
  color: var(--fitnesswhite);
}
.block {
  width: 100%;
  background-color: #262626;
  border-radius: 4px;
  margin-bottom: 1rem;
  padding: 1rem 1rem 1rem 1rem;
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
</style>
