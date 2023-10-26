<template>
    <div class="dashboard d-flex-col h-100">
        <div class="d-flex align-items-center page-header">
            <ion-button class="common-back-btn" fill="clear" @click="router.back()">
                <ion-icon src="assets/icon/arrow-back.svg" />
            </ion-button>
            <ion-title class="banner__title">{{ result?.facility?.name }}</ion-title>
        </div>
        <div class="d-flex gap-24 flex-2 overflow-hidden">
            <div class="overflow-auto hide-scrollbar">
                <div class="user-container">
                    <div class="photo">
                        <ion-img v-if="result?.facility?.media?.length" :src="result?.facility?.media[0]?.pathUrl" />
                        <span v-else>{{ symbols }}</span>
                        <ion-button class="more-btn" fill="clear" color="light" @click="handleMore">
                            <ion-icon :icon="ellipsisVertical" />
                        </ion-button>
                    </div>
                    <div class="content">
                        <div class="header d-flex align-items-center mb-24 justify-content-between">
                            <div>
                                <strong class="username">
                                    {{ result?.facility?.name }}
                                </strong>
                                <ion-text class="address" color="secondary" v-if="result?.facility?.address?.street">
                                    <ion-icon src="assets/icon/address.svg" class="address__icon" />
                                    {{ result?.facility?.address?.street }}
                                </ion-text>
                            </div>
                            <follow class="follow" :is-followed="false" @handle-click="$emit('handle-follow')" />
                        </div>
                        <div class="info-section" v-if="specialNeeds?.length">
                            <ion-text class="info-section__title mb-10">Description:</ion-text>
                            <ion-text class="info-section__desc">{{ result?.facility?.description }}</ion-text>
                        </div>
                        <div class="reviews d-flex justify-content-between">
                            <div class="d-flex align-items-center flex-2">
                                <div class="d-flex">
                                    <ion-text class="reviews__title">Reviews</ion-text>
                                    <div class="review-badge">{{ result?.facility?.score }}</div>
                                </div>
                                <ion-text class="rating rating__likes">
                                    <ion-icon src="assets/icon/like.svg" class="rating__icon" />
                                    {{ result?.facility?.positive_reviews_count??0 }}
                                </ion-text>
                                <ion-text class="rating rating__dislikes">
                                    <ion-icon src="assets/icon/dislike-outline.svg" class="rating__icon" />
                                    {{ result?.facility?.negative_reviews_count??0 }}
                                </ion-text>
                            </div>
                            <div class="end-content">
                                <ion-text class="end-content__title" @click="viewAllReview">View All</ion-text>
                            </div>
                        </div>
                        <div class="d-flex gap-30">
                            <div class="document-cards">
                                <ion-text class="section-title">Equipment</ion-text>
                                <div class="doc-items">
                                    <advantage-item v-for="(item, index) in result?.facility?.equipments" :key="index"
                                        :icon="item?.iconUrl ??''" :title="item?.name ?? ''" />
                                </div>
                            </div>
                            <div class="document-cards">
                                <ion-text class="section-title">Amenities</ion-text>
                                <div class="doc-items">
                                    <advantage-item v-for="(item, index) in result?.facility?.amenities" :key="index"
                                        :icon="item?.iconUrl ?? ''" :title="item?.name ?? ''" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-1">
                <div class="offerings">
                    <ion-text class="section-title">Offerings</ion-text>
                    <ion-segment mode="ios" v-model="activeSegment">
                        <ion-segment-button :value="segment.name" v-for="segment in segmentTabs">
                            <ion-icon :src="segment.icon"></ion-icon>
                        </ion-segment-button>
                    </ion-segment>
                    <div class="ion-margin-top offer-card" v-if="activeSegment === EntitiesEnum.FacilityPassList">
						<div class="card-background"  v-if="!dropins || !dropins.length">
							<empty-block
							title="Drop-ins Empty"
							hideButton
							text="No Dropins available for this location"
							icon= "assets/icon/dropin.svg"
							/>
						</div>
                        <div class="offer-item" :key="item.id" v-for="item in dropins">
                            <div class="header-section events">
                                <div class="name">{{ item.title }}</div>
                                <div class="price">
                                    ${{ formatNumber(item.price/100, "fixed") }}
                                </div>
                            </div>
                            <div class="detail-section">
								<ion-label class="date-label">{{ item.duration }} {{ item.duration>1?"Days":"Day" }}</ion-label>
                                <!-- <div class="only-address">
                                    {{ item.address }}
                                </div> -->
                                <ion-button @click="handleBuy(item.id)">Buy</ion-button>
                            </div>
                        </div>
                    </div>
                    <div class="offer-card" v-else-if="activeSegment === EntitiesEnum.Facilities">
						<div class="card-background"  v-if="!passes || !passes.length">
							<empty-block
							title="Passes Empty"
							hideButton
							text="No Passes available for this location"
							icon= "assets/icon/gym-user-icon.svg"
							/>
						</div>
                        <div class="offer-item" :key="item.id" v-for="item in passes">
                            <div class="header-section events">
                                <div class="name">{{ item.title }}</div>
                                <div class="price">
                                    ${{ formatNumber(item.price/100, "fixed") }}
                                </div>
                            </div>
                            <div class="detail-section">
								<ion-label class="date-label">{{ item.duration }} {{ item.duration>1?"Months":"Month" }}</ion-label>
                                <!-- <div class="only-address">
                                    {{ item.address }}
                                </div> -->
                                <ion-button @click="handleBuy(item.id)">Subscribe</ion-button>
                            </div>
                        </div>
                    </div>
                    <div class="offer-card" v-else-if="activeSegment === EntitiesEnum.CreateDailys">
						<div class="card-background"  v-if="!dailysData || !dailysData.length">
							<empty-block
							title="Dailys Empty"
							hideButton
							text="No dailys available for this location"
							icon="assets/icon/daily.svg"
							/>
						</div>
                        <div class="offer-item" :key="item.id" v-for="item in dailysData">
                            <div class="header-section">
                                <div class="name" @click="previewDaily(item)">{{ item.title }}</div>
                                <div class="trainer">{{ `${item.trainer?.first_name} ${item.trainer?.last_name}` }}</div>
                            </div>
                            <div class="detail-section">
                                <div class="time">
                                    <ion-icon src="assets/icon/time.svg"></ion-icon>
                                    <ion-text>{{ getDurationText(item.duration) }}</ion-text>
                                    <ion-icon class="dot-icon" :icon="ellipse"></ion-icon>
                                    <ion-text>{{ item.type.name }}</ion-text>
                                </div>
                                <div v-if="myWorkouts.some((my: any) => my.id === item.id)" class="total">
                                    <ion-icon src="assets/icon/profile.svg"></ion-icon>
                                    <ion-text>{{ item.totalUser }}</ion-text>
                                </div>
                                <ion-button v-else @click="handleSubscribe(item.id)">Subscribe</ion-button>
                            </div>
                        </div>
                    </div>
                    <div class="offer-card" v-else-if="activeSegment === EntitiesEnum.Events">
						<div class="card-background"  v-if="!allEvents || !allEvents.length">
							<empty-block
								title="Events Empty"
								hideButton
								text="No Events available for this location"
								icon= "assets/icon/events.svg"
							/>
						</div>
                        <div class="offer-item" v-else :key="event.id" v-for="event in allEvents">
                            <div class="header-section events">
                                <div class="name">{{ event.title }}</div>
                                <div class="event-time">
                          			<ion-text>${{ formatNumber(event?.price/100, "fixed") }}</ion-text>
                                </div>
                            </div>
                            <ion-label class="date-label">{{ dayjs(event?.start_date).format('D MMMM') }}</ion-label>
                            <div class="detail-section">
                                <div class="time">
                                    <ion-icon src="assets/icon/location.svg"></ion-icon>
                                    <ion-text>{{ event?.address?.street }}</ion-text>
                                </div>
                                <ion-button @click="goToEventDetail(event.id)">Register</ion-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <preview-daily-modal 
        :daily="dailyData"  
        :isOpen="isOpenPreviewModal"
        @closeModal="onClosePreview"
        :duration="myWorkouts.some((my: any) => my.id === selectedDailyId) ? 0 : 10"
        @trialEnd="onTrialEnd"
    />
    <blurred-screen-modal
        id="blur"
        :is-open="isOpenBlurredScreenModal"
        :preview-url="dailyData?.previewUrl"
        @visibility="isOpenBlurredScreenModal = false"
        @purchase-daily="purchaseWorkout"
        :disabled="addToCartLoading"
    />
    <purchase-modal 
        id="full"
        :isOpen="isOpenPurchaseModal"
        :dailyId="selectedDailyId"
        :cartId="cartId"
        @purchase-daily="onPurchase"
    />

</template>
    
<script setup lang="ts">
import { IonIcon, IonTitle, IonButton, IonImg, IonText, actionSheetController, toastController, IonSegment, IonSegmentButton, IonLabel, IonAvatar } from "@ionic/vue";
import { useRouter, useRoute } from "vue-router";
import { ellipse } from "ionicons/icons";
import { computed, ref } from "vue";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { Share } from "@capacitor/share";
import BaseCarousel from "@/general/components/base/BaseCarousel.vue";
import { ellipsisVertical } from "ionicons/icons";
import { EntitiesEnum } from "@/const/entities";
import Follow from "@/general/components/blocks/Follow.vue";
import AdvantageItem from "@/general/components/blocks/AdvantageItem.vue";
import {
  Facility,
  RoleEnum,
  GetManagersByFacilityDocument,
  FeedbackEntityEnum,
  MyWorkoutsDocument,
  Query,
  Review,
  ReviewsDocument,
  ReviewTypeEnum,
  SettingsCodeEnum,
  UnfollowDocument,
  AddToCartDocument,
  AddToCartPurchasableEnum,
  EventsQuery,
  EventsDocument,
  QueryEventsOrderByColumn,
  EventsQueryVariables,
  SortOrder,
  WorkoutsByFacilityDocument,
  QueryFacilityWorkoutsOrderByColumn,
  FacilityItemsByFacilityIdAndTypeDocument
} from "@/generated/graphql";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { GetFacilityDocument } from "@/graphql/documents/userDocuments";
import { useQuery, useMutation } from "@vue/apollo-composable";
import PreviewDailyModal from "@/general/components/modals/workout/PreviewDailyModal.vue"
import BlurredScreenModal from "@/users/views/workouts/components/BlurredScreenModal.vue";
import PurchaseModal from "@/users/views/workouts/components/PurchaseModal.vue";
import { Capacitor } from "@capacitor/core";
import useRoles from "@/hooks/useRole";
dayjs.extend(relativeTime);
const dailyData = ref();
const isOpenBlurredScreenModal = ref(false);
const isOpenPurchaseModal = ref(false);
const isOpenPreviewModal = ref(false);
const selectedDailyId = ref<number>();
const cartId = ref<number>();
const router = useRouter();
const route = useRoute();
const segmentValue = ref('trainer');
const activeSegment = ref<EntitiesEnum>(
    EntitiesEnum.Facilities
);

const segmentTabs = [
    {
        name: EntitiesEnum.FacilityPassList,
        icon: "assets/icon/pass-list.svg",
    },
    {
        name: EntitiesEnum.Facilities,
        icon: "assets/icon/gym-person.svg",
    },

    {
        name: EntitiesEnum.CreateDailys,
        icon: "assets/icon/dailys.svg",
    },
    {
        name: EntitiesEnum.Events,
        icon: "assets/icon/events.svg",
    },
];

const { result: myDailys, loading: myDailysLoading, refetch: myRefetch } = useQuery(MyWorkoutsDocument, {
  first: 1000,
});

const myWorkouts = computed(() => myDailys.value?.myWorkouts?.data || []);

const { result, loading, onResult, refetch } = useQuery<Pick<Query, "facility">>(
  GetFacilityDocument,
  {
    id: route.params.id,
  }
);

const handleMore = async () => {
    const { role:userRole } = useRoles();
    const buttons = userRole===RoleEnum.User ? [
            {
                text: "Share profile",
                role: "share",
            },
            {
                text: "Cancel",
                role: "cancel",
            },
        ] : [
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
        ]
    const actionSheet = await actionSheetController.create({
        mode: "ios",
        cssClass: 'profile-action-sheet',
        buttons: buttons
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
const {
  result: reviewsResult,
  loading: reviewLoading,
  refetch: refetchReviews,
} = useQuery(ReviewsDocument, () => ({
  id: route.params.id,
  type: FeedbackEntityEnum.Facility,
  review_type: ReviewTypeEnum.Recent,
}));
const reviewsData = computed(() => {
  return reviewsResult.value?.reviews?.data;
});

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
const handleBuy = (id: number) => {
  router.push({
    name: Capacitor.isNativePlatform()?EntitiesEnum.DropinsPassesDetail:EntitiesEnum.DashboardDropinsPassesDetail,
    params: {
      id
    },
  });
};

const viewAllReview = () => {
    router.push({
        name: EntitiesEnum.GymReviews,
        params: { id: route.params.id },
    });
}

// Dailys data
const {
  result: dailysResult,
  loading: dailysLoading,
} = useQuery(WorkoutsByFacilityDocument, 
	{
		page: 1,
		first: 1000,
		facility_id: route.params.id,
		orderByColumn: QueryFacilityWorkoutsOrderByColumn.CreatedAt,
		order: SortOrder.Asc,
	},
	{
		fetchPolicy: "no-cache",
  }
);

const dailysData = computed(() => {
  return dailysResult.value?.facilityWorkouts?.data;
});
const getDurationText = (value: number) => {
  if(value < 60) {
    return value + ' s';
  } else if(value < 3600) {
    return (value / 60).toFixed(0) + ' min ' + value % 60 + ' s';
  } else {
    return (value / 60).toFixed(0) + ' h ' + (value % 3600) / 60 + ' min';
  }
};

const handleSubscribe = (id: number) => {
    selectedDailyId.value = id;
    purchaseWorkout();
}

const { mutate: addToCartMutation, loading: addToCartLoading } =
  useMutation(AddToCartDocument);
const purchaseWorkout = () => {
  addToCartMutation({
    input: {
      purchasable_id: selectedDailyId.value,
      purchasable: AddToCartPurchasableEnum.Workout,
    },
  })
    .then((res) => {
        isOpenBlurredScreenModal.value = false;
        isOpenPreviewModal.value = false;
        cartId.value = res?.data?.addToCart?.id;
        isOpenPurchaseModal.value = true;
    })
    .catch(async () => {
      const toast = await toastController.create({
        message: "Something went wrong. Try again.",
        duration: 2000,
        icon: "assets/icon/info.svg",
        cssClass: "warning-toast",
      });
      toast.present();
    });
};

const previewDaily = (url: string) => {
    dailyModal.value?.present({video: url, prview: true});
}
// Dailys End

// Passes start
const {
  result: facilityItemPassResult,
  loading: loadingFacilityPass,
} = useQuery(FacilityItemsByFacilityIdAndTypeDocument, {
  facility_id: route.params.id,
  item_type: "PASS"
});

const passes = computed(() => {
  return facilityItemPassResult.value?.facilityItemsByFacilityIdAndType?.data;
});

// Passes End


// Dropins start
const {
  result: dropinResult,
  loading: loadingFacilityDropin
} = useQuery(FacilityItemsByFacilityIdAndTypeDocument, {
  facility_id: route.params.id,
  item_type: "DROPIN"
});

const dropins = computed(() => {
  return dropinResult.value?.facilityItemsByFacilityIdAndType?.data;
});

// Dropins End

// Events List
const eventsParams: EventsQueryVariables = {
  first: 5,
  page: 1,
  orderBy: [
    {
      column: QueryEventsOrderByColumn.StartDate,
      order: SortOrder.Asc,
    },
  ],
  created_by_facility: route.params.id
};

const {
  result: eventResult,
  loading: eventsLoading,
} = useQuery<EventsQuery>(EventsDocument, eventsParams, {
  notifyOnNetworkStatusChange: true,
  fetchPolicy: "no-cache",
});

const allEvents = computed(() => {
  return eventResult.value?.events?.data;
});
const goToEventDetail = (id) => {
  router.push({
    name: Capacitor.isNativePlatform() ? EntitiesEnum.UserEventDetail : EntitiesEnum.DashboardEventDetail,
    params: {
      id: id,
    },
  });
}
// End Events
const formatNumber = (num: number, type: string) => {
  if (num < 1e3) {
    if(type === 'normal') {
      return num.toString();
    } else {
      return num.toFixed(2).toString();
    }
  } else if (num < 1e6) {
    return (num / 1e3).toFixed(1) + 'k';
  } else {
    return (num / 1e6).toFixed(1) + 'M';
  }
};
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
    padding: 0 74px;
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
    color: var(--gray-400);

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
        align-items: center;
    }

    &__likes {
        color: #2ED47A;
    }

    &__dislikes {
        color: #DC5858;
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
        line-height: normal;
    }

    &__desc {
        color: var(--grey-text);
        font-size: 16px;
        line-height: normal;
    }
}

.section-title {
    font-size: 20px;
    font-weight: 500;
    line-height: 1.5;
    margin-right: 8px;
    color: var(--ion-color-white);
}

.offerings {
	min-width: 343px;
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
        margin-bottom: 8px;

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
                cursor: pointer;
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
            color: var(--gray-400);
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

        .only-address {
            color: var(--gray-400);
            font-family: "Yantramanav";
            font-size: 14px;
            font-weight: 300;
        }

        ion-button {
            height: 30px;
            font-weight: 600;
            --color: var(--gray-700);
            --border-radius: 4px;
            min-width: 117px;
        }

        .price {
            color: var(--gray-400);
            font-size: 16px;
            font-weight: 500;
        }
    }
	.card-background {
		background-color: #202020;
		padding: 5px;
		border-radius: 8px;
		margin-bottom: 5px;
	}
}

.document-cards {
    margin-top: 16px;

    .doc-items {
        margin-top: 16px;
        display: flex;
        flex-wrap: wrap;
        // gap: 12px;

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
        cursor: pointer;
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

.overflow-hidden {
    overflow: hidden;
}

.overflow-auto {
    overflow: auto;
}
</style>
    