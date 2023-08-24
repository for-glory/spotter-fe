<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Gym Managers">
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
            <ion-col size="4" class="table-th">
              <ion-text>Full Name</ion-text>
            </ion-col>
            <ion-col size="4" class="table-th">
              <ion-text>Type</ion-text>
            </ion-col>
            <ion-col size="4" class="table-th">
              <ion-text>Availability</ion-text>
            </ion-col>
          </ion-row>
          <ion-row @click="handleViewProfile(manager?.id)" v-for="manager in managerData" :key="manager?.id" class="table-row ion-align-items-center">
            <ion-col size="4" class="table-td">
              <ion-text>{{manager?.first_name + ' ' + manager?.last_name}}</ion-text>
            </ion-col>
            <ion-col size="4" class="table-td">
              <ion-text>{{manager?.type ?? 'Full Time'}}</ion-text>
            </ion-col>
            <ion-col size="4" class="table-td">
              <span
                class="status-text"
                :class="manager?.availability==='available'?'available':'unavailable'"
              >
                {{manager?.availability ?? 'unavailiable'}}
              </span>
            </ion-col>
          </ion-row>
        </ion-grid>
        <div class="membership">
          <ion-title class="title">Membership Summary</ion-title>
          <ion-grid class="block">
            <ion-row>
              <ion-col size="5">
                <summary-item title="Total" keyText="New Signs-up" value="14"/>
              </ion-col>
              <ion-col size="5">
                <summary-item title="Total" keyText="Active" value="60"/>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="5">
                <summary-item title="Today's" keyText="Event counts" value="23"/>
              </ion-col>
              <ion-col size="5">
                <summary-item title="Today's" keyText="Message counts" value="13"/>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="5">
                <summary-item title="Total" keyText="Expiring membership" value="24"/>
              </ion-col>
            </ion-row>
          </ion-grid>
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

const router = useRouter();
const activeTab = ref("subscribers");
const currentFacility = useFacilityStore();
const selectedTab = ref("All");
const { role } = useRoles();
const { id } = useId();

const {
  result,
  loading: loadingUserData,
  onResult: gotUser,
} = useQuery<Pick<Query, "user">>(UserDocument, { id });

const facilities = computed(() => {
  return result.value?.user?.owned_facilities?.map((facility) => facility?.id);
});

const {
  result: managersResult,
  loading: loadingManagersData,
  refetch,
  onResult: gotManagers,
} = useQuery<any>(GetManagersByFacilityDocument, {
  role: "MANAGER",
  facilities,
});

const managerData = ref<any>();

const handleAddGymManager = () => {
  router.push({name: EntitiesEnum.AddManager});
}

const handleViewProfile = (id: string) => {
  router.push({ name: EntitiesEnum.ManagerProfile, params: { id } });
}

onMounted(() => {
  console.log("id:", currentFacility.facility.id);
});

gotUser(({data}) => {
  console.log({data});
  refetch();
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
    color: #ffffff6a;
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

  ion-row {
    justify-content: space-between;
    gap: 24px;
  }
}
.block {
  width: 100%;
  background-color: #262626;
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 1rem 1rem 1rem 1rem;

  ion-row {
    padding-top: 4px;
    padding-bottom: 4px;
  }
}
.title {
  padding: 8px 0px;
  font-size: 1.6rem;
  line-height: 1.3;
  font-weight: 400;
  color: var(--fitnesswhite);
}
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

ion-icon#header {
  width: 18px;
  height: 18px;
}
</style>
