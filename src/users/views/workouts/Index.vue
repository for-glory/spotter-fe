<template>
  <base-layout
    header-fixed
    ref="layout"
    :offset-top="20"
    :initial-breakpoint="0.4"
  >
    <template #header>
      <search-workouts-form
        placeholder="Search workouts..."
        @handle-item-click="onItemClick"
        :route-name="EntitiesEnum.UserWorkoutList"
        :class="{'ios-app-top': isPlatform('ios')}"
      />
    </template>

    <template #content>
      <ion-spinner
        v-if="workoutsLoading"
        name="lines"
        class="spinner"
      />
      <div 
        v-else
        class="page-content ion-padding-horizontal" 
        :class="{'ios-app-top': isPlatform('ios')}"
      >
        <router-link
          class="workout"
          v-for="workout in workouts"
          :key="workout?.id"
          :to="{
            name: EntitiesEnum.UserWorkout,
            params: { id: workout?.id },
          }"
        >
          <workout-item
            :title="workout?.title || ''"
            :pathUrl="`${workout?.previewUrl}` || ''"
            :type="workout?.type?.name || ''"
            :trainer="
              `${workout?.trainer?.first_name} ${workout?.trainer?.last_name}` ||
              ''
            "
          />
        </router-link>
      </div>
    </template>
  </base-layout>

  <page-tabs
    :tabs="TABS"
    class="page-tabs"
    :value="EntitiesEnum.UserWorkouts"
    @change="tabsChanged"
  />
</template>

<script setup lang="ts">
import { IonSpinner, isPlatform } from "@ionic/vue";
import { TABS } from "@/const/user-workouts-tabs";
import WorkoutsSwiper from "./components/WorkoutsSwiper.vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { useQuery } from "@vue/apollo-composable";
import {
  RecommendedWorkoutsDocument,
  Workout,
  RecommendedWorkoutsByBodyPartsDocument,
  RecommendedWorkoutsByTypeDocument,
  WorkoutsDocument,
  QueryWorkoutsOrderByColumn,
  SortOrder
} from "@/generated/graphql";
import { computed, ref } from "vue";
// import PageTabs from "@/general/components/PageTabs.vue";
import PageTabs from "@/general/components/PageTabs.vue";
import SearchWorkoutsForm from "@/general/components/forms/SearchWorkoutsForm.vue";
import WorkoutItem from "@/users/components/Workout.vue";

const router = useRouter();
const itemSelected = ref<Workout | null>(null);

const workoutsLoaded = ref<boolean>(false);
const activePage = ref<number>(1);
const totalWorkouts = ref<number>(0);
const searchQuery = ref<string>("");

const { result: workoutsResult, loading: workoutsLoading } = useQuery(
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

const workouts = computed(() => workoutsResult.value?.workouts?.data);

const tabsChanged = (name: EntitiesEnum) => {
  router.push({
    name,
  });
};

const onItemClick = (item: Workout) => {
  itemSelected.value = item;
};
</script>

<style lang="scss" scoped>
.holder-content {
  padding-bottom: 76px;
  padding-top: calc(64px + var(--ion-safe-area-top));
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

.search-form {
  height: 80px;
  background: var(--ion-background-color);
}

.page-tabs {
  left: 0;
  right: 0;
  display: flex;
  z-index: 1000;
  position: fixed;
  align-items: center;
  pointer-events: none;
  flex-direction: column;
  justify-content: center;
  bottom: calc(84px + var(--ion-safe-area-bottom));
  --btn-min-width: 120px;
}
.page-content {
  padding-top: 24px;
  padding-bottom: 16px;
}
.workout {
  display: block;

  &:not(:first-child) {
    margin-top: 16px;
  }
}
</style>
