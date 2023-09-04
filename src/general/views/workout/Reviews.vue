<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Reviews">
      </page-header>
    </template>
    <template #content>
      <div>
        <ion-text>Showing {{ formatNumber(20234) }} reviews</ion-text>

      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import {
  WorkoutsByFacilityDocument,
  RecommendedWorkoutsByBodyPartsDocument,
  RecommendedWorkoutsByTypeDocument,
  WorkoutDocument,
  Workout,
  HideWorkoutDocument,
  ShowWorkoutDocument,
} from "@/generated/graphql";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import useId from "@/hooks/useId";
import useSubscription from "@/hooks/useSubscription";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import { useDailysItemStore } from "@/general/stores/useDailysItemStore";
import { timeConvertToHuman } from "@/helpers/date-formater";
// import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";
import WorkoutModal from "@/general/components/modals/workout/WorkoutModal.vue";
import { Share } from "@capacitor/share";

const { type: subscriptionType } = useSubscription();
const currentFacility = useFacilityStore();
const router = useRouter();
const route = useRoute();

const id = computed(() => route.params.id);

const onBack = () => {
  router.go(-1);
};

const formatNumber = (num: number) => {
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  } else if (num >= 1e5) {
    return (num / 1e3).toFixed(1) + 'k';
  } else {
    return Math.floor(num / 1e3) + (num >= 1e3 ? ',' : '') + (num % 1e3);
  }
}

</script>

<style scoped lang="scss">
.common-style {
  .w-24 {
    width: 24px;
  }
  .h-24 {
    height: 24px;
  }

  .d-flex-col {
    display: flex;
    flex-direction: column;
  }
  .gap-24 {
    gap: 24px;
  }
  .gap-12 {
    gap: 12px;
  }
  .gap-8 {
    gap: 8px;
  }
  .gap-6 {
    gap: 6px;
  }
  .gap-4 {
    gap: 4px;
  }


  .font-bold {
    font-weight: 700;
  }
  .font-semibold {
    font-weight: 600;
  }
  .font-medium {
    font-weight: 500;
  }
  .font-light {
    font-weight: 300;
  }

  .font-12 {
    font-size: 12px;
  }
  .font-14 {
    font-size: 14px;
  }
  .font-16 {
    font-size: 16px;
  }
  .font-18 {
    font-size: 18px;
  }
  .font-20 {
    font-size: 20px;
  }
  .font-24 {
    font-size: 24px;
  }

  .color-gray {
    color: #afafaf;
  }
  .color-gold {
    color: #E1DBC5;
  }
  .color-gray-400 {
    color: var(--gray-400);
  }
  .color-white {
    color: white;
  }
  .color-fitness-white{
    color: #EFEFEF;
  }
}
</style>
