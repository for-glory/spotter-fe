<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Teams">
        <template #custom-btn>
          <ion-icon id="header" @click="handleAddGymManager" src="assets/icon/plus.svg" />
        </template>
      </page-header>
    </template>
    <template #content>
      <ion-spinner
          v-if="loadingManagersData || loadingUserData"
          name="lines"
          class="spinner"
        />
      <div v-else class="main-content">
        <ion-grid class="managers-table" v-if="managerData?.length > 0">
          <ion-row class="table-header">
            <ion-col size="5" class="table-th">
              <ion-text>Full Name</ion-text>
            </ion-col>
            <ion-col size="4" class="table-th">
              <ion-text>Type</ion-text>
            </ion-col>
            <ion-col size="3" class="table-th">
              <ion-text>Phone</ion-text>
            </ion-col>
          </ion-row>
          <ion-row @click="handleViewProfile(manager)" v-for="manager in managerData" :key="manager?.id" class="table-row">
            <ion-col size="5" class="table-td">
              <div class="d-flex-col name-wrapper">
                <ion-text class="name">{{ (manager?.first_name || manager?.last_name) ? manager?.first_name + ' ' + manager?.last_name : "N/A" }}</ion-text>
                <span class="email">{{ manager?.email }}</span>
              </div>
            </ion-col>
            <ion-col size="4" class="table-td">
              <ion-text class="color-60">{{ manager?.type ?? 'Full Time' }}</ion-text>
            </ion-col>
            <ion-col size="3" class="table-td" id="status">
              <ion-text>N/A</ion-text>
              <!-- <span
                class="status-text"
                :class="manager?.availability==='available'?'available':'unavailable'"
              >
                {{ manager?.availability ?? 'unavailiable' }}
              </span> -->
            </ion-col>
          </ion-row>
        </ion-grid>
        <div class="membership">
          <ion-title class="title">Membership Summary</ion-title>
          <div class="block">
            <!-- <table class="custom-table">
              <tr>
                <td> -->
                  <summary-item title="Total" keyText="Drop-ins" value="14" />
                <!-- </td>
                <td> -->
                  <summary-item title="Total" keyText="Gym pass" value="60" />
                <!-- </td>
              </tr>
              <tr>
                <td> -->
                  <summary-item title="Today's" keyText="Event counts" value="23" />
                <!-- </td>
                <td> -->
                  <summary-item title="Today's" keyText="Message counts" value="13" />
                <!-- </td>
              </tr>
              <tr>
                <td> -->
                  <summary-item title="Total" keyText="Dailys" value="24" />
                <!-- </td>
              </tr>
            </table> -->
          </div>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import {
  IonIcon,
  IonSpinner,
  IonRow,
  IonCol,
  IonText
} from "@ionic/vue";
import {
  Query,
  GetManagersByFacilityDocument,
  UserDocument,
  RoleEnum
} from "@/generated/graphql";
import { useLazyQuery } from "@vue/apollo-composable";
import { chevronBackOutline } from "ionicons/icons";
import { computed, onMounted, ref } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import useFacilityId from "@/hooks/useFacilityId";
import useRoles from "@/hooks/useRole";
import { v4 as uuidv4 } from "uuid";
import SummaryItem from "@/general/components/dashboard/SummaryItem.vue";
import { useQuery } from "@vue/apollo-composable";
import useId from "@/hooks/useId";
import { useManagerStore } from "@/facilities/store/manager";
import { useUserStore } from "@/general/stores/user";

const router = useRouter();
const activeTab = ref("subscribers");
const currentFacility = useFacilityStore();
const selectedTab = ref("All");
const { role } = useRoles();
const { id } = useId();
const store = useManagerStore();
const userStore = useUserStore();

const {
  result: managersResult,
  loading: loadingManagersData,
  refetch,
  onResult: gotManagers,
} = useQuery<any>(GetManagersByFacilityDocument, {
  role: "MANAGER",
  facilities: userStore.owned_facilities.map((facility: any) => facility.id),
});

const managerData = ref<any>();

const handleAddGymManager = () => {
  router.push({name: EntitiesEnum.AddManager});
}

const handleViewProfile = (manager: any) => {
  store.setName(manager?.first_name, manager?.last_name);
  store.setAddress(manager?.address?.lat, manager?.address?.lng, manager?.address?.street);
  store.setAvatarUrl(manager?.avatarUrl);
  router.push({ name: EntitiesEnum.ManagerProfile, params: { id: manager.id } });
}

onMounted(() => {
  console.log("********", userStore.owned_facilities);
});

gotManagers(({data}) => {  
  console.log({data});
  managerData.value = data.managers.data;
})

const onBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.main-content {
  padding: 16px 20px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
.managers-table {
  border: 1px solid #E1DBC5;
  background: var(--gray-700);
  width: 100%;
  padding: 0;
  margin-top: 14px;
}
.table-header {
  background-color: var(--main-color);
  color: var(--gold);
  border-bottom: 1px solid var(--beige);

  ion-col {
    padding: 7px 15px 7px;
    border: 1px solid;
    // border-color: #E1DBC5;
  }
  ion-text {
    font: 14px/1 Lato;
    color: #E1DBC5;
  }
}
.table-row {
  // border-top: 1px solid var(--beige);
  ion-col {
    padding: 15px 15px;
    border: 1px solid var(--beige);
  }
  ion-text {
    color: var(--gray-60);
    font: 12px/1 Lato;
  }
}
.status-text {
  border-radius: 16px;
  height: 20px;
  text-transform: capitalize;
  font: 10px/1 Lato;
}
.available {
  color: #2ED47A;
  border: solid 1px #2ED47A;
  padding: 2px 8px;
}
.unavailable {
  color: #FFB946;
  border: solid 1px #FFB946;
  padding: 2px 8px;
}
.membership {
  margin-top: 16px;
}

.count {
  font-size: 1.625rem;
  color: var(--gold);
  padding-left: 0.6rem;
  font-weight: bold;
}

.period {
  font-size: 1rem;
  color: grey;
  padding-bottom: 0.6rem;
}

.time {
  font-size: 0.875rem;
  color: var(--gold);
}

.content {
  font-size: 1rem;
  color: #797979;
}

.block {
  width: 100%;
  background-color: #262626;
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 26px 14px 16px 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 18px;
  row-gap: 25px;
}

.title {
  padding: 8px 0px;
  color: var(--fitnesswhite);
  font-family: Lato;
  font-size: 16px;
  font-weight: 600;
}
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

td {
  padding: 5px;
}
.custom-table {
  border-spacing: 10px;
}

ion-col#status {
  background-color: #19191B;
  text-align: center;
}


ion-icon#header {
  width: 18px;
  height: 18px;
}

.name-wrapper {
  .name {
    color: var(--gray-60);
    font-family: Lato;
    font-size: 14px;
    font-weight: 600;
  }

  .email {
    color: var(--gray-60);
    font-family: Lato;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
  }
}
</style>
