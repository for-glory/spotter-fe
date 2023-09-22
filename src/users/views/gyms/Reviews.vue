<template>
    <div class="main-content">
        <div class="d-flex align-items-center page-header">
            <ion-button class="common-back-btn" fill="clear" @click="router.back()">
                <ion-icon src="assets/icon/arrow-back.svg" />
            </ion-button>
            <ion-title class="banner__title">Reviews</ion-title>
        </div>
        <ion-spinner v-if="reviewLoading" name="lines" class="spinner" />
        <template v-else>
            <div class="rating-wrapper">
                <ion-button expand="block" color="primary" class="fixed-holder__button font-yantramanav"
                    @click="isWriteReviewModal = true">
                    Add review
                </ion-button>
                <div class="rating ion-padding-horizontal">
                    <div class="rating-star">
                        <span class="rating-star__title">{{ facility?.score }}</span>
                        <star-rating :model-value="facility?.score || 0" size="medium" />
                        <ion-text color="medium" class="rating-star__reviews font-yantramanav">
                            based on {{ facility?.reviews_count }} reviews
                        </ion-text>
                    </div>
                    <like-rating :likes="facility?.positive_reviews_count || 0" :total="facility?.reviews_count || 0"
                        :dislikes="facility?.negative_reviews_count || 0" :progressValue="progressValue" />
                </div>
            </div>
            <div class="tabs-holder">
                <page-tabs :tabs="tabs" class="page-tabs ion-padding-horizontal" :value="activeTab" @change="tabsChanged" />
                <div class="content ion-padding-horizontal">
                    <ion-spinner v-if="reviewLoading" name="lines" class="spinner" />
                    <div v-else class="d-flex flex-wrap gap-16">
                        <review-item v-for="review in tempReviews" :key="review.id" class="review-item"
                            :avatar-url="review.avatarUrl" :full-name="review.fullName" :date="review.date"
                            :rating="review.rating" :text="review.text" />
                    </div>
                </div>
            </div>
        </template>
        <IonModal :is-open="isWriteReviewModal" @didDismiss="isWriteReviewModal = false; isAddReviewModal = false">
            <div class="review-modal">
                <ion-icon src="assets/icon/close.svg" class="close-btn cursor-pointer"
                    @click="isWriteReviewModal = false; isAddReviewModal = false"></ion-icon>
                <div class="logo">
                    <router-link to="/">
                        <ion-img src="assets/icon/logo-complete.png" alt="logo" />
                    </router-link>
                </div>
                <div class="ion-padding-horizontal review">
                    <div class="review__holder" v-if="!isAddReviewModal">
                        <ion-radio-group v-model="feedback">
                            <h1>Your feedback matters</h1>
                            <ion-label class="review__question">
                                Would you recommend this gym?
                            </ion-label>
                            <ion-item lines="none" class="radiobutton radiobutton--positive">
                                <ion-icon class="radiobutton__icon" src="assets/icon/like.svg" />
                                <ion-label class="radiobutton__label"> Yes, sure!</ion-label>
                                <ion-radio slot="end" :value="EntitiesEnum.Positive.toLowerCase()"></ion-radio>
                            </ion-item>
                            <ion-item lines="none" class="radiobutton radiobutton--negative">
                                <ion-icon class="radiobutton__icon" src="assets/icon/dislike.svg" />
                                <ion-label class="radiobutton__label"> Absolutely not</ion-label>
                                <ion-radio slot="end" :value="EntitiesEnum.Negative.toLowerCase()"></ion-radio>
                            </ion-item>
                        </ion-radio-group>
                        <div class="review__bottom-button">
                            <ion-button @click="isAddReviewModal = true" class="button--submit" expand="block"
                                :disabled="!feedback">
                                Next
                            </ion-button>
                        </div>
                    </div>
                    <div class="review__holder write-review" v-else>
                        <div>
                            <h1>{{ EntitiesEnum.Positive.toLowerCase() == feedback ? 'How would you rate this gym?' :
                                'We\'re sorry you weren\'t satisfied.' }}</h1>
                            <ion-label class="review__question">
                                {{ EntitiesEnum.Positive.toLowerCase() == feedback ? 'Let us know your thoughts to improve your experience' : 'Please let us know how your experience could have been better (optional)' }}
                            </ion-label>
                            <span v-if="EntitiesEnum.Positive.toLowerCase() == feedback"
                                class="write-review__title" :class="{'active' : stars > 0}">{{
                                    stars }}.0</span>
                            <star-rating :size="'32'" v-if="EntitiesEnum.Positive.toLowerCase() == feedback" v-model="stars" />
                            <ion-item class="write-review__holder-textarea">
                                <ion-label class="write-review__label" position="stacked">
                                    Add review
                                </ion-label>
                                <ion-textarea v-model="review" class="write-review__textarea" :maxlength="150"
                                    :rows="3"></ion-textarea>
                            </ion-item>
                        </div>

                        <div class="review__bottom-button">
                            <ion-button class="button--submit" expand="block" :disabled="!review">
                                Submit review
                            </ion-button>
                        </div>
                    </div>
                </div>
            </div>
        </IonModal>
    </div>
</template>
  
<script setup lang="ts">
import { IonButton, IonSpinner, IonIcon, IonTitle, IonModal, toastController, IonTextarea, IonItem, IonLabel, IonRadioGroup, IonRadio, IonImg } from "@ionic/vue";
import { Review as UserReview } from "@/ts/types/user";
import StarRating from "@/users/components/StarRating.vue";
import LikeRating from "@/users/components/LikeRating.vue";
import PageTabs from "@/general/components/PageTabs.vue";
import ReviewItem from "@/general/components/blocks/ratings/ReviewItem.vue";
import { IonText } from "@ionic/vue";
import { ref, computed, onMounted } from "vue";
import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "@/const/entities";
import router from "@/router";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
    FeedbackEntityEnum,
    LeftFeedbackDocument,
    LeftFeedbackInput,
    Query,
    Review,
    ReviewsDocument,
    ReviewTypeEnum,
    RoleEnum,
} from "@/generated/graphql";
import { useRoute } from "vue-router";
import { GetFacilityDocument } from "@/graphql/documents/userDocuments";
import useRoles from "@/hooks/useRole";

const route = useRoute();
const isWriteReviewModal = ref<boolean>(false);
const isAddReviewModal = ref<boolean>(false);

const { role } = useRoles();

const tabs: TabItem[] = [
    {
        name: ReviewTypeEnum.Recent,
        label: "Recent",
    },
    {
        name: ReviewTypeEnum.Positive,
        label: "Positive",
    },
    {
        name: ReviewTypeEnum.Negative,
        label: "Negative",
    },
];
const tempReviews: UserReview[] = [{
    id: "1",
    date: new Date().toString(),
    rating: 4.9,
    text: 'Had such an amazing session. She instantly picked up on the level of my fitness and adjusted the workout to suit me.',
    avatarUrl: "https://picsum.photos/200/300",
    fullName: 'Sharon Jem',
},
{
    id: "2",
    date: new Date().toString(),
    rating: 4.5,
    text: 'Had such an amazing session. She instantly picked up on the level of my fitness and adjusted the workout to suit me.',
    avatarUrl: "https://picsum.photos/200/300",
    fullName: 'Sharon Jem',
},
{
    id: "3",
    date: new Date().toString(),
    rating: 4.5,
    text: 'Had such an amazing session. She instantly picked up on the level of my fitness and adjusted the workout to suit me.',
    avatarUrl: "https://picsum.photos/200/300",
    fullName: 'Sharon Jem',
},
{
    id: "4",
    date: new Date().toString(),
    rating: 4.5,
    text: 'Had such an amazing session. She instantly picked up on the level of my fitness and adjusted the workout to suit me.',
    avatarUrl: "https://picsum.photos/200/300",
    fullName: 'Sharon Jem',
},
{
    id: "5",
    date: new Date().toString(),
    rating: 4.5,
    text: 'Had such an amazing session. She instantly picked up on the level of my fitness and adjusted the workout to suit me.',
    avatarUrl: "https://picsum.photos/200/300",
    fullName: 'Sharon Jem',
}
];

const activeTab = ref<ReviewTypeEnum>(ReviewTypeEnum.Recent);

const tabsChanged = (newTab: ReviewTypeEnum) => {
    activeTab.value = newTab;
};

const onAddReview = () => {
    router.push({
        name: EntitiesEnum.WriteReview,
        params: { id: route.params.id },
    });
};

const stars = ref(0);
const review = ref("");
const feedback = ref("");



const handleBack = () => {
    router.go(-1);
};

const {
    result: reviewsResult,
    loading: reviewLoading,
    refetch,
} = useQuery(ReviewsDocument, () => ({
    id: route.params.id,
    type: FeedbackEntityEnum.Facility,
    review_type: activeTab.value,
}));

onMounted(() => {
    refetch();
});

const reviews = computed(() =>
    reviewsResult?.value?.reviews?.data.reduce(
        (acc: UserReview[], cur: Review) => {
            acc.push({
                id: cur.id,
                date: cur.created_at,
                rating: cur.score || 0,
                text: cur.review,
                avatarUrl: cur.author?.avatarUrl || "",
                fullName: `${cur.author?.first_name} ${cur.author?.last_name}`,
            });
            const t: UserReview = {
                id: "1",
                date: new Date().toString(),
                rating: cur.score || 0,
                text: cur.review,
                avatarUrl: cur.author?.avatarUrl || "",
                fullName: 'Test user',
            };
            acc.push(t);
            return acc;
        },
        []
    )
);

const { result } = useQuery<Pick<Query, "facility">>(
    GetFacilityDocument,
    {
        id: route.params.id,
    }
);

const facility = computed(() => result.value?.facility);

const isAbleToAddReview = computed(
    () =>
        facility.value?.was_visited_by_me && !facility.value?.was_commented_by_me
);

const progressValue = computed(() => {
    if (
        facility.value?.positive_reviews_count &&
        facility.value?.negative_reviews_count &&
        facility.value?.score
    ) {
        return (
            ((facility.value?.positive_reviews_count +
                facility.value?.negative_reviews_count) /
                facility.value?.score) *
            100
        );
    } else {
        return 0;
    }
});
</script>
  
<style scoped lang="scss">
.main-content {
    padding: 0 90px;
}

.rating {
    display: flex;
    padding-top: 30px;
    margin-bottom: 25px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;

    .like-rating {
        flex: 1 1 auto;
    }
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

.rating-star {
    text-align: center;
    flex: 0 0 50%;
    border-right: 1px solid var(--gray-600);
    padding-right: 5px;

    &__title {
        display: block;
        margin-bottom: 12px;
        font-size: 32px;
        line-height: 1.5;
        font-weight: 700;
        color: var(--ion-color-white);
    }

    &__reviews {
        font-size: 14px;
        line-height: 1.5;
    }
}

.tabs-holder {
    .page-tabs {
        margin-bottom: 25px;
        padding-left: 24px;
        padding-right: 24px;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;

        :deep(.review) {
            margin-bottom: 20px;
        }
    }
}

.review-item {
    max-width: 343px;
}

.spinner {
    position: fixed;
    top: 50vh;
    left: 50vw;
    --color: var(--ion-color-white);
}

.rating-wrapper {
    position: relative;
}

.fixed-holder__button {
    position: absolute;
    top: 0;
    right: 0;
    width: 183px;
    --background: var(--gray-700);
}

.radiobutton {
    font-size: 14px;
    line-height: 1.5;
    --min-height: 48px;
    --padding-top: 0;
    --border-radius: 8px;
    margin-bottom: 14px;
    --padding-bottom: 0;
    --color: var(--ion-color-medium);
    --inner-padding-top: 0;
    --inner-padding-bottom: 0;
    --inner-padding-start: 0;
    --inner-padding-end: 0;
    --background: transparent;
    --padding-start: var(--container-offset);
    --padding-end: var(--container-offset);
    --border-width: 0.8px;
    --border-style: solid;
    --border-color: var(--gray-600);

    &.item-radio-checked {
        --color: var(--fitnesswhite);
        --border-color: var(--ion-color-primary);
    }

    ion-radio {
        width: 24px;
        height: 24px;
        border-width: 1.8px;
        margin: 3px 3px 3px 20px;
        --color: var(--ion-color-medium);
        --mark-width: 12px;
        --mark-height: 9px;

        &::part(mark) {
            background-position: 50% 50%;
            background-repeat: no-repeat;
            width: calc(100% + var(--border-width));
            height: calc(100% + var(--border-width));
            background-size: var(--mark-width) var(--mark-height);
            background-image: url(/public/assets/icon/check-mark.svg);
        }
    }

    &__icon {
        margin-right: 8px;
        font-size: 24px;
        width: 1em;
        height: 1em;
        color: var(--ion-color-primary);
        // .radiobutton--positive & {
        //   color: var(--ion-color-primary);
        // }

        // .radiobutton--negative & {
        //   color: var(--ion-color-danger-tint);
        // }
    }
}

.review {
    height: 100%;
    text-align: center;
    padding-top: 25px;

    &__holder {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-between;
        max-width: 422px;
        align-items: center;
        margin: auto;

        h1 {
            color: var(--gold);
            font-size: 28px;
            font-style: normal;
            font-weight: 400;
        }
    }

    &__question {
        display: block;
        font-weight: 300;
        font-size: 14px;
        color: var(--gray-400);
        margin-bottom: 32px;
        margin-top: 22px;
    }

    &__bottom-button {
        width: 100%;

        ion-button {
            font-family: 'Yantramanav';
            font-size: 16px;
            font-weight: 500;
        }
    }
}

.review-modal {
    padding: 32px;
    height: 100%;
    display: flex;
    flex-direction: column;

    .close-btn {
        font-size: 24px;
        cursor: pointer;
    }

    .logo {
        width: 15rem;
        margin: auto;
        text-align: center;
    }

    .write-review {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0 8px;

        &__title {
            display: block;
            font-weight: 700;
            font-size: 32px;
            line-height: 1.5;
            color: var(--gray-600);
            margin-bottom: 13px;

            &.active {
                color: var(--fitnesswhite);
            }
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
            --border-style: solid;
            --border-color: var(--gray-500);
            --padding-start: 16px;
            --inner-padding-end: 16px;
            --padding-end: 0;
            --highlight-background: var(--gray-500);
            --full-highlight-height: 0px;
            margin-top: 8px;
        }

        &__label {
            font-family: 'Yantramanav';
            --ion-color-primary: var(--gray-400);
            font-weight: 500;
            font-size: 12px;
            line-height: 150%;
            color: var(--gray-400);
            transform: translateY(50%) scale(1);
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
                font-family: 'Yantramanav';
                font-size: 16px;
                font-weight: 500;
                line-height: 130%;
            }

            .skip-btn {
                --color: var(--fitnesswhite);
            }
        }
    }
}
</style>
  