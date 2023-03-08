<template>
  <v-calendar
    class="spotter-calendar"
    v-model="date"
    is-expanded
    @update:from-page="dateChanged"
    :rows="2"
    is-dark
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

const date = ref(Date.now());

const dateChanged = (event: any) => {
  emits("month-changed", event);
};
</script>

<style lang="scss">
.vc-container {
  border: none !important;
  border-radius: 0 !important;
}
.vc-container.vc-is-dark {
  background-color: transparent !important;
}

.spotter-calendar {
  .vc-weeks {
    padding: 10px !important;
    gap: 15px !important;
  }

  .vc-day {
    min-height: 45px !important;
  }

  .vc-weekday {
    color: var(--gray-500);
    font-weight: lighter;
  }

  .vc-title {
    color: var(--ion-color-primary);
  }
}
</style>
