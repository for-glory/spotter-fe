<template>
  <ion-modal
    ref="filtersModal"
    class="filters-modal"
    :class="{
      'ios-app-top': isPlatform('ios') && showAllTags,
    }"
    style="max-height: 100vh;"
    :is-open="isFiltersOpen"
    :backdrop-dismiss="true"
    @willDismiss="() => emits('close')"
  >
    <span class="filters-modal__handle"></span>
    <div v-if="!showAllTags" class="filters-modal__content">
      <div class="form-row">
        <ion-label class="font-medium color-fitness-white font-16">Intensity Level</ion-label>
        <ion-spinner
          v-if="typesLoading"
          name="lines"
          class="spinner"
        />
        <div 
          v-else
          class="d-flex flex-wrap gap-12"
          style="margin-top: 8px;"
        >
          <div 
            v-for="(type) in workoutTypes"
            :key="type.id"
            class="type-item"
            @click="selectType(type)"
            :class="{ 'selected-type': isSelectedType(type) }"
          >
            {{ type.name }}
          </div>
        </div>
      </div>
      <div class="form-row">
        <div class="d-flex align-items-center justify-content-between">
          <ion-label class="font-medium color-fitness-white font-16">Tags</ion-label>
          <ion-text @click="showAllTags = true" v-if="bodyParts.length" class="font-medium color-gold font-16">View All</ion-text>
        </div>
        <ion-spinner
          v-if="bodyPartsLoading"
          name="lines"
          class="spinner"
        />
        <div 
          v-else
          class="d-flex flex-wrap gap-12"
          style="margin-top: 8px;"
        >
          <div 
            v-for="(part) in bodyParts.slice(0, 6)"
            :key="part.id"
            class="type-item"
            @click="selectBodyPart(part)"
            :class="{ 'selected-type': isSelectedBodyPart(part) }"
          >
            {{ part.label }}
          </div>
        </div>
      </div>
      <div class="filters-modal__buttons">
        <ion-button @click="resetFilters" expand="block" class="secondary">
          Reset
        </ion-button>
        <ion-button
          expand="block"
          @click="applyFilters"
          :disabled="!selectedBodyParts && !selectedTypes"
        >
          Show results
        </ion-button>
      </div>
    </div>
    <div 
      v-if="showAllTags" 
      class="filters-modal__content" style="max-height: 100vh;"
    >
      <ion-toolbar class="header">
        <ion-buttons slot="start">
          <ion-button class="back-btn" @click="showAllTags = false">
            <ion-icon src="assets/icon/arrow-back.svg" />
          </ion-button>
        </ion-buttons>
        <ion-title>Select Tags</ion-title>
      </ion-toolbar>
      <div 
        class="d-flex flex-wrap gap-12"
        style="margin-top: 8px;"
      >
        <div 
          v-for="(part) in bodyParts"
          :key="part.id"
          class="type-item"
          @click="selectBodyPart(part)"
          :class="{ 'selected-type': isSelectedBodyPart(part) }"
        >
          {{ part.label }}
        </div>
      </div>
      <div class="filters-modal__buttons" style="padding: 16px 0px;">
        <ion-button @click="showAllTags = false" expand="block">
          Save
        </ion-button>
      </div>
    </div>
  </ion-modal>
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
  IonButton,
  IonBackButton,
  IonLabel,
  IonSpinner,
  IonIcon,
  IonModal,
  toastController,
  IonContent,
  IonToolbar,
  isPlatform
} from "@ionic/vue";
import {
  RoleEnum,
  WorkoutTypesQuery,
  WorkoutTypesDocument,
  BodyPartsDocument,
  BodyPartsQuery
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import SearchResult from "@/users/views/facilities/SearchResult.vue";
import { EntitiesEnum } from "@/const/entities";
import router from "@/router";
import { Emitter, EventType } from "mitt";
import useRoles from "@/hooks/useRole";
import { useDailysStore } from "@/general/stores/useDailysStore";
import { useUserStore } from "@/general/stores/user";
import RadioGroup from "@/general/components/blocks/RadioGroup.vue";

const { role }= useRoles()
const props = withDefaults(
  defineProps<{
    isOpen: boolean;
  }>(),
  {
    isOpen: false,
  }
);
const emits = defineEmits<{
  (e: 'close'): void;
  (e: 'applyFilter'): void;
}>();

const dailysStore = useDailysStore();
const userStore = useUserStore();
const selectedTypes = ref<Array<any>>([]);
const selectedBodyParts = ref<Array<any>>([]);
const isFiltersOpen = computed(() => props.isOpen);
const showAllTags = ref<boolean>(false);

watch(() => props.isOpen,
() => {
  if(isFiltersOpen) {
    refetchTypes();
    refetchBodyParts();
  }
});
const { result: typesResult, loading: typesLoading, refetch: refetchTypes } = useQuery<WorkoutTypesQuery>(WorkoutTypesDocument, {
  first: 100,
  page: 1,
});

const { result: bodyPartsResult, loading: bodyPartsLoading, refetch: refetchBodyParts } = useQuery<BodyPartsQuery>(BodyPartsDocument, {
  first: 100,
  page: 1,
});

const workoutTypes = computed(() => typesResult.value?.workoutTypes?.data);
const bodyParts = computed(
  () =>
    bodyPartsResult.value?.bodyParts?.data.map((option) => {
      return {
        id: option?.id,
        label: option?.name,
        value: option?.id,
        isChecked: false,
      };
    }) || []
);

const isSelectedType = (type: any) => {
  return selectedTypes.value.includes(type.id);
};
const isSelectedBodyPart = (part: any) => {
  return selectedBodyParts.value.includes(part.id);
};
const selectType = (type: any) => {
  if(!isSelectedType(type)) {
    selectedTypes.value.push(type.id);
  } else {
    selectedTypes.value = selectedTypes.value.filter((selectedType) => selectedType !== type.id);
  }
};
const selectBodyPart = (part: any) => {
  if(!isSelectedBodyPart(part)) {
    selectedBodyParts.value.push(part.id);
  } else {
    selectedBodyParts.value = selectedBodyParts.value.filter((selectedPart) => selectedPart !== part.id);
  }
};

const applyFilters = () => {
  let filter = {
    level: selectedTypes,
    tags: selectedBodyParts,
  }
  userStore.setDailyFilter(filter);
  emits('applyFilter');
}

</script>

<style lang="scss" scoped>
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
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
.font-16 {
  font-size: 16px;
}
.type-item {
  padding: 10.5px 12px;
  border: 1px solid #3d3d3d;
  border-radius: 8px;
  color: #797979;
  font-size: 14px;
  font-family: --var(Yantramanav);
}
.selected-type {
  border-color: #e1dbc5;
  color: #e1dbc5;
}
.header {
  position: relative;
  padding-top: var(--ion-safe-area-top);
  --color: var(--ion-color-white);
  --min-height: var(--header-height);
  --background: var(--gray-800);
  --padding-top: 5px;
  --padding-bottom: 5px;
  --padding-start: var(--container-offset);
  --padding-end: var(--container-offset);

  &--transparent {
    --background: transparent;
  }

  ion-buttons {
    margin: 0 -5px;
    min-width: 80px;

    ion-button {
      margin: 0 5px;

      &:first-child {
        margin-left: 1px;
      }
    }
  }

  &__title {
    padding: 0;
    font-family: "Lato";
    font-size: 20px;
    line-height: 1.5;
    font-weight: 500;
    text-align: center;
  }
  &_trainer__title {
    font: 500 20px Lato;
    text-align: center;
    font-style: normal;
    font-weight: 500;
    color: var(--gold);
  }
  &_overview__title {
    font-family: Lato;
    font-size: 18px;
    text-align: center;
    font-weight: 500;
    line-height: 150%;
    letter-spacing: 0.216px;
  }
  .title-ytmn-20 {
    font-family: Yantramanav;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    text-align: center;
    color: var(--fitnesswhite);
  }
}
.back-btn {
  height: 32px;
  display: block;
  min-width: 32px;
  font-size: 24px;
  --border-radius: 50% !important;
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

  .header--transparent:not(.header--buttons-transparent) & {
    border-radius: 50%;
    backdrop-filter: blur(4px);
    --background: rgba(var(--ion-color-black-rgb), 0.12);
  }

  ion-icon {
    font-size: 1em;
  }
}
.user-header {
  .header__title {
    font-family: "Yantramanav";
    color: var(--fitnesswhite);
    line-height: 30px;
  }
}
</style>
