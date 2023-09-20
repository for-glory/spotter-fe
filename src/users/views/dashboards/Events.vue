<template>
  <base-layout>
    <template #header>
      <page-header :title="dynamicTitle" back-btn @back="onBack" />
    </template>
    <template #content>
      <div class="events__container">
        <template v-if="selectedEvents &&
          selectedEvents.length &&
          !isTrainingsLoading &&
          !isEventsLoading &&
          !isFacilitiesLoading
          ">
          <event-item v-for="event in selectedEvents" :key="event.id" :item="event"
            :rounded="activeTab === EntitiesEnum.Trainings" @click="openEvent(event.id)" />
        </template>
        <ion-spinner name="lines" class="spinner" v-else-if="isTrainingsLoading || isEventsLoading || isFacilitiesLoading
          ">
        </ion-spinner>
        <empty-block v-else hide-button icon="assets/icon/empty.svg" :title="`Sorry, no ${bookingName} found`"
          :text="`Currently you have no booked ${bookingName}`" />
        <ion-infinite-scroll threshold="100px" class="infinite-scroll" @ionInfinite="loadData" v-if="(activeTab === EntitiesEnum.Facilities &&
            facilities &&
            facilities?.length < totalFacilities) ||
          (activeTab === EntitiesEnum.Trainings &&
            trainings &&
            trainings?.length < totalTrainings) ||
          (activeTab === EntitiesEnum.Events &&
            events &&
            events?.length < totalEvents)
          ">
          <ion-infinite-scroll-content loading-spinner="lines" loading-text="Loading more data...">
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </div>
      <page-tabs :tabs="tabs" class="page-tabs" :value="activeTab" @change="tabsChanged" />
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import PageTabs from "@/general/components/PageTabs.vue";
import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "@/const/entities";
import { computed, ref } from "vue";
import EventItem from "@/general/components/EventItem.vue";
import { useQuery } from "@vue/apollo-composable";
import {
  FacilityItemPass,
  MyEventsDocument,
  MyFacilityItemPassesDocument,
  MyTrainingsDocument,
  QueryMyEventsOrderByColumn,
  QueryMyFacilityItemPassesOrderByColumn,
  QueryMyTrainingsOrderByColumn,
  SortOrder,
  Training,
  Event,
} from "@/generated/graphql";
import { useRouter } from "vue-router";
import {
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from "@ionic/vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import dayjs from "dayjs";

const router = useRouter();

const tabs: TabItem[] = [
  {
    name: EntitiesEnum.Facilities,
    label: "assets/icon/dumbbellActive.png",
  },
  {
    name: EntitiesEnum.FacilityDropins,
    label: "assets/icon/dropins.png",
  },
  {
    name: EntitiesEnum.Trainings,
    label: "assets/icon/Trainer.png",
  },
  {
    name: EntitiesEnum.Events,
    label: "assets/icon/facilities.png",
  },
];

const activePage = ref<number>(1);

const {
  result: facilitiesResult,
  loading: isFacilitiesLoading,
  refetch: refetchFacilities,
  onResult: gotFacilities,
} = useQuery(
  MyFacilityItemPassesDocument,
  {
    page: activePage.value,
    first: 6,
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

const {
  result: trainingsResult,
  loading: isTrainingsLoading,
  refetch: refetchTrainings,
  onResult: gotTrainings,
} = useQuery(
  MyTrainingsDocument,
  {
    page: activePage.value,
    first: 6,
    start_date: {
      from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      to: dayjs().add(1, "y").format("YYYY-MM-DD HH:mm:ss"),
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
  result: eventsResult,
  loading: isEventsLoading,
  refetch: refetchEvents,
  onResult: gotEvents,
} = useQuery(
  MyEventsDocument,
  {
    page: activePage.value,
    first: 6,
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

const totalFacilities = computed<number>(
  () => facilitiesResult?.value?.myFacilityItemPasses?.paginatorInfo?.total ?? 0
);
const totalTrainings = computed<number>(
  () => trainingsResult?.value?.trainerTrainings?.paginatorInfo?.total ?? 0
);
const totalEvents = computed<number>(
  () => eventsResult?.value?.events?.paginatorInfo?.total ?? 0
);

const facilities = ref<Event[]>();
const trainings = ref<Event[]>();
const events = ref<Event[]>();

gotFacilities((response) => {
  const newFacilities =
    response.data?.myFacilityItemPasses?.data?.map(
      (facilityPass: FacilityItemPass) => ({
        id: facilityPass.id,
        title: facilityPass.facilityItem.facility.name,
        end_date: facilityPass.end_date,
        start_date: dayjs(facilityPass.end_date)
          .subtract(facilityPass.facilityItem.qr_code_lifetime_value ?? 0, "d")
          .format("YYYY-MM-DD HH:mm:ss"),
        media: facilityPass.facilityItem.facility.media,
        address: facilityPass.facilityItem.facility.address,
      })
    ) ?? [];

  if (!facilities.value?.length) {
    facilities.value = newFacilities;
  } else if (
    facilities.value.findIndex(
      (training) => training.id === newFacilities[0].id
    ) === -1
  ) {
    facilities.value = [...facilities.value, ...newFacilities];
  }
});

gotTrainings((response) => {
  const newTrainings =
    response.data?.myTrainings?.data?.map((training: Training) => ({
      ...training,
      title: `${training.trainer.first_name} ${training.trainer.last_name}`,
      address: training.trainer.address,
      media: [{ pathUrl: training.trainer.avatarUrl }],
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
  const newEvents = response?.data?.myEvents?.data ?? [];

  if (!events.value?.length) {
    events.value = newEvents;
  } else if (
    events.value.findIndex((training) => training.id === newEvents[0].id) === -1
  ) {
    events.value = [...events.value, ...newEvents];
  }
});

const activeTab = ref<EntitiesEnum>(
  (localStorage.getItem("dashboard_active_tab") as EntitiesEnum) ||
  EntitiesEnum.Facilities
);

const selectedEvents = computed(() => {
  switch (activeTab.value) {
    case EntitiesEnum.Trainings:
      return trainings.value;

    case EntitiesEnum.Events:
      return events.value;

    default:
      return facilities.value;
  }
});

const dynamicTitle = computed(() => {
  if (activeTab.value === EntitiesEnum.Events) {

    return 'Upcoming Events';
  }

  if (activeTab.value === EntitiesEnum.Facilities) {
    return 'My Passes';
  }

  if (activeTab.value === EntitiesEnum.FacilityDropins) {
    return 'My Drop-ins';
  }

  return 'Upcoming Trainings';
});


const tabsChanged = (ev: EntitiesEnum) => {
  if (!ev) return;
  activeTab.value = ev;
  localStorage.setItem("dashboard_active_tab", activeTab.value);
  activePage.value = 1;
  facilities.value = [];
  trainings.value = [];
  events.value = [];

  updateBookings();
};

const onBack = () => {
  router.go(-1);
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
    await updateBookings();
    ev.target.complete();
  }
};

const updateBookings = async () => {
  return new Promise((resolve, reject) => {
    switch (activeTab.value) {
      case EntitiesEnum.Facilities:
        refetchFacilities({
          page: activePage.value,
          first: 6,
          orderBy: [
            {
              column: QueryMyFacilityItemPassesOrderByColumn.StartDate,
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
        break;

      case EntitiesEnum.Trainings:
        refetchTrainings({
          page: activePage.value,
          first: 6,
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
        })
          ?.then(() => {
            resolve(true);
          })
          .catch((err) => {
            console.log("err:", err);
            reject();
          });
        break;

      case EntitiesEnum.Events:
        refetchEvents({
          page: activePage.value,
          first: 6,
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
        })
          ?.then(() => {
            resolve(true);
          })
          .catch((err) => {
            console.log("err:", err);
            reject();
          });
        break;

      default:
        break;
    }
  });
};

const bookingName = computed(() => {
  switch (activeTab.value) {
    case EntitiesEnum.Trainings:
      return "trainings";

    case EntitiesEnum.Events:
      return "events";

    default:
      return "gyms";
  }
});
</script>

<style lang="scss" scoped>
.events {
  &__container {
    padding: 24px 16px 78px;
  }
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
  --btn-min-width: 100px;
}

.empty-block {
  margin: 48px 0;
}

.spinner {
  display: block;
  margin: 64px auto;
}

.trainer-item {
  margin-left: -16px;
  margin-right: -16px;
}
</style>
