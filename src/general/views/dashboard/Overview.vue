<!-- eslint-disable vue/no-parsing-error -->
<template>
  <ion-spinner
      v-if="loading || eventsLoading || upcomingeventsLoading"
      name="lines"
      class="spinner"
  />
  <div class="overview" v-else>
    <div class="block">
      <div class="title white-text" style="margin-bottom: 1rem">Fitness Center Overview</div>
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
          <ion-text class="content">Passes</ion-text>
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
          <ion-col size="12" size-xl="4" v-for="(revenue, index) in revenueSections" :key="index">
            <div class="revenue">
              <div class="type">{{revenue.title}}</div>
              <div class="d-flex align-items-center">
                <div class="">
                  <div class="d-flex justify-content-start align-items-center" style="gap: 0.19rem">
                    <div class="period">{{revenue.subtitle}}</div>
                    <div class="" v-if="revenue.dropdown">
                      <ion-icon src="assets/icon/dashboard/arrow-down.svg"></ion-icon>
                    </div>
                  </div>
                  <div class="d-flex ion-align-items-end" style="gap: 0.75rem">
                    <div class="percent">
                      {{revenue.percentage}}%
                    </div>
                    <ion-icon v-if="revenue.direction === 'up'" class="arrow" src="assets/icon/positive-result.svg" />
                  </div>

                </div>
                <span class="chain">${{ revenue.amount }}</span>
              </div>
            </div>
          </ion-col>

        </ion-row>
      </ion-grid>
    </div>
    <ion-row>
      <ion-col size="12" size-lg="12" size-xl="7" class="col-gap">
        <div class="chart-block ">
          <div class="flex-container" style="margin-bottom: 25px;">
            <div class="title white-text">Attendance Trend</div>
            <div class="dropdown">
              <div class="date ion-align-items-end" style="gap: 0.19rem">
                <div class="">
                  This Year
                </div>
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
                :selected="selected" />
            <div class="separator"></div>
          </div>
          <ion-row class="attendance-chart-footer">
            <ion-col size="4">
              <div style="width: 100%; display: flex;">
                <div class="d-flex-col grade" style="gap: 7px">
                  <div
                      v-for="(grade, index) in attendenceGrades"
                      :key="index"
                      class="d-flex" :style="{color: grade.color}"
                      style="gap: 0.56rem">
                    <div class="">{{grade.start}}-{{grade.end}}%</div>
                    <div class="">{{grade.result}}</div>
                  </div>
                </div>
              </div>
            </ion-col>
            <ion-col size="8">
              <div class="description">
                Here’s a visualization chart which depict attendance trends over a specified period. Gym owner can identify peak and low attendance periods.
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
            <div class="title white-text">Market stats</div>
            <div class="dropdown">
              <div class="date ion-align-items-end" style="gap: 0.19rem">
                <div class="">
                  This Month
                </div>
                <ion-icon src="assets/icon/arrow-down-light.svg"></ion-icon>
              </div>
              <div class="dropdown-content">
                <div @click="handleDay">Last Month</div>
                <div @click="handleWee">This Year</div>
                <div @click="handleMon">Last Year</div>
              </div>
            </div>
          </div>
          <custom-chart :chartData="marketStatsData" :chart-options="marketStatsChartOptions" />
          <!--     market chart legend     -->
          <div class="" style="margin-top: 24px;">
            <div class="d-flex ion-justify-content-center ion-align-items-end" style=" margin: auto">
              <div class="market-chart-legend">
                <div
                    v-for="(data, index) in marketStatsData?.datasets"
                    :key="index"
                    class="d-flex justify-content-center ion-align-items-center" style="gap: 8px">
                  <div class="round" :style="{'background-color': data.backgroundColor}"></div>
                  <div class="label">{{data.label}}</div>
                </div>
              </div>
              <div class="market-chart-legend-summary">
                <span>-0.8%</span>
                <ion-icon src="assets/icon/arrow-square-up.svg"></ion-icon>
              </div>
            </div>
          </div>
        </div>
      </ion-col>
      <ion-col size="12" size-sm="12" size-md="12" size-lg="12" size-xl="5">
        <div class="event-block">
          <div class="flex-container eventItem">
            <div class="title white-text">Event Status</div>
            <div class="dropdown">
              <div class="date ion-align-items-end" style="gap: 0.19rem">
                <div class="">
                  This Month
                </div>
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
            <div>
              <!-- event chart -->
              <div style="position: relative; width: 100%; height: 250px;">
                <pie-chart :chartData="pieChartDataDanger" :chart-options="pieChartOptionsDanger" />
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 250px; z-index: 2">
                  <pie-chart style="" :chartData="piechartDataPrimary" :chart-options="pieChartOptionsPrimary" />
                </div>

              </div>

            </div>
          </div>
          <div class="completed">
            <div class="flex-container">
              <div class="title white-text">Completed</div>
              <div class="d-flex ion-align-items-center" style="gap: 9.34px">
                <div class="" @click="onHandleClickMenu(EntitiesEnum.DashboardEvent, 'finished')">View All</div>
                <ion-icon style="width: 12px; height: 12px;" src="assets/icon/arrow-right-light.svg"></ion-icon>
              </div>
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
               <div class="upcoming">
            <div class="flex-container">
              <div class="title red-text" style=" margin-bottom: 12px">Upcoming</div>
              <div class="d-flex ion-align-items-center" style="gap: 9.34px">
                <div class="" @click="onHandleClickMenu(EntitiesEnum.DashboardEvent, 'upcoming')">View All</div>
                <ion-icon style="width: 12px; height: 12px;" src="assets/icon/arrow-right-light.svg"></ion-icon>
              </div>
            </div>
             <div v-if="!upcomingevents?.length" class="no-events">
              <ion-text>No Closed Upcoming Events</ion-text>
            </div>
             <upcoming-event-item
              v-for="(event, index) in upcomingevents"
              @click="onHandleDetailsPage(EntitiesEnum.EventsDetailed, event.id)"
              :key="event.id"
              :title="event.title"
              :street="event?.address?.street"
              :price ="event.price"
              :start_date = "event.start_date"
              :media = "event?.media[0]?.pathUrl"
              status="Upcoming"
              :isLast="(index+1) === upcomingevents?.length"
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
import { IonCol, IonGrid, IonRow, IonText, IonImg, IonIcon, IonSpinner } from "@ionic/vue";
import EventItem from "@/general/components/dashboard/EventItem.vue";
import UpcomingEventItem from "@/general/components/dashboard/UpcomingEventItem.vue";
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
import labels = _default.defaults.labels;

const router = useRouter();
const selected = "February";
const currentFacility = useFacilityStore();

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
      display: false
    },
  },
}

const marketStatsChartOptions = {
  elements: {
    bar: {
      borderRadius: {
        topLeft: 12,
        topRight: 12,
        bottomLeft: 12, 
        bottomRight: 12
    }
   },
  },
  responsive: true,
  scales: {
    y: {
      beginAtZero: true, 
    },
    x: {
      stacked: false,
      categoryPercentage: 0.4,
    },
  },
  plugins: {
    legend: {
      display: false
    },
  },
}

const marketStatsData = computed(() => {
  const datasets = [ 0, 20, 40, 60, 80, 100 ]; 
  widgetInfo?.value?.checkin_data.map((data:any) => {
    datasets[parseInt(data.month) - 1] = data.value
  })
  return {
    labels: ["05 Mon", "06 Tue", "07 Wed", "08 Thur", "09 Fri", "10 Sat","11 Sun"], 
          datasets:  [
            {
              label: "Daily",
              backgroundColor: '#F7685B',
              data: [3, 7, 4, 3, 7, 2, 4]
            },
            {
              label: "Gym Pass",
              backgroundColor: '#FFB946',
              data: [4, 3, 5, 3, 7, 4, 9]
            },
            {
              label: "Drop-Ins ",
               backgroundColor: '#2F9BFF',
              data: [7, 2, 6, 3, 7, 6, 4]
            },
            {
              label: "Event Pass",
              backgroundColor: '#FFB946',
              data: [4, 3, 5, 3, 7, 4, 9]
            },
          ]
  }
});


const pieChartOptionsDanger = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      align: 'center',
      labels: {
        pointStyle: 'circle',
        usePointStyle: true,
        padding: 10,
        boxWidth: 5,
        boxHeight: 5,

        generateLabels: (chart:any) => {
          return chart.data.labels.map((label:string, index:number) => {
            let labelObj = {
              text: label,
              datasetIndex: chart.data.datasets[index],
              fontColor: 'transparent',
              fillStyle: 'transparent',
              strokeStyle: 'transparent',
            }
            return labelObj
          })
        }
      }
    },
  },
}
const pieChartOptionsPrimary = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      displayColors: false,
    },
    legend: {
      position: 'right',
      align: 'center',
      labels: {
        pointStyle: 'circle',
        usePointStyle: true,
        padding: 10,
        boxWidth: 5,
        boxHeight: 5,
        generateLabels: (chart:any) => {
          return chart.data.labels.map((label:string, index:number) => {
            let labelObj = {
              text: label,
              datasetIndex: chart.data.datasets[index],
              fontColor: '#858D9D',
              fillStyle: '#E1DBC5',
              strokeStyle: 'transparent',
            }
            if(label === 'Upcoming events') {
              labelObj.fontColor = '#F7685B'
              labelObj.fillStyle = '#F7685B'
            }
            return labelObj
          })
        }
      }
    },
  },
}

const piechartDataPrimary = computed(() => {
  return {
    labels: ['Completed', 'Upcoming events'],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ['#E1DBC5', 'transparent'],
        cutout: '90%',
        borderWidth: 0,
        borderRadius: 20,
        circumference: 180,
        rotation: 270,
        spacing: -30,
      },
    ],
  }
});

const pieChartDataDanger = computed(() => {
  return {
    labels: ['Completed', 'Upcoming events'],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: [ 'transparent','#F7685B'],
        cutout: '90%',
        borderWidth: 0,
        borderRadius: 20,
        circumference: 180,
        rotation: 270,
        spacing: -30,
      },
    ],
  }
});


// handle click event
const onHandleDetailsPage = (pathName: string, id: string) => {
	console.log(pathName, id)
  router.push({
     name: pathName, 
      params: { id: id } 
    
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

const { result: dashboardWidgetResult, loading, refetch } = useQuery(
    FacilityDashboardWidgetDocument,
    {
      id: currentFacility.facility.id,
    }
);
const widgetInfo = computed(() => dashboardWidgetResult?.value?.facilityDashboardWidget);

const revenueSections = computed(() => {
  return [
    {
      title: 'Total revenue',
      subtitle: 'Today',
      dropdown: true,
      percentage: '0.8',
      direction: 'up',
      amount: widgetInfo?.value?.today_earn || 0
    },
    {
      title: 'Quarterly revenue',
      subtitle: 'Earned',
      dropdown: false,
      percentage: '70',
      direction: null,
      amount: widgetInfo?.value?.earn_last_thirty_days || 0
    },
//   year_earn
    {
      title: 'Earned revenue',
      subtitle: 'This year',
      dropdown: false,
      percentage: '0.8',
      direction: null,
      amount: widgetInfo?.value?.year_earn || 0
    }
  ]
})

const attendenceGrades = [
  {
    start: '0',
    end: '25',
    result: 'Poor',
    color: 'var(--Red, #F7685B)'
  },
  {
    start: '25',
    end: '50',
    result: 'Fair',
    color: 'var(--Yellow, #FFB946)'
  },
  {
    start: '50',
    end: '75',
    result: 'Good',
    color: '#2F9BFF'
  },
  {
    start: '75',
    end: '100',
    result: 'Excellent',
    color: 'var(--Green, #2ED47A)'
  },
]

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

  const datasets = [ 0, 25, 50, 75, 100 ];

  widgetInfo?.value?.checkin_data?.map((data:any) => {
    datasets[parseInt(data.month) - 1] = data.value
  })
  return {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec","Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: 'Poor',
        backgroundColor: function(context:any) {
          // const chart = context.chart;
          // const {
          //   ctx,
          //   chartArea
          // } = chart;
          // if (!chartArea) {
          //   return null;
          // }
          return '#F7685B'

        },
        data: datasets,
        barThickness: 30,
        borderRadius: 10,
        stack: 'stack 1',

      },
      {
        label: 'Fair',
        backgroundColor: '#FFB946',
        data: datasets,
        barThickness: 30,
        borderRadius: 10,
        stack: 'stack 1',
      },
      {
        label: 'Good',
        backgroundColor: '#2F9BFF',
        data: datasets,
        barThickness: 30,
        borderRadius: 10,
      },
      {
        label: 'Excellent',
        backgroundColor: '#2ED47A',
        data: datasets,
        barThickness: 30,
        borderRadius: 10,
        stack: 'stack 1',
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
    to: dayjs().add(+1, 'months').format("YYYY-MM-DD HH:mm:ss"),
  },
  ...idFilter.value,
};
const {
  result: upcomingeventRes,
  loading: upcomingeventsLoading,
  refetch: upcomingeventsRefetch
} = useQuery<EventsQuery>(EventsDocument, upcomingeventsParams, {
  fetchPolicy: "no-cache",
});

const upcomingevents = computed(() => {
  return upcomingeventRes.value?.events?.data;
});


// handle click event
const onHandleClickMenu = (pathName: string, status: string) => {
	console.log(pathName, status)
  router.push({
     name: pathName, 
      query: { status: status } 
    
    });
};


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
                upcomingeventsRefetch({
                  ...upcomingeventsParams,
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
.market-chart-legend {
  padding-left: 14px;
  padding-right: 14px;
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 32px;
  .round {
    width: 6px;
    height: 6px;
    border-radius: 50% 50%;
  }
  .label {
    color: var(--60, rgba(255, 255, 255, 0.60)) !important;
    font-family: Manrope !important;
    font-size: 0.75rem !important;
    font-style: normal !important;
    font-weight: 400 !important;
    line-height: normal !important;
    margin-bottom: 0px !important;
  }
}

.market-chart-legend-summary {
  color: var(--Red, #F7685B);
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
}
.event-block {
  padding: 19px 8.37px 30px 16px;
  width: 100%;
  background-color: var(--gray-700);
  border-radius: 10px;
  min-height: calc(100% - 15px);
  .date {
    padding: 0px !important;
  }
}
.description {
  width: 100%;
  height: 100%;
  opacity: 0.8;
  background: linear-gradient(0deg, rgba(11, 11, 11, 0.10) 0%, rgba(11, 11, 11, 0.10) 100%), #2D2D2D;
  position: relative;
  color: #C4C4C4;
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
  background: rgba(32, 32, 32, 0.70);
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
  margin: 0 23px;
}
.event-ring {
  margin-left: 34px;
  margin-right: 9px;
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
  color: var(--beige, #E1DBC5);
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

ion-col.col-gap.test {
  margin-top: -46%;
}

.red-text {
  color: #F7685B;
}
</style>


