<template>
  <base-layout hideNavigationMenu>
    <template #header>
      <page-header back-btn @back="onBack" title="Select Tags" />
    </template>
    <template #content>
      <ion-spinner v-if="loading" name="lines" class="spinner" />
      <div v-else class="content">
        <checkbox-group
          @change="onChange"
          :options="bodyParts"
        />
        <div class="button">
          <ion-button
            expand="block"
            @click="submit"
          >
            Save
          </ion-button>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { BodyPartsDocument, BodyPartsQuery } from "@/generated/graphql";
import { useWorkoutsStore } from "@/trainers/store/workouts";
import { IonSpinner, IonButton } from "@ionic/vue";
import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { clearAuthItems } from "@/router/middleware/auth";
import { EntitiesEnum } from "@/const/entities";
import CheckboxGroup from "@/general/components/blocks/CheckboxGroup.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { CheckboxValueType } from "@/ts/types/checkbox-value";
import { useDailysStore } from "@/general/stores/useDailysStore";

const router = useRouter();

const store = useDailysStore();

const { result, loading } = useQuery<BodyPartsQuery>(BodyPartsDocument, {
  first: 100,
  page: 1,
});

const bodyParts = computed(
  () =>
    result.value?.bodyParts?.data.map((option) => {
      return {
        id: option?.id,
        label: option?.name,
        value: option?.id,
        isChecked: store.workoutMuscleTypes?.length
          ? !!store.workoutMuscleTypesIds.find((i) => i === option?.id)
          : false,
      };
    }) || []
);

const onChange = (value: string[], option: CheckboxValueType) => {
  store.setMuscleTypes(value, option);
};

const submit = () => {
  router.go(-1);
}

const onBack = () => {
  router.go(-1);
};
const onLogout = () => {
  clearAuthItems();
  router.push({ name: EntitiesEnum.Login });
};
</script>

<style scoped lang="scss">
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(50% - 60px) auto 0;
}
.content {
  padding: 24px 24px calc(20px + var(--ion-safe-area-bottom));
  position: relative;

  ion-button {
    width: 100%;
  }
}
</style>
