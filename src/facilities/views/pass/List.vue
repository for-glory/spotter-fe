<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Gym pass" />
      <div class="pass-list ion-margin-top">
        <div class="d-flex justify-content-between pass-list__top">
          <div class="filter-tabs d-flex align-items-center justify-content-between">
            <ion-button 
              :fill="selectedTab === 'All' ? 'solid' : 'outline'"
              :color="selectedTab === 'All' ? '' : 'medium'"
              @click="handleSelectTab('All')"
            >
              All
            </ion-button>
            <ion-button
              :fill="selectedTab === 'Active' ? 'solid' : 'outline'"
              :color="selectedTab === 'Active' ? '' : 'medium'"
              @click="handleSelectTab('Active')"
            >
              Active
            </ion-button>
            <ion-button
              :fill="selectedTab === 'Inactive' ? 'solid' : 'outline'"
              :color="selectedTab === 'Inactive' ? '' : 'medium'"
              @click="handleSelectTab('Inactive')"
            >
              Inactive
            </ion-button>
            <ion-button
              :fill="selectedTab === 'Expired' ? 'solid' : 'outline'"
              :color="selectedTab === 'Expired' ? '' : 'medium'"
              @click="handleSelectTab('Expired')"
            >
              Expired
            </ion-button>
          </div>
        </div>
      </div>
    </template>
    <template #content>
      <div class="main-content">
        <div class="empty-pass d-flex-col align-items-center justify-content-center gap-25">
          <ion-button>Create Gym pass</ion-button>
          <div class="empty-box d-flex-col align-items-center">
            <ion-icon src="assets/icon/pass.svg"></ion-icon>
            <ion-text class="status">Gym pass Empty</ion-text>
            <ion-text class="description">No registered member yet</ion-text>
          </div>
        </div>
        <!-- <div class="ion-padding-vertical">
          <ion-button
            @click="navigate(EntitiesEnum.DashboardPassCreatePass)"
            class="ion-margin-end"
            fill="solid"
            >Create Gym pass</ion-button
          >
          <ion-button
            @click="navigate(EntitiesEnum.DashboardPassCreateDropin)"
            class=""
            fill="outline"
            >Create Drop ins</ion-button
          >
        </div> -->
        <!-- <div class="segment">
          <ion-segment mode="ios" value="subscribers">
            <ion-segment-button
              @click="changeSegment('subscribers')"
              value="subscribers"
            >
              <ion-label class="ion-text-wrap"
                >Membership subscribers</ion-label
              >
            </ion-segment-button>
            <ion-segment-button
              @click="changeSegment('dropins')"
              value="dropins"
            >
              <ion-label class="ion-text-wrap">Drop ins sales</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div> -->

        <!-- <div>
          <pass-subscriber-data-table v-if="activeTab === 'subscribers'" />
          <pass-dropin-data-table v-if="activeTab === 'dropins'" />
        </div> -->
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/vue";
import {
  PaymentGatewayRefundDocument,
  Query,
  SettingsCodeEnum,
  TrainingDocument,
  TrainingStatesEnum,
  FacilityItemPassDocument,
} from "@/generated/graphql";
import PassSubscriberDataTable from "@/general/components/dataTables/PassSubscriberDataTable.vue";
import PassDropinDataTable from "@/general/components/dataTables/PassDropinDataTable.vue";
import { useLazyQuery } from "@vue/apollo-composable";
import { chevronBackOutline } from "ionicons/icons";
import { ref } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { useFacilityStore } from "@/general/stores/useFacilityStore";

const router = useRouter();
const activeTab = ref("subscribers");
const currentFacility = useFacilityStore();
const selectedTab = ref("All");

const changeSegment = (segment: string) => {
  activeTab.value = segment;
  console.log("segment: " + segment);
};
const navigate = (name: EntitiesEnum) => {
  router.push({ name });
};

const {
  result: facilityResult,
  load: getFacility,
  onResult: gotFacility,
} = useLazyQuery<Pick<Query, "facilityItemPass">>(FacilityItemPassDocument, {
  id: currentFacility.facility.id,
});

const handleSelectTab = (tabName: string) => {
  selectedTab.value = tabName;
  console.log(selectedTab.value === 'All');
}

const onBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.title {
  padding: 0;
  display: block;
  color: var(--beige);
  font: 400 24px var(--ion-font-family);

  ion-icon {
    margin-right: 8px;
    margin-left: -6px;
  }
}
.main-content {
  padding: 16px 20px;
  width: 100%;
  height: 100%;
}
.pass-list {
  background-color: var(--gray-700);

  &__top {
    margin-bottom: 16px;
    padding: 8px 24px;
    .button {
      height: 42px;
    }
  }
}
.segment {
  margin-bottom: 72px;
  width: fit-content;
}
ion-segment {
  border: 1px solid var(--beige);
  --background: var(--gray-700);
  border-radius: 0;
  width: 230px;
}

ion-segment-button {
  padding: 12px 16px;
  --indicator-color: var(--beige);
  --color: var(--ion-color-light);
  --color-checked: var(--ion-color-dark);
  --border-radius: 0;
  margin: 0 -2px;
}

ion-label {
  font-size: 16px;
}

.filter-tabs {
  width: 100%;
  
  ion-button {
    --border-radius: 100px;
    font: 500 14px/1 Lato;
  }
  
  .selected {
    color: var(--main-color);
  }
  .normal {
    color: var(--grey-text);
  }
}
.d-flex-col {
  display: flex;
  flex-direction: column;
}
.gap-25 {
  gap: 25px;
}

.empty-pass {
  width: 100%;
  height: 100%;

  ion-button {
    width: 100%;
    font: 500 16px/1 Yantramanav;
  }
  .empty-box {

    ion-icon {
      width: 36px;
      height: 36px;
      margin-bottom: 24px;
    }
    
    .status {
      color: var(--ion-gray-500);
      font: 500 24px/1 Yantramanav;
      margin-bottom: 8px;
    }
    .description {
      color: var(--ion-gray-500);
      font: 300 16px/1 Yantramanav;
    }
  }
}

</style>
