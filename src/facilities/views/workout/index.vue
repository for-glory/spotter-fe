<template>
  <base-layout>
    <template #header>
      <div class="banner">
        <ion-title class="banner__title">All workout videos are stored here</ion-title>
        <ion-text class="banner__text">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod 
        </ion-text>
        <div class="banner__background-image">
          <img src="assets/backgrounds/banner1.jpeg" alt="">
        </div>
      </div>
      <div class="workout-list">
        <div class="d-flex justify-content-between workout-list__top">
          <div class="filter-tabs d-flex align-items-center justify-content-between">
            <ion-button 
              :fill="filter === 'all' ? 'solid' : 'outline'"
              :color="filter === 'all' ? '' : 'medium'"
              @click="handleWorkoutFilter('all')"
            >
              All
            </ion-button>
            <ion-button
              :fill="filter === 'most' ? 'solid' : 'outline'"
              :color="filter === 'most' ? '' : 'medium'"
              @click="handleWorkoutFilter('most')"
            >
              Most puchased
            </ion-button>
            <ion-button
              :fill="filter === 'level' ? 'solid' : 'outline'"
              :color="filter === 'level' ? '' : 'medium'"
              @click="handleWorkoutFilter('level')"
            >
              Workout Level
            </ion-button>
          </div>
        </div>
      </div>
    </template>
    <template #content>
      <div
        class="ion-padding-horizontal"
      >
        <ion-spinner
          v-if="
            recommendedLoading ||
            recommendedByTypeLoading ||
            recommendedByBodyLoading
          "
          name="lines"
          class="spinner"
        />
        <div
          class="empty-section"
          v-else-if="!recommendedWorkouts.length"
        >
          <empty-block
            title="Library Empty"
            text="You have not uploaded any videos yet..."
            @button-click="router.push({ name: EntitiesEnum.FacilityCreateWorkout })"
          />
        </div>
        <div class="" v-else>
          <div v-if="filter === 'all'">
            <ion-spinner
              v-if="
                recommendedLoading ||
                recommendedByTypeLoading ||
                recommendedByBodyLoading
              "
              name="lines"
              class="spinner"
            />
            <ion-grid v-else>
              <ion-row>
                <ion-col size="12" size-md="4">
                  <workouts-swiper
                    title="Popular"
                    :workouts="recommendedWorkouts"
                    queryType="recommended"
                  />
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col size="12" size-md="4">
                  <workouts-swiper
                    title="Workout level"
                    :workouts="recommendedWorkoutsByType"
                    queryType="recommendedByType"
                  />
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col size="12" size-md="4">
                  <workouts-swiper
                    title="Muscle group"
                    :workouts="recommendedWorkoutsByBody"
                    queryType="recommendedByBodyParts"
                  />
                </ion-col>
              </ion-row>
            </ion-grid>
          </div>
          <div v-else-if="filter === 'most'">
            <ion-grid>
              <ion-row>
                <ion-col size="12" size-md="4" v-for="workout in recommendedWorkouts" :key="workout.id">
                  <workout-item
                    :duration="workout.duration"
                    :title="workout.title || ''"
                    :pathUrl="`${VUE_APP_CDN}${workout.preview}` || ''"
                    :type="workout.type?.name || ''"
                    :trainer="
                      `${workout.trainer?.first_name} ${workout.trainer?.last_name}` ||
                      ''
                    "
                    :share="true"
                    :hide="true"
                    :hidden="false"
                  />
                  {{ workout }}
                </ion-col>
              </ion-row>
            </ion-grid>
          </div>
          <div v-else>
            <ion-grid>
              <ion-row>
                <ion-col size="12" size-md="4" v-for="workout in recommendedWorkoutsByType" :key="workout.id">
                  <workout-item
                    :duration="workout.duration"
                    :title="workout.title || ''"
                    :pathUrl="`${VUE_APP_CDN}${workout.preview}` || ''"
                    :type="workout.type?.name || ''"
                    :trainer="
                      `${workout.trainer?.first_name} ${workout.trainer?.last_name}` ||
                      ''
                    "
                    :share="true"
                    :hide="true"
                    :hidden="false"
                  />
                </ion-col>
              </ion-row>
            </ion-grid>
          </div>
          <ion-button id="create" @click="router.push({ name: EntitiesEnum.FacilityCreateWorkout })">Create workout plan</ion-button>
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
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import {
  RecommendedWorkoutsDocument,
  RecommendedWorkoutsByBodyPartsDocument,
  RecommendedWorkoutsByTypeDocument,
  WorkoutDocument,
  Workout,
} from "@/generated/graphql";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { ref, computed } from "vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { useRouter } from "vue-router";
import useId from "@/hooks/useId";
import useSubscription from "@/hooks/useSubscription";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import WorkoutsSwiper from "@/facilities/components/WorkoutsSwiper.vue";
import WorkoutItem from "@/users/components/Workout.vue";
// import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";

const VUE_APP_CDN = ref(process.env.VUE_APP_CDN);
const filter = ref<string>('all');

const { id: myId } = useId();
const { type: subscriptionType } = useSubscription();
const currentFacility = useFacilityStore();

const router = useRouter();

const handleWorkoutFilter = (workoutT: string) => {
		filter.value = workoutT;
}


//////////////////////////////////////////////////////
const { result: recommendedResult, loading: recommendedLoading } = useQuery(
  RecommendedWorkoutsDocument,
  {
    page: 1,
    first: 1000,
    facility_id: currentFacility.facility?.id,
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
    facility_id: currentFacility.facility?.id,
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
      facility_id: currentFacility.facility?.id,
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
</script>

<style scoped lang="scss">
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
  width: 100%;
  background: linear-gradient(180deg, #F0E2AE 0%, rgba(251, 248, 234, 0.00) 100%);
  position: relative;
  overflow: hidden;

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
.workout-list {
  background-color: var(--gray-700);
  margin-top: 0;

  &__top {
    padding: 8px 24px;
    .button {
      height: 42px;
    }
  }
}
.filter-tabs {
  width: 100%;
  
  ion-button {
    --border-radius: 100px;
    font: 500 14px/1 Lato;
  }
  
  .selected {
    color: var(--main-color);
  }
  .normal {
    color: var(--grey-text);
  }
}
ion-button#create {
  width: 100%;
  font: 500 16px/1 Yantramanav;
  margin-top: 28px;
}
</style>
