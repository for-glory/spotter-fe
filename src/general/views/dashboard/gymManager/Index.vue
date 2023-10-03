<template>
	<div
    v-if="!Capacitor.isNativePlatform()"
		class="holder-content ion-padding-horizontal"
		:class="{ 'holder-content--empty': !loading }"
    id="main-content"
	>
    <div class="banner">
      <ion-title class="banner__title">Teams</ion-title>
    </div>
    <div class="content-container">
      <div class="content-box d-flex justify-content-end tool-bar">
        <ion-menu-toggle :auto-hide="false">
          <ion-button expand="block">Invite Team Member</ion-button>
        </ion-menu-toggle>
      </div>
      <ion-spinner
        v-if="loading"
        name="lines"
        class="spinner"
      />
      <div class="d-flex justify-content-between" v-else>
        <div class="flex-auto">
          <table class="manager-table">
            <thead>
              <tr class="table-header">
                <th class="table-th top-left">
                  <ion-text>Name</ion-text>
                </th>
                <th class="table-th">
                  <ion-text>Employment type</ion-text>
                </th>
                <th class="table-th">
                  <ion-text>E-mail</ion-text>
                </th>
                <th class="table-th">
                  <ion-text>Phone no</ion-text>
                </th>
                <th class="table-th top-right">
                  <ion-text>Edit</ion-text>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="table-row" v-for="manager in managers" :key="manager.id">
                <td class="table-td">
                  <ion-text>{{ `${manager.first_name} ${manager.last_name}` }}</ion-text>
                </td>
                <td class="table-td">
                  <ion-text>{{ manager.employment_type }}</ion-text>
                </td>
                <td class="table-td">
                  <ion-text>${{ manager.email }}</ion-text>
                </td>
                <td class="table-td">
                  <ion-text>{{ manager.phone }}</ion-text>
                </td>
                <td class="table-td edit-btn">
                  <ion-button expand="block" fill="outline" @click="handleEdit(manager.id)" class="edit-button">
                    <ion-icon slot="icon-only" src="assets/icon/three-dot.svg"></ion-icon>
                  </ion-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
	</div>
  <base-layout v-else>
    <template #header>
      <page-header back-btn @back="onBack" title="Teams">
        <template #custom-btn>
          <ion-button
            class="header-btn"
          >
            <ion-icon src="assets/icon/plus.svg" />
          </ion-button>
        </template>
      </page-header>
    </template>
    <template #content>
      <div class="main-content">
        <ion-grid class="pass-table">
          <ion-row>
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
          <ion-row id="body" v-for="manager in managers" :key="manager?.id" class="table-row ion-align-items-center">
            <ion-col size="4" class="table-td">
              <ion-text>{{manager?.name}}</ion-text>
            </ion-col>
            <ion-col size="4" class="table-td capitalize">
              <ion-text>{{manager?.type?.toLowerCase()}}</ion-text>
            </ion-col>
            <ion-col size="4" class="table-td">
              <ion-text
                :class="manager.availability === 'available' ? 'available' : 'unavailable'"
              >
                {{manager?.availability}}
              </ion-text>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-title class="title">Membership Summary</ion-title>
        <div class="content-box content-box__membership flex-auto">
          <ion-grid>
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
  IonSpinner,
  IonGrid,
  IonText,
  IonTitle,
  IonIcon,
  IonMenuToggle,
  IonRow,
  IonCol
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import {
  GetManagersByFacilityDocument,
  QueryWorkoutsOrderByColumn,
  RoleEnum,
  SortOrder,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import useId from "@/hooks/useId";
import useFacilityId from "@/hooks/useFacilityId";
// import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";
import SummaryItem from "@/general/components/dashboard/SummaryItem.vue";
import CustomChart from "@/general/components/dashboard/CustomChart.vue";
import { Capacitor } from '@capacitor/core';
import { v4 as uuidv4 } from "uuid";
import { useFacilityStore } from "@/general/stores/useFacilityStore";


const filter = ref<string>('profile');
const currentFacility = useFacilityStore();

const { result, loading } = useQuery(GetManagersByFacilityDocument, {
  facilities: [currentFacility.facility?.id],
  role: RoleEnum.Manager,
  first: 100,
  page: 1
});

const managers = computed(() => {
  return result.value?.managers.data.filter(item => item.email_verified_at);
});

const router = useRouter();

const handleEdit = (id) => {
  console.log(id)
  router.push({
    name: EntitiesEnum.DashboardGymManagerProfile,
    params: {
      id: id as string,
    },
  })
}

</script>

<style scoped lang="scss">
.holder-content {
  padding-left: 50px;
  padding-right: 28px;
  padding-top: -40px;
}
.banner {
  width: 100%;
  position: relative;
  overflow: hidden;

  &__title {
    padding: 0;
    color: var(--gold);
    font-family: Lato;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
}
.content-container {
  padding-top: 31px;
  display: flex;
  flex-direction: column;
  gap: 37px;
}
.content-box {
  background-color: var(--gray-700);
  border-radius: 8px;
  
  .top {
    margin-bottom: 40px;
    padding: 5px;
  }

  &__membership {
    padding-top: 34px;
    padding-left: 30px;
    padding-right: 90px;
    padding-bottom: 20px;
    border-radius: 8px;
    max-width: 641px;
  }

  ion-row {
    margin-bottom: 33px;
  }
}
.tool-bar {
  padding-top: 16px;
  padding-bottom: 16px;
  padding-right: 8px;
}
.manager-table {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  outline: 1px solid var(--fitnesswhite);
  background: var(--gray-700);
  padding: 0;
  width: 100%;
}

.table-th {
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: left;
  outline: 1px solid var(--fitnesswhite);
}

.table-td {
  text-align: center;
  font: 14px/1 var(--ion-font-family);
  color: #ffffff6a;
}

.top-left {
  border-top-left-radius: 8px;
}

.top-right {
  border-top-right-radius: 8px;
}

.table-header {
  background-color: var(--main-color);
  color: var(--gold);
}

.table-row {
  border-top: 1px solid var(--fitnesswhite);
}

.edit-btn {
  padding: 12px 18px;
  display: flex;
  justify-content: end;
  
  ion-button {
    height: 36px;
    width: 42px;
  }
}

.chart {
  width: 326px;
  height: 237px;
  margin-left: 37px;
  position: relative;
  padding: 20px;

  .availability {
    font: 600 18px/1 var(--ion-font-family);
  }
  .detail {
    font: 12px/1 var(--ion-font-family);
    color: #ffffff6a;
  }

  ion-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  ion-button {
    color: #858D9D;
    border-color: #858D9D;
  }
}

.flex-auto {
  flex: auto;
}

.available {
  border: 1px solid #2ed47a;
  border-radius: 16px;
  font: 12px/1 var(--ion-font-family);
  color: #2ed47a;
  text-transform: capitalize;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 4px;
  padding-right: 4px;
}

.unavailable {
  border: 1px solid #f7685B;
  border-radius: 16px;
  font: 12px/1 var(--ion-font-family);
  color: #f7685B;
  text-transform: capitalize;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 4px;
  padding-right: 4px;
}

.main-content {
  padding: 16px 20px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;

  .content-box {
    padding: 26px 14px 16px 14px;

    ion-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
  }
  .title {
    padding: 8px 0px;
    font-size: 1.6rem;
    line-height: 1.3;
    font-weight: 400;
    color: var(--fitnesswhite);
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

  .table-row {
    border-top: 1px solid var(--beige);
  }

  ion-row#body {
    padding: 14px 0 14px;

    ion-text {
      font: 500 12px/1 Lato;
    }
  }
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
