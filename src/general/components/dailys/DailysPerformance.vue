<template>
  <div class="content">
    <ion-title class="title font-bold font-20 color-white">Dailys Performance</ion-title>
    <div>
      <div class="font-semibold font-18 color-gold w-30 d-flex-col justify-content-center">
        <div class="color-gray font-medium font-14 color-gray d-flex align-items-center">
          Purchases
          <ion-icon src="assets/icon/dollar-circle.svg" class="normal-icon"></ion-icon>
        </div>
        {{ '389' }}
      </div>
      <div class="graph-field">
        <ion-text class="font-light font-12 color-white">
          {{ graphDuration === 'all' ? 'All' : 'In the last ' + graphDuration + ' days' }}
        </ion-text>
        <div class="chart-container">
          <LineChart :chartData="data" :chartOptions="option" />
        </div>
        <div class="d-flex align-items-center justify-content-center gap-12 tabs-group">
          <ion-button :fill="graphDuration==='7'?'solid':'outline'" @click="handleSetDuration('7')">7 Days</ion-button>
          <ion-button :fill="graphDuration==='30'?'solid':'outline'" @click="handleSetDuration('30')">30 Days</ion-button>
          <ion-button :fill="graphDuration==='90'?'solid':'outline'" @click="handleSetDuration('90')">90 Days</ion-button>
          <ion-button :fill="graphDuration==='all'?'solid':'outline'" @click="handleSetDuration('all')">All</ion-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from "vue";
import { Workout } from "@/generated/graphql";
import { IonItem, IonLabel } from "@ionic/vue";
import LineChart from "@/general/components/LineChart.vue";

const props = defineProps<{
  workout: Workout;
}>(); 
const graphDuration = ref<string>('7');

const handleSetDuration = ( value: string ) => {
  graphDuration.value = value;
}

const labels = ['01 Aug 2023', '02 Aug 2023', '03 Aug 2023', '04 Aug 2023', '05 Aug 2023', '06 Aug 2023', '07 Aug 2023', '08 Aug 2023'];
const data = {
  labels,
  datasets: [{
    data: [20, 900, 450, 20, 450, 900, 20, 450],
    fill: false,
    borderColor: '#E1DBC5',
    lineTension: 0.4,
    radius: 6,
  }]
};
const option = {
  scales: {
    y: {
      ticks: {
        display: false, 
      },
      grid: {
        display: false, // Display y-axis grid lines
      }
    },
    x: {
      ticks: {
        display: false
      },
      grid: {
        display: false
      }
    }
  },
  elements: {
    point: {
      pointStyle: "none", // Remove point elements
    },
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      xAlign: "center",
      yAlign: "top",
    }
  },
  responsive: true,
  maintainAspectRatio: false,
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
