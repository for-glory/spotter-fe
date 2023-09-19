<template>
  <div>
    <div class="d-flex align-items-center review-content">
      <ion-icon class="icons" src="assets/icon/positive-review.svg"></ion-icon>
      <ion-text class="skin">{{positiveCount}}</ion-text>
      <ion-icon class="icons" src="assets/icon/negative-review.svg"></ion-icon>
      <ion-text class="skin">{{negativeCount}}</ion-text>
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
.skin {
  color: #E1DBC5;
  font: 700 16px/1 var(--ion-font-family);
}
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

.review-content {
  .icons {
    height: 26px;
    font-size: 26px;
    margin: 0 5px;
  }
  ion-text {
    height: 26px;
    font-size: 26px;
    margin: 0 5px;
  }
}
</style>
