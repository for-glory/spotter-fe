
<template>
    <div class="dashboard">
        <div class="d-flex align-items-center page-header">
            <ion-button class="common-back-btn" fill="clear" @click="router.back()">
                <ion-icon src="assets/icon/arrow-back.svg" />
            </ion-button>
            <ion-title class="banner__title">Profile</ion-title>
        </div>
        <div class="d-flex gap-24 flex-2 overflow-hidden">
            <div class="flex-2 scrollable">
                <div class="user-container">
                    <div class="photo">
                        <ion-img v-if="user?.avatarUrl" :src="user?.avatarUrl" />
                        <span v-else>{{ symbols }}</span>
                        <ion-button class="more-btn" fill="clear" color="light" @click="handleMore">
                            <ion-icon :icon="ellipsisVertical" />
                        </ion-button>
                    </div>
                    <div class="content">
                        <div class="header d-flex align-items-center mb-10">
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
                                    <strong class="info-item__title">{{ user?.trainings_count }}</strong>
                                    <ion-text color="secondary" class="font-light">Completed</ion-text>
                                </div>
                                <div class="info-item">
                                    <strong class="info-item__title">
                                        {{ user ? dayjs(user.created_at).fromNow(true) : "&nbsp;" }}
                                    </strong>
                                    <ion-text color="secondary" class="font-light">in Spotter</ion-text>
                                </div>
                                <div class="info-item">
                                    <strong class="info-item__title">{{ user?.reviews_count }}</strong>
                                    <ion-text color="secondary" class="font-light">Feedbacks</ion-text>
                                </div>
                            </div>
                        </div>
                        <div class="info-section">
                            <ion-text class="info-section__title mb-10">Description:</ion-text>
                            <ion-text class="info-section__desc">Want your body to be healthy? Join our program with
                                directions according to body’s goals. Increasing physical strength is the goal of strenght
                                training.</ion-text>
                        </div>
                        <div class="reviews d-flex justify-content-between">
                            <div class="d-flex align-items-center flex-2">
                                <div class="d-flex">
                                    <ion-text class="reviews__title">Reviews</ion-text>
                                    <div class="review-badge">{{ user?.score }}</div>
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
                            <div class="end-content">
                                <ion-text class="end-content__title cursor-pointer" @click="viewAllReview">View All</ion-text>
                            </div>
                        </div>
                        <div class="review-cards">
                            <base-carousel v-if="reviews?.length" class="review-swiper" show-start :items="reviews" :slides-offset-after="0" :slides-offset-before="0">
                                <template v-slot:default="reviews">
                                    <review-item v-for="review in reviews" :key="review.id" class="review-item"
                                :avatar-url="review.avatarUrl" :full-name="review.fullName" :date="review.date"
                                :rating="review.rating" :text="review.text" />
                                </template>
                            </base-carousel>
                            <div v-else class="font-bold color-gold " style="font-size: 24px; text-align: center; padding: 24px;">
                                <ion-text>No reviews yet</ion-text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-1">
                <div class="offerings">
                    <ion-text class="section-title">Offerings</ion-text>
                    <ion-segment mode="ios" v-model="segmentValue">
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
                    <div class="ion-margin-top info mx-100" v-if="segmentValue == 'trainer'">
                        <div class="info-item">
                            <strong class="info-item__title">${{ user?.trainerRates[1]?.front_price }}</strong>
                            <ion-text color="secondary" class="font-light">Hourly rate (client's home)</ion-text>
                        </div>
                        <div class="info-item">
                            <strong class="info-item__title">${{ user?.trainerRates[0]?.front_price }}</strong>
                            <ion-text color="secondary" class="font-light">Hourly rate (In gym)</ion-text>
                        </div>
                    </div>
                    <div class="offer-card" v-else-if="segmentValue == 'daily'"  style="max-height: 300px; overflow-y: scroll;">
                        <div v-if="!offerList || !offerList.length">
                            <empty-block 
                                title="Dailys Empty" 
                                hideButton
                                text="No Dailys available." 
                                icon="assets/icon/daily.svg" 
                            />
                        </div>
                        <div v-else class="offer-item" :key="item.id" v-for="item in offerList">
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
                    <div class="offer-card" v-else-if="segmentValue == 'events'">
                        <div v-if="!offerEvents || !offerEvents.length">
                            <empty-block 
                                title="Events Empty" 
                                hideButton
                                text="No Events available." 
                                icon="assets/icon/events.svg" 
                            />
                        </div>
                        <div v-else class="offer-item" :key="item.id" v-for="item in offerEvents">
                            <div class="header-section events">
                                <div class="name">{{ item.name }}</div>
                                <div class="event-time">
                                    <ion-icon src="assets/icon/time.svg"></ion-icon>
                                    <ion-text class="color-fitness-white fs-14">{{ item.time }}</ion-text>
                                </div>
                            </div>
                            <ion-label class="date-label">{{ item.date }}</ion-label>
                            <div class="detail-section">
                                <div class="time">
                                    <ion-icon src="assets/icon/location.svg"></ion-icon>
                                    <ion-text>{{ item.address }}</ion-text>
                                </div>
                                <div class="total">
                                    <ion-icon src="assets/icon/profile.svg"></ion-icon>
                                    <ion-text>{{ item.totalUser }}</ion-text>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="document-cards">
                    <ion-text class="section-title">Certifications</ion-text>
                    <div class="doc-items" v-if="user?.certificates?.length">
                        <advantage-item v-for="(item, index) in user.certificates" :key="index" :icon="item?.iconUrl || 'assets/icon/advantages/gym.svg'"
                            :title="(item.title as string)" @click="onOpenDocument(item.pathUrl)"/>
                                </div>
                </div>
                <div class="document-cards">
                    <ion-text class="section-title">Waiver and Labilities</ion-text>
                    <div class="doc-items">
                        <advantage-item v-for="(item, index) in user?.weiver_and_labilities" :key="index" :icon="item?.iconUrl || 'assets/icon/advantages/gym.svg'"
                            :title="(item.title as string)" @click="onOpenDocument(item.pathUrl)"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-btn">
            <ion-button
            expand="block"
            color="primary"
            class="fixed-holder__button"
            @click="bookTrainer"
          >
            Book now
          </ion-button>
        </div>
    </div>
</template>
    
<script setup lang="ts">
import { IonIcon, IonTitle, IonButton, IonImg, IonText, actionSheetController, IonBadge, IonSegment, IonSegmentButton, IonLabel, IonAvatar } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import { ellipse } from "ionicons/icons";
import { computed, ref } from "vue";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { Share } from "@capacitor/share";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import BaseCarousel from "@/general/components/base/BaseCarousel.vue";
import { ellipsisVertical } from "ionicons/icons";
import { useTrainerStore } from "@/general/stores/useTrainerStore";
import { FeedbackEntityEnum, Query, QueryWorkoutsOrderByColumn, ReviewsDocument, SortOrder, UserDocument, WorkoutsDocument } from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import { Browser } from "@capacitor/browser";
import AdvantageItem from "@/general/components/blocks/AdvantageItem.vue";
import { EntitiesEnum } from "@/const/entities";
import ReviewItem from "@/general/components/blocks/ratings/ReviewItem.vue";
dayjs.extend(relativeTime);
const router = useRouter();
const segmentValue = ref('trainer');

const route = useRoute();
const { result, loading, onResult } = useQuery<Pick<Query, "user">>(
  UserDocument,
  {
    id: route.params.id,
  }
);

const { result: dailysResult, loading: dailysLoading, refetch: refetchDailys, onResult: gotDailysData } = useQuery(
  WorkoutsDocument,{
    page: 1,
    first: 1000,
    order: SortOrder.Asc,
    orderByColumn: QueryWorkoutsOrderByColumn.CreatedAt,
    trainer_id: result.value?.user?.id 
  },
  {
    fetchPolicy: "no-cache",
  }
);

const { result: reviewsResult, loading: reviewLoading, refetch: refetchReviews, onResult: getReviews } = useQuery(
  ReviewsDocument,
  () => ({
    id: result.value?.user?.id,
    type: FeedbackEntityEnum.User,
    review_type: "Recent",
  })
);
const handleMore = async () => {
    const actionSheet = await actionSheetController.create({
        mode: "ios",
        cssClass: 'profile-action-sheet',
        buttons: [
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
    const { role } = await actionSheet.onDidDismiss();
    if (role == "share") {
        console.log("call share sheet");
        await Share.share({
            title: "Tamra Dae",
            text: "spotter app",
            // url: `https://${process.env.VUE_APP_URL}/users/activites/event/${route.params.id}`,
            dialogTitle: "Share",
        });
    }
};
const offerList = computed(() => dailysResult.value.workouts.data.map((daily: any) => {
  return {
    id: daily?.id,
    name: daily?.title,
    trainer: `${daily?.trainer?.first_name} ${daily?.trainer?.first_name}`,
    time: daily?.duration,
    totalUser: daily?.views_count,
    type: daily?.type.name
  }
}));

const reviews = computed(() =>
  reviewsResult?.value?.reviews?.data.reduce(
    (acc: any, cur: any) => {
      acc.push({
        id: cur.id,
        date: cur.created_at,
        rating: cur.score || 0,
        text: cur.review,
        avatarUrl: cur.author?.avatarUrl || "",
        fullName: `${cur.author?.first_name} ${cur.author?.last_name}`,
      });
      return acc;
    },
    []
  )
);

const docList = ["Advance Trainer ISSA2022", "SEES 2018", "RTEE COO 2015"];
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
    const answers = user.value?.quizzes?.find(e => e?.code === 'DISCOVER_YOUR_NEEDS')?.answers;
    return answers ? answers : null;
});
const onOpenDocument = async (url: string) => {
  await Browser.open({ url: url });
};
const bookTrainer = () => {
    router.push({name: EntitiesEnum.TrainerBooking,params: route.params.id})
}
const viewAllReview = () => {
    router.push({
        name: EntitiesEnum.DashboardTrainerReviews,
        params: { id: route.params.id },
    });
}

</script>
  
<style scoped lang="scss">
.banner__title {
    margin-top: -3px;
}

.page-header {
    padding-top: 21px;
    margin-bottom: 20px;

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

.dashboard {
    padding: 0 64px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
}

.username {
    display: block;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.5;
    color: var(--fitnesswhite);
}

.address {
    display: flex;
    margin-top: 8px;
    font-size: 16px;
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

    .more-btn {
        position: absolute;
        top: 0;
        right: 0;
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
    margin-bottom: 16px;
    margin-top: 20px;

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

.info-section {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.5;
    font-family: "Yantramanav";

    &__title {
        display: block;
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 16px;
        color: var(--fitnesswhite);
    }

    &__desc {
        color: var(--Grey-500);
        font-size: 16px;
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

            &.events {
                margin-bottom: 0;
            }

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

        .date-label {
            font-size: 14px;
            color: var(--grey-text);
            margin-top: 2px;
            margin-bottom: 4px;
            display: block;
            line-height: 21px;
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
        display: flex;
        flex-wrap: wrap;
        gap: 12px;

        ion-button {
            font-family: "Yantramanav";
            --border-width: 0.8px;
            --border-style: solid;
            --border-color: var(--gray-600);
            --border-radius: 8px;
            font-size: 14px;
            font-weight: 400;
            margin: 0;
            height: 42px;
            --color: var(--gray-500);

            ion-icon {
                margin-right: 8px;
            }

            &.active {
                --border-color: var(--gold);
            }
        }
    }
}

.event-time {
    display: flex;
    align-items: center;
    gap: 4px;

    ion-icon {
        color: var(--gold);
        font-size: 24px;
    }

    .fs-14 {
        font-size: 14px;
        font-weight: 500;
    }
}

.mx-100 {
    max-width: 100%;
}

.mb-10 {
    margin-bottom: 10px;
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

.review-cards {
    // display: flex;
    // align-items: center;
    // gap: 16px;
    margin-top: 16px;
    // overflow: auto;
    position: relative;
    width: 100%;
    .review-swiper {
        position: absolute;
        width: 100%;
    }
    .review-card {
        padding: 16px;
        // max-width: 324px;
        // min-width: 324px;
        background: var(--gray-700);
        border-radius: 8px;


        .review-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .review-user {
            display: flex;
            align-items: center;
            gap: 12px;

            .user-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                overflow: hidden;

                img {
                    object-fit: cover;
                }
            }

            p {
                color: var(--gold);
                font-family: "Yantramanav";
                font-size: 14px;
                margin: 0;

            }

            .review-date {
                span {
                    color: var(--gray-600);
                    font-size: 12px;
                    font-weight: 500;
                }
            }
        }

        .review-desc {
            margin-top: 12px;

            p {
                color: var(--fitnesswhite);
                font-family: "Yantramanav";
                font-size: 14px;
                font-weight: 300;
                margin: 0;
            }
        }
    }
}
.footer-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 16px;
    ion-button {
        min-width: 250px;
    }
}
.overflow-hidden {
    overflow: hidden;
}
.overflow-auto {
    overflow: auto;
}
.scrollable {
    overflow: auto;
    &::-webkit-scrollbar{
        width: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background: var(--gray-700);
        border-radius: 8px;
    }
}
</style>
    