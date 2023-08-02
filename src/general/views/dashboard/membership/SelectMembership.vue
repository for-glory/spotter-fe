<template>
	<div>
		<ion-spinner
			v-if="plansLoading"
			name="lines"
			class="spinner"
		/>
		<div class="page-content" v-else>
			<div class="plan">
				<ion-title class="font-20" color="primary">
					Start with 30 days free trial
				</ion-title>
				<ion-title class="font-40 white-text" color="primary">
					Choose your plan
				</ion-title>
				<div class="plan-features">
					<div class="plan-features__item">
						<ion-icon src="assets/icon/check-mark.svg" color="primary" />
						<ion-text>All Features</ion-text>
					</div>
					<div class="plan-features__item">
						<ion-icon src="assets/icon/check-mark.svg" color="primary" />
						<ion-text>Other Features</ion-text>
					</div>
					<div class="plan-features__item">
						<ion-icon src="assets/icon/check-mark.svg" color="primary" />
						<ion-text>Premium Access</ion-text>
					</div>
				</div>
			</div>
			<div class="membership w-100">
				<ion-radio-group class="plans">
					<!-- <ion-item
						lines="none"
						class="radiobutton"
						v-for="plan in plans"
						:key="plan.id"
						@click="selectProduct(plan)"
						:class="{
							'item-radio-checked':
								plan.owned && dayjs(plan.expiryDate).isAfter(dayjs()),
						}"
						:disabled="plan.owned && dayjs(plan.expiryDate).isAfter(dayjs())"
					>
						<div class="radiobutton__block">
							<div class="radiobutton__icon">
								<ion-icon src="assets/icon/medal.svg" />
							</div>
							<div class="radiobutton__description">
								<ion-label class="radiobutton__label">
									{{ plan.title }}
								</ion-label>

								<ion-text class="radiobutton__cost"
									>{{ plan?.price }}
									<span
										v-if="plan.owned && dayjs(plan.expiryDate).isAfter(dayjs())"
									>
										/ Expire: {{ dayjs(plan.expiryDate).format("MM/DD/YY") }}
									</span>
									<span v-else-if="plan.billingPeriodUnit">
										/
										{{ plan.billingPeriodUnit }}
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
						</div>
						<ion-radio :value="plan.id" slot="end"></ion-radio>
					</ion-item> -->
					<ion-item
						lines="none"
						class="radiobutton"
						@click="selectMembership(4)"
					>
						<div class="radiobutton__block">
							<div class="radiobutton__icon">
								<ion-icon src="assets/icon/medal.svg" :class="'bronze'" />
							</div>
							<div class="radiobutton__description">
								<ion-label class="radiobutton__label">
									Bronze Membership
								</ion-label>

								<ion-text class="radiobutton__cost"
									>$99.99
									<span>
										/per location
									</span>
								</ion-text>
								<ul>
									<li
										class="accessibility"
									>
										<div>
											<ion-icon src="assets/icon/accessibility.svg" />
										</div>
										<div>
											<ion-text>Searchable profile on our Network (with the ability to list up to 10 offerings)</ion-text>
										</div>
									</li>
									<li
										class="accessibility"
									>
										<div>
											<ion-icon src="assets/icon/accessibility.svg" />
										</div>
										<div>
											<ion-text>Custom drop-in program featuring rates and bundles</ion-text>
										</div>
									</li>
									<li
										class="accessibility"
									>
										<div>
											<ion-icon src="assets/icon/accessibility.svg" />
										</div>
										<div>
											<ion-text>Custom waiver and liability upload</ion-text>
										</div>
									</li>
									<li
										class="accessibility"
									>
										<div>
											<ion-icon src="assets/icon/accessibility.svg" />
										</div>
										<div>
											<ion-text>20% flat fee for each transaction</ion-text>
										</div>
									</li>
									<li
										class="accessibility"
									>
										<div>
											<ion-icon src="assets/icon/accessibility.svg" />
										</div>
										<div>
											<ion-text>Spotter Dashboard</ion-text>
										</div>
									</li>
								</ul>
							</div>
						</div>
						<ion-radio :value="4" slot="end"></ion-radio>
					</ion-item>
					<ion-item
						lines="none"
						class="radiobutton"
						@click="selectMembership(6)"
					>
						<div class="radiobutton__block">
							<div class="radiobutton__icon">
								<ion-icon src="assets/icon/medal.svg" :class="'gold'" />
							</div>
							<div class="radiobutton__description">
								<ion-label class="radiobutton__label">
									Gold Membership
								</ion-label>

								<ion-text class="radiobutton__cost"
									>$199.99
									<span>
										/per location
									</span>
								</ion-text>
								<ul>
									<li
										class="accessibility"
									>
										<div>
											<ion-icon src="assets/icon/accessibility.svg" />
										</div>
										<div>
											<ion-text>All Bronze & Silver features +</ion-text>
										</div>
									</li>
									<li
										class="accessibility"
									>
										<div>
											<ion-icon src="assets/icon/accessibility.svg" />
										</div>
										<div>
											<ion-text>Reporting features on Spotter Dashboard</ion-text>
										</div>
									</li>
									<li
										class="accessibility"
									>
										<div>
											<ion-icon src="assets/icon/accessibility.svg" />
										</div>
										<div>
											<ion-text>Marketing/branding consultation</ion-text>
										</div>
									</li>
									<li
										class="accessibility"
									>
										<div>
											<ion-icon src="assets/icon/accessibility.svg" />
										</div>
										<div>
											<ion-text>Reduced flat booking fee</ion-text>
										</div>
									</li>
									<li
										class="accessibility"
									>
										<div>
											<ion-icon src="assets/icon/accessibility.svg" />
										</div>
										<div>
											<ion-text>Create and post local events </ion-text>
										</div>
									</li>
									<li
										class="accessibility"
									>
										<div>
											<ion-icon src="assets/icon/accessibility.svg" />
										</div>
										<div>
											<ion-text>10% flat fee for each transaction</ion-text>
										</div>
									</li>
								</ul>
							</div>
						</div>
						<ion-radio :value="6" slot="end"></ion-radio>
					</ion-item>
					<ion-item
						lines="none"
						class="radiobutton"
						@click="selectMembership(5)"
					>
						<div class="radiobutton__block">
							<div class="radiobutton__icon">
								<ion-icon src="assets/icon/medal.svg" :class="'silver'" />
							</div>
							<div class="radiobutton__description">
								<ion-label class="radiobutton__label">
									Silver Membership
								</ion-label>

								<ion-text class="radiobutton__cost"
									>$149.99
									<span>
										/per location
									</span>
								</ion-text>
								<ul>
									<li
										class="accessibility"
									>
										<div>
											<ion-icon src="assets/icon/accessibility.svg" />
										</div>
										<div>
											<ion-text>All Bronze features +</ion-text>
										</div>
									</li>
									<li
										class="accessibility"
									>
										<div>
											<ion-icon src="assets/icon/accessibility.svg" />
										</div>
										<div>
											<ion-text>List unlimited offerings on the Network profile</ion-text>
										</div>
									</li>
									<li
										class="accessibility"
									>
										<div>
											<ion-icon src="assets/icon/accessibility.svg" />
										</div>
										<div>
											<ion-text>Reduced flat booking fee</ion-text>
										</div>
									</li>
									<li
										class="accessibility"
									>
										<div>
											<ion-icon src="assets/icon/accessibility.svg" />
										</div>
										<div>
											<ion-text>15% flat fee for each transaction</ion-text>
										</div>
									</li>
								</ul>
							</div>
						</div>
						<ion-radio :value="5" slot="end"></ion-radio>
					</ion-item>
				</ion-radio-group>
			</div>
			<div class="checkbox">
				<ion-checkbox
					mode="ios"
					:modelValue="isAgreed"
					@update:modelValue="isAgreed = $event"
				>
				</ion-checkbox>
				<ion-label>
					I confirm that I read and accept 
					<a
						href='https://app.termly.io/document/privacy-policy/90cdb569-0bff-4241-9edd-7d3584f78bfc'
					>Privacy Policy</a>
					and
					<a
						href='https://app.termly.io/document/privacy-policy/90cdb569-0bff-4241-9edd-7d3584f78bfc'
					>Terms of Use</a>
				</ion-label>
			</div>
			<div class="buttons">
				<ion-button
					expand="block"
					@click="handleContinue"
					:disabled="!isAgreed || isLoading || !selectedProductId"
				>
					Next
				</ion-button>
			</div>
		</div>
	</div>
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
import { clearAuthItems } from "@/router/middleware/auth";
import {
  MeDocument,
  PlansDocument,
  RoleEnum,
  SubscriptionProvidersEnum,
  SubscriptionsTypeEnum,
} from "@/generated/graphql";

const router = useRouter();

const onBack = () => {
	router.push({
    name: EntitiesEnum.StartMembership,
  });
};

const isLoading = ref<boolean>(false);
const { role } = useRoles();
const plans = ref<any[]>([]);
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
          subscriptionPlan:
            subscriptionPlan.length && subscriptionPlan[0]?.is_active
              ? subscriptionPlan[0]
              : {},
        });
      }
      return acc;
    }, []);
    // await registerProducts();
  });
});
// Get the real product information
const registerProducts = async () => {
  // plans.value.forEach((plan) => {
  // });
};

const handleContinue = () => {
  isLoading.value = true;
	console.log(selectedItem.value);
	const { mutate: createSubscriptionIntent } = backendStripe.createSubscriptionIntent();
  createSubscriptionIntent({
    product_id: selectedItem.value.product_id,
    fees_percent: selectedPlan.value.fee,
  })
    .then((data) => {
      console.log("data==>", data)
      let intent = JSON.parse(data?.data?.createSubscriptionIntent?.session);
      backendStripe.redirectToCheckout(intent.id);
    })
    .catch((err) => {
      errorMessage.value = err;
      throw new Error(err);
    });
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

const onCardCreation = async () => {
  const { onResult } = backendStripe.createSetupIntent();
  onResult((setupIntentResult) => {
    let intent = JSON.parse(setupIntentResult?.data?.setupIntent?.session);
    backendStripe.redirectToCardSaving(intent.id, intent.url);
  });
};

const onLogout = () => {
  clearAuthItems();
  router.push({ name: EntitiesEnum.Login });
};

</script>

<style scoped lang="scss">
.header {
	padding: 10px 0;
	border-bottom: 1px solid var(--fitnesswhite);
	.logo {
		width: 13.75rem;
		min-width: 60px;
	}
}
.back {
	color: var(--gold);
	font-size: 1.5rem;
	font-style: normal;
	font-weight: 400;
	line-height: 130%;
}
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
	.radiobutton {
		max-width: 340px;
		--min-height: 100%;
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
		--inner-height: 100%;
		--background: var(--gray-700);
		--border-width: 0.8px;
		--border-style: solid;
		--border-color: var(--gray-600);
	
		&:not(:last-child) {
			margin-bottom: 16px;
		}
	
		&.item-radio-checked {
			--color: var(--ion-color-white);
			--border-color: var(--ion-color-primary);
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
			height: 100%;
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

.buttons {
	margin-top: 1rem;
	width: 40%;
  .button {
    margin: 0;
    text-align: center;
    font-family: Lato;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;

    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}
.checkbox {
  display: flex;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  margin-bottom: 12px;
  align-items: center;
  justify-content: flex-start;
  color: var(--ion-color-secondary);

  ion-checkbox {
    --size: 20px;
    flex-shrink: 0;
    --border-width: 1px;
    margin: 0 10px 0 2px;
    --border-color: var(--ion-color-primary);
  }

  ion-label {
    margin: 0;
    white-space: normal;
  }
}
</style>
 