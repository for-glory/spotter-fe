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
      />
    </template>

    <template #content>
      <ion-spinner
        v-if="
          recommendedLoading ||
          recommendedByTypeLoading ||
          recommendedByBodyLoading
        "
        name="lines"
        class="spinner"
      />
      <div class="holder-content" v-else>
        <workouts-swiper
          title="Recommended"
          :workouts="recommendedWorkouts"
          queryType="recommended"
        />
        <workouts-swiper
          title="Workout level"
          :workouts="recommendedWorkoutsByType"
          queryType="recommendedByType"
        />
        <workouts-swiper
          title="Muscle group"
          :workouts="recommendedWorkoutsByBody"
          queryType="recommendedByBodyParts"
        />
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
import { IonSpinner } from "@ionic/vue";
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
} from "@/generated/graphql";
import { computed, ref } from "vue";
import PageTabs from "@/general/components/PageTabs.vue";
import SearchWorkoutsForm from "@/general/components/forms/SearchWorkoutsForm.vue";

const router = useRouter();
const itemSelected = ref<Workout | null>(null);

const { result: recommendedResult, loading: recommendedLoading } = useQuery(
  RecommendedWorkoutsDocument,
  {
    page: 1,
    first: 1000,
  },
  {
    fetchPolicy: "no-cache",
  }
);

const recommendedWorkouts = computed(
  () =>
    recommendedResult.value?.recommendedWorkouts?.data?.filter(
      (workout: Workout) => !workout?.was_ordered_by_me
    ) || []
);

const {
  result: recommendedByBodyPartsResult,
  loading: recommendedByBodyLoading,
} = useQuery(
  RecommendedWorkoutsByBodyPartsDocument,
  {
    page: 1,
    first: 1000,
  },
  {
    fetchPolicy: "no-cache",
  }
);

const recommendedWorkoutsByBody = computed(
  () =>
    recommendedByBodyPartsResult.value?.recommendedWorkoutsByBodyParts?.data?.filter(
      (workout: Workout) => !workout?.was_ordered_by_me
    ) || []
);

const { result: recommendedByTypeResult, loading: recommendedByTypeLoading } =
  useQuery(
    RecommendedWorkoutsByTypeDocument,
    {
      page: 1,
      first: 1000,
    },
    {
      fetchPolicy: "no-cache",
    }
  );

const recommendedWorkoutsByType = computed(
  () =>
    recommendedByTypeResult.value?.recommendedWorkoutsByType?.data.filter(
      (workout: Workout) => !workout?.was_ordered_by_me
    ) || []
);

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
</style>
