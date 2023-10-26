<template>
	<base-layout hide-navigation-menu draggable header-fixed :initial-breakpoint="0.4">
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
					<ion-text class="address" color="secondary" v-if="user?.address?.street">
						<ion-icon src="assets/icon/address.svg" class="address__icon"
							:class="route?.params?.type == TrainerProfileViewEnum.CurrentUser ? 'user' : ''" />
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
						<strong class="info-item__title">${{ user?.trainerRates[0]?.front_price }}</strong>
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
						<ion-badge class="reviews__badge"
							v-if="route?.params?.type == TrainerProfileViewEnum.CurrentUser">{{
								user?.score }}</ion-badge>
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
					v-if="specialNeeds?.length && route?.params?.type != TrainerProfileViewEnum.CurrentUser">
					<ion-text class="info-section__title">Special needs or other conditions</ion-text>
					<ion-text>{{ specialNeeds }}</ion-text>
				</div>
				<div class="offerings" v-if="route?.params?.type == TrainerProfileViewEnum.CurrentUser">
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
					<div class="ion-margin-top info" v-if="segmentValue == 'trainer'">
						<div class="info-item">
							<strong class="info-item__title">$ {{ user.trainerRates[0].front_price }}</strong>
							<ion-text color="secondary" class="font-light">Hourly rate (client's home)</ion-text>
						</div>
						<div class="info-item">
							<strong class="info-item__title">$ {{ user.trainerRates[1].front_price }}</strong>
							<ion-text color="secondary" class="font-light">Hourly rate (In gym)</ion-text>
						</div>
					</div>
					<div class="offer-card" v-else-if="segmentValue == 'daily'"
						style="max-height: 300px; overflow-y: scroll;">
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
								<div class="name"  @click="previewDaily(item)">{{ item.name }}</div>
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
								<ion-button v-else  @click="handleSubscribe(item.id)">Subscribe</ion-button>
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
				<div class="document-cards" v-if="route?.params?.type == TrainerProfileViewEnum.CurrentUser">
					<ion-text class="section-title">Certifications</ion-text>
					<div class="doc-items">
						<ion-button :class="index == 0 ? 'active' : ''" fill="outline" :key="item"
							v-for="(item, index) in docList">
							<ion-icon src="assets/icon/certificate.svg"></ion-icon>
							{{ item }}
						</ion-button>
					</div>
				</div>
				<div class="document-cards" v-if="route?.params?.type == TrainerProfileViewEnum.CurrentUser">
					<ion-text class="section-title">Waiver and Labilities</ion-text>
					<div class="doc-items">
						<ion-button :class="index == 0 ? 'active' : ''" fill="outline" :key="item"
							v-for="(item, index) in docList">
							<ion-icon src="assets/icon/certificate.svg"></ion-icon>
							{{ item }}
						</ion-button>
					</div>
				</div>
			</div>
		</template>
	</base-layout>
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
import {
	IonImg,
	IonIcon,
	IonText,
	actionSheetController,
	IonSegment,
	IonSegmentButton,
	IonButton,
	IonBadge,
	IonLabel,
	toastController
} from "@ionic/vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { AddToCartDocument, AddToCartPurchasableEnum, MyWorkoutsDocument, QueryWorkoutsOrderByColumn, SortOrder, UserDocument, WorkoutsDocument } from "@/generated/graphql";
import dayjs from "dayjs";
import { computed, ref } from "vue";
import relativeTime from "dayjs/plugin/relativeTime";
import { EntitiesEnum } from "@/const/entities";
import { TrainerProfileViewEnum } from "@/const/TrainerSelectOption";
import { ellipse } from "ionicons/icons";
import { Share } from "@capacitor/share";
import { useTrainerStore } from "@/general/stores/useTrainerStore"
import PreviewDailyModal from "@/general/components/modals/workout/PreviewDailyModal.vue"
import BlurredScreenModal from "@/users/views/workouts/components/BlurredScreenModal.vue";

dayjs.extend(relativeTime);

const router = useRouter();
const segmentValue = ref('trainer');

const trainer = useTrainerStore();
const dailyData = ref();
const isOpenBlurredScreenModal = ref(false);
const isOpenPreviewModal = ref(false);
const selectedDailyId = ref<number>();
const cartId = ref<number>();

const handleBack = () => {
	router.go(-1);
};

const { result: myDailys, loading: myDailysLoading, refetch: myRefetch } = useQuery(MyWorkoutsDocument, {
  first: 1000,
});

const myWorkouts = computed(() => myDailys.value?.myWorkouts?.data || []);

const { result: dailysResult, loading: dailysLoading, refetch: refetchDailys, onResult: gotDailysData } = useQuery(
	WorkoutsDocument, {
	page: 1,
	first: 1000,
	order: SortOrder.Asc,
	orderByColumn: QueryWorkoutsOrderByColumn.CreatedAt,
	trainer_id: trainer.trainer?.id
},
	{
		fetchPolicy: "no-cache",
	}
);

const handleMore = async () => {
	const actionSheet = await actionSheetController.create({
		mode: "ios",
		cssClass: 'profile-action-sheet',
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
}
const route = useRoute();

const { result } = useQuery(UserDocument, {
	id: route.params.id
});

const offerList = computed(() => dailysResult.value.workouts.data.map((daily: any) => {
	return {
		id: daily?.id,
		name: daily?.title,
		trainer: `${daily?.trainer?.first_name} ${daily?.trainer?.first_name}`,
		time: daily?.duration,
		totalUser: daily?.views_count,
		type: daily?.type.name,
		video: daily?.video,
        previewUrl: daily?.previewUrl
	}
}));

const offerEvents = [{
	id: 1,
	name: "Run competition",
	trainer: "Tamra Dae",
	time: "8 min",
	totalUser: 30,
	date: "17 June",
	address: "Light Street, 1",
}, {
	id: 2,
	name: "Run competition",
	trainer: "Tamra Dae",
	time: "8 min",
	totalUser: 30,
	date: "17 June",
	address: "Light Street, 1",

}, {
	id: 3,
	name: "Run competition",
	trainer: "Tamra Dae",
	time: "8 min",
	totalUser: 30,
	date: "17 June",
	address: "Light Street, 1",
}]
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
	})
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
const docList = ["Advance Trainer ISSA2022", "SEES 2018", "RTEE COO 2015"];

const user = computed(() => {
	// return result.value?.user;
	return {
		id: trainer.trainer.id,
		title: `${trainer.trainer.first_name} ${trainer.trainer.last_name}`,
		address: {
			street: "Arizona, Phoenix, USA",
		},
		start_date: "10 month",
		userId: "5328",
		first_name: trainer.trainer.first_name,
		last_name: trainer.trainer.last_name,
		avatarUrl: trainer.trainer.avatarUrl,
		created_at: new Date().setFullYear(2022, 10),
		positive_reviews_count: trainer.trainer.positive_reviews_count ?? 0,
		negative_reviews_count: trainer.trainer.negative_reviews_count ?? 0,
		score: trainer.trainer.score ?? 0,
		trainerRates: trainer.trainer.trainerRates,
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

const previewDaily = (daily: any) => {
	dailyData.value = daily;
    isOpenPreviewModal.value = true;
    selectedDailyId.value = daily.id;
}

const onTrialEnd = () => {
    isOpenBlurredScreenModal.value = true;
}

const onClosePreview = () => {
    isOpenPreviewModal.value = false;
}

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

	&__likes,
	&__dislikes {
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

		ion-button {
			height: 30px;
			font-weight: 600;
			--color: var(--gray-700);
			--border-radius: 4px;
			font-size: 14px;
			margin: 0;
			min-width: 117px;
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
</style>
