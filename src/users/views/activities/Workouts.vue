<template>
  <base-layout>
    <template v-if="workoutsLoaded" #header>
      <search-form 
        hide-results
        filtersBtn
        @search="searchWorkouts"
        @apply-filters="applyFilter"
        :class="{'ios-app-top': isPlatform('ios')}"
      />
    </template>
    <template #content>
      <div class="holder-content ion-padding-horizontal">
        <ion-spinner v-if="!workoutsLoaded" name="lines" class="spinner" />
        <div v-else-if="view === 'dailys'">
          <template v-if="workouts && workouts.length">
            <ion-title slot="start" class="title">My Library</ion-title>
            <activity
              v-for="workout in workouts"
              :key="workout.id"
              :activity="workout"
              @click="openActivity(workout.id)"
            />
            <ion-infinite-scroll
              threshold="100px"
              class="infinite-scroll"
              @ionInfinite="loadMoreWorkouts"
              v-if="workouts.length < totalWorkouts"
            >
              <ion-infinite-scroll-content
                loading-spinner="lines"
                loading-text="Loading more..."
              >
              </ion-infinite-scroll-content>
            </ion-infinite-scroll>
          </template>
          <empty-block
            v-else
            title="Empty here"
            button-text="Explore more"
            text="No workouts were found"
            @button-click="router.push({ name: EntitiesEnum.UserWorkouts })"
          />
        </div>
        <div v-else-if="view === 'trending'">
          <template v-if="workouts && workouts.length">
            <activity
              v-for="workout in workouts"
              :key="workout.id"
              :activity="workout"
              :type="'daily'"
              :duration="allDailys?.find((daily)=>daily.id===workout.id)?.duration"
              :dailyType="allDailys?.find((daily)=>daily.id===workout.id)?.type.name"
              :trainer="allDailys?.find((daily)=>daily.id===workout.id)?.trainer"
              @click="openActivity(workout.id)"
            />
            <ion-infinite-scroll
              threshold="100px"
              class="infinite-scroll"
              @ionInfinite="loadMoreWorkouts"
              v-if="workouts.length < totalWorkouts"
            >
              <ion-infinite-scroll-content
                loading-spinner="lines"
                loading-text="Loading more..."
              >
              </ion-infinite-scroll-content>
            </ion-infinite-scroll>
          </template>
          <empty-block
            v-else
            title="Empty here"
            button-text="Explore more"
            text="No workouts were found"
            @button-click="router.push({ name: EntitiesEnum.UserWorkouts })"
          />
        </div>
      </div>
    </template>
  </base-layout>

  <page-tabs
    v-if="!showFilterModal && workoutsLoaded"
    :tabs="tabs"
    class="page-tabs"
    @change="tabsChanged"
  />
</template>

<script setup lang="ts">
import {
  IonBackButton,
  IonTitle,
  IonButtons,
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
  isPlatform
} from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageTabs from "@/general/components/PageTabs.vue";
import SearchForm from "@/general/components/forms/SearchForm.vue";
import Activity from "@/users/components/Activity.vue";
import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "@/const/entities";
import { useQuery } from "@vue/apollo-composable";
import {
  WorkoutsDocument,
  WorkoutsQuery,
  QueryWorkoutsOrderByColumn,
  SortOrder,
} from "@/generated/graphql";
import { defineProps, computed,ref } from "vue";
import { ActivityItem } from "@/interfaces/ActivityItem";
import { useRouter } from "vue-router";
import { discoverTabs } from "@/const/tabs";
import EmptyBlock from "@/general/components/EmptyBlock.vue";

const router = useRouter();

const tabs: TabItem[] = [
  {
    name: EntitiesEnum.Trending,
    label: "Trending",
  },
  {
    name: EntitiesEnum.Dailys,
    label: "Dailys",
  },
];

const workoutsLoaded = ref<boolean>(false);
const activePage = ref<number>(1);
const totalWorkouts = ref<number>(0);
const searchQuery = ref<string>("");
const view = ref<string>("trending");
const showFilterModal = ref<boolean>(false);

const tabsChanged = (name: EntitiesEnum) => {
  switch(name) {
    case EntitiesEnum.Trending :
      view.value = 'trending';
      break;
    
    case EntitiesEnum.Dailys :
      view.value = 'dailys';
      break;
  }

  updateWorkouts
};

const { result: workoutsResult, refetch: updateWorkouts, onResult: gotWorkouts } =
  useQuery<WorkoutsQuery>(
    WorkoutsDocument,
    {
      first: 6,
      page: activePage.value,
      dynamic_search: searchQuery.value,
      orderByColumn: QueryWorkoutsOrderByColumn.CreatedAt,
      order: SortOrder.Desc,
    },
    {
      fetchPolicy: "no-cache",
    }
  );

const allDailys = computed(() => workoutsResult.value?.workouts?.data);

const loadMoreWorkouts = (ev: InfiniteScrollCustomEvent) => {
  if (workouts.value && workouts.value.length < totalWorkouts.value) {
    activePage.value++;
    updateWorkouts({
      first: 6,
      page: activePage.value,
      dynamic_search: searchQuery.value,
      orderByColumn: QueryWorkoutsOrderByColumn.CreatedAt,
      order: SortOrder.Desc,
    })?.then(() => {
      ev.target.complete();
    });
  }
};

gotWorkouts((response) => {
  totalWorkouts.value = response.data.workouts?.paginatorInfo.total ?? 0;

  const newWorkouts: ActivityItem[] =
    response.data?.workouts?.data.map((workout) => ({
      name: workout.title,
      id: workout.id,
      rating: String(workout.trainer.score?.toFixed(1)),
      photo: workout.previewUrl || undefined,
    })) ?? [];

  if (
    workoutsLoaded.value &&
    workouts.value?.length &&
    workouts.value.findIndex(
      (workout) => newWorkouts.length && workout.id === newWorkouts[0].id
    ) > -1
  )
    return;

  workoutsLoaded.value = true;

  workouts.value =
    !workouts.value ||
    response.data.workouts?.paginatorInfo.firstItem === null ||
    response.data.workouts?.paginatorInfo.firstItem === 1
      ? newWorkouts
      : [...workouts.value, ...newWorkouts];
});

const workouts = ref<ActivityItem[] | null>(null);

const searchWorkouts = (query: string) => {
  activePage.value = 1;
  totalWorkouts.value = 0;
  workoutsLoaded.value = false;
  searchQuery.value = query;
  updateWorkouts({
    first: 6,
    page: activePage.value,
    dynamic_search: searchQuery.value,
    orderByColumn: QueryWorkoutsOrderByColumn.CreatedAt,
    order: SortOrder.Desc,
  });
};

const openActivity = (activityId: string | number) => {
  router.push({
    name: EntitiesEnum.UserWorkout,
    params: {
      id: activityId,
    },
  });
};

const applyFilter = (data: any) => {
  console.log(data);
  workoutsLoaded.value = false;
  updateWorkouts({
    first: 6,
    page: activePage.value,
    dynamic_search: searchQuery.value,
    orderByColumn: QueryWorkoutsOrderByColumn.CreatedAt,
    order: SortOrder.Desc,
    has_body_parts: data.tags
  });
}

const handleBack = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped>
:deep(.header) {
  display: flex;
  background: var(--ion-background-color);
}

:deep(.search-form) {
  flex: 1 1 auto;
  padding-bottom: 8px;
}

.back-btn {
  display: inline-block;
  height: 32px;
  min-width: 32px;
  margin-left: 15px;
  margin-top: calc(10px + var(--ion-safe-area-top));
  border-radius: 50%;
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
  --color: var(--ion-color-white);
  background: rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(8px);
}

.holder-content {
  padding-top: 24px;
  padding-bottom: 80px;
}

.title {
  padding: 0;
  margin-bottom: 16px;
  font: 500 16px/1.5 var(--ion-font-family);
  --color: var(--ion-color-white);
}

.page-tabs {
  left: 0;
  right: 0;
  display: flex;
  z-index: 20000;
  position: fixed;
  align-items: center;
  pointer-events: none;
  flex-direction: column;
  justify-content: center;
  bottom: calc(84px + var(--ion-safe-area-bottom));
  --btn-min-width: 120px;
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

.empty-block {
  margin-top: 48px;
}

.infinite-scroll {
  margin-top: 16px;
  margin-bottom: -24px;
}

</style>
