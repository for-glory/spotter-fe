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

<script setup >
import {
  defineProps,
} from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps({
  chartData: {
    required: true,
  },
  chartOptions: {
    required: false,
    default: {
      responsive: true,
      scales: {
        y: {
          stacked: true,
        },
        x: {
          stacked: true,
        },
      },
       plugins: {
          legend: {
            position: 'bottom', // Change legend position to the bottom
          },
        },
     
    }
  }
});


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
