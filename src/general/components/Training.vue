<template>
  <div class="content__container">
    <ion-item lines="none" class="trainer-item">
      <avatar
        class="trainer-item__avatar"
        :src="
          type === EntitiesEnum.Training
            ? event.user.avatarUrl
            : event.media[0].pathUrl
        "
        :symbols="symbols"
      />
      <div class="trainer-item__inner">
        <div class="trainer-item__head">
          <ion-label class="trainer-item__title">
            <template v-if="type === EntitiesEnum.Training">
              {{ event.user.first_name }} {{ event.user.last_name }}
            </template>
            <template v-else>
              {{ event.title }}
            </template>
          </ion-label>
          <template v-if="type === EntitiesEnum.Training">
            <ion-text class="rating rating__likes">
              <ion-icon src="assets/icon/like.svg" class="rating__icon" />
              {{ event.user.positive_reviews_count }}
            </ion-text>
            <ion-text class="rating rating__dislikes">
              <ion-icon src="assets/icon/dislike.svg" class="rating__icon" />
              {{ event.user.negative_reviews_count }}
            </ion-text>
          </template>
        </div>
        <address-item
          class="trainer-item__address"
          v-if="
            trainingAddress === undefined ? address : trainingAddress !== ''
          "
        >
          {{ trainingAddress === undefined ? address : trainingAddress }}
        </address-item>
      </div>
    </ion-item>
    <div class="order__container">
      <div class="order__item">
        <ion-text class="order__label">{{ infoOneTitle }}</ion-text>
        <ion-text class="order__info">
          {{
            infoOneValue
              ? infoOneValue
              : dayjs(event.start_date).format("MM/DD/YYYY")
          }}
        </ion-text>
      </div>
      <div class="order__item">
        <ion-text class="order__label">{{ infoTwoTitle }}</ion-text>
        <ion-text class="order__info">
          {{
            infoTwoValue
              ? infoTwoValue
              : dayjs(event.start_date).format("h:mm A")
          }}
        </ion-text>
      </div>
      <div class="order__item">
        <ion-text class="order__label">{{ infoThreeTitle }}</ion-text>
        <ion-text class="order__info">
          {{ infoThreeValue ? infoThreeValue : `$${event.order?.front_total}` }}
        </ion-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonText, IonIcon, IonItem, IonLabel } from "@ionic/vue";
import { computed } from "vue";
import { Training, Event } from "@/generated/graphql";
import { defineProps, withDefaults } from "vue";
import dayjs from "dayjs";
import AddressItem from "@/general/components/AddressItem.vue";
import Avatar from "@/general/components/blocks/Avatar.vue";
import { EntitiesEnum } from "@/const/entities";

const props = withDefaults(
  defineProps<{
    event: Training | Event;
    type?: EntitiesEnum;
    infoOneTitle?: string;
    infoTwoTitle?: string;
    infoThreeTitle?: string;
    infoOneValue?: string;
    infoTwoValue?: string;
    infoThreeValue?: string;
    trainingAddress?: string;
  }>(),
  {
    infoOneTitle: "Date",
    infoTwoTitle: "Time",
    infoThreeTitle: "Total",
  }
);

const address = computed(() => {
  if (props.type === EntitiesEnum.Training) {
    return props.event?.trainer?.facilities?.[0]?.address?.street ?? "";
  } else {
    return (props.event as Event)?.address?.street ?? "";
  }
});

const symbols = computed(() => {
  if (props.type === EntitiesEnum.Training) {
    const event = props.event as Training;
    return (
      (event.user?.first_name?.length ? event.user.first_name?.charAt(0) : "") +
      (event.user?.last_name?.length ? event.user.last_name?.charAt(0) : "")
    );
  } else {
    return (props.event as Event).title?.length
      ? (props.event as Event).title?.charAt(0)
      : "";
  }
});
</script>

<style lang="scss" scoped>
.content {
  &__container {
    margin: 16px 0 25px;
    border-radius: 8px;
    background-color: var(--gray-700);
  }

  &__title {
    font-weight: 500;
    font-size: 16px;
    color: var(--ion-color-white);
  }
}

.trainer-item {
  position: relative;
  --border-radius: 8px;
  --min-height: 68px;
  --padding-top: 15px;
  --padding-bottom: 16px;
  --background: var(--gray-700);
  --padding-start: 16px;
  --padding-end: var(--container-offset);

  &:not(:first-child) {
    margin-top: 16px;
  }

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
    overflow: hidden;
    align-self: flex-start;
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
    margin-right: 12px;
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
}

.rating {
  display: flex;
  align-items: center;

  &__icon {
    font-size: 18px;
    margin-right: 3px;
  }

  &__likes {
    color: var(--ion-color-success-tint);
  }

  &__dislikes {
    color: var(--ion-color-danger-tint);
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
</style>
