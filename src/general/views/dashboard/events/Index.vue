<template>
	<div
		class="holder-content ion-padding-horizontal"
		:class="{ 'holder-content--empty': !eventsLoading && !events.length }"
	>
    <div class="banner">
      <ion-title class="banner__title">Create and Edit events for clients and trainers</ion-title>
      <ion-text class="banner__text">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod 
      </ion-text>
      <div class="banner__background-image">
        <img src="assets/backgrounds/banner1.jpeg" alt="">
      </div>
    </div>
		<div class="event-list">
			<div class="d-flex justify-content-between event-list__top">
				<div>
					<ion-button class="button-rounded" :fill="isOngoing?'solid':'outline'" @click="handleEventType('ongoing')">
						Ongoing
					</ion-button>
					<ion-button class="button-rounded" :fill="!isOngoing?'solid':'outline'" @click="handleEventType('finished')">
						Finished
					</ion-button>
				</div>
				<div>
					<ion-button @click="router.push({ name: EntitiesEnum.DashboardCreateEvent })">
						Create Event
					</ion-button>
				</div>
			</div>
      <div v-if="events.length">
        <event-data-table
          :events="events"
        />
      </div>
		</div>
		<ion-spinner
			v-if="eventsPage === 1 && eventsLoading"
			name="lines"
			class="spinner"
		/>
		<div
			class="empty-section"
			v-if="!eventsLoading && !events.length"
		>
			<empty-block
				title="Library Empty"
				hideButton
				text="You have not created any event yet..."
				@button-click="router.push({ name: EntitiesEnum.CreateEvent })"
			/>
		</div>
		<!-- <template v-if="events.length">
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
		</template> -->
	</div>
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
import EventDataTable from "@/general/components/dataTables/EventDataTable.vue";
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
const isOngoing = ref<boolean>(true);

const { id: myId } = useId();
const { id: myFacilityId } = useFacilityId();
const { role: myRole } = useRoles();

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

const handleEventType = (evT: string) => {
	if(evT === 'ongoing') {
		isOngoing.value = true;
	}
	else if (evT === 'finished') {
		isOngoing.value = false;
	}
}
</script>

<style scoped lang="scss">
.holder-content {
  padding-top: 24px;
  padding-bottom: 16px;

}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

.infinite-scroll {
  margin-top: 16px;
  margin-bottom: -24px;
}

.empty-section {
	margin-top: 100px;
}
.event-list {
	background-color: var(--gray-700);
  margin-top: 54px;

  &__top {
    margin-bottom: 16px;
    padding: 8px 24px;
  }
}
.banner {
  padding: 32px;
  min-height: 160px;
  width: 100%;
  border-radius: 12px;
  background: linear-gradient(180deg, #F0E2AE 0%, rgba(251, 248, 234, 0.00) 100%);
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
    font-size: 24px;
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
</style>
