<template>
  <div :class="{ 'native': !Capacitor.isNativePlatform() }">
    <ion-item class="toolbar-item" style="padding-top: 16px; padding-bottom: 16px;">
      <div 
        class="swiper-header d-flex align-items-center justify-content-between w-100"
      >
        <ion-text class="text">{{ title }}</ion-text>
        <ion-text 
          v-if="workouts?.length"
          class="font-medium font-14 color-gold" 
          style="text-align: end; cursor: pointer;"
          @click="handleSetFilter(queryType)"
        >
          View All
        </ion-text>
      </div>
    </ion-item>
    <swiper
      v-if="workouts?.length"
      free-mode
      slidesPerView="auto"
      :spaceBetween="16"
      :slidesOffsetAfter="16"
      :slidesOffsetBefore="16"
      :modules="[FreeMode]"
    >
      <swiper-slide v-for="workout in workouts" :key="workout.id">
        <workout-item
          :duration="workout.duration"
          :title="workout.title || ''"
          :pathUrl="`${VUE_APP_CDN}${workout.preview}` || ''"
          :type="workout.type?.name || ''"
          :trainer="
            `${workout.trainer?.first_name} ${workout.trainer?.last_name}` ||
            ''
          "
          :id="workout.id"
          :total_revenue="workout.total_revenue"
          :reviews_count="workout.views_count"
          :recommended_count="workout.recommended_count"
          :share="true"
          :hide="true"
          :hidden="workout.state === WorkoutStatesEnum.Hidden"
          @hide="hideDailysItem(workout.id)"
          @show="showDailysItem(workout.id)"
          @click="openViewModal(workout)"
        />
      </swiper-slide>
    </swiper>
    <div v-else class="empty-text">
      <ion-text class="color-gray">{{ title === 'Trending' ? 'No trending dailys yet' : title === 'Most Liked' ? 'No most liked dailys yet' : 'No recent dailys yet' }}</ion-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonButton, IonTitle, IonToolbar } from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import { FreeMode } from "swiper";
import { defineProps, withDefaults, ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Workout, WorkoutStatesEnum } from "@/generated/graphql";
import WorkoutItem from "@/users/components/Workout.vue";
import { Capacitor } from '@capacitor/core';

const VUE_APP_CDN = ref(process.env.VUE_APP_CDN);

withDefaults(
  defineProps<{
    title?: string;
    workouts: Workout;
    queryType: string;
  }>(),
  {
    title: "",
  }
);
const emits = defineEmits<{
  (e: "hide", id: number): void;
  (e: "show", id: number): void;
  (e: "changeFilter", value: string): void;
  (e: "click", daily: any): void;
}>();
const hideDailysItem = (id: number) => {
  emits("hide", id);
};
const showDailysItem = (id: number) => {
  emits("show", id);
};
const handleSetFilter = (value: string) => {
  emits("changeFilter", value);
}
const openViewModal = (daily: any) => {
  emits("click", daily);
}
</script>

<style scoped lang="scss">
.swiper-header {
  --min-height: 24px;
  --padding-top: 32px;
  --padding-bottom: 7px;
  --background: transparent;

  &__btn {
    height: 24px;
    margin: 0 8px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    --padding-top: 0;
    --padding-bottom: 0;
    --padding-start: 8px;
    --padding-end: 8px;

    .modal--fullscreen & {
      display: none;
    }
  }
}

.native {
  .swiper-slide {
    width: 30%;
  }
}

.title {
  padding-left: 17px;
  font: 500 16px/1.5 var(--ion-font-family);
}
.empty-text {
  padding: 20px;
  font-size: 16px;
  width: 100%;
}
.toolbar-item {
  --background: #262626;
}
</style>
