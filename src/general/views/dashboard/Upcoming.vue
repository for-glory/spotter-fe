<template>
  <div class="upcoming-container">

<WebHeader :back-btn="true" :title="title" @back="goBack"/>

<div class="content">
  <UpcomingItem
            v-for="event in items"
            :key="event.id"
            :title="event.title"
            :subtitle="event.subtitle"
            :img-src="event.imgSrc"
            :location="event.location"
            :days="event?.days"
            :is-upcomming="event?.upcomingType ? true : false"
            :upcoming-type="event?.upcomingType"
            :square-img="isSquareImg"
            :role="role"
            />
  <!-- <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/>
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
  <UpcomingItem :is-upcomming="type === 'Events' ? false : true" :square-img="isSquareImg"/> -->
</div>
</div>

</template>
<script setup lang="ts">
import WebHeader from "@/general/components/blocks/headers/WebHeader.vue"
import UpcomingItem from "@/general/components/dashboard/UpcomingItem.vue";
import { computed, ref } from "vue";
import {  useRoute, useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { dummyDropins, dummyPasses, dummyTraings, upcomingEvent } from "@/const/users";
import useRoles from "@/hooks/useRole";

const route = useRoute();
const router = useRouter();
const { role } = useRoles()
let type:string;
let isSquareImg = true;
if(route.params.type === 'tranings'){
  type = 'Tranings';
} else{
  type = 'Events';
  isSquareImg = true;  
}
const items = ref<any>(dummyTraings)
const title = computed(()=> {
  if (route.params.type === 'tranings') {
    items.value = dummyTraings
    isSquareImg = false;  
    return 'Upcoming Tranings';
  } else if (route.params.type === 'events') {
    items.value = upcomingEvent
    return 'Upcoming Events';
  } else if (route.params.type === EntitiesEnum.Facilities) {
    items.value = dummyPasses;
    return 'My Passes';
  } else if (route.params.type === EntitiesEnum.FacilityDropins) {
    items.value = dummyDropins
    return 'My Drop-ins';
  } else if(route.params.type === EntitiesEnum.Trainings){
    items.value = dummyTraings;
    isSquareImg = false;  
    return 'My Tranings';
  } else if(route.params.type === EntitiesEnum.Events){
    items.value = upcomingEvent
    return 'My Events';
  }
})

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