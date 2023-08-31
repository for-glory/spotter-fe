<template>
  <base-layout>
    <template #header>
      <div class="banner">
        <ion-title class="banner__title">All dailys are stored here</ion-title>
        <ion-text class="banner__text">
          A centralized space where all your daily workout videos are securely stored. Accessible, organized, and always ready to inspire your others.
        </ion-text>
        <div class="banner__background-image">
          <img src="assets/backgrounds/Banner_3.png" alt="">
        </div>
      </div>
      <div class="workout-list" v-if="viewMode === 'list'">
        <div class="d-flex justify-content-around workout-list__top">
          <div class="filter-tabs d-flex align-items-center justify-content-center">
            <ion-button 
              :fill="tab === 'analytics' ? 'solid' : 'outline'"
              :color="tab === 'analytics' ? '' : 'medium'"
              @click="setTab('analytics')"
            >
              Analytics
            </ion-button>
            <ion-button
              :fill="tab === 'dailys' ? 'solid' : 'outline'"
              :color="tab === 'dailys' ? '' : 'medium'"
              @click="setTab('dailys')"
            >
              Dailys
            </ion-button>
          </div>
        </div>
      </div>
    </template>
    <template #content>
      <div
        class="ion-padding-horizontal height-100"
      >
        <!-- <ion-spinner
          v-if=""
          name="lines"
          class="spinner"
        /> -->
        <div
          class="empty-section"
          v-if="viewMode === 'create'"
        >
          <empty-block
            title="Library Empty"
            text="You have not uploaded any videos yet..."
            buttonText="Create Dailys"
            icon="assets/icon/daily.svg"
            @button-click="router.push({ name: EntitiesEnum.FacilityCreateWorkout })"
          />
        </div>
        <div class="" v-else>
          <div v-if="tab === 'analytics'">

          </div>
          <div v-else>
            <!-- <ion-grid>
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
                </ion-col>
              </ion-row>
            </ion-grid>
            <ion-button id="create" @click="router.push({ name: EntitiesEnum.FacilityCreateWorkout })">Create Dailys</ion-button> -->
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

// remove this after connecting api
const viewMode = 'list';

const VUE_APP_CDN = ref(process.env.VUE_APP_CDN);
const tab = ref<string>('analytics');

const { id: myId } = useId();
const { type: subscriptionType } = useSubscription();
const currentFacility = useFacilityStore();

const router = useRouter();

const setTab = (workoutT: string) => {
		tab.value = workoutT;
}

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

ion-button#create {
  width: 100%;
  font: 500 16px/1 Yantramanav;
  margin-top: 28px;
}
</style>
