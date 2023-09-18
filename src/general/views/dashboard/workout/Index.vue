<template>
	<div
		class="holder-content ion-padding-horizontal"
	>
    <div class="banner">
      <div class="banner__background-image">
        <img src="assets/backgrounds/Banner_3.png" alt="" class="w-100">
      </div>
      <div class="banner__background-shadow"/>
      <div class="banner__background-text">
        <ion-title class="banner__title">All dailys are stored here</ion-title>
        <ion-text class="banner__text">
          A centralized space where all your daily workout videos are securely stored. Accessible, organized, and always ready to inspire your others.
        </ion-text>
      </div>
    </div>
		<div class="workout-list">
			<div class="d-flex justify-content-between workout-list__top">
				<div class="filter-tabs d-flex align-items-center justify-content-between">
          <div>
            <ion-button
              id="rounded"
              :fill="tab === 'dailys' ? 'solid' : 'outline'"
              :color="tab === 'dailys' ? '' : 'medium'"
              @click="setTab('dailys')"
            >
              Dailys
            </ion-button>
            <ion-button
              id="rounded"
              :fill="tab === 'analytics' ? 'solid' : 'outline'"
              :color="tab === 'analytics' ? '' : 'medium'"
              @click="setTab('analytics')"
            >
              Analytics
            </ion-button>
          </div>
          <ion-button
            fill="solid"
            id="normal"
            @click="router.push({ name: EntitiesEnum.DashboardCreateWorkout })"
          >
            Create Dailys
          </ion-button>
        </div>
      </div>
		</div>
    <ion-spinner
      v-if="dailysLoading || dailysAnalyticsLoading"
      name="lines"
      class="spinner"
      @hide="hideDailysItem"
    />
    <div
      class="empty-section"
      v-else-if="!dailysData?.length"
    >
      <empty-block
        title="Library Empty"
        hideButton
        text="You have not uploaded any videos yet..."
        @button-click="router.push({ name: EntitiesEnum.DashboardCreateWorkout })"
      />
    </div>
    <div class="" v-else>
      <div v-if="tab === 'dailys'">
        <div v-if="filter==='all'">
          <ion-text class="font-light font-12 color-white">Showing all {{ dailysData.length }} Dailys</ion-text>
          <workouts-swiper
            title="Recently Uploaded"
            :workouts="dailysData"
            queryType="recent"
            @show="showDailysItem"
            @hide="hideDailysItem"
            @changeFilter="handleSetFilter"
            @click="openViewModal"
          />
          <workouts-swiper
            title="Trending"
            :workouts="trendingDailys"
            queryType="trending"
            @show="showDailysItem"
            @hide="hideDailysItem"
            @changeFilter="handleSetFilter"
            @click="openViewModal"
          />
          <workouts-swiper
            title="Most Liked"
            :workouts="recommendedDailys"
            queryType="recommended"
            @show="showDailysItem"
            @hide="hideDailysItem"
            @changeFilter="handleSetFilter"
            @click="openViewModal"
          />
        </div>
        <div v-else>
          <div class="d-flex align-items-center justify-content-between" style="padding-bottom: 13px">
            <ion-text class="font-light font-12 color-white">Showing all {{ filter === 'recent' ? 'recently uploaded' : filter === 'recommended' ? 'most liked' : 'trending' }}</ion-text>
            <ion-text 
              class="font-medium font-14 color-gold" 
              style="cursor: pointer"  
              @click="handleSetFilter('all')"
            >
              Back
            </ion-text>
          </div>
          <div 
            class="justify-content-center gap-16 "
          >
            <div class="d-flex flex-wrap align-items-center gap-16">
              <workout-item
                v-for="daily in (filter === 'recent' ? dailysData : filter === 'trending' ? trendingDailys : recommendedDailys)"
                :key="daily.id"
                :duration="daily.duration"
                :title="daily.title || ''"
                :pathUrl="`${VUE_APP_CDN}${daily.preview}` || ''"
                :type="daily.type?.name || ''"
                :trainer="
                  `${daily.trainer?.first_name} ${daily.trainer?.last_name}` ||
                  ''
                "
                :id="daily.id"
                :total_revenue="daily.total_revenue"
                :reviews_count="daily.views_count"
                :recommended_count="daily.recommended_count"
                :share="true"
                :hide="true"
                :hidden="daily.state === WorkoutStatesEnum.Hidden"
                @hide="hideDailysItem(daily.id)"
                @show="showDailysItem(daily.id)"
                @click="openViewModal(daily)"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="d-flex gap-16 common-style">
        <div class="w-half d-flex-col gap-16">
          <dailys-analytics :daily="dailysData[0]" @watch-daily="openViewModal(dailysData[0])" />
          <dailys-performance 
            :performanceData="performanceData" 
            :limit="performanceLimit"
            :totalRevenue="summaryData.totalRevenue"
            @change="setLimit"
          />
        </div>
        <div class="w-half d-flex-col gap-16">
          <dailys-summary :summaryData="summaryData"/>
          <dailys-top :summaryData="summaryData"/>
        </div>
      </div>
    </div>
  </div>
  <view-daily-modal ref="dailyModal" @delete="onDelete" />
</template>

<script setup lang="ts">
import {
  IonButton,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import {
  WorkoutsByFacilityDocument,
  QueryFacilityWorkoutsOrderByColumn,
  SortOrder,
  HideWorkoutDocument,
  ShowWorkoutDocument,
  DailyAnalyticsDocument,
  DailyPerformanceDocument,
  WorkoutStatesEnum
} from "@/generated/graphql";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { ref, computed, onMounted } from "vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { useRouter } from "vue-router";
import { useDailysItemsStore } from "@/general/stores/useDailysItemsStore";
import { useDailysStore } from "@/general/stores/useDailysStore";
import useId from "@/hooks/useId";
import useSubscription from "@/hooks/useSubscription";
import dayjs from "dayjs";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import WorkoutsSwiper from "@/general/components/dashboard/workouts/WorkoutsSwiper.vue";
import WorkoutItem from "@/users/components/Workout.vue";
// import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";
import DailysAnalytics from "@/general/components/dailys/DailysAnalytics.vue";
import DailysSummary from "@/general/components/dailys/DailysSummary.vue";
import DailysPerformance from "@/general/components/dailys/DailysPerformance.vue";
import DailysTop from "@/general/components/dailys/DailysTop.vue";
import ViewDailyModal from "@/general/components/modals/workout/ViewDailyModal.vue"

const VUE_APP_CDN = ref(process.env.VUE_APP_CDN);
const tab = ref<string>('dailys');
const filter = ref<string>('all');
const performanceLimit = ref<string>('7');

const { id: myId } = useId();
const { type: subscriptionType } = useSubscription();
const currentFacility = useFacilityStore();
const dailysItemsStore = useDailysItemsStore();
const summaryData = ref<any>({
  totalViews: 0,
  subscribers: 0,
  totalRevenue: 0,
  viewsPerDaily: 0,
  topDailys: [],
});
const router = useRouter();
const store = useDailysStore();
const dailyModal = ref<typeof ViewDailyModal | null>(null);


const setTab = (workoutT: string) => {
		tab.value = workoutT;
}

const { result: dailysResult, loading: dailysLoading, refetch: refetchDailys, onResult: gotDailysData } = useQuery(
  WorkoutsByFacilityDocument,
  {
    page: 1,
    first: 1000,
    facility_id: currentFacility.facility?.id || localStorage.getItem("selected_facility"),
    orderByColumn: QueryFacilityWorkoutsOrderByColumn.CreatedAt,
    order: SortOrder.Asc,
  },
  {
    fetchPolicy: "no-cache",
  }
);
const { result: dailysAnalyticsResult, loading: dailysAnalyticsLoading, refetch: refetchDailysAnalytics, onResult: gotDailysAnalyticsData } = useQuery(
  DailyAnalyticsDocument,
  {
    facility_id: currentFacility.facility?.id || localStorage.getItem("selected_facility"),
    limit: performanceLimit.value
  }
);
const { result: dailyPerformanceResult, loading: dailyPerformanceLoading, refetch: refetchDailyPerformance, onResult: gotDailysPerformanceData } = useQuery(
  DailyPerformanceDocument,
  {
    facility_id: currentFacility.facility?.id || localStorage.getItem("selected_facility"),
    limit: 7
  }
);

onMounted(() => {
  store.clearState();
});

const performanceData = ref<Array<any>>();
const trendingDailys = computed(() => {
  let dailys = [ ...dailysResult.value.facilityWorkouts.data ];
   dailys.sort((a: any, b: any) => {
    return b.views_count - a.views_count;
  });
  return dailys;
});
const recommendedDailys = computed(() => {
  let dailys = [ ...dailysResult.value.facilityWorkouts.data ];
  dailys.sort((a: any, b: any) => {
    return b.recommended_count - a.recommended_count;
  });
  return dailys;
});

const onDelete = () => {
  refetchDailyPerformance();
  refetchDailysAnalytics();
  refetchDailys();
}

gotDailysData(({ data }) => {
  let dailys = [ ...data.facilityWorkouts.data ];
  dailys.sort((a: any, b: any) => {
    return a.total_revenue - b.total_revenue;
  });
  summaryData.value.topDailys = dailys.slice(0, 10);
  let recentDailys = [ ...data.facilityWorkouts.data ];
  recentDailys.sort((a: any, b: any) => {
    const dateFirst = dayjs(a, "h:mm A");
    const dateLast = dayjs(b, "h:mm A");
    return dateFirst.isBefore(dateLast) ? 1 : -1;
  });
  dailysItemsStore.setData(recentDailys);
});

gotDailysAnalyticsData(({ data }) => {
  summaryData.value.totalViews = data.dailyAnalytics.views;
  summaryData.value.subscribers = data.dailyAnalytics.purchases;
  summaryData.value.totalRevenue = data.dailyAnalytics.total_revenue;
  summaryData.value.viewsPerDaily = data.dailyAnalytics.per_daily_views;
});

gotDailysPerformanceData(({ data }) => {
  performanceData.value = data.dailyPerformance;
});

const dailysData = computed(
  () => dailysItemsStore.dailysData
);

const { mutate: showDailys, loading: dailysShowLoading } =
  useMutation(ShowWorkoutDocument);
const { mutate: hidedailys, loading: dailysHideLoading } =
  useMutation(HideWorkoutDocument);
const hideDailysItem = (id: number) => {
  hidedailys({ id }).then(() => {
    refetchDailys();
  });
};
const showDailysItem = (id: number) => {
  showDailys({ id }).then(() => {
    refetchDailys();
  });
};

const watchDailys = (daily: any) => {
  router.push({ name: EntitiesEnum.WorkoutView, params: { id: daily.id } });
};

const handleSetFilter = (value: string) => {
  filter.value = value;
};

const setLimit = (limit: string) => {
  if(limit === 'all') {
    refetchDailyPerformance({ 
      facility_id: currentFacility.facility.id,
      limit: 0
    })?.then(() => {
      performanceLimit.value = limit;
    })
  } else {
    refetchDailyPerformance({ 
      facility_id: currentFacility.facility.id,
      limit: parseInt(limit)
    })?.then(() => {
      performanceLimit.value = limit;
    });
  }
};

const openViewModal = (daily: any) => {
  dailyModal.value?.present({ ...daily });
};

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
.workout-list {
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
  max-height: 160px;
  width: 100%;
  border-radius: 12px;
  position: relative;
  overflow: hidden;

  &__background-image {
    position: absolute;
    inset: 0;
    img {
      margin-top: -10%;
    }
  }
  &__background-shadow {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        180deg,
        rgba(17, 17, 18, 0) 0%,
        rgba(17, 17, 18, 0.88) 100%,
        rgba(17, 17, 18, 0.88) 100%
      );
  }
  &__background-text {
    position: absolute;
    inset: 0;
    padding: 42px 62px 31px 61px;
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
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    letter-spacing: 0.1px;
  }
}
.filter-tabs {
  width: 100%;
  gap: 12px;
  
  ion-button#rounded {
    --border-radius: 100px;
    font: 500 14px/1 Lato;
    height: 36px;
  }
  ion-button#normal {
    font: 500 14px/1 Lato;
    height: 36px;
  }
  
  .selected {
    color: var(--main-color);
  }
  .normal {
    color: var(--grey-text);
  }
}
.common-style {
  .w-24 {
    width: 24px;
  }
  .h-24 {
    height: 24px;
  }
  .w-half {
    width: 50%;
  }
  .font-16 {
    font-size: 16px;
  }
  .font-12 {
    font-size: 12px;
  }
  .relative {
    position: relative;
  }
  .absolute {
    position: absolute;
  }
  .fixed {
    position: fixed;
  }
  .gap-16 {
    gap: 16px;
  }
}
</style>
