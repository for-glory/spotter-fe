<template>
  <base-layout>
    <template #header>
      <page-header v-if="isPositiveRating" close-btn @back="onBack" />
      <authentication-header
        v-else
        :close-button="isPositiveRating"
        @back="onBack"
      />
    </template>
    <template #content>
      <div
        :class="{
          'write-training-review--top-offset': !isPositiveRating,
        }"
        class="write-training-review"
      >
        <ion-text
          :class="{
            'write-training-review__title--top-offset': !isPositiveRating,
          }"
          class="write-training-review__title"
        >
          {{ title }}
        </ion-text>
        <ion-text class="write-training-review__desrc">
          {{ description }}
        </ion-text>
        <span v-if="isPositiveRating" class="write-training-review__value"
          >{{ stars }}.0</span
        >
        <star-rating v-if="isPositiveRating" v-model="stars" />
        <ion-item class="write-training-review__holder-textarea">
          <ion-label class="write-review__label" position="floating">
            Add review
          </ion-label>
          <ion-textarea
            class="write-training-review__textarea"
            maxlength="150"
            rows="3"
            v-model="review"
          />
        </ion-item>
      </div>
    </template>
    <template #footer>
      <buttons-footer
        v-if="isPositiveRating"
        main-button-text="Send review"
        @handle-click="confirmReview"
        @handle-secondary-click="onClick"
        :disabled="disabled"
      />
      <buttons-footer
        v-else
        main-button-text="Send review"
        secondary-button-text="Skip step"
        @handle-click="confirmReview"
        @handle-secondary-click="onClick"
      />
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import {
  IonItem,
  IonLabel,
  IonText,
  IonTextarea,
  toastController,
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import { computed, ref } from "vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import ButtonsFooter from "@/general/components/blocks/footers/ButtonsFooter.vue";
import AuthenticationHeader from "@/general/components/blocks/headers/AuthenticationHeader.vue";
import { useRoute, useRouter } from "vue-router";
import StarRating from "@/users/components/StarRating.vue";
import {
  FeedbackEntityEnum,
  LeftFeedbackDocument,
  LeftFeedbackInput,
} from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";

const route = useRoute();
const router = useRouter();

const stars = ref(0);

const reviewRating = computed(
  () => route.query.rating ?? EntitiesEnum.Positive
);

const recommend = computed(() =>
  route?.query?.rating === EntitiesEnum.Positive ? true : false
);

const review = ref("");

const disabled = computed(() => !stars.value);

const isPositiveRating = computed(
  () => reviewRating.value === EntitiesEnum.Positive
);

const title = computed(() =>
  isPositiveRating.value
    ? "How would you rate your session?"
    : "Let us know your thoughts to improve your experience"
);

const description = computed(() =>
  isPositiveRating.value
    ? "Describe your feelings with us please"
    : "Please leave review about what happened (optional)"
);

const onClick = () => {
  if (reviewRating.value) {
    router.push({
      name: EntitiesEnum.BookMore,
      query: { rating: reviewRating.value, stars: stars.value },
    });
  }
};

const { mutate } = useMutation(LeftFeedbackDocument);

const getParams = () => {
  const params: LeftFeedbackInput = {
    feedback_entity_id: route.params.id as string,
    feedback_entity: FeedbackEntityEnum.User,
    recommend: recommend.value,
  };

  if (stars.value) {
    params.score = Number(stars.value);
  }

  if (review.value) {
    params.message = review.value;
  }
  return params;
};

const showToast = async (msg: string, key: string, icon: string) => {
  const toast = await toastController.create({
    message: msg,
    duration: 2000,
    icon: `assets/icon/${icon}.svg`,
    cssClass: `${key}-toast`,
  });
  return toast.present();
};

const confirmReview = () => {
  mutate({
    input: getParams(),
  })
    .then(() => {
      showToast("Thank you! Succesfully added review", "success", "success");
      router.push({
        name: EntitiesEnum.BookMore,
        query: { rating: reviewRating.value, stars: stars.value },
        params: { id: route.params.id },
      });
    })
    .catch((error) => {
      showToast("Something went wrong", "danger", "info");
      throw new Error(error);
    });
};

const onBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.write-training-review {
  display: flex;
  flex-direction: column;
  align-content: center;
  padding: 16px 24px;
  text-align: center;

  &--top-offset {
    padding: 5px 24px;
  }

  &__title {
    font-family: "Oswald", serif;
    font-weight: 400;
    font-size: 28px;
    padding-bottom: 20px;
    margin-top: 42px;
    line-height: 130%;
    color: var(--gold);

    &--top-offset {
      margin-top: 0;
    }
  }

  &__desrc {
    font-weight: 300;
    font-size: 14px;
    line-height: 150%;
    color: var(--gray-400);
  }

  &__value {
    font-family: "Yantramanav", serif;
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    line-height: 150%;
    margin-top: 110px;
    margin-bottom: 18px;
  }

  &__holder-textarea {
    margin-top: 16px;
    --color: var(--ion-color-white);
    --background: var(--gray-700);
    --border-radius: 8px;
    --border-width: 0.8px;
    --border-color: var(--gray-500);
    --padding-start: 15px;
    --padding-end: 0;
    --padding-top: 0;
    --padding-bottom: 0;
  }

  &__label {
    --ion-color-primary: var(--gray-400);
    font-weight: 500;
    font-size: 16px;
    line-height: 1;
  }

  &__textarea {
    font-weight: 300;
    font-size: 14px;
    line-height: 1.5;
    --color: var(--ion-color-white);
    --padding-top: 0;
    --padding-bottom: 0;
    margin-top: 6px;
  }
}
</style>
