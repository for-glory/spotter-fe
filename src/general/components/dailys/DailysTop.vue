<template>
  <div class="main-content">
    <ion-title class="title font-bold font-20 color-white">Top 10 dailys</ion-title>
    <div>
      <div class="color-gray font-medium font-14 color-gray d-flex align-items-center">
        Ranking by sales
      </div>
      <div class="graph-field d-flex-col gap-8">
        <ranking-chart 
          v-for="(data, id) in topData" 
          :key="id" 
          :name="data.name"
          :value="data.value"
          :width="getWidth(data.value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from "vue";
import { Workout } from "@/generated/graphql";
import { IonItem, IonLabel } from "@ionic/vue";
import RankingChart from "@/general/components/RankingChart.vue";

const props = defineProps<{
  workout: Workout;
}>(); 
const graphDuration = ref<string>('7');

const handleSetDuration = ( value: string ) => {
  graphDuration.value = value;
}

const topData = ref<any[]>([
  {
    name: 'Leg Stretching',
    value: 9334,
  },
  {
    name: 'Full Body Workout',
    value: 3532,
  },
  {
    name: 'Yoga stretching',
    value: 2341,
  },
  {
    name: 'Leg Stretching',
    value: 1984,
  },
  {
    name: 'Leg Stretching',
    value: 600,
  },
  {
    name: 'Full Body Workout',
    value: 234,
  },
  {
    name: 'Back & ABS challenge video',
    value: 190,
  },
  {
    name: 'Armstring pull-up',
    value: 187,
  },
  {
    name: 'Squats',
    value: 70,
  },
  {
    name: 'Cardio reset',
    value: 18,
  },
]);
const maxValue = computed(() => {
  let max = 0;
  topData.value.forEach((data) => {
    if(max < data.value){
      max = data.value;
    }
  });
  return max;
});
const getWidth = (value: number) => {
  return value / maxValue.value * 90;
}
</script>

<style lang="scss">
.normal-icon {
  width: 24px;
  height: 24px;
}

.title {
  padding: 0;
  margin-bottom: 8px;
}

.main-content {
  padding: 24px 0;
  
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
  .gap-8 {
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

.graph-field {
  padding-top: 14px;

  .tabs-group {

    ion-button {
      --border-radius: 100px;
      font: 400 10px/1 Lato;
      height: 23px;
    }
  }
}
.chart-container {
  padding: 10px 0;
}
</style>
