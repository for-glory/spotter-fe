<template>
  <div class="upcoming-container">

<WebHeader :back-btn="true" :title="`Upcoming ${type}`" @back="goBack"/>

<div class="content">
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
</div>
</div>

</template>
<script setup lang="ts">
import WebHeader from "@/general/components/blocks/headers/WebHeader.vue"
import UpcomingItem from "@/general/components/dashboard/UpcomingItem.vue";
import {  useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter()
let type:string;
let isSquareImg = false;
if(route.params.type === 'tranings'){
  type = 'Tranings';
  isSquareImg = false;  
} else{
  type = 'Events';
  isSquareImg = true;  
}
// ? 'Tranings' : 'Events';

const goBack = () => {
  router.go(-1)

}

</script>
<style lang="scss" scoped>

.upcoming-container {
    padding: 40px 108px 0 55px;
    overflow: auto;
    height: 100%;
  .content{
    margin-top: 50px;
    padding-bottom: 80px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-column-gap: 16px;
    grid-row-gap: 6px;
  }
}
</style>