<template>
  <base-layout>
    <template #header>
      <div class="banner" :class="{'ios-app-top': isPlatform('ios')}" >
        <ion-title class="banner__title">All dailys are stored here</ion-title>
        <ion-text class="banner__text">
          A centralized space where all your daily workout videos are securely stored. Accessible, organized, and always ready to inspire your others.
        </ion-text>
        <div class="banner__background-image">
          <img src="assets/backgrounds/Banner_3.png" alt="" class="w-100">
        </div>
      </div>
      <div class="workout-list" v-if="!(dailysLoading) && dailysData?.length">
        <div class="d-flex justify-content-around workout-list__top">
          <div class="filter-tabs d-flex align-items-center justify-content-center">
            <ion-button
              :fill="tab === 'dailys' ? 'solid' : 'outline'"
              :color="tab === 'dailys' ? '' : 'medium'"
              @click="setTab('dailys')"
            >
              Dailys
            </ion-button>
            <ion-button 
              :fill="tab === 'analytics' ? 'solid' : 'outline'"
              :color="tab === 'analytics' ? '' : 'medium'"
              @click="setTab('analytics')"
            >
              Analytics
            </ion-button>
            <ion-button
              fill="solid"
              @click="router.push({ name: EntitiesEnum.CreateWorkout })"
            >
              Create Dailys
            </ion-button>
          </div>
        </div>
      </div>
    </template>
    <template #content>
      <div
        class="ion-padding-horizontal height-100 main-content"
      >
        <ion-spinner
          v-if="dailysLoading || dailysAnalyticsLoading"
          name="lines"
          class="spinner"
        />
        <div
          class="empty-section"
          v-else-if="!dailysData?.length"
        >
          <empty-block
            title="Library Empty"
            text="You have not uploaded any videos yet..."
            buttonText="Create Dailys"
            icon="assets/icon/daily.svg"
            @button-click="router.push({ name: EntitiesEnum.CreateWorkout })"
          />
        </div>
        <div class="common-style" v-else>
          <div v-if="tab === 'dailys'">
            <div v-if="filter==='all'">
              <ion-text class="font-light font-12 color-white">Showing all {{ dailysData.length }} Dailys</ion-text>
              <workouts-swiper
                title="Recently Uploaded"
                :workouts="dailysData"
                queryType="recent"
                @show="showDailysItem"
                @hide="hideDailysItem"
                @changeFilter="handleSetFilter('recently uploaded')"
                @click="watchDailys"
              />
              <workouts-swiper
                title="Trending"
                :workouts="trendingDailys"
                queryType="trending"
                @show="showDailysItem"
                @hide="hideDailysItem"
                @changeFilter="handleSetFilter('trending')"
                @click="watchDailys"
              />
              <workouts-swiper
                title="Most Liked"
                :workouts="recommendedDailys"
                queryType="recommended"
                @show="showDailysItem"
                @hide="hideDailysItem"
                @changeFilter="handleSetFilter('most liked')"
                @click="watchDailys"
              />
            </div>
            <div v-else>
              <div class="d-flex align-items-center justify-content-between" style="padding-bottom: 13px">
                <ion-text class="font-light font-12 color-white">Showing all {{ filter }}</ion-text>
                <ion-text class="font-medium font-14 color-gold"  @click="handleSetFilter('all')">Back</ion-text>
              </div>
              <div 
                class="d-flex-col justify-content-center gap-16 "
              >
                <workout-item
                  v-for="daily in (filter === 'recently uploaded' ? dailysData : filter === 'trending' ? trendingDailys : recommendedDailys)" 
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
                  :reviews_count="daily.reviews_count"
                  :recommended_count="daily.recommended_count"
                  :share="true"
                  :hide="true"
                  :hidden="daily.state === WorkoutStatesEnum.Hidden"
                  @hide="hideDailysItem(daily.id)"
                  @show="showDailysItem(daily.id)"
                  @click="watchDailys(daily)"
                />
              </div>
            </div>
          </div>
          <div v-else>
            <dailys-analytics :daily="dailysData[0]" @watch-daily="watchDailys(dailysData[0])" />
            <dailys-summary :summaryData="summaryData"/>
            <dailys-performance 
              :performanceData="performanceData" 
              :limit="performanceLimit"
              :totalRevenue="summaryData.totalRevenue"
              @change="setLimit"
            />
            <dailys-top :summaryData="summaryData"/>
          </div>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  isPlatform
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import {
  WorkoutsByFacilityDocument,
  QueryWorkoutsOrderByColumn,
  QueryFacilityWorkoutsOrderByColumn,
  SortOrder,
  HideWorkoutDocument,
  ShowWorkoutDocument,
  DailyAnalyticsDocument,
  DailyPerformanceDocument,
  WorkoutStatesEnum,
  WorkoutsDocument,
  RoleEnum
} from "@/generated/graphql";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { ref, computed, onMounted, onBeforeMount } from "vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode } from "swiper";
import useId from "@/hooks/useId";
import useSubscription from "@/hooks/useSubscription";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import { useDailysItemsStore } from "@/general/stores/useDailysItemsStore";
import { useDailysStore } from "@/general/stores/useDailysStore";
import { useTrainerStore } from "@/general/stores/useTrainerStore";
import dayjs from "dayjs";
import WorkoutsSwiper from "@/general/components/dashboard/workouts/WorkoutsSwiper.vue";
import WorkoutItem from "@/users/components/Workout.vue";
// import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";
import DailysAnalytics from "@/general/components/dailys/DailysAnalytics.vue";
import DailysSummary from "@/general/components/dailys/DailysSummary.vue";
import DailysPerformance from "@/general/components/dailys/DailysPerformance.vue";
import DailysTop from "@/general/components/dailys/DailysTop.vue";

const VUE_APP_CDN = ref(process.env.VUE_APP_CDN);
const tab = ref<string>('dailys');
const filter = ref<string>('all');
const performanceLimit = ref<string>('7');
const { role } = useRoles();

const { id: myId } = useId();
const { type: subscriptionType } = useSubscription();
const currentFacility = useFacilityStore();
const currentTrainer = useTrainerStore();
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

const isFacilityOwner = role === (RoleEnum.FacilityOwner || RoleEnum.OrganizationOwner);
const allDailys = computed(() => isFacilityOwner ? [ ...dailysResult.value.facilityWorkouts.data ] : [ ...dailysResult.value.workouts.data ]);
const setTab = (workoutT: string) => {
		tab.value = workoutT;
}

const { result: dailysResult, loading: dailysLoading, refetch: refetchDailys, onResult: gotDailysData } = useQuery(
  isFacilityOwner ? WorkoutsByFacilityDocument : WorkoutsDocument,
  isFacilityOwner ? {
    page: 1,
    first: 1000,
    facility_id: currentFacility.facility?.id,
    orderByColumn: QueryFacilityWorkoutsOrderByColumn.CreatedAt,
    order: SortOrder.Asc,
  } : {
    page: 1,
    first: 1000,
    trainer_id: currentTrainer.trainer?.id,
    orderByColumn: QueryWorkoutsOrderByColumn.CreatedAt,
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

onBeforeMount(() => {
  store.clearState();
});

const performanceData = ref<Array<any>>();
const trendingDailys = computed(() => {
  let dailys = allDailys.value;
  let trending = dailys.filter((daily) => daily.views_count > 0).sort((a: any, b: any) => {
    return b.views_count - a.views_count;
  }).slice(0, 10);
  return trending;
});
const recommendedDailys = computed(() => {
  let dailys = allDailys.value;
  let recommend = dailys.filter((daily) => daily.recommended_count > 0).sort((a: any, b: any) => {
    return b.recommended_count - a.recommended_count;
  }).slice(0, 10);
  return recommend;
});


gotDailysData(({ data }) => {
  let dailys = allDailys.value;
  dailys.sort((a: any, b: any) => {
    return a.total_revenue - b.total_revenue;
  });
  summaryData.value.topDailys = dailys.slice(0, 10);
  let recentDailys = allDailys.value;
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
}
const showDailysItem = (id: number) => {
  showDailys({ id }).then(() => {
    refetchDailys();
  });
}

const watchDailys = (daily: any) => {
  router.push({ name: EntitiesEnum.WorkoutView, params: { id: daily.id } });
}

const handleSetFilter = (value: string) => {
  filter.value = value;
}

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
}
</script>

<style scoped lang="scss">
.main-content {
  overflow-y: scroll;
}

.holder-content {
  padding-bottom: 16px;

  .toolbar-content {
    padding-top: 0;
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.workout-list {
	background-color: var(--gray-700);
  border-radius: 8px;
  margin-top: 16px;

  &__top {
    margin-bottom: 16px;
    padding: 8px 48px;
  }
}
.banner {
  padding: 32px;
  min-height: 160px;
  width: 100%;
  background: #19191B9a;
  position: relative;
  overflow: hidden;
  border-radius: 12px;

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
    margin-bottom: 12px;
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
.filter-tabs {
  width: 100%;
  gap: 12px;
  
  ion-button {
    --border-radius: 100px;
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
.height-100 {
  height: 100%;
}

.item-list {
  overflow-x: scroll;
}

ion-button#create {
  width: 100%;
  font: 500 16px/1 Yantramanav;
  margin-top: 28px;
}
.common-style {
  .w-24 {
    width: 24px;
  }
  .h-24 {
    height: 24px;
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
}
.swiper-slide {
  width: 100% !important;
}
</style>
