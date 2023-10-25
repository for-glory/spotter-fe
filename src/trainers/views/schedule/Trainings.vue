<template>
  <base-layout>
    <template #header>
      <page-header
        back-btn
        :title="`Upcoming ${activityName}`"
        @back="onBack"
      />
    </template>
    <template #content>
      <div class="dashboard">
        <ion-spinner
          name="lines"
          class="spinner"
          v-if="
            (activeTab === EntitiesEnum.Trainings &&
              !trainings?.length &&
              trainingsLoading) ||
            (activeTab === EntitiesEnum.Events &&
              !events?.length &&
              eventsLoading)
          "
        />
        <empty-block
          hide-button
          icon="assets/icon/empty.svg"
          v-else-if="role !== RoleEnum.Trainer &&
            (activeTab === EntitiesEnum.Trainings &&
              trainings &&
              !trainings.length) ||
            (role !== RoleEnum.Trainer && activeTab === EntitiesEnum.Events && events && !events.length)
          "
          :title="`Sorry, no ${activityName} found`"
          :text="`Currently you have no booked ${activityName}`"
        />
        <template v-else>
          <template v-if="role !== RoleEnum.Trainer && activeTab === EntitiesEnum.Trainings">
            <event-item
              v-for="training in trainings"
              :key="training.id"
              :item="training"
              class="trainer-event-item"
              rounded
              @click="openTraining(training.id)"
            />
          </template>
          <template v-if="role === RoleEnum.Trainer && activeTab === EntitiesEnum.Trainings">
            <event-item
              v-for="training in trainings"
              :key="training.id"
              :item="training"
              rounded
              @click="openTraining(training.id)"
            />
          </template>
          <template v-if="role !== RoleEnum.Trainer && activeTab === EntitiesEnum.Events">
            <event-item
              v-for="event in events"
              :key="event.id"
              :item="event"
              @click="openEvent(event.id)"
            />
          </template>

          <template v-if="role === RoleEnum.Trainer && activeTab === EntitiesEnum.Events">
            <upcoming-item
              v-for="event in events"
              :key="event.id"
              :img-src="event.media"
              :title="event.title"
              :subtitle="event.subTitle"
              :location="event.address.street"
              :time="'08:30 AM'"
              :square-img="true"
              is-upcomming
              is-short-time
              :upcoming-type="event.type"
            />
          </template>
        </template>
        <ion-infinite-scroll
          threshold="100px"
          class="infinite-scroll"
          @ionInfinite="loadData"
          v-if="
            (activeTab === EntitiesEnum.Trainings &&
              trainings &&
              trainings?.length < totalTrainings) ||
            (activeTab === EntitiesEnum.Events &&
              events &&
              events?.length < totalEvents)
          "
        >
          <ion-infinite-scroll-content
            loading-spinner="lines"
            loading-text="Loading more data..."
          >
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
        <!-- <page-tabs
        <page-tabs v-if="!fromOverview"
          :tabs="tabs"
          class="page-tabs"
          :value="activeTab"
          @change="tabsChanged"
        /> -->
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "@/const/entities";
import { computed, ref } from "vue";
import PageTabs from "@/general/components/PageTabs.vue";
import {
  EventsDocument,
  TrainerTrainingsDocument,
  Training,
  Event,
  SortOrder,
  QueryEventsOrderByColumn,
  QueryTrainerTrainingsOrderByColumn,
  TrainingStatesEnum,
RoleEnum,
EventPaginator,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import EventItem from "@/general/components/EventItem.vue";
import { useRouter } from "vue-router";
import { scheduleTabs } from "@/const/tabs";
import useId from "@/hooks/useId";
import {
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from "@ionic/vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";
import UpcomingItem from "@/general/components/dashboard/UpcomingItem.vue";

const router = useRouter();
const { role } = useRoles();

const fromOverview = ref(history.state?.fromOverview ? history.state?.fromOverview : false);

const onBack = () => {
  router.go(-1);
};

const { id } = useId();

const activePage = ref<number>(1);

const {
  result: eventsResult,
  loading: eventsLoading,
  refetch: updateEvents,
  onResult: gotEvents,
} = useQuery(
  EventsDocument,
  {
    page: activePage.value,
    first: 6,
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
  onResult: gotTrainings,
} = useQuery(
  TrainerTrainingsDocument,
  {
    page: activePage.value,
    first: 6,
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

const totalTrainings = computed<number>(
  () => trainingsResult?.value?.trainerTrainings?.paginatorInfo?.total ?? 0
);
const totalEvents = computed<number>(
  () => eventsResult?.value?.events?.paginatorInfo?.total ?? 0
);
const events = ref<Event[]>();
const trainings = ref<Event[]>();

// const events = computed<EventPaginator["data"]>(() =>
//   eventsResult?.value?.events?.data ? eventsResult.value.events.data : []
// );

// const trainings = computed(() =>
//     trainingsResult?.value?.trainerTrainings?.data
//         ?
//         trainingsResult.value.trainerTrainings.data.map((training: Training) => ({
//             id: training.id,
//             title: `${training.user.first_name} ${training.user.last_name}`,
//             address: {
//               street: training.user.address?.street,
//             },
//             media: training.user.media,
//             start_date: training.start_date,
//             state: training.state,
//             userId: training.user.id,
//           }))
//         : []
// );

gotTrainings((response) => {
  const newTrainings =
    response.data?.trainerTrainings?.data?.map((training: Training) => ({
      id: training.id,
      title: `${training.user.first_name} ${training.user.last_name}`,
      address: training.trainer.facilities?.length
        ? training.trainer.facilities[0]?.address
        : "",
      media: training.user.media?.length ? training.user.media : [{pathUrl:training.user.avatarUrl}],
      start_date: training.start_date,
    })) ?? [];

  if (!trainings.value?.length) {
    trainings.value = newTrainings;
  } else if (
    trainings.value.findIndex(
      (training) => training.id === newTrainings[0].id
    ) === -1
  ) {
    trainings.value = [...trainings.value, ...newTrainings];
  }
});

gotEvents((response) => {
  const newEvents = response?.data?.events?.data ?? [];

  if (!events.value?.length) {
    events.value = newEvents;
  } else if (
    events.value.findIndex((training) => training.id === newEvents[0].id) === -1
  ) {
    events.value = [...events.value, ...newEvents];
  }
});

const tabs: TabItem[] = scheduleTabs;

const activeTab = ref<EntitiesEnum>(
  (localStorage.getItem("trainer_schedule_active_tab") as EntitiesEnum) ??
    EntitiesEnum.Trainings
);
console.log("activeTab.value", activeTab.value);


const tabsChanged = (ev: EntitiesEnum) => {
  if (ev) activeTab.value = ev;
  activePage.value = 1;
  // trainings.value = [];
  // events.value = [];
  localStorage.setItem("trainer_schedule_active_tab", activeTab.value);

  updateActivities();
};

const activityName = computed(() => {
  if (activeTab.value === EntitiesEnum.Events) {
    return "Events";
  }

  return "Trainings";
});

const openTraining = (id: string) => {
  router.push({
    name: EntitiesEnum.Training,
    params: {
      id,
    },
  });
};

const openEvent = (eventId: string) => {
  router.push({
    name: EntitiesEnum.TrainersEventTraining,
    params: {
      id: eventId,
    },
  });
};

const loadData = async (ev: InfiniteScrollCustomEvent) => {
  if (
    (activeTab.value === EntitiesEnum.Trainings &&
      trainings.value &&
      trainings.value.length < totalTrainings.value) ||
    (activeTab.value === EntitiesEnum.Events &&
      events.value &&
      events.value.length < totalTrainings.value)
  ) {
    activePage.value++;
    await updateActivities();
    ev.target.complete();
  }
};

const updateActivities = async () => {
  return new Promise((resolve, reject) => {
    if (activeTab.value === EntitiesEnum.Events) {
      updateEvents({
        first: 6,
        page: activePage.value,
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
      })
        ?.then(() => {
          resolve(true);
        })
        .catch((err) => {
          console.log("err:", err);
          reject();
        });
    } else {
      updateTrainings({
        first: 6,
        page: activePage.value,
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
      })
        ?.then(() => {
          resolve(true);
        })
        .catch((err) => {
          console.log("err:", err);
          reject();
        });
    }
  });
};
</script>

<style scoped lang="scss">
.dashboard {
  padding: 24px 16px 64px;
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

.empty-block {
  margin-top: 48px;
}

.spinner {
  display: block;
  margin: 64px auto;
}

.infinite-scroll {
  margin-top: 16px;
  margin-bottom: -24px;
}
</style>
