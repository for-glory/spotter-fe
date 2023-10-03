<template>
  <div :class="{ 'web-segments': isWeb, 'native-segments': Capacitor.isNativePlatform() }">
    <ion-segment
      id="page-tabs"
      mode="ios"
      :class="['tabs', 'ion-margin-top']"
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
      <img v-if="!isIcon" :src="getTabImage(tab.name)" style="width: 24px; height: 24px;" />
      <IonIcon v-else :src="getTabImage(tab.name)" style="width: 24px; height: 24px;" />
        <!-- <img v-if="props.type === 'image'" :src="getTabImage(tab.name)" style="width: 24px; height: 24px;" /> -->
        <!-- <span v-else>{{ tab.labelActive }}</span> -->
      </ion-segment-button>
    </ion-segment>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { IonIcon, IonSegment, IonSegmentButton, SegmentCustomEvent } from "@ionic/vue";
import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "@/const/entities";
import { Capacitor } from "@capacitor/core";

const props = withDefaults(defineProps<{
  tabs?: TabItem[];
  value?: EntitiesEnum;
  type?: 'image';
  isWeb?:boolean;
  isIcon?:boolean;
}>(), {
  isWeb: false,
  isIcon:false
});

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

.native-segments {
    ion-segment-button {
      --color: var(--gray-500);
      --color-checked: var(--gray-800);
    }
}

.web-segments {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  ion-segment {
    max-width: 500px;
    width: 500px;
    padding-left: 29px;
    padding-right: 29px;

    &-button {
      --color: var(--gray-500);
      --color-checked: var(--gray-700);
    }
  }

}
</style>
