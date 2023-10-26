<!-- eslint-disable vue/no-parsing-error -->
<template>
  <ion-spinner
    v-if="loading || eventsLoading || upcomingeventsLoading"
    name="lines"
    class="spinner"
  />
  <div
    class="overview"
    :class="{ 'tr-overview': role === RoleEnum.Trainer }"
    v-else
  >
    <div class="block">
      <div class="title white-text" style="margin-bottom: 1rem">
        {{ role === RoleEnum.Trainer ? "Overview" : "Fitness Center Overview" }}
      </div>
      <div class="flex-container" v-if="role !== RoleEnum.Trainer">
        <div>
          <div class="time">Today's</div>
          <ion-text class="content">Event counts</ion-text>
          <span class="count">{{ widgetInfo?.event_count }}</span>
        </div>
        <div v-if="role !== RoleEnum.FacilityOwner">
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
          <ion-text class="content">Passes</ion-text>
          <span class="count">{{ widgetInfo?.pass_count }}</span>
        </div>
        <div>
          <div class="time">Total</div>
          <ion-text class="content">Dailys</ion-text>
          <span class="count">{{ widgetInfo?.daily_count }}</span>
        </div>
      </div>
      <div class="flex-container grid-container" v-else>
        <div class="overvview-stack">
          <div class="dropdown">
            <div class="date ion-align-items-end" style="gap: 0.19rem">
              <div class="time">Today’s</div>
              <ion-icon src="assets/icon/arrow-down-light.svg"></ion-icon>
            </div>
            <div class="dropdown-content">
              <div>Today’s</div>
              <div>Yesterday</div>
            </div>
          </div>
          <ion-text class="content">
            Event counts
            <span class="count">{{ 1 }}</span>
          </ion-text>
        </div>
        <div class="overvview-stack">
          <div class="dropdown">
            <div class="date ion-align-items-end" style="gap: 0.19rem">
              <div class="time">Today’s</div>
              <ion-icon src="assets/icon/arrow-down-light.svg"></ion-icon>
            </div>
            <div class="dropdown-content">
              <div>Today’s</div>
              <div>Yesterday</div>
            </div>
          </div>
          <ion-text class="content">
            Message counts
            <span class="count">{{ 1 }}</span>
          </ion-text>
        </div>
        <div>
          <div class="time">Total</div>
          <ion-text class="content">Trainings</ion-text>
          <span class="count">{{ 60 }}</span>
        </div>
        <div>
          <div class="time">Total</div>
          <ion-text class="content">Dailys</ion-text>
          <span class="count">{{ 60 }}</span>
        </div>
      </div>
    </div>
    <div class="block" v-if="role !== RoleEnum.Trainer">
      <div class="title white-text">Revenue</div>
      <ion-grid class="gap">
        <ion-row>
          <ion-col
            size="12"
            size-xl="4"
            v-for="(revenue, index) in revenueSections"
            :key="index"
          >
            <div class="revenue">
              <div class="type">{{ revenue.title }}</div>
              <div class="d-flex align-items-center">
                <div class="">
                  <div
                    class="d-flex justify-content-start align-items-center"
                    style="gap: 0.19rem"
                  >
                    <div class="period">{{ revenue.subtitle }}</div>
                    <div class="" v-if="revenue.dropdown">
                      <ion-icon
                        src="assets/icon/dashboard/arrow-down.svg"
                      ></ion-icon>
                    </div>
                  </div>
                  <div class="d-flex ion-align-items-end" style="gap: 0.75rem">
                    <div class="percent">{{ revenue.percentage }}%</div>
                    <ion-icon
                      v-if="revenue.direction === 'up'"
                      class="arrow"
                      src="assets/icon/positive-result.svg"
                    />
                  </div>
                </div>
                <span class="chain">${{ formatCurrency(revenue.amount, "fixed") }}</span>
              </div>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
    <ion-row>
      <ion-col size="12" size-lg="12" size-xl="7" class="col-gap">
        <div class="chart-block" v-if="role !== RoleEnum.Trainer">
          <div class="flex-container" style="margin-bottom: 25px">
            <div class="title white-text">Attendance Trend</div>
            <div class="dropdown">
              <div class="date ion-align-items-end" style="gap: 0.19rem">
                <div class="">This Year</div>
                <ion-icon src="assets/icon/arrow-down-light.svg"></ion-icon>
              </div>
              <div class="dropdown-content">
                <div @click="handleDay">Last Year</div>
                <div @click="handleWee">This Month</div>
                <div @click="handleMon">Last Month</div>
              </div>
            </div>
          </div>
          <div style="padding-left: 6px; padding-right: 6px">
            <custom-chart
              v-if="widgetInfo?.checkin_data"
              :chartData="chartData"
              :chart-options="attendanceChartOptions"
              :selected="selected"
            />
            <div class="separator"></div>
          </div>
          <ion-row class="attendance-chart-footer">
            <ion-col size="4">
              <div style="width: 100%; display: flex">
                <div class="d-flex-col grade" style="gap: 7px">
                  <div
                    v-for="(grade, index) in attendenceGrades"
                    :key="index"
                    class="d-flex"
                    :style="{ color: grade.color }"
                    style="gap: 0.56rem"
                  >
                    <div class="">{{ grade.start }}-{{ grade.end }}%</div>
                    <div class="">{{ grade.result }}</div>
                  </div>
                </div>
              </div>
            </ion-col>
            <ion-col size="8">
              <div class="description">
                Here’s a visualization chart which depict attendance trends over
                a specified period. Gym owner can identify peak and low
                attendance periods.
                <div class="info-icon">
                  <ion-icon src="assets/icon/dashboard/info.svg"></ion-icon>
                </div>
              </div>
            </ion-col>
          </ion-row>
        </div>
        <!--        market stats chart section-->
        <div class="chart-attendance-block">
          <div class="flex-container" style="margin-bottom: 25px">
            <div class="title white-text chart-title">Market stats</div>
            <div class="dropdown">
              <div class="date ion-align-items-end" style="gap: 0.19rem">
                <div class="chart-dp-title">This Month</div>
                <ion-icon src="assets/icon/arrow-down-light.svg"></ion-icon>
              </div>
              <div class="dropdown-content">
                <div @click="handleDay">Last Month</div>
                <div @click="handleWee">This Year</div>
                <div @click="handleMon">Last Year</div>
              </div>
            </div>
          </div>
          <custom-chart
            :chartData="marketStatsData"
            :chart-options="marketStatsChartOptions"
          />
          <!--     market chart legend     -->
          <div class="" style="margin-top: 24px">
            <div
              class="d-flex ion-justify-content-evenly ion-align-items-end"
              style="margin: auto"
            >
              <div class="market-chart-legend">
                <div
                  v-for="(data, index) in marketStatsData?.datasets"
                  :key="index"
                  class="d-flex justify-content-center ion-align-items-center"
                  style="gap: 8px"
                >
                  <div
                    class="round"
                    :style="{ 'background-color': data.backgroundColor }"
                  ></div>
                  <div class="label">{{ data.label }}</div>
                </div>
              </div>
              <div class="market-chart-legend-summary">
                <span>-0.8%</span>
                <ion-icon src="assets/icon/arrow-square-up.svg"></ion-icon>
              </div>
            </div>
          </div>
        </div>

        <div class="traning-status" v-if="role === RoleEnum.Trainer">
          <div class="flex-container eventItem">
            <div class="title white-text">Trainings Status</div>
            <div class="dropdown">
              <div class="date ion-align-items-end" style="gap: 0.19rem">
                <div class="chart-dp-title">This Month</div>
                <ion-icon src="assets/icon/arrow-down-light.svg"></ion-icon>
              </div>
              <div class="dropdown-content">
                <div @click="handleDay">Last Month</div>
                <div @click="handleWee">This Year</div>
                <div @click="handleMon">Last Year</div>
              </div>
            </div>
          </div>
          <div class="ts-chart-container">
            <doughnut
              :data="traningPieChartData"
              :options="chartOptions"
              :width="null"
              :height="null"
            />
            <span class="pie-chart-title">{{ pichartTitle }}</span>

            <!-- <div style="position: relative; width: 100%; height: 250px">
              <pie-chart
                :chartData="pieChartDataDanger"
                :chart-options="pieChartOptionsDanger"
              />
              <div
                style="
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 250px;
                  z-index: 2;
                "
              >
                <pie-chart
                  style=""
                  :chartData="piechartDataPrimary"
                  :chart-options="pieChartOptionsPrimary"
                />
              </div>
            </div> -->
          </div>
          <div class="header">
            <div
              class="title red-text status-title"
              style="margin-bottom: 12px"
            >
              Upcoming
            </div>
            <div class="d-flex ion-align-items-center" style="gap: 9.34px">
              <div class="view-all" @click="gotoUpcoming('tranings')">
                View All
              </div>
              <ion-icon
                style="width: 12px; height: 12px"
                src="assets/icon/arrow-right-light.svg"
              ></ion-icon>
            </div>
          </div>
          <upcoming-item />
          <upcoming-item :is-last="true" />
        </div>
      </ion-col>
      <ion-col size="12" size-sm="12" size-md="12" size-lg="12" size-xl="5">
        <div class="event-block">
          <div class="flex-container eventItem">
            <div class="title white-text">Event Status</div>
            <div class="dropdown">
              <div class="date ion-align-items-end" style="gap: 0.19rem">
                <div class="chart-dp-title">This Month</div>
                <ion-icon src="assets/icon/arrow-down-light.svg"></ion-icon>
              </div>
              <div class="dropdown-content">
                <div @click="handleDay">Last Month</div>
                <div @click="handleWee">This Year</div>
                <div @click="handleMon">Last Year</div>
              </div>
            </div>
          </div>
          <div class="event-ring">
            <template v-if="role === RoleEnum.Trainer">
              <doughnut
                :data="eventPieChartData"
                :options="chartOptions"
                :width="null"
                :height="null"
              />
              <span class="pie-chart-title completed-chart-title" style="margin-right: 22%;">{{
                pichartTitle
              }}</span>
            </template>
            <div v-else>
              <!-- event chart -->

              <div style="position: relative; width: 100%; height: 250px">
                <pie-chart
                  :chartData="pieChartDataDanger"
                  :chart-options="pieChartOptionsDanger"
                />
                <div
                  style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 250px;
                    z-index: 2;
                  "
                >
                  <pie-chart
                    style=""
                    :chartData="piechartDataPrimary"
                    :chart-options="pieChartOptionsPrimary"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="completed">
            <div class="flex-container">
              <div class="title white-text">Completed</div>
              <div
                class="d-flex ion-align-items-center"
                style="gap: 9.34px"
                v-if="role !== RoleEnum.Trainer"
              >
                <div
                  class="view-all"
                  @click="
                    onHandleClickMenu(EntitiesEnum.DashboardEvent, 'finished')
                  "
                >
                  View All
                </div>
                <ion-icon
                  style="width: 12px; height: 12px"
                  src="assets/icon/arrow-right-light.svg"
                ></ion-icon>
              </div>
            </div>
            <div
              v-if="!events?.length && role !== RoleEnum.Trainer"
              class="no-events"
            >
              <ion-text>No Closed Events</ion-text>
            </div>
            <event-item
              v-for="event in events"
              :key="event.id"
              :title="event.title"
              :dateTime="dayjs(event.end_date).format('dddd D MMMM | HH:mm')"
              status="Closed"
            />
            <template v-if="role === RoleEnum.Trainer">
              <event-item
                :title="'Swimming & Cycling'"
                :dateTime="dayjs(new Date()).format('dddd D MMMM | HH:mm')"
                status="Closed"
              />
              <event-item
                :title="'Swimming & Cycling'"
                :dateTime="dayjs(new Date()).format('dddd D MMMM | HH:mm')"
                status="Closed"
              />
              <event-item
                :title="'Swimming & Cycling'"
                :dateTime="dayjs(new Date()).format('dddd D MMMM | HH:mm')"
                status="Closed"
              />
            </template>
          </div>
          <div class="upcoming">
            <div class="flex-container header">
              <div
                class="title red-text status-title"
                style="margin-bottom: 12px"
              >
                Upcoming
              </div>
              <div class="d-flex ion-align-items-center" style="gap: 9.34px">
                <div
                  class="view-all"
                  @click="
                    role === RoleEnum.Trainer
                      ? gotoUpcoming('events')
                      : onHandleClickMenu(
                          EntitiesEnum.DashboardEvent,
                          'upcoming'
                        )
                  "
                >
                  View All
                </div>
                <ion-icon
                  style="width: 12px; height: 12px"
                  src="assets/icon/arrow-right-light.svg"
                ></ion-icon>
              </div>
            </div>
            <div
              v-if="!upcomingevents?.length && role !== RoleEnum.Trainer"
              class="no-events"
            >
              <ion-text>No Closed Upcoming Events</ion-text>
            </div>
            <upcoming-event-item
              v-for="(event, index) in upcomingevents"
              @click="
                onHandleDetailsPage(EntitiesEnum.EventsDetailed, event.id)
              "
              :key="event.id"
              :title="event.title"
              :street="event?.address?.street"
              :price="event.price"
              :start_date="event.start_date"
              :media="event?.media[0]?.pathUrl"
              status="Upcoming"
              :isLast="index + 1 === upcomingevents?.length"
            />
            <upcoming-event-item
              v-if="role === RoleEnum.Trainer"
              :title="'Run competition'"
              :street="'Light Street, 1'"
              :price="'100'"
              :start_date="'10 July'"
              :media="'/assets/gym.png'"
              status="Upcoming"
            />
          </div>
        </div>
      </ion-col>

      <!-- <ion-col size="12" size-lg="12" size-xl="7" class="col-gap">
       <div class="block row-gap">
         <div class="flex-container">
           <div class="title white-text">pie chart</div>
           <div class="dropdown">
             <div class="date">
               This Month
             </div>
             <div class="dropdown-content">
               <div @click="handleDay">Daily</div>
               <div @click="handleWee">Weekly</div>
               <div @click="handleMon">Monthly</div>
             </div>
           </div>
         </div>
         <pie-chart :chartData="piechartData" :selected="selected" />
       </div>
     </ion-col> -->
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import {
  IonCol,
  IonGrid,
  IonRow,
  IonText,
  IonImg,
  IonIcon,
  IonSpinner,
} from "@ionic/vue";
import EventItem from "@/general/components/dashboard/EventItem.vue";
import UpcomingEventItem from "@/general/components/dashboard/UpcomingEventItem.vue";
import UpcomingItem from "@/general/components/dashboard/UpcomingItem.vue";
import CustomChart from "@/general/components/dashboard/CustomChart.vue";
import PieChart from "@/general/components/dashboard/PieChart.vue";
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
import { getFacilitySubscription } from "@/router/middleware/gymOwnerSubscription";
import _default from "chart.js/dist/plugins/plugin.legend";
import useRoles from "@/hooks/useRole";
import { formatCurrency } from "@/helpers/currency-formater";
import labels = _default.defaults.labels;
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  ArcElement,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Doughnut } from "vue-chartjs";
ChartJS.register(CategoryScale, ArcElement, Title, Tooltip, Legend);

const router = useRouter();
const selected = "February";
const pichartTitle = "60%";
const currentFacility = useFacilityStore();
const { role } = useRoles();

const attendanceChartOptions = {
  responsive: true,
  scales: {
    y: {
      stacked: true,
    },
    x: {
      stacked: true,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

const marketStatsChartOptions: ChartOptions = {
  elements: {
    bar: {
      borderRadius: {
        topLeft: 12,
        topRight: 12,
        bottomLeft: 12,
        bottomRight: 12,
      },
    },
  },
  responsive: true,

  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: "#AFAFAF",
        font(ctx, options) {
          return {
            family: "Lato",
            size: 16,
          };
        },
      },
    },
    x: {
      stacked: false,
      categoryPercentage: 0.4,
      ticks: {
        color: "#AFAFAF",
        font(ctx, options) {
          return {
            family: "Lato",
            size: 14,
          };
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

const marketStatsData = computed<ChartData>(() => {
  const datasets = [0, 20, 40, 60, 80, 100];
  widgetInfo?.value?.checkin_data.map((data: any) => {
    datasets[parseInt(data.month) - 1] = data.value;
  });

  return {
    labels: [
      "05 Mon",
      "06 Tue",
      "07 Wed",
      "08 Thur",
      "09 Fri",
      "10 Sat",
      "11 Sun",
    ],
    datasets: [
      {
        label: "Daily",
        backgroundColor: "#FFB946",
        data: [3, 7, 4, 3, 7, 2, 4],
        barPercentage: 0.6,
        borderRadius: Number.MAX_VALUE,
        borderSkipped: false,
      },
      {
        label: "Gym Pass",
        backgroundColor: "#2ED47A",
        data: [4, 3, 5, 3, 7, 4, 9],
        barPercentage: 0.6,
        borderRadius: Number.MAX_VALUE,
        borderSkipped: false,
      },
      {
        label: "Drop-Ins ",
        backgroundColor: "#F7685B",
        data: [7, 2, 6, 3, 7, 6, 4],
        barPercentage: 0.6,
        borderRadius: Number.MAX_VALUE,
        borderSkipped: false,
      },
      {
        label: "Event Pass",
        backgroundColor: "#FFB946",
        data: [4, 3, 5, 3, 7, 4, 9],
        barPercentage: 0.6,
        borderRadius: Number.MAX_VALUE,
        borderSkipped: false,
      },
    ],
  };
});

const pieChartOptionsDanger = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      align: "center",
      labels: {
        pointStyle: "circle",
        usePointStyle: true,
        padding: 10,
        boxWidth: 5,
        boxHeight: 5,

        generateLabels: (chart: any) => {
          return chart.data.labels.map((label: string, index: number) => {
            let labelObj = {
              text: label,
              datasetIndex: chart.data.datasets[index],
              fontColor: "transparent",
              fillStyle: "transparent",
              strokeStyle: "transparent",
            };
            return labelObj;
          });
        },
      },
    },
  },
};
const pieChartOptionsPrimary = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      displayColors: false,
    },
    legend: {
      position: "right",
      align: "center",
      labels: {
        pointStyle: "circle",
        usePointStyle: true,
        padding: 10,
        boxWidth: 5,
        boxHeight: 5,
        generateLabels: (chart: any) => {
          return chart.data.labels.map((label: string, index: number) => {
            let labelObj = {
              text: label,
              datasetIndex: chart.data.datasets[index],
              fontColor: "#858D9D",
              fillStyle: "#E1DBC5",
              strokeStyle: "transparent",
            };
            if (label === "Upcoming events") {
              labelObj.fontColor = "#F7685B";
              labelObj.fillStyle = "#F7685B";
            }
            return labelObj;
          });
        },
      },
    },
  },
};

const traningPieChartData: ChartData = {
  labels: ["Completed", "Upcoming events"],
  datasets: [
    {
      data: [60, 40],
      backgroundColor: ["#E1DBC5", "#F7685B"],
      circumference: 180,
      rotation: -90,
      borderJoinStyle: "rounded",
      cutout: 75,
      borderWidth: 0,
      borderRadius: 20,
      spacing: -30,
      pointStyle: "circle",
    },
  ],
};
const eventPieChartData = {
  labels: ["Completed", "Upcoming events"],
  datasets: [
    {
      data: [60, 40],
      backgroundColor: ["#E1DBC5", "#F7685B"],
      circumference: 180,
      rotation: -90,
      borderJoinStyle: "rounded",
      cutout: 75,
      borderWidth: 0,
      borderRadius: 20,
      spacing: -30,
      pointStyle: "circle",
    },
  ],
};
const chartOptions: ChartOptions = {
  responsive: false,
  aspectRatio: 2,
  plugins: {
    legend: {
      position: "right",
      labels: {
        usePointStyle: true,
        boxHeight: 6,
        filter(item, data) {
          item.fontColor = item.fillStyle;
          return true;
        },
        font: {
          family: "Lato",
          size: 10,
        },
      },
    },
  },
};

const piechartDataPrimary = computed(() => {
  return {
    labels: ["Completed", "Upcoming events"],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ["#E1DBC5", "transparent"],
        cutout: "85%",
        borderWidth: 0,
        borderRadius: 20,
        circumference: 180,
        rotation: 270,
        spacing: -30,
      },
    ],
  };
});

const pieChartDataDanger = computed<ChartData>(() => {
  return {
    labels: ["Completed", "Upcoming events"],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ["transparent", "#F7685B"],
        cutout: "85%",
        borderWidth: 0,
        borderRadius: 20,
        circumference: 180,
        rotation: 270,
        spacing: -35,
      },
    ],
  };
});

// handle click event
const onHandleDetailsPage = (pathName: string, id: string) => {
  console.log(pathName, id);
  router.push({
    name: pathName,
    params: { id: id },
  });
};

const handleDay = () => {
  console.log("Day");
};
const handleMon = () => {
  console.log("Mon");
};
const handleWee = () => {
  console.log("Wee");
};

const gotoUpcoming = (type: string) => {
  router.push({
    name: EntitiesEnum.Upcoming,
    params: {
      type: type,
    },
  });
};

const {
  result: dashboardWidgetResult,
  loading,
  refetch,
} = useQuery(FacilityDashboardWidgetDocument, {
  id: currentFacility.facility.id,
});
const widgetInfo = computed(
  () => dashboardWidgetResult?.value?.facilityDashboardWidget
);

const revenueSections = computed(() => {
  return [
    {
      title: "Total revenue",
      subtitle: "Today",
      dropdown: true,
      percentage: "0.8",
      direction: "up",
      amount: widgetInfo?.value?.today_earn || 0,
    },
    {
      title: "Quarterly revenue",
      subtitle: "Earned",
      dropdown: false,
      percentage: "70",
      direction: null,
      amount: widgetInfo?.value?.earn_last_thirty_days || 0,
    },
    //   year_earn
    {
      title: "Earned revenue",
      subtitle: "This year",
      dropdown: false,
      percentage: "0.8",
      direction: null,
      amount: widgetInfo?.value?.year_earn || 0,
    },
  ];
});

const attendenceGrades = [
  {
    start: "0",
    end: "25",
    result: "Poor",
    color: "var(--Red, #F7685B)",
  },
  {
    start: "25",
    end: "50",
    result: "Fair",
    color: "var(--Yellow, #FFB946)",
  },
  {
    start: "50",
    end: "75",
    result: "Good",
    color: "#2F9BFF",
  },
  {
    start: "75",
    end: "100",
    result: "Excellent",
    color: "var(--Green, #2ED47A)",
  },
];

// const getGradient = (ctx:any, chartArea:any, start_color:any, stop_color:any) => {
//   let width, height, gradient;
//   const chartWidth = chartArea.right - chartArea.left;
//   const chartHeight = chartArea.bottom - chartArea.top;
//   if (gradient === null || width !== chartWidth || height !== chartHeight) {
//     // Create the gradient because this is either the first render
//     // or the size of the chart has changed
//     width = chartWidth;
//     height = chartHeight;
//     gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
//     gradient.addColorStop(0, stop_color);
//     gradient.addColorStop(0.5, start_color);
//   }
//   return gradient;
// }

const chartData = computed(() => {
  const datasets = [0, 25, 50, 75, 100];

  widgetInfo?.value?.checkin_data?.map((data: any) => {
    datasets[parseInt(data.month) - 1] = data.value;
  });
  return {
    labels: [
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
    ],
    datasets: [
      {
        label: "Poor",
        backgroundColor: function (context: any) {
          // const chart = context.chart;
          // const {
          //   ctx,
          //   chartArea
          // } = chart;
          // if (!chartArea) {
          //   return null;
          // }
          return "#F7685B";
        },
        data: datasets,
        barThickness: 30,
        borderRadius: 10,
        stack: "stack 1",
      },
      {
        label: "Fair",
        backgroundColor: "#FFB946",
        data: datasets,
        barThickness: 30,
        borderRadius: 10,
        stack: "stack 1",
      },
      {
        label: "Good",
        backgroundColor: "#2F9BFF",
        data: datasets,
        barThickness: 30,
        borderRadius: 10,
      },
      {
        label: "Excellent",
        backgroundColor: "#2ED47A",
        data: datasets,
        barThickness: 30,
        borderRadius: 10,
        stack: "stack 1",
      },
    ],
  };
});

const idFilter = computed(() => {
  return { created_by_facility: currentFacility.facility?.id };
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
    from: dayjs().add(-1, "y").format("YYYY-MM-DD HH:mm:ss"),
    to: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  },
  ...idFilter.value,
};
const {
  result: eventRes,
  loading: eventsLoading,
  refetch: eventsRefetch,
} = useQuery<EventsQuery>(EventsDocument, eventsParams, {
  fetchPolicy: "no-cache",
});

const events = computed(() => {
  return eventRes.value?.events?.data;
});

const upcomingeventsParams: EventsQueryVariables = {
  first: 4,
  page: 1,
  orderBy: [
    {
      column: QueryEventsOrderByColumn.StartDate,
      order: SortOrder.Asc,
    },
  ],
  start_date: {
    from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    to: dayjs().add(+1, "months").format("YYYY-MM-DD HH:mm:ss"),
  },
  ...idFilter.value,
};
const {
  result: upcomingeventRes,
  loading: upcomingeventsLoading,
  refetch: upcomingeventsRefetch,
} = useQuery<EventsQuery>(EventsDocument, upcomingeventsParams, {
  fetchPolicy: "no-cache",
});

const upcomingevents = computed(() => {
  return upcomingeventRes.value?.events?.data;
});

// handle click event
const onHandleClickMenu = (pathName: string, status: string) => {
  console.log(pathName, status);
  router.push({
    name: pathName,
    query: { status: status },
  });
};

watch(
  () => currentFacility.facility.id,
  async () => {
    if (localStorage.getItem("selectedGym")) {
      await getFacilitySubscription()
        .then((data) => {
          if (!data) {
            return router.push({ name: EntitiesEnum.DashboardMembership });
          } else {
            refetch({
              id: currentFacility.facility.id,
            });
            eventsRefetch({
              ...eventsParams,
              ...idFilter.value,
            });
            upcomingeventsRefetch({
              ...upcomingeventsParams,
              ...idFilter.value,
            });
          }
        })
        .catch(() => {
          return router.push({ name: EntitiesEnum.DashboardStartMembership });
        });
    }
  }
);
</script>

<style scoped lang="scss">
.market-chart-legend {
  padding-left: 14px;
  padding-right: 14px;
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 32px;
  .round {
    width: 8px;
    height: 8px;
    border-radius: 50% 50%;
  }
  .label {
    color: var(--60, rgba(255, 255, 255, 0.6)) !important;
    font-family: Manrope !important;
    font-size: 0.75rem !important;
    font-style: normal !important;
    font-weight: 400 !important;
    line-height: normal !important;
    margin-bottom: 0px !important;
  }
}

.market-chart-legend-summary {
  color: var(--Red, #f7685b);
  text-align: center;
  font-family: Inter;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.38rem;
}
.upcoming {
  margin-top: 19px;
  margin: 19px 23px;

  .header {
    padding: 0 22px;
  }
}
.event-block {
  padding: 19px 8.37px 30px 16px;
  width: 100%;
  background-color: var(--gray-700);
  border-radius: 8px;
  min-height: calc(100% - 15px);
  .date {
    padding: 0px !important;
  }
}
.description {
  width: 100%;
  height: 100%;
  opacity: 0.8;
  background: linear-gradient(
      0deg,
      rgba(11, 11, 11, 0.1) 0%,
      rgba(11, 11, 11, 0.1) 100%
    ),
    #2d2d2d;
  position: relative;
  color: #c4c4c4;
  font-family: Yantramanav;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 300;
  padding: 0.81rem 0.44rem 0.75rem 0.5rem;
  position: relative;
}

.chart-block {
  width: 100%;
  background-color: var(--gray-700);
  border-radius: 10px;
  margin-bottom: 1rem;
  padding: 7px 25px 11px 16px;
}
.chart-attendance-block {
  width: 100%;
  background-color: var(--gray-700);
  border-radius: 10px;
  margin-bottom: 1rem;
  padding: 17px 20px 22px;
}
.info-icon {
  position: absolute;
  right: 14px;
  bottom: 7px;
}
.attendance-chart-footer {
  padding-left: 8%;
}
.grade {
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.separator {
  width: 91%;
  height: 0.5rem;
  border-radius: 2.125rem;
  background: rgba(32, 32, 32, 0.7);
  margin: 0.5rem auto 1rem;
}
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
.completed {
  margin: 0 39px;
}
.event-ring {
  position: relative;
  margin: 5px 9px 10px 49px;
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
}
.chain {
  font-size: 1.4375rem;
  color: white;
  margin-left: 14%;
  font-weight: 600;
  margin-bottom: 18px;
}
.title {
  padding: 0;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 500;
  font-family: Inter;
}
.dashboard-btn {
  margin-top: 10px;
}
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
  width: 1.2rem;
  height: 1.2rem;
  margin-bottom: 4px;
}
.date {
  border-radius: 10px;
  padding: 0.6rem;
  display: flex;
  cursor: pointer;
  color: var(--beige, #e1dbc5);
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
  z-index: 999;
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
  // .flex-container {
  //   display: flex;
  //   flex-wrap: wrap;
  //   margin-top: 1rem;
  //   justify-content: left;
  // }
}
.chart-container {
  position: relative !important;
}

ion-col.col-gap.test {
  margin-top: -46%;
}

.red-text {
  color: #f7685b !important;
}

.view-all {
  font-size: 14px;
}

.tr-overview {
  padding: 40px 108px 40px 55px;
  overflow: auto;
  height: 100%;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  .traning-status {
    width: 100%;
    background-color: var(--gray-700);
    border-radius: 10px;
    margin-bottom: 1rem;
    padding: 17px 20px 22px;

    .header {
      display: flex;
      justify-content: space-between;
    }
  }

  .ts-chart-container {
    position: relative;
    height: fit-content;
    padding: 25px 20px 25px 40px;
  }
  .title {
    color: var(--fitnesswhite);
  }

  .block {
    padding: 20px 22px 20px 16px;
  }

  .time {
    font-family: "Inter";
    padding-right: 8px;
  }

  .chart-title {
    font-family: "Lato";
    letter-spacing: 0.2px;
  }

  .status-title {
    font-family: "Manrope";
    font-size: 20px;
    font-weight: 700;
  }
  .chart-dp-title {
    font-family: "Lato";
    font-size: 14px;
  }

  .pie-chart-title {
    position: absolute;
    bottom: 40px;
    left: 109px;
    font-family: Inter;
    color: var(--gold);
    font-size: 26px;
    font-weight: 600;
  }



  .completed-chart-title {
    bottom: 20px;
    left: 70px;
  }

  .dropdown {
    .date {
      padding: 0;
    }
  }
  .content {
    font-family: "Inter";
    font-weight: 500;
  }
  .overvview-stack {
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 1400px) {
    .event-ring {
      margin-left: 35px;
      canvas {
        scale: 0.9;
      }
    }
  }
  @media (max-width: 1350px) {
    .completed-chart-title {
      left: 76px;
    }
  }
  @media (max-width: 1300px) {
    .event-ring {
      margin-left: 10px;

      canvas {
        scale: 0.8;
      }
    }
    .completed-chart-title {
      bottom: 23px;
      left: 82px;
    }
  }

  @media only screen and (max-width: 1400px) and (min-width: 1200px) {
    .completed {
      margin: 0 10px;
    }
    .upcoming {
      margin: 0;
    }
  }

  @media (max-width: 1200px) {
    .col-gap {
      padding: 0;
    }
    .completed {
      margin: 20px 20px 0 20px;
    }
    .upcoming {
      margin: 19px 14px;
    }
    .event-ring {
      margin: 0;
      padding-left: 25px;
      canvas {
        scale: initial;
      }
    }
    .completed-chart-title {
      font-size: 27px;
      bottom: 20px;
      left: 98px;
    }
  }
  @media (max-width: 1100px) {
    .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 850px) {
    .completed-chart-title {
      font-size: 22px;
    }
  }

  @media (max-width: 320px) {
    .ts-chart-container {
      canvas {
        scale: 0.9;
      }
    }
  }
}
</style>
