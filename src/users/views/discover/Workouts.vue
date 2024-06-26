<template>
  <base-layout>
    <template #header>
      <ion-buttons>
        <ion-back-button
          class="back-btn"
          icon="assets/icon/arrow-back.svg"
          @click="handleBack"
        >
        </ion-back-button>
      </ion-buttons>
      <search-form hide-results @search="searchWorkouts" />
    </template>
    <template #content>
      <div class="holder-content ion-padding-horizontal">
        <ion-spinner v-if="!workoutsLoaded" name="lines" class="spinner" />
        <template v-else-if="workouts && workouts.length">
          <ion-title slot="start" class="title">Workouts</ion-title>
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
    </template>
  </base-layout>

  <page-tabs
    :tabs="tabs"
    class="page-tabs"
    :value="EntitiesEnum.ActivitiesNearby"
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
import { ref } from "vue";
import { ActivityItem } from "@/interfaces/ActivityItem";
import { useRouter } from "vue-router";
import { discoverTabs } from "@/const/tabs";
import EmptyBlock from "@/general/components/EmptyBlock.vue";

const router = useRouter();

const tabs: TabItem[] = discoverTabs;

const workoutsLoaded = ref<boolean>(false);
const activePage = ref<number>(1);
const totalWorkouts = ref<number>(0);
const searchQuery = ref<string>("");

const tabsChanged = (name: EntitiesEnum) => {
  router.push({
    name,
  });
};

const { refetch: updateWorkouts, onResult: gotWorkouts } =
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
  z-index: 21000;
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
