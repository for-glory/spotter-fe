<template>
  <div
    class="review__container"
    :class="{ 'review__container--height-fixed': heightFixed,'user-review' : role === RoleEnum.User }"
  >
    <div class="review__header">
      <avatar class="review__avatar" :src="avatarUrl" />
      <ion-text class="review__user">{{ fullName }}</ion-text>
      <rating :value="rating" />
      <ion-text class="review__date">{{ currentDate }}</ion-text>
    </div>
    <div class="ion-text-start">
      <ion-text class="review__text" color="secondary">
        {{ text }}
      </ion-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonText } from "@ionic/vue";
import Rating from "@/general/components/blocks/ratings/Rating.vue";
import { computed, defineProps } from "vue";
import Avatar from "../Avatar.vue";
import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";
import { RoleEnum } from "@/generated/graphql";

const { role } = useRoles();

const props = defineProps<{
  avatarUrl: string;
  fullName: string;
  rating: number;
  date: string;
  text: string;
  heightFixed?: boolean;
}>();

const currentDate = computed(() => dayjs(props.date).format("D MMMM, YYYY"));
</script>

<style scoped lang="scss">
.review {
  &__avatar {
    --size: 32px;
  }

  &__container {
    background: var(--gray-700);
    border-radius: 8px;
    padding: 18px 16px;
    &--height-fixed {
      min-height: 160px;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  &__user {
    color: var(--ion-color-white);
    font-weight: 400;
    font-size: 14px;
  }

  &__date {
    font-weight: 500;
    font-size: 12px;
    justify-self: flex-end;
    color: var(--gray-500);
    margin-left: auto;
  }

  &__text {
    font-weight: 300;
    font-size: 14px;
  }
}
.user-review {
  .review__user, .review__date, .review__text {
    font-family: "Yantramanav";
  }
}
</style>
