<template>
  <BaseLayout hide-navigation-menu>
    <template #header>
      <page-header back-btn title="Calendar" @back="onBack" />
    </template>
    <template #content>
      <div class="calendar-container">
        <div class="subtitle">
          Toggle on or off whether you want to connect or disconnect your
          calendar with Spotter
        </div>
        <div class="content-wrapper">
          <BaseToggle
            content="Apple Calendar"
            font-lato
            img="apple-calendar.png"
            description="Sync with Apple Calendar for spotter notifications and reminder"
          />
          <BaseToggle
            content="Google Calendar"
            font-lato
            img="google-calendar.png"
            description="Sync with Microsoft Calendar for spotter notifications and reminder"
          />
        </div>
      </div>
    </template>
  </BaseLayout>
</template>
<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import BaseToggle from "@/general/components/base/BaseToggle.vue";
import router from "@/router";

const onBack = () => {
  router.go(-1);
};
</script>
<style scoped lang="scss">
.calendar-container {
  padding: 10px 25px;

  .subtitle {
    color: var(--fitnesswhite);
    text-align: center;
    font-family: Lato;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 20px;
  }
}
</style>
