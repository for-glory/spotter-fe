<template>
  <v-calendar
    class="spotter-calendar"
    v-model="date"
    is-expanded
    @update:from-page="dateChanged"
    @dayclick="$emit('date-changed', $event)"
    :rows="12"
    transparent
    borderless
    :masks="{weekdays:weekDaysFormat}"
  ></v-calendar>
</template>

<script lang="ts">
export default {
  name: "Calendar",
};
</script>

<script setup lang="ts">
import { ref, defineProps, withDefaults, defineEmits, computed, watch } from "vue";

const date = ref('')
//const date = computed(() => new Date(new Date().getFullYear(), 0, 1));

watch(date, async (newDate, oldDate) => {
  alert(newDate)
})

withDefaults(
  defineProps<{
    attrs?: any;
    weekDaysFormat?: string;
  }>(),
  {
    attrs: [
      {
        key: "2023-09-26",
        highlight: {
          style: {
            backgroundColor: "var(--gold)",
          },
        },
        dates: [new Date()],
      },
    ],
    weekDaysFormat:"WWW"
  }
);

const emits = defineEmits<{
  (e: "month-changed", selected: any): void;
  (e: "date-changed", date: any): void;
}>();

const dateChanged = (event: any) => {
  console.log('date change');
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
    font-family: "Yantramanav";
    font-size: 16px;
  }
  .vc-title {
    background: none;
    color: var(--gold);
    font-family: "Lato";
    font-size: 16px;
    font-weight: 500;
  }
  .vc-weekday {
    // display: none;
    font-family: "Yantramanav";
    color: var(--gray-500);
    font-weight: 400;
    text-transform: uppercase;
  }
  .vc-arrow {
    display: none;
  }
  .vc-week{
    margin: 6px 0;
  }
}
.vc-highlight-content-solid {
  color: var(--gray-700);
  background-color: var(--gold);
}
.vc-popover-content-wrapper {
  display: none !important;
}
.web-custom-calendar {
  border: 0.872px solid var(--gray-600);
  & .vc-pane-layout {
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 2px !important;
        background-color: var(--gray-600);
        .vc-pane {
          background-color: var(--gray-700);
        }
        .vc-header {
          // display: block;
          // padding-left: 4px;
          button {
            font-family: "Nunito";
            font-size: 12.208px;
            font-weight: 600;
            color: var(--ion-color-white);
          }
        }
        .vc-weekday, .vc-day-content {
          font-family: "Nunito";
          font-size: 10.464px;
          color: var(--ion-color-white);
        }
        .vc-highlight-content-solid {
          font-family: "Lato";
          color: var(--main-color);
        }
        .vc-week {
          margin: 0;
        }
    }
}
</style>
