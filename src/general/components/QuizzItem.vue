<template>
  <div class="quizz-item">
    <div class="quizz-item__main">
      <div class="quizz-item__head">
        <span class="quizz-item__title">{{ quizz.title }}</span>
        <span class="quizz-item__description" v-html="quizz.description"></span>
      </div>
      <div class="quizz-item__body">
        <template v-if="quizz.type === QuizzTypesEnum.Input">
          <base-input :rows="3" :maxlength="150" v-model:value="value" />
        </template>
        <template v-if="quizz.type === QuizzTypesEnum.Select">
          <ion-radio-group v-model="value">
            <ion-item
              lines="none"
              class="radiobutton"
              :key="option?.id || index"
              v-for="(option, index) in quizz.options"
              :class="{ 'radiobutton--checked': value === option?.value }"
            >
              <ion-label>{{ option?.title }}</ion-label>
              <ion-radio slot="end" :value="option?.value" />
            </ion-item>
          </ion-radio-group>
        </template>
        <template v-if="quizz.type === QuizzTypesEnum.MultiSelect">
          <checkbox-group
            @change="multiselectChange"
            :options="checkboxGroupOptions || []"
          />
        </template>
        <template v-if="quizz.type === QuizzTypesEnum.File">
          <photo-loader
            circle-shape
            type="avatar"
            :photo="value"
            @change="photoSelected"
          />
        </template>
        <template v-if="quizz.type === QuizzTypesEnum.ModelSelect">
          Model select
        </template>
        <template v-if="quizz.type === QuizzTypesEnum.MultiModelSelect">
          Multimodelselect
        </template>
      </div>
    </div>
    <div class="quizz-item__footer">
      <ion-button
        expand="block"
        @click="saveValue()"
        :disabled="isDisabled || loading"
      >
        Next
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonItem,
  IonRadio,
  IonRadioGroup,
  IonLabel,
} from "@ionic/vue";
import { computed, ref, watch, defineProps, defineEmits } from "vue";
import { Quizz, QuizzStatusEnum, QuizzTypesEnum } from "@/generated/graphql";
import PhotoLoader from "@/general/components/blocks/PhotoLoader.vue";
import CheckboxGroup from "./blocks/CheckboxGroup.vue";
import { CheckboxValueType } from "@/ts/types/checkbox-value";

export type QuizzItemAnswer = {
  value: string | number | undefined;
};

export type IQuizzItem = Pick<
  Quizz,
  "id" | "type" | "title" | "description" | "status" | "options"
>;

const props = defineProps<{
  quizz: IQuizzItem;
  loading: boolean;
}>();

const emits = defineEmits<{
  (e: "next", data: { value?: string | string[] }): void;
}>();

const value = ref<string | undefined>(
  props.quizz?.options?.length && props.quizz.type === QuizzTypesEnum.Select
    ? props.quizz.options[0]?.value
    : undefined
);

const checkboxValue = ref<string[]>();

const isRequired = computed<boolean>(
  () => props.quizz?.status === QuizzStatusEnum.Necessary
);

const isDisabled = computed(() => {
  if (props.quizz.type === QuizzTypesEnum.File && value.value?.length) {
    return false;
  }

  if (props.quizz.type === QuizzTypesEnum.MultiSelect) {
    return !checkboxValue.value?.length;
  }

  return !(typeof value.value === "string" && value.value.length);
});

const checkboxGroupOptions = ref<CheckboxValueType[] | undefined>(
  props.quizz.options?.map((option) => {
    return {
      id: option?.id,
      label: option?.title,
      value: option?.value,
      isChecked: false,
    };
  })
);

watch(
  () => props.quizz,
  () => {
    value.value = undefined;
    isRequired.value = props.quizz?.status === QuizzStatusEnum.Necessary;
  }
);

const saveValue = () => {
  emits("next", {
    value:
      props.quizz.type === QuizzTypesEnum.MultiSelect
        ? checkboxValue.value
        : value.value,
  });
};

const photoSelected = (photo: string) => {
  value.value = photo;
};

const multiselectChange = (data: string[]): void => {
  checkboxValue.value = data;
};
</script>

<style lang="scss" scoped>
.quizz-item {
  display: flex;
  min-height: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: calc(32px + var(--ion-safe-area-bottom));

  &__head {
    min-height: 28vh;
    padding-top: 48px;
    text-align: center;
    margin-bottom: 32px;
  }

  &__title {
    display: block;
    font-size: 28px;
    line-height: 1.3;
    max-width: 254px;
    margin: 0 auto 20px;
    color: var(--ion-color-primary);
    font-family: var(--title-font-family);
  }

  &__description {
    display: block;
    margin: 0 auto;
    font-size: 14px;
    line-height: 1.5;
    font-weight: 300;
    max-width: 260px;
    color: var(--gray-400);
  }

  &__footer {
    margin-top: 32px;

    .button {
      margin: 0;
    }
  }
}

.radiobutton {
  font-size: 14px;
  line-height: 1.5;
  --padding-top: 0;
  --padding-bottom: 0;
  --border-radius: 8px;
  --min-height: 46.41px;
  --color: var(--gray-500);
  --inner-padding-top: 0;
  --inner-padding-bottom: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  --background: var(--gray-700);
  --padding-start: var(--container-offset);
  --padding-end: var(--container-offset);
  --border-width: 0.8px;
  --border-style: solid;

  &:not(:first-child) {
    margin-top: 16px;
  }

  &--checked {
    --color: var(--ion-color-white);
    --border-color: var(--ion-color-primary);
  }

  ion-radio {
    width: 18px;
    height: 18px;
    border-width: 1.8px;
    margin: 3px 3px 3px 20px;
    --color: var(--ion-color-medium);
    --mark-width: 12px;
    --mark-height: 9px;

    &::part(mark) {
      background-position: 50% 50%;
      background-repeat: no-repeat;
      width: calc(100% + var(--border-width));
      height: calc(100% + var(--border-width));
      background-size: var(--mark-width) var(--mark-height);
      background-image: url(/public/assets/icon/check-mark.svg);
    }
  }

  ion-label {
    margin-top: 0;
    margin-bottom: 0;
    padding-top: 12px;
    padding-bottom: 12px;
  }
}
</style>
