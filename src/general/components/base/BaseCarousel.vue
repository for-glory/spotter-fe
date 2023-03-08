<template>
  <swiper
    v-if="itemsWithIds.length"
    free-mode
    slidesPerView="auto"
    :spaceBetween="16"
    :slidesOffsetAfter="slidesOffsetAfter"
    :slidesOffsetBefore="slidesOffsetBefore"
    :modules="[FreeMode]"
  >
    <swiper-slide
      v-if="showStart"
      class="swiper-slide swiper-slide--width-auto"
    >
      <slot name="start"></slot>
    </swiper-slide>
    <swiper-slide
      v-for="item in itemsWithIds"
      :key="item.id"
      class="swiper-slide"
      :class="{ 'swiper-slide--width-auto': widthAuto }"
    >
      <slot :item="item"></slot>
    </swiper-slide>
  </swiper>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode } from "swiper";
import { computed, defineProps, withDefaults } from "vue";
import { v4 as uuidv4 } from "uuid";

const props = withDefaults(
  defineProps<{
    items: Array<Record<string, unknown>> | { value: string; id: string }[];
    slidesOffsetBefore?: number;
    slidesOffsetAfter?: number;
    showStart?: boolean;
    widthAuto?: boolean;
  }>(),
  {
    showStart: false,
    slidesOffsetBefore: 22,
    slidesOffsetAfter: 22,
  }
);

const itemsWithIds = computed(() => {
  return props?.items?.length
    ? props.items.map((item) =>
        item.id ? { ...item } : { ...item, id: uuidv4() }
      )
    : [];
});
</script>

<style scoped lang="scss">
.swiper-slide {
  width: 76%;
  max-width: 380px;
  min-width: 260px;

  &--width-auto {
    width: auto;
    min-width: auto;
    max-width: none;
  }
}
</style>
