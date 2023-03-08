<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn title="Notifications" @back="onBack" />
    </template>
    <template #content>
      <div class="notification">
        <base-toggle :value="true" content="Show notification" />
        <base-toggle :value="true" content="With sound" />
        <base-toggle :value="false" content="With vibration" />
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import BaseToggle from "@/general/components/base/BaseToggle.vue";
import { useRouter } from "vue-router";

const router = useRouter();

// SHOW_NOTIFICATIONS
// SHOW_NOTIFICATIONS
// ENABLE_SOUND_FOR_NOTIFICATIONS
// ENABLE_SOUND_FOR_NOTIFICATIONS
// ENABLE_VIBRATION_ON_NOTIFICATION
// ENABLE_VIBRATION_ON_NOTIFICATION

const onBack = () => {
  router.go(-1);
};
</script>
<style scoped lang="scss">
.notification {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
