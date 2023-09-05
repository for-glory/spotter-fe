<template>
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
import { computed, onMounted, ref, watch } from "vue";
import useRoles from "@/hooks/useRole";
import useId from "@/hooks/useId";
import { Capacitor } from "@capacitor/core";
import SummaryItem from "@/general/components/dashboard/SummaryItem.vue";
import CustomChart from "@/general/components/dashboard/CustomChart.vue";
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

const router = useRouter();
const route = useRoute();

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
.market-description {
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
.stats {
  font: 600 20px/1 Lato;
  color: #F7685B;
}
</style>
