<template>
  <ion-modal
    id="sort-modal"
    class="sort-form"
    trigger="open-sort-modal"
    ref="modal"
  >
    <ion-spinner
      name="lines"
      v-if="bodyPartsLoading || workoutTypesLoading"
      class="spinner"
    />
    <div class="filters-wrap" v-else>
      <div class="filters-item">
        <div class="actions">
          <ion-label class="label">Intensity Level</ion-label>
        </div>
        <radio-item-group
          :value="selectedWorkoutsType"
          @on-change="setWorkoutType"
          :options="workoutTypes || []"
        />
        <div 
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
      <div class="filters-item">
        <div class="actions">
          <ion-label class="label">Muscle group</ion-label>
          <ion-button
            fill="clear"
            class="select-btn"
            @click="onSelectAllBodyParts"
          >
            Select All
          </ion-button>
        </div>
        <checkbox-group @change="setBodyParts" :options="bodyParts" />
      </div>
    </div>
    <div class="actions-wrapper">
      <ion-button @click="clearState" class="secondary">Reset</ion-button>
      <ion-button
        id="open-sort-modal"
        @click="onConfirm"
        expand="block"
        class="confirm-btn"
      >
        Show {{ workoutsCount }} results
      </ion-button>
    </div>
  </ion-modal>
</template>

<script lang="ts" setup>
import {
  BodyPartsDocument,
  BodyPartsQuery,
  WorkoutsQueryVariables,
  QueryWorkoutsOrderByColumn,
  SortOrder,
  WorkoutsDocument,
  WorkoutsQuery,
  WorkoutType,
  WorkoutTypesDocument,
  WorkoutTypesQuery,
} from "@/generated/graphql";
import { IonModal, IonLabel, IonSpinner, IonButton } from "@ionic/vue";
import { useQuery } from "@vue/apollo-composable";
import CheckboxGroup from "@/general/components/blocks/CheckboxGroup.vue";
import RadioItemGroup from "@/general/components/blocks/RadioItemGroup.vue";
import { withDefaults, defineProps, computed, ref, Ref } from "vue";
import router from "@/router";
import debounce from "lodash/debounce";
import { CheckboxValueType } from "@/ts/types/checkbox-value";

const props = withDefaults(
  defineProps<{
    isOpen?: boolean;
    routeName: string;
  }>(),
  {
    isOpen: false,
  }
);

const selectedWorkoutsType = ref<WorkoutType | null>(null);
const selectedBodyParts = ref<string[] | null>(null);
const selectedLocation = ref("");
const selectAllBodyParts = ref(false);
const bodyParts = ref<CheckboxValueType[] | [] | null>(null);
const modal = ref<Ref | null>(null);

const { result: workoutTypesResult, loading: workoutTypesLoading } =
  useQuery<WorkoutTypesQuery>(WorkoutTypesDocument, {
    first: 100,
    page: 1,
  });

const workoutTypes = computed(
  () => workoutTypesResult.value?.workoutTypes?.data
);

const {
  result: bodyPartsResult,
  loading: bodyPartsLoading,
  onResult,
} = useQuery<BodyPartsQuery>(BodyPartsDocument, {
  first: 100,
  page: 1,
});

const setAllBodyParts = (checked: boolean) => {
  if (bodyParts.value)
    bodyParts.value =
      bodyParts.value.map((option) => {
        return {
          ...option,
          isChecked: checked,
        };
      }) || [];
};

onResult((bodyPartsResult) => {
  bodyParts.value =
    bodyPartsResult?.data?.bodyParts?.data.map((option) => {
      return {
        id: option?.id,
        label: option?.name,
        value: option?.id,
        isChecked: false,
      };
    }) || [];
});

const selectedTypes = ref<Array<any>>([]);
const isSelectedType = (type: any) => {
  return selectedTypes.value.includes(type.id);
};
const selectType = (type: any) => {
  if(!isSelectedType(type)) {
    selectedTypes.value.push(type.id);
  } else {
    selectedTypes.value = selectedTypes.value.filter((selectedType) => selectedType !== type.id);
  }
};

const onSelectAllBodyParts = () => {
  selectAllBodyParts.value = !selectAllBodyParts.value;

  if (selectAllBodyParts.value) {
    selectedBodyParts.value = bodyPartsResult.value?.bodyParts?.data
      ? bodyPartsResult.value?.bodyParts?.data.reduce((acc: string[], cur) => {
          acc.push(cur.id as string);
          return acc;
        }, [])
      : [];

    setAllBodyParts(true);
  } else {
    selectedBodyParts.value = null;
    setAllBodyParts(false);
  }
};

const params = computed(() => {
  const queryParams: WorkoutsQueryVariables = {
    page: 1,
    first: 1000,
    dynamic_search: "",
    order: SortOrder.Desc,
    orderByColumn: QueryWorkoutsOrderByColumn.CreatedAt,
  };
  if (selectedWorkoutsType.value)
    queryParams.type_id = selectedWorkoutsType.value.id;
  if (selectedBodyParts.value)
    queryParams.has_body_parts = selectedBodyParts.value;
  return queryParams;
});

const { result, refetch } = useQuery<WorkoutsQuery>(WorkoutsDocument, params);

const workoutsCount = computed(() => {
  return result.value?.workouts?.paginatorInfo?.total;
});

const refetchReasult = debounce(() => {
  refetch();
}, 1000);

const setWorkoutType = (data: WorkoutType): void => {
  selectedWorkoutsType.value = data;
  refetchReasult();
};

const setBodyParts = (data: string[]): void => {
  selectedBodyParts.value = data;
  refetchReasult();
};

const clearState = () => {
  selectedWorkoutsType.value = null;
  selectedBodyParts.value = null;
  selectedLocation.value = "";
  setAllBodyParts(false);
};

const onConfirm = () => {
  modal.value.$el.dismiss();
  const query: { type: string; bodyParts?: string[]; workoutType?: string } = {
    type: "allWorkouts",
  };
  if (selectedWorkoutsType.value?.id)
    query.workoutType = selectedWorkoutsType.value.id;
  if (selectedBodyParts.value) query.bodyParts = selectedBodyParts.value;

  router.push({
    name: props.routeName,
    query,
  });
};
</script>

<style lang="scss" scoped>
.sort-form {
  --height: auto;
  align-items: flex-end;
  --backdrop-opacity: 0.6;
  --ion-backdrop-color: var(--ion-color-black);

  &::part(content) {
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
    border-radius: 20px 20px 0 0;
    -webkit-overflow-scrolling: touch;
    padding: 16px 24px calc(16px + var(--ion-safe-area-bottom));
    max-height: calc(
      100vh - 136px - var(--ion-safe-area-top) - var(--ion-safe-area-bottom)
    );
  }
}

.actions {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  justify-content: space-between;
}

.label {
  display: block;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;
  color: var(--ion-color-white);
}

.filters-item {
  margin-bottom: 12px;
}

.select-btn {
  height: 24px;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 400;
  margin: -4px -8px -2px 4px;
  --border-radius: 4px;
  --padding-top: 4px;
  --padding-bottom: 2px;
  --padding-start: 8px;
  --padding-end: 8px;
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(50vh - 60px) auto 0;
}

.actions-wrapper {
  display: flex;
  margin: 0 -8px;
  justify-content: space-between;

  .button {
    margin: 0 8px;
  }
  .secondary {
    flex: 0 0 calc(50% - 16px);
  }
  .confirm-btn {
    flex: 1 1 calc(50% - 16px);
  }
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
</style>
