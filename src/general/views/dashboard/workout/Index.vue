<template>
	<div
		class="holder-content ion-padding-horizontal"
		:class="{ 'holder-content--empty': !loading && !workouts.length }"
	>
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
				<div>
					<ion-button class="button-rounded" :fill="filter === 'all'?'solid':'outline'" @click="handleWorkoutFilter('all')">
						All
					</ion-button>
					<ion-button class="button-rounded" :fill="filter === 'most'?'solid':'outline'" @click="handleWorkoutFilter('most')">
						Most purchased
					</ion-button>
					<ion-button class="button-rounded" :fill="filter === 'level'?'solid':'outline'" @click="handleWorkoutFilter('level')">
						Workout level
					</ion-button>
				</div>
				<div>
					<ion-button @click="router.push({ name: EntitiesEnum.DashboardCreateWorkout })">
						Create Workout plan
					</ion-button>
				</div>
			</div>
      <div v-if="workouts.length">
      </div>
		</div>
		<ion-spinner
			v-if="loading"
			name="lines"
			class="spinner"
		/>
		<div
			class="empty-section"
			v-if="!loading && !workouts.length"
		>
			<empty-block
				title="Library Empty"
				hideButton
				text="You have not uploaded any videos yet..."
				@button-click="router.push({ name: EntitiesEnum.DashboardCreateWorkout })"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonSpinner,
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import {
  WorkoutsDocument,
  QueryWorkoutsOrderByColumn,
  RoleEnum,
  SortOrder,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import { ref, onMounted, computed } from "vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { useRouter } from "vue-router";
import useId from "@/hooks/useId";
import useFacilityId from "@/hooks/useFacilityId";
// import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";

const filter = ref<string>('all');

const { id: myId } = useId();
const { id: myFacilityId } = useFacilityId();
const { role: myRole } = useRoles();

const { id } = JSON.parse(localStorage.getItem("user") || "{}");

const { result, loading, refetch } = useQuery(
  WorkoutsDocument,
  {
    trainer_id: myId,
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

const router = useRouter();

const handleWorkoutFilter = (workoutT: string) => {
		filter.value = workoutT;
}
</script>

<style scoped lang="scss">
.holder-content {
  padding-top: 24px;
  padding-bottom: 16px;

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
  border-radius: 12px;
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
</style>
