<template>
  <base-layout>
    <template #content>
      <authentication-header />
      <div class="ion-padding-horizontal review">
        <div class="write-review">
          <div v-if="accept === EntitiesEnum.Positive">
            <span class="write-review__title">0.0</span>
            <ion-text color="medium" class="write-review__question">
              How was your experience?
            </ion-text>
            <star-rating v-model="stars" />
          </div>
          <div v-if="accept === EntitiesEnum.Negative">
            <ion-text color="medium" class="write-review__title">
              We are so sorry it was not a <br />good fit
            </ion-text>
            <ion-text class="write-review__text">
              Please leave review about what happened (optional)
            </ion-text>
          </div>

          <ion-item class="write-review__holder-textarea">
            <ion-label class="write-review__label" position="floating">
              Add review
            </ion-label>
            <ion-textarea
              class="write-review__textarea"
              maxlength="150"
              rows="3"
              v-model="review"
            ></ion-textarea>
          </ion-item>
        </div>
      </div>
    </template>

    <template #footer>
      <buttons-footer
        v-if="accept === EntitiesEnum.Negative"
        main-button-text="Send review"
        secondary-button-text="Skip step"
        @handle-click="confirmReview"
        @handle-secondary-click="skipReview"
      />
    </template>
  </base-layout>
</template>

<script lang="ts" setup>
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { EntitiesEnum } from "@/const/entities";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ButtonsFooter from "@/general/components/blocks/footers/ButtonsFooter.vue";
import AuthenticationHeader from "@/general/components/blocks/headers/AuthenticationHeader.vue";
import StarRating from "@/users/components/StarRating.vue";
import {
  IonTextarea,
  IonItem,
  IonLabel,
  IonText,
  toastController,
} from "@ionic/vue";
import {
  FeedbackEntityEnum,
  LeftFeedbackDocument,
  LeftFeedbackInput,
} from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";

const route = useRoute();
const router = useRouter();
const stars = ref(0);
const review = ref("");

const { mutate } = useMutation(LeftFeedbackDocument);

const accept = computed(() => route?.query?.rating);

const recommend = computed(() =>
  route?.query?.rating === EntitiesEnum.Positive ? true : false
);

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
        name: EntitiesEnum.TrainerReviews,
        params: { id: route.params.id },
      });
    })
    .catch((error) => {
      showToast("Something went wrong", "danger", "info");
      throw new Error(error);
    });
};

const skipReview = () => {
  router.push({
    name: EntitiesEnum.BookMore,
    params: { id: route.params.id },
    query: { rating: route.query.rating },
  });
};
</script>

<style scoped lang="scss">
.review {
  text-align: center;
  padding-top: 25px;
}

.write-review {
  display: flex;
  flex-direction: column;
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
    margin-top: 10px;
  }

  &__title {
    font-family: "Oswald", serif;
    font-weight: 400;
    font-size: 28px;
    padding-bottom: 20px;
    margin-top: 42px;
    line-height: 130%;
    color: var(--gold);
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
::v-deep {
  .submit-btn {
    margin-bottom: 10px !important;
  }
}
</style>
