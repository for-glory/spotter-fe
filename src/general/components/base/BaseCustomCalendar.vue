<template>
  <v-calendar
    class="spotter-calendar"
    v-model="date"
    is-expanded
    @update:from-page="dateChanged"
    :rows="12"
    transparent
    borderless
  ></v-calendar>
</template>

<script lang="ts">
export default {
  name: "Calendar",
};
</script>

<script setup lang="ts">
import { ref, defineProps, withDefaults, defineEmits } from "vue";

withDefaults(
  defineProps<{
    attrs?: any;
  }>(),
  {
    attrs: [
      {
        key: "today",
        highlight: {
          style: {
            backgroundColor: "var(--gold)",
          },
        },
        dates: [new Date()],
      },
    ],
  }
);

const emits = defineEmits<{
  (e: "month-changed", selected: any): void;
}>();

const date = ref(new Date(new Date().getFullYear(), 0, 1));

const dateChanged = (event: any) => {
  emits("month-changed", event);
};
</script>

<style lang="scss">
.week {
  width: 100%;
  display: flex;
  align-items: center;
}
.spotter-calendar {
  width: 100%;
  .vc-day {
    color: white;
  }
  .vc-title {
    background: none;
    color: #dbb582;
  }
  .vc-weekday {
    display: none;
  }
  .vc-arrow {
    display: none;
  }
}
.vc-highlight-content-solid {
  color: black;
  background-color: #dbb582;
}
.vc-popover-content-wrapper {
  display: none !important;
}
</style>
