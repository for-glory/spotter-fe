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
  return result.value?.managers.data;
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
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
</style>
