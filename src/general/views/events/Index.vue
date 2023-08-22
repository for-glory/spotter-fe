<template>
  <base-layout>
    <template #header>
      <div class="banner">
        <ion-title class="banner__title">Create events for clients and trainers</ion-title>
        <ion-text class="banner__text">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod 
        </ion-text>
        <div class="banner__background-image">
          <img src="assets/backgrounds/Banner_2.png" alt="">
        </div>
      </div>
      <div class="filter-list" v-if="events.length">
        <div class="d-flex justify-content-between filter-list__top">
          <div class="filter-tabs d-flex align-items-center justify-content-between">
            <ion-button 
              :fill="filter === 'all' ? 'solid' : 'outline'"
              :color="filter === 'all' ? '' : 'medium'"
              @click="handleChangeFilter('all')"
            >
              All
            </ion-button>
            <ion-button
              :fill="filter === 'ongoing' ? 'solid' : 'outline'"
              :color="filter === 'ongoing' ? '' : 'medium'"
              @click="handleChangeFilter('ongoing')"
            >
              Ongoing
            </ion-button>
            <ion-button
              :fill="filter === 'finished' ? 'solid' : 'outline'"
              :color="filter === 'finished' ? '' : 'medium'"
              @click="handleChangeFilter('finished')"
            >
              Finished
            </ion-button>
          </div>
        </div>
      </div>
      <!-- <page-header title="Events">
        <template #custom-btn>
          <ion-button
            class="header-btn"
            @click="router.push({ name: EntitiesEnum.CreateEvent })"
          >
            <ion-icon src="assets/icon/plus.svg" />
          </ion-button>
        </template>
      </page-header> -->
    </template>
    <template #content>
      <div
        class="holder-content ion-padding-horizontal"
        :class="{ 'holder-content--empty': !eventsLoading && !events.length }"
      >
        <ion-spinner
          v-if="eventsPage === 1 && eventsLoading"
          name="lines"
          class="spinner"
        />
        <empty-block
          title="Empty here"
          button-text="Create first event"
          text="You have not created any event yet..."
          v-if="!eventsLoading && !events.length"
          @button-click="router.push({ name: EntitiesEnum.FacilityCreateEvent })"
        />
        <template v-if="events.length">
          <event-item
            :item="event"
            :key="event.id"
            v-for="event in events"
            @click="openEvent(event.id)"
          />
          <ion-infinite-scroll
            threshold="100px"
            class="infinite-scroll"
            @ionInfinite="loadData"
            v-if="events.length < totalEvents"
          >
            <ion-infinite-scroll-content
              loading-spinner="lines"
              loading-text="Loading more data..."
            >
            </ion-infinite-scroll-content>
          </ion-infinite-scroll>
          <ion-button id="create" @click="router.push({ name: EntitiesEnum.FacilityCreateEvent })">Create Event</ion-button>
        </template>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import {
  IonIcon,
  IonButton,
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import EventItem from "@/general/components/EventItem.vue";
import { EntitiesEnum } from "@/const/entities";
import {
  EventsDocument,
  EventsQuery,
  EventsQueryVariables,
  QueryEventsOrderByColumn,
  RoleEnum,
  SortOrder,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import { ref } from "vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { useRouter } from "vue-router";
import useId from "@/hooks/useId";
import useFacilityId from "@/hooks/useFacilityId";
// import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";

const eventsPage = ref<number>(1);
const totalEvents = ref<number>(0);

const { id: myId } = useId();
const { id: myFacilityId } = useFacilityId();
const { role: myRole } = useRoles();
const filter = ref<string>('all');

const idFilter =
  myRole === RoleEnum.Trainer
    ? { created_by_trainer: myId }
    : { created_by_facility: myFacilityId };

const eventsParams: EventsQueryVariables = {
  first: 8,
  page: eventsPage.value,
  orderBy: [
    {
      column: QueryEventsOrderByColumn.StartDate,
      order: SortOrder.Asc,
    },
  ],
  // start_date: {
  //   from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  //   to: dayjs().add(1, 'y').format("YYYY-MM-DD HH:mm:ss"),
  // },
  ...idFilter,
};

const {
  onResult: gotEvents,
  loading: eventsLoading,
  refetch: eventsRefetch,
} = useQuery<EventsQuery>(EventsDocument, eventsParams, {
  fetchPolicy: "no-cache",
});

const handleChangeFilter = (value: string) => {
		filter.value = value;
}

const events = ref([]);

gotEvents((response) => {
  totalEvents.value = response.data.events?.paginatorInfo.total ?? 0;
  if (!events.value?.length) {
    events.value = response.data.events?.data;
  }
});

const router = useRouter();
const openEvent = (eventId: string) => {
  router.push({
    name: EntitiesEnum.EventsDetailed,
    params: {
      id: eventId,
    },
  });
};

const loadData = (ev: InfiniteScrollCustomEvent) => {
  if (events.value.length < totalEvents.value) {
    eventsPage.value++;
    eventsRefetch({
      first: 8,
      page: eventsPage.value,
      orderBy: [
        {
          column: QueryEventsOrderByColumn.StartDate,
          order: SortOrder.Asc,
        },
      ],
      // start_date: {
      //   from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      //   to: dayjs().add(1, 'y').format("YYYY-MM-DD HH:mm:ss"),
      // },
      ...idFilter,
    })?.then((response) => {
      events.value = [...events.value, ...(response.data.events?.data ?? [])];
      ev.target.complete();
    });
  }
};
</script>

<style scoped lang="scss">
.holder-content {
  padding-top: 24px;
  padding-bottom: 16px;

  &--empty {
    display: flex;
    min-height: 100%;
    padding-bottom: 32px;
    flex-direction: column;
    justify-content: center;
  }
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
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
}

.infinite-scroll {
  margin-top: 16px;
  margin-bottom: -24px;
}

.banner {
  padding: 32px;
  min-height: 160px;
  width: 100%;
  position: relative;
  overflow: hidden;

  &__background-image {
    position: absolute;
    inset: 0;
    z-index: -1;
  }

  &__title {
    padding: 0;
    color: #FFF;
    font-family: Lato;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
  &__text {
    color: #FFF;
    font-family: Lato;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    letter-spacing: 0.1px;
  }
}
ion-button#create {
  width: 100%;
  font: 500 16px/1 Yantramanav;
  margin-top: 28px;
}
.filter-list {
	background-color: var(--gray-700);

  &__top {
    margin-bottom: 16px;
    padding: 8px 24px;
  }
}
.filter-tabs {
  width: 100%;
  
  ion-button {
    --border-radius: 100px;
    font: 500 14px/1 Lato;
    height: 35px;
  }
  
  .selected {
    color: var(--main-color);
  }
  .normal {
    color: var(--grey-text);
  }
}
</style>
