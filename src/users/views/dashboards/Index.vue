<template>
  <base-layout>
  
    <template #header>
      <search-form :type="EntitiesEnum.FacilityDropins" @handle-focus="isSearchOnFocus = true"
  @handle-blur="isSearchOnFocus = false" />
      <page-header title="Dashboard">
        <template #custom-btn>
          <ion-button @click="onViewChat" class="header-btn">
            <ion-icon src="assets/icon/chat.svg" />
            <span class="header-btn__badge" v-if="unreadMessages.length"></span>
          </ion-button>
          <ion-button @click="onViewFavourites" class="header-btn">
            <ion-icon src="assets/icon/heart.svg" />
          </ion-button>
        </template>
      </page-header>
    </template>

    <template #content>
      <div class="dashboard">
        <div class="dashboards-items">
          <dashboard-item :items="activityItems">
            <template #title>
              <ion-icon src="assets/icon/Lightning.svg" class="" />
              My Ratings
            </template>
          </dashboard-item>
          <dashboard-item :items="ratingItems">
            <template #title>
              <ion-icon src="assets/icon/trophy.svg" class="trophy-icon" />
              Activity
            </template>
            <template #bottom>
              <div class="rating__container">
                <ion-text class="rating-likes">
                  {{ widgetInfo?.positive_reviews_count || 0 }}
                  <ion-icon class="like-icon" src="assets/icon/Like.svg" />
                </ion-text>
                <ion-text class="rating-dislikes">
                  {{ widgetInfo?.negative_reviews_count || 0 }}
                  <ion-icon class="dislike-icon" src="assets/icon/Dislike.svg" />
                </ion-text>
              </div>
            </template>
          </dashboard-item>
        </div>
        <week-calendar v-model="selectedDate" :bookings="bookings" @handle-view="onViewCalendar" />
        <page-tabs-New :tabs="tabs" class="page-tabs" :value="activeTab" @change="tabsChanged" />
        <div class="events__container">

          <items-header :title="dynamicTitle" @handle-view="onViewAllEvents" :hide-view-more="!selectedEvents?.length ||
            isFacilitiesLoading ||
            isTrainingsLoading ||
            isEventsLoading ||
            isDropinsLoading
            " />
            <div class="item_cont_flex" style="display:flex;justify-content:space-between;">
          <ion-item data-v-136129e6="" class="event item md item-lines-default item-fill-none item-label mob_tab"
            style="padding: 0px;width:100%;margin:20px;"><ion-thumbnail data-v-136129e6="" class="event__photo md"><img data-v-136129e6=""
                src="assets/backgrounds/Gym_2.png" class="event__img"></ion-thumbnail>
            <div data-v-136129e6="" class="event__holder"><ion-label data-v-136129e6=""
                class="event__title sc-ion-label-md-h sc-ion-label-md-s md">Diamond Gym</ion-label>
              <div data-v-136129e6="" class="event__time my_txt2">
                <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> --> $ 89.90 </div><!-- <ion-text class="event__date">
            &nbsp;
            <template> </template>
          </ion-text> -->
              <div data-v-136129e6="" class="d-flex align-items-center justify-content-between" style="margin-top: 14px;">
                <address-item data-v-136129e6="" class="event__address">
                  <div data-v-136129e6="" class="mid_txt" style="display: flex; align-items: center;"><img
                      data-v-136129e6="" src="assets/icon/pin_loc.png" class="img-fluid" style="width: 15px;"><span
                      data-v-136129e6="" style="padding-left: 10px;">Light Street, 24</span></div>
                </address-item><ion-text data-v-136129e6="" class="status-text md txt_sd"><span data-v-136129e6=""
                    style="color: rgb(225, 219, 197);font-size:15px;">Premium</span></ion-text></div>
            </div>
          </ion-item>
          <ion-item data-v-136129e6="" class="event item md item-lines-default item-fill-none item-label mob_tab"
            style="padding: 0px;width:100%;margin:20px;"><ion-thumbnail data-v-136129e6="" class="event__photo md"><img data-v-136129e6=""
                src="assets/backgrounds/Gym_1.png" class="event__img"></ion-thumbnail>
            <div data-v-136129e6="" class="event__holder"><ion-label data-v-136129e6=""
                class="event__title sc-ion-label-md-h sc-ion-label-md-s md">Diamond Gym</ion-label>
              <div data-v-136129e6="" class="event__time my_txt2">
                <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> --> $ 89.90 </div><!-- <ion-text class="event__date">
            &nbsp;
            <template> </template>
          </ion-text> -->
              <div data-v-136129e6="" class="d-flex align-items-center justify-content-between" style="margin-top: 14px;">
                <address-item data-v-136129e6="" class="event__address">
                  <div data-v-136129e6="" class="mid_txt" style="display: flex; align-items: center;"><img
                      data-v-136129e6="" src="assets/icon/pin_loc.png" class="img-fluid" style="width: 15px;"><span
                      data-v-136129e6="" style="padding-left: 10px;">Light Street, 24</span></div>
                </address-item><ion-text data-v-136129e6="" class="status-text md txt_sd"><span data-v-136129e6=""
                    style="color: rgb(193, 68, 68);font-size:15px;">Expired</span></ion-text></div>
            </div>
          </ion-item>
          <ion-item data-v-136129e6="" class="event item md item-lines-default item-fill-none item-label mob_tab"
            style="padding: 0px;width:100%;margin:20px;"><ion-thumbnail data-v-136129e6="" class="event__photo md"><img data-v-136129e6=""
                src="assets/backgrounds/Gym_2.png" class="event__img"></ion-thumbnail>
            <div data-v-136129e6="" class="event__holder"><ion-label data-v-136129e6=""
                class="event__title sc-ion-label-md-h sc-ion-label-md-s md">Diamond Gym</ion-label>
              <div data-v-136129e6="" class="event__time my_txt2">
                <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> --> $ 89.90 </div><!-- <ion-text class="event__date">
            &nbsp;
            <template> </template>
          </ion-text> -->
              <div data-v-136129e6="" class="d-flex align-items-center justify-content-between" style="margin-top: 14px;">
                <address-item data-v-136129e6="" class="event__address">
                  <div data-v-136129e6="" class="mid_txt" style="display: flex; align-items: center;"><img
                      data-v-136129e6="" src="assets/icon/pin_loc.png" class="img-fluid" style="width: 15px;"><span
                      data-v-136129e6="" style="padding-left: 10px;">Light Street, 24</span></div>
                </address-item><ion-text data-v-136129e6="" class="status-text md txt_sd"><span data-v-136129e6=""
                    style="color: rgb(193, 68, 68);font-size:15px;">Expired</span></ion-text></div>
            </div>
          </ion-item>
        </div>
        <div class="item_cont_flex" style="display:flex;justify-content:space-between;">
          <ion-item data-v-136129e6="" class="event item md item-lines-default item-fill-none item-label mob_tab"
            style="padding: 0px;width:100%;margin:20px;"><ion-thumbnail data-v-136129e6="" class="event__photo md"><img data-v-136129e6=""
                src="assets/backgrounds/Gym_1.png" class="event__img"></ion-thumbnail>
            <div data-v-136129e6="" class="event__holder"><ion-label data-v-136129e6=""
                class="event__title sc-ion-label-md-h sc-ion-label-md-s md">Diamond Gym</ion-label>
              <div data-v-136129e6="" class="event__time my_txt2">
                <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> --> $ 89.90 </div><!-- <ion-text class="event__date">
            &nbsp;
            <template> </template>
          </ion-text> -->
              <div data-v-136129e6="" class="d-flex align-items-center justify-content-between" style="margin-top: 14px;">
                <address-item data-v-136129e6="" class="event__address">
                  <div data-v-136129e6="" class="mid_txt" style="display: flex; align-items: center;"><img
                      data-v-136129e6="" src="assets/icon/pin_loc.png" class="img-fluid" style="width: 15px;"><span
                      data-v-136129e6="" style="padding-left: 10px;">Light Street, 24</span></div>
                </address-item><ion-text data-v-136129e6="" class="status-text md txt_sd"><span data-v-136129e6=""
                    style="color: rgb(193, 68, 68);font-size:15px;">Expired</span></ion-text></div>
            </div>
          </ion-item>
          <ion-item data-v-136129e6="" class="event item md item-lines-default item-fill-none item-label mob_tab"
            style="padding: 0px;width:100%;margin:20px;"><ion-thumbnail data-v-136129e6="" class="event__photo md"><img data-v-136129e6=""
                src="assets/backgrounds/Gym_1.png" class="event__img"></ion-thumbnail>
            <div data-v-136129e6="" class="event__holder"><ion-label data-v-136129e6=""
                class="event__title sc-ion-label-md-h sc-ion-label-md-s md">Diamond Gym</ion-label>
              <div data-v-136129e6="" class="event__time my_txt2">
                <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> --> $ 89.90 </div><!-- <ion-text class="event__date">
            &nbsp;
            <template> </template>
          </ion-text> -->
              <div data-v-136129e6="" class="d-flex align-items-center justify-content-between" style="margin-top: 14px;">
                <address-item data-v-136129e6="" class="event__address">
                  <div data-v-136129e6="" class="mid_txt" style="display: flex; align-items: center;"><img
                      data-v-136129e6="" src="assets/icon/pin_loc.png" class="img-fluid" style="width: 15px;"><span
                      data-v-136129e6="" style="padding-left: 10px;">Light Street, 24</span></div>
                </address-item><ion-text data-v-136129e6="" class="status-text md txt_sd"><span data-v-136129e6=""
                    style="color: rgb(225, 219, 197);font-size:15px;">Premium</span></ion-text></div>
            </div>
          </ion-item>
          <ion-item data-v-136129e6="" class="event item md item-lines-default item-fill-none item-label mob_tab"
            style="padding: 0px;width:100%;margin:20px;"><ion-thumbnail data-v-136129e6="" class="event__photo md"><img data-v-136129e6=""
                src="assets/backgrounds/Gym_2.png" class="event__img"></ion-thumbnail>
            <div data-v-136129e6="" class="event__holder"><ion-label data-v-136129e6=""
                class="event__title sc-ion-label-md-h sc-ion-label-md-s md">Diamond Gym</ion-label>
              <div data-v-136129e6="" class="event__time my_txt2">
                <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> --> $ 89.90 </div><!-- <ion-text class="event__date">
            &nbsp;
            <template> </template>
          </ion-text> -->
              <div data-v-136129e6="" class="d-flex align-items-center justify-content-between" style="margin-top: 14px;">
                <address-item data-v-136129e6="" class="event__address">
                  <div data-v-136129e6="" class="mid_txt" style="display: flex; align-items: center;"><img
                      data-v-136129e6="" src="assets/icon/pin_loc.png" class="img-fluid" style="width: 15px;"><span
                      data-v-136129e6="" style="padding-left: 10px;">Light Street, 24</span></div>
                </address-item><ion-text data-v-136129e6="" class="status-text md txt_sd"><span data-v-136129e6=""
                    style="color: rgb(225, 219, 197);font-size:15px;">Premium</span></ion-text></div>
            </div>
          </ion-item>
        </div>

        </div>
        <!-- <page-tabs-New
          :tabs="tabs"
          class="page-tabs"
          :value="activeTab"
          @change="tabsChanged"
        /> -->
      </div>

    </template>
  </base-layout>
</template>

<script lang="ts">
export default {
  name: "Dashboard",
  // data() {
  //   return {
  //     tabs: [
  //       {
  //         name: "Facilities",
  //         labelActive: "assets/icon/dumbbellActive.png",
  //         labelInactive: "assets/icon/dumbbellActive.png",
  //       },
  //       {
  //         name: "FacilityDropins",
  //         labelActive: "assets/icon/dropinsActive.png",
  //         labelInactive: "assets/icon/dropinsInactive.png",
  //       },
  //       {
  //         name: "Trainings",
  //         labelActive: "assets/icon/trainerActive.png",
  //         labelInactive: "assets/icon/trainerInactive.png",
  //       },
  //       {
  //         name: "Events",
  //         labelActive: "assets/icon/facilitiesActive.png",
  //         labelInactive: "assets/icon/facilitiesInactive.png",
  //       },
  //     ],
  //     activeTab: "Facilities", // Initialize the active tab
  //   };
  // },
  // methods: {
  //   tabsChanged(tabName: string) {
  //     this.activeTab = tabName;
  //   },
  // },
};
</script>

<script setup lang="ts">
import BaseDashboardLayout from "@/general/components/base/BaseDashboardLayout.vue";

import BaseLayout from "@/general/components/base/BaseLayout.vue";
import SearchForm from "@/general/components/forms/SearchForm.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import DashboardItem from "@/general/components/DashboardItem.vue";
import {
  IonButton,
  IonIcon,
  IonText,
  IonSpinner,
  isPlatform,
} from "@ionic/vue";
import { TabItemNew } from "@/interfaces/TabItemNew";
import { EntitiesEnum } from "@/const/entities";
import { computed, onMounted, ref } from "vue";

import PageTabsNew from "@/general/components/PageTabsNew.vue";
import {
  EventPaginator,
  MyEventsDocument,
  MyFacilityItemPassesDocument,
  FacilityItemPass,
  UserPaginator,
  MyTrainingsDocument,
  DashboardWidgetDocument,
  UserAvailabilityDocument,
  Training,
  QueryMyTrainingsOrderByColumn,
  SortOrder,
  QueryMyFacilityItemPassesOrderByColumn,
  QueryMyEventsOrderByColumn,
  TrainingStatesEnum,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import EventItem from "@/general/components/EventItem.vue";
import ItemsHeader from "@/general/components/blocks/headers/ItemsHeader.vue";
import { Capacitor } from "@capacitor/core";
import WeekCalendar from "@/general/components/blocks/calendar/WeekCalendar.vue";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "vue-router";
import useId from "@/hooks/useId";
import { onValue } from "firebase/database";
import { chatsRef } from "@/firebase/db";
import EmptyBlock from "@/general/components/EmptyBlock.vue";

const router = useRouter();
const { id } = useId();
const unreadMessages = ref<number[]>([]);

const {
  result: eventsResult,
  loading: isEventsLoading,
  refetch: refetchEvents,
} = useQuery(
  MyEventsDocument,
  {
    page: 1,
    first: 4,
    start_date: {
      from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      to: dayjs().add(1, "M").format("YYYY-MM-DD HH:mm:ss"),
    },
    orderBy: [
      {
        column: QueryMyEventsOrderByColumn.StartDate,
        order: SortOrder.Asc,
      },
    ],
  },
  {
    fetchPolicy: "no-cache",
  }
);

const getPlatform = computed(() => {
  if (Capacitor.isNativePlatform()) {
    if (isPlatform("android")) {
      return "android";
    }
    if (isPlatform("ios")) {
      return "ios";
    }
  } else {
    return "desktop";
  }
});

const isSearchOnFocus = ref<boolean>(false);



const {
  result: trainingsResult,
  loading: isTrainingsLoading,
  refetch: refetchTrainings,
} = useQuery(
  MyTrainingsDocument,
  {
    page: 1,
    first: 4,
    start_date: {
      from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      to: dayjs().add(1, "M").format("YYYY-MM-DD HH:mm:ss"),
    },
    orderBy: [
      {
        column: QueryMyTrainingsOrderByColumn.StartDate,
        order: SortOrder.Asc,
      },
    ],
  },
  {
    fetchPolicy: "no-cache",
  }
);

const {
  result: dropinsResult,
  loading: isDropinsLoading,
  refetch: refetchDropins,
} = useQuery(
  MyTrainingsDocument,
  {
    page: 1,
    first: 4,
    start_date: {
      from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      to: dayjs().add(1, "M").format("YYYY-MM-DD HH:mm:ss"),
    },
    orderBy: [
      {
        column: QueryMyTrainingsOrderByColumn.StartDate,
        order: SortOrder.Asc,
      },
    ],
  },
  {
    fetchPolicy: "no-cache",
  }
);

const {
  result: facilitiesResult,
  loading: isFacilitiesLoading,
  refetch: refetchFacilities,
} = useQuery(
  MyFacilityItemPassesDocument,
  {
    page: 1,
    first: 4,
    orderBy: [
      {
        column: QueryMyFacilityItemPassesOrderByColumn.StartDate,
        order: SortOrder.Asc,
      },
    ],
  },
  {
    fetchPolicy: "no-cache",
  }
);

// Dashboard widgets - Activity + My Ratings widgets info
const { result: dashboardWidgetResult } = useQuery(DashboardWidgetDocument);

// Calendar info
const { result: calendarWidgetResult } = useQuery(
  UserAvailabilityDocument,
  {
    id,
    from: dayjs().startOf("d").format("YYYY-MM-DD HH:mm:ss"),
    to: dayjs().day(6).endOf("d").format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    fetchPolicy: "no-cache",
  }
);

const bookings = computed(() => {
  const availability = [];
  if (calendarWidgetResult && calendarWidgetResult?.value) {
    const userAvailability = calendarWidgetResult?.value?.userAvailability;

    if (userAvailability && userAvailability?.events) {
      const { events } = userAvailability;
      const bookedEvents = events.map((event: any) => ({
        start_date: event?.start_date || null,
      }));

      availability.push(...bookedEvents);
    }
    if (userAvailability && userAvailability?.trainings) {
      const { trainings } = userAvailability;
      const bookedTrainings = trainings
        .filter(
          (training: Training) => training.state === TrainingStatesEnum.Accepted
        )
        .map((training: Training) => ({
          start_date: training?.start_date || null,
        }));
      availability.push(...bookedTrainings);
    }
  }
  return availability;
});

const fetchChats = () => {
  if (unreadMessages.value.length) unreadMessages.value = [];
  onValue(chatsRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const chat = childSnapshot.val();
      if (chat.unread && chat.unread[id]) {
        unreadMessages.value.push(chat.unread[id]);
      }
    });
  });
};

onMounted(() => {
  fetchChats();
});

const widgetInfo = computed(() => dashboardWidgetResult?.value?.me || []);

const ratingItems = computed(() => [
  {
    value: widgetInfo?.value?.reviews_count || 0,
    description: "total feedbacks",
  },
]);

const activityItems = computed(() => [
  {
    value: widgetInfo?.value?.checkins_count || 0,
    description: "gym check-ins",
  },
  {
    value: widgetInfo?.value?.completed_trainings_count || 0,
    description: "trainings done",
  },
]);

const events = computed<EventPaginator["data"]>(() =>
  eventsResult?.value?.myEvents?.data ? eventsResult.value.myEvents.data : []
);

const trainings = computed(() =>
  trainingsResult?.value?.myTrainings?.data
    ? trainingsResult.value.myTrainings.data.map((training: Training) => ({
      ...training,
      title: `${training.trainer.first_name} ${training.trainer.last_name}`,
      address: training.trainer.address,
      media: [{ pathUrl: training.trainer.avatarUrl }],
    }))
    : []
);

const dropins = computed(() =>
  dropinsResult?.value?.myTrainings?.data
    ? trainingsResult.value.myTrainings.data.map((training: Training) => ({
      ...training,
      title: `${training.trainer.first_name} ${training.trainer.last_name}`,
      address: training.trainer.address,
      media: [{ pathUrl: training.trainer.avatarUrl }],
    }))
    : []
);

const facilities = computed<UserPaginator["data"]>(() =>
  facilitiesResult?.value?.myFacilityItemPasses?.data
    ? facilitiesResult.value.myFacilityItemPasses.data.map(
      (facilityPass: FacilityItemPass) => ({
        id: facilityPass.id,
        title: facilityPass.facilityItem.facility.name,
        end_date: facilityPass.end_date,
        start_date: dayjs(facilityPass.end_date)
          .subtract(
            facilityPass.facilityItem.qr_code_lifetime_value ?? 0,
            "d"
          )
          .format("YYYY-MM-DD HH:mm:ss"),
        media: facilityPass.facilityItem.facility.media,
        address: facilityPass.facilityItem.facility.address,
      })
    )
    : []
);

const selectedEvents = computed(() => {
  if (activeTab.value === EntitiesEnum.Events) {
    return events.value;
  }

  if (activeTab.value === EntitiesEnum.Facilities) {
    return facilities.value;
  }

  if (activeTab.value === EntitiesEnum.FacilityDropins) {
    return dropins.value;
  }
  return trainings.value;
});

const dynamicTitle = computed(() => {
  if (activeTab.value === EntitiesEnum.Events) {
    return "Upcoming Events";
  }

  if (activeTab.value === EntitiesEnum.Facilities) {
    return "My Passes";
  }

  if (activeTab.value === EntitiesEnum.FacilityDropins) {
    return "My Drop-ins";
  }

  return "Upcoming Trainings";
});

const bookingName = computed(() => {
  if (activeTab.value === EntitiesEnum.Events) {
    return "events";
  }

  if (activeTab.value === EntitiesEnum.Facilities) {
    return "gyms";
  }

  return "trainings";
});

const tabs: TabItemNew[] = [
  {
    name: EntitiesEnum.FacilityDropins,
    labelActive: "assets/icon/dropinsActive.png",
    labelInactive: "assets/icon/dropins.png",
  },
  {
    name: EntitiesEnum.Facilities,
    labelActive: "assets/icon/dumbbell.png",
    labelInactive: "assets/icon/dumbbellActive.png",
  },

  {
    name: EntitiesEnum.Trainings,
    labelActive: "assets/icon/TrainerActive.png",
    labelInactive: "assets/icon/Trainer.png",
  },
  {
    name: EntitiesEnum.Events,
    labelActive: "assets/icon/facilitiesActive.png",
    labelInactive: "assets/icon/facilities.png",
  },
];

const selectedDate = ref<Dayjs | null>(dayjs());

const activeTab = ref<EntitiesEnum>(
  (localStorage.getItem("dashboard_active_tab") as EntitiesEnum) ||
  EntitiesEnum.Facilities
);

const tabsChanged = (ev: EntitiesEnum) => {
  if (!ev) return;
  activeTab.value = ev;
  localStorage.setItem("dashboard_active_tab", activeTab.value);
  refetchBooking();
};

const refetchBooking = () => {
  switch (activeTab.value) {
    case EntitiesEnum.Events:
      refetchEvents();
      break;

    case EntitiesEnum.FacilityDropins:
      refetchDropins();
      break;

    case EntitiesEnum.Trainings:
      refetchTrainings();
      break;

    case EntitiesEnum.Facilities:
      refetchFacilities();
      break;

    default:
      break;
  }
};

const onViewAllEvents = () => {
  router.push({ name: EntitiesEnum.DashboardEvents });
};

const onViewChat = () => {
  router.push({ name: EntitiesEnum.ChatList });
};
const onViewFavourites = () => {
  router.push({ name: EntitiesEnum.Favourites });
};

const onViewCalendar = () => {
  router.push({ name: EntitiesEnum.DashboardCalendar });
};

const openEvent = (id: string | number) => {
  switch (activeTab.value) {
    case EntitiesEnum.Facilities:
      return router.push({
        name: EntitiesEnum.BookedTraining,
        params: { id },
        query: {
          type: EntitiesEnum.Facility,
        },
      });

    case EntitiesEnum.Trainings:
      return router.push({
        name: EntitiesEnum.BookedTraining,
        params: { id },
        query: {
          type: EntitiesEnum.Training,
        },
      });

    case EntitiesEnum.Events:
      return router.push({
        name: EntitiesEnum.BookedTraining,
        params: { id },
        query: {
          type: EntitiesEnum.Event,
        },
      });

    default:
      break;
  }
};

const props = withDefaults(
  defineProps<{
    item: Event;
    rounded?: boolean;
    dateRange?: boolean;
    hideTime?: boolean;
  }>(),
  {
    rounded: false,
  }
);
const date = computed(() =>
  dayjs(props.item.start_date).format(
    props.dateRange &&
      dayjs(props.item.start_date).year() !== dayjs(props.item.end_date).year()
      ? "D MMM YYYY"
      : "D MMMM"
  )
);
const endDate = computed(() =>
  dayjs(props.item.end_date).format(
    props.dateRange &&
      dayjs(props.item.start_date).year() !== dayjs(props.item.end_date).year()
      ? "D MMM YYYY"
      : "D MMMM"
  )
);
const time = computed(() => dayjs(props.item.start_date).format("hh:mm A"));
const formatTime = (date: number, time: string): string => {
  return dayjs(date)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0)
    .format("YYYY-MM-DD HH:mm:ss");
};
</script>

<style scoped lang="scss">
.dashboard {
  padding: 24px 16px 78px;
}

.header-btn {
  height: 32px;
  margin: 0 5px;
  font-size: 24px;
  display: block;
  min-width: 32px;
  --border-radius: 50% !important;
  --icon-font-size: 24px;
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  --icon-padding-bottom: 0;
  --icon-padding-end: 0;
  --icon-padding-start: 0;
  --icon-padding-top: 0;
  --min-height: 32px;
  --min-width: 32px;

  ion-icon {
    font-size: 1em;
  }

  &__badge {
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: absolute;
    margin: -12px 0 0 4px;
    background: var(--ion-color-danger-tint);
  }
}

.dashboards-items {
  display: flex;
  justify-content: space-between;
}

.rating {
  &__container {
    display: flex;
    align-items: flex-end;
    font-family: "Yantramanav", serif;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
  }

  &-likes {
    color: var(--gold);
  }

  &-dislikes {
    color: var(--gold);
  }

  &-likes,
  &-dislikes {
    display: flex;
    align-items: center;
    gap: 2px;
  }
}

.like-icon,
.dislike-icon {
  font-size: 21px;
  margin:6px;
}

.trophy-icon {
  font-size: 18px;
  padding-right: 6px;
  padding-left: 4px;
  padding-bottom: 4px;
}

.activity-icon {
  font-size: 24px;
  padding-right: 4px;
}

.page-tabs {
  left: 0;
  right: 0;
  display: flex;
  z-index: 21000;
  position: relative;
  align-items: center;
  pointer-events: none;
  flex-direction: column;
  justify-content: center;
  --btn-min-width: 100px;
  padding: 12px 20px 12px 20px;
  margin-top: 40px;
}

.empty-block {
  margin-top: 48px;
}

.spinner {
  display: block;
  margin: 64px auto;
}

.event {
  font-size: 14px;
  line-height: 1.5;
  font-weight: 400;
  position: relative;
  --border-radius: 8px;
  --min-height: 73px;
  --padding-top: 13px;
  --padding-bottom: 13px;
  --padding-start: 16px;
  --padding-end: 16px;
  --background: var(--gray-700);

  &:not(:first-child) {
    margin-top: 16px;
  }

  &__photo {
    flex-shrink: 0;
    --size: 68px;
    font-size: 40px;
    font-weight: 700;
    line-height: 68px;
    text-align: center;
    width: var(--size);
    margin: 0 16px 0 0;
    height: var(--size);
    color: var(--gray-700);
    background: var(--gray-600);
    --border-radius: 8px;

    &--rounded {
      --border-radius: 50%;
    }
  }

  &__holder {
    min-height: 73px;
    width: calc(100% - 68px);

    .event--time-hidden & {
      display: flex;
      padding-top: 4px;
      padding-bottom: 4px;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    margin-bottom: 2px;
    max-width: calc(100% - 86px);
    color: var(--ion-color-white);

    .event--time-hidden & {
      max-width: none;
    }
  }

  &__date {
    display: block;
    margin-bottom: 2px;
  }

  &__time {
    position: absolute;
    display: flex;
    align-items: center;
    top: 0;
    right: 0;
    color: var(--ion-color-white);

    ion-icon {
      line-height: 1;
      font-size: 24px;
      color: var(--ion-color-primary);
    }
  }
}

.time-icon {
  font-size: 22px;
  padding-right: 4px;
}

.status-text {
  font: 12px/1 Lato;
  padding: 2px 8px 2px 8px;
  border-radius: 16px;
}

.ongoing {
  background-color: #e1dbc5;
  color: #19191b;
}

.finished {
  background: none;
  border: 1px #afafaf;
  color: #afafaf;
}

.activity-icon {
  font-family: Lato;
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: 0em;
  text-align: left;
}

.trophy-icon {
  font-family: Lato;
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: 0em;
  text-align: left;
}

.txt_sd{

  position: absolute;
  right:0;
  padding:0 !important;
}

.mob_tab{

  
}


@media only screen and (max-width: 900px){


  .item_cont_flex{

    display: block !important;
  }


  .mob_tab{

  margin:16px 0 !important;

  }
  

}
</style>