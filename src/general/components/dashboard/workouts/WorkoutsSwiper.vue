<template>
  <div>
    <div 
      class="swiper-header d-flex align-items-center justify-content-between w-100"
      style="padding-top: 16px; padding-bottom: 16px;"
    >
      <ion-title slot="start" class="title">{{ title }}</ion-title>
      <ion-text 
        class="font-medium font-14 color-gold" 
        style="text-align: end; cursor: pointer;"
        @click="handleSetFilter(queryType)"
      >
        View All
      </ion-text>
    </div>
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
  margin-bottom: 8px;
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

.swiper-slide {
  width: 30%;
}

.title {
  padding-left: 17px;
  font: 500 16px/1.5 var(--ion-font-family);
}
</style>
