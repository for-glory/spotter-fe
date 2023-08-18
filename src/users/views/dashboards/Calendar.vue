<template>
  <base-layout>
    <template #header>
      <page-header back-btn title="Calendar" @back="onBack" />
      <div class="week-days">
        <div class="week-day">SUN</div>
        <div class="week-day">MON</div>
        <div class="week-day">TUE</div>
        <div class="week-day">WED</div>
        <div class="week-day">THU</div>
        <div class="week-day">FRI</div>
        <div class="week-day">SAT</div>
      </div>
    </template>
    <template #content>
      <base-calendar
        class="calendar"
        :attributes="calendarOption"
        @month-changed="monthChanged"
      />
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import BaseCalendar from "@/general/components/base/BaseCustomCalendar.vue";
import { useRouter } from "vue-router";
import { UserAvailabilityDocument } from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import dayjs from "dayjs";
import useId from "@/hooks/useId";
import { computed } from "vue";

const router = useRouter();
const { id } = useId();

// Calendar info
const { result: calendarWidgetResult, refetch: updateCalendar } = useQuery(
  UserAvailabilityDocument,
  {
    id,
    from: dayjs().startOf("M").format("YYYY-MM-DD HH:mm:ss"),
    to: dayjs().endOf("M").add(1, "M").format("YYYY-MM-DD HH:mm:ss"),
  }
);

const monthChanged = (date: any) => {
  if (date.date) return;
  updateCalendar({
    id,
    from: dayjs()
      .month(date.month - 1)
      .startOf("M")
      .format("YYYY-MM-DD HH:mm:ss"),
    to: dayjs()
      .month(date.month - 1)
      .year(date.year)
      .endOf("M")
      .add(1, "M")
      .format("YYYY-MM-DD HH:mm:ss"),
  });
};

const bookings = computed(() => {
  const availability = [];
  if (calendarWidgetResult && calendarWidgetResult?.value) {
    const userAvailability = calendarWidgetResult?.value?.userAvailability;

    if (userAvailability && userAvailability?.events) {
      const { events } = userAvailability;
      const bookedEvents = events.map((event: any) => {
        return {
          start_date: event?.start_date || null,
        };
      });

      availability.push(...bookedEvents);
    }
    if (userAvailability && userAvailability?.trainings) {
      const { trainings } = userAvailability;
      const bookedTrainings = trainings.map((training: any) => {
        return {
          start_date: training?.start_date || null,
        };
      });
      availability.push(...bookedTrainings);
    }
  }
  return availability;
});

const calendarOption = computed(() => {
  const tmp = bookings.value.map((date) => new Date(date.start_date));
  return [
    {
      key: "today",
      highlight: {
        style: {
          backgroundColor: "var(--gold)",
        },
      },
      dates: [new Date()],
    },
    {
      dot: {
        style: {
          backgroundColor: "var(--gold)",
        },
      },
      dates: tmp,
    },
  ];
});

// const calendarOption = [
//   {
//     key: "today",
//     highlight: {
//       style: {
//         backgroundColor: "var(--gold)",
//       },
//     },
//     dates: [new Date()],
//   },
//   {
//     dot: {
//       style: {
//         backgroundColor: "var(--gold)",
//       },
//     },
//     dates: [...aaa.value],
//   },
// ];

const onBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.calendar {
  margin-top: 24px;
}
.week-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  
  .week-day {
    text-align: center;
    color: var(--gray-500);
    font: 14px/1 var(--ion-font-family);
    line-height: 14px;
    padding-top: 4px;
    padding-bottom: 8px;
    cursor: default;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }
}
</style>
