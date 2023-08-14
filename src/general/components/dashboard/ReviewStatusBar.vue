<template>
  <div>
    <div class="d-flex align-items-center">
      <ion-icon src="assets/icon/positive-review.svg"></ion-icon>
      <ion-text class="green">{{positiveCount}}</ion-text>
      <ion-icon src="assets/icon/negative-review.svg"></ion-icon>
      <ion-text class="red">{{negativeCount}}</ion-text>
    </div>
    <div class="d-flex align-items-center">
      <div class="progress-green" :style="{ width: greenWidth }"></div>
        <div class="progress-red" :style="{ width: redWidth }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from 'vue';

const props = defineProps({
  positiveCount: {
    type: Number,
    required: true,
  },
  negativeCount: {
    type: Number,
    required: true,
  },
});

const totalReviews = props.positiveCount + props.negativeCount;
const greenWidth = computed(() => `${(props.positiveCount / totalReviews) * 100}%`);
const redWidth = computed(() => `${(props.negativeCount / totalReviews) * 100}%`);

</script>

<style scoped>

.green {
  color: var(--ion-color-success-tint);
  font: 700 16px/1 var(--ion-font-family);
}
.red {
  color: var(--ion-color-danger-tint);
  font: 700 16px/1 var(--ion-font-family);
}
.progress-green {
  background-color: var(--ion-color-success-tint);
  height: 2px;
}

.progress-red {
  background-color: var(--ion-color-danger-tint);
  height: 2px;
}
</style>
