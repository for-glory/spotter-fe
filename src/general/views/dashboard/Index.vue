<template>
  <base-dashboard-layout hide-header>
    <template  #right-section>
			<dashboard-searchbar />
      <div class="content">
        <router-view />
      </div>
    </template>
  </base-dashboard-layout>
</template>

<script setup lang="ts">
import BaseDashboardLayout from "@/general/components/base/BaseDashboardLayout.vue";
import DashboardSearchbar from "@/general/components/blocks/DashboardSearchbar.vue";
import { useRouter } from "vue-router";

const router = useRouter();

</script>

<style scoped lang="scss">
.content {
	height: calc(100vh - 92px);
	overflow: auto;
	padding: 48px;
}
</style>
