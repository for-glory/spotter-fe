<template>
  <BaseLayout hide-navigation-menu>
    <template #header>
      <PageHeader title="Calendar" back-btn @back="onBack" />
    </template>
    <template #content>
      <div class="calendar-container">
        <div class="title">
          Showing results for 8 June 2022
        </div>
        <div class="block-container">
          <ChooseBlock title="Active" :is-light-item="true" value="3 Events" @handle-click="goToDetail('Active')" />
          <ChooseBlock title="Planned" :is-light-item="true"  value="3 Events" @handle-click="goToDetail('Planned')" />
        </div>
      </div>
    </template>
  </BaseLayout>
</template>
<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import router from "@/router";
import { EntitiesEnum } from "@/const/entities";

const onBack = () => {
  router.go(-1);
}

const goToDetail = (type:string) => {
  router.push({
    name: EntitiesEnum.ActivityDetail,
    params: {
      type
    }
  })
}

</script>
<style scoped lang="scss">
.calendar-container {
  padding: 20px;
  .title {
    color: var(--fitnesswhite);
    font-family: Yantramanav;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
  }

  .block-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>