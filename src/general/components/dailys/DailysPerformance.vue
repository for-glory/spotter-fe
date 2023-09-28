<template>
  <div 
    class="common-style"
    :class="{
      'block': !isNative
    }"
  >
    <ion-title class="title font-bold font-20 color-white">Dailys Performance</ion-title>
    <div>
      <div 
        v-if="performanceData.length"
        class="d-flex-col font-semibold color-gold gap-8 d-flex-col justify-content-center"
        :class="isNative ? 'font-18' : 'font-20'"
      >
        <div 
          class="color-gray font-medium color-gray d-flex align-items-center gap-4"
          :class="isNative ? 'font-14' : 'font-18'"
        >
          Purchases
          <ion-icon src="assets/icon/dollar-circle.svg" class="normal-icon"></ion-icon>
        </div>
        $ {{ formatNumber(totalRevenue, 'fixed') }}
        <ion-text 
          class="font-light color-white"
          :class="isNative ? 'font-12' : 'font-14'"
        >
          {{ performanceLimit === 'all' ? 'All' : 'In the last ' + performanceLimit + ' days' }}
        </ion-text>
      </div>
      <div class="graph-section" v-if="performanceData.length">
        <div class="chart-container">
          <LineChart :chartData="data" :chartOptions="option" />
        </div>
        <div class="d-flex align-items-center justify-content-center gap-12 tabs-group">
          <ion-button :fill="performanceLimit==='7'?'solid':'outline'" @click="handleSetDuration('7')">7 Days</ion-button>
          <ion-button :fill="performanceLimit==='30'?'solid':'outline'" @click="handleSetDuration('30')">30 Days</ion-button>
          <ion-button :fill="performanceLimit==='90'?'solid':'outline'" @click="handleSetDuration('90')">90 Days</ion-button>
          <ion-button :fill="performanceLimit==='all'?'solid':'outline'" @click="handleSetDuration('all')">All</ion-button>
        </div>
      </div>
      <div v-if="!performanceData.length" class="graph-section d-flex align-items-center justify-content-center">
        <ion-text class="font-bold font-20 color-white">No purchases</ion-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref, defineEmits, watch } from "vue";
import { IonItem, IonLabel } from "@ionic/vue";
import LineChart from "@/general/components/LineChart.vue";
import { Capacitor } from "@capacitor/core";

const props = defineProps<{
  performanceData: Array<any>;
  limit: string,
  totalRevenue: number,
}>(); 
const emits = defineEmits<{
  (e: "change", limit: string): void;
}>();
let isNative = Capacitor.isNativePlatform();

const performanceLimit = computed(() => props.limit);
const labels = ref<Array<string>>(['02 Aug 2023', '03 Aug 2023', '04 Aug 2023', '05 Aug 2023', '06 Aug 2023', '07 Aug 2023', '08 Aug 2023']);
const data = ref<any>({
  labels: labels.value,
  datasets: [{
    data: [30,50,13,23,33,40,20],
    fill: false,
    borderColor: '#E1DBC5',
    tension: 0.3,
    radius: 3,
  }]
});

watch(() => performanceLimit.value,
(newLimit) => {
  const currentDate = new Date();
  let limit = newLimit === 'all' ? 7 : parseInt(newLimit);
  console.log(limit);
  labels.value = [];
  for (let i = limit - 1; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
    labels.value.push(formattedDate);
  }

  console.log('labels:  ', labels);
  const dataValues = [];
  for (let i = props.performanceData.length - limit; i < props.performanceData.length; i++) {
    dataValues[Math.abs(i + 1)] = props.performanceData[Math.abs(i + 1)]?.count || 0;
    console.log(i);
  }

  const updatedData = {
    labels: labels.value,
    datasets: [{
      data: dataValues,
      fill: false,
      borderColor: '#E1DBC5',
      lineTension: 0.4,
      radius: 6,
    }]
  };
  console.log({ updatedData });
  data.value = updatedData;
});

const handleSetDuration = ( value: string ) => {
  emits('change', value);
}
const customPlugin = {
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    const xAxis = chart.scales.x;
    const yAxis = chart.scales.y;
    const dataset = chart.data.datasets[0];
    const data = dataset.data;
    const radius = dataset.pointRadius || 3;
    const borderColor = dataset.borderColor || 'rgba(255, 255, 255)';

    // Connect the first point with the first label
    ctx.beginPath();
    ctx.strokeStyle = borderColor;
    ctx.moveTo(xAxis.getPixelForValue(data[0]), yAxis.getPixelForValue(data[0]));
    ctx.lineTo(xAxis.getPixelForValue(xAxis.min), yAxis.getPixelForValue(data[0]));
    ctx.stroke();

    // Connect the last point with the last label
    ctx.beginPath();
    ctx.moveTo(xAxis.getPixelForValue(data[data.length - 1]), yAxis.getPixelForValue(data[data.length - 1]));
    ctx.lineTo(xAxis.getPixelForValue(xAxis.max), yAxis.getPixelForValue(data[data.length - 1]));
    ctx.stroke();
  },
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
        display: true, // Display x-axis ticks
        maxRotation: 0, // Prevent label rotation
        callback: (value, index, values) => {
          // Display only the first and last labels
          if (index === 0 || index === values.length - 1) {
            return labels.value[value];
          } else {
            return ''; // Hide other labels
          }
        },
      },
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      xAlign: "center",
      yAlign: "top",
    },
    datalabels: {
      display: false, // Hide data labels
    },
  },
  responsive: true,
  maintainAspectRatio: true,
  layout: {
    padding: {
      left: 20, // Adjust as needed
      right: 20, // Adjust as needed
    },
  },
};

const formatNumber = (num: number, type: string) => {
  if (num < 1e3) {
    if(type === 'normal') {
      return num.toString();
    } else {
      return num.toFixed(2).toString();
    }
  } else if (num < 1e6) {
    return (num / 1e3).toFixed(1) + 'k';
  } else {
    return (num / 1e6).toFixed(1) + 'M';
  }
};
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

.common-style {
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
  .gap-8 {
    gap: 8px;
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

.graph-section {
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
.block {
  padding: 11px 27px;
  background-color: #262626;
  width: 100%;
}
</style>
