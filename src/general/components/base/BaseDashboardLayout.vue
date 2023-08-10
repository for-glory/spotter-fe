<template>
	<ion-spinner
	  v-if="isLoading"
	  name="lines"
	  class="spinner"
		id="main-content"
	/>
	<div class="dashboard-container" v-else>
		<div class="dashboard-container__sidebar">
			<dashboard-sidebar :facilities="facilities"/>
		</div>
		<div class="dashboard-container__right-section">
			<slot name="right-section"></slot>
		</div>
	</div>
	<add-manager-menu />
</template>

<script lang="ts" setup>
import DashboardSidebar from '@/general/components/blocks/DashboardSidebar.vue';
import AddManagerMenu from '@/general/components/dashboard/AddManagerMenu.vue';
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
