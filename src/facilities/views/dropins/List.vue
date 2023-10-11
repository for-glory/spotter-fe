<template>
  <base-layout>
    <template #header>
      <page-header :title="title">
        <template #avatar-field>
          <ion-avatar class="common-avatar-field" @click="openSettings">
            <ion-img v-if="avatarUrl" :src="avatarUrl"></ion-img>
            <template v-else>
              {{ userStore.first_name?.charAt(0) }}
            </template>
          </ion-avatar>
        </template>
        <template #custom-btn>
          <ion-button @click="handleCreate" class="header-btn">
            <ion-icon src="assets/icon/chat.svg" />
            <span class="header-btn__badge" v-if="unreadMessages.length"></span>
          </ion-button>
          <ion-button @click="openQR" class="header-btn">
            <ion-icon src="assets/icon/scan.svg" />
          </ion-button>
        </template>
      </page-header>
      <div class="pass-list ion-margin-top">
        <div class="d-flex justify-content-between pass-list__top">
          <div class="filter-tabs d-flex align-items-center justify-content-center gap-16">
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
          :icon="emptyBlock.icon"
          :title="emptyBlock.title" 
          :text="emptyBlock.text" />
          <ion-button @click="handleCreate">View {{ btnText }}</ion-button>
          <!-- <div class="empty-box d-flex-col align-items-center">
            <ion-icon :src="type === 'pass' ? 'assets/icon/pass.svg' : 'assets/icon/drop-ins.svg'"></ion-icon>
            <ion-text class="status">{{ type === 'pass' ? 'Pass' : 'Drop-in' }} Empty</ion-text>
            <ion-text class="description">No booked client yet</ion-text>
          </div> -->
        </div>
        <div v-else>
          <ion-grid class="pass-table">
            <ion-row class="table-header">
              <ion-col size="4" class="table-th">
                <ion-text>Customers</ion-text>
              </ion-col>
              <ion-col size="4" class="table-th">
                <ion-text>No of day(s)</ion-text>
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
                <ion-text>{{customer?.days}}</ion-text>
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
          <ion-button @click="handleView" id="gym-item">View {{ type === 'pass' ? 'Pass' : 'Drop-in' }}</ion-button>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonIcon,
  IonSpinner,
  IonAvatar,
  IonImg,
  IonGrid,
  IonRow, 
  IonCol,
  IonText
} from "@ionic/vue";
import {
  GetCustomersByFacilityItemsDocument,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import { computed, onMounted, ref } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import useRoles from "@/hooks/useRole";
import { onValue } from "firebase/database";
import { chatsRef } from "@/firebase/db";
import useId from "@/hooks/useId";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { useUserStore } from "@/general/stores/user";
import { useRoute } from "vue-router";

enum TypeEnum {
  Dropins = "dropins",
  Passes = "passes"
}

const router = useRouter();
const activeTab = ref("subscribers");
const currentFacility = useFacilityStore();
const selectedTab = ref("All");
const { role } = useRoles();
const { id } = useId();
const userStore = useUserStore();
const facilityStore = useFacilityStore();
const route = useRoute();
const title = computed(() => {
  switch (route.params?.type) {
    case TypeEnum.Dropins:
      return "Drop-ins"
  
    default:
      return "Gym pass"
  }
});

const btnText = computed(() => {
  switch (route.params?.type) {
    case TypeEnum.Dropins:
      return "Drop-in";
  
    default:
      return "Passes";
  }
});

const emptyBlock = computed(() => {
  switch (route.params?.type) {
    case TypeEnum.Dropins:
      return {
        icon: "assets/icon/drop-ins.svg",
        title: "Customers list Empty" ,
        text: "No Drop-ins sold yet",
      }
  
    default:
    return {
        icon: "assets/icon/gym-user-icon.svg",
        title: "Members list Empty" ,
        text: "No Pass created yet.",
      }
  }
})

const {
  result: customersList,
  loading: loadingCustomers,
  onResult: gotCustomers,
} = useQuery<any>(GetCustomersByFacilityItemsDocument, {
  facility_id: currentFacility?.facility?.id,
  item_type: 'DROPIN'
});
const customerData = ref<any>();

const unreadMessages = ref<number[]>([]);
const avatarUrl = computed(() => {
  return facilityStore.facility?.media
        ? facilityStore.facility?.media[0]?.pathUrl
        : userStore.avatarUrl;
})

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

const onViewChat = () => {
  router.push({ name: EntitiesEnum.ChatList });
};

onMounted(() => {
  console.log(currentFacility.facility.id);
  fetchChats();
});

const handleCreate = () => {
  router.push({ name: route.params.type === TypeEnum.Dropins ? EntitiesEnum.FacilityDropinsList : EntitiesEnum.FacilityPassList });
}

gotCustomers(({ data }) => {
  console.log( data.getCustomersByFacilityItems.data );
  customerData.value = data.getCustomersByFacilityItems.data;
});

const handleView = () => {
  router.push({ name: EntitiesEnum.ViewPassAndDropins, params: { type: 'drop-ins' } },);
}

const onBack = () => {
  router.go(-1);
};

const openQR = () => {
  router.push({name:EntitiesEnum.ProfileScan})
}
const openSettings = () => {
  router.push({
    name: EntitiesEnum.Profile,
  });
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
    padding: 16px 24px;
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
ion-button#gym-item {
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
