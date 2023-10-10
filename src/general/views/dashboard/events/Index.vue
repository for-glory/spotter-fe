<template>
	<div
		class="holder-content ion-padding-horizontal"
		:class="{ 'holder-content--empty': !eventsLoading && !events?.length }" 
	>
    <div class="banner ion-text-start" style="background: url('assets/backgrounds/eventBanner.png')">
      <ion-title class="banner__title">Create events for clients and trainers</ion-title>
      <ion-text class="banner__text">
        Your hub for creating memorable gatherings. Effortlessly set up events, and easily track registrations to ensure a seamless experience.
      </ion-text>
      <div class="banner__background-image">
        <img src="assets/backgrounds/banner1.jpeg" alt="">
      </div>
    </div>
		<div class="event-list">
			<div class="d-flex justify-content-between event-list__top">
				<div class="d-flex event-btns">
					<ion-button class="button-rounded filter-btn" :fill="filter === 'upcoming' ? 'solid':'outline'" @click="handleEventType('upcoming')">
						Upcoming
					</ion-button>
					<ion-button class="button-rounded filter-btn" :fill="filter === 'ongoing' ? 'solid':'outline'" @click="handleEventType('ongoing')">
						Ongoing
					</ion-button>
					<ion-button class="button-rounded filter-btn" :fill="filter === 'finished' ? 'solid':'outline'" @click="handleEventType('finished')">
						Finished
					</ion-button>
				</div>
				<div>
					<ion-button @click="router.push({ name: EntitiesEnum.DashboardCreateEvent })">
						Create Event
					</ion-button>
				</div>
			</div>
      <div v-if="events?.length">
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
			v-if="!eventsLoading && !events?.length"
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
  IonTitle,
  IonText
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
import { ref, watch, computed , withDefaults, defineProps, } from "vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { useRouter } from "vue-router";
import useId from "@/hooks/useId";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";
import { routes } from "@/general/routes";


const eventsPage = ref<number>(1);
const totalEvents = ref<number>(0);
const filter = ref<string>('upcoming');

const { id: myId } = useId();
const currentFacility = useFacilityStore();
const { role: myRole } = useRoles();

import { useRoute } from 'vue-router'
 const route = useRoute()
 import { IonPage } from '@ionic/vue';

const idFilter = computed(() => {
  return myRole === RoleEnum.Trainer
    ? { created_by_trainer: myId }
    : { created_by_facility: currentFacility.facility?.id }
});



// useEffect(() => {
//         console.log(props.router.query.name);
//     }, [props.router.query]);
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
  ...idFilter.value,
};


 

const {
  result,
  onResult: gotEvents,
  loading: eventsLoading,
  refetch: eventsRefetch,
} = useQuery<EventsQuery>(EventsDocument, eventsParams, {
  notifyOnNetworkStatusChange: true,
  fetchPolicy: "no-cache",
});

const allEvents = ref([]);
const status = route.query.status;
const events = computed(() => {
   return allEvents.value.filter(ev => {
    if(filter.value === 'all') return true;
    return ev.status === filter.value
  });  

});

gotEvents((response) => {
  totalEvents.value = response.data?.events?.paginatorInfo.total ?? 0;
  response.data?.events?.data.map(item => {
    allEvents.value.push({
      ...item,
      status: dayjs().isBefore(item.end_date) ?  'upcoming' : 'finished',
    })
  });
});




watch(
  () => currentFacility,
  () => {
    console.log(currentFacility.facility?.id)
    console.log(idFilter.value)
    eventsRefetch({
      first: 8,
      page: eventsPage.value,
      orderBy: [
        {
          column: QueryEventsOrderByColumn.StartDate,
          order: SortOrder.Asc,
        },
      ],
      ...idFilter.value,
    });
  },
  {
    deep: true
  }
  
);


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
      ...idFilter.value,
    })?.then((response) => {
      events.value = [...events.value, ...(response.data.events?.data ?? [])];
      ev.target.complete();
    });
  }
};

const handleEventType = (evT: string) => {
  filter.value = evT;
  console.log(filter.value);
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
.event-btns {
    align-items: center;
}
.empty-section {
	margin-top: 100px;
}
.event-list {
	background-color: var(--gray-700);
  margin-top: 54px;
  border-radius: 10px;

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
  text-align: center;

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
    margin-bottom: 10px;
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
.filter-btn {
  height: 36px;
  margin: 0 8px;
}
</style>
