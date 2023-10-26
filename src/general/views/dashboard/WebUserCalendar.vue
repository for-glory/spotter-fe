<template>
  <div class="calendar-container">
    <div class="header">
      <WebHeader
        :title="routingStates.includes('no_orders') ? 'Calendar' : 'Back'"
        :back-btn="true"
        gold-title
        @back="handleBack"
      />
    </div>
    <div class="d-flex gap-16 h-100 mt-2 overflow-hidden">
      <div
        class="flex-1 h-100 d-flex-col justify-content-between hide-scrollbar"
      >
        <div class="orders-container" v-if="showOrder">
          <div class="order-header">My Orders</div>
          <div class="info" v-if="routingStates.includes('no_orders')">
            Select a date to display your order
          </div>
          <div class="order-content">
            <div
              class="block-container"
              v-if="routingStates.includes('date_selected')"
            >
              <div class="title">
                Showing results for
                {{ dayjs(selectedDate).format("D MMMM YYYY") }}
              </div>
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
            <div class="event-container" v-if="routingStates.includes('event')">
              <hr class="separator" />
              <div class="events-header">
                {{ activeBlock }}
              </div>

              <template v-for="detail in details">
                <UpcomingItem
                  :item="detail"
                  :type-name="detail.type"
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
        <BaseCustomCalendar
          class="web-custom-calendar"
          @day-click="dateChange"
          :attributes="calendarOption" 
          week-days-format="W"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
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

const route = useRoute();
const type = computed(() => {
  if (route.params?.type === EntitiesEnum.Facilities) {
    return EntitiesEnum.Facility;
  } else if (route.params?.type === EntitiesEnum.FacilityDropins) {
    return EntitiesEnum.FacilityDropins;
  } else if (route.params?.type === EntitiesEnum.Trainings) {
    return EntitiesEnum.Training;
  } else if (route.params?.type === EntitiesEnum.Events) {
    return EntitiesEnum.Event;
  } else {
    return route.params?.type;
  }
});

const showOrder = computed(() => {
  if (
    routingStates.value.at(-1) !== "event_detail" &&
    routingStates.value.at(-1) !== "param_detail"
  ) {
    return true;
  }
  return false;
});

const calendarOption = computed(() => {
  return [
  {
      highlight: {
        style: {
          backgroundColor: "var(--gold)",
        },
      },
      dates: new Date(),
    },
    {
      highlight: {
        fillMode: 'outline',
        style: {
          backgroundColor: "#262626",
          borderWidth: "1px",
          borderColor: "var(--gold)",
        },
      },
      dates: new Date(),
    },
  ];
});

const selectedDate = ref(new Date());
const activeBlock = ref(null);
const selectedEvent = ref(type.value ? type.value : null);
const routingStates = ref(type.value ? ["param_detail"] : ["no_orders"]);

const details = [
{
    id: "1",
    start_date: new Date(),
    end_date: new Date(),
    is_active_pass: false,
    type: EntitiesEnum.Facilities,
    facilityItem: {
      title: "Fantastic Gym",
      qr_code_lifetime_value: 12,
      facility: {
        id: 22,
        name: "test",
        media: [
          {
            pathUrl:
              "https://spotter-production-space.sfo3.cdn.digitaloceanspaces.com/events/r9GQARG589Rn9Wk71rAK6yiNsLVNmbl4C3hxSGnB.png",
            __typename: "Media",
          },
        ],
        address: {
          street: "2340 North Interstate 35 Frontage Road,",
          __typename: "Address",
        },
      },
    },
  },
  {
    id: "1",
    state: "state",
    start_date: new Date(),
    type: EntitiesEnum.Trainings,
    trainer: {
      avatarUrl:
        "https://spotter-production-space.sfo3.cdn.digitaloceanspaces.com/events/r9GQARG589Rn9Wk71rAK6yiNsLVNmbl4C3hxSGnB.png",
      first_name: "Tamra",
      last_name: "dae",
      address: {
        street: "2340 North Interstate 35 Frontage Road,",
        __typename: "Address",
      },
    },
  },
  {
    "id": "85",
    "title": "Trainers event",
    "address": {
        "street": "2340 North Interstate 35 Frontage Road,",
        "__typename": "Address"
    },
    "start_date": "2023-10-09 00:00:00",
    "media": [
        {
            "pathUrl": "https://spotter-production-space.sfo3.cdn.digitaloceanspaces.com/events/r9GQARG589Rn9Wk71rAK6yiNsLVNmbl4C3hxSGnB.png",
            "__typename": "Media"
        }
    ],
    "type": EntitiesEnum.Events
  }
]

const goToDetail = (type: string) => {
  activeBlock.value = ActiveBlock[type];
  if (!routingStates.value.includes("event")) {
    routingStates.value.push("event");
  }
};

const dateChange = (ev: any) => {
  calendarOption.value[0].dates = new Date(ev);
  selectedDate.value = ev;
  if (!routingStates.value.includes("date_selected")) {
    if (routingStates.value[0] === "no_orders") routingStates.value.pop();
    routingStates.value.push("date_selected");
  }
};

const onEventClick = (event: any) => {

  selectedEvent.value = event.type;
  if (!routingStates.value.includes("event_detail")) {
    routingStates.value.push("event_detail");
  }
};

const handleBack = () => {
  if (routingStates.value.length === 1) {
    router.go(-1);
  } else {
    const lastState = routingStates.value.at(-1);
    if (lastState === "event") {
      activeBlock.value = null;
    }
    if (lastState === "date_selected" && type.value) {
      selectedEvent.value = type.value;
    }
    routingStates.value.pop();
  }
};
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
          background: rgba(255, 255, 255, 0.6);
          margin-left: 15px;
          margin-right: 15px;
          margin: 20px 15px 0 15px;
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
