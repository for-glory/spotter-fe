<template>
  <div class="common d-flex-col gap-8">
    <ion-text class="font-medium font-16 color-white">{{ name }}</ion-text>
    <div class="d-flex align-items-center gap-16">
      <div class="chart" :style="{ width: `${props.width}%` }" />
      <ion-text class="font-14 color-white">${{ value }}</ion-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref, onMounted } from "vue";
import { Workout } from "@/generated/graphql";
import { IonItem, IonLabel } from "@ionic/vue";

const props = defineProps<{
  name: string;
  value: number;
  width: number;
}>(); 

</script>

<style lang="scss">

.chart {
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;
  background-color: #E1DBC5;
  height: 12px;
}
.common {
  .w-70 {
    width: 70%;
  }
  .w-30 {
    width: 30%;
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
  .gap-12 {
    gap: 12px;
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
</style>
