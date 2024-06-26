<template>
  <base-layout>
    <template #header>
      <page-header title="Dashboard">
        <template #avatar-field>
          <ion-avatar
            class="header__photo"
            @click="$router.push({ name: EntitiesEnum.Profile })"
          >
            <ion-img
              v-if="userStore.avatarUrl"
              :src="userStore.avatarUrl"
            ></ion-img>
            <template v-else>
              {{ userStore?.first_name?.charAt(0) }}
            </template>
          </ion-avatar>
        </template>
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
              <ion-icon src="assets/icon/activity.svg" class="activity-icon" />
              Activity
            </template>
          </dashboard-item>
          <dashboard-item :items="ratingItems">
            <template #title>
              <ion-icon src="assets/icon/trophy.svg" class="trophy-icon" />
              My Ratings
            </template>
            <template #bottom>
              <div class="rating__container">
                <ion-text class="rating-likes">
                  {{ widgetInfo?.positive_reviews_count || 0 }}
                  <ion-icon class="like-icon" src="assets/icon/like.svg" />
                </ion-text>
                <ion-text class="rating-dislikes">
                  {{ widgetInfo?.negative_reviews_count || 0 }}
                  <ion-icon
                    class="dislike-icon"
                    src="assets/icon/dislike-outline.svg"
                  />
                </ion-text>
              </div>
            </template>
          </dashboard-item>
        </div>
        <week-calendar
          v-model="selectedDate"
          :bookings="bookings"
          @handle-view="onViewCalendar"
          @handle-date-change="onDateChange"
        />
        <div class="events__container">
          <items-header
            :title="dynamicTitle"
            @handle-view="onViewAllEvents"
            :hide-view-more="
              selectedEvents?.length &&
              !isFacilitiesLoading &&
              !isTrainingsLoading &&
              !isEventsLoading &&
              !isDropinsLoading
            "
          />
          <ion-spinner
            name="lines"
            class="spinner"
            v-if="isTrainingsLoading || isEventsLoading || isFacilitiesLoading"
          >
          </ion-spinner>
          <template
            v-else-if="role === RoleEnum.User && selectedEvents?.length"
          >
            <UpcomingItem
              v-for="event in selectedEvents"
              :key="event.id"
              :item="event"
              :type-name="activeTab"
              :square-img="activeTab === EntitiesEnum.Trainings ? false : true"
              :role="RoleEnum.User"
              @click="openEvent(event.id)"
            />
          </template>
          <template
            v-else-if="
              selectedEvents?.length &&
              !isTrainingsLoading &&
              !isEventsLoading &&
              !isFacilitiesLoading &&
              !isDropinsLoading
            "
          >
            <event-item
              v-for="event in selectedEvents"
              :key="event.id"
              :item="event"
              :rounded="activeTab === EntitiesEnum.Trainings"
              :date-range="activeTab === EntitiesEnum.Facilities"
              @click="openEvent(event.id)"
            />
          </template>
          <empty-block
            v-else
            hide-button
            :icon="emptyIcon"
            :title="`Sorry, no ${bookingName} found`"
            :text="`Currently you have no booked ${bookingName}`"
          />
        </div>
        <PageTabsNew
          :tabs="tabs"
          class="page-tabs"
          :is-icon="true"
          :value="activeTab"
          @change="tabsChanged"
        />
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
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import DashboardItem from "@/general/components/DashboardItem.vue";
import {
  IonButton,
  IonIcon,
  IonText,
  IonSpinner,
  IonAvatar,
  IonImg,
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
  RoleEnum,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import EventItem from "@/general/components/EventItem.vue";
import ItemsHeader from "@/general/components/blocks/headers/ItemsHeader.vue";
import WeekCalendar from "@/general/components/blocks/calendar/WeekCalendar.vue";
import UpcomingItem from "@/general/components/dashboard/UpcomingItem.vue";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "vue-router";
import useId from "@/hooks/useId";
import { onValue } from "firebase/database";
import { chatsRef } from "@/firebase/db";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import { useUserStore } from "@/general/stores/user";
import useRoles from "@/hooks/useRole";

const router = useRouter();
const { id } = useId();
const unreadMessages = ref<number[]>([]);
const userStore = useUserStore();
const { role } = useRoles();
const selectedDate = ref<Dayjs | null>(dayjs());
const emptyIcon = ref("assets/icon/gym-user-icon.svg");

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
    start_date: {
      from: dayjs(selectedDate.value).format("YYYY-MM-DD HH:mm:ss"),
      to: dayjs(selectedDate.value).add(1, "M").format("YYYY-MM-DD HH:mm:ss"),
    },
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

const trainings = computed(() => trainingsResult?.value?.myTrainings?.data);

const dropins = computed(() => dropinsResult?.value?.myTrainings?.data);

const facilities = computed<UserPaginator["data"]>(
  () => facilitiesResult?.value?.myFacilityItemPasses?.data
  // ? facilitiesResult.value.myFacilityItemPasses.data.map(
  //     (facilityPass: FacilityItemPass) => ({
  //       id: facilityPass.id,
  //       title: facilityPass.facilityItem.facility.name,
  //       end_date: facilityPass.end_date,
  //       start_date: dayjs(facilityPass.end_date)
  //         .subtract(
  //           facilityPass.facilityItem.qr_code_lifetime_value ?? 0,
  //           "d"
  //         )
  //         .format("YYYY-MM-DD HH:mm:ss"),
  //       media: facilityPass.facilityItem.facility.media,
  //       address: facilityPass.facilityItem.facility.address,
  //     })
  //   )
  // : []
);

const selectedEvents = computed(() => {
  if (activeTab.value === EntitiesEnum.Events) {
    return events.value;
  }

  if (activeTab.value === EntitiesEnum.Facilities) {
    return facilities.value;
  }

  if (activeTab.value === EntitiesEnum.FacilityDropins) {
    return [];
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

  if (activeTab.value === EntitiesEnum.FacilityDropins) {
    return "drop-ins";
  }

  return "trainings";
});

const tabs: TabItemNew[] = [
  {
    name: EntitiesEnum.Facilities,
    labelActive: "assets/icon/gym-user-icon.svg",
    labelInactive: "assets/icon/gym-user-icon.svg",
  },
  {
    name: EntitiesEnum.FacilityDropins,
    labelActive: "assets/icon/facilities.svg",
    labelInactive: "assets/icon/facilities.svg",
  },
  {
    name: EntitiesEnum.Trainings,
    labelActive: "assets/trainers.svg",
    labelInactive: "assets/trainers.svg",
  },
  {
    name: EntitiesEnum.Events,
    labelActive: "assets/icon/events.svg",
    labelInactive: "assets/icon/events.svg",
  },
];

const activeTab = ref<EntitiesEnum>(
  (localStorage.getItem("dashboard_active_tab") as EntitiesEnum) ||
    EntitiesEnum.FacilityDropins
);

const tabsChanged = (ev: EntitiesEnum) => {
  if (!ev) return;
  activeTab.value = ev;
  localStorage.setItem("dashboard_active_tab", activeTab.value);
  onDateChange();
};

const refetchBooking = () => {
  switch (activeTab.value) {
    case EntitiesEnum.Events:
      emptyIcon.value = "assets/icon/events.svg";
      refetchEvents();
      break;

    case EntitiesEnum.FacilityDropins:
      emptyIcon.value = "assets/icon/facilities.svg";
      refetchDropins();
      break;

    case EntitiesEnum.Trainings:
      emptyIcon.value = "assets/trainers.svg";
      refetchTrainings();
      break;

    case EntitiesEnum.Facilities:
      emptyIcon.value = "assets/icon/gym-user-icon.svg";
      refetchFacilities();
      break;

    default:
      break;
  }
};

const onDateChange = () => {
  switch (activeTab.value) {
    case EntitiesEnum.Events:
      refetchEvents({
        page: 1,
        first: 4,
        start_date: {
          from: dayjs(selectedDate.value).format("YYYY-MM-DD HH:mm:ss"),
          to: dayjs(selectedDate.value)
            .add(1, "M")
            .format("YYYY-MM-DD HH:mm:ss"),
        },
        orderBy: [
          {
            column: QueryMyEventsOrderByColumn.StartDate,
            order: SortOrder.Asc,
          },
        ],
      });
      break;

    case EntitiesEnum.FacilityDropins:
      refetchDropins({
        page: 1,
        first: 4,
        start_date: {
          from: dayjs(selectedDate.value).format("YYYY-MM-DD HH:mm:ss"),
          to: dayjs(selectedDate.value)
            .add(1, "M")
            .format("YYYY-MM-DD HH:mm:ss"),
        },
        orderBy: [
          {
            column: QueryMyTrainingsOrderByColumn.StartDate,
            order: SortOrder.Asc,
          },
        ],
      });
      break;

    case EntitiesEnum.Trainings:
      refetchTrainings({
        page: 1,
        first: 4,
        start_date: {
          from: dayjs(selectedDate.value).format("YYYY-MM-DD HH:mm:ss"),
          to: dayjs(selectedDate.value)
            .add(1, "M")
            .format("YYYY-MM-DD HH:mm:ss"),
        },
        orderBy: [
          {
            column: QueryMyTrainingsOrderByColumn.StartDate,
            order: SortOrder.Asc,
          },
        ],
      });
      break;

    case EntitiesEnum.Facilities:
      refetchFacilities({
        page: 1,
        first: 4,
        start_date: {
          from: dayjs(selectedDate.value).format("YYYY-MM-DD HH:mm:ss"),
          to: dayjs(selectedDate.value)
            .add(1, "M")
            .format("YYYY-MM-DD HH:mm:ss"),
        },
        orderBy: [
          {
            column: QueryMyFacilityItemPassesOrderByColumn.StartDate,
            order: SortOrder.Asc,
          },
        ],
      });
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
      console.log("in defualt");

      return router.push({
        name: EntitiesEnum.BookedTraining,
        params: { id },
        query: {
          type: EntitiesEnum.FacilityDropins,
        },
      });
  }
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
    color: var(--ion-color-success-tint);
  }

  &-dislikes {
    color: var(--ion-color-danger-tint);
  }

  &-likes,
  &-dislikes {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 24px;
    color: var(--gold);
  }
}

.like-icon,
.dislike-icon {
  font-size: 24px;
}

.trophy-icon {
  font-size: 18px;
  padding-right: 6px;
  padding-left: 4px;
  padding-bottom: 4px;
  color: #dbb582;
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
  position: fixed;
  align-items: center;
  pointer-events: none;
  flex-direction: column;
  justify-content: center;
  bottom: calc(84px + var(--ion-safe-area-bottom));
  --btn-min-width: 88px;
  padding: 12px 20px 12px 20px;
}

.empty-block {
  margin-top: 48px;
}

.spinner {
  display: block;
  margin: 64px auto;
}

.header__photo {
  min-width: 26px;
  min-height: 26px;
  max-width: 26px;
  max-height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: capitalize;
  font-family: "Yantramanav";
  font-weight: 600;
  background: var(--gray-700);
  font-size: 15px;
}
</style>
