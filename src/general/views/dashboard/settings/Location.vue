<template>
  <ComponentBaseLayout title="Location" sub-title="Set your location" @save="onSubmit"> 
    <template #content>
      <div class="location-wrapper flex-2">
        <choose-block title="Address" :value="selectedGym" @handle-click="openLocationModal" :isLightItem="true"/>
      </div>
      <ChooseLocationModal ref="chooseLocationModal" title="Address" :forAddress="true" :is-web-view="true" @select="addressSelected" />
    </template>
  </ComponentBaseLayout>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import ComponentBaseLayout from "./ComponentBaseLayout.vue";
import ChooseLocationModal from "@/facilities/components/ChooseLocationModal.vue";

const selectedGym = ref(null);
const chooseLocationModal = ref<typeof ChooseLocationModal | null>(null);

const onSubmit = () => {
  console.log('call on submit');
  
}

const openLocationModal = () => {
  console.log('openLocationModal');  
  chooseLocationModal.value?.present({
    title: "Address",
  });
}

const addressSelected = () => {
  console.log("addressSelected");
}

</script>

<style scoped lang="scss">

.location-wrapper {
  max-width: 437px;
  margin-top: 25px;
}
</style>