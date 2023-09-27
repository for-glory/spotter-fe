<template>
  <div
    class="search-form"
    :class="{ 'search-form--on-focus': isFocused || visibleResult,'p-0': noPadding, 'search-form-padding': extraPadding,'search-form-user': role === RoleEnum.User,'small-search': role === RoleEnum.User && !Capacitor.isNativePlatform() }"
  >
    <ion-back-button
      v-if="backBtn"
      class="search-form__back-btn"
      @click="$emit('back')"
      icon="assets/icon/arrow-back.svg"
    >
    </ion-back-button>
    <ion-searchbar
      ref="searchBar"
      @ion-change="search"
      @ion-focus="focusHandle"
      show-clear-button="never"
      class="search-form__control"
      search-icon="assets/icon/search.svg"
      :placeholder="placeholder"
      :class="{
        'search-form__control--on-focus': isFocused,
        'search-form__control--with-back-btn': backBtn,
        'search-form__control--with-cancel-btn': !hiddenCancel,
        'tr-search': role === RoleEnum.Trainer,
      }"
    >
    </ion-searchbar>

    <ion-button
      fill="clear"
      color="primary"
      v-if="filtersBtn"
      @click="showFilters"
      class="search-form__filters"
    >
      <ion-icon slot="icon-only" icon="assets/icon/sort.svg" />
    </ion-button>

    <ion-button
      v-if="!hiddenCancel"
      fill="clear"
      color="medium"
      @click="clearForm"
      :disabled="!isFocused"
      class="search-form__clear-btn"
      :class="{
        'search-form__clear-btn--hidden': !isFocused,
      }"
    >
      Cancel
    </ion-button>

    <ion-content
      v-if="!hideResults"
      :class="{
        'search-form__results--with-back-btn': backBtn,
      }"
      class="search-form__results ion-padding-horizontal"
    >
      <ion-spinner
        v-if="facilityLoading || trainerLoading"
        name="lines"
        class="spinner"
      />
      <div
        v-else-if="!facilityLoading && searchResults?.length"
        v-for="searchResult in searchResults"
        :key="searchResult.id"
        @click="handleClick(searchResult)"
      >
      <facility-item class="mb-10" v-if="!Capacitor?.isNativePlatform() && role === RoleEnum.User"
      :facility="searchResult"
      />
      <search-result v-else :item="searchResult" :showRating="!isFacilityTab" />
      </div>
      <ion-label class="no-found-msg label" v-else>{{ noFoundMsg }}</ion-label>
    </ion-content>
  </div>

  <ion-modal
    ref="filtersModal"
    class="filters-modal"
    :is-open="isFiltersOpen"
    :backdrop-dismiss="true"
    @willDismiss="isFiltersOpen = false"
  >
    <span class="filters-modal__handle"></span>
    <div class="filters-modal__content">
      <div class="form-row">
        <ion-label>Start date</ion-label>
        <choose-block
          title="Date from"
          class="form-row__control"
          :value="
            filterStartDate ? dayjs(filterStartDate).format('D MMMM') : ''
          "
          @handle-click="
            showDatePikerModal(DateFieldsEnum.StartDate, filterStartDate, {
              title: 'Start date',
            })
          "
        />
        <wheel-picker :options="startTimeOptions" name="startTime">
          <template #button>
            <choose-block
              title="Time from"
              :value="filterStartTime"
              class="form-row__control"
              @handle-click="openPicker('startTime')"
            />
          </template>
        </wheel-picker>
      </div>
      <div class="form-row">
        <ion-label>End date</ion-label>
        <choose-block
          title="Date to"
          class="form-row__control"
          :value="filterEndDate ? dayjs(filterEndDate).format('D MMMM') : ''"
          @handle-click="
            showDatePikerModal(DateFieldsEnum.EndDate, filterEndDate, {
              min: filterStartDate ?? undefined,
              title: 'End date',
            })
          "
        />
        <wheel-picker :options="endTimeOptions" name="endTime">
          <template #button>
            <choose-block
              title="Time to"
              :value="filterEndTime"
              class="form-row__control"
              @handle-click="openPicker('endTime')"
            />
          </template>
        </wheel-picker>
      </div>
      <div class="filters-modal__buttons">
        <ion-button @click="resetFilters" expand="block" class="secondary">
          Reset
        </ion-button>
        <ion-button
          expand="block"
          @click="applyFilters"
          :disabled="!filterStartDate && !filterEndDate"
        >
          Show results
        </ion-button>
      </div>
    </div>
  </ion-modal>

  <date-picker-modal ref="datePickerModal" @select="dateSelected" />
</template>

<script setup lang="ts">
import {
  ref,
  defineProps,
  computed,
  withDefaults,
  defineEmits,
  defineExpose,
  inject,
  watch,
} from "vue";
import {
  IonSearchbar,
  SearchbarCustomEvent,
  IonButton,
  IonBackButton,
  IonLabel,
  IonSpinner,
  IonIcon,
  IonModal,
  toastController,
  IonContent,
  PickerColumnOption
} from "@ionic/vue";
import {
  FacilitiesDocument,
  FacilitiesQuery,
  RoleEnum,
  UsersDocument,
  UsersQuery,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import debounce from "lodash/debounce";
import SearchResult from "@/users/views/facilities/SearchResult.vue";
import { EntitiesEnum } from "@/const/entities";
import { FacilitySearchResult } from "@/interfaces/FacilitySearchResult";
import router from "@/router";
import dayjs from "dayjs";
import DatePickerModal from "@/general/components/DatePickerModal.vue";
import WheelPicker from "@/general/components/blocks/WheelPicker.vue";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import {
  DatePickerModalResult,
  DatePickerOptions,
} from "@/interfaces/DatePickerModal";
import { hoursDuration } from "@/const/hours-durations";
import { minutesDuration } from "@/const/minutes-durations";
import { Emitter, EventType } from "mitt";
import useRoles from "@/hooks/useRole";
import FacilityItem from "../FacilityItem.vue";
import { Capacitor } from "@capacitor/core";

const { role }= useRoles()

const props = withDefaults(
  defineProps<{
    type?: string;
    hiddenCancel?: boolean;
    backBtn?: boolean;
    visibleResult?: boolean;
    placeholder?: string;
    hideResults?: boolean;
    customNavigation?: boolean;
    filters?: any;
    noFoundMsg?: string;
    filtersBtn?: boolean;
    extraPadding?:boolean
    noPadding?:boolean;
  }>(),
  {
    backBtn: false,
    hiddenCancel: false,
    visibleResult: false,
    extraPadding: false,
    placeholder: "Enter name or address...",
    hideResults: false,
    customNavigation: false,
    filters: {},
    noFoundMsg: "No results found...",
    noPadding:false
  }
);

const emits = defineEmits<{
  (e: "search", value?: string): void;
  (e: "handle-focus"): void;
  (e: "handle-blur"): void;
  (e: "handle-item-click", data: FacilitySearchResult): void;
  (e: "apply-filters", data: any): void;
  (e: "reset-filters"): void;
}>();

const isFocused = ref<boolean>(false);
const searchBar = ref<typeof IonSearchbar | null>(null);
const isFacilityTab = computed(() => props.type === EntitiesEnum.Facilities);

const searchQuery = ref<string>("");
const params = computed(() => {
  return {
    first: 100,
    ...props.filters,
    search: searchQuery.value || undefined,
  };
});

const {
  result: facilityResult,
  loading: facilityLoading,
  refetch: facilityRefetch,
} = useQuery<FacilitiesQuery>(FacilitiesDocument, { ...params.value });

const {
  result: trainerResult,
  loading: trainerLoading,
  refetch: trainerRefetch,
} = useQuery<UsersQuery>(UsersDocument, {
  ...params.value,
  role: RoleEnum.Trainer,
  ...props.filters,
});

const searchResults = computed(() =>
  isFacilityTab.value
    ? (facilityResult.value?.facilities?.data as FacilitySearchResult[])
    : trainerResult.value?.users?.data.reduce(
        (acc: FacilitySearchResult[], cur) => {
          acc.push({
            id: cur.id,
            name: `${cur.first_name} ${cur.last_name}`,
            address: {
              street: cur.facilities?.length
                ? cur.facilities[0]?.address?.street
                : "",
            },
            media: [{ pathUrl: cur.avatarUrl || "" }],
            score: cur.score || "0.0",
          });
          return acc;
        },
        []
      )
);

const search = debounce((event?: SearchbarCustomEvent) => {
  if (props.hideResults) {
    emits("search", event?.detail?.value);
    return;
  }
  searchQuery.value = event?.detail?.value || "";
  props.type === EntitiesEnum.Facilities
    ? facilityRefetch(params.value)
    : trainerRefetch({
        first: 100,
        search: searchQuery.value?.length > 2 ? searchQuery.value : undefined,
        role: RoleEnum.Trainer,
        ...props.filters,
      });
}, 1000);

watch(
  () => props.filters,
  () => {
    props.type === EntitiesEnum.Facilities
      ? facilityRefetch(params.value)
      : trainerRefetch({
          first: 100,
          search: searchQuery.value?.length > 2 ? searchQuery.value : undefined,
          role: RoleEnum.Trainer,
          ...props.filters,
        });
  }
);

const handleClick = (result: FacilitySearchResult) => {
  if (props.customNavigation) {
    emits("handle-item-click", result);
  } else {
    router.push({
      name: isFacilityTab.value ? (Capacitor.isNativePlatform() ? EntitiesEnum.Facility : EntitiesEnum.GymDetails) : EntitiesEnum.Trainer,
      params: { id: result.id },
    });
  }
};

const focusHandle = () => {
  isFocused.value = true;
  emits("handle-focus");
};

const clearForm = () => {
  const el: HTMLInputElement =
    searchBar.value?.$el.querySelector(".searchbar-input");
  el.value = "";
  isFocused.value = false;
  emits("handle-blur");
};

const setFocus = () => {
  searchBar.value?.$el.setFocus();
};

const showFilters = () => {
  isFiltersOpen.value = true;
};

const filtersModal = ref<typeof IonModal | null>(null);

const applyFilters = async () => {
  const date_from = filterStartDate.value
      ? formatTime(filterStartDate.value, filterStartTime.value)
      : undefined,
    date_to = filterEndDate.value
      ? formatTime(filterEndDate.value, filterEndTime.value)
      : undefined;
  if (date_from && date_to && date_from >= date_to) {
    const toast = await toastController.create({
      message: "Incorrect time range entered",
      duration: 2000,
      icon: "assets/icon/info.svg",
      cssClass: "danger-toast",
    });
    return toast.present();
  }
  emits("apply-filters", {
    date_from,
    date_to,
  });
  filtersModal.value?.$el.dismiss();
};

const formatTime = (date: number, time: string | null): string => {
  const isPm = time?.split(" ")[1] === "PM" ?? false,
    hour = Number(time?.split(":")[0] ?? "0") + (isPm ? 12 : 0),
    minute = Number(time?.split(":")[1].split(" ")[0] || "0");

  return dayjs(date)
    .hour(hour)
    .minute(minute)
    .startOf("m")
    .format("YYYY-MM-DD HH:mm:ss");
};

const resetFilters = () => {
  filterStartDate.value =
    filterEndDate.value =
    filterStartTime.value =
    filterEndTime.value =
      null;
  emits("reset-filters");
  filtersModal.value?.$el.dismiss();
};

const isFiltersOpen = ref<boolean>(false);

const datePickerModal = ref<typeof DatePickerModal | null>(null);

const filterStartDate = ref<number | null>(null);
const filterEndDate = ref<number | null>(null);
const filterStartTime = ref<string | null>(null);
const filterEndTime = ref<string | null>(null);

const showDatePikerModal = (
  field: string,
  value?: number | null,
  options?: DatePickerOptions
) => {
  datePickerModal.value?.present({ field, value, options });
};

const dateSelected = (result: DatePickerModalResult) => {
  switch (result.field) {
    case DateFieldsEnum.StartDate:
      filterStartDate.value = result.date;
      if (
        filterEndDate.value &&
        (!result.date || result.date > filterEndDate.value)
      ) {
        filterEndDate.value = null;
      }
      break;

    case DateFieldsEnum.EndDate:
      filterEndDate.value = result.date;
      break;

    default:
      break;
  }
};

const openPicker = (name: string): void => {
  emitter?.emit("open-picker", name);
};

const hours = hoursDuration();
const minutes = minutesDuration(5, 60, 0);

const emitter: Emitter<Record<EventType, unknown>> | undefined =
  inject("emitter");

const timePickerColums = [
  {
    name: "hours",
    options: hours,
  },
  {
    name: "minutes",
    options: minutes,
  },
  {
    name: "time",
    options: [
      {
        text: "AM",
        value: "AM",
      },
      {
        text: "PM",
        value: "PM",
      },
    ],
  },
];

const startTimeOptions = {
  columns: timePickerColums,
  buttons: [
    {
      text: "Cancel",
      role: "cancel",
    },
    {
      text: "Choose time",
      handler: (value: PickerColumnOption) => {
        const minutes =
          value.minutes?.value && Number(value.minutes.value) < 10
            ? `0` + value.minutes?.value
            : value.minutes?.value;
        filterStartTime.value = `${value.hours?.value}:${minutes} ${value.time?.value}`;
      },
    },
  ],
};

const endTimeOptions = {
  columns: timePickerColums,
  buttons: [
    {
      text: "Cancel",
      role: "cancel",
    },
    {
      text: "Choose time",
      handler: (value: PickerColumnOption) => {
        const minutes =
          value.minutes?.value && Number(value.minutes.value) < 10
            ? `0` + value.minutes?.value
            : value.minutes?.value;
        filterEndTime.value = `${value.hours?.value}:${minutes} ${value.time?.value}`;
      },
    },
  ],
};

enum DateFieldsEnum {
  StartDate = "START_DATE",
  EndDate = "END_DATE",
}

defineExpose({
  setFocus,
  search,
});
</script>

<style lang="scss" scoped>
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
.search-form {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-end;
  transition: background-color 0.35s ease;
  gap: 12px;

  &--on-focus {
    background-color: var(--gray-800);
  }

  &__control {
    padding: 0;
    width: 100%;
    z-index: 15;
    transition: right 0.35s ease;
    --border-radius: 8px;
    --color: var(--ion-color-white);
    --placeholder-opacity: 1;
    --background: var(--gray-700);
    --icon-color: var(--gray-500);
    --placeholder-font-weight: 300;
    --placeholder-color: var(--gray-500);
    --box-shadow: inset 0 0 0 0.8px var(--gray-600);

    &--with-back-btn {
      width: calc(100% - 56px);
    }
  }

  &__back-btn {
    position: absolute;
    left: 12px;
    height: 32px;
    top: 50%;
    transform: translateY(calc(-50% + 8px + (var(--ion-safe-area-top)) / 2));
    z-index: 2;
    display: block;
    min-width: 32px;
    --icon-font-size: 24px;
    --padding-bottom: 0;
    --padding-end: 0;
    --padding-start: 0;
    --padding-top: 0;
    --icon-padding-bottom: 0;
    --icon-padding-end: 0;
    --icon-padding-start: 0;
    --icon-padding-top: 0;
    --min-height: 32px;
    --min-width: 32px;
    --color: var(--ion-color-white);
  }

  &__clear-btn {
    z-index: 2;
    height: 32px;
    margin: 0 -4px;
    max-width: 64px;
    font-size: 16px;
    line-height: 1.5;
    font-weight: 500;
    text-transform: none;
    --padding-top: 4px;
    --padding-bottom: 4px;
    --padding-start: 4px;
    --padding-end: 4px;

    &--hidden {
      display: none;
    }
  }

  &__results {
    left: 0;
    top: 100%;
    width: 100%;
    --padding-top: 32px;
    --padding-bottom: calc(44px + var(--ion-safe-area-bottom));
    position: absolute;
    transform-origin: 50% 0;
    transition: opacity 0.35s ease, transform 0.35s ease;
    height: calc(100vh - 64px - var(--ion-safe-area-bottom));

    .search-form:not(.search-form--on-focus) & {
      opacity: 0;
      top: -9999px;
      left: -9999px;
      transform: scaleY(0);
      transition: all 0s ease 0.35s, opacity 0.35s ease, transform 0.35s ease;
    }
  }

  &__filters {
    margin: 0;
    right: 36px;
    bottom: 8px;
    width: 32px;
    z-index: 50;
    height: 32px;
    line-height: 1;
    font-size: 24px;
    position: absolute;
    --border-radius: 50%;
    --padding-start: 0;
    --padding-end: 0;
    --padding-top: 0;
    --padding-bottom: 0;

    .search-form--on-focus & {
      right: 90px;
    }

    ion-icon {
      font-size: 1em;
    }
  }
}

.search-form-padding {
  padding: calc(16px + var(--ion-safe-area-top)) 24px 0 12px;
}

.p-0 {
  padding: 0 !important;
}

.no-found-msg {
  width: 100%;
  margin: 20vh 0;
  display: block;
  text-align: center;
}

.filters-modal {
  --height: auto;
  align-items: flex-end;
  --backdrop-opacity: 0.6;
  --border-radius: 20px 20px 0 0;
  --ion-backdrop-color: var(--ion-color-black);

  &__content {
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    padding: 24px 24px calc(16px + var(--ion-safe-area-bottom));
  }

  &__handle {
    top: 12px;
    left: 50%;
    width: 48px;
    height: 4px;
    margin-left: -24px;
    border-radius: 2px;
    position: absolute;
    pointer-events: none;
    background: rgba(255, 255, 255, 0.12);
  }

  &__buttons {
    display: flex;
    margin: 0 -10px;
    align-items: center;
    justify-content: flex-start;

    .button {
      margin: 0 10px;
      flex: 1 1 calc(50% - 20px);
    }
  }
}

.form-row {
  &__control {
    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}
.tr-search {
  font-family: Yantramanav;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  --box-shadow: inset 0 0 0 0.8px var(--gray-500);
}

.search-form-user {
  padding: calc(16px + var(--ion-safe-area-top)) 24px 0;
  ion-searchbar {
    font-family: "Yantramanav";
    --color: var(--fitnesswhite);
    --icon-color: var(--gray-500);
    --box-shadow: none;
    border: 0.8px solid var(--gray-500);
    border-radius: 8px;
  }
  .search-form__clear-btn {
    font-family: "Yantramanav";
    font-size: 16px;
    font-weight: 500;
    --color: var(--gray-500);
  }
}
.mb-10 {
    margin-bottom: 10px;
}
.small-search {
  justify-content: center;
  ion-searchbar{
    max-width: 500px;
  }
}
</style>
