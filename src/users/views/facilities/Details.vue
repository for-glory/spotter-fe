<template>
	<ion-spinner v-if="loading" name="lines" class="spinner" />
	<detail v-else :edit-button="isMyFacility" :name="facility?.name ?? ''" :photos-url="photosWithUrl"
		:likes="facility?.positive_reviews_count || 0" :total-rating="facility?.score || 0"
		:dislikes="facility?.negative_reviews_count || 0" :is-followed="isFollowed"
		:address="facility?.address?.street ?? ''" button-text="Buy" :is-trusted="isTrusted" advantages-title="Equipment"
		@handle-follow="handleFollow" @handle-book="handleBuy" :viewAllLink="EntitiesEnum.FacilityReviews"
		@handle-edit="onEdit" :hidden-footer="role === RoleEnum.User" :hidden-reviews="role === RoleEnum.User">
		<template #info>
			<div class="info">
				{{ facility?.description }}
			</div>
		</template>
		<template #reviews>
			<review-slides :reviews="reviews" />
		</template>
		<template #content v-if="role === RoleEnum.User">
			<div class="reviews__header">
				<ion-text class="reviews__title">Reviews</ion-text>
				<rating is-total :value="facility?.score ?? 0" />
				<ion-text class="rating rating__likes">
					<ion-icon src="assets/icon/like.svg" class="rating__icon" />
					{{ facility?.positive_reviews_count ?? 0 }}
				</ion-text>
				<ion-text class="rating rating__dislikes">
					<ion-icon src="assets/icon/dislike.svg" class="rating__icon" />
					{{ facility?.negative_reviews_count ?? 0 }}
				</ion-text>
				<router-link :to="{ name: EntitiesEnum.FacilityReviews }" class="reviews__all">
					View all
				</router-link>
			</div>
			<div class="offerings">
				<ion-text class="section-title">Offerings</ion-text>
				<ion-segment mode="ios" v-model="activeSegment">
					<ion-segment-button :value="segment.name" v-for="segment in segmentTabs">
						<ion-icon :src="segment.icon"></ion-icon>
					</ion-segment-button>
				</ion-segment>
				<div class="ion-margin-top offer-card" v-if="activeSegment === EntitiesEnum.FacilityPassList">
					<div class="card-background" v-if="!dropins || !dropins.length">
						<empty-block 
							title="Drop-ins Empty" 
							hideButton 
							text="No Dropins available for this location"
							icon="assets/icon/dropin.svg" 
						/>
					</div>
					<div class="offer-item" v-else :key="item.id" v-for="item in dropins">
						<div class="header-section events">
							<div class="name">{{ item.title }}</div>
							<div class="price">
								${{ formatNumber(item.price / 100, "fixed") }}
							</div>
						</div>

						<div class="detail-section">
							<!-- <div class="only-address">
                {{ item.address }}
              </div> -->
							<ion-label class="date-label">{{ item.duration }} {{ item.duration > 1 ? "Days" : "Day"
							}}</ion-label>
							<ion-button @click="handleBuy">Buy</ion-button>
						</div>
					</div>
				</div>
				<div class="offer-card" v-else-if="activeSegment === EntitiesEnum.Facilities">
					<div class="card-background" v-if="!passes || !passes.length">
						<empty-block 
							title="Passes Empty" 
							hideButton 
							text="No Passes available for this location"
							icon="assets/icon/gym-user-icon.svg" 
						/>
					</div>
					<div class="offer-item" v-else :key="item.id" v-for="item in passes">
						<div class="header-section events">
							<div class="name">{{ item.title }}</div>
							<div class="price">
								${{ formatNumber(item.price / 100, "fixed") }}
							</div>
						</div>
						<div class="detail-section">
							<ion-label class="date-label">{{ item.duration }} {{ item.duration > 1 ? "Months" : "Month"
							}}</ion-label>
							<!-- <div class="only-address">
                {{ item.address }}
              </div> -->
							<ion-button @click="handleBuy">Subscribe</ion-button>
						</div>
					</div>
				</div>
				<div class="offer-card" v-else-if="activeSegment === EntitiesEnum.CreateDailys">
					<div class="card-background" v-if="!dailysData || !dailysData.length">
						<empty-block 
							title="Dailys Empty" 
							hideButton 
							text="No dailys available for this location"
							icon="assets/icon/daily.svg" 
						/>
					</div>
					<div class="offer-item" v-else :key="item.id" v-for="item in dailysData">
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
							<ion-button v-else  @click="handleSubscribe(item.id)">Subscribe</ion-button>
						</div>
					</div>
				</div>
				<div class="offer-card" v-else-if="activeSegment === EntitiesEnum.Events">
					<div class="card-background" v-if="!allEvents || !allEvents.length">
						<empty-block 
							title="Events Empty" 
							hideButton 
							text="No Events available for this location"
							icon="assets/icon/events.svg" 
						/>
					</div>
					<div class="offer-item" v-else :key="event.id" v-for="event in allEvents">
						<div class="header-section events">
							<div class="name">{{ event.title }}</div>
							<div class="event-time">
								<ion-text>${{ formatNumber(event?.price / 100, "fixed") }}</ion-text>
							</div>
						</div>
						<ion-label class="date-label">{{ dayjs(event?.start_date).format('D MMMM') }}</ion-label>
						<div class="detail-section">
							<div class="time">
								<ion-icon src="assets/icon/location.svg"></ion-icon>
								<ion-text>{{ event?.address?.street }}</ion-text>
							</div>
							<ion-button>Register</ion-button>
						</div>
					</div>
				</div>
			</div>
			<div class="more">
				<ion-text class="section-title">Equipment</ion-text>
				<div class="items">
					<advantage-item v-for="(item, index) in facility?.equipments" :key="index" :icon="item?.iconUrl ?? ''"
						:title="item?.name ?? ''" />
				</div>
			</div>
		</template>
	</detail>
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
</template>

<script setup lang="ts">
import { actionSheetController, IonSpinner, IonText, IonIcon, IonLabel, IonButton, IonSegment, IonSegmentButton, toastController } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import Detail from "@/general/components/Detail.vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import dayjs from "dayjs";
import {
	AddToCartDocument,
	AddToCartPurchasableEnum,
	EventsDocument,
	EventsQuery,
	EventsQueryVariables,
	FacilityItemsByFacilityIdAndTypeDocument,
	Facility,
	FollowDocument,
	FollowTypeEnum,
	MeDocument,
	MyWorkoutsDocument,
	Query,
	QueryEventsOrderByColumn,
	QueryFacilityWorkoutsOrderByColumn,
	Review,
	ReviewsDocument,
	RoleEnum,
	SettingsCodeEnum,
	SortOrder,
	UnfollowDocument,
	WorkoutsByFacilityDocument
} from "@/generated/graphql";
import { Review as UserReview } from "@/ts/types/user";
import { GetFacilityDocument } from "@/graphql/documents/userDocuments";
import { computed, ref } from "vue";
import AdvantageItem from "@/general/components/blocks/AdvantageItem.vue";
import ReviewSlides from "@/general/components/blocks/ratings/ReviewSlides.vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { EntitiesEnum } from "@/const/entities";
import useRoles from "@/hooks/useRole";
import Rating from "@/general/components/blocks/ratings/Rating.vue";
import { ellipse } from "ionicons/icons";
import PreviewDailyModal from "@/general/components/modals/workout/PreviewDailyModal.vue"
import BlurredScreenModal from "@/users/views/workouts/components/BlurredScreenModal.vue";
const route = useRoute();
const router = useRouter();
const isFollowed = ref(false);
const isTrusted = ref(false);
const dailyData = ref();
const isOpenBlurredScreenModal = ref(false);
const isOpenPreviewModal = ref(false);
const selectedDailyId = ref<number>();
const cartId = ref<number>();
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

const { result, loading, onResult } = useQuery<Pick<Query, "facility">>(
	GetFacilityDocument,
	{
		id: route.params.id,
	}
);

const facility = computed(() => result.value?.facility);

const { result: myDailys, loading: myDailysLoading, refetch: myRefetch } = useQuery(MyWorkoutsDocument, {
  first: 1000,
});

const myWorkouts = computed(() => myDailys.value?.myWorkouts?.data || []);

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
// End Events

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
	if (value < 60) {
		return value + ' s';
	} else if (value < 3600) {
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
		router.push({
		name: EntitiesEnum.PaymentsMethods,
		params: { orderId: selectedDailyId.value },
		query: { cart_id: cartId.value },
  });
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
// Dailys End

const { onResult: gotMe } = useQuery(
	MeDocument,
	{},
	{
		fetchPolicy: "no-cache",
	}
);

gotMe(async (response) => {
	isTrusted.value = !!response.data?.me?.settings?.find(
		(settings: any) => settings.setting.code === SettingsCodeEnum.VerifiedUser
	)?.value;
});

const { mutate: follow, onDone: onFollowed } = useMutation(FollowDocument, {
	variables: { id: route.params.id, type: FollowTypeEnum.Facility },
});

const { mutate: unfollow, onDone: onUnfollowed } = useMutation(
	UnfollowDocument,
	{
		variables: { id: route.params.id, type: FollowTypeEnum.Facility },
	}
);

const photosWithUrl = computed(() =>
	process.env.VUE_APP_CDN
		? result?.value?.facility?.media?.map(
			(media) => `${process.env.VUE_APP_CDN}${media?.path}`
		)
		: []
);

const { result: reviewsResult } = useQuery(ReviewsDocument, {
	id: route.params.id,
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
			return acc;
		},
		[]
	)
);

const handleFollow = () => {
	if (isFollowed.value) {
		unfollow();
	} else {
		follow();
	}
};

const handleBuy = () => {
	// router.push({ name: EntitiesEnum.FacilitySubscription });
};

const { role } = useRoles();

onResult(() => {
	if (result?.value?.facility?.is_followed) {
		isFollowed.value = result?.value?.facility?.is_followed;
	}
});

onFollowed(() => {
	isFollowed.value = true;
});

onUnfollowed(() => {
	isFollowed.value = false;
});

const isMyFacility = computed(() => {
	const myFacilities =
		JSON.parse(localStorage.getItem("user") || "")?.owned_facilities || [];
	return (
		myFacilities.find(
			(facility: Facility) => facility.id === route.params.id
		) &&
		(role === RoleEnum.OrganizationOwner ||
			role === RoleEnum.FacilityOwner ||
			role === RoleEnum.Manager)
	);
});

enum actionTypesEnum {
	DeleteGym = "DELETE_GYM",
	EditGym = "EDIT_GYM",
}

const onEdit = async () => {
	const actionSheet = await actionSheetController.create({
		mode: "ios",
		buttons: [
			{
				text: "Delete gym",
				role: "destructive",
				data: {
					type: actionTypesEnum.DeleteGym,
				},
			},
			{
				text: "Edit gym",
				data: {
					type: actionTypesEnum.EditGym,
				},
			},
			{
				text: "Cancel",
				role: "cancel",
			},
		],
	});

	await actionSheet.present();
};

const formatNumber = (num: number, type: string) => {
	if (num < 1e3) {
		if (type === 'normal') {
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

const previewDaily = (daily: any) => {
	dailyData.value = daily;
    isOpenPreviewModal.value = true;
    selectedDailyId.value = daily.id;
}

const onTrialEnd = () => {
    isOpenBlurredScreenModal.value = true;
}

const onClosePreview = () => {
    console.log("OOOO")
    isOpenPreviewModal.value = false;
}

</script>

<style scoped lang="scss">
.info {
	font-weight: 300;
	font-size: 14px;
	margin: 27px 32px 24px 16px;
	color: var(--ion-color-secondary);
}

.spinner {
	position: fixed;
	top: 50vh;
	left: 50vw;
	--color: var(--ion-color-white);
}

.info {
	font-family: "Yantramanav";
	color: var(--gray-400);
	margin-top: 24px;
}

.reviews {
	&__container {
		margin-bottom: 16px;
	}

	&__header {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		gap: 10px;
		padding: 0 16px;
		margin-bottom: 16px;
	}

	&__all {
		font-weight: 400;
		font-size: 14px;
		margin-left: auto;
		font-family: "Yantramanav";
	}

	&__title {
		font-weight: 500;
		font-size: 16px;
		color: var(--fitnesswhite);
		font-family: "Yantramanav";
	}
}

.rating {
	display: flex;
	align-items: center;

	&__icon {
		font-size: 24px;
	}

	&__likes,
	&__dislikes {
		font-family: "Yantramanav";
		font-size: 12px;
		font-weight: 500;
	}

	&__likes {
		color: var(--ion-color-success-tint);
	}

	&__dislikes {
		color: var(--ion-color-danger-tint);
	}
}

.section-title {
	font-size: 16px;
	font-weight: 500;
	line-height: 1.5;
	margin-right: 8px;
	color: var(--fitnesswhite);
	font-family: "Yantramanav";
}

.offerings {
	margin-top: 16px;
	padding: 0 16px;

	ion-segment {
		margin-top: 16px;
		--background: var(--gray-700);
		height: 36px;

		ion-segment-button {
			--indicator-color: var(--gold);
			--color: var(--gray-500);
			--color-checked: var(--gray-800);
			margin: 0;
		}
	}
}

.offer-card {
	margin-top: 16px;
	padding: 6px 10px;
	border-radius: 8px;
	background: var(--gray-700);
	max-height: 212px;
	overflow: auto;

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
				color: var(--fitnesswhite);
			}

			.trainer {
				color: var(--gray-400);
				font-size: 14px;
				font-weight: 500;
			}
		}

		.only-address {
			font-family: "Yantramanav";
			font-size: 14px;
			font-weight: 300;
		}

		.price {
			color: var(--gray-400);
			font-size: 16px;
			font-weight: 500;
		}

		.date-label {
			font-size: 14px;
			color: var(--grey-text);
			display: block;
			line-height: 21px;
			margin: 0;
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
					color: var(--gray-400);
					line-height: 21px;
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

			ion-button {
				height: 30px;
				--border-radius: 4px;
				color: var(--gray-700);
				font-size: 14px;
				font-weight: 600;
				min-width: 117px;
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

.more {
	padding: 0 16px;
	margin-top: 8px;

	.items {
		display: flex;
		flex-wrap: wrap;
		margin-top: 16px;
	}

	.certificate {
		width: fit-content;
	}
}
</style>
