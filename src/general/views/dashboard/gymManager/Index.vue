<template>
	<div
		class="holder-content ion-padding-horizontal"
		:class="{ 'holder-content--empty': !loading }"
	>
    <div class="banner">
      <ion-title class="banner__title">Gym Managers</ion-title>
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
</style>
