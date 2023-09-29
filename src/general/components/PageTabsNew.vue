<template>
  <div>
    <ion-segment
      id="page-tabs"
      mode="ios"
      class="tabs ion-margin-top"
      @ionChange="segmentChanged"
      :value="value || (tabs && tabs[0].name)"
    >
      <ion-segment-button
        :key="tab.name"
        :value="tab.name"
        class="tabs__item"
        v-for="tab in tabs"
        :disabled="tab.disabled"
      >
      <img :src="getTabImage(tab.name)" style="width: 24px; height: 24px;" />
        <!-- <img v-if="props.type === 'image'" :src="getTabImage(tab.name)" style="width: 24px; height: 24px;" /> -->
        <!-- <span v-else>{{ tab.labelActive }}</span> -->
      </ion-segment-button>
    </ion-segment>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { IonSegment, IonSegmentButton, SegmentCustomEvent } from "@ionic/vue";
import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "@/const/entities";

const props = defineProps<{
  tabs?: TabItem[];
  value?: EntitiesEnum;
  type?: 'image'
}>();

const emit = defineEmits<{
  (e: "change", value: EntitiesEnum): void;
}>();

const segmentChanged = (event: SegmentCustomEvent) => {
  if (!event.detail.value) return;
  emit("change", event.detail.value as EntitiesEnum);
};

const getTabImage = (tabName: EntitiesEnum) => {
  const tab = props.tabs?.find((t) => t.name == tabName);
  // alert(tab);
  return tab ? (tab.name == props.value ? tab.labelActive : tab.labelInactive) : "";
};
</script>




<style lang="scss" scoped>
.tabs {
  width: auto;
  padding: 4px;
  border-radius: 8px;
  pointer-events: auto;
  backdrop-filter: blur(20px);
  background: #262626;

  &__item {
    --margin-top: 0;
    font-size: 14px;
    line-height: 1.5;
    font-weight: 400;
    --color: var(--gray-400);
    min-width: var(--btn-min-width);
    --padding-top: 9px;
    --padding-bottom: 9px;
    --padding-start: 16px;
    --padding-end: 16px;
    --color-checked: var(--gray-700);
    --indicator-color: var(--ion-color-primary);

    &::part(indicator) {
      padding: 0;
    }
  }
}
</style>
