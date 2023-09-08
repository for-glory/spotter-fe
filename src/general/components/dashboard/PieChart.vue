<template>
  <div class="chart-container">
   <Pie
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
import { Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
} from 'chart.js'

ChartJS.register(Title);

const props = defineProps<{
  chartData?: {
     type: 'pie', 
    required: true;
  };
  chartOptions?: {
    type: 'pie',
  responsive: true,
        maintainAspectRatio: false,
        plugins: {
          annotation: {
            annotations: [
              {
                drawTime: 'beforeDatasetsDraw', // Draw before the pie slices
                type: 'text',
                x: 50, // Adjust the x-position where you want to add the label
                y: 50, // Adjust the y-position where you want to add the label
                fontFamily: 'Arial',
                fontSize: 16,
                fontStyle: 'bold',
                text: 'Custom Text', // Your custom text
                fillStyle: 'black', // Customize the text color
              },
            ],
          },
        },
  };
}>();
const chartData = computed(() => props.chartData);
const chartOptions = computed(() => props.chartOptions);

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
