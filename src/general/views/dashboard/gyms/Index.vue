<template>
	<div
		class="holder-content ion-padding-horizontal"
		:class="{ 'holder-content--empty': !loading }"
	>
    <div class="banner">
      <ion-icon src="assets/icon/arrow-back.svg" />
      <ion-title class="banner__title">Gabby's gym</ion-title>
    </div>
	</div>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonSpinner,
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

const filter = ref<string>('profile');

const { id: myId } = useId();
const { id: myFacilityId } = useFacilityId();
const { role: myRole } = useRoles();

const { id } = JSON.parse(localStorage.getItem("user") || "{}");

const router = useRouter();

</script>

<style scoped lang="scss">
.holder-content {
  padding-left: 50px;
  padding-right: 37px;
  padding-top: -40px;
}

.infinite-scroll {
  margin-top: 16px;
  margin-bottom: -24px;
}

.settings {
	background-color: var(--gray-700);
  margin-top: 50px;
  min-height: 766px;
  display: flex;
}
.settings-menu {
  padding-left: 31px;
  padding-right: 31px;
  padding-top: 106px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 18px;
}
.settings-panel {
  padding-left: 32px;
  padding-right: 82px;
  padding-top: 41px;
  flex: auto;
}
.menu-item {
  padding: 10px;
  cursor: pointer;

  &:hover {
    color: #e1dbc5;
  }
  &__active {
    color: #e1dbc5;
    padding: 10px;
    border-radius: 32px;
    background-color: #e1dbc51a;
    cursor: pointer;
  }
  &__delete {
    padding: 10px;
    color: #dc5858;
    cursor: pointer;
  }
}
.banner {
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

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
</style>
