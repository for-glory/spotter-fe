<template>
  <div class="content">
    <ion-title class="title font-bold font-20 color-white">Dailys Summary</ion-title>
    <div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { Workout } from "@/generated/graphql";
import { IonItem, IonLabel, IonTitle } from "@ionic/vue";

const props = defineProps<{
  workout: Workout;
}>(); 


</script>

<style lang="scss" scoped>

.title {
  padding: 0;
  margin-bottom: 8px;
}
.content {
  margin: 24px 0;

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
