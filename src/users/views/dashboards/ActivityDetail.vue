<template>
  <BaseLayout hide-navigation-menu>
    <template #header>
      <PageHeader :title="(route?.params?.type as string)" back-btn @back="onBack" />
    </template>
    <template #content>
      <div class="detail-container">
        <template v-for="detail in details">
          <UpcomingItem
            :title="detail.title"
            :days="detail?.days"
            :img-src="detail.imgSrc"
            :is-upcomming="detail?.days ? true : false"
            :is-short-time="detail?.days ? false : true"
            :square-img="detail.squarImg"
          />
        </template>
      </div>
    </template>
  </BaseLayout>
</template>
<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import UpcomingItem from "@/general/components/dashboard/UpcomingItem.vue";
import router from "@/router";
import { useRoute } from "vue-router";

const route = useRoute();

const onBack = () => {
  router.go(-1);
};

const details = [
  {
    id: "1",
    title: "Food festival",
    imgSrc: "assets/backgrounds/food1.png",
    subtitle: "17 june",
    location: "Summer Gym, Wall Street, 24",
    upcomingType: "Upcoming",
    squarImg: true,
  },
  {
    id: "2",
    title: "Tamra Dae",
    imgSrc: "assets/backgrounds/Gym_1.png",
    subtitle: "17 june",
    location: "Summer Gym, Wall Street, 24",
    squarImg: false,
  },
  {
    id: "3",
    title: "Fantastic Gym",
    imgSrc: "assets/backgrounds/Gym_3.png",
    location: "Wall Street, 24",
    days: "7 days left",
    upcomingType: "7 Days",
    squarImg: true,
  },
];
</script>
<style scoped lang="scss">
.detail-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
}
</style>
