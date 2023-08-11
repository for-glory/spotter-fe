<template>
  <div class="star-rating">
    <span v-for="star in 5" :key="star" class="star">
      <svg
        v-if="star <= filledStars"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="#DBB582"
        class="star-icon"
      >
        <path d="M11.7134 2.42754C11.8005 2.14564 12.1995 2.14564 12.2866 2.42754L14.4787 9.52129H21.6131C21.9001 9.52129 22.0233 9.88548 21.7952 10.0597L16.0106 14.4787L18.2122 21.6032C18.2985 21.8823 17.9756 22.1075 17.7435 21.9302L12 17.5426L6.2565 21.9302C6.02439 22.1075 5.70152 21.8823 5.78775 21.6032L7.98936 14.4787L2.20477 10.0597C1.97674 9.88548 2.09993 9.52129 2.38689 9.52129H9.52129L11.7134 2.42754Z"/>
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="#ccc"
        class="star-icon"
      >
        <path d="M11.7134 2.42754C11.8005 2.14564 12.1995 2.14564 12.2866 2.42754L14.4787 9.52129H21.6131C21.9001 9.52129 22.0233 9.88548 21.7952 10.0597L16.0106 14.4787L18.2122 21.6032C18.2985 21.8823 17.9756 22.1075 17.7435 21.9302L12 17.5426L6.2565 21.9302C6.02439 22.1075 5.70152 21.8823 5.78775 21.6032L7.98936 14.4787L2.20477 10.0597C1.97674 9.88548 2.09993 9.52129 2.38689 9.52129H9.52129L11.7134 2.42754Z"/>
      </svg>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from 'vue';

const props = defineProps({
  rating: {
    type: Number,
    required: true,
  },
});

const filledStars = computed(() => Math.floor(props.rating));
</script>

<style scoped>
.star-rating {
  display: inline-block;
}

.star {
  display: inline-block;
}

.star-icon {
  width: 24px;
  height: 24px;
}
</style>
