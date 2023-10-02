
<template>
    <div class="dashboard web-bookings hide-scrollbar">
        <div class="d-flex align-items-center page-header">
          <ion-button class="common-back-btn" fill="clear" @click="router.back()">
            <ion-icon src="assets/icon/arrow-back.svg" />
          </ion-button>
          <ion-title class="banner__title">Upcoming Trainings</ion-title>
        </div>
        <div>
            <ion-spinner name="lines" class="spinner" v-if="trainingsLoading" />
            <empty-block hide-button icon="assets/icon/empty.svg" v-else-if="!trainings.length" title="Sorry, no Trainings found" text="Currently you have no booked Trainings" />
            <template v-else>
                <div class="bookings-items">
                        <EventItem v-for="training in trainings" :key="training.id" :item="(training as any)" rounded
                        class="trainer-event-item" @click="
                            onViewCalendar
                            " />
                    </div>
            </template>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { IonIcon, IonSpinner, IonTitle, IonButton } from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import { computed } from "vue";
import {
    EventsDocument,
    TrainerTrainingsDocument,
    QueryEventsOrderByColumn,
    SortOrder,
    QueryTrainerTrainingsOrderByColumn,
    TrainingStatesEnum,
Training
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import EventItem from "@/general/components/EventItem.vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import useId from "@/hooks/useId";
import EmptyBlock from "@/general/components/EmptyBlock.vue";

const router = useRouter();
const { id } = useId();

const {
    loading: eventsLoading,
} = useQuery(
    EventsDocument,
    {
        page: 0,
        first: 4,
        created_by_trainer: id,
        start_date: {
            from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            to: dayjs().add(1, "M").format("YYYY-MM-DD HH:mm:ss"),
        },
        orderBy: [
            {
                column: QueryEventsOrderByColumn.StartDate,
                order: SortOrder.Asc,
            },
        ],
    },
    {
        fetchPolicy: "no-cache",
    }
);

const {
    result: trainingsResult,
    loading: trainingsLoading,
} = useQuery(
    TrainerTrainingsDocument,
    {
        page: 0,
        first: 4,
        filters: {
            start_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            states: [TrainingStatesEnum.Accepted, TrainingStatesEnum.Started],
        },
        orderBy: [
            {
                column: QueryTrainerTrainingsOrderByColumn.StartDate,
                order: SortOrder.Asc,
            },
        ],
    },
    {
        fetchPolicy: "no-cache",
    }
);

const trainings = computed(() =>
    trainingsResult?.value?.trainerTrainings?.data
        ?
        trainingsResult.value.trainerTrainings.data.map((training: Training) => ({
            id: training.id,
            title: `${training.user.first_name} ${training.user.last_name}`,
            address: {
              street: training.user.address?.street,
            },
            media: training.user.media,
            start_date: training.start_date,
            state: training.state,
            userId: training.user.id,
          }))
        : []
);

const onViewCalendar = () => {
    router.push({ name: EntitiesEnum.DashboardTrainingsCalendar });
};

const openTraining = (
    id: number,
    state?: TrainingStatesEnum,
    userId?: string
) => {
    if (state === TrainingStatesEnum.Started) {
        return router.push({
            name: EntitiesEnum.Session,
            params: {
                id,
            },
            query: {
                userId,
                type: EntitiesEnum.Training,
            },
        });
    }

    router.push({
        name: EntitiesEnum.Training,
        params: {
            id,
        },
    });
};

const openEvent = (id: string) => {
    router.push({
        name: EntitiesEnum.TrainersEventTraining,
        params: {
            id,
        },
    });
};
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

.spinner {
    display: block;
    margin: 64px auto;
}

.web-bookings {
  padding: 0 64px;
  overflow: auto;
  height: 100%;
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
.bookings-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(343px, 1fr));
    gap: 16px;
    .trainer-event-item {
        margin: 0 !important;
    }
}
.cursor-pointer {
    cursor: pointer;
}
</style>
  