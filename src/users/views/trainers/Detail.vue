<template>
	<ion-spinner v-if="loading" name="lines" class="spinner" />
	<detail v-else :name="fullName" :likes="user?.positive_reviews_count || 0" :total-rating="user?.score || '0.0'"
		:dislikes="user?.negative_reviews_count || 0" :is-followed="isFollowed"
		:photos-url="photosWithUrl && photosWithUrl[0] ? (photosWithUrl as string[]) : undefined" :address="address"
		@handle-book="onBook" :is-trusted="isTrusted" @handle-edit="onEdit" @handle-follow="handleFollow"
		:certificatesTitle="user?.certificates?.length ? 'Certificates' : undefined
			" :labilitiesTitle="user?.weiver_and_labilities?.length ? 'Waiver and Labilities' : undefined
		" :viewAllLink="EntitiesEnum.TrainerReviews" :symbols="symbols">
		<template #info>
			<div class="info">
				<div class="info__block">
					<ion-text class="main-info"> ${{ hourlyRate }} </ion-text>
					<ion-text class="info__secondary"> Hourly rate </ion-text>
				</div>
				<div class="info__block">
					<ion-text class="main-info">
						{{ user?.completed_trainings_count || 0 }}
					</ion-text>
					<ion-text class="info__secondary"> Completed </ion-text>
				</div>
				<div class="info__block">
					<ion-text class="main-info"> {{ user?.reviews_count }} </ion-text>
					<ion-text class="info__secondary"> Reviews </ion-text>
				</div>
			</div>
		</template>
		<!-- <template #reviews v-if="role !== RoleEnum.User">
			<review-slides :reviews="reviews" heightFixed v-if="reviews?.length" />
			<ion-text color="secondary" class="no-reviews" v-else>
				There are no reviews yet...
			</ion-text>
		</template> -->
		<template #offering>
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
						<ion-text color="secondary" class="font-light">Hourly rate</ion-text>
						<ion-text color="secondary" class="font-light">(client's home)</ion-text>
					</div>
					<div class="info-item">
						<strong class="info-item__title">${{ user?.trainerRates[0]?.front_price }}</strong>
						<ion-text color="secondary" class="font-light">Hourly rate</ion-text>
						<ion-text color="secondary" class="font-light">(In gym)</ion-text>
					</div>
				</div>
				<div class="offer-card" v-else-if="segmentValue === 'daily'">
					<div v-if="!offerList || !offerList.length">
						<empty-block title="Dailys Empty" hideButton text="No Dailys available."
							icon="assets/icon/daily.svg" />
					</div>
					<div v-else class="offer-item" :key="item.id" v-for="item in offerList">
						<div class="header-section">
							<div class="name" @click="previewDaily(item)">{{ item.name }}</div>
							<div class="trainer">{{ item.trainer }}</div>
						</div>
						<div class="detail-section">
							<div class="time">
								<ion-icon src="assets/icon/time.svg"></ion-icon>
								<ion-text>{{ item.time }}</ion-text>
								<ion-icon class="dot-icon" :icon="ellipse"></ion-icon>
								<ion-text>{{ item.type }}</ion-text>
							</div>
							<div v-if="myWorkouts.some((my: any) => my.id === item.id)" class="total">
								<ion-icon src="assets/icon/profile.svg"></ion-icon>
								<ion-text>{{ item.totalUser }}</ion-text>
							</div>
							<ion-button v-else @click="handleSubscribe(item.id)">Subscribe</ion-button>
						</div>
					</div>
				</div>
				<div class="offer-card" v-else-if="segmentValue === 'events'">
					<div class="card-background" v-if="!eventList || !eventList.length">
						<empty-block
							title="Events Empty"
							hideButton
							text="No Events available"
							icon= "assets/icon/events.svg"
						/>
					</div>
					<div class="offer-item" :key="item.id" v-for="item in eventList">
						<div class="header-section events">
							<div class="name">{{ item.name }}</div>
							<div class="event-time">
								<ion-icon src="assets/icon/time.svg"></ion-icon>
								<ion-text class="color-fitness-white fs-14">{{ item.price }}</ion-text>
							</div>
						</div>
						<ion-label class="date-label">{{ item.date }}</ion-label>
						<div class="detail-section">
							<div class="time">
								<ion-icon src="assets/icon/location.svg"></ion-icon>
								<ion-text>{{ item.address }}</ion-text>
							</div>
							<ion-button @click="goToEventDetail(item.id)">Register</ion-button>
						</div>
					</div>
				</div>
			</div>
		</template>
		<template #certificates>
			<div v-for="certificate in user?.certificates" :key="certificate.id"
				@click="onOpenDocumet(certificate.pathUrl)">
				<advantage-item icon="assets/icon/advantages/certificate.svg" :title="certificate.title || ''" />
			</div>
		</template>
		<template #labilities>
			<div v-for="lability in user?.weiver_and_labilities" :key="lability.id" id="open-pdf-modal"
				@click="onOpenDocumet(lability.pathUrl)">
				<advantage-item icon="assets/icon/advantages/certificate.svg" :title="lability.title || ''" />
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
		:is-open="isOpenBlurredScreenModal"
		:preview-url="dailyData?.previewUrl"
		@visibility="isOpenBlurredScreenModal = false"
		@purchase-daily="purchaseWorkout"
		:disabled="addToCartLoading"
	/>
</template>

<script setup lang="ts">
import { IonText, IonButton, IonSegment, IonIcon, IonSegmentButton, actionSheetController, toastController } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import Detail from "@/general/components/Detail.vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import {
	AddToCartDocument,
	AddToCartPurchasableEnum,
	FeedbackEntityEnum,
	FollowDocument,
	FollowTypeEnum,
	MeDocument,
	MyWorkoutsDocument,
	Query,
	QueryWorkoutsOrderByColumn,
	ReviewsDocument,
	RoleEnum,
	SettingsCodeEnum,
	SortOrder,
	TrainerTypeEnum,
	UserDocument,
	UnfollowDocument,
	WorkoutsDocument,
  EventsQueryVariables,
  QueryEventsOrderByColumn,
  EventsQuery,
  EventsDocument
} from "@/generated/graphql";
import { computed, ref } from "vue";
import AdvantageItem from "@/general/components/blocks/AdvantageItem.vue";
import ReviewSlides from "@/general/components/blocks/ratings/ReviewSlides.vue";
import { getUnifiedString } from "@/utils/textUtils";
import { EntitiesEnum } from "@/const/entities";
import { Review as UserReview } from "@/ts/types/user";
import { paymentGatewaysStore } from "@/users/store/paymentGatewaysStore";
import { Browser } from "@capacitor/browser";
import { getSumForPayment } from "@/general/helpers/getSumForPayment";
import { Share } from "@capacitor/share";
import useRoles from "@/hooks/useRole";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { ellipse } from "ionicons/icons";
import PreviewDailyModal from "@/general/components/modals/workout/PreviewDailyModal.vue"
import BlurredScreenModal from "@/users/views/workouts/components/BlurredScreenModal.vue";
import dayjs from "dayjs";
import { Capacitor } from "@capacitor/core";

const route = useRoute();
const router = useRouter();
const { role } = useRoles();
const segmentValue = ref('trainer');
const isFollowed = ref(false);
const isTrusted = ref(false);
const dailyData = ref();
const isOpenBlurredScreenModal = ref(false);
const isOpenPreviewModal = ref(false);
const selectedDailyId = ref<number>();

const paymentProductsStore = paymentGatewaysStore();

const activeSegment = ref<EntitiesEnum>(
	EntitiesEnum.Facilities
);

const handleBuy = () => {
	// router.push({ name: EntitiesEnum.FacilitySubscription });
};

const { result: myDailys, loading: myDailysLoading, refetch } = useQuery(MyWorkoutsDocument, {
  first: 1000,
});

const myWorkouts = computed(() => myDailys.value?.myWorkouts?.data || []);

const { result, loading, onResult } = useQuery<Pick<Query, "user">>(
	UserDocument,
	{
		id: route.params.id,
	}
);

const { result: dailysResult, loading: dailysLoading, refetch: refetchDailys, onResult: gotDailysData } = useQuery(
	WorkoutsDocument, {
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

const offerList = computed(() => dailysResult.value.workouts.data.map((daily: any) => {
	return {
		id: daily?.id,
		name: daily?.title,
		trainer: `${daily?.trainer?.first_name} ${daily?.trainer?.first_name}`,
		time: daily?.duration,
		totalUser: daily?.views_count,
		purchases: daily?.purchases,
		type: daily?.type.name,
		video: daily?.video,
		previewUrl: daily?.previewUrl
	}
}));

const handleSubscribe = (id: number) => {
	selectedDailyId.value = id;
	purchaseWorkout();
}
const { mutate: addToCartMutation, loading: addToCartLoading } =
	useMutation(AddToCartDocument);
const purchaseWorkout = () => {
	isOpenBlurredScreenModal.value = false;
	isOpenPreviewModal.value = false;
	addToCartMutation({
		input: {
			purchasable_id: selectedDailyId.value,
			purchasable: AddToCartPurchasableEnum.Workout,
		},
	})
		.then((res) => {
			router.push({
				name: EntitiesEnum.WorkoutOrder,
				params: {
					id: selectedDailyId.value,
				},
				query: {
					cart_id: res?.data?.addToCart?.id,
				},
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
const previewDaily = (daily: any) => {
	dailyData.value = daily;
    isOpenPreviewModal.value = true;
    selectedDailyId.value = daily.id;
}

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

const { mutate: follow, onDone: onFollowed } = useMutation(FollowDocument, {
	variables: { id: route.params.id, type: FollowTypeEnum.User },
});

const { mutate: unfollow, onDone: onUnfollowed } = useMutation(
	UnfollowDocument,
	{
		variables: { id: route.params.id, type: FollowTypeEnum.User },
	}
);

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

onResult(() => {
	if (result?.value?.user?.is_followed) {
		isFollowed.value = result?.value?.user?.is_followed;
	}
});

const isMobile = computed(() =>
	result.value?.user?.settings?.find(
		(setting) => setting.setting?.code === SettingsCodeEnum.IsMobile
	)
);

onFollowed(() => {
	isFollowed.value = true;
});

onUnfollowed(() => {
	isFollowed.value = false;
});

const user = computed(() => result.value?.user);

const hourlyRate = computed(() => {
	let rate;
	if (result?.value?.user?.trainer_type === TrainerTypeEnum.Freelancer) {
		rate = result.value?.user?.settings?.find(
			(setting) => setting.setting?.code === SettingsCodeEnum.RemoteHourlyRate
		);
	} else {
		rate = result.value?.user?.settings?.find(
			(setting) => setting.setting?.code === SettingsCodeEnum.HourlyRate
		);
	}
	return rate?.value ? getSumForPayment(rate.value, true) : "0.00";
});

const fullName = computed(() => {
	return getUnifiedString(
		[result.value?.user?.first_name, result.value?.user?.last_name],
		" "
	);
});

const symbols = computed(
	() =>
		`${result.value?.user?.first_name?.charAt(
			0
		)}${result.value?.user?.last_name?.charAt(0)}`
);

const photosWithUrl = computed(() =>
	result?.value?.user?.media?.reduce(
		(acc, cur) => {
			if (cur?.pathUrl) {
				acc.push(cur.pathUrl);
			}
			return acc;
		},
		[result?.value?.user.avatarUrl]
	)
);

const address = computed(() => {
	return result.value?.user?.facilities?.[0]?.address?.street || "";
});

const onBook = () => {
	// if (user.value) paymentProductsStore.clearCart();
	// paymentProductsStore.setValue("price", hourlyRate.value);
	// paymentProductsStore.setValue("isMobile", isMobile.value);
	router.push({
		name: EntitiesEnum.BookTrainer,
		params: { id: route.params.id },
	});
};

enum actionTypesEnum {
	// DeleteProfile = "DELETE_PROFILE",
	EditProfile = "EDIT_PROFILE",
	ShareProfile = "SHARE_PROFILE",
}

const onEdit = async () => {
	const actionSheet = await actionSheetController.create({
		mode: "ios",
		buttons: [
			// {
			//   text: "Delete profile",
			//   role: "destructive",
			//   data: {
			//     type: actionTypesEnum.DeleteProfile,
			//   },
			// },
			{
				text: "Edit profile",
				data: {
					type: actionTypesEnum.EditProfile,
				},
			},
			{
				text: "Share profile",
				data: {
					type: actionTypesEnum.ShareProfile,
				},
			},
			{
				text: "Cancel",
				role: "cancel",
			},
		],
	});

	await actionSheet.present();

	const { data } = await actionSheet.onWillDismiss();
	const type: actionTypesEnum = data?.type;

	const actions = {
		// [actionTypesEnum.DeleteProfile]: () => deleteProfile(),
		[actionTypesEnum.EditProfile]: () => editProfile(),
		[actionTypesEnum.ShareProfile]: () => shareProfile(),
	};

	if (actions[type]) {
		actions[type]();
	}
};
const editProfile = () => {
	router.push({
		name: EntitiesEnum.ProfileEdit,
	});
};

const shareProfile = async () => {
	await Share.share({
		title: fullName.value,
		url: `https://${process.env.VUE_APP_URL}/users/trainers/${route.params.id}`,
		dialogTitle: "Share",
	});
};

const handleFollow = () => {
	if (isFollowed.value) {
		unfollow();
	} else {
		follow();
	}
};

const onOpenDocumet = async (url: string) => {
	await Browser.open({ url: url });
};

const onTrialEnd = () => {
    isOpenBlurredScreenModal.value = true;
}

const onClosePreview = () => {
    console.log("OOOO")
    isOpenPreviewModal.value = false;
}

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
  created_by_trainer: route.params.id
};

const {
  result: eventResult,
  loading: eventsLoading,
} = useQuery<EventsQuery>(EventsDocument, eventsParams, {
  notifyOnNetworkStatusChange: true,
  fetchPolicy: "no-cache",
});

const eventList = computed(() => eventResult.value?.events?.data.map((event: any) => {
  return {
    id: event?.id,
    name: event?.title,
    price: formatNumber(event?.price/100, "fixed"),
    date: dayjs(event?.start_date).format('D MMMM'),
    address: event?.address?.street
  }
}));

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
ion-text {
	font-weight: 400;
	font-size: 14px;
	color: var(--gray-400);

	&.main-info {
		font-weight: 500;
		font-size: 16px;
		padding: 4px;
		--color: var(--white);
	}
}

.info-item {
	display: flex;
	flex-direction: column;
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
		font-family: "Yantramanav";
	}
}
.info {
	display: flex;
	justify-content: space-between;
	margin: 25px 16px;
	background-color: var(--gray-700);
	padding: 16px;
	text-align: center;
	border-radius: 8px;
	gap: 20px;

	&__block {
		flex: 1 1 100%;
		white-space: nowrap;
		display: flex;
		padding: 0 8px;
		position: relative;
		flex-direction: column;
		align-items: center;

		&:not(:first-child) {
			&:before {
				left: 0;
				top: 50%;
				content: "";
				height: 32px;
				margin-top: -16px;
				position: absolute;
				border-left: 1px solid var(--gray-600);
			}
		}
	}
}

.separator {
	height: 32px;
	width: 1px;
	margin: auto 0;
	background-color: var(--gray-600);
}

.spinner {
	position: fixed;
	top: 50vh;
	left: 50vw;
	--color: var(--white);
}

.review-slide {
	width: 85%;
}

.no-reviews {
	margin: 16px;
	padding: 16px;
	display: block;
	font-size: 14px;
	font-weight: 300;
	line-height: 1.5;
	border-radius: 8px;
	background: var(--gray-700);
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
				cursor: pointer;
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

.align-items-start {
	align-items: flex-start !important;
}

.justify-content-end {
	justify-content: end !important;
}
</style>
