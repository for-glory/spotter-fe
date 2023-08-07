<template>
	<div class="dashboard-container">
		<div class="dashboard-container__sidebar">
			<dashboard-sidebar />
		</div>
		<div class="dashboard-container__right-section">
			<slot name="right-section"></slot>
		</div>
	</div>
</template>

<script lang="ts" setup>
import DashboardSidebar from '@/general/components/blocks/DashboardSidebar.vue';

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
</style>
