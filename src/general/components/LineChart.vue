<template>
  <div class="chart-container">
    <Line
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
  LinearScale,
  LineElement,
  PointElement
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const props = defineProps<{
  chartData?: {
    type: any;
    required: true;
  };
  chartOptions?: {
    type: any;
    required: false;
  };
}>();
const chartData = computed(() => props.chartData);
const chartOptions = computed(() => props.chartOptions);

</script>

<style scoped lang="scss">
.chart-container {
  display: flex;
  flex-direction: column;
  justify-content: end;
}
</style>
