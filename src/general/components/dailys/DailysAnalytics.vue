<template>
  <div class="d-flex-col gap-24 content">
    <div class="block d-flex">
      <div class="d-flex-col gap-16 color-white w-70">
        <ion-text class="font-light font-12">Latest daily. {{ dayjs(daily?.created_at).format('D MMMM YYYY') }}</ion-text>
        <ion-text class="font-light font-12">
          <span class="font-bold font-24">{{ daily?.total_revenue }}</span>
          Purchases
        </ion-text>
        <div class="d-flex-col gap-4">
          <ion-text class="font-medium font-16" @click="watchDaily">
            {{ daily?.title }}
          </ion-text>
          <ion-text class="font-light font-14 color-gray-400 d-flex align-items-center">
            <ion-icon src="assets/icon/time.svg" class="clock-icon"></ion-icon>
            {{ daily?.duration }} min • {{ daily?.type.name }} • {{ daily?.trainer?.first_name + ' ' + daily?.trainer?.last_name }}
          </ion-text>
        </div>
      </div>
      <div class="font-semibold font-18 color-gold w-30 d-flex-col justify-content-center">
        <div class="color-gray font-medium font-14 color-gray d-flex align-items-center">
          Revenue
          <ion-icon src="assets/icon/dollar-circle.svg" class="dollar-icon"></ion-icon>
        </div>
        {{ daily?.total_revenue * daily?.price / 100 }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, defineEmits } from "vue";
import { Workout } from "@/generated/graphql";
import { IonItem, IonLabel, IonText, IonIcon } from "@ionic/vue";
import dayjs from "dayjs";

defineProps<{
  daily: any;
}>(); 

const emits = defineEmits<{
  (e: "watch-daily"): void;
}>();

const watchDaily = () => {
  emits('watch-daily');
}

</script>

<style lang="scss" scoped>
.block {
  padding: 10px 9px;
  background-color: #262626;
  width: 100%;
}

.clock-icon {
  width: 24px;
  height: 24px;
  color: #E1DBC5;
}
.dollar-icon {
  width: 24px;
  height: 24px;
}

.content {
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
