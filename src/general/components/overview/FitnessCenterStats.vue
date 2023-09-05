<template>
  <div>
    <ion-title class="title">Fitness Center Stats</ion-title>
    <div class="block">
      <table class="custom-table">
        <tr>
          <td>
            <summary-item title="Total" keyText="Drop-ins" :value="dropinCount" />
          </td>
          <td>
            <summary-item title="Total" keyText="Gym pass" :value="passCount" />
          </td>
        </tr>
        <tr>
          <td>
            <summary-item title="Today's" keyText="Event counts" :value="eventsCount" />
          </td>
          <td>
            <summary-item title="Today's" keyText="Message counts" :value="messageCount" />
          </td>
        </tr>
        <tr>
          <td colspan="1">
            <summary-item title="Total" keyText="Dailys" :value="dailyCount" />
          </td>
        </tr>
      </table>
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
import SummaryItem from "@/general/components/dashboard/SummaryItem.vue";
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
const dropinCount = computed(() => props.overviewData?.dropin_count);
const passCount = computed(() => props.overviewData?.pass_count);
const eventsCount = computed(() => props.overviewData?.event_count);
const messageCount = computed(() => props.overviewData?.message_count);
const dailyCount = computed(() => props.overviewData?.daily_count);

</script>
<style scoped lang="scss">
.custom-table {
  border-spacing: 10px;
  width: 100%;
}
.title {
  padding: 8px 0px;
  font-size: 1.6rem;
  line-height: 1.3;
  font-weight: 400;
  color: var(--fitnesswhite);
}
td {
  padding: 5px;
}
.block {
  width: 100%;
  background-color: #262626;
  border-radius: 4px;
  margin-bottom: 1rem;
  padding: 1rem 1rem 1rem 1rem;
}
</style>
