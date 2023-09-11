<template>
  <div class="chart-container">
   <Doughnut
      :options="props.chartOptions"
      :data="props.chartData"
    />
  </div>
</template>

<script setup>
import {
  defineProps, onMounted,
} from "vue";
import { Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  ArcElement
} from 'chart.js'

ChartJS.register(Title, ArcElement);

const props = defineProps({
  chartData: {
    required: true
  },
  chartOptions: {
    required: false,
    default: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          align: 'center',
          padding: 2,
          labels: {
            pointStyle: 'circle',
            usePointStyle: true,
          }
        },
        // annotation: {
        //   annotations: [
        //     {
        //       drawTime: 'beforeDatasetsDraw', // Draw before the pie slices
        //       type: 'text',
        //       x: 50, // Adjust the x-position where you want to add the label
        //       y: 50, // Adjust the y-position where you want to add the label
        //       fontFamily: 'Arial',
        //       fontSize: 16,
        //       fontStyle: 'bold',
        //       text: 'Custom Text', // Your custom text
        //       fillStyle: 'black', // Customize the text color
        //     },
        //   ],
        // },
      },
    },

  }
});
onMounted(() => {
  console.log(props)
})
</script>

<style scoped lang="scss">
.chart-container {
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
}
</style>
