<template>
  <base-layout>
    <template #header>
      <page-header title="My Daily Workout">
        <template #custom-btn>
          <ion-button
            class="header-btn"
            @click="navigateCreateExercisePage"
            :disabled="
              (subscriptionType === SubscriptionsTierEnum.Silver &&
                workouts.length > 15) ||
              (subscriptionType === SubscriptionsTierEnum.Gold &&
                workouts.length > 30)
            "
          >
            <ion-icon src="assets/icon/plus.svg" />
          </ion-button>
        </template>
      </page-header>
    </template>
    <template #content>
      <ion-spinner v-if="loading" name="lines" class="spinner" />
      <template v-else-if="workouts.length && !loading">
        <ion-toolbar class="page-header ion-padding-horizontal">
          <ion-title slot="start" class="title"> Recently uploaded </ion-title>

          <router-link
            :to="{ name: EntitiesEnum.TrainerWorkoutList }"
            slot="end"
          >
            <ion-button fill="clear" color="primary" class="view-all-btn">
              View All
            </ion-button>
          </router-link>
        </ion-toolbar>
        <swiper
          free-mode
          slidesPerView="auto"
          :spaceBetween="16"
          :slidesOffsetAfter="16"
          :slidesOffsetBefore="16"
          :modules="[FreeMode]"
        >
          <swiper-slide v-for="workout in workouts" :key="workout.id">
            <workout-item
              hide
              share
              :id="workout.id"
              @click="openWorkout(workout.id)"
              :duration="workout.duration"
              :title="workout.title || ''"
              :pathUrl="`${VUE_APP_CDN}${workout.preview}` || ''"
              :type="workout.type?.name || ''"
              :trainer="
                `${workout.trainer?.first_name} ${workout.trainer?.last_name}` ||
                ''
              "
              :hidden="workout.state === WorkoutStatesEnum.Hidden"
              @hide="hideWorkoutHandle(workout.id)"
              @show="showWorkoutHandle(workout.id)"
              :disabled="workoutHideLoading || workoutShowLoading"
              :is-show-button-visible="
                (subscriptionType === SubscriptionsTierEnum.Silver &&
                  activeWorkoutsLength < 10) ||
                (subscriptionType === SubscriptionsTierEnum.Gold &&
                  activeWorkoutsLength < 15)
              "
            />
          </swiper-slide>
        </swiper>
      </template>
      <base-empty-page
        v-else
        icon="energy"
        title="Library Empty"
        context="You have not uploaded any videos yet..."
        action="Upload your first video"
        @on-click="navigateCreateExercisePage"
      />
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  IonButton,
  IonIcon,
  IonToolbar,
  IonTitle,
  IonSpinner,
} from "@ionic/vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode } from "swiper";
import { useRouter } from "vue-router";
import {
  QueryWorkoutsOrderByColumn,
  SortOrder,
  WorkoutsDocument,
} from "@/generated/graphql";
import { useMutation, useQuery } from "@vue/apollo-composable";
import BaseEmptyPage from "@/general/components/base/BaseEmptyPage.vue";
import { EntitiesEnum } from "@/const/entities";
import WorkoutItem from "@/users/components/Workout.vue";
import { v4 as uuidv4 } from "uuid";
import {
  HideWorkoutDocument,
  WorkoutStatesEnum,
  ShowWorkoutDocument,
  SubscriptionsTierEnum,
} from "@/generated/graphql";
import useSubscription from "@/hooks/useSubscription";

const router = useRouter();
const { type: subscriptionType } = useSubscription();

const VUE_APP_CDN = ref(process.env.VUE_APP_CDN);

const { id } = JSON.parse(localStorage.getItem("user") || "{}");

const { result, loading, refetch } = useQuery(
  WorkoutsDocument,
  {
    trainer_id: id,
    page: 1,
    first: 1000,
    dynamic_search: "",
    orderByColumn: QueryWorkoutsOrderByColumn.CreatedAt,
    order: SortOrder.Desc,
  },
  {
    fetchPolicy: "no-cache",
  }
);

onMounted(() => {
  refetch();
});

const workouts = computed(() => result.value?.workouts?.data || []);

const navigateCreateExercisePage = () => {
  router.push({
    name: EntitiesEnum.TrainerCreateWorkout,
    params: { id: uuidv4() },
  });
};

const hideWorkoutHandle = (id: string) => {
  hideWorkout({ id }).then(() => {
    refetch();
  });
};

const { mutate: hideWorkout, loading: workoutHideLoading } =
  useMutation(HideWorkoutDocument);

const showWorkoutHandle = (id: string) => {
  showWorkout({ id }).then(() => {
    refetch();
  });
};

const { mutate: showWorkout, loading: workoutShowLoading } =
  useMutation(ShowWorkoutDocument);

const openWorkout = (id: string) => {
  if (workoutHideLoading.value || workoutShowLoading.value) return;

  router.push({
    name: EntitiesEnum.TrainerExerciseList,
    params: { id },
  });
};

const activeWorkoutsLength = computed<number>(
  () =>
    workouts.value?.filter(
      (workout: any) => workout.state === WorkoutStatesEnum.Active
    ).length ?? 0
);
</script>

<style scoped lang="scss">
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

.page-header {
  padding-left: 0;
  padding-right: 0;
  --min-height: 24px;
  --padding-top: 24px;
  --padding-bottom: 16px;
}

.title {
  padding: 0;
  font-size: 16px;
  font-family: "Yantramanav";
  font-weight: 500;
  line-height: 1.5;
  color: var(--ion-color-light);
}

.swiper-slide {
  width: 86%;
}

.view-all-btn {
  height: 24px;
  margin: 0 -8px 0 8px;
  font-weight: 400;
  --border-radius: 4px;
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 8px;
  --padding-end: 8px;
}

.header-btn {
  height: 32px;
  margin: 0 5px;
  font-size: 24px;
  display: block;
  min-width: 32px;
  --border-radius: 50% !important;
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

  ion-icon {
    font-size: 1em;
  }

  &__badge {
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: absolute;
    margin: -12px 0 0 4px;
    background: var(--ion-color-danger-tint);
  }
}
</style>
