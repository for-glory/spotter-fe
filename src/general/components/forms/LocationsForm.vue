<template>
  <ion-modal
    class="locations-form"
    :is-open="isOpen"
    :initial-breakpoint="0.5"
    :breakpoints="[0, 0.25, 0.5, 0.75]"
  >
    <base-layout :header-fixed="false">
      <template #header>
        <page-header @back="emits('close-modal')" back-btn />
      </template>
      <template #content>
        <div
          class="search-form"
          :class="{ 'search-form--on-focus': isFocused }"
        >
          <ion-back-button
            class="search-form__back-btn"
            @click="$emit('back')"
            icon="assets/icon/arrow-back.svg"
          >
          </ion-back-button>
          <ion-searchbar
            ref="searchBar"
            @ion-change="search"
            @ion-blur="blurHandle"
            @ion-focus="focusHandle"
            show-clear-button="never"
            class="search-form__control"
            search-icon="assets/icon/search.svg"
            placeholder="Enter your location..."
            :class="{
              'search-form__control--on-focus': isFocused,
            }"
          >
          </ion-searchbar>
        </div>
        <div
          class="search-result"
          v-for="address in addresses"
          :key="address.id"
        >
          <ion-button
            class="search-result__holder"
            fill="clear"
            @click="onChooseLocation(address.name)"
          >
            <address-item class="address" large>
              {{ address.name }}
            </address-item>
          </ion-button>
        </div>
      </template>
    </base-layout>
  </ion-modal>
</template>

<script lang="ts" setup>
import {
  IonModal,
  IonSearchbar,
  IonButton,
  SearchbarCustomEvent,
  IonBackButton,
} from "@ionic/vue";
import { withDefaults, defineProps, defineEmits, ref } from "vue";
import AddressItem from "@/general/components/AddressItem.vue";

const mockedAddresses = [
  {
    name: "Alabama, Huntsville",
    id: "1",
  },
  {
    name: "South Carolina, Huntsville",
    id: "2",
  },
  {
    name: "Virginia, Huntsville",
    id: "3",
  },
  {
    name: "South Carolina, Huntsville",
    id: "4",
  },
  {
    name: "South Carolina, Huntsville",
    id: "5",
  },
  {
    name: "South Carolina, Huntsville",
    id: "6",
  },
];

withDefaults(
  defineProps<{
    isOpen: boolean;
  }>(),
  {
    isOpen: false,
  }
);

const isFocused = ref<boolean>(false);
const searchBar = ref<typeof IonSearchbar | null>(null);
const addresses = ref(mockedAddresses);

const emits = defineEmits<{
  (e: "close-modal"): void;
  (e: "set-location", value: string): void;
}>();

const onChooseLocation = (value: string) => {
  emits("set-location", value);
};

const focusHandle = () => {
  isFocused.value = true;
};

const blurHandle = () => {
  isFocused.value = false;
};

const search = (event?: SearchbarCustomEvent) => {
  if (event?.detail?.value) {
    addresses.value = addresses.value.reduce(
      (acc: typeof mockedAddresses, cur) => {
        if (
          cur.name
            .toUpperCase()
            .includes(event?.detail?.value?.toUpperCase() as string)
        ) {
          acc.push(cur);
        }
        return acc;
      },
      []
    );
  } else {
    addresses.value = mockedAddresses;
  }
};
</script>

<style scoped lang="scss">
.locations-form {
  padding: 0 24px;
}

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
}
.search-result {
  padding: 0 24px;
  display: flex;
  &__holder {
    width: 100%;
    border-bottom: 0.8px solid var(--gray-600);
  }
}
.address {
  width: 100%;
}
</style>
