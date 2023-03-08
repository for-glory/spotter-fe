<template>
  <base-layout
    hide-navigation-menu
    draggable
    header-fixed
    :initial-breakpoint="0.4"
  >
    <template #header>
      <page-header back-btn @back="handleBack" :transparent="true" />
    </template>
    <template #static>
      <div class="photo">
        <ion-img v-if="user?.avatarUrl" :src="user?.avatarUrl" />
        <span v-else>{{ symbols }}</span>
      </div>
    </template>
    <template #draggable>
      <div class="content ion-padding-horizontal">
        <div class="header">
          <strong class="username">
            {{ user?.first_name }} {{ user?.last_name }}
          </strong>
          <ion-text
            class="address"
            color="secondary"
            v-if="user?.address?.street"
          >
            <ion-icon src="assets/icon/address.svg" class="address__icon" />
            {{ user?.address?.street }}
          </ion-text>
        </div>
        <div class="info">
          <div class="info-item">
            <strong class="info-item__title"> 12</strong>
            <ion-text color="secondary">Trainings</ion-text>
          </div>
          <div class="info-item">
            <strong class="info-item__title">
              {{ user ? dayjs(user.created_at).fromNow(true) : "&nbsp;" }}
            </strong>
            <ion-text color="secondary">in Spotter</ion-text>
          </div>
          <div class="info-item">
            <strong class="info-item__title"> 12</strong>
            <ion-text color="secondary">Feedbacks</ion-text>
          </div>
        </div>
        <div class="reviews">
          <ion-text class="reviews__title">Reviews</ion-text>
          <ion-text class="rating rating__likes">
            <ion-icon src="assets/icon/like.svg" class="rating__icon" />
            {{ user?.positive_reviews_count }}
          </ion-text>
          <ion-text class="rating rating__dislikes">
            <ion-icon src="assets/icon/dislike.svg" class="rating__icon" />
            {{ user?.negative_reviews_count }}
          </ion-text>
        </div>
        <div class="info-section" v-if="specialNeeds?.length">
          <ion-text class="info-section__title"
            >Special needs or other conditions</ion-text
          >
          <ion-text>{{ specialNeeds }}</ion-text>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonImg, IonIcon, IonText } from "@ionic/vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@vue/apollo-composable";
import { UserDocument } from "@/generated/graphql";
import dayjs from "dayjs";
import { computed } from "vue";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const router = useRouter();

const handleBack = () => {
  router.go(-1);
};

const route = useRoute();

const { result } = useQuery(UserDocument, {
  id: route.params.id,
});

const user = computed(() => {
  return result.value?.user;
});

const symbols = computed(() => {
  return (
    (user.value?.first_name?.length ? user.value.first_name?.charAt(0) : "") +
    (user.value?.last_name?.length ? user.value.last_name?.charAt(0) : "")
  );
});

const specialNeeds = computed<string | null>(() => {
  const answers = user.value?.quizzes.find(
    (quizz: any) => quizz.code === "DISCOVER_YOUR_NEEDS"
  ).answers;
  return answers?.length ? answers[answers?.length - 1].value : null;
});
</script>

<style scoped lang="scss">
.content {
  padding-top: 4px;
  padding-bottom: calc(24px + var(--ion-safe-area-bottom));
}

.header {
  margin-bottom: 24px;
}

.username {
  display: block;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--ion-color-white);
}

.address {
  display: flex;
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.5;
  align-items: center;

  &__icon {
    font-size: 24px;
    margin-right: 4px;
    color: var(--ion-color-primary);
  }
}

.photo {
  flex-shrink: 0;
  --size: 68px;
  font-size: 40px;
  font-weight: 700;
  line-height: 68px;
  text-align: center;
  z-index: 10;
  width: 100vw;
  height: 100%;
  position: relative;

  ion-img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
}

.info {
  gap: 10px;
  padding: 8px;
  display: flex;
  border-radius: 8px;
  margin-bottom: 24px;
  background: var(--gray-700);
  justify-content: space-between;
}

.info-item {
  width: 100%;
  font-size: 14px;
  line-height: 1.5;
  padding: 6px 8px;
  position: relative;
  text-align: center;

  &:first-child ~ & {
    &:before {
      top: 50%;
      left: 0;
      width: 1px;
      content: "";
      height: 32px;
      margin-top: -16px;
      position: absolute;
      background-color: var(--gray-600);
    }
  }

  &__title {
    display: block;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    margin-bottom: 4px;
    color: var(--ion-color-white);
  }
}

.reviews {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  &__title {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    margin-right: 8px;
    color: var(--ion-color-white);
  }
}

.rating {
  display: flex;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  margin-left: 4px;
  align-items: center;

  &__icon {
    line-height: 1;
    font-size: 24px;
  }

  &__likes {
    color: var(--ion-color-success-tint);
  }

  &__dislikes {
    color: var(--ion-color-danger-tint);
  }
}

.info-section {
  font-size: 14px;
  margin-top: 24px;
  font-weight: 300;
  line-height: 1.5;

  &__title {
    display: block;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    margin-bottom: 16px;
    color: var(--ion-color-white);
  }
}
</style>
