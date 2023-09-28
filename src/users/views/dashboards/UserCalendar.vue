<template>
  <div class="user-calendar">
    <div class="d-flex align-items-center page-header">
      <ion-title>Calendar</ion-title>
    </div>
    <div class="content">
      <ComponentBaseLayout
        :footer="false"
        :padding-left="true"
        title="Calendar"
        sub-title="Toggle on or off whether you want to connect or disconnect your calendar with Spotter"
      >
        <template #content>
          <div class="wrapper">
            <BaseToggle
              content="Apple Calendar"
              font-lato
              img="apple-calendar.png"
              description="Sync with Apple Calendar for spotter notifications and reminder"
              :value="isCheck"
              @change="(e) => (isCheck = e)"
            />
            <BaseToggle
              content="Google Calendar"
              font-lato
              img="google-calendar.png"
              description="Sync with Microsoft Calendar for spotter notifications and reminder"
              :value="isCheck1"
              @change="(e) => (isCheck1 = e)"
            />
          </div>
        </template>
      </ComponentBaseLayout>
    </div>
  </div>
</template>
<script setup lang="ts">
import ComponentBaseLayout from "@/general/views/dashboard/settings/ComponentBaseLayout.vue";
import BaseToggle from "@/general/components/base/BaseToggle.vue";
import { ref } from "vue";

const isCheck = ref(true);
const isCheck1 = ref(false);
</script>
<style scoped lang="scss">
.user-calendar {
  padding: 24px 40px 40px;
  height: 100%;
  width: 100%;
  overflow: auto;

  .page-header {
    padding-top: 21px;
    margin-bottom: 26px;

    ion-title {
      font-size: 24px;
      padding-left: 13px;
      color: var(--gold);
    }
  }

  .content {
    max-width: 700px;
    margin-top: 45px;
    .wrapper {
      max-width: 515px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 10px 0 0 15px;
    }
  }
}
</style>
