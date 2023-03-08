<template>
  <swiper
    v-if="avatarType === AvatarType.WithPhoto"
    :pagination="true"
    :modules="[Pagination]"
  >
    <swiper-slide
      v-for="photoUrl in photosUrl"
      :key="photoUrl"
      class="facility-photo"
    >
      <ion-img :src="photoUrl"></ion-img>
    </swiper-slide>
  </swiper>
  <ion-title v-else class="initials">
    {{ initials }}
  </ion-title>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper";
import { IonImg, IonTitle } from "@ionic/vue";
import { computed, defineProps } from "vue";
import { AvatarType } from "@/ts/enums/user";
import { getFirstLetters } from "@/utils/textUtils";

const props = defineProps<{
  photosUrl?: string[];
  name: string;
}>();

const avatarType = computed(() => {
  if (!props.photosUrl || !props.photosUrl.length) {
    return AvatarType.WithoutPhoto;
  } else {
    return AvatarType.WithPhoto;
  }
});
const initials = computed(() => getFirstLetters(props.name, " "));
</script>

<style scoped lang="scss">
.facility-photo {
  height: 100%;
  position: relative;

  & > ion-img {
    object-fit: cover;
    height: 100%;
  }
}

.initials {
  width: 100%;
  height: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  text-align: center;
  font-weight: 700;
  font-size: 84px;
  --color: var(--gray-700);
  background-color: var(--gray-600);
}
</style>
