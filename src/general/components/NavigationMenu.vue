<template>
  <div class="navigation-menu">
    <ion-button
      fill="clear"
      :id="item.id"
      :key="item.name"
      v-for="item in items"
      class="navigation-btn"
      @click="navigate(item.name, item)"
      :class="{
        'navigation-btn--main': item.isMainButton,
        'navigation-btn--active': (
          item?.queryParam === route.params[item.queryKey as any] &&
          Boolean(route.path.match(item.category ?? '')) ),
      }">

         <!-- :disabled=" role !== RoleEnum.Trainer &&
        (item.name === EntitiesEnum.TrainerWorkouts &&
          subscriptionType === SubscriptionsTierEnum.Basic) ||
        (item.name === EntitiesEnum.TrainerEvents &&
          subscriptionType === SubscriptionsTierEnum.Basic) ||
        (item.name === EntitiesEnum.TrainerSchedule &&
          subscriptionType === SubscriptionsTierEnum.Basic) ||
        (item.name === EntitiesEnum.TrainerWorkouts &&
          subscriptionType === SubscriptionsTierEnum.Bronze) ||
        (item.name === EntitiesEnum.TrainerEvents &&
          subscriptionType === SubscriptionsTierEnum.Bronze) ||
        (item.name === EntitiesEnum.FacilitiesEvents &&
          subscriptionType !== SubscriptionsTierEnum.Gold)
      " -->

      <div class="navigation-btn__inner">
        <div class="navigation-btn__icon" :class="{ 
          'hover-icon': (Boolean(route.path.match(item.category ?? '')) && item.queryParam === route.params[item.queryKey as any]),
          'drop-ins hover-icon' : item.name===EntitiesEnum.FacilityDropins&&Boolean(
          route.path.match(item.category ?? ''))
         }">
          <ion-icon :src="item.icon"></ion-icon>
        </div>
        <span :class="{
          'gold-color': (Boolean(route.path.match(item.category ?? '')) && item.queryParam === route.params[item.queryKey as any]),
        }">
          {{ item.label }}
        </span>
      </div>
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, nextTick } from "vue";
import { IonButton, IonIcon } from "@ionic/vue";
import { NavigationItem } from "@/interfaces/NavigationItem";
import { useRoute, useRouter } from "vue-router";
import useSubscription from "@/hooks/useSubscription";
import { RoleEnum, SubscriptionsTierEnum } from "@/generated/graphql";
import { EntitiesEnum } from "@/const/entities";
import useRoles from "@/hooks/useRole";

defineProps<{
  items?: NavigationItem[];
}>();

const route = useRoute();
const router = useRouter();
const { role } = useRoles()
const { type: subscriptionType } = useSubscription();

const navigate = (name: string, item:NavigationItem) => {
  if(item.queryParam){
    router.push({ 
      name, 
      params: {
        type: item.queryParam
      },
    });
  }else {
    router.push({ name });
  }
};
</script>

<style lang="scss" scoped>
.navigation-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: var(--ion-safe-area-bottom);
  background: rgba(var(--ion-color-gray-900-rgb), 0.88);
  backdrop-filter: blur(var(--backdrop-blur));

  > a {
    flex: 1 1 20%;

    &.router-link-exact-active {
      color: var(--ion-color-white);
    }
  }
}

.navigation-btn {
  margin: 0;
  width: 100%;
  height: 68px;
  font-size: 10px;
  line-height: 15px;
  font-weight: 400;
  text-transform: none;
  --color: var(--gray-500);
  --padding-top: 6px;
  --padding-bottom: 8px;
  --padding-start: 6px;
  --padding-end: 6px;

  &.onboarding-active {
    --color: var(--ion-color-white);
  }

  &::part(native) {
    display: flex;
    line-height: inherit;
    flex-direction: column;
    justify-content: flex-end;
  }

  &__inner {
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-end;
  }

  &__icon {
    width: 1em;
    height: 1em;
    display: flex;
    font-size: 24px;
    margin: 0 auto 4px;
    padding: 6px;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 100px;

    .navigation-btn--main & {
      width: 1.5em;
      height: 1.5em;
      margin-bottom: 3px;
      border-radius: 50%;
      color: var(--gray-600);
      background: var(--ion-color-primary);
    }
  }
}
.drop-ins {
  stroke: #202020;
}
.hover-icon {
  background-color: #E1DBC5;
  color: #202020;
}
.gold-color {
  color: #E1DBC5;
}
</style>
