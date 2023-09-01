<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack">
        <template #custom-btn>
          <ion-button @click="handleCreate" class="header-btn">
            <ion-icon src="assets/icon/three-dot.svg" />
          </ion-button>
        </template>
      </page-header>
    </template>
    <template #content>
      <div>
        {{
          dailysItemStore.workoutTitle
        }}
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
  WorkoutsByFacilityDocument,
  RecommendedWorkoutsByBodyPartsDocument,
  RecommendedWorkoutsByTypeDocument,
  WorkoutDocument,
  Workout,
  HideWorkoutDocument,
  ShowWorkoutDocument,
} from "@/generated/graphql";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { ref, computed } from "vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode } from "swiper";
import useId from "@/hooks/useId";
import useSubscription from "@/hooks/useSubscription";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import { useDailysItemStore } from "@/general/stores/useDailysItemStore";
// import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";

const VUE_APP_CDN = ref(process.env.VUE_APP_CDN);
const tab = ref<string>('analytics');

const { id: myId } = useId();
const { type: subscriptionType } = useSubscription();
const currentFacility = useFacilityStore();
const dailysItemStore = useDailysItemStore();
const router = useRouter();

const onBack = () => {
  router.go(-1);
};
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
</style>
