<template>
  <base-layout
    hide-navigation-menu
    draggable
    header-fixed
    :initial-breakpoint="0.4"
  >
    <template #header>
      <page-header back-btn moreBtn @back="handleBack" :transparent="true" @more-click="handleMore" />
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
            <ion-icon 
              src="assets/icon/address.svg" 
              class="address__icon" 
              :class="route?.params?.type == TrainerProfileViewEnum.CurrentUser ? 'user' : ''" 
            />
            {{ user?.address?.street }}
          </ion-text>
        </div>
        <div class="info" v-if="route?.params?.type != TrainerProfileViewEnum.CurrentUser">
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
        <div class="info" v-if="route?.params?.type == TrainerProfileViewEnum.CurrentUser">
          <div class="info-item">
            <strong class="info-item__title">$50.00</strong>
            <ion-text color="secondary" class="font-light">Hourly rate</ion-text>
          </div>
          <div class="info-item">
            <strong class="info-item__title">
              1000+
            </strong>
            <ion-text color="secondary" class="font-light">Completed</ion-text>
          </div>
          <div class="info-item">
            <strong class="info-item__title">1200</strong>
            <ion-text color="secondary" class="font-light">Reviews</ion-text>
          </div>
        </div>
        <div class="reviews">
          <div class="start-content">
            <ion-text class="reviews__title">Reviews</ion-text>
            <ion-badge class="reviews__badge" v-if="route?.params?.type == TrainerProfileViewEnum.CurrentUser">4.8</ion-badge>
            <ion-text class="rating rating__likes">
              <ion-icon src="assets/icon/like.svg" class="rating__icon" />
              {{ user?.positive_reviews_count }}
            </ion-text>
            <ion-text class="rating rating__dislikes">
              <ion-icon src="assets/icon/dislike-outline.svg" class="rating__icon" />
              {{ user?.negative_reviews_count }}
            </ion-text>
          </div>
          <div class="end-content" v-if="route?.params?.type == TrainerProfileViewEnum.CurrentUser">
            <ion-text class="end-content__title">View All</ion-text>
          </div>
        </div>
        <div class="info-section" 
          v-if="specialNeeds?.length && route?.params?.type != TrainerProfileViewEnum.CurrentUser"
        >
          <ion-text class="info-section__title"
            >Special needs or other conditions</ion-text
          >
          <ion-text>{{ specialNeeds }}</ion-text>
        </div>
        <div class="offerings" v-if="route?.params?.type == TrainerProfileViewEnum.CurrentUser">
          <ion-text class="section-title">Offerings</ion-text>
          <ion-segment mode="ios"
            @ionChange="segmentChanged"
            :value="value || 'trainer'"
          >
            <ion-segment-button value="trainer">
              <ion-icon src="assets/icon/trainers.svg"></ion-icon>
            </ion-segment-button>
            <ion-segment-button value="daily">
              <ion-icon src="assets/icon/daily.svg"></ion-icon>
            </ion-segment-button>
            <ion-segment-button value="events">
              <ion-icon src="assets/icon/events.svg"></ion-icon>
            </ion-segment-button>
          </ion-segment>
          
          <div class="offer-card">
            <div class="offer-item" :key="item.id" v-for="item in offerList">
              <div class="header-section">
                <div class="name">{{ item.name }}</div>
                <div class="trainer">{{ item.trainer }}</div>
              </div>
              <div class="detail-section">
                <div class="time">
                  <ion-icon src="assets/icon/time.svg"></ion-icon>
                  <ion-text>{{ item.time }}</ion-text>
                  <ion-icon class="dot-icon" :icon="ellipse"></ion-icon>
                  <ion-text>{{ item.type }}</ion-text>
                </div>
                <div class="total">
                  <ion-icon src="assets/icon/profile.svg"></ion-icon>
                  <ion-text>{{ item.totalUser }}</ion-text>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="document-cards" v-if="route?.params?.type == TrainerProfileViewEnum.CurrentUser">
          <ion-text class="section-title">Certifications</ion-text>
          <div class="doc-items">
            <ion-button :class="index==0? 'active' : ''" 
              fill="outline" :key="item" v-for="(item, index) in docList">
              <ion-icon slot="start" src="assets/icon/certificate.svg"></ion-icon>
              {{ item }}
            </ion-button>
          </div>
        </div>
        <div class="document-cards" v-if="route?.params?.type == TrainerProfileViewEnum.CurrentUser">
          <ion-text class="section-title">Waiver and Labilities</ion-text>
          <div class="doc-items">
            <ion-button :class="index==0? 'active' : ''" 
              fill="outline" :key="item" v-for="(item, index) in docList">
              <ion-icon slot="start" src="assets/icon/certificate.svg"></ion-icon>
              {{ item }}
            </ion-button>
          </div>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonImg, IonIcon, IonText, actionSheetController, SegmentCustomEvent } from "@ionic/vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@vue/apollo-composable";
import { UserDocument } from "@/generated/graphql";
import dayjs from "dayjs";
import { computed, defineProps, defineEmits } from "vue";
import relativeTime from "dayjs/plugin/relativeTime";
import { TrainerProfileViewEnum } from "@/const/TrainerSelectOption";
import { ellipse } from "ionicons/icons";
import { Share } from "@capacitor/share";

dayjs.extend(relativeTime);

const router = useRouter();
const props = defineProps<{
  value?: string;
}>();
const emit = defineEmits<{
  (e: "change", value: string): void;
}>();

const segmentChanged = (event: SegmentCustomEvent) => {
  if (!event.detail.value) return;
  emit("change", event.detail.value as string);
};

const handleBack = () => {
  router.go(-1);
};

const handleMore = async () => {
  console.log("call more");
  const actionSheet = await actionSheetController.create({
    mode: "ios",
    buttons: [
      {
        text: "Edit profile",
        role: "edit",
      },
      {
        text: "Share profile",
        role: "share",
      },
      {
        text: "Cancel",
        role: "cancel",
      },
    ],
  });

  await actionSheet.present();
  const {role} = await actionSheet.onDidDismiss();
  if(role == "share") {
    console.log("call share sheet");
    await Share.share({
    title: "Tamra Dae",
    text: "spotter app",
    // url: `https://${process.env.VUE_APP_URL}/users/activites/event/${route.params.id}`,
    dialogTitle: "Share",
  });
  }
}
const route = useRoute();

const { result } = useQuery(UserDocument, {
  id: route.params.id
});

console.log("result", route.params.type);
const offerList = [{
  id: 1,
  name: "Full Body Stretching",
  trainer: "Tamra Dae",
  time: "8 min",
  type: "Expert",
  totalUser: 30,
}, {
  id: 2,
  name: "Full Body Stretching",
  trainer: "Tamra Dae",
  time: "8 min",
  type: "Expert",
  totalUser: 30,

}, {
  id: 3,
  name: "Full Body Stretching",
  trainer: "Tamra Dae",
  time: "8 min",
  type: "Expert",
  totalUser: 30,

}]

const docList = ["Advance Trainer ISSA2022", "SEES 2018", "RTEE COO 2015"];

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
    created_at: new Date().setFullYear(2022,10),
    positive_reviews_count: 160,
    negative_reviews_count: 48,
    quizzes: [
      {
        code: "DISCOVER_YOUR_NEEDS",
        answers:
          "De-stress with this 10 minute calming yoga routine that includes light and easy full body stretches for stress relief and anxiety and much more interesting!",
      }
    ]
  }
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
  font-weight: 700;
  line-height: 1.5;
  color: var(--gold);
  font-family: "Yantramanav";
}

.address {
  display: flex;
  margin-top: 8px;
  font-size: 14px;
  align-items: center;
  font-family: "Yantramanav";
  color: var(--fitnesswhite);

  &__icon {
    font-size: 24px;
    margin-right: 4px;
    color: #DBB582;
    &.user {
      color: var(--gold);
    }
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
    font-family: "Yantramanav";
  }
}

.reviews {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__title {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    margin-right: 8px;
    color: var(--ion-color-white);
    font-family: "Yantramanav";
  }
  &__badge {
    background: transparent;
    padding: 2px 8px;
    border: 1px solid var(--ion-color-primary);
    border-radius: 20px;
    font-size: 12px;
    color: var(--ion-color-primary);
    font-weight: 500;
    line-height: 150%;
    margin-right: 8px;
  }
  .start-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .end-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    &__title {
      font-size: 14px;
      line-height: 150%;
      color: var(--ion-color-primary);
      font-family: "Yantramanav";
    }
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
  &__likes, &__dislikes{
    font-size: 12px;
    font-weight: 500;
    font-family: "Yantramanav";
    color: var(--gold);
    align-items: center;
  }

  // &__likes {
  //   color: var(--ion-color-success-tint);
  // }

  // &__dislikes {
  //   color: var(--ion-color-danger-tint);
  // }
}

.info-section {
  font-size: 14px;
  margin-top: 24px;
  font-weight: 300;
  line-height: 1.5;
  font-family: "Yantramanav";

  &__title {
    display: block;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    margin-bottom: 16px;
    color: var(--ion-color-white);
  }
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  margin-right: 8px;
  color: var(--ion-color-white);
  font-family: "Yantramanav";
}

.offerings {
  margin-top: 16px;
  ion-segment {
    margin-top: 16px;
    --background: var(--gray-700);
    height: 44px;
    ion-segment-button {
      --indicator-color: var(--gold);
      --color: var(--gray-500);
      --color-checked: var(--gray-800);
      // color: #202020;
    }
  }
}
.offer-card {
  margin-top: 16px;
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--gray-700);
  .offer-item {
    padding: 6px 10px;
    border-radius: 8px;
    background: var(--gray-800);
    box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.25);
    width: 100%;
    margin-bottom: 4px;
    .header-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 10px;
      .name {
        font-size: 16px;
        font-weight: 500;
        line-height: 150%;
        color: var(--ion-color-white);
      }
      .trainer {
        font-size: 14px;
        font-weight: 500;
        line-height: 150%;
        color: var(--grey-text);
      }
    }
    .detail-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      .time {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;
        ion-icon {
          font-size: 24px;
          color: var(--gold);
        }
        ion-text {
          font-family: "Yantramanav";
          font-size: 14px;
          font-weight: 300;
          line-height: 150%;
          color: var(--ion-color-white);
        }
        .dot-icon {
          font-size: 5px;
        }
      }
      .total {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: var(--ion-color-white);
        gap: 4px;
        ion-text {
          font-size: 14px;
          font-weight: 500;
          line-height: 150%;
        }
        ion-icon {
          font-size: 24px;
        }
      }
    }
  }
}

.document-cards {
  margin-top: 16px;
  .doc-items {
    margin-top: 16px;
    ion-button {
      font-family: "Yantramanav";
      --border-width: 0.8px;
      --border-style: solid;
      --border-color: var(--gray-600);
      --border-radius: 8px;
      margin-left: 12px;
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 400;
      line-height: 150%;
      &.active {
        --border-color: var(--gold);
      }
    }
  }
}
</style>
