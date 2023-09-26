<template>
  <base-layout>
    <template #header>
      <!-- <search-workouts-form
        purchased
        placeholder="Search workouts..."
        @handle-item-click="onItemClick"
        :route-name="EntitiesEnum.UserPurchasedWorkouts"
      /> -->
      <page-header title="My Library" />
    </template>

    <template #content>
      <div class="content">
        <ion-spinner v-if="loading" name="lines" class="spinner" />
        <div v-else-if="!loading && workouts.length" class="holder-content">
          <div class="page-content ion-padding-horizontal">
            <router-link
              class="workout"
              :key="workout.id"
              v-for="workout in workouts"
              :to="{
                name: EntitiesEnum.UserExercisesList,
                params: { id: workout.id },
              }"
            >
              <workout-item
                class="purchaised-workout"
                :duration="workout.duration"
                :title="workout.title || ''"
                :pathUrl="`${workout?.previewUrl}` || ''"
                :type="workout.type?.name || ''"
                :trainer="
                  `${workout.trainer?.first_name} ${workout.trainer?.last_name}` ||
                  ''
                "
                :showStatus="false"
              />
            </router-link>
          </div>
        </div>
        <base-empty-page
          v-else
          icon="energy"
          title="Library Empty"
          context="You have not purchased videos yet..."
        />
      </div>
    </template>
  </base-layout>

  <page-tabs
    v-if="!loading"
    :tabs="TABS"
    class="page-tabs"
    :value="EntitiesEnum.UserPurchasedWorkouts"
    @change="tabsChanged"
  />
</template>

<script setup lang="ts">
import { IonSpinner } from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { useQuery } from "@vue/apollo-composable";
import { MyWorkoutsDocument } from "@/generated/graphql";
import { computed, onMounted, ref } from "vue";
import PageTabs from "@/general/components/PageTabs.vue";
// import PageTabsNew from "@/general/components/PageTabsNew.vue";
import { TABS } from "@/const/user-workouts-tabs";
import BaseEmptyPage from "@/general/components/base/BaseEmptyPage.vue";
import WorkoutItem from "@/users/components/Workout.vue";

const router = useRouter();
const VUE_APP_CDN = ref(process.env.VUE_APP_CDN);

const { result, loading, refetch } = useQuery(MyWorkoutsDocument, {
  first: 1000,
});

onMounted(() => {
  refetch();
});

const workouts = computed(() => result.value?.myWorkouts?.data || []);

const tabsChanged = (name: EntitiesEnum) => {
  router.push({
    name,
  });
};
</script>

<style lang="scss" scoped>
::v-deep {
  .workout-item {
    padding-bottom: 15px !important;
  }
}
.content {
  padding-top: 24px;
  padding-bottom: 24px;
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

.holder-content {
  padding-bottom: 80px;
}

.swiper-slide {
  width: auto;
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
.purchaised-workout {
  margin-bottom: 20px;
}

.empty-state {
  margin-top: 20vh;
}
</style>
