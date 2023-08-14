<template>
  <div class="chart-container">
    <Bar 
      id="custom-chart"
      :options="chartOptions"
      :data="chartData"
      :width="null"
      :height="null"
    />
  </div>
</template>

<script setup lang="ts">
import {
  DatetimeCustomEvent,
  IonDatetime,
  IonText,
  IonSpinner,
} from "@ionic/vue";
import {
  defineProps,
  onMounted,
  ref,
  withDefaults,
  defineEmits,
  watch,
} from "vue";
import dayjs from "dayjs";
import { computed } from "@vue/reactivity";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps<{
  chartData?: any;
}>();

const chartData = computed(() => props.chartData);
const chartOptions = { 
  responsive: true,
  scales: {
    y: {
      ticks: {
        display: false, 
      },
      grid: {
        display: false
      }
    },
    x: {
      ticks: {
        angle: 45, 
      },
      grid: {
        display: false
      }
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
  }
};

</script>

<style scoped lang="scss">
.chart-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
}
</style>
