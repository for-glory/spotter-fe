<template>
  <base-layout>
    <template #content>
      <div class="review-result__container">
        <authentication-header />
        <div class="review-result">
          <div v-if="isPositiveRating" class="review-result__value">
            {{ stars }}.0
          </div>
          <star-rating v-if="isPositiveRating" v-model="stars" />
          <ion-text class="review-result__title">
            {{ title }}
          </ion-text>
          <ion-text class="review-result__descr">
            {{ description }}
          </ion-text>
        </div>
      </div>
    </template>
    <template #footer>
      <buttons-footer
        v-if="isPositiveRating"
        main-button-text="Book again"
        secondary-button-text="Find a new trainer"
        @handle-click="onBookTrainer"
        @handle-secondary-click="onFindTrainer"
      />
      <buttons-footer
        v-else
        main-button-text="Find another"
        secondary-button-text="Exclude trainer from search list"
        @handle-click="onFindTrainer"
      />
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonText } from "@ionic/vue";
import StarRating from "@/users/components/StarRating.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import AuthenticationHeader from "@/general/components/blocks/headers/AuthenticationHeader.vue";
import ButtonsFooter from "@/general/components/blocks/footers/ButtonsFooter.vue";
import { computed, onBeforeMount, ref } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const stars = ref(0);

const reviewRating = computed(
  () => route.query.rating ?? EntitiesEnum.Positive
);

onBeforeMount(() => {
  if (route.query.stars) {
    stars.value = Number(route.query.stars);
  }
});

const isPositiveRating = computed(
  () => reviewRating.value === EntitiesEnum.Positive
);

const title = computed(() =>
  isPositiveRating.value
    ? "Thank you for your review"
    : "Ready to book with more trainers?"
);

const description = computed(() =>
  isPositiveRating.value
    ? "Feel free to book with trainer, or find a new one!"
    : "You can find another one trainer or exclude this trainer from your search list"
);

const onBookTrainer = () => {
  router.push({ name: EntitiesEnum.Trainer, params: { id: route.params.id } });
};

const onFindTrainer = () => {
  router.push({ name: EntitiesEnum.Facilities });
};
</script>

<style scoped lang="scss">
.review-result {
  display: flex;
  flex-direction: column;
  align-content: center;
  padding: 5px 24px;
  text-align: center;

  &__title {
    font-family: "Oswald", serif;
    font-weight: 400;
    font-size: 28px;
    padding-bottom: 20px;
    line-height: 130%;
    color: var(--gold);
  }

  &__value {
    font-family: "Yantramanav", serif;
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    line-height: 150%;
    margin-bottom: 18px;
  }
}

.review-result__descr {
  font-weight: 300;
  font-size: 14px;
  line-height: 150%;
  color: var(--gray-400);
  padding: 0 28px;
}

::v-deep {
  .submit-btn {
    margin-bottom: 10px !important;
  }
}
</style>
