<template>
  <div class="upcoming-container">
    <WebHeader :back-btn="true" :title="title" @back="goBack" />

    <div class="content">
      <UpcomingItem
        v-for="event in result"
        :key="event.id"
        :item="event"
        :type-name="(route.params.type as string)"
        :square-img="isSquareImg"
        :role="role"
        @click="goToCalendar(event)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import WebHeader from "@/general/components/blocks/headers/WebHeader.vue";
import UpcomingItem from "@/general/components/dashboard/UpcomingItem.vue";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLazyQuery } from "@vue/apollo-composable";
import { EntitiesEnum } from "@/const/entities";
import {
  dummyDropins,
  dummyPasses,
  dummyTraings,
  upcomingEvent,
} from "@/const/users";
import useRoles from "@/hooks/useRole";
import {
  MyEventsDocument,
  MyFacilityItemPassesDocument,
  MyTrainingsDocument,
  QueryMyTrainingsOrderByColumn,
  SortOrder,
  QueryMyFacilityItemPassesOrderByColumn,
  QueryMyEventsOrderByColumn,
} from "@/generated/graphql";
import dayjs from "dayjs";

const route = useRoute();
const router = useRouter();
const { role } = useRoles();
let type: string;
let isSquareImg = true;
if (route.params.type === "tranings") {
  type = "Tranings";
} else {
  type = "Events";
  isSquareImg = true;
}
const items = ref<any>(dummyTraings);
const result = ref(null);
const { load: loadEvents, onResult: onEventsResult } = useLazyQuery(
  MyEventsDocument,
  {
    page: 1,
    first: 4,
    start_date: {
      from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      to: dayjs().add(1, "M").format("YYYY-MM-DD HH:mm:ss"),
    },
    orderBy: [
      {
        column: QueryMyEventsOrderByColumn.StartDate,
        order: SortOrder.Asc,
      },
    ],
  }
);

onEventsResult(({ data }) => {
  result.value = data?.myEvents?.data;
});

const { load: loadTraining, onResult: onTrainingResult } = useLazyQuery(
  MyTrainingsDocument,
  {
    page: 1,
    first: 4,
    start_date: {
      from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      to: dayjs().add(1, "M").format("YYYY-MM-DD HH:mm:ss"),
    },
    orderBy: [
      {
        column: QueryMyTrainingsOrderByColumn.StartDate,
        order: SortOrder.Asc,
      },
    ],
  }
);

onTrainingResult(({ data }) => {
  result.value = data?.myTrainings?.data;
});

const { load: loadPasses, onResult: onPassesResult } = useLazyQuery(
  MyFacilityItemPassesDocument,
  {
    page: 1,
    first: 4,
    start_date: {
      from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      to: dayjs().add(1, "M").format("YYYY-MM-DD HH:mm:ss"),
    },
    orderBy: [
      {
        column: QueryMyFacilityItemPassesOrderByColumn.StartDate,
        order: SortOrder.Asc,
      },
    ],
  }
);

onPassesResult(({ data }) => {
});

const title = computed(() => {
  if (route.params.type === "tranings") {
    items.value = dummyTraings;
    isSquareImg = false;
    return "Upcoming Tranings";
  } else if (route.params.type === "events") {
    items.value = upcomingEvent;
    return "Upcoming Events";
  } else if (route.params.type === EntitiesEnum.Facilities) {
    loadPasses();
    items.value = dummyPasses;
    return "My Passes";
  } else if (route.params.type === EntitiesEnum.FacilityDropins) {
    items.value = dummyDropins;
    return "My Drop-ins";
  } else if (route.params.type === EntitiesEnum.Trainings) {
    loadTraining();
    isSquareImg = false;
    return "My Tranings";
  } else if (route.params.type === EntitiesEnum.Events) {
    loadEvents();
    return "My Events";
  }
});

const goBack = () => {
  router.go(-1);
};

const goToCalendar = (data:any) => {
  router.push({
    name: EntitiesEnum.DashboardUserCalendar,
    params: {
      type: route.params?.type,
      id: data?.id
    },
  });
};
</script>
<style lang="scss" scoped>
.upcoming-container {
  padding: 40px 108px 0 55px;
  overflow: auto;
  height: 100%;
  .content {
    margin-top: 50px;
    padding-bottom: 80px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-column-gap: 16px;
    grid-row-gap: 6px;
  }
}
</style>
