<template>
  <div class="w-100 h-100">
    <swiper
      free-mode
      :slidesPerView="1"
      :spaceBetween="32"
      :slidesOffsetAfter="16"
      :slidesOffsetBefore="0"
      :modules="[FreeMode]"
      @swiper="onSwiper"
      class="w-100 h-100"
    >
      <swiper-slide v-for="workout in workouts" :key="workout.id" class="w-100 h-100">
        <my-video-player
          ref="trialVideoPlayer"
          :pathUrl="workout?.video || ''"
          :photoUrl="workout?.previewUrl || ''"
          :height="800"
          :width="400"
          :freeDuration="10"
          :daily="workout"
          :backBtn="false"
          class="trial-video-player"
          @trialEnd="emits('trialEnd', workout.id)"
          :autoplay="workouts[activeIndex].id === workout.id"
        >
        </my-video-player>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { IonButton, IonTitle, IonToolbar } from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import { FreeMode, Swiper as Swipeer } from "swiper";
import { defineProps, withDefaults, ref, computed, onMounted, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Workout } from "@/generated/graphql";
import MyVideoPlayer from "@/general/components/VideoPlayer.vue";
import DailyVideoPlayer from "@/general/components/DailyVideoPlayer.vue";

const VUE_APP_CDN = ref(process.env.VUE_APP_CDN);

const props = defineProps<{
  workouts: any;
}>();

const workouts = computed(() => props.workouts);

const emits = defineEmits<{
  (e: "trialEnd", id: number): void;
}>();

const swiperRef = ref<Swipeer>();
const activeIndex = ref<number>(0);
const id = ref<number>();

const onSwiper = (swiper: any) =>{
  swiperRef.value = swiper;
  id.value = workouts?.value[0]?.id;
  let currentIndex = workouts.value?.findIndex((daily: any) => daily.id === id.value);
  activeIndex.value = currentIndex;
  swiperRef.value?.slideTo(currentIndex);
};

watch(() => swiperRef.value?.activeIndex,
(newVal) => {
  console.log(newVal);
  activeIndex.value = newVal as number;
  id.value = workouts.value[activeIndex.value]?.id;
});

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
