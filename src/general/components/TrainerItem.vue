<template>
  <!-- <router-link
    class="item-wrap"
    :to="{ name: role === RoleEnum.User ? EntitiesEnum.BookTrainer : EntitiesEnum.Trainer, params: { id: trainer?.id } }"
  > -->
    <ion-item @click="handleRouting" lines="none" :class="['trainer-item', 'wrap-item', { 'user-item': role === RoleEnum.User}]">
      <avatar
        class="trainer-item__avatar"
        :src="trainer?.avatarUrl"
        :symbols="symbols"
      />
      <div class="d-flex trainer-detail-wrapper">
        <div :class="['trainer-item__inner', { 'user-inner': endButton && Capacitor.isNativePlatform() }]">
          <div :class="['trainer-item__head',  { 'head-max-width': endButton }]">
            <ion-label class="trainer-item__title">
              {{ trainer?.first_name }} {{ trainer?.last_name }}
            </ion-label>
            <rating-number class="trainer-item__rating">
              {{ trainer?.score?.toFixed(1) }}
            </rating-number>
            <div class="trainer-item__end">
              <slot name="end"></slot>
            </div>
          </div>
          <address-item class="trainer-item__address" v-if="address && !distance">
            {{ address }}
          </address-item>
          <address-item class="trainer-item__address" v-if="distance && trainer?.distance">
            {{ trainer?.distance.toFixed(1) }} mile away from you
          </address-item>
        </div>
        <div class="end-button" v-if="endButton">
          <ion-button @click.stop
          ="handleBookBtn()">
            {{ endButton }}
          </ion-button>
        </div>
      </div>

    </ion-item>
  <!-- </router-link> -->
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { RoleEnum, User } from "@/generated/graphql";
import { IonItem, IonLabel, IonButton } from "@ionic/vue";
import RatingNumber from "@/general/components/RatingNumber.vue";
import AddressItem from "@/general/components/AddressItem.vue";
import Avatar from "@/general/components/blocks/Avatar.vue";
import { EntitiesEnum } from "@/const/entities";
import useRoles from "@/hooks/useRole";
import { useRouter } from "vue-router";
import { Capacitor } from "@capacitor/core";
import { paymentGatewaysStore } from "@/users/store/paymentGatewaysStore";

const props = defineProps<{
  trainer: User;
  endButton?: string;
  distance?: boolean;
}>();
const paymentProductsStore = paymentGatewaysStore();

const { role } = useRoles();
const router = useRouter();

const handleRouting = () => {
  router.push({ name: Capacitor.isNativePlatform() ? EntitiesEnum.Trainer : EntitiesEnum.TrainerPreview, params: { id: props.trainer?.id } })
}

const handleBookBtn = () => {
  paymentProductsStore.clearCart();
  router.push({ name: Capacitor.isNativePlatform() ? EntitiesEnum.BookTrainer : EntitiesEnum.TrainerBooking, params: { id: props.trainer?.id } });
}

const address = computed(() => {
  return (
    props.trainer?.facilities?.[0]?.address?.street ?? props.trainer?.address?.street
  );
});

const symbols = computed(() => {
  return (
    (props.trainer?.first_name?.length
      ? props.trainer?.first_name?.charAt(0)
      : "") +
    (props.trainer?.last_name?.length ? props.trainer?.last_name?.charAt(0) : "")
  );
});
</script>

<style lang="scss" scoped>
.item-wrap {
  display: block;
  margin-top: 16px;
}

.trainer-item {
  position: relative;
  --border-radius: 8px;
  --min-height: 68px;
  --padding-top: 15px;
  --padding-bottom: 16px;
  --background: var(--gray-700);
  --padding-start: 16px;
  --padding-end: 10px;
  --inner-padding-start: 0;
  --inner-padding-end: 0;

  &__avatar {
    --size: 68px;
    font-size: 40px;
    font-weight: 700;
    line-height: 68px;
    text-align: center;
    width: var(--size);
    --border-radius: 50%;
    height: var(--size);
    color: var(--gray-700);
    background: var(--gray-600);
    margin-right: 16px;
  }

  &__inner {
    max-width: calc(100vw - 250px);
    width: 100%;
  }

  &__head {
    display: flex;
    margin-bottom: 16px;
    align-items: center;
    justify-content: flex-start;
  }

  &__rating {
    margin-bottom: 1px;
  }

  &__title {
    display: block;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    color: var(--ion-color-white);
  }

  &__end {
    position: absolute;
    right: 0;
    top: 6px;
  }

  &__address {
    display: flex;
    align-items: center;
  }

  &__rating {
    margin-left: 12px;
  }
}

.user-inner {
  max-width: 135px;
}

.end-button {
  display: flex;
  justify-content: center;
  align-items: center;

  ion-button {
    width: 70px;
    height: 30px;
    color: var(--gray-700);
    text-align: center;
    font-family: Lato;
    font-size: 14px;
    font-weight: 600;
    --border-radius: 4px;
  }
}

.user-item {
  &:not(:first-child) {
    margin-top: 16px;
  }
  .trainer-item {
    &__title {
      color: var(--fitnesswhite);
      font-family: Yantramanav;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
    }
        
    &__address {
      color: var(--gray-400);
    }
    
    &__rating {
      font-family: Yantramanav;
    }
  }
  .trainer-detail-wrapper {
    width: 100%;
    justify-content: space-between;
  }
}

.head-max-width {
  max-width: calc(100% - 30px);
}
</style>
