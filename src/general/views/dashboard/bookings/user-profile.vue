
<template>
  <div class="dashboard web-bookings">
    <div class="d-flex align-items-center page-header">
      <ion-button class="common-back-btn" fill="clear" @click="router.back()">
        <ion-icon src="assets/icon/arrow-back.svg" />
      </ion-button>
      <ion-title class="banner__title">User profile</ion-title>
    </div>
    <div class="user-container">
      <div class="photo">
        <ion-img v-if="user?.avatarUrl" :src="user?.avatarUrl" />
        <span v-else>{{ symbols }}</span>
      </div>
      <div class="content">
        <div class="header d-flex align-items-center">
          <div class="flex-1 align-self-start">
            <strong class="username">
              {{ user?.first_name }} {{ user?.last_name }}
            </strong>
            <ion-text class="address" color="secondary" v-if="user?.address?.street">
              <ion-icon src="assets/icon/address.svg" class="address__icon" />
              {{ user?.address?.street }}
            </ion-text>
          </div>

          <div class="info flex-2">
            <div class="info-item">
              <strong class="info-item__title"> 12</strong>
              <ion-text color="secondary" class="font-light">Trainings</ion-text>
            </div>
            <div class="info-item">
              <strong class="info-item__title">
                {{ user ? dayjs(user.created_at).fromNow(true) : "&nbsp;" }}
              </strong>
              <ion-text color="secondary" class="font-light">in Spotter</ion-text>
            </div>
            <div class="info-item">
              <strong class="info-item__title"> 12</strong>
              <ion-text color="secondary" class="font-light">Feedbacks</ion-text>
            </div>
          </div>
        </div>
        <div class="reviews">
          <div class="d-flex">
            <ion-text class="reviews__title">Reviews</ion-text>
            <div class="review-badge">4.8</div>
          </div>
          <ion-text class="rating rating__likes">
            <ion-icon src="assets/icon/like.svg" class="rating__icon" />
            {{ user?.positive_reviews_count }}
          </ion-text>
          <ion-text class="rating rating__dislikes">
            <ion-icon src="assets/icon/dislike-outline.svg" class="rating__icon" />
            {{ user?.negative_reviews_count }}
          </ion-text>
        </div>
        <div class="info-section" v-if="specialNeeds?.length">
          <ion-text class="info-section__title">Special needs or other conditions</ion-text>
          <ion-text class="info-section__desc">{{ specialNeeds }}</ion-text>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { IonIcon, IonTitle, IonButton, IonImg, IonText } from "@ionic/vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
const router = useRouter();
const user = computed(() => {
  // return result.value?.user;
  return {
    id: "1",
    title: "Nick Fox",
    address: {
      street: "Arizona, Phoenix, USA",
    },
    start_date: "10 month",
    userId: "5328",
    first_name: "Nick",
    last_name: "Fox",
    avatarUrl: "https://picsum.photos/200/300",
    created_at: new Date().setFullYear(2022, 10),
    positive_reviews_count: 160,
    negative_reviews_count: 48,
    quizzes: [
      {
        code: "DISCOVER_YOUR_NEEDS",
        answers:
          "De-stress with this 10 minute calming yoga routine that includes light and easy full body stretches for stress relief and anxiety and much more interesting!",
      }
    ]
  };
});

const symbols = computed(() => {
  return (
    (user.value?.first_name?.length ? user.value.first_name?.charAt(0) : "") +
    (user.value?.last_name?.length ? user.value.last_name?.charAt(0) : "")
  );
});

const specialNeeds = computed<string | null>(() => {
  const answers = user.value?.quizzes.find(e => e.code === 'DISCOVER_YOUR_NEEDS')?.answers;
  return answers ? answers : null;
});

</script>

<style scoped lang="scss">
.banner__title {
  margin-top: -3px;
}

.web-bookings {
  padding: 0 64px;
}

.page-header {
  padding-top: 21px;
  margin-bottom: 52px;

  ion-title {
    font-size: 24px;
    padding-left: 7px;
    color: var(--gold);
  }

  ion-icon {
    color: var(--gray-500);
    font-size: 20px;
  }
}

.cursor-pointer {
  cursor: pointer;
}


.content {
  margin-top: 24px;
  padding-bottom: calc(24px + var(--ion-safe-area-bottom));
}

.header {
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.user-container {
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.username {
  display: block;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--gold);
}

.address {
  display: flex;
  margin-top: 8px;
  font-size: 14px;
  align-items: center;
  color: var(--fitnesswhite);

  &__icon {
    font-size: 24px;
    margin-right: 4px;
    color: var(--gold);
  }
}

.photo {
  --size: 68px;
  font-size: 40px;
  font-weight: 700;
  line-height: 68px;
  text-align: center;
  z-index: 10;
  position: relative;
  width: 100%;
  height: 275px;

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
  background: var(--gray-700);
  justify-content: space-between;
  max-width: 343px;
}

.info-item {
  width: 100%;
  font-size: 14px;
  line-height: 1.5;
  padding: 6px 8px;
  position: relative;
  text-align: center;

  &:first-child~& {
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
    font-size: 24px;
    margin-right: 3px;
  }

  &__likes,
  &__dislikes {
    font-size: 12px;
    font-weight: 500;
    color: var(--gold);
    align-items: center;
  }
}

.info-section {
  font-size: 14px;
  margin-top: 16px;
  font-weight: 300;
  line-height: 1.5;

  &__title {
    display: block;
    font-size: 20px;
    font-weight: 500;
    line-height: 1.5;
    color: var(--ion-color-white);
    margin-bottom: 6px;
  }

  &__desc {
    font-size: 16px;
    font-weight: 300;
    color: var(--grey-text);
  }
}

.flex-1 {
  flex: 1;
}

.flex-2 {
  flex: 2;
}

.align-self-start {
  align-self: flex-end;
}

.review-badge {
  width: 36px;
  height: 22px;
  padding: 2px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  border: 1px solid var(--gold);
  font-family: Lato;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  color: var(--gold);
  margin-right: 12px;
}
</style>
  