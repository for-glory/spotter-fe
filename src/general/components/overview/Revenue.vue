<template>
  <div>
    <ion-title class="title">Revenue</ion-title>
    <div class="block">
      <div class="revenue">
        <div class="type">Total revenue</div>
        <div class="period">Today</div>
        <div class="percent">
          0.8%
          <ion-icon
            class="vector"
            src="assets/icon/vector.svg"
          />
        </div>
        <div class="chain">$3,689,076</div>
      </div>
      <div class="revenue">
        <div>
          <div class="type">Quarterly revenue</div>
          <div class="period">Earned</div>
          <div class="percent">70%</div>
          <div class="chain">
            $1068<span class="period">/ day</span>
          </div>
        </div>
      </div>
      <div class="revenue">
        <div class="type">Earned revenue</div>
        <div class="period">This year</div>
        <div class="percent">
          0.8%
          <ion-icon class="arrow" src="assets/icon/call_made.svg" />
        </div>
        <div class="chain">$689,076</div>
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
import { computed, onMounted, ref, watch } from "vue";
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
import { onValue } from "firebase/database";
import { chatsRef } from "@/firebase/db";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import { useUserStore } from "@/general/stores/user";

const router = useRouter();
const route = useRoute();

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
  padding: 1rem 0 1rem 1rem;
  border: 1px solid white;
  border-radius: 8px;

  .type {
    font-size: 1rem;
    color: white;
    padding-bottom: 10px;
  }
  .percent {
    font-size: 1.625rem;
    color: #2ed47a;
    padding-bottom: 5px;
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
</style>
