<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <ion-back-button
        class="back-btn"
        icon="assets/icon/arrow-back.svg"
        @click="handleBack"
      >
      </ion-back-button>
      <search-form
        ref="searchForm"
        :type="EntitiesEnum.Facilities"
        hide-results
        @search="search"
        hidden-cancel
      />
    </template>
    <template #content>
      <div class="holder-content ion-padding-horizontal">
        <ion-spinner name="lines" class="spinner" v-if="facilityLoading" />
        <search-result
          :item="facility"
          :key="facility.id"
          :showRating="false"
          v-for="facility in facilities"
          @click="onResultItemClick(facility)"
          v-else-if="!facilityLoading && facilities?.length"
        />
        <ion-item v-else>
          <ion-label>No results found...</ion-label>
        </ion-item>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonBackButton, IonLabel, IonSpinner, IonItem } from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import SearchForm from "@/general/components/forms/SearchForm.vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { computed, ref, onMounted } from "vue";
import {
  FacilitiesDocument,
  FacilitiesQuery,
  FacilitiesQueryVariables,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import { FacilitySearchResult } from "@/interfaces/FacilitySearchResult";
import SearchResult from "@/users/views/facilities/SearchResult.vue";
import { useSelectedAddressStore } from "@/trainers/store/selected-address";

const router = useRouter();

const handleBack = () => {
  router.go(-1);
};
const searchForm = ref<typeof SearchForm | null>(null);

const searchQuery = ref<string>("");
const facilitiesParams: FacilitiesQueryVariables = {
  first: 10,
  page: 0,
  search: searchQuery.value.length > 2 ? searchQuery.value : undefined,
};

const store = useSelectedAddressStore();

const onResultItemClick = (facility: FacilitySearchResult) => {
  store.setAssignedFacility(facility);
  handleBack();
};

const search = (query?: string) => {
  searchQuery.value = query || "";
  facilityRefetch({
    first: 100,
    search: searchQuery.value.length > 2 ? searchQuery.value : undefined,
  });
};

const {
  result: facilityResult,
  loading: facilityLoading,
  refetch: facilityRefetch,
} = useQuery<FacilitiesQuery>(FacilitiesDocument, facilitiesParams);

const facilities = computed(
  () => facilityResult.value?.facilities?.data as FacilitySearchResult[]
);

onMounted(() => {
  setTimeout(() => {
    searchForm.value?.setFocus();
  }, 500);
});
</script>

<style lang="scss" scoped>
:deep(.header) {
  display: flex;
  margin-bottom: 30px;
}

:deep(.search-form) {
  position: static;
  flex: 1 1 auto;
  background: var(--ion-background-color);
}

.back-btn {
  height: 32px;
  min-width: 32px;
  margin-left: 12px;
  vertical-align: top;
  display: inline-block;
  margin-top: calc(24px + var(--ion-safe-area-top));
  border-radius: 50%;
  --icon-font-size: 24px;
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  --icon-padding-bottom: 0;
  --icon-padding-end: 0;
  --icon-padding-start: 0;
  --icon-padding-top: 0;
  --min-height: 32px;
  --min-width: 32px;
  --color: var(--ion-color-white);
}

.holder-content {
  padding-bottom: 80px;
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
</style>
