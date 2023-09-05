<template>
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
import { useUserStore } from "@/general/stores/user";

const router = useRouter();
const route = useRoute();
ChartJS.register(CategoryScale, ArcElement, Title, Tooltip, Legend);

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

</script>
<style scoped lang="scss">
.perform {
  margin: 0 1.5rem;
}
.doughnut {
  margin-top: -80px;
  margin-bottom: -50px;
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
