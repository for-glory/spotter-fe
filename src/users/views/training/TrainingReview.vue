<template>
  <base-layout>
    <template #content>
      <authentication-header
        background-image="training"
        close-button
        hidden-logo
      >
        <template #title>
          <ion-title class="page-title">
            You've completed your <br />
            training!
          </ion-title>
        </template>
        <template #description>
          <ion-title class="page-descr"> Did you enjoy it?</ion-title>
        </template>
      </authentication-header>
      <div class="review">
        <ion-radio-group v-model="selectedReviewRating">
          <base-radiobutton
            v-model="selectedReviewRating"
            :is-checked="selectedReviewRating === EntitiesEnum.Positive"
            :value="EntitiesEnum.Positive"
            title="Yes, absolutely!"
          >
            <template #icon>
              <ion-icon
                class="review__icon positive"
                src="assets/icon/like.svg"
              />
            </template>
          </base-radiobutton>
          <base-radiobutton
            :is-checked="selectedReviewRating === EntitiesEnum.Negative"
            :value="EntitiesEnum.Negative"
            title="Absolutely not!"
          >
            <template #icon>
              <ion-icon
                class="review__icon negative"
                src="assets/icon/dislike.svg"
              />
            </template>
          </base-radiobutton>
        </ion-radio-group>
      </div>
    </template>
    <template #footer>
      <buttons-footer
        main-button-text="Next"
        @handle-click="onClick"
        :disabled="!selectedReviewRating"
      />
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonTitle, IonRadioGroup, IonIcon } from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import AuthenticationHeader from "@/general/components/blocks/headers/AuthenticationHeader.vue";
import { ref } from "vue";
import BaseRadiobutton from "@/general/components/base/BaseRadiobutton.vue";
import ButtonsFooter from "@/general/components/blocks/footers/ButtonsFooter.vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";

const router = useRouter();

const selectedReviewRating = ref<EntitiesEnum.Positive | EntitiesEnum.Negative>(
  EntitiesEnum.Positive
);

const onClick = () => {
  if (selectedReviewRating.value === EntitiesEnum.Negative) {
    router.push({
      name: EntitiesEnum.SendReviewForm,
      query: { rating: selectedReviewRating.value },
    });
  } else {
    router.push({
      name: EntitiesEnum.WriteTrainingReview,
      query: { rating: selectedReviewRating.value },
    });
  }
};
</script>
<style scoped lang="scss">
.review {
  padding: 42px 24px;

  &__icon {
    margin-right: 4px;
    font-size: 24px;
    width: 1em;
    height: 1em;

    &.positive {
      color: var(--ion-color-success);
    }

    &.negative {
      color: var(--ion-color-danger-tint);
    }
  }
}

.page-title {
  font-family: "Oswald", serif;
  font-style: normal;
  font-weight: 400;
  font-size: 28px;
  line-height: 130%;
  color: var(--gold);
  margin-top: 108px;
  text-align: center;
  overflow-wrap: break-word;
}

.page-descr {
  font-family: "Yantramanav", serif;
  font-weight: 300;
  font-size: 14px;
  margin-top: 18px;
  line-height: 150%;
  color: #ffffff;
  text-align: center;
}
</style>
