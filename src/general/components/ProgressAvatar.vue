<template>
  <div
    class="progress-avatar"
    :style="{ width: `${radius * 2}px`, height: `${radius * 2}px` }"
  >
    <template v-if="!disabled">
      <svg :height="radius * 2" :width="radius * 2">
        <circle
          fill="transparent"
          :stroke-dasharray="
            circumference * 0.25 - defaultGap + ' ' + defaultGap
          "
          :stroke-width="stroke"
          :r="normalizedRadius"
          :cx="radius"
          :cy="radius"
          class="progress-avatar__circle progress-avatar__circle--unchecked"
        />
        <circle
          fill="transparent"
          :stroke-dasharray="strokeDashArray"
          :stroke-width="stroke"
          :r="normalizedRadius"
          :cx="radius"
          :cy="radius"
          class="progress-avatar__circle"
        />
      </svg>
      <ion-icon
        :src="`assets/icon/${isTrusted ? '' : 'not-'}trusted-user.svg`"
        class="progress-avatar__mark"
      />
      <ion-text
        v-if="showPercents"
        class="progress-avatar__percents"
        @click="togglePercents"
      >
        {{ progress }}%
      </ion-text>
    </template>
    <ion-thumbnail
      :class="{ 'progress-avatar__avatar--dark': showPercents && !disabled }"
      :style="{ '--size': `${radius * 2 - 16}px` }"
      class="progress-avatar__avatar"
      @click="!disabled && togglePercents()"
    >
      <ion-img v-if="src" :src="src" class="progress-avatar__image"></ion-img>
      <template v-else>
        {{ symbols || "" }}
      </template>
    </ion-thumbnail>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from "vue";
import { IonThumbnail, IonImg, IonText, IonIcon } from "@ionic/vue";

const defaultGap = 3;

const props = defineProps<{
  radius: number;
  progress: number;
  stroke: number;
  src: string;
  disabled?: boolean;
  symbols?: string;
}>();

const showPercents = ref(false);

const normalizedRadius = props.radius - props.stroke * 2;
const circumference = normalizedRadius * 2 * Math.PI;

const roundedProgress = computed(() => Math.floor(props.progress / 25) * 25);
const isTrusted = computed(() => props.progress >= 100);

const strokeDashArray = computed(() => {
  const length = roundedProgress.value / 25;
  if (length) {
    return [...Array(length)].map(
      (_, index) =>
        `${circumference * 0.25 - defaultGap} ${
          index === length - 1 ? circumference : defaultGap
        }`
    );
  } else {
    return `${circumference * 0.25 - defaultGap} ${circumference}`;
  }
});

const togglePercents = () => {
  showPercents.value = !showPercents.value;
};
</script>

<style scoped lang="scss">
.progress-avatar {
  padding: 2px;
  border-radius: 50%;
  display: inline;
  position: relative;
  margin: auto;

  // &__circle {
  // stroke: var(--gold);
  // transform: rotate(-90deg);
  // transform-origin: 50% 50%;
  // stroke-linecap: round;

  // &--unchecked {
  //   stroke: var(--gray-600);
  // }
  // }

  &__avatar {
    --border-radius: 50%;
    position: absolute;
    top: 10%;
    left: 10%;
    z-index: 5;
    color: var(--gray-600);
    transition: all 0.1s ease;
    line-height: var(--size);
    font-size: calc(var(--size) * (40 / 68));

    &--dark {
      filter: brightness(60%);
    }
  }

  &__percents {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 16px;
    line-height: 1.5;
    color: var(--ion-color-primary);
    z-index: 15;
    padding: 5px 0 0 8px;
  }

  &__mark {
    position: absolute;
    font-size: 24px;
    z-index: 10;
    top: 72%;
    right: 7%;
  }
}
</style>
