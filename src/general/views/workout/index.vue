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
              <div>
                <div 
                  class="d-flex align-items-center justify-content-between w-100"
                  style="padding-top: 16px; padding-bottom: 16px;"
                >
                  <ion-text class="font-medium font-16 color-white">Recently Uploaded</ion-text>
                  <ion-text class="font-medium font-14 color-gold" @click="handleSetFilter('recently uploaded')">View All</ion-text>
                </div>
                <swiper 
                  v-if="dailysData?.length"
                  free-mode
                  slidesPerView="auto"
                  :spaceBetween="16"
                  :slidesOffsetAfter="16"
                  :slidesOffsetBefore="16"
                  :modules="[FreeMode]"
                >
                  <swiper-slide 
                    v-for="daily in dailysData" 
                    :key="daily.id"
                  >
                    <workout-item
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
                  </swiper-slide>
                </swiper>
              </div>
              <div>
                <div 
                  class="d-flex align-items-center justify-content-between w-100"
                  style="padding-top: 16px; padding-bottom: 16px;"
                >
                  <ion-text class="font-medium font-16 color-white">Trending</ion-text>
                  <ion-text class="font-medium font-14 color-gold" @click="handleSetFilter('trending')">View All</ion-text>
                </div>
                <swiper 
                  v-if="trendingDailys?.length"
                  free-mode
                  slidesPerView="auto"
                  :spaceBetween="16"
                  :slidesOffsetAfter="16"
                  :slidesOffsetBefore="16"
                  :modules="[FreeMode]"
                >
                  <swiper-slide 
                    v-for="daily in trendingDailys" 
                    :key="daily.id"
                  >
                    <workout-item
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
                  </swiper-slide>
                </swiper>
              </div>
              <div>
                <div 
                  class="d-flex align-items-center justify-content-between w-100"
                  style="padding-top: 16px; padding-bottom: 16px;"
                >
                  <ion-text class="font-medium font-16 color-white">Most Liked</ion-text>
                  <ion-text class="font-medium font-14 color-gold"  @click="handleSetFilter('most liked')">View All</ion-text>
                </div>
                <swiper 
                  v-if="recommendedDailys?.length"
                  free-mode
                  slidesPerView="auto"
                  :spaceBetween="16"
                  :slidesOffsetAfter="16"
                  :slidesOffsetBefore="16"
                  :modules="[FreeMode]"
                >
                  <swiper-slide 
                    v-for="daily in recommendedDailys" 
                    :key="daily.id"
                  >
                    <workout-item
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
                  </swiper-slide>
                </swiper>
              </div>
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
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode } from "swiper";
import useId from "@/hooks/useId";
import useSubscription from "@/hooks/useSubscription";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import { useDailysItemsStore } from "@/general/stores/useDailysItemsStore";
import { useDailysStore } from "@/general/stores/useDailysStore";
import WorkoutsSwiper from "@/facilities/components/WorkoutsSwiper.vue";
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
const performanceData = ref<Array<any>>([]);
const trendingDailys = ref<Array<any>>([]);
const recommendedDailys = ref<Array<any>>([]);

const router = useRouter();
const store = useDailysStore();

const setTab = (workoutT: string) => {
		tab.value = workoutT;
}

const { result: dailysResult, loading: dailysLoading, refetch: refetchDailys, onResult: gotDailysData } = useQuery(
  WorkoutsByFacilityDocument,
  {
    page: 1,
    first: 1000,
    facility_id: currentFacility.facility?.id,
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
    facility_id: currentFacility.facility?.id,
    limit: performanceLimit.value
  }
);
const { result: dailyPerformanceResult, loading: dailyPerformanceLoading, refetch: refetchDailyPerformance, onResult: gotDailysPerformanceData } = useQuery(
  DailyPerformanceDocument,
  {
    facility_id: currentFacility.facility?.id,
    limit: 7
  }
);

onMounted(() => {
  store.clearState();
})

gotDailysData(({ data }) => {
  let dailys = data.facilityWorkouts.data;
  dailys.sort((a: any, b: any) => {
    return a.total_revenue - b.total_revenue;
  });
  summaryData.value.topDailys = dailys.slice(0, 10);
  dailys.sort((a: any, b: any) => {
    return a.views_count - b.views_count;
  });
  trendingDailys.value = dailys;
  dailys.sort((a: any, b: any) => {
    return a.recommended_count - b.recommended_count;
  });
  recommendedDailys.value = dailys;
  dailysItemsStore.setData(dailys.reverse());
  console.log(dailysItemsStore.dailysData);
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
  () => dailysResult.value?.facilityWorkouts?.data
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
  console.log(daily.id);
  console.log(daily);
  console.log(dailysData.value[0]);
  router.push({ name: EntitiesEnum.WorkoutView, params: { id: daily.id } });
}

const handleSetFilter = (value: string) => {
  console.log(value);
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
</style>