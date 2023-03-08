<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn title="Calendar | 2022" @back="onBack" />
    </template>
    <template #content>
      <div class="holder-dates ion-padding-horizontal">
        <base-calendar :showAdditionalContent="false"></base-calendar>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import BaseCalendar from "@/general/components/base/BaseCalendar.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const onBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.holder-dates {
  padding-top: 25px;
}

:deep(ion-datetime) {
  --background: transparent;
}

.calendar {
  background: transparent;
}
</style>
