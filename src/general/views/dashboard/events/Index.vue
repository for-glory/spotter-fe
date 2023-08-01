<template>
	<div
		class="holder-content ion-padding-horizontal"
		:class="{ 'holder-content--empty': !eventsLoading && !events.length }"
	>
		<div class="event-list">
			<div class="d-flex justify-content-between">
				<div>
					<ion-button>
						Ongoing
					</ion-button>
					<ion-button>
						Finished
					</ion-button>
				</div>
				<div>
					<ion-button @click="router.push({ name: EntitiesEnum.DashboardCreateEvent })">
						Create Event
					</ion-button>
				</div>
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
		</template>
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

.infinite-scroll {
  margin-top: 16px;
  margin-bottom: -24px;
}

.empty-section {
	margin-top: 100px;
}
</style>
