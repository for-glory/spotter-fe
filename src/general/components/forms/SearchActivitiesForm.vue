<template>
  <div
    class="search-form"
    :class="{ 'search-form--on-focus': isFocused || visibleResult, 'web-search-form': isWeb }"
  >
    <ion-back-button 
    v-if="backBtn"
    class="search-form__back-btn"
    @click="$emit('back')"
    icon="assets/icon/arrow-back.svg"
    >
  </ion-back-button>
<div :class="['search-container']">
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
  </div>  

    <ion-content
      v-if="!hideResults"
      :class="{
        'search-form__results--with-back-btn': backBtn,
        'pt-100': isWithTabs
      }"
      class="search-form__results ion-padding-horizontal"
    >
      <ion-spinner v-if="activityLoading" name="lines" class="spinner" />
      <router-link
        v-else-if="!activityLoading && searchResults?.length"
        v-for="searchResult in searchResults"
        :key="searchResult.id"
        :to="{
          name: handleRedirect(searchResult.__typename),
          params: { id: searchResult.id },
        }"
      >
        <search-result
          :item="searchResult"
          :showRating="!isActivitiesNearbyTab"
        />
      </router-link>
      <ion-item lines="none" v-else-if="!searchQuery?.length">
        <ion-label class="ion-text-center">Type something to search</ion-label>
      </ion-item>
      <ion-item lines="none" v-else>
        <ion-label class="ion-text-center">No results found...</ion-label>
      </ion-item>
    </ion-content>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  defineProps,
  computed,
  withDefaults,
  defineEmits,
  defineExpose,
} from "vue";
import {
  IonSearchbar,
  SearchbarCustomEvent,
  IonButton,
  IonBackButton,
  IonItem,
  IonLabel,
  IonSpinner,
  IonContent
} from "@ionic/vue";
import {
  FacilitiesQueryVariables,
  RoleEnum,
  ActivitiesDocument,
  ActivitiesQuery,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import debounce from "lodash/debounce";
import SearchResult from "@/users/views/facilities/SearchResult.vue";
import { EntitiesEnum } from "@/const/entities";
import reducer from "@/helpers/reducers/activities-search";

const props = withDefaults(
  defineProps<{
    type: string;
    hiddenCancel?: boolean;
    backBtn?: boolean;
    visibleResult?: boolean;
    placeholder?: string;
    hideResults?: boolean;
    isWithTabs?: boolean;
    isWeb?: boolean;
  }>(),
  {
    backBtn: false,
    hiddenCancel: false,
    visibleResult: false,
    placeholder: "Enter name or address...",
    hideResults: false,
    isWithTabs: false,
    isWeb: false
  }
);

const emits = defineEmits<{
  (e: "search", value?: string): void;
  (e: "handle-focus"): void;
  (e: "handle-blur"): void;
}>();

const isFocused = ref<boolean>(false);
const searchBar = ref<typeof IonSearchbar | null>(null);
const isActivitiesNearbyTab = computed(
  () => props?.type === EntitiesEnum.ActivitiesNearby
);

const searchQuery = ref<string>("");
const params: FacilitiesQueryVariables = {
  first: 100,
  search: searchQuery.value,
};

const {
  result: activityResult,
  loading: activityLoading,
  refetch: activityRefetch,
} = useQuery<ActivitiesQuery>(ActivitiesDocument, {
  ...params,
  role: RoleEnum.Trainer,
});

const searchResults = computed(() =>
  reducer.activityReducer(activityResult.value)
);

const search = debounce((event?: SearchbarCustomEvent) => {
  console.log('call serach===', event);
  
  if (props.hideResults) {
    emits("search", event?.detail?.value);
    return;
  }
  searchQuery.value = event?.detail?.value || null;
  props?.type === EntitiesEnum.ActivitiesNearby;
  if (searchQuery.value) { 
    activityRefetch({ first: 100, search: searchQuery.value });
  }
}, 1000);

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

defineExpose({
  setFocus,
});

// Redirect handler
const handleRedirect: any = (itemType: string) => {
  switch (itemType.toUpperCase()) {
    case EntitiesEnum.Workout:
      return EntitiesEnum.UserWorkout;
    case EntitiesEnum.User:
      return EntitiesEnum.Trainer;
    case EntitiesEnum.Facility:
      return EntitiesEnum.Facility;

    default:
      return EntitiesEnum.Facility;
  }
};
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
  padding: calc(16px + var(--ion-safe-area-top)) 24px 0;
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
    z-index: 99;
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
.search-container {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
}

.web-search-form {
  width: 100%;
  justify-content: center;
  .search-container {
    width: 530px;
  }

  ion-content {
    --background: var(--gray-800) !important;
  }
}
.pt-100 {
  --padding-top: 100px;
}
</style>
