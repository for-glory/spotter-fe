<template>
  <div class="search-form" :class="{ 'search-form--on-focus': isFocused }">
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
      }"
    >
    </ion-searchbar>

    <ion-button id="open-sort-modal" class="sort-btn">
      <ion-icon :icon="require('../../../../public/assets/icon/sort.svg')" />
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
      :class="{
        'search-form__results--with-back-btn': backBtn,
      }"
      class="search-form__results ion-padding-horizontal"
    >
      <ion-spinner v-if="loading" name="lines" class="spinner" />
      <template v-else-if="!loading && searchResults.length">
        <router-link
          :key="workout?.id"
          class="workout"
          v-for="workout in searchResults"
          :to="{
            name: !workout.was_ordered_by_me
              ? EntitiesEnum.UserWorkout
              : EntitiesEnum.UserExercisesList,
            params: { id: workout?.id },
          }"
        >
          <workout-item
            :duration="workout.duration"
            @click="onResultItemClick($event, workout)"
            :title="workout?.title || ''"
            :pathUrl="`${VUE_APP_CDN}${workout.preview}` || ''"
            :type="workout?.type?.name || ''"
            :trainer="
              `${workout?.trainer?.first_name} ${workout?.trainer?.last_name}` ||
              ''
            "
          />
        </router-link>
      </template>
      <ion-item v-else>
        <ion-label class="ion-text-center">No results found...</ion-label>
      </ion-item>
    </ion-content>
  </div>
  <sort-form :route-name="routeName" />
</template>

<script setup lang="ts">
import { ref, defineProps, computed, withDefaults, defineEmits } from "vue";
import { IonContent, IonIcon, IonSpinner, IonLabel, IonItem } from "@ionic/vue";
import {
  IonSearchbar,
  SearchbarCustomEvent,
  IonButton,
  IonBackButton,
} from "@ionic/vue";
import {
  WorkoutsDocument,
  Workout,
  QueryWorkoutsOrderByColumn,
  SortOrder,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import SortForm from "@/general/components/forms/SortForm.vue";
import debounce from "lodash/debounce";
import WorkoutItem from "@/users/components/Workout.vue";
import { EntitiesEnum } from "@/const/entities";

withDefaults(
  defineProps<{
    hiddenCancel?: boolean;
    backBtn?: boolean;
    placeholder?: string;
    routeName: string;
  }>(),
  {
    backBtn: false,
    hiddenCancel: false,
  }
);

const emits = defineEmits<{
  (e: "handle-item-click", item: Workout): void;
}>();

const isFocused = ref<boolean>(false);
const searchBar = ref<typeof IonSearchbar | null>(null);
const VUE_APP_CDN = ref(process.env.VUE_APP_CDN);

const searchQuery = ref<string>("");

const { result, loading, refetch } = useQuery(WorkoutsDocument, {
  dynamic_search: searchQuery.value,
  orderByColumn: QueryWorkoutsOrderByColumn.CreatedAt,
  order: SortOrder.Desc,
  first: 1000,
});

const searchResults = computed(() => result.value?.workouts?.data.filter((workout: any) => !workout.was_ordered_by_me) ?? []);

const search = debounce((event?: SearchbarCustomEvent) => {
  searchQuery.value = event?.detail?.value || "";
  refetch({
    dynamic_search: event?.detail?.value || "",
    first: 1000,
    order: SortOrder.Desc,
    orderByColumn: QueryWorkoutsOrderByColumn.CreatedAt,
  });
}, 1000);

const focusHandle = () => {
  isFocused.value = true;
};

const onResultItemClick = (event: CustomEvent, item: Workout) => {
  emits("handle-item-click", item);
};

const clearForm = () => {
  const el: HTMLInputElement =
    searchBar.value?.$el.querySelector(".searchbar-input");
  el.value = "";
  isFocused.value = false;
};
</script>

<style lang="scss" scoped>
.search-form {
  display: flex;
  position: relative;
  align-items: center;
  padding: calc(16px + var(--ion-safe-area-top)) 24px 0;
  justify-content: flex-end;
  transition: background-color 0.35s ease;

  &--on-focus {
    background-color: var(--gray-800);
  }

  &__control {
    padding: 0;
    width: 100%;
    z-index: 15;
    transition: right 0.35s ease;
    --border-radius: 8px 0 0 8px;
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
    margin: 0 -4px 0 5px;
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
    position: absolute;
    --padding-top: 32px;
    transform-origin: 50% 0;
    transition: opacity 0.35s ease, transform 0.35s ease;
    --padding-bottom: calc(24px + var(--ion-safe-area-bottom));
    height: calc(
      100vh - 72px + var(--ion-safe-area-top) - var(--ion-safe-area-bottom)
    );

    .search-form:not(.search-form--on-focus) & {
      opacity: 0;
      top: -9999px;
      left: -9999px;
      transform: scaleY(0);
      transition: all 0s ease 0.35s, opacity 0.35s ease, transform 0.35s ease;
      gap: 12px;
    }
  }
}
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
.holder-content {
  display: flex;
  justify-content: center;
}

.workout {
  display: block;

  &:not(:first-child) {
    margin-top: 16px;
  }
}

ion-button.sort-btn {
  --background: var(--gray-700);
  --border-color: var(--gray-600) var(--gray-600) var(--gray-600)
    var(--gray-700);
  --border-radius: 0 8px 8px 0;
  --border-width: 1px;
  --border-style: solid;
  margin-inline: 0;
}
</style>
