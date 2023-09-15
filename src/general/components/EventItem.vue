<template>
  <ion-item
    lines="none"
    class="event"
    :class="{ 'event--time-hidden': hideTime, 'trainer-item': role === RoleEnum.Trainer }"
  >
    <ion-thumbnail
      :class="{ 'event__photo--rounded': rounded }"
      class="event__photo"
    >
      <img
        v-if="item?.media?.length && item.media[0]?.pathUrl"
        :src="item.media[0].pathUrl"
        class="event__img"
      />
      <template v-else>
        {{ item.title?.charAt(0) }}
      </template>
    </ion-thumbnail>
    <div class="event__holder">
      <ion-label class="event__title">{{ item.title }}</ion-label>
      <div class="event__time">
        <ion-icon src="assets/icon/time.svg" class="time-icon" />
        {{ time }}
      </div>
      <ion-text class="event__date" v-if="!hideTime">
        {{ date }}
        <template v-if="dateRange">- {{ endDate }}</template>
      </ion-text>
      <div class="d-flex align-items-center justify-content-between">
        <address-item class="event__address" v-if="item.address?.street">
          {{ item.address?.street }}
        </address-item>
        <ion-text v-if="props.item.end_date && props.item.start_date"
          class="status-text"
          :class="formatTime(props.item.end_date) >= formatTime(props.item.start_date) ? 'ongoing' : 'finished'">
          {{ formatTime(props.item.end_date) >= formatTime(props.item.start_date) ? "Ongoing" : "Finished" }}
        </ion-text>
      </div>
    </div>
  </ion-item>
</template>

<script setup lang="ts">
import { IonThumbnail, IonItem, IonLabel, IonText, IonIcon } from "@ionic/vue";
import AddressItem from "@/general/components/AddressItem.vue";
import { computed, defineProps, withDefaults } from "vue";
import { Event, RoleEnum } from "@/generated/graphql";
import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";

const { role } = useRoles()

const props = withDefaults(
  defineProps<{
    item: Event;
    rounded?: boolean;
    dateRange?: boolean;
    hideTime?: boolean;
  }>(),
  {
    rounded: false,
  }
);
const date = computed(() =>
  dayjs(props.item.start_date).format(
    props.dateRange &&
      dayjs(props.item.start_date).year() !== dayjs(props.item.end_date).year()
      ? "D MMM YYYY"
      : "D MMMM"
  )
);
const endDate = computed(() =>
  dayjs(props.item.end_date).format(
    props.dateRange &&
      dayjs(props.item.start_date).year() !== dayjs(props.item.end_date).year()
      ? "D MMM YYYY"
      : "D MMMM"
  )
);
const time = computed(() => dayjs(props.item.start_date).format("hh:mm A"));
const formatTime = (date: number, time: string): string => {
  return dayjs(date)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0)
    .format("YYYY-MM-DD HH:mm:ss");
};
</script>

<style scoped lang="scss">
.event {
  font-size: 14px;
  line-height: 1.5;
  font-weight: 400;
  position: relative;
  --border-radius: 8px;
  --min-height: 73px;
  --padding-top: 13px;
  --padding-bottom: 13px;
  --padding-start: 16px;
  --padding-end: 16px;
  --background: var(--gray-700);

  &:not(:first-child) {
    margin-top: 16px;
  }

  &__photo {
    flex-shrink: 0;
    --size: 68px;
    font-size: 40px;
    font-weight: 700;
    line-height: 68px;
    text-align: center;
    width: var(--size);
    margin: 0 16px 0 0;
    height: var(--size);
    color: var(--gray-700);
    background: var(--gray-600);
    --border-radius: 8px;

    &--rounded {
      --border-radius: 50%;
    }
  }

  &__holder {
    min-height: 73px;
    width: calc(100% - 68px);

    .event--time-hidden & {
      display: flex;
      padding-top: 4px;
      padding-bottom: 4px;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    margin-bottom: 2px;
    max-width: calc(100% - 86px);
    color: var(--ion-color-white);

    .event--time-hidden & {
      max-width: none;
    }
  }

  &__date {
    display: block;
    margin-bottom: 2px;
  }

  &__time {
    position: absolute;
    display: flex;
    align-items: center;
    top: 0;
    right: 0;
    color: var(--ion-color-white);

    ion-icon {
      line-height: 1;
      font-size: 24px;
      color: var(--ion-color-primary);
    }
  }
}

.time-icon {
  font-size: 22px;
  padding-right: 4px;
}
.status-text {
  font: 12px/1 Lato;
  padding: 2px 8px 2px 8px;
  border-radius: 16px;
}
.ongoing {
  background-color: #E1DBC5;
  color: #19191B;
}
.finished {
  background: none;
  border: 1px #AFAFAF;
  color: #AFAFAF;
}

.trainer-item{
  .event__title, .event__time, .event__date, .status-text  {
    font-family: Yantramanav;
  }

  .status-text {
    font-family: "Lato";
    font-size: 12px;
    font-weight: 500;
    color: var(--grey-text);
    display: flex;
    padding: 2px 8px;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    border: 1px solid var(--grey-text);
    line-height: 150%;
  }

  .event__date {
    color: rgba(255, 255, 255, 0.60);
  }
}
</style>
