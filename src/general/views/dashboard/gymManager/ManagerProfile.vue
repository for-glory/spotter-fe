<template>
	<div
		class="holder-content ion-padding-horizontal"
		:class="{ 'holder-content--empty': !loading }"
	>
    <div class="banner">
      <ion-title class="banner__title">Gym Manager Profile</ion-title>
    </div>
    <div class="content-container">
    </div>
	</div>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonSpinner,
  IonGrid,
  IonText,
  IonTitle
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

const handleClick = (value: string) => {
	filter.value = value;
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
