<template>
  <div>
    <ion-toolbar class="header">
      <ion-title slot="start" class="title">{{ title }}</ion-title>
      <ion-button slot="end" fill="clear" color="primary" class="header__btn">
        <router-link
          :to="{
            name: EntitiesEnum.UserWorkoutList,
            query: { type: queryType },
          }"
        >
          View All
        </router-link>
      </ion-button>
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
        <router-link
          :to="{
            name: EntitiesEnum.UserWorkout,
            params: { id: workout.id },
          }"
        >
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
        </router-link>
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
import { Workout } from "@/generated/graphql";
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
</script>

<style scoped lang="scss">
.header {
  margin-bottom: 8px;
  --min-height: 24px;
  --padding-top: 32px;
  --padding-bottom: 7px;

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
  width: 86%;
}

.title {
  padding-left: 17px;
  font: 500 16px/1.5 var(--ion-font-family);
}
</style>
