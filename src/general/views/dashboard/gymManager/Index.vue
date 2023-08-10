<template>
	<div
		class="holder-content ion-padding-horizontal"
		:class="{ 'holder-content--empty': !loading }"
    id="main-content"
	>
    <div class="banner">
      <ion-title class="banner__title">Gym Managers</ion-title>
    </div>
    <div class="content-container">
      <div class="content-box d-flex justify-content-end tool-bar">
        <ion-menu-toggle :auto-hide="false">
          <ion-button expand="block">Add new manager</ion-button>
        </ion-menu-toggle>
      </div>
      <div class="d-flex justify-content-between">
        <div class="content-box content-box__membership flex-auto">
          <ion-title class="top">Membership Summary</ion-title>
          <ion-grid>
            <ion-row>
              <ion-col size="3">
                <summary-item title="Total" keyText="New Signs-up" value="14"/>
              </ion-col>
              <ion-col size="3">
                <summary-item title="Total" keyText="Active" value="60"/>
              </ion-col>
              <ion-col size="5">
                <summary-item title="Total" keyText="Experiment membership" value="24"/>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="3">
                <summary-item title="Today's" keyText="Event counts" value="23"/>
              </ion-col>
              <ion-col size="3">
                <summary-item title="Today's" keyText="Event counts" value="13"/>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
        <div class="content-box chart d-flex-col justify-content-end">
          <div class="d-flex justify-content-between align-items-center">
            <ion-text class="availability">Availability stats</ion-text>
            <ion-button fill="outline">
              <ion-icon src="assets/icon/calendar.svg"></ion-icon>
              Monthly
            </ion-button>
          </div>
          <ion-text class="detail">Manager's attendance</ion-text>
          <custom-chart :chartData="chartData" :selected="selected"/>
        </div>
      </div>
      <div class="d-flex justify-content-between">
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
                  <ion-text>Availability</ion-text>
                </th>
                <th class="table-th top-right">
                  <ion-text>Edit</ion-text>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="table-row" v-for="manager in managers" :key="manager.id">
                <td class="table-td">
                  <ion-text>{{ manager.name }}</ion-text>
                </td>
                <td class="table-td">
                  <ion-text>{{ manager.type }}</ion-text>
                </td>
                <td class="table-td">
                  <ion-text>${{ manager.email }}</ion-text>
                </td>
                <td class="table-td">
                  <ion-text :class="manager.availability === 'available' ? 'available' : 'unavailable'">{{ manager.availability }}</ion-text>
                </td>
                <td class="table-td edit-btn">
                  <ion-button expand="block" fill="outline" @click="handleEdit">
                    <ion-icon slot="icon-only" src="assets/icon/three-dot.svg"></ion-icon>
                  </ion-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="content-box chart d-flex-col justify-content-end">
          <div class="d-flex justify-content-between align-items-center">
            <ion-text class="availability">Availability stats</ion-text>
            <ion-button fill="outline">
              <ion-icon src="assets/icon/calendar.svg"></ion-icon>
              Monthly
            </ion-button>
          </div>
          <ion-text class="detail">Worker's attendance</ion-text>
          <custom-chart :chartData="chartData" :selected="selected"/>
        </div>
      </div>
    </div>
	</div>
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
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import {
  WorkoutsDocument,
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


const filter = ref<string>('profile');

const { id: myId } = useId();
const { id: myFacilityId } = useFacilityId();
const { role: myRole } = useRoles();

const { id } = JSON.parse(localStorage.getItem("user") || "{}");

const router = useRouter();

const managers = [{
  id: 0,
  name: "Gabby Alao",
  type: "Full-Time",
  email: "Gabrielalao@gmail.com",
  availability: "unavailable"
},{
  id: 1,
  name: "Ajebo Hustler",
  type: "Full-Time",
  email: "Ajebohustler@gmil.co",
  availability: "available"
}];
const chartData = {
  labels: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
  ],
  datasets: [
    {
      label: 'Data One',
      backgroundColor: '#2ED47A',
      data: [1.33, 2.33, 2.5, 2.33, 4, 4.66],
      barThickness: 8,
      borderRadius: 10
    }
  ]
};
const selected = "February";

const handleClick = (value: string) => {
	filter.value = value;
}

const handleEdit = () => {
  router.push({
    name: EntitiesEnum.DashboardGymManagerProfile,
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
  padding: 18px;
  padding-top: 12px;
  padding-bottom: 12px;
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
</style>
