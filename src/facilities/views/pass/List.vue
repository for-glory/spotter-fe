<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Passes">
        <template #custom-btn>
          <ion-button @click="handleCreate" class="header-btn">
            <ion-icon src="assets/icon/plus.svg" />
            <span class="header-btn__badge" v-if="unreadMessages.length"></span>
          </ion-button>
        </template>
      </page-header>
      <div v-if="!loadingCustomers && customersList?.getCustomersByFacilityItems?.data?.length" class="pass-list ion-margin-top">
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
          </div>
        </div>
      </div>
    </template>
    <template #content>
      <ion-spinner
        v-if="loadingCustomers"
        name="lines"
        class="spinner"
      />
      <div v-else class="main-content">
        <div v-if="!customersList.getCustomersByFacilityItems?.data?.length" class="empty-pass d-flex-col align-items-center justify-content-center gap-25">
          <EmptyBlock 
          hide-button
          icon="assets/icon/gym-user-icon.svg"
          title="Pass List is Empty" 
          text="No Pass created yet." />
          <ion-button @click="handleCreate">Create Passes</ion-button>
          <!-- <div class="empty-box d-flex-col align-items-center">
            <ion-icon src="assets/icon/pass.svg"></ion-icon>
            <ion-text class="status">Passes Empty</ion-text>
            <ion-text class="description">No registered member yet</ion-text>
          </div> -->
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
                <ion-text>{{customer?.user?.first_name + ' ' + customer?.user?.last_name}}</ion-text>
              </ion-col>
              <ion-col size="4" class="table-td capitalize">
                <ion-text>{{customer?.plan?.toLowerCase() ?? 'Gold'}}</ion-text>
              </ion-col>
              <ion-col size="4" class="table-td">
                <ion-button
                  size="small"
                  :color="customer?.is_active_pass?'success':'warning'"
                  class="button-rounded capitalize"
                  fill="outline"
                >
                  {{customer?.is_active_pass ? 'active' : 'inactive'}}
                </ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
          <ion-button @click="handleView" id="gym-pass">View Passes</ion-button>
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
  IonSpinner
} from "@ionic/vue";
import {
  PaymentGatewayRefundDocument,
  Query,
  SettingsCodeEnum,
  TrainingDocument,
  TrainingStatesEnum,
  GetCustomersByFacilityItemsDocument,
} from "@/generated/graphql";
import { useLazyQuery, useQuery } from "@vue/apollo-composable";
import { chevronBackOutline } from "ionicons/icons";
import { computed, onMounted, ref } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import useFacilityId from "@/hooks/useFacilityId";
import useRoles from "@/hooks/useRole";
import { v4 as uuidv4 } from "uuid";
import { onValue } from "firebase/database";
import { chatsRef } from "@/firebase/db";
import useId from "@/hooks/useId";
import EmptyBlock from "@/general/components/EmptyBlock.vue";

const router = useRouter();
const activeTab = ref("subscribers");
const currentFacility = useFacilityStore();
const selectedTab = ref("All");
const { role } = useRoles();
const { id } = useId();

const {
  result: customersList,
  loading: loadingCustomers,
  onResult: gotCustomers,
} = useQuery<any>(GetCustomersByFacilityItemsDocument, {
  facility_id: currentFacility?.facility?.id,
  item_type: 'PASS'
});
const customerData = ref<any>();

const unreadMessages = ref<number[]>([]);

const handleSelectTab = (tabName: string) => {
  selectedTab.value = tabName;
  customerData.value = customersList.value.getCustomersByFacilityItems.data.filter((data: any) => selectedTab.value === 'All' || (data.is_active_pass && selectedTab.value?.toLocaleLowerCase() === 'active'));
}

const fetchChats = () => {
  if (unreadMessages.value.length) unreadMessages.value = [];
  onValue(chatsRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const chat = childSnapshot.val();
      if (chat.unread && chat.unread[id]) {
        unreadMessages.value.push(chat.unread[id]);
      }
    });
  });
};

onMounted(() => {
  console.log(currentFacility.facility.id);
  fetchChats();
});

const handleCreate = () => {
  router.push({ name: EntitiesEnum.CreateItem, params: { type: 'pass' } });
}

gotCustomers(({ data }) => {
  console.log( data.getCustomersByFacilityItems.data );
  customerData.value = data.getCustomersByFacilityItems.data;
  console.log(customersList.value.getCustomersByFacilityItems.data);
});

const handleView = () => {
  router.push({ name: EntitiesEnum.ViewPassAndDropins, params: { type: 'pass' } },);
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
      color: var(--dark-gray);
      font-family: Lato;
      font-size: 16px;
      font-weight: 500;
      min-height: 48px;
      margin: 20px 0;
    }  .empty-box {

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
.header-btn {
  height: 32px;
  margin: 0 5px;
  font-size: 24px;
  display: block;
  min-width: 32px;
  --border-radius: 50% !important;
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

  ion-icon {
    font-size: 1em;
  }
}
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
</style>
