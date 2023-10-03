<template>
  <base-dashboard-layout>
    <template  #right-section>
			<dashboard-searchbar  v-if="isWebView"/>
      <div :class="{'content' : role !== RoleEnum.Trainer && role !== RoleEnum.User,'h-100 bg-main' : role === RoleEnum.Trainer || role === RoleEnum.User}">
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
import { defineProps, ref, withDefaults } from "vue";
import { Capacitor } from '@capacitor/core';

const router = useRouter();
const { role } = useRoles();

const props = withDefaults(
  defineProps<{
    isWebView?: boolean;
  }>(),
  {
    isWebView: Capacitor.isNativePlatform() ? false : true,
  }
);
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
  overflow: auto;
}
</style>
