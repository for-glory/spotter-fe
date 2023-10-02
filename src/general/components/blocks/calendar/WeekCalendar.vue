<template>
  <div class="week-calendar__container">
    <items-header
      :title="dayjs(selectedDate).format('dddd, D MMMM YYYY')"
      link-to="calendar"
      @click="$emit('handle-view')"
    />
    <div class="week-calendar">
      <week-calendar-item
        v-for="date in dates"
        :key="date"
        :date-time="date"
        :highlighted="date.toString() === dayjs(selectedDate).toString()"
        :selectable="featureSelectionOnly && !dayjs().isAfter(dayjs(date.toString()), 'date' )"
        :is-visible="isVisible(date) || false"
        @click="onClick($event, date)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";
import dayjs, { Dayjs } from "dayjs";
import { defineProps, defineEmits, withDefaults, ref } from "vue";
import ItemsHeader from "@/general/components/blocks/headers/ItemsHeader.vue";
import WeekCalendarItem from "@/general/components/blocks/calendar/WeekCalendarItem.vue";

const props = withDefaults(
  defineProps<{
    modelValue: Dayjs | null;
    bookings: Array<object> | [];
    featureSelectionOnly: boolean;
  }>(),
  {
    featureSelectionOnly: false,
  }
);

const { featureSelectionOnly } = toRefs(props);

const emits = defineEmits<{
  (e: "update:modelValue", selectedDate: Dayjs): void;
  (e: "handle-view"): void;
  (e: "handle-date-change"): void;
}>();

const currentDate = dayjs().format("dddd, D MMMM YYYY");
const selectedDate = ref<Dayjs | null>(dayjs());

const dates = computed(() =>
  [...Array(7)].map((_, index) => dayjs().day(index))
);

const onClick = (e: CustomEvent, date: Dayjs) => {
  if(featureSelectionOnly && dayjs().isAfter(dayjs(date.toString()), 'date' )) {
    return;
  }
  selectedDate.value = date;
  emits("update:modelValue", date);
  emits("handle-date-change");
};

const isVisible = (date: any) =>
  props.bookings.some(
    (item) =>
      dayjs(item?.start_date).format("dddd, D MMMM YYYY") ===
      dayjs(date).format("dddd, D MMMM YYYY")
  );
</script>

<style scoped>
.week-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 20px;
}
</style>
