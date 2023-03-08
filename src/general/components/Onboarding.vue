<template>
  <VOnboardingWrapper ref="wrapper" :steps="steps" :options="onboardingOptions">
    <template #default="{ step, index }">
      <VOnboardingStep class="vonboarding-step">
        <ion-card
          :class="'step-' + pageClassname + '-' + index"
          class="vonboarding-step__holder-step"
        >
          <div v-if="step.content">
            <h3 v-if="step.content.title">{{ step.content.title }}</h3>
            <div v-if="step.content.description">
              <p>{{ step.content.description }}</p>
            </div>
          </div>
          <div class="vonboarding-step__holder-button">
            <ion-button
              class="vonboarding-step__button-step"
              @click="handleNextClick(index + 1)"
              type="button"
            >
              Got it!
            </ion-button>
            <div class="vonboarding-step__one-step">
              <span>&#160;</span>
            </div>
            <div class="vonboarding-step__two-step"></div>
            <div class="vonboarding-step__three-step"></div>
            <div class="vonboarding-step__four-step"></div>
          </div>
        </ion-card>
      </VOnboardingStep>
    </template>
  </VOnboardingWrapper>
</template>

<script setup lang="ts">
import { IonButton, IonCard } from "@ionic/vue";
import {
  VOnboardingWrapper,
  useVOnboarding,
  VOnboardingStep,
} from "v-onboarding";
import "v-onboarding/dist/style.css";
import { onMounted, ref, defineProps, withDefaults, defineEmits } from "vue";
import { OnboardingStep } from "@/ts/types/onboardingStep";

const props = withDefaults(
  defineProps<{
    steps: OnboardingStep[];
    pageClassname?: string;
  }>(),
  {
    pageClassname: "",
  }
);

const emits = defineEmits<{
  (e: "finish"): void;
  (e: "change", index: number): void;
}>();

const wrapper = ref<any>(null);
const { start, goToStep } = useVOnboarding(wrapper);
const curStepIndex = ref<number>(0);
const onboardingOptions = {
  scrollToStep: {
    enabled: false,
  },
};

onMounted(async () => {
  setTimeout(() => {
    start();
    onboardingChanged(curStepIndex.value);
  }, 1000);
});

const handleNextClick = (index: number) => {
  if (index === props.steps.length) {
    emits("finish");
    onboardingChanged(-1);
    return;
  }
  curStepIndex.value = index;
  emits("change", curStepIndex.value);
  onboardingChanged(curStepIndex.value);
  goToStep(curStepIndex.value);
};

const onboardingChanged = (index: number) => {
  props.steps.map((step, i) => {
    const el = document.querySelector(step.attachTo.element);
    if (!el) return;
    index === i
      ? el.classList.add("onboarding-active")
      : el.classList.remove("onboarding-active");
  });
};
</script>

<style lang="scss">
.vonboarding-step {
  --v-onboarding-step-z: 9999;

  svg {
    opacity: 0.82 !important;
    z-index: 9999 !important;
  }

  > div {
    transform: none !important;
    inset: 0 !important;
  }

  &__holder-step {
    background: transparent;
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;

    h3 {
      margin: 0 0 0.5vh;
      font-weight: 500;
      font-size: 20px;
      line-height: 1.5;
      color: var(--gold);
    }

    p {
      margin: 0 0 2.6vh;
      font-weight: 300;
      font-size: 14px;
      line-height: 1.5;
      color: var(--gray-400);
    }

    &.step-detail-0,
    &.step-booking-0 {
      p {
        margin-bottom: 5.1vh;
      }
    }

    + div {
      &:before {
        display: none;
      }
    }
  }

  &__holder-button {
    width: 100%;

    ion-button {
      width: 183px;
      margin-bottom: 1.3vh;
    }
  }

  &__one-step {
    display: none;
    position: relative;
    width: 34%;
    height: 14vh;
    margin: 50px auto;
    margin-bottom: calc(161px + var(--ion-safe-area-bottom));
    border: 1px solid var(--ion-color-white);
    border-bottom: none;
    border-radius: 6px 6px 0 0;

    .step-booking-0 & {
      display: block;
    }

    &:before {
      content: "";
      position: absolute;
      left: -3px;
      bottom: 0;
      height: 4px;
      width: 4px;
      border-left: 1px solid var(--ion-color-white);
      border-bottom: 1px solid var(--ion-color-white);
      transform: rotate(-45deg) rotateY(0deg);
    }

    &:after {
      content: "";
      position: absolute;
      right: -3px;
      bottom: 0;
      height: 4px;
      width: 4px;
      border-left: 1px solid var(--ion-color-white);
      border-bottom: 1px solid var(--ion-color-white);
      transform: rotate(-45deg) rotateY(0deg);
    }

    span {
      position: absolute;
      left: 50%;
      bottom: 100%;
      height: 4.5vh;
      border-left: 1px solid var(--ion-color-white);
      overflow: hidden;
      text-indent: -9999px;
    }
  }

  &__two-step {
    display: none;
    position: relative;
    width: 1px;
    height: 24.8vh;
    margin: 11px 0 0 29%;
    margin-bottom: calc(103px + var(--ion-safe-area-bottom));
    border-left: 1px solid var(--ion-color-white);
    border-bottom: none;
    border-radius: 6px 6px 0 0;

    .step-booking-1 & {
      display: block;
    }

    &:before {
      content: "";
      position: absolute;
      left: -3px;
      bottom: 0;
      height: 4px;
      width: 4px;
      border-left: 1px solid var(--ion-color-white);
      border-bottom: 1px solid var(--ion-color-white);
      transform: rotate(-45deg) rotateY(0deg);
    }
  }

  &__three-step {
    display: none;
    position: relative;
    width: 1px;
    height: 24.8vh;
    margin: 11px 0 0 71%;
    margin-bottom: calc(103px + var(--ion-safe-area-bottom));
    border-right: 1px solid var(--ion-color-white);
    border-bottom: none;
    border-radius: 6px 6px 0 0;

    .step-booking-2 & {
      display: block;
    }

    &:before {
      content: "";
      position: absolute;
      left: -2px;
      bottom: 0;
      height: 4px;
      width: 4px;
      border-left: 1px solid var(--ion-color-white);
      border-bottom: 1px solid var(--ion-color-white);
      transform: rotate(-45deg) rotateY(0deg);
    }
  }

  &__four-step {
    display: none;
    position: relative;
    width: 1px;
    height: 22.3vh;
    margin: 11px 0 0 71%;
    margin-bottom: calc(125px + var(--ion-safe-area-bottom));
    border-right: 1px solid var(--ion-color-white);
    border-bottom: none;
    border-radius: 6px 6px 0 0;

    .step-detail-0 & {
      display: block;
    }

    &:before {
      content: "";
      position: absolute;
      left: -2px;
      bottom: 0;
      height: 4px;
      width: 4px;
      border-left: 1px solid var(--ion-color-white);
      border-bottom: 1px solid var(--ion-color-white);
      transform: rotate(-45deg) rotateY(0deg);
    }
  }
}
</style>
