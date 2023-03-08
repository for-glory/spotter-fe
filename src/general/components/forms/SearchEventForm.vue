<template>
  <div
    class="search-form"
    :class="{ 'search-form--on-focus': isFocused || visibleResult }"
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
      placeholder="Enter name or address..."
      :class="{
        'search-form__control--on-focus': isFocused,
        'search-form__control--with-back-btn': backBtn,
        'search-form__control--with-cancel-btn': !hiddenCancel,
      }"
    >
    </ion-searchbar>

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
      :class="{
        'search-form__results--with-back-btn': backBtn,
      }"
      class="search-form__results ion-padding-horizontal"
    >
      <ion-spinner name="lines" class="spinner" v-if="eventsLoading" />
      <template v-else>
        <event-item
          v-for="eventResult in eventsSearchResult"
          :item="eventResult"
          :key="eventResult.id"
          @click="onResultItemClick(eventResult.id)"
        />
      </template>
    </ion-content>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, withDefaults, defineEmits } from "vue";
import {
  IonContent,
  IonBackButton,
  IonSearchbar,
  SearchbarCustomEvent,
  IonButton,
  IonSpinner,
} from "@ionic/vue";
import { EventsDocument, EventsQuery } from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import EventItem from "@/general/components/EventItem.vue";
import { debounce } from "lodash";

withDefaults(
  defineProps<{
    type: string;
    hiddenCancel?: boolean;
    backBtn?: boolean;
    visibleResult?: boolean;
  }>(),
  {
    backBtn: false,
    hiddenCancel: false,
    visibleResult: false,
  }
);

const emits = defineEmits<{
  (e: "handle-item-click", item: string): void;
  (e: "handle-focus"): void;
  (e: "handle-blur"): void;
}>();

const isFocused = ref<boolean>(false);
const searchBar = ref<typeof IonSearchbar | null>(null);

const searchQuery = ref<string>("");

const {
  result: eventsResult,
  refetch: refetchEvents,
  loading: eventsLoading,
} = useQuery<EventsQuery>(EventsDocument, {
  first: 20,
  page: 1,
  title: searchQuery.value,
});
const eventsSearchResult = computed(
  () => eventsResult.value?.events?.data ?? []
);

const search = debounce((event?: SearchbarCustomEvent) => {
  searchQuery.value = event?.detail?.value || "";
  refetchEvents({
    first: 20,
    page: 1,
    title: searchQuery.value,
  });
}, 1000);

const focusHandle = () => {
  isFocused.value = true;
  emits("handle-focus");
};

const onResultItemClick = (id: string) => {
  emits("handle-item-click", id);
};

const clearForm = () => {
  const el: HTMLInputElement =
    searchBar.value?.$el.querySelector(".searchbar-input");
  el.value = "";
  isFocused.value = false;
  emits("handle-blur");
};
</script>

<style lang="scss" scoped>
.search-form {
  display: flex;
  position: relative;
  align-items: center;
  padding: calc(16px + var(--ion-safe-area-top)) 24px 8px;
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
    --padding-top: 24px;
    position: absolute;
    transform-origin: 50% 0;
    transition: opacity 0.35s ease, transform 0.35s ease;
    height: calc(100vh - 72px - var(--ion-safe-area-top));
    --padding-bottom: calc(16px + var(--ion-safe-area-bottom));

    .search-form:not(.search-form--on-focus) & {
      opacity: 0;
      top: -9999px;
      left: -9999px;
      transform: scaleY(0);
      transition: all 0s ease 0.35s, opacity 0.35s ease, transform 0.35s ease;
    }
  }
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
</style>
