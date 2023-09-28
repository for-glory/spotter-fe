<template>
  <div 
    class="common-style"
    :class="{ 
      'block': !isNative,
      'content': isNative
    }"
  >
    <ion-title class="title font-bold font-20 color-white">Dailys Summary</ion-title>
    <div class="d-flex justify-content-between flex-wrap">
      <div 
        class="d-flex-col gap-4"
        :class="{ 'w-50': isNative }"
      >
        <ion-text class="font-light font-12 d-flex align-items-center gap-4">
          Views
          <ion-icon src="assets/icon/eye.svg" class="normal-icon"></ion-icon>
        </ion-text>
        <ion-text class="font-semibold font-18 color-white">
          {{ formatNumber(summaryData?.totalViews) }}
        </ion-text>
      </div>
      <div 
        class="d-flex-col gap-4"
        :class="{ 'w-50': isNative }"
      >
        <ion-text class="font-light font-12 d-flex align-items-center gap-4">
          Subscribers
          <ion-icon src="assets/icon/add-user.svg" class="normal-icon"></ion-icon>
        </ion-text>
        <ion-text class="font-semibold font-18 color-white">
          {{ formatNumber(summaryData?.subscribers) }}
        </ion-text>
      </div>
      <div 
        class="d-flex-col gap-4"
        :class="{ 'w-50': isNative }"
      >
        <ion-text class="font-light font-12 d-flex align-items-center gap-4">
          Views per daily
          <ion-icon src="assets/icon/eye.svg" class="normal-icon"></ion-icon>
        </ion-text>
        <ion-text class="font-semibold font-18 color-white">
          {{ formatNumber(summaryData?.viewsPerDaily) }}
        </ion-text>
      </div>
      <div 
        class="d-flex-col gap-4"
        :class="{ 'w-50': isNative }"
      >
        <ion-text class="font-light font-12 d-flex align-items-center gap-4">
          Total Revenue 
          <ion-icon src="assets/icon/dollar-circle.svg" class="normal-icon"></ion-icon>
        </ion-text>
        <ion-text class="font-semibold font-18 color-white">
          {{ formatNumber(summaryData?.totalRevenue) }}
        </ion-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { Workout } from "@/generated/graphql";
import { IonItem, IonLabel, IonTitle } from "@ionic/vue";
import { Capacitor } from "@capacitor/core";

defineProps<{
  summaryData: any;
}>(); 

let isNative = Capacitor.isNativePlatform();

const formatNumber = (num: number) => {
  if(num <= 9) {
    return num.toFixed(1);
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  } else if (num >= 1e5) {
    return (num / 1e3).toFixed(1) + 'k';
  } else {
    return (num / 1e3).toFixed(1) + (num >= 1e3 ? ',' : '') + (num % 1e3);
  }
}

</script>

<style lang="scss" scoped>

.title {
  padding: 0;
  margin-bottom: 8px;
}
.normal-icon {
  width: 24px;
  height: 24px;
  color: #E1DBC5;
}

.content {
  margin: 24px 0;
}
.common-style {
  .w-70 {
    width: 70%;
  }
  .w-30 {
    width: 30%;
  }
  .w-50 {
    width: 50%;
  }

  .d-flex-col {
    display: flex;
    flex-direction: column;
  }
  .gap-24 {
    gap: 24px;
  }
  .gap-16 {
    gap: 16px;
  }
  .gap-4 {
    gap: 4px;
  }


  .font-bold {
    font-weight: 700;
  }
  .font-semibold {
    font-weight: 600;
  }
  .font-medium {
    font-weight: 500;
  }
  .font-light {
    font-weight: 300;
  }

  .font-12 {
    font-size: 12px;
  }
  .font-14 {
    font-size: 14px;
  }
  .font-16 {
    font-size: 16px;
  }
  .font-18 {
    font-size: 18px;
  }
  .font-20 {
    font-size: 20px;
  }
  .font-24 {
    font-size: 24px;
  }

  .color-gray {
    color: #afafaf;
  }
  .color-gold {
    color: #E1DBC5;
  }
  .color-gray-400 {
    color: var(--gray-400);
  }
  .color-white {
    color: white;
  }  
}
.block {
  padding: 11px 27px;
  background-color: #262626;
  width: 100%;
}
</style>
