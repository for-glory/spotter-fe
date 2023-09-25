
<template>
    <div class="dashboard web-bookings d-flex-col h-100">
        <div class="d-flex align-items-center page-header">
          <ion-button class="common-back-btn" fill="clear" @click="router.back()">
            <ion-icon src="assets/icon/arrow-back.svg" />
          </ion-button>
          <ion-title class="banner__title">Calendar</ion-title>
        </div>        
        <div class="d-flex gap-16 h-100 overflow-hidden">
           <div class="flex-1 h-100 d-flex-col justify-content-between hide-scrollbar">
            <template v-if="trainings.length > 0">
              <training-details
                  v-for="training in trainings"
                  :key="training.id"
                  :training="training"
              />
            </template>
           </div>
           <div class="flex-2 h-100 hide-scrollbar">
            <base-calendar class="web-custom-calendar" week-days-format="W" v-model="date" :attributes="calendarOption" />
           </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { IonIcon, IonTitle, IonButton } from "@ionic/vue";
import BaseCalendar from "@/general/components/base/BaseCustomCalendar.vue";
import { computed, watch, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import dayjs from "dayjs";
import { useRoute, useRouter } from "vue-router";
import useId from "@/hooks/useId";
import { UserAvailabilityDocument, 
  TrainerTrainingsDocument, 
  TrainingPaginator, 
  TrainingStatesEnum,
  QueryTrainerTrainingsOrderByColumn,
  SortOrder
 } from "@/generated/graphql";
import TrainingDetails from "./training-details.vue";
const date = ref('')
const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')




const router = useRouter();
const route = useRoute();
const { id } = useId();

const { result: calendarWidgetResult } = useQuery(UserAvailabilityDocument, {
  id,
  from: dayjs().day(0).format("YYYY-MM-DD HH:mm:ss"),
  to: dayjs().day(6).format("YYYY-MM-DD HH:mm:ss"),
});

const selectedDate = computed(() =>
    route.params.date ? dayjs(String(route.params.date)).format("YYYY-MM-DD HH:mm:ss") : dayjs().format("YYYY-MM-DD HH:mm:ss")
);

// watch(
//   () => selectedDate,
//   (newVal: string) => {
//     alert(newVal)
//   }
// );

const {
    result: trainingsResult,
    loading: trainingsLoading,
    refetch: updateTrainings,
} = useQuery(
    TrainerTrainingsDocument,
    {
        page: 0,
        first: 4,
        filters: {
            start_date: selectedDate,
            states: [TrainingStatesEnum.Accepted, TrainingStatesEnum.Started],
        },
        orderBy: [
            {
                column: QueryTrainerTrainingsOrderByColumn.CreatedAt,
                order: SortOrder.Asc,
            },
        ],
    },
    {
        fetchPolicy: "no-cache",
    }
);

const trainings = computed<TrainingPaginator["data"]>(() =>
    trainingsResult?.value?.trainerTrainings?.data ? trainingsResult?.value?.trainerTrainings?.data : []
);

const onBack = () => {
  router.go(-1);
};

const bookings = computed(() => {
  const availability = [];
  if (calendarWidgetResult && calendarWidgetResult?.value) {
    const userAvailability = calendarWidgetResult?.value?.userAvailability;

    console.log(calendarWidgetResult?.value);

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

</script>
  
<style scoped lang="scss">
.dashboard {
    padding: 24px 16px 64px;

    &__navigation {
        width: 16vw;
        display: flex;
        align-items: flex-end;
        font-size: 18px;
        color: var(white);
        gap: 25px;
    }
}
.banner__title {
    margin-top: -3px;
}

.empty-block {
    margin-top: 48px;
}

.web-bookings {
  padding: 0 64px;
}
.page-header{
  padding-top: 21px;
  margin-bottom: 26px;
  ion-title {
    font-size: 24px;
    padding-left: 7px;
    color: var(--gold);
  }
  ion-icon {
    color: var(--gray-500);
    font-size: 20px;
  }
}
.flex-1, .flex-2 {
    width: 100%;
    overflow: auto;
}
.flex-1 {
    max-width: 360px;
    background: var(--gray-700);
    padding-top: 20px;
}
.overflow-hidden {
    overflow: hidden;
}
</style>
  