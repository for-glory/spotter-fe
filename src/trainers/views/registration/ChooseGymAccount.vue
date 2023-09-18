<template>
  <base-layout :class="{ 'trainer-gym': role === RoleEnum.Trainer }" hide-navigation-menu>
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
        :placeholder="role=== RoleEnum.Trainer ? 'Enter name or adress of gym...' : undefined"
        hide-results
        extraPadding
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
          :is-selected="facility.isSelected"
          v-for="(facility, index) in facilities"
          @click="onResultItemClick(facility, index)"
          v-else-if="!facilityLoading && facilities?.length"
        >
        <template v-if="facility.isSelected" #check-box>
          <IonCheckbox :checked="facility.isSelected" class="search-check-box" mode="ios" />
        </template>
        
      </search-result>
        <ion-item v-else>
          <ion-label>No results found...</ion-label>
        </ion-item>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonBackButton, IonLabel, IonSpinner, IonItem, IonCheckbox } from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import SearchForm from "@/general/components/forms/SearchForm.vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import {
  FacilitiesDocument,
  FacilitiesQuery,
  FacilitiesQueryVariables,
  RoleEnum,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import { FacilitySearchResult } from "@/interfaces/FacilitySearchResult";
import SearchResult from "@/users/views/facilities/SearchResult.vue";
import { useSelectedAddressStore } from "@/trainers/store/selected-address";
import useRoles from "@/hooks/useRole";

const router = useRouter();
const { role } = useRoles();
const handleBack = () => {
  if(role === RoleEnum.Trainer){
    store.setAssignedFacility(selectFacilities);
  }
  router.go(-1);
};
const searchForm = ref<typeof SearchForm | null>(null);

const searchQuery = ref<string>("");
let selectFacilities:any = null;
const facilitiesParams: FacilitiesQueryVariables = {
  first: 10,
  page: 0,
  search: searchQuery.value.length > 2 ? searchQuery.value : undefined,
};

const store = useSelectedAddressStore();

const onResultItemClick = (facility: FacilitySearchResult, index:number) => {
  if(role === RoleEnum.Trainer)  {
    facilities.value?.map((e, i)=>{
      if(i !== index){
        e.isSelected = false
      }
    })
    facility.isSelected = !facility.isSelected;
    selectFacilities = facility.isSelected ? facility : null;    
  }else {
    store.setAssignedFacility(facility);
    handleBack();
  }
};

const search = (query?: string) => {
  searchQuery.value = query || "";
  facilityRefetch({
    first: 100,
    search: searchQuery.value.length > 2 ? searchQuery.value : undefined,
  });
};

const {
  // result: facilityResult,
  loading: facilityLoading,
  refetch: facilityRefetch,
  onResult: onFacilityResult
} = useQuery<FacilitiesQuery>(FacilitiesDocument, facilitiesParams);
//   const facilities = computed(
//   () => facilityResult.value?.facilities?.data as FacilitySearchResult[]
// );
const facilities = ref<FacilitySearchResult[]>();

onFacilityResult(async ({ data }) => {
  facilities.value = data.facilities?.data.map((e)=> {
    if(e.id === store.assignedFacility?.id){ 
      return {...e, isSelected: true}
    }
    return {...e, isSelected: false}
  });
});
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

.trainer-gym {
  ion-searchbar {
    font-family: Yantramanav;
    font-size: 14px;
    font-style: normal;
    font-weight: 300;
  }
}

  .search-check-box {
    position: absolute;
    right: 24px;
    --size: 24px;
  }

</style>
