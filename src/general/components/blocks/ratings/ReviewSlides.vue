<template>
  <swiper
    free-mode
    slidesPerView="auto"
    :spaceBetween="16"
    :slidesOffsetAfter="16"
    :slidesOffsetBefore="16"
    :modules="[FreeMode]"
  >
    <swiper-slide
      v-for="review in reviews"
      :key="review.id"
      class="review-slide"
    >
      <review-item
        :date="review.date"
        :avatar-url="review.avatarUrl"
        :rating="review.rating"
        :full-name="review.fullName"
        :text="review.text"
        heightFixed
      />
    </swiper-slide>
  </swiper>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode } from "swiper";
import { defineProps } from "vue";
import ReviewItem from "@/general/components/blocks/ratings/ReviewItem.vue";
import { Review } from "@/ts/types/user";

defineProps<{
  reviews: Review[];
}>();
</script>

<style scoped>
.review-slide {
  width: 85%;
}
</style>
