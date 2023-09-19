<template>
  <div>
    <div class="d-flex align-items-center justify-content-between">
      <div class="title">{{ title }}</div>
      <BaseSelect :id="'trigger-' + title.split(' ')[0].toLocaleLowerCase()" :options="TrainerSelectOptions" defualtCheck="This Month" />
      <!-- <div class="view-option"> -->
        <!-- <ion-text id="trigger-button">This Month</ion-text>
        <ion-img src="assets/icon/arrow-down-light.svg"></ion-img> -->
      <!-- </div> -->
    </div>
    <div class="block" @click="goToUpcoming">
      <div v-if="role === RoleEnum.Trainer" class="chart-title">{{ chartTitle }}</div>
      <div class="perform">
        <doughnut 
          :data="chartData"
          :options="chartOptions"
          :width="null"
          :height="null"
        />

        <template v-if="role !== RoleEnum.Trainer">
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
      </template>

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
import { IonImg } from "@ionic/vue";
import { RoleEnum } from "@/generated/graphql";
import useRoles from "@/hooks/useRole";
import EventItem from "@/general/components/dashboard/EventItem.vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  ArcElement,
  ChartOptions
} from 'chart.js';
import { Doughnut } from 'vue-chartjs';
import BaseSelect from "../base/BaseSelect.vue";
import { TrainerSelectOptions } from '@/const/TrainerSelectOption'
import router from "@/router";
import { EntitiesEnum } from "@/const/entities";

const props = withDefaults( defineProps<{
  title?:string
}>(), {
  title: "Event Status"
})
const { role }= useRoles()
const chartTitle = "60%";
const screenWidth = window.innerWidth;
ChartJS.register(CategoryScale, ArcElement, Title, Tooltip, Legend);

const goToUpcoming = () => {
  if(role !== RoleEnum.Trainer) return;
  const tab = props.title.split(' ')[0] === "Event" ? EntitiesEnum.Events : EntitiesEnum.Trainings;
  localStorage.setItem("trainer_schedule_active_tab", tab);
  router.push({
    name: EntitiesEnum.TrainersUpcomingTrainings,
    state: {
      fromOverview: true
    }
  })
}

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
    cutout: screenWidth > 320 ? 72 : 62,
    borderWidth: 0,
    borderRadius: 20,
    spacing: -30,
    pointStyle: 'circle'
  }]
};
const chartOptions:ChartOptions = {
  responsive: true,
  aspectRatio: 2,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        usePointStyle: true,
        boxHeight: 6,
        filter(item, data) {
            item.fontColor = item.fillStyle;
            return true;
        },
        font :{
          family :"Lato",
          size: 10,
        }
      },
    },
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
  padding: 1rem 1rem 2rem 1rem;
  position: relative;
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

.chart-title {
  position: absolute;
  bottom: 19%;
  left: 26%;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;

  @media (max-width: 320px) {
    bottom: 18%;
    left: 22%;
    font-size: 22px;
  } 
}
</style>