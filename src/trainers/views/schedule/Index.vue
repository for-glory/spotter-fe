<template>
  <base-layout>
    <template #header>
      <page-header title="Schedule" />
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
              Rating
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
                    src="assets/icon/dislike.svg"
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
        />
        <div class="events__container">
          <items-header
            :title="`Upcoming ${
              activeTab === EntitiesEnum.Events ? 'events' : 'trainings'
            }`"
            @handle-view="onViewAllEvents"
            :hide-view-more="
              trainingsLoading ||
              eventsLoading ||
              (activeTab === EntitiesEnum.Trainings && !trainings?.length) ||
              (activeTab === EntitiesEnum.Events && !events?.length)
            "
          />
          <ion-spinner
            name="lines"
            class="spinner"
            v-if="
              (activeTab === EntitiesEnum.Trainings && trainingsLoading) ||
              (activeTab === EntitiesEnum.Events && eventsLoading)
            "
          />
          <empty-block
            hide-button
            icon="assets/icon/empty.svg"
            v-else-if="
              (activeTab === EntitiesEnum.Trainings && !trainings.length) ||
              (activeTab === EntitiesEnum.Events && !events.length)
            "
            :title="`Sorry, no ${activityName} found`"
            :text="`Currently you have no booked ${activityName}`"
          />
          <template v-else>
            <template v-if="activeTab === EntitiesEnum.Trainings">
              <event-item
                v-for="training in trainings"
                :key="training.id"
                :item="training"
                rounded
                @click="
                  openTraining(training.id, training.state, training.userId)
                "
              />
            </template>
            <template v-if="activeTab === EntitiesEnum.Events">
              <event-item
                v-for="event in events"
                :key="event.id"
                :item="event"
                @click="openEvent(event.id)"
              />
            </template>
          </template>
        </div>
        <page-tabs
          :tabs="tabs"
          class="page-tabs"
          :value="activeTab"
          @change="tabsChanged"
        />
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import DashboardItem from "@/general/components/DashboardItem.vue";
import { IonIcon, IonText, IonSpinner } from "@ionic/vue";
import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "@/const/entities";
import { computed, ref } from "vue";
import PageTabs from "@/general/components/PageTabs.vue";
import {
  EventPaginator,
  EventsDocument,
  TrainerTrainingsDocument,
  Training,
  DashboardWidgetDocument,
  UserAvailabilityDocument,
  QueryEventsOrderByColumn,
  SortOrder,
  QueryTrainerTrainingsOrderByColumn,
  TrainingStatesEnum,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import EventItem from "@/general/components/EventItem.vue";
import ItemsHeader from "@/general/components/blocks/headers/ItemsHeader.vue";
import WeekCalendar from "@/general/components/blocks/calendar/WeekCalendar.vue";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "vue-router";
import { scheduleTabs } from "@/const/tabs";
import useId from "@/hooks/useId";
import EmptyBlock from "@/general/components/EmptyBlock.vue";

const router = useRouter();
const { id } = useId();

const {
  result: eventsResult,
  loading: eventsLoading,
  refetch: updateEvents,
} = useQuery(
  EventsDocument,
  {
    page: 0,
    first: 4,
    created_by_trainer: id,
    start_date: {
      from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      to: dayjs().add(1, "M").format("YYYY-MM-DD HH:mm:ss"),
    },
    orderBy: [
      {
        column: QueryEventsOrderByColumn.StartDate,
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
  loading: trainingsLoading,
  refetch: updateTrainings,
} = useQuery(
  TrainerTrainingsDocument,
  {
    page: 0,
    first: 4,
    filters: {
      start_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      states: [TrainingStatesEnum.Accepted, TrainingStatesEnum.Started],
    },
    orderBy: [
      {
        column: QueryTrainerTrainingsOrderByColumn.StartDate,
        order: SortOrder.Asc,
      },
    ],
  },
  {
    fetchPolicy: "no-cache",
  }
);

// Dashboard widgets - Activity + My Ratings widgets info
const { result: dashboardWidgetResult } = useQuery(
  DashboardWidgetDocument,
  {},
  {
    fetchPolicy: "no-cache",
  }
);

const widgetInfo = computed(() => dashboardWidgetResult?.value?.me || []);

const activityItems = computed(() => [
  {
    value: `+$${
      widgetInfo?.value?.trainer_dashboard_stats?.earn_last_thirty_days || 0
    }`,
    description: "last 30 days",
  },
  {
    value: `+$${widgetInfo?.value?.trainer_dashboard_stats?.total_earn || 0}`,
    description: "total earnings",
  },
  {
    value: `${widgetInfo?.value?.trainer_dashboard_stats?.total_bookings || 0}`,
    description: "total bookings",
  },
]);

const ratingItems = computed(() => [
  {
    value: widgetInfo?.value?.reviews_count || 0,
    description: "total feedbacks",
  },
  {
    value: `${
      (widgetInfo?.value?.positive_reviews_count * 5) /
        widgetInfo?.value?.reviews_count || 0
    } / 5`,
    description: "general rating",
  },
]);

const { result: calendarWidgetResult } = useQuery(
  UserAvailabilityDocument,
  {
    id,
    from: dayjs().startOf("w").format("YYYY-MM-DD HH:mm:ss"),
    to: dayjs().endOf("w").format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    fetchPolicy: "no-cache",
  }
);

const events = computed<EventPaginator["data"]>(() =>
  eventsResult?.value?.events?.data ? eventsResult.value.events.data : []
);

const trainings = computed(() =>
  trainingsResult?.value?.trainerTrainings?.data
    ? trainingsResult.value.trainerTrainings.data.map((training: Training) => ({
        id: training.id,
        title: `${training.user.first_name} ${training.user.last_name}`,
        address: {
          street: training.user.address?.street,
        },
        media: training.user.media,
        start_date: training.start_date,
        state: training.state,
        userId: training.user.id,
      }))
    : []
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

const tabs: TabItem[] = scheduleTabs;

const selectedDate = ref<Dayjs | null>(null);
const activeTab = ref<EntitiesEnum>(
  (localStorage.getItem("trainer_schedule_active_tab") as EntitiesEnum) ??
    EntitiesEnum.Trainings
);

const tabsChanged = (ev: EntitiesEnum) => {
  if (ev) activeTab.value = ev;
  localStorage.setItem("trainer_schedule_active_tab", activeTab.value);
  if (activeTab.value === EntitiesEnum.Events) {
    updateEvents();
  } else {
    updateTrainings();
  }
};

const activityName = computed(() => {
  if (activeTab.value === EntitiesEnum.Events) {
    return "events";
  }

  return "trainings";
});

const onViewAllEvents = () => {
  router.push({ name: EntitiesEnum.TrainersUpcomingTrainings });
};

const onViewCalendar = () => {
  router.push({ name: EntitiesEnum.TrainerScheduleCalendar });
};

const openTraining = (
  id: number,
  state?: TrainingStatesEnum,
  userId?: string
) => {
  if (state === TrainingStatesEnum.Started) {
    return router.push({
      name: EntitiesEnum.Session,
      params: {
        id,
      },
      query: {
        userId,
        type: EntitiesEnum.Training,
      },
    });
  }

  router.push({
    name: EntitiesEnum.Training,
    params: {
      id,
    },
  });
};

const openEvent = (id: string) => {
  router.push({
    name: EntitiesEnum.TrainersEventTraining,
    params: {
      id,
    },
  });
};
</script>

<style scoped lang="scss">
.dashboard {
  padding: 24px 16px 64px;

  &__navigation {
    width: 16vw;
    display: flex;
    align-items: flex-end;
    font-size: 18px;
    color: var(white);
    gap: 25px;
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
}

.activity-icon {
  font-size: 24px;
  margin-right: 4px;
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
  --btn-min-width: 105px;
}

.chat-icon {
  font-size: 20px;
}

.empty-block {
  margin-top: 48px;
}

.spinner {
  display: block;
  margin: 64px auto;
}
</style>
