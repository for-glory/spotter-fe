<template>
  <div>
    <ion-title class="title" v-if="role !== RoleEnum.Trainer">Fitness Center Stats</ion-title>
    <div class="block" v-if="role !== RoleEnum.Trainer">
      <table class="custom-table" >
        <tr>
          <td>
            <summary-item title="Total" keyText="Drop-ins" :value="dropinCount" />
          </td>
          <td>
            <summary-item title="Total" keyText="Passes" :value="passCount" />
          </td>
        </tr>
        <tr>
          <td>
            <summary-item title="Today's" keyText="Event counts" :value="eventsCount" />
          </td>
          <td v-if="role !== RoleEnum.FacilityOwner">
            <summary-item title="Today's" keyText="Message counts" :value="messageCount" />
          </td>
          <td v-if="role === RoleEnum.FacilityOwner">
            <summary-item title="Total" keyText="Dailys" :value="dailyCount" />
          </td>
        </tr>
        <tr v-if="role !== RoleEnum.FacilityOwner">
          <td colspan="1">
            <summary-item title="Total" keyText="Dailys" :value="dailyCount" />
          </td>
        </tr>
      </table>
      
    </div>
    <div class="block trainer-block" v-else>
        <summary-item title="Total" keyText="Trainings" :value="14" />
        <summary-item v-if="role !== RoleEnum.FacilityOwner" title="Total" keyText="Message counts" :value="10" />
        <summary-item title="Total" keyText="Event counts" :value="23" />
        <summary-item title="Total" keyText="Dailys" :value="10" />
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
const { role } = useRoles()

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

.trainer-block{
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 26px 14px;
  grid-row-gap: 24px;
  grid-column-gap: 18px;
  @media(max-width: 320px){
    grid-row-gap: 20px;
    grid-column-gap: 16px;
  }
}
</style>
