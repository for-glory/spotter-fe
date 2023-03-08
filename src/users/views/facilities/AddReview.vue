<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header @back="handleBack" back-btn title="Your feedback matters" />
    </template>
    <template #content>
      <ion-spinner v-if="loading" name="lines" class="spinner" />
      <div class="ion-padding-horizontal review" v-else>
        <div class="write-review">
          <div v-if="feedback === EntitiesEnum.Positive.toLocaleLowerCase()">
            <span class="write-review__title">{{
              Number(stars).toFixed(1)
            }}</span>
            <ion-text color="medium" class="write-review__question">
              Rate your experience {{}}
            </ion-text>
            <star-rating v-model="stars" />
          </div>
          <div
            v-if="feedback === EntitiesEnum.Negative.toLocaleLowerCase()"
            class="write-review__offset-top"
          >
            <ion-text color="medium" class="write-review__question">
              We're sorry you weren't satisfied.
            </ion-text>
            <ion-text class="write-review__text">
              Please let us know how your experience could have <br />
              been better (optional)
            </ion-text>
          </div>

          <ion-item class="write-review__holder-textarea">
            <ion-label class="write-review__label" position="floating">
              Add review
            </ion-label>
            <ion-textarea
              v-model="review"
              class="write-review__textarea"
              :maxlength="150"
              :rows="3"
            ></ion-textarea>
          </ion-item>

          <div class="write-review__bottom-button">
            <ion-button
              @click="confirmReview"
              class="button--submit"
              expand="block"
              :disabled="!review"
            >
              Submit review
            </ion-button>
            <ion-button
              v-if="feedback === EntitiesEnum.Negative.toLocaleLowerCase()"
              class="button secondary"
              expand="block"
              @click="confirmReview"
            >
              Skip step
            </ion-button>
          </div>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  IonItem,
  IonLabel,
  IonText,
  IonTextarea,
  IonButton,
  toastController,
  IonSpinner,
} from "@ionic/vue";
import StarRating from "@/users/components/StarRating.vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter, useRoute } from "vue-router";
import { useMutation } from "@vue/apollo-composable";
import {
  FeedbackEntityEnum,
  LeftFeedbackDocument,
  LeftFeedbackInput,
} from "@/generated/graphql";

const router = useRouter();
const route = useRoute();

const stars = ref(0);
const review = ref("");
const feedback = ref(route?.query?.feedback);

const { mutate, loading } = useMutation(LeftFeedbackDocument);

const recommend = computed(() =>
  route?.query?.feedback === EntitiesEnum.Positive.toLowerCase() ? true : false
);

const getParams = () => {
  const params: LeftFeedbackInput = {
    feedback_entity_id: route.params.id as string,
    feedback_entity: FeedbackEntityEnum.Facility,
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

const confirmReview = () => {
  mutate({
    input: getParams(),
  })
    .then(() => {
      showToast("Thank you! Succesfully added review", "success", "success");
      router.push({
        name: EntitiesEnum.FacilityReviews,
        params: { id: route.params.id },
      });
    })
    .catch((error) => {
      showToast("Something went wrong", "danger", "info");
      throw new Error(error);
    });
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

const handleBack = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped>
.review {
  height: 100%;
  text-align: center;
  padding-top: 25px;
}
.write-review {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 8px;

  &__offset-top {
    padding-top: 80px;
  }

  &__text {
    display: block;
    font-weight: 300;
    font-size: 14px;
    line-height: 1.5;
    color: var(--ion-color-secondary);
    margin-bottom: 30px;
  }

  &__title {
    display: block;
    font-weight: 700;
    font-size: 32px;
    line-height: 1.5;
    color: var(--gray-600);
    margin-bottom: 13px;
  }

  &__question {
    display: block;
    margin-bottom: 13px;
    font-weight: 500;
    font-size: 16px;
    line-height: 1.5;
    color: var(--ion-color-white);
  }

  :deep(.stars) {
    margin-bottom: 20px;
  }

  :deep(.star) {
    font-size: 37px;
  }

  &__holder-textarea {
    --color: var(--ion-color-white);
    --background: var(--gray-700);
    --border-radius: 8px;
    --border-width: 0.8px;
    --border-color: var(--gray-500);
    --padding-start: 15px;
    --padding-end: 0;
  }

  &__label {
    --ion-color-primary: var(--gray-400);
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    color: var(--gray-400);
  }

  &__textarea {
    font-weight: 300;
    font-size: 14px;
    line-height: 1.5;
    --color: var(--ion-color-white);
    --padding-top: 0;
    margin-top: 6px;
  }

  &__bottom-button {
    margin-top: auto;
    margin-bottom: 16px;

    ion-button {
      margin-bottom: 16px;
      letter-spacing: 0;
    }
  }
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
</style>
