<template>
  <base-layout>
    <template #header>
      <page-header back-btn title="Calendar" @back="onBack" />
    </template>
    <template #content>
      <base-calendar class="calendar" :attributes="calendarOption" @day-click="openTraining" />
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
import { EntitiesEnum } from "@/const/entities";

const router = useRouter();
const { id } = useId();

// Calendar info
const { result: calendarWidgetResult } = useQuery(UserAvailabilityDocument, {
  id,
  from: dayjs().day(0).format("YYYY-MM-DD HH:mm:ss"),
  to: dayjs().day(6).format("YYYY-MM-DD HH:mm:ss"),
});

const bookings = computed(() => {
  const availability = [];
  if (calendarWidgetResult?.value) {
    const userAvailability = calendarWidgetResult?.value?.userAvailability;

    if (userAvailability?.events) {
      const { events } = userAvailability;
      const bookedEvents = events.map((event: any) => {
        return {
          start_date: event?.start_date || null,
        };
      });

      availability.push(...bookedEvents);
    }
    if (userAvailability?.trainings) {
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
  const tmp = bookings.value.map((date) => {
    return new Date(date.start_date);
  });
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


const openTraining = (date: string) => {
  router.push({
    name: EntitiesEnum.TrainingList,
    params: {
      date,
    },
  });
};

const onBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.calendar {
  margin-top: 24px;
}
</style>
