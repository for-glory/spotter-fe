<template>
  <ion-text v-if="!hideTitle" class="content__title">Order details</ion-text>
  <div class="content__container" :class="{'content-container-user' : role === RoleEnum.User}">
    <trainer-item
      v-if="type === EntitiesEnum.Trainer && item"
      :trainer="item"
      class="trainer"
    />
    <router-link
      v-if="type === EntitiesEnum.Facility && item"
      :to="{ name: EntitiesEnum.Facility, params: { id: item.id } }"
    >
      <search-result show-rating :item="item" />
    </router-link>
    <event-info
      :event="item"
      v-if="type === EntitiesEnum.Event && item"
      :show-rating="false"
    />
    <div class="order__container">
      <div class="order__item">
        <ion-text class="order__label">Date</ion-text>
        <ion-text class="order__info">
          {{ orderDate ? dayjs(new Date(orderDate)).format(dateFormat) : "" }}
        </ion-text>
      </div>
      <div class="order__item">
        <ion-text class="order__label">{{ timeSectionTitle }}</ion-text>
        <ion-text class="order__info">{{ orderTime }}</ion-text>
      </div>
      <div v-if="!hidePrice" class="order__item">
        <ion-text class="order__label">Total</ion-text>
        <ion-text class="order__info">${{ hourlyRate }}</ion-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonText } from "@ionic/vue";
import TrainerItem from "@/general/components/TrainerItem.vue";
import { defineProps, withDefaults } from "vue";
import EventInfo from "@/general/components/Event.vue";
import { EntitiesEnum } from "@/const/entities";
import SearchResult from "@/users/views/facilities/SearchResult.vue";
import dayjs from "dayjs";
import { RoleEnum } from "@/generated/graphql";
import useRoles from "@/hooks/useRole";

const { role }  = useRoles();

withDefaults(
  defineProps<{
    item: any;
    type: EntitiesEnum;
    hidePrice?: boolean;
    hideTitle?: boolean;
    hourlyRate?: string | number;
    timeSectionTitle?: string;
    isOpen?: boolean;
    orderDate?: object | string;
    orderTime?: string;
    dateFormat?: string;
  }>(),
  {
    hidePrice: false,
    hideTitle: false,
    isOpen: false,
    hourlyRate: "",
    timeSectionTitle: "Time",
    dateFormat: "MM/DD/YYYY",
  }
);
</script>

<style lang="scss" scoped>
.content {
  &__container {
    margin: 16px;
    border-radius: 8px;
    background-color: var(--gray-700);
  }

  &__title {
    font-weight: 500;
    font-size: 16px;
    margin-left: 16px;
    color: var(--ion-color-white);
    font-family: "Yantramanav";
  }
}

.order {
  &__container {
    margin: 0 16px;
    padding-top: 12px;
    border-top: 1px solid var(--gray-600);
  }

  &__item {
    padding: 0 0 12px;
    display: flex;
    flex-direction: column;
    line-height: 1.5;
  }

  &__label {
    font-weight: 500;
    font-size: 12px;
    --color: var(--ion-color-secondary);
  }

  &__info {
    font-weight: 500;
    font-size: 16px;
    color: var(--ion-color-white);
  }
}

.trainer {
  --padding-bottom: 10px;
}
.content-container-user {
  .order__label,.order__info {
    font-family: "Yantramanav";
  }
  .order__label{
    color: var(--gray-400);
  }
  .order__info {
    color: var(--fitnesswhite);
  }
  .facility-item__address {
    font-weight: 500;
  }
}
</style>
