<template>
  <div>
    <ion-title class="title">Revenue</ion-title>
    <div class="block">
      <div class="revenue">
        <div class="type font-medium font-16 color-white">Total revenue</div>
        <div class="d-flex justify-content-between">
          <div class="d-flex-col">
            <div class="d-flex align-items-center gap-4">
              <ion-text class="color-gray font-16">Today</ion-text>
              <ion-icon src="assets/icon/arrow-down-light.svg" />
            </div>
            <ion-text class="percent font-24 font-medium">
              0.0%
              <ion-icon
                class="vector"
                src="assets/icon/vector.svg"
              />
            </ion-text>
          </div>
          <div class="d-flex-col justify-content-end font-24 font-medium color-white">
            <ion-text>${{'3,689,076'}}</ion-text>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonRadioGroup,
  IonButton,
  IonIcon,
  IonModal,
  IonTitle,
  IonImg,
  IonAvatar
} from "@ionic/vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  Query,
  RoleEnum,
  SettingsCodeEnum,
  UserDocument,
  DeleteProfileDocument,
  SubscriptionsTypeEnum,
} from "@/generated/graphql";
import ProgressAvatar from "@/general/components/ProgressAvatar.vue";
import AddressItem from "@/general/components/AddressItem.vue";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import { EntitiesEnum } from "@/const/entities";
import { clearAuthItems } from "@/router/middleware/auth";
import { useRoute, useRouter } from "vue-router";
import { 
  computed, 
  onMounted, 
  ref, 
  watch,
  withDefaults,
  defineProps,
} from "vue";
import useRoles from "@/hooks/useRole";
import useId from "@/hooks/useId";
import { Capacitor } from "@capacitor/core";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  ArcElement
} from 'chart.js';
import { Doughnut } from 'vue-chartjs';

const router = useRouter();
const route = useRoute();

const props = defineProps<{ overviewData?: any; }>();
const todayEarn = computed(() => props.overviewData?.today_earn);
const earnLastThirtyDays = computed(() => props.overviewData?.earn_last_thirty_days);
const yearEarn = computed(() => props.overviewData?.year_earn);

const formatNumber = (num: number) => {
  if(num <= 9) {
    return num;
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  } else if (num >= 1e5) {
    return (num / 1e3).toFixed(1) + 'k';
  } else {
    return Math.floor(num / 1e3) + (num >= 1e3 ? ',' : '') + (num % 1e3);
  }
}

</script>
<style scoped lang="scss">
.title {
  padding: 8px 0px;
  font-size: 1.6rem;
  line-height: 1.3;
  font-weight: 400;
  color: var(--fitnesswhite);
}
.revenue {
  margin: 0.3rem 0.3rem;
  padding: 1rem;
  border: 1px solid white;
  border-radius: 8px;

  .type {
    padding-bottom: 10px;
  }
  .percent {
    color: #2ed47a;
  }
  .chain {
    font-size: 1.625rem;
    color: white;
  }
  .arrow {
    padding-left: 0.6rem;
  }
}
.block {
  width: 100%;
  background-color: #262626;
  border-radius: 4px;
  margin-bottom: 1rem;
  padding: 1rem 1rem 1rem 1rem;
}
.font-24 {
  font-size: 24px;
}
.font-16 {
  font-size: 16px;
}
.gap-32 {
  gap: 32px;
}
.gap-4 {
  gap: 4px;
}
</style>
