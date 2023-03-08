<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <page-header @back="headerBackHandle" back-btn title="Reviews" />
    </ion-header>
    <ion-content :fullscreen="true" class="page-content">
      <div class="rating">
        <star-rating :value="4.9" :total="2480" />
        <like-rating
          :likes="64"
          :total="2480"
          :dislikes="48"
          :progressValue="0.75"
        />
      </div>
      <reviews-tabs />
    </ion-content>
    <gym-fixed title="Summer Gym" location="Wall Street, 24">
      <template v-slot:button>
        <ion-button expand="block" color="primary" class="fixed-holder__button">
          Add review
        </ion-button>
      </template>
    </gym-fixed>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonContent, IonButton } from "@ionic/vue";
import PageHeader from "@/components/blocks/PageHeader.vue";
import StarRating from "@/components/blocks/StarRating.vue";
import LikeRating from "@/components/blocks/LikeRating.vue";
import ReviewsTabs from "@/components/blocks/ReviewsTabs.vue";
import GymFixed from "@/components/blocks/GymFixed.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const headerBackHandle = (): void => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.rating {
  display: flex;
  padding-top: 30px;
  margin-bottom: 25px;

  .star-rating {
    flex: 0 0 50%;
    border-right: 1px solid var(--gray-600);
    padding-right: 5px;
  }

  .like-rating {
    flex: 1 1 auto;
  }
}

.fixed-holder {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 10px 20px calc(10px + var(--ion-safe-area-bottom));
  background: rgba(var(--ion-color-gray-900-rgb), 0.88);
  backdrop-filter: blur(var(--blur));

  &__info {
    width: 44%;
  }

  h3 {
    margin-top: 0;
    margin-bottom: 2px;
    font-weight: 500;
    font-size: 16px;
    line-height: 1.5;
  }

  span {
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-400);
  }

  &__button-holder {
    flex: 1 1 auto;
  }

  &__button {
    --border-radius: 8px;
  }
}
</style>
