<template>
  <div class="overview">
    <div class="block">
      <div class="title white-text">Fitness Center Overview</div>
      <div class="flex-container">
        <div>
          <div class="time">Today's</div>
          <ion-text class="content">Event counts</ion-text>
          <span class="count">{{ widgetInfo?.event_count }}</span>
        </div>
        <div>
          <div class="time">Today's</div>
          <ion-text class="content">Message counts</ion-text>
          <span class="count">{{ widgetInfo?.message_count }}</span>
        </div>
        <div>
          <div class="time">Total</div>
          <ion-text class="content">Active</ion-text>
          <span class="count">{{ widgetInfo?.event_count }}</span>
        </div>
        <div>
          <div class="time">Total</div>
          <ion-text class="content">New Sign-ups</ion-text>
          <span class="count">{{ widgetInfo?.event_count }}</span>
        </div>
        <div>
          <div class="time">Total</div>
          <ion-text class="content">Expiring memberships</ion-text>
          <span class="count">{{ widgetInfo?.expiring_membership_count }}</span>
        </div>
      </div>
    </div>
    <div class="block">
      <div class="title white-text">Revenue</div>
      <ion-grid class="gap">
        <ion-row>
          <ion-col size="12" size-xl="4">
            <div class="revenue">
              <div class="type">Total revenue</div>
              <div class="period">Today</div>
              <div class="percent">
                0.8%
                <ion-icon class="arrow" src="assets/icon/call_made.svg" />
              </div>
              <div class="chain">${{ widgetInfo?.today_earn }}</div>
            </div>
          </ion-col>
          <ion-col size="12" size-xl="4">
            <div class="revenue flex-container">
              <div>
                <div class="type">Quarterly revenue</div>
                <div class="period">Earned</div>
                <div class="percent">70%</div>
                <div class="chain">${{ widgetInfo?.earn_last_thirty_days }}
                  <!-- <span class="period">/ day</span> -->
                </div>
              </div>
              <ion-icon class="vector" src="assets/icon/chat/Vector.svg" />
            </div>
          </ion-col>
          <ion-col size="12" size-xl="4">
            <div class="revenue">
              <div class="type">Earned revenue</div>
              <div class="period">This year</div>
              <div class="percent">
                0.8%
                <ion-icon class="arrow" src="assets/icon/call_made.svg" />
              </div>
              <div class="chain">${{ widgetInfo?.year_earn }}</div>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
    <ion-row>
      <ion-col size="12" size-lg="12" size-xl="7" class="col-gap">
        <!-- <div class="block">
          <ion-row>
            <ion-col size="12" size-sm="12" size-md="5">
              <div class="title white-text match">Equipment Status</div>
              <div>
                <div class="flex-container">
                  <ion-text class="status">Repairs</ion-text>
                  <ion-text class="status">30</ion-text>
                </div>
                <div class="flex-container">
                  <ion-text class="status">Damaged</ion-text>
                  <ion-text class="status">100</ion-text>
                </div>
                <div class="flex-container">
                  <ion-text class="status">Pending maintenance</ion-text>
                  <ion-text class="status">60</ion-text>
                </div>
              </div>
            </ion-col>
            <ion-col size="12" size-sm="12" size-md="2"></ion-col>
            <ion-col size="12" size-sm="12" size-md="5" class="status-above">
              <div>
                <div class="flex-container">
                  <ion-text class="status">Total equipments</ion-text>
                  <ion-text class="status">500</ion-text>
                </div>
                <div class="flex-container">
                  <ion-text class="status">Available equipments</ion-text>
                  <ion-text class="status">350</ion-text>
                </div>
              </div>
              <div class="space">
                <div class="flex-container">
                  <ion-text class="status">Inspected</ion-text>
                  <ion-text class="status">30</ion-text>
                </div>
                <div class="flex-container">
                  <ion-text class="status">Dirty</ion-text>
                  <ion-text class="status">19</ion-text>
                </div>
                <div class="flex-container">
                  <ion-text class="status">Inspected</ion-text>
                  <ion-text class="status">30</ion-text>
                </div>
              </div>
            </ion-col>
          </ion-row>
        </div> -->
        <div class="block row-gap">
          <div class="flex-container">
            <div class="title white-text">Attendance Trend</div>
            <div class="dropdown">
              <div class="date">
                <ion-img class="calendar" src="assets/icon/calendar.png" />
                Monthly
              </div>
              <div class="dropdown-content">
                <div @click="handleDay">Daily</div>
                <div @click="handleWee">Weekly</div>
                <div @click="handleMon">Monthly</div>
              </div>
            </div>
          </div>
          <custom-chart :chartData="chartData" :selected="selected" />
        </div>
      </ion-col>
      <ion-col size="12" size-sm="12" size-md="12" size-lg="12" size-xl="5">
        <div class="block">
          <div class="flex-container eventItem">
            <div class="title white-text">Event Status</div>
            <div class="dropdown">
              <div class="date">
                <ion-img class="calendar" src="assets/icon/calendar.png" />
                Monthly
              </div>
              <div class="dropdown-content">
                <div @click="handleDay">Daily</div>
                <div @click="handleWee">Weekly</div>
                <div @click="handleMon">Monthly</div>
              </div>
            </div>
          </div>
          <div class="event-ring">
            <div>
              <ion-img
                class="ring"
                src="assets/icon/chat/Ring.svg"
                alt="ring"
              />
            </div>
          </div>
          <div class="perform">
            <div class="flex-container">
              <div class="title white-text">Completed</div>
              <div class="view">View All</div>
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
          </div>
        </div>
      </ion-col>
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import { IonCol, IonGrid, IonRow, IonText, IonImg, IonIcon } from "@ionic/vue";
import EventItem from "@/general/components/dashboard/EventItem.vue";
import CustomChart from "@/general/components/dashboard/CustomChart.vue";
import { computed, onMounted, ref } from "vue";
import {
  FacilityDashboardWidgetDocument,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import { useFacilityStore } from "@/general/stores/useFacilityStore";

const chartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: 'Data One',
      backgroundColor: '#2ED47A',
      data: [1.33, 2.33, 2.5, 2.33, 4, 4.66],
      barThickness: 8,
      borderRadius: 10
    }
  ]
};
const selected = "February";
const currentFacility = useFacilityStore();

const handleDay = () => {
  console.log("Day");
};
const handleMon = () => {
  console.log("Mon");
};
const handleWee = () => {
  console.log("Wee");
};

const { result: dashboardWidgetResult } = useQuery(
  FacilityDashboardWidgetDocument,
  {
    id: currentFacility.facility.id,
  }
);
console.log(dashboardWidgetResult)
const widgetInfo = computed(() => dashboardWidgetResult?.value?.facilityDashboardWidget);
</script>

<style scoped lang="scss">
.eventItem {
  margin-top: -0 !important;
}
.flex-wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.perform {
  margin: 0 1.5rem;
}
.event-ring {
  margin-left: 2rem;
  margin-top: 1rem;
}
.ring {
  width: 12rem;
  margin-bottom: -60px;
}
.calendar {
  width: 1.2rem;
  height: 1.2rem;
  background-color: white;
  margin-right: 0.5rem;
}

.flex-row {
  display: flex;
  flex-direction: column;
}

.vector {
  position: absolute;
  height: 50%;
  width: 140%;
  top: 60px;
}
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
.title {
  padding: 0;
  font-size: 1.6rem;
  line-height: 1.3;
  font-weight: 400;
}
.dashboard-btn {
  margin-top: 10px;
}
// .overview {
//   margin-top: 2rem;
//   margin-left: 3rem;
//   margin-right: 6rem;
//   margin-bottom: 1rem;
// }
.block {
  width: 100%;
  background-color: var(--gray-700);
  border-radius: 10px;
  margin-bottom: 1rem;
  padding: 1rem 1rem 1rem 1rem;
}
.flex-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 1rem;
  grid-gap: 1rem;
  align-items: center;
}
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
.revenue {
  margin: 0.3rem 0.3rem;
  padding: 1rem 0 1rem 1rem;
  border: 1px solid white;
  border-radius: 10px;
}
.arrow {
  padding-left: 0.6rem;
}
.date {
  border: 1px solid grey;
  border-radius: 10px;
  padding: 0.6rem;
  display: flex;
  cursor: pointer;
}
.dropdown {
  position: relative;
  display: inline-block;
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 100px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
.dropdown-content div {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}
.dropdown-content a:hover {
  background-color: #f1f1f1;
}
.dropdown:hover .dropdown-content {
  display: block;
}
.space {
  margin-top: 2rem;
}
.status {
  color: grey;
}
.status-above {
  color: grey;
  margin-top: -1.5rem;
}
.match {
  margin-bottom: 3rem;
  margin-left: -0.3rem;
}
.gap {
  margin: 0 1.5rem;
}
.col-gap {
  padding-right: 1rem;
}
.row-gap {
  padding-top: 0.6rem;
}
.view {
  padding-right: 2.5rem;
  color: var(--gold);
}
@media (max-width: 1220px) {
  .flex-container {
    display: flex;
    flex-wrap: wrap;
    margin-top: 1rem;
    justify-content: left;
  }
}
.chart-container {
  position: relative !important;
}
</style>
