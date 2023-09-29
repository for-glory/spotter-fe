<template>
  <div :class="{ 'calendar--dark': darkBackground, 'user-calendar': role === RoleEnum.User }" class="calendar">
    <ion-datetime
      ref="calendar"
      :value="selectedDate"
      :class="{ 'calendar--dark': darkBackground }"
      @ion-change="onChange"
      presentation="date"
      mode="ios"
      :min="minData || min ? dayjs(min).toISOString() : undefined"
      :max="max ? dayjs(max).toISOString() : undefined"
    />
    <div v-if="showAdditionalContent" class="calendar__footer">
      <ion-text class="time__label"> Time</ion-text>
    </div>
    <ion-spinner v-if="loading" name="lines" class="spinner" />
    <base-carousel
      v-if="!loading && showAdditionalContent"
      :items="times"
      width-auto
    >
      <template v-slot:default="times">
        <div
          :class="{
            'carousel__item--on-selected': selectedTime === times.item.value,
          }"
          class="carousel__item"
          @click="onSelectTime($event, times.item.paymentTime)"
        >
          {{ times.item.value }}
        </div>
      </template>
    </base-carousel>
  </div>
</template>

<script setup lang="ts">
import {
  DatetimeCustomEvent,
  IonDatetime,
  IonText,
  IonSpinner,
} from "@ionic/vue";
import BaseCarousel from "@/general/components/base/BaseCarousel.vue";
import {
  defineProps,
  onMounted,
  ref,
  withDefaults,
  defineEmits,
  watch,
} from "vue";
import dayjs from "dayjs";
import { computed } from "@vue/reactivity";
import { RoleEnum } from "@/generated/graphql";
import useRoles from "@/hooks/useRole";

const { role } = useRoles();

const props = withDefaults(
  defineProps<{
    showAdditionalContent?: boolean;
    darkBackground?: boolean;
    times?: { value: string }[];
    loading?: boolean;
    selected?: number | null | object;
    min?: number;
    max?: number;
  }>(),
  {
    showAdditionalContent: true,
    darkBackground: false,
    loading: false,
    selected: Date.now(),
  }
);

watch(
  () => props.times,
  (newVal) => {
    if (newVal?.length) {
      selectedTime.value = newVal[0].value;
    }
  }
);

const calendar = ref<typeof IonDatetime | null>(null);
const selectedDate = ref<string | string[]>(
  props.selected ? dayjs(props.selected).toISOString() : dayjs().toISOString()
);
const selectedTime = ref<string | string[]>("");
const minData = computed(() => dayjs().format("YYYY-MM-DD"));

const emits = defineEmits<{
  (e: "change-day", day: string): void;
  (e: "change-time", time: string, timeValue: string): void;
}>();

const onChange = (event: DatetimeCustomEvent) => {
  if (event.detail.value) {
    selectedDate.value = event.detail.value;
    emits("change-day", event.detail.value);
  }
};

const onSelectTime = (event: CustomEvent, updatedTime: string) => {
  selectedTime.value = event?.target?.textContent;
  emits("change-time", updatedTime, event?.target?.textContent);
};

onMounted(() => {
  if (props.times?.length) {
    selectedTime.value = props.times[0].value;
  }

  if (calendar.value) {
    const shadow = calendar.value.$el.shadowRoot;
    const style = document.createElement("style");
    style.innerHTML = ` .calendar-day {
          font-size: 16px !important;
        }
        .calendar-month-grid {
          padding: 0 8px !important;
          grid-template-rows: repeat(5, 47px);
        }

         .calendar-action-buttons ion-icon {
          font-size: 24px;
          color: white !important;
         }

         .calendar-action-buttons ion-label {
          margin: 0;
          font-size: 16px;
         }

         .calendar-action-buttons {
          padding-top: 3px;
          padding-bottom: 6px;
          align-items: center;
         }

         .calendar-days-of-week {
          font-size: 14px !important;
          color: var(--gray-500) !important;
         }

         .calendar-next-prev ion-button {
          width: 32px !important;
          height: 32px !important;
         }

         .calendar-next-prev ion-button::part(native) {
          padding-inline-start: 0 !important;
          padding-inline-end: 0 !important;
         }

         .calendar-next-prev > ion-buttons {
         padding-right: 10px !important;
          padding-top: 0 !important;
         }

         :host(.datetime-presentation-date:not(.datetime-prefer-wheel)) {
          min-height: 350px !important;
         }
        `;
    shadow.appendChild(style);
  }
});
</script>

<style scoped lang="scss">
.calendar {
  border-radius: 8px;
  padding: 5px 0;
  background: var(--gray-700);
  position: relative;

  &--dark {
    background: var(--gray-800);
  }

  &__footer {
    font-weight: 500;
    font-size: 16px;
    margin: 0 22px;
    padding: 12px 0;
    border-top: 1px solid var(--gray-600);
  }
}

.button-time {
  --background: transparent;
  --color: var(--ion-color-white);
  border: 1px solid var(--gray-600);
  border-radius: 8px;
  font-weight: 400;
  font-size: 14px;

  &.selected {
    border-color: var(--gold);
  }
}

ion-datetime {
  --background: var(--gray-700);
  --title-color: var(--ion-color-white);
  color: var(--ion-color-white);
  margin: 0 auto;
  align-content: flex-start;

  &.calendar--dark {
    --background: var(--gray-800);
  }
}

.carousel {
  &__item {
    display: inline-block;
    margin-bottom: 12px;
    font-weight: 400;
    font-size: 14px;
    padding: 12px 16px;
    border: 1px solid var(--gray-600);
    border-radius: 8px;
    color: var(--gray-500);

    &--on-selected {
      border-color: var(--gold);
      color: var(--ion-color-white);
    }
  }
}

.time {
  &__label {
    padding-top: 10px;
    margin: 12px 0;
  }
}
.spinner {
  display: block;
  margin: 6px auto 22px;
  --color: var(--ion-color-white);
}
.user-calendar {
  ion-datetime {
    font-family: "Yantramanav";
    --title-color: var(--fitnesswhite);
    &::part(native){
      font-family: "Yantramanav" !important;
      color: var(--fitnesswhite) !important;
    }
  }

  .time__label{
    font-family: "Yantramanav";
    color: #FFF;
    font-size: 16px;
    font-weight: 500;
  }

  .carousel__item {
    font-family: "Yantramanav";
  }
}
</style>
