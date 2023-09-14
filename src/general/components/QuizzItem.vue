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
    <div class="buttons">
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
  align-items: center;
  min-height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: calc(32px + var(--ion-safe-area-bottom));

  &__main {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
    gap: 12px;
    width: 50%;
    @media (max-width: 992px) {
      width: 100%;
    }
  }

  &__head {
    padding-top: 48px;
    text-align: center;
    margin-bottom: 32px;
    width: 100%;
  }

  &__body {
    padding-top: 48px;
    width: 100%;

    ion-item {
      margin: 0 auto;
      width: 40%;

      @media (max-width: 992px) {
        width: 100%;
      }
    }
  }

  &__title {
    display: block;
    font-size: 28px;
    line-height: 1.3;
    max-width: 100%;
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
    max-width: 400px;
    color: var(--gray-400);
  }

  .buttons {
    margin-top: 7.5rem;
    margin-top: 1rem;
    border-radius: 8px;
    width: 25%;

    @media (max-width: 992px) {
      width: 100%;
    }

    ion-button {
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font: 700 18px/1 Yantramanav;
      width: 100%;
      height: 48px;
      --border-radius: 12px;
      color: var(--dark-grey, #262626);
      text-align: center;
      font-family: Lato;
      font-size: 24px;
      font-style: normal;
      font-weight: 500;
      line-height: 130%;
    }
  }
}

.radiobutton {
  align-self: center;
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
