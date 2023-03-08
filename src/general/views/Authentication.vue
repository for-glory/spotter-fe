<template>
  <base-layout hide-navigation-menu>
    <template #content>
      <authentication-header
        :back-button="isBackButtonVisible"
        :mode="currentMode"
        @back="onBack"
      />
      <router-view />
    </template>
  </base-layout>
</template>

<script lang="ts" setup>
import AuthenticationHeader from "@/general/components/blocks/headers/AuthenticationHeader.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { AuthenticationMode } from "@/ts/enums/authentification";
import { EntitiesEnum } from "@/const/routes";

const route = useRoute();
const router = useRouter();

const currentMode = computed<AuthenticationMode>(() => route.meta.mode);
const isBackButtonVisible = computed(
  () =>
    currentMode.value !== AuthenticationMode.login &&
    currentMode.value !== AuthenticationMode.registration
);

const onBack = () => {
  router.push({ name: EntitiesEnum.Login });
};
</script>
