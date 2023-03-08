<template>
  <div class="stars">
    <div
      class="star"
      @click="onStarClick(i)"
      :class="
        (i < modelValue + 1 && i > modelValue ? 'star--semi' : '') +
        (size ? ` star--${size}` : '')
      "
      :key="i"
      v-for="i in 5"
    >
      <ion-icon
        class="star__icon star__icon--default"
        src="assets/icon/star.svg"
      />
      <div class="star__inner">
        <ion-icon
          class="star__icon star__icon--active"
          v-if="i < modelValue + 1"
          src="assets/icon/star.svg"
        ></ion-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { IonIcon } from "@ionic/vue";

defineProps<{
  modelValue: number;
  size: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", rating: number): void;
}>();

function onStarClick(i: number) {
  emit("update:modelValue", i);
}
</script>

<style lang="scss" scoped>
.stars {
  display: flex;
  justify-content: center;
  margin-bottom: 4px;
}

.star {
  position: relative;
  font-size: 38px;
  line-height: 1;
  width: 1em;
  height: 1em;

  &--medium {
    font-size: 24px;
  }

  &__inner {
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    .star--semi & {
      width: 50%;
    }
  }

  &__icon {
    position: absolute;
    left: 0;
    top: 0;
    width: 1em;
    height: 1em;

    &--default {
      color: var(--gray-600);
    }

    &--active {
      color: var(--ion-color-primary);
    }
  }
}
</style>
