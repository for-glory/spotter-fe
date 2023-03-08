<template>
  <base-layout hide-navigation-menu :content-full-height="false">
    <template #content>
      <search-form
        back-btn
        hidden-cancel
        visible-result
        :type="FacilitiesTrainersTabs.Facilities"
        placeholder="Enter name or address of gym..."
        @handle-item-click="onItemClick"
        customNavigation
        @back="onBack"
      />
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import SearchForm from "@/general/components/forms/SearchForm.vue";
import { FacilitiesTrainersTabs } from "@/ts/enums/user";
import { useRouter } from "vue-router";
import { FacilitySearchResult } from "@/interfaces/FacilitySearchResult";
import { paymentGatewaysStore } from "@/users/store/paymentGatewaysStore";

const router = useRouter();
const store = paymentGatewaysStore();

const onItemClick = (item: FacilitySearchResult) => {
  localStorage.setItem("default-facility", JSON.stringify(item));
  store.setValue("facility", item);
  onBack();
};

const onBack = () => {
  router.go(-1);
};
</script>
<style scoped lang="scss"></style>
