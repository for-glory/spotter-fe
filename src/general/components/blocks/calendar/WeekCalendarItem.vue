<template>
  <div class="calendar-item">
    <div
      :class="{
        'calendar-item__date--current': isCurrent,
        'calendar-item__date--highlighted': highlighted,
        'calendar-item__date--selectable': selectable,
      }"
      class="calendar-item__date"
    >
      {{ date }}
    </div>
    <div
      :class="isVisible ? 'calendar-item__mark' : 'calendar-item__no-mark'"
    ></div>
    <div
      :class="{
        'calendar-item__day--highlighted': highlighted,
      }"
      class="calendar-item__day"
    >
      {{ day }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults, defineProps } from "vue";
import dayjs, { Dayjs } from "dayjs";

const props = withDefaults(
  defineProps<{
    dateTime: Dayjs;
    highlighted: boolean;
    isVisible?: boolean;
    selectable?: boolean;
  }>(),
  {
    isVisible: false,
    selectable: false,
  }
);

const date = computed(() => dayjs(props.dateTime).format("D"));
const day = computed(() => dayjs(props.dateTime).format("ddd"));
const isCurrent = computed(
  () => dayjs().format("D") === dayjs(props.dateTime).format("D")
);
</script>

<style scoped lang="scss">
.calendar-item {
  display: grid;
  grid-template-rows: 1fr 4px 21px;
  justify-content: center;
  align-items: center;
  text-align: center;

  &__mark {
    width: 6px;
    height: 6px;
    margin: -10px auto 0;
    border-radius: 50%;
    background: var(--ion-color-primary);
  }
  &__no-mark {
    width: 6px;
    height: 6px;
    margin: -10px auto 0;
    border-radius: 50%;
    background: none;
  }

  &__date {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-weight: 500;
    font-size: 16px;
    width: 32px;
    height: 32px;
    font-family: "Yantramanav";
    color: rgba(255, 255, 255, 0.60);

    &--current {
      background: var(--gray-600);
    }

    &--highlighted {
      background: var(--gold);
      color: var(--gray-700);
    }
    &--selectable {
      cursor: pointer;
    }
  }

  &__day {
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
    color: var(--gray-500);
    text-transform: uppercase;
    font-family: "Yantramanav";

    &--highlighted {
      color: var(--gold);
    }
  }
}
</style>
