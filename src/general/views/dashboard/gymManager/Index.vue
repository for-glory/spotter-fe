<template>
	<div
		class="holder-content ion-padding-horizontal"
		:class="{ 'holder-content--empty': !loading }"
	>
    <div class="banner">
      <ion-title class="banner__title">Gym Managers</ion-title>
    </div>
    <div class="content-container">
      <div class="content-box d-flex justify-content-end">
        <ion-button expand="block">Add new manager</ion-button>
      </div>
      <div class="d-flex justify-between">
        <div class="content-box content-box__membership">
          <ion-title>Membership Summary</ion-title>
          <ion-grid>
            <ion-row>
              <ion-col size="4">
                <summary-item title="Total" keyText="New Signs-up" value="14"/>
              </ion-col>
              <ion-col size="4">
                <summary-item title="Total" keyText="Active" value="60"/>
              </ion-col>
              <ion-col size="4">
                <summary-item title="Total" keyText="Experiment membership" value="24"/>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="4">
                <summary-item title="Today's" keyText="Event counts" value="23"/>
              </ion-col>
              <ion-col size="4">
                <summary-item title="Today's" keyText="Event counts" value="13"/>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </div>
      <div class="d-flex justify-between">
        <div>
          <ion-grid class="manager-table">
            <ion-row class="table-header">
              <ion-col size="2" class="table-th">
                <ion-text>Name</ion-text>
              </ion-col>
              <ion-col size="3" class="table-th">
                <ion-text>Employment type</ion-text>
              </ion-col>
              <ion-col size="3" class="table-th">
                <ion-text>E-mail</ion-text>
              </ion-col>
              <ion-col size="2" class="table-th">
                <ion-text>Availability</ion-text>
              </ion-col>
              <ion-col size="1" class="table-th">
                <ion-text>Edit</ion-text>
              </ion-col>
            </ion-row>
            <ion-row class="table-row" v-for="manager in managers" :key="manager.id">
              <ion-col size="2" class="table-td">
                <ion-text>{{ manager.name }}</ion-text>
              </ion-col>
              <ion-col size="3" class="table-td">
                <ion-text>{{ manager.type }}</ion-text>
              </ion-col>
              <ion-col size="3" class="table-td">
                <ion-text>${{ manager.email }}</ion-text>
              </ion-col>
              <ion-col size="2" class="table-td">
                <ion-text>{{ manager.availability }}</ion-text>
              </ion-col>
              <ion-col size="1" class="table-td">
                <ion-button expand="block" fill="outline" @click="handleEdit">
                  <ion-icon slot="icon-only" src="assets/icon/Setting.svg"></ion-icon>
                </ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
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
  IonIcon
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

  &__membership {
    padding-top: 34px;
    padding-left: 30px;
    padding-right: 90px;
    padding-bottom: 20px;
    border-radius: 8px;
  }
}
.manager-table {
  border-top-left-radius: 8px;
	border-top-right-radius: 8px;
	border: 1px solid var(--fitnesswhite);
	background: var(--gray-700);
	max-width: 700px;
	padding: 0;

  .table-th {
		padding: 10px 24px;
	}

	.table-td {
		padding: 16px 24px;
	}
}

.table-header {
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
	background-color: var(--main-color);
	color: var(--gold);
}

.table-row {
	border-top: 1px solid var(--fitnesswhite);
}
</style>
