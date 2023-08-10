<template>
	<ion-spinner
	  v-if="isLoading"
	  name="lines"
	  class="spinner"
	/>
	<div class="dashboard-container" v-else>
		<div class="dashboard-container__sidebar">
			<dashboard-sidebar :facilities="facilities"/>
		</div>
		<div class="dashboard-container__right-section">
			<slot name="right-section"></slot>
		</div>
		<ion-menu side="end" content-id="main-content">
      <ion-header>
        <ion-toolbar>
          <ion-title>Add new manager</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">This is the menu content.</ion-content>
    </ion-menu>
	</div>
</template>

<script lang="ts" setup>
import DashboardSidebar from '@/general/components/blocks/DashboardSidebar.vue';
import { IonSpinner, IonMenu } from "@ionic/vue";
import { useQuery } from "@vue/apollo-composable";
import useId from "@/hooks/useId";
import {
  ref,
} from "vue";
import {
  Query,
  UserDocument,
} from "@/generated/graphql";

const isLoading = ref(true);
const facilities = ref();

const setIsLoading = () => {
	isLoading.value = false;
}

const { id } = useId();
const {
  result,
  refetch,
  onResult: gotUser,
} = useQuery<Pick<Query, "user">>(UserDocument, { id });

gotUser(({ data }) => {
	facilities.value = result.value?.user?.owned_facilities;
  setIsLoading();
});
</script>
<style scoped lang="scss">
.dashboard-container {
	width: 100%;
	min-height: 100vh;
	display: flex;

	&__sidebar {
		width: 256px;
		box-shadow: 6px 0px 18px 0px rgba(0, 0, 0, 0.25);
		background: var(--gray-700);
	}

	&__right-section {
		width: calc(100% - 256px);
	}
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
</style>
