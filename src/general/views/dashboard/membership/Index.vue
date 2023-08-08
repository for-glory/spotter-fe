<template>
	<div>
		<ion-spinner
			v-if="plansLoading"
			name="lines"
			class="spinner"
		/>
		<div class="page-content" v-else>
			<div class="plan">
				<ion-title class="font-40 white-text" color="primary">
					Your membership is currently active
				</ion-title>
			</div>
			<div class="membership w-100">
				<div class="plans">
					<ion-item
						lines="none"
						class="radiobutton"
						v-for="plan in plans"
						:key="plan.id"
						@click="selectProduct(plan)"
						:class="{
							'other':
								!plan.owned
						}"
						:disabled="plan.owned && dayjs(plan.expiryDate).isAfter(dayjs())"
					>
						<div class="radiobutton__block">
							<div class="icon">
								<div class="radiobutton__icon">
									<ion-icon src="assets/icon/medal.svg" />
								</div>
								<div v-if="!plan.owned">
									<ion-button v-if="currentSubscription==SubscriptionsTierEnum.Bronze" @click="handleChange">Upgrade</ion-button>
									<ion-button v-if="currentSubscription==SubscriptionsTierEnum.Silver" @click="handleChange">{{ plan.tier===SubscriptionsTierEnum.Gold?'Upgrade':'Downgrade'}}</ion-button>
									<ion-button v-if="currentSubscription==SubscriptionsTierEnum.Gold" @click="handleChange">Downgrade</ion-button>
								</div>
							</div>
							<div class="radiobutton__description">
								<ion-label class="radiobutton__label">
									{{ plan.title }}
								</ion-label>

								<ion-text class="radiobutton__cost"
									>${{ plan?.prices.length?plan?.prices[0].price/100:"" }}
									<span>
										/per location
									</span>
								</ion-text>
								<ul>
									<li
										class="accessibility"
										v-for="(benefit, idx) in plan?.benefits"
										:key="idx"
									>
										<div>
											<ion-icon src="assets/icon/accessibility.svg" />
										</div>
										<div>
											<ion-text>{{ benefit?.description }}</ion-text>
										</div>
									</li>
								</ul>
							</div>
							<div v-if="plan.owned">
								<ion-button @click="handleCancel" class="btn-cancel">Cancel Membership</ion-button>
							</div>
						</div>
					</ion-item>
				</div>
			</div>
		</div>
	</div>
	<cancel-membership
    :is-visible="showCancelConfirmModal"
		:plan="currentPlan"
    @confirm="cancelMembership"
    @cancel="hideCancelModal"
  />
</template>

<script setup lang="ts">
import { IonTitle, IonText, IonCheckbox, IonLabel, IonImg, IonButton, IonIcon, IonGrid, IonRadioGroup, IonItem, IonRadio, IonSpinner } from "@ionic/vue";
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { ref, onMounted } from "vue";
import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";
import { computed } from "@vue/reactivity";
import { useLazyQuery, useQuery } from "@vue/apollo-composable";
import { BackendStripe } from "@/services/stripe/stripe";
import useSubscription from "@/hooks/useSubscription";
import {
  MeDocument,
  PlansDocument,
  RoleEnum,
	SubscriptionsTierEnum,
  SubscriptionProvidersEnum,
  SubscriptionsTypeEnum,
} from "@/generated/graphql";
import CancelMembership from "@/general/components/modals/confirmations/CancelMembership.vue";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";

const router = useRouter();
const {
	showConfirmationModal: showCancelConfirmModal,
	hideModal: hideCancelModal,
	showModal: showCancelModal
} = useConfirmationModal();

const isLoading = ref<boolean>(false);
const { role } = useRoles();
const plans = ref<any[]>([]);
const otherPlans = ref<any[]>([]);
const currentPlan = ref<any>();
const selectedPlan = ref<any>({});
const selectedItem = ref<any>({});
const errorMessage = ref("");
const products = ref<any[]>([]);
const isAgreed = ref<boolean>(false);
const selectedProductId = ref<string | number | boolean | undefined>(undefined);


const backendStripe = new BackendStripe(
  process.env.VUE_APP_STRIPE_PUBLIC_KEY || ""
);

const typeValue = computed(() => {
  if (role === RoleEnum.Trainer) {
    return role;
  } else {
    return SubscriptionsTypeEnum.GymAndFacilities;
  }
});

const { onResult: onPlansResult, loading: plansLoading } = useQuery(
  PlansDocument,
  { type: typeValue.value as SubscriptionsTypeEnum, first: 100, page: 1 }
);
const { currentSubscription } = useSubscription();
onMounted(async () => {

  backendStripe.init();
  onPlansResult(async ({ data }) => {
    plans.value = data?.plans?.data.reduce((acc: any[], cur: any) => {
      if (cur.is_active) {
        const subscriptionPlan = cur.subscriptionPlans.filter(
          (i: any) => i.provider === SubscriptionProvidersEnum.Web
        );
        acc.push({
          ...cur,
					owned: currentSubscription === cur.tier,
          subscriptionPlan:
            subscriptionPlan.length && subscriptionPlan[0]?.is_active
              ? subscriptionPlan[0]
              : {},
        });
				if (currentSubscription === cur.tier) {
					currentPlan.value = {
						...cur,
						owned: currentSubscription === cur.tier,
						subscriptionPlan:
							subscriptionPlan.length && subscriptionPlan[0]?.is_active
								? subscriptionPlan[0]
								: {},
					}
				}
      }
      return acc;
    }, []);

  });
});

const handleChange = () => {
  isLoading.value = true;
	console.log(selectedItem.value);
	// const { mutate: createSubscriptionIntent } = backendStripe.createSubscriptionIntent();
  // createSubscriptionIntent({
  //   product_id: selectedItem.value.product_id,
  //   fees_percent: selectedPlan.value.fee,
  // })
  //   .then((data) => {
  //     console.log("data==>", data)
  //     let intent = JSON.parse(data?.data?.createSubscriptionIntent?.session);
  //     backendStripe.redirectToCheckout(intent.id);
  //   })
  //   .catch((err) => {
  //     errorMessage.value = err;
  //     throw new Error(err);
  //   });
};

const handleCancel = () => {
  // isLoading.value = true;
	console.log(selectedItem.value);
	showCancelModal();
};

const selectProduct = (plan: any) => {
	console.log('plan.subscriptionPlan', plan);
	selectedItem.value = plan.subscriptionPlan
	selectedProductId.value = plan.subscriptionPlan.product_id
};
const selectMembership = (id: any) => {
	plans.value.forEach((plan: any) => {
		if (plan.id == id) {
			console.log(plan)
			selectedPlan.value = plan
			selectedItem.value = plan.subscriptionPlan
			selectedProductId.value = plan.subscriptionPlan.product_id
		}
	})
}

</script>

<style scoped lang="scss">
.page-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
	align-items: center;
}

.title {
  padding: 0;
  margin-bottom: 20px;
  color: var(--gold);
  font-family: Lato;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
}

.plan {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.5rem;
	.plan-features {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: fit-content;
	
		&__item {
			display: flex;
			gap: 1rem;
		}
	}
}

.plans {
	display: flex;
	justify-content: center;
	gap: 1rem;
	margin-top: 1rem;
	align-items: center;
	.radiobutton {
		max-width: 340px;
		width: 33%;
		font-size: 14px;
		line-height: 1.5;
		position: relative;
		--padding-top: 0;
		--border-radius: 8px;
		--padding-bottom: 8px;
		--border-radius: 4px;
		--color: var(--ion-color-medium);
		--inner-padding: 0;
		--background: var(--gray-700);
		--border-width: 0.8px;
		--border-style: solid;
		--border-color: var(--gray-600);
	
		&:not(:last-child) {
			margin-bottom: 16px;
		}
	
		&.other {
			--border-color: var(--ion-color-primary);
			--background: linear-gradient(137deg, #EDE8D7 0%, #DBB582 100%), #000;
			.radiobutton__block {
				padding: 0;
				flex-direction: row-reverse;
				gap: 12px;
				min-height: 170px;
			}
			.icon {
				display: flex;
				flex-direction: column;
				align-items: end;
				.radiobutton__icon {
					width: 4.5rem;
					height: 4.5rem;
					padding: 1.125rem;
					background: var(--gray-800);
					margin-bottom: 20px;
				}
				ion-button {
					height: 24px;
					--background: #202020;
					color: #FFF;
					font-family: Lato;
					font-size: 14px;
					font-style: normal;
					line-height: 12px;
				}
			}
			
			.radiobutton__label {
				text-align: start;
				--color: var(--main-color);
				font-size: 9px;
				font-style: normal;
				font-weight: 500;
				line-height: 150%;
				margin: 0;
			}
			
			.radiobutton__cost {
				text-align: start;
				display: block;
				margin-bottom: 4px;
				font-weight: 500;
				font-size: 9px;
				line-height: 1.5;
				text-transform: uppercase;
				color: var(--main-color);
		
				span {
					text-transform: none;
					color: var(--ion-color-medium);
				}
			}
			.accessibility {
					color: var(--ion-color-medium);
					display: flex;
					gap: 0.25rem;
					align-items: center;
					font-size: 9px;
					line-height: 1.5;

					ion-icon {
						width: 16px;
					}
				}
		}
		.btn-cancel {
			margin-top: 20px;
			--background: #A3A3A4;
			height: 30px;
			color: #FFF;
			font-family: Lato;
			font-size: 14px;
			font-style: normal;
			line-height: 12px;
		}
	
		ion-radio {
			width: 18px;
			height: 18px;
			border-width: 1.8px;
			margin: 3px 3px 3px 12px;
			--color: var(--ion-color-medium);
			--mark-width: 12px;
			--mark-height: 9px;
			position: absolute;
			top: 50%;
			right: 10px;
	
			&::part(mark) {
				background-position: 50% 50%;
				background-repeat: no-repeat;
				width: calc(100% + var(--border-width));
				height: calc(100% + var(--border-width));
				background-size: var(--mark-width) var(--mark-height);
				background-image: url(/public/assets/icon/check-mark.svg);
			}
		}
	
		&__block {
			padding: 2rem 1rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
		}
	
		&__icon {
			width: 7.5rem;
			height: 7.5rem;
			padding: 1.875rem;
			display: flex;
			flex-shrink: 0;
			line-height: 1;
			font-size: 60px;
			border-radius: 10px;
			align-items: center;
			justify-content: center;
			color: var(--ion-color-white);
			box-shadow: inset 0 0 0 0.8px var(--gray-600);
		}

		.gold {
			color: var(--gold);
		}
		.silver {
			color: var(--silver);
		}
		.bronze {
			color: var(--bronze);
		}
	
		&__description {
			flex: 1 1 auto;
		}
	
		&__label {
			text-align: center;
			--color: var(--ion-color-white);
			font-family: Yantramanav;
			font-size: 16px;
			font-style: normal;
			font-weight: 500;
			line-height: 150%;
			margin: 12px 0 8px;
		}
	
		&__title {
			display: flex;
			align-items: center;
		}
	
		&__rating {
			display: inline-block;
			padding: 0 9px;
			background: var(--ion-color-primary);
			color: var(--gray-700);
			border-radius: 20px;
		}
	
		&__cost {
			text-align: center;
			display: block;
			margin-bottom: 4px;
			font-weight: 500;
			font-size: 16px;
			line-height: 1.5;
			text-transform: uppercase;
			color: var(--ion-color-primary);
	
			span {
				text-transform: none;
				color: var(--ion-color-medium);
			}
		}
	
		ul {
			margin: 0;
			padding: 0;
			list-style: none;
			font-weight: 400;
			font-size: 14px;
			line-height: 1.5;
			color: var(--ion-color-medium);
	
			li {
				margin-bottom: 4px;
	
				&.accessibility {
					color: var(--ion-color-primary);
					display: flex;
					gap: 0.5rem;
					align-items: center;

					ion-icon {
						width: 16px;
					}
				}
			}
	
			ion-icon {
				font-size: 10px;
				margin-right: 6px;
			}
		}
	}
	
	@media (max-width: 992px) {
		flex-direction: column;
		align-items: center;
		.radiobutton {
			width: 80%;
			max-width: unset;
		}
	}
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
</style>
 