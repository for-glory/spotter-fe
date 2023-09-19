<template>
  <base-dashboard-layout>
    <template  #right-section>
			<dashboard-searchbar />
      <div :class="role !== RoleEnum.Trainer ? 'content' : 'h-100 bg-main'">
        <router-view />
      </div>
    </template>
  </base-dashboard-layout>
</template>

<script setup lang="ts">
import BaseDashboardLayout from "@/general/components/base/BaseDashboardLayout.vue";
import DashboardSearchbar from "@/general/components/blocks/DashboardSearchbar.vue";
import { useRouter } from "vue-router";
import useRoles from "@/hooks/useRole";
import { RoleEnum } from "@/generated/graphql";

const router = useRouter();
const { role } = useRoles();
</script>

<style scoped lang="scss">
.content {
  height: calc(100vh - 92px);
  overflow: auto;
  padding: 48px;
  background: var(--main-color);
}
.bg-main {
  background-color: var(--main-color);
  overflow: hidden;
}
</style>
