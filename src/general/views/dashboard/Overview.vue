<template>
  <ion-spinner
    v-if="loading || eventsLoading"
    name="lines"
    class="spinner"
  />
  <div class="overview" v-else>
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
          <ion-text class="content">Drop-ins</ion-text>
          <span class="count">{{ widgetInfo?.dropin_count }}</span>
        </div>
        <div>
          <div class="time">Total</div>
          <ion-text class="content">Gym pass</ion-text>
          <span class="count">{{ widgetInfo?.pass_count }}</span>
        </div>
        <div>
          <div class="time">Total</div>
          <ion-text class="content">Dailys</ion-text>
          <span class="count">{{ widgetInfo?.daily_count }}</span>
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
        <div class="block row-gap">
          <div class="flex-container">
            <div class="title white-text">Attendance Trend</div>
            <div class="dropdown">
              <div class="date">
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
              <!-- event chart -->
            </div>
          </div>
          <div class="perform">
            <div class="flex-container">
              <div class="title white-text">Completed</div>
              <div class="view">View All</div>
            </div>
            <div v-if="!events?.length" class="no-events">
              <ion-text>No Closed Events</ion-text>
            </div>
            <event-item
              v-for="event in events"
              :key="event.id"
              :title="event.title"
              :dateTime="dayjs(event.end_date).format('dddd D MMMM | HH:mm')"
              status="Closed"
            />
          </div>
        </div>
      </ion-col>
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import { IonCol, IonGrid, IonRow, IonText, IonImg, IonIcon, IonSpinner } from "@ionic/vue";
import EventItem from "@/general/components/dashboard/EventItem.vue";
import CustomChart from "@/general/components/dashboard/CustomChart.vue";
import { computed, watch, ref } from "vue";
import {
  EventsDocument,
  EventsQueryVariables,
  QueryEventsOrderByColumn,
  RoleEnum,
  EventsQuery,
  SortOrder,
  FacilityDashboardWidgetDocument,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import dayjs from "dayjs";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { getFacilitySubscription } from "@/router/middleware/gymOwner";

const router = useRouter();
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

const { result: dashboardWidgetResult, loading, refetch } = useQuery(
  FacilityDashboardWidgetDocument,
  {
    id: currentFacility.facility.id,
  }
);
console.log(dashboardWidgetResult)
const widgetInfo = computed(() => dashboardWidgetResult?.value?.facilityDashboardWidget);

const chartData = computed(() => {
  const datasets = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
  widgetInfo?.value?.checkin_data.map(data => {
    datasets[parseInt(data.month) - 1] = data.value
  })
  return {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: 'Data One',
        backgroundColor: '#2ED47A',
        data: datasets,
        barThickness: 8,
        borderRadius: 10
      }
    ]
  }
});

const idFilter = computed(() => {
  return { created_by_facility: currentFacility.facility?.id }
});

const eventsParams: EventsQueryVariables = {
  first: 4,
  page: 1,
  orderBy: [
    {
      column: QueryEventsOrderByColumn.StartDate,
      order: SortOrder.Asc,
    },
  ],
  end_date: {
    from: dayjs().add(-1, 'y').format("YYYY-MM-DD HH:mm:ss"),
    to: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  },
  ...idFilter.value,
};
const {
  result: eventRes,
  loading: eventsLoading,
  refetch: eventsRefetch
} = useQuery<EventsQuery>(EventsDocument, eventsParams, {
  fetchPolicy: "no-cache",
});

const events = computed(() => {
  return eventRes.value?.events?.data;
});

watch(
  () => currentFacility.facility.id,
  async () => {
    if (localStorage.getItem("selectedGym")) {
      await getFacilitySubscription()
        .then((data) => {
          if(!data) {
            return router.push({ name: EntitiesEnum.DashboardStartMembership });
          }
          else{
            refetch({
              id: currentFacility.facility.id,
            })
            eventsRefetch({
              ...eventsParams,
              ...idFilter.value
            })
          }
        })
        .catch(() => {
          return router.push({ name: EntitiesEnum.DashboardStartMembership });
        });
    }
  }
)
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
.no-events {
  padding: 30px 12px;
  text-align: center;
}
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
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
