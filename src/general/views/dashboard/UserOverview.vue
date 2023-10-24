<template>
  <div class="user-overview">
    <WebHeader
      class="padding-10"
      :backBtn="false"
      :gold-title="true"
      title="Dashboard"
    />

    <div class="activity-container">
      <DashboardItem :is-web="true" :items="activityItems">
        <template #title>
          <ion-icon src="assets/icon/activity.svg" class="title-icon" />
          Activity
        </template>
      </DashboardItem>
      <DashboardItem :is-web="true" :items="ratingItems">
        <template #title>
          <ion-icon
            src="assets/icon/trophy.svg"
            class="title-icon tropy-icon"
          />
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
      </DashboardItem>
    </div>
    <week-calendar
      v-model="selectedDate"
      :role="RoleEnum.User"
      :bookings="bookings"
      @handle-view="onViewCalendar"
      @handle-date-change="onDateChange"
    />
    <PageTabsNew
      :tabs="tabs"
      :is-web="true"
      :is-icon="true"
      :value="activeTab"
      @change="tabsChanged"
    />

    <div class="events-container">
      <ItemsHeader
        :title="dynamicTitle"
        :role="RoleEnum.User"
        :hide-view-more="
          selectedEvents?.length &&
          !isFacilitiesLoading &&
          !isTrainingsLoading &&
          !isEventsLoading &&
          !isDropinsLoading
        "
        @handle-view="viewAllItems"
      />
      <IonSpinner
        class="spinner"
        name="lines"
        v-if="
          isEventsLoading ||
          isTrainingsLoading ||
          isDropinsLoading ||
          isFacilitiesLoading
        "
      />
      <div class="item-container" v-else-if="selectedEvents?.length">
        <UpcomingItem
          v-for="event in selectedEvents"
          :key="event.id"
          :item="event"
          :type-name="activeTab"
          :square-img="activeTab === EntitiesEnum.Trainings ? false : true"
          :role="RoleEnum.User"
          @click="onViewCalendar(event, activeTab)"
        />
      </div>
      <EmptyBlock
        v-else
        hide-button
        :icon="emptyIcon"
        :title="`Sorry, no ${bookingName} found`"
        :text="`Currently you have no booked ${bookingName}`"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { EntitiesEnum } from "@/const/entities";
import { computed, onMounted, ref } from "vue";
import { IonText, IonIcon, IonSpinner } from "@ionic/vue";
import PageTabsNew from "@/general/components/PageTabsNew.vue";
import DashboardItem from "@/general/components/DashboardItem.vue";
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
import ItemsHeader from "@/general/components/blocks/headers/ItemsHeader.vue";
import WeekCalendar from "@/general/components/blocks/calendar/WeekCalendar.vue";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "vue-router";
import useId from "@/hooks/useId";
import { onValue } from "firebase/database";
import { chatsRef } from "@/firebase/db";
import UpcomingItem from "@/general/components/dashboard/UpcomingItem.vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import WebHeader from "@/general/components/blocks/headers/WebHeader.vue";
import { TabItemNew } from "@/interfaces/TabItemnew";

const router = useRouter();
const { id } = useId();
const unreadMessages = ref<number[]>([]);
const selectedDate = ref<Dayjs | null>(dayjs());
const emptyIcon = ref("assets/icon/gym-user-icon.svg");

var date = new Date();
date;
date.setDate(date.getDate() + 5);
date;

const {
  result: eventsResult,
  loading: isEventsLoading,
  refetch: refetchEvents,
  onResult: neweventsResult,
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

// const {
//   result: dropinsResult,
//   loading: isDropinsLoading,
//   refetch: refetchDropins,
// } = useQuery(
//   MyTrainingsDocument,
//   {
//     page: 1,
//     first: 4,
//     start_date: {
//       from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
//       to: dayjs().add(1, "M").format("YYYY-MM-DD HH:mm:ss"),
//     },
//     orderBy: [
//       {
//         column: QueryMyTrainingsOrderByColumn.StartDate,
//         order: SortOrder.Asc,
//       },
//     ],
//   },
//   {
//     fetchPolicy: "no-cache",
//   }
// );

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
      from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      to: dayjs().add(1, "M").format("YYYY-MM-DD HH:mm:ss"),
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
  console.log(localStorage.getItem("dashboard_active_tab"));

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

// const dropins = computed(() =>
//   dropinsResult?.value?.myTrainings?.data
//     ? trainingsResult.value.myTrainings.data.map((training: Training) => ({
//         ...training,
//         title: `${training.trainer.first_name} ${training.trainer.last_name}`,
//         address: training.trainer.address,
//         media: [{ pathUrl: training.trainer.avatarUrl }],
//       }))
//     : []
// );

const dropins = computed<UserPaginator["data"]>(() =>
  facilitiesResult?.value?.myFacilityItemPasses?.data
    ? facilitiesResult.value.myFacilityItemPasses.data.filter((item: FacilityItemPass) => item?.facilityItem?.item_type === "DROPIN")
    : []
);

const facilities = computed<UserPaginator["data"]>(() =>
  facilitiesResult?.value?.myFacilityItemPasses?.data
    ? facilitiesResult.value.myFacilityItemPasses.data.filter((item: FacilityItemPass) => item?.facilityItem?.item_type === "PASS")
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
    return "passes";
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
    EntitiesEnum.Facilities
);

const tabsChanged = (ev: EntitiesEnum) => {
  if (!ev) return;
  activeTab.value = ev;
  localStorage.setItem("dashboard_active_tab", activeTab.value);
  onDateChange();
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

const viewAllItems = (e: any) => {
  router.push({
    name: EntitiesEnum.Upcoming,
    params: {
      type: activeTab.value,
    },
  });
};
const onViewCalendar = (data: any, type?: string) => {
  router.push({
    name: EntitiesEnum.DashboardUserCalendar,
    params: {
      type,
      id: data?.id,
    },
  });
};
</script>
<style scoped lang="scss">
.user-overview {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 20px 35px 35px 60px;

  .activity-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    .title-icon {
      font-size: 24px;
    }

    .tropy-icon {
      margin-right: 5px;
    }

    .rating__container {
      display: flex;
      gap: 6px;
      ion-icon {
        font-size: 24px;
        color: var(--gold);
      }
      .rating-likes,
      .rating-dislikes {
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Yantramanav;
        font-size: 20px;
        font-weight: 500;
      }
    }
  }

  .item-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-column-gap: 16px;
    grid-row-gap: 6px;
  }

  .padding-10 {
    padding-bottom: 20px;
  }
}

.spinner {
  display: block;
  margin: 80px auto;
}
</style>
