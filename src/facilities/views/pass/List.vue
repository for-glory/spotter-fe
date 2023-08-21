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
        <div v-if="!tempPassData" class="empty-pass d-flex-col align-items-center justify-content-center gap-25">
          <ion-button @click="onCreate">Create Gym pass</ion-button>
          <div class="empty-box d-flex-col align-items-center">
            <ion-icon src="assets/icon/pass.svg"></ion-icon>
            <ion-text class="status">Gym pass Empty</ion-text>
            <ion-text class="description">No registered member yet</ion-text>
          </div>
        </div>
        <div v-else>
          <ion-grid class="pass-table">
            <ion-row class="table-header">
              <ion-col size="4" class="table-th">
                <ion-text>Customers</ion-text>
              </ion-col>
              <ion-col size="4" class="table-th">
                <ion-text>Plan</ion-text>
              </ion-col>
              <ion-col size="4" class="table-th">
                <ion-text>Status</ion-text>
              </ion-col>
            </ion-row>
            <ion-row v-for="customer in customerData" :key="customer?.id" class="table-row ion-align-items-center">
              <ion-col size="4" class="table-td">
                <ion-text>{{customer?.name}}</ion-text>
              </ion-col>
              <ion-col size="4" class="table-td capitalize">
                <ion-text>{{customer?.plan.toLowerCase()}}</ion-text>
              </ion-col>
              <ion-col size="4" class="table-td">
                <ion-button
                  size="small"
                  :color="customer?.status==='active'?'success':customer?.status==='inactive'?'danger':'warning'"
                  class="button-rounded capitalize"
                  fill="outline"
                >
                  {{customer?.status}}
                </ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
          <ion-button id="gym-pass" @click="onCreate">Create Gym pass</ion-button>
          <ion-button id="gym-pass">View Gym pass</ion-button>
        </div>
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
import { computed, onMounted, ref } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import useFacilityId from "@/hooks/useFacilityId";
import useRoles from "@/hooks/useRole";
import { v4 as uuidv4 } from "uuid";

const router = useRouter();
const activeTab = ref("subscribers");
const currentFacility = useFacilityStore();
const selectedTab = ref("All");
const { role } = useRoles();
const { id: myFacilityId } = useFacilityId();
const tempPassData = [
  {
    id: uuidv4(),
    name: "Frank Autumn",
    plan: "GOLD",
    status: "active",
  },{
    id: uuidv4(),
    name: "Jimmy Jane",
    plan: "SILVER",
    status: "pending",
  },{
    id: uuidv4(),
    name: "Jimmy Jane",
    plan: "BRONZE",
    status: "inactive",
  },{
    id: uuidv4(),
    name: "Jimmy Jane",
    plan: "GOLD",
    status: "active",
  },{
    id: uuidv4(),
    name: "Jimmy Jane",
    plan: "GOLD",
    status: "pending",
  },{
    id: uuidv4(),
    name: "Jimmy Jane",
    plan: "SILVER",
    status: "pending",
  },{
    id: uuidv4(),
    name: "Jimmy Jane",
    plan: "BRONZE",
    status: "pending",
  },
];
const customerData = ref<any>();
customerData.value = tempPassData;

const changeSegment = (segment: string) => {
  activeTab.value = segment;
  console.log("segment: " + segment);
};
const navigate = (name: EntitiesEnum) => {
  router.push({ name });
};

const {
  result: facilityPassResult,
  load: getFacilityPass,
  onResult: gotFacilityPass,
} = useLazyQuery<Pick<Query, "facilityItemPass">>(FacilityItemPassDocument, {
  id: myFacilityId,
});

const handleSelectTab = (tabName: string) => {
  selectedTab.value = tabName;
  customerData.value = tempPassData.filter((data) => selectedTab.value === 'All' || data.status === selectedTab.value?.toLocaleLowerCase());
}

onMounted(() => {
  console.log(getFacilityPass());
  console.log("id:", myFacilityId);
  console.log(facilityPassResult);
});

const onCreate = () => {
  router.push({ name: EntitiesEnum.FacilityCreatePass });
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
  overflow-y: scroll;
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
.pass-table {
  border: 1px solid var(--fitnesswhite);
  background: var(--gray-700);
  width: 100%;
  padding: 0;

  .table-th {
    border-bottom: 1px solid var(--beige);
    padding: 10px 16px;
  }

  .table-td {
    //  border: 1px solid var(--beige);
    padding: 0 0 0 16px;

    ion-button {
      font-size: 14px;
      height: 32px;
      margin: 16px 0;
    }
  }
}
.table-header {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: var(--main-color);
  color: var(--gold);
}

.table-row {
  border-top: 1px solid var(--beige);
}

.capitalize {
  text-transform: capitalize;
}
ion-button#gym-pass {
  width: 100%;
  font: 500 16px/1 Yantramanav;
  margin-top: 28px;
}
</style>
