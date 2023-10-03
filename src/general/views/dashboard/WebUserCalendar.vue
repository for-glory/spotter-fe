<template>
  <div class="calendar-container">
    <div class="header">
      <WebHeader :title="routingStates.includes('no_orders') ? 'Calendar' : 'Back' " :back-btn="true" gold-title @back="handleBack" />
    </div>
    <div class="d-flex gap-16 h-100 mt-2 overflow-hidden">
      <div
        class="flex-1 h-100 d-flex-col justify-content-between hide-scrollbar"
      >
        <div class="orders-container" v-if="!routingStates.includes('event_detail')">
          <div class="order-header">My Orders</div>
          <div class="info" v-if="routingStates.includes('no_orders')">
                Select a date to display your order
          </div>
          <div class="order-content">
            <div class="block-container" v-if="routingStates.includes('date_selected')">
              <div class="title">Showing results for {{ dayjs(selectedDate).format('D MMMM YYYY') }}</div>
              <ChooseBlock
                title="Active"
                value="3 Events"
                is-inactive
                :is-active="activeBlock === ActiveBlock.Active ? true : false"
                @handle-click="goToDetail('Active')"
              />
              <ChooseBlock
                title="Planned"
                is-inactive
                :is-active="activeBlock === ActiveBlock.Planned ? true : false"
                value="3 Events"
                @handle-click="goToDetail('Planned')"
              />
            </div>
            <div class="event-container" v-if="routingStates.includes('event')" >
              <hr class="separator">
              <div class="events-header">
                {{ activeBlock }}
              </div>

              <template v-for="detail in details">
                <UpcomingItem
                  :title="detail.title"
                  :days="detail?.days"
                  :img-src="detail.imgSrc"
                  :is-upcomming="detail?.days ? true : false"
                  :is-short-time="detail?.days ? false : true"
                  :square-img="detail.squarImg"
                  native-item
                  @click="onEventClick(detail)"
                />
              </template>
            </div>
          </div>
        </div>
        <div class="position-relative" v-else>
          <TraningPage is-web :web-session-type="selectedEvent" />
        </div>
      </div>
      <div class="flex-2 h-100 hide-scrollbar">
        <BaseCustomCalendar class="web-custom-calendar" @date-changed="dateChange" week-days-format="W" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import WebHeader from "@/general/components/blocks/headers/WebHeader.vue";
import BaseCustomCalendar from "@/general/components/base/BaseCustomCalendar.vue";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import UpcomingItem from "@/general/components/dashboard/UpcomingItem.vue";
import TraningPage from "@/users/views/training/Index.vue";
import { EntitiesEnum } from "@/const/entities";
import router from "@/router";
enum ActiveBlock {
  Active = "Active",
  Planned = "Planned",
}

const selectedDate = ref(null);
const eventTitle = ref("Active");
const activeBlock = ref(null);
const selectedEvent = ref(null);
const routingStates = ref(['no_orders'])
const details = [
  {
    id: "1",
    title: "Food festival",
    imgSrc: "assets/backgrounds/food1.png",
    subtitle: "17 june",
    location: "Summer Gym, Wall Street, 24",
    upcomingType: "Upcoming",
    squarImg: true,
    type: EntitiesEnum.Event
  },
  {
    id: "2",
    title: "Tamra Dae",
    imgSrc: "assets/backgrounds/Gym_1.png",
    subtitle: "17 june",
    location: "Summer Gym, Wall Street, 24",
    squarImg: false,
    type: EntitiesEnum.FacilityDropins
  },
  {
    id: "3",
    title: "Fantastic Gym",
    imgSrc: "assets/backgrounds/Gym_3.png",
    location: "Wall Street, 24",
    days: "7 days left",
    upcomingType: "7 Days",
    squarImg: true,
    type: EntitiesEnum.FacilityDropins

  },
  { 
    id: "4",
    title: "Jennifer James",
    imgSrc: "assets/backgrounds/Gym_1.png",
    subtitle: "17 june",
    location: "Summer Gym, Wall Street, 24",
    type: EntitiesEnum.Training
  },
];

const goToDetail = (type: string) => {
  activeBlock.value = ActiveBlock[type];
  if (!routingStates.value.includes('event')) { 
    routingStates.value.push('event');
  }
};

const dateChange = (ev:any) => {
  selectedDate.value = ev.date;
  if(!routingStates.value.includes('date_selected')){
    routingStates.value.pop();
    routingStates.value.push('date_selected');
  }
}

const onEventClick = (event:any) => {
  selectedEvent.value = event.type
  if(!routingStates.value.includes('event_detail')){
    routingStates.value.push('event_detail');
  }
}

const handleBack = () => {
  console.log(routingStates.value);
  if (routingStates.value.length === 1) {
    router.go(-1);
  } else {
    if(routingStates.value[routingStates.value.length - 1] === 'event'){
      activeBlock.value = null
    }
    routingStates.value.pop();
  }

}
</script>
<style scoped lang="scss">
.calendar-container {
  padding: 24px 16px 64px;
  height: 100%;
  width: 100%;
  overflow: auto;
  .header {
    padding-left: 50px;
  }

  .orders-container {
    padding: 0 10px;
    width: 100%;
    height: 100%;

    .order-header {
      padding: 0 12px;
    }

    .info {
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--grey-text);
      font-family: Lato;
      font-size: 16px;
      font-weight: 400;
      line-height: 150%;
      width: 100%;
      height: 300px;
    }
    .order-content {
      .block-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 45px;
        .title {
          color: var(--fitnesswhite);
          font-family: Yantramanav;
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          text-align: center;
        }
      }

      .event-container {
        .separator {
          background: rgba(255, 255, 255, 0.60);  
          margin-left: 15px;
          margin-right: 15px;
          margin: 20px 15px 0 15px ;
        }
        .events-header {
          margin-top: 20px;
          color: var(--gold);
          font-family: Lato;
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: 150%;
          padding: 0 15px 15px;
        }
      }
    }
  }

  .position-relative {
    position: relative;
    height: 100%;
  }

  .overflow-hidden {
    overflow: hidden;
  }
  .flex-1 {
    max-width: 360px;
    background: var(--gray-700);
    padding-top: 20px;
  }
  .flex-1,
  .flex-2 {
    width: 100%;
    overflow: auto;
  }
}
</style>
