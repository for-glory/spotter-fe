<template>
  <base-layout>
    <template #content>
      <ion-spinner
        v-if="loading || plansLoading"
        name="lines"
        class="spinner"
      />
      <div class="membership" v-else>
        <ion-radio-group class="plans" v-model="selectedPlanId">
          <ion-slides 
            ref="slide"
          >
            <ion-slide
              v-for="plan in plans"
              :key="plan.id"
            >
              <ion-item
                lines="none"
                class="radiobutton"
                @click="selectMembership(plan.id)"
              >
                <div class="radiobutton__block">
                  <div class="radiobutton__icon">
                    <ion-icon src="assets/icon/medal.svg" 
                      :class="plan.tier === 'BRONZE' ? 'bronze' : plan.tier === 'SILVER' ? 'silver' : 'gold'" 
                    />
                  </div>
                  <div class="radiobutton__description">
                    <ion-label class="radiobutton__label">
                      {{ plan.title }}
                    </ion-label>

                    <ion-text class="radiobutton__cost"
                      >${{ plan.prices[0].price / 100 }}
                      <span>
                        /{{ plan.tier === 'GOLD' ? 'for first location' : 'per location'}}
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
                <ion-radio :value="4" slot="end"></ion-radio>
              </ion-item>
            </ion-slide>
          </ion-slides>
          <ion-icon class="prev" src="assets/icon/arrow-back.svg" @click="prev"></ion-icon>
          <ion-icon class="next" src="assets/icon/arrow-next.svg" @click="next"></ion-icon>
        </ion-radio-group>
        <div class="membership-buttons">
          <ion-button id="change" @click="onChangeMembership">Change Membership</ion-button>
          <ion-button id="cancel" >Cancel Membership</ion-button> 
        </div>
      </div>
    </template>
  </base-layout>
  <change-membership ref="changeMembershipModal" @cancel="cancelChangeMembership"/>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonText,
  IonItem,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonIcon,
  isPlatform,
  IonSpinner,
  onIonViewDidLeave,
  IonCheckbox,
  IonSlide,
  IonSlides
} from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRouter, useRoute } from "vue-router";
import { useLazyQuery, useQuery } from "@vue/apollo-composable";
import {
  MeDocument,
  PlansDocument,
  RoleEnum,
  SubscriptionProvidersEnum,
  SubscriptionsTypeEnum,
} from "@/generated/graphql";
import useId from "@/hooks/useId";
import { ref, onMounted } from "vue";
import useRoles from "@/hooks/useRole";
import { computed } from "@vue/reactivity";
import { InAppPurchase2, IAPProduct } from "@ionic-native/in-app-purchase-2";
import dayjs from "dayjs";
import { Browser } from "@capacitor/browser";
import { setAuthItemsFromMe } from "@/router/middleware/auth";
import useSubscription from "@/hooks/useSubscription";
import { Capacitor } from '@capacitor/core';
import { EntitiesEnum } from "@/const/entities";
import ChangeMembership from "@/general/components/modals/confirmations/ChangeMembership.vue"

const router = useRouter();
const route = useRoute();
const selectedItem = ref<any>({});
const { role } = useRoles();
const { id } = useId();
const plans = ref<any[]>([]);
const errorMessage = ref("");
const products = ref<any[]>([]);
const selectedPlanId = ref<string | number | boolean | undefined>(undefined);
const isAgreed = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const slide = ref<typeof IonSlides | null>();
const currentPlan = ref<any>();
const { type: currentSubscriptionType } = useSubscription();
const changeMembershipModal = ref<typeof ChangeMembership | null>(null);

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
  InAppPurchase2.validator =
    process.env.VUE_APP_IAP_RECEIPT_VALIDATION_URL + `/${id}`;
  // InAppPurchase2.validator = validationUrl;
  InAppPurchase2.applicationUsername = () => id;

  onPlansResult(async ({ data }) => {
    plans.value = data?.plans?.data.reduce((acc: any[], cur: any) => {
      if (cur.is_active) {
        const subscriptionPlan = cur.subscriptionPlans.filter(
          (i: any) => i.provider === getPlatform()
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
    // currentPlan.value = plans.value.filter((plan) => plan.tier.toLowerCase() === currentSubscriptionType.toLowerCase());
    currentPlan.value = plans.value.filter((plan) => plan.tier.toLowerCase() === "silver" && plan);
    console.log({currentPlan});
    InAppPurchase2.ready(() => {
      products.value = InAppPurchase2.products;
      console.log("set up listeners after ready");
    });
    await registerProducts();
  });
});
// Get the real product information
const registerProducts = async () => {
  plans.value.forEach((plan) => {
    InAppPurchase2.register({
      id: plan.subscriptionPlan.product_id,
      type: InAppPurchase2.PAID_SUBSCRIPTION,
    });
  });
  setupListeners();
  InAppPurchase2.refresh();
};
onIonViewDidLeave(() => {
  InAppPurchase2.off(approvedEvent);
  InAppPurchase2.off(verifiedEvent);
  InAppPurchase2.off(errorEvent);
  InAppPurchase2.off(updatedEvent);
  InAppPurchase2.off(ownedEvent);
});

const updatedEvent = (data: any) => {
  console.log(data);
  plans.value.forEach((plan) => {
    const product = InAppPurchase2.get(plan.subscriptionPlan.product_id) || {};
    if (!plan?.subscriptionPlan?.product_id === product.id) {
      return;
    }
    plan.title = product.title;
    plan.state = product.state;
    plan.price = product.price;
    plan.description = product.description;
    plan.expiryDate = product.expiryDate;
    plan.canPurchase = product.canPurchase;
    plan.owned = product.owned;
    plan.billingPeriodUnit = product.billingPeriodUnit;
  });
};

const approvedEvent = async (p: IAPProduct) => {
  p.verify();
};

const verifiedEvent = (p: IAPProduct) => {
  p.finish();
};
const ownedEvent = (p: IAPProduct) => {
  plans.value.forEach((plan: any) => {
    if (!plan?.subscriptionPlan?.product_id === p.id) {
      return;
    }
    const product = p;
    plan.title = product.title;
    plan.state = product.state;
    plan.price = product.price;
    plan.description = product.description;
    plan.expiryDate = product.expiryDate;
    plan.canPurchase = product.canPurchase;
    plan.owned = product.owned;
    plan.billingPeriodUnit = product.billingPeriodUnit;
    if (plan.owned && dayjs(plan.expiryDate).isAfter(dayjs())) {
      let fullplan = plans.value.find(
        (plan: any) => product.id === plan.subscriptionPlan.product_id
      );
      selectedPlanId.value = fullplan?.id;
      setTimeout(() => {
        getMyProfile();
      }, 1000);
    }
  });
};
const errorEvent = (error: any) => {
  console.log(`${error.code}: ${error.message}`);
};
const setupListeners = async () => {
  InAppPurchase2.when().updated(updatedEvent);
  InAppPurchase2.when().approved(approvedEvent);
  InAppPurchase2.when().verified(verifiedEvent);
  InAppPurchase2.when().owned(ownedEvent);

  InAppPurchase2.error(errorEvent);
};
const purchase = () => {
  isLoading.value = true;
  if (Capacitor.isNativePlatform()) {
    InAppPurchase2.order(selectedItem.value)
      .then(() => {
        isLoading.value = false;
        console.log(
          "entered into Apple/Google pop up with the purchase confirmation"
        );
      })
      .error((error: any) => {
        isLoading.value = false;
        errorMessage.value = `Failed to purchase: ${error}`;
      });
  } else {
    console.log('Web platform', selectedItem.value);
    router.push({
      name: EntitiesEnum.SubscriptionPaymentMethod,
      params: { subscriptionId: selectedItem.value.product_id },
      query: {
          facilityId: route?.query?.facilityId || "",
        },
    });
  }
};

const selectProduct = (plan: any) => {
  if (Capacitor.isNativePlatform()) {
    selectedItem.value = InAppPurchase2.products
      .filter((value) => {
        return value.id === plan.subscriptionPlan.product_id;
      })
      .pop();
  } else {
    console.log('Web platform');
    console.log('plan.subscriptionPlan', plan.subscriptionPlan);
    selectedItem.value = plan.subscriptionPlan
  }
};

const {
  loading,
  load: getMyProfile,
  onResult: gotMyProfile,
} = useLazyQuery(MeDocument, {
  fetchPolicy: "no-cache",
});

gotMyProfile(({ data }) => {
  if (data.me.currentSubscription !== currentSubscriptionType) {
    setAuthItemsFromMe(data.me);
    onBack();
  }
});
const getPlatform = () => {
  if (Capacitor.isNativePlatform()) {
    if (isPlatform("android")) {
      return SubscriptionProvidersEnum.Google;
    }
    if (isPlatform("ios")) {
      return SubscriptionProvidersEnum.Apple;
    }
  } else {
    return SubscriptionProvidersEnum.Web;
  }
  
};

const onBack = () => {
  router.go(-1);
};

const prev = () => {
	slide.value?.$el.slidePrev();
}
const next = () => {
	slide.value?.$el.slideNext();
}


const showAgreement = async (url: string) => {
  await Browser.open({ url });
};

const onChangeMembership = () => {
  changeMembershipModal.value?.present();
}
</script>

<style scoped lang="scss">

.plans {
	display: flex;
	justify-content: center;
	gap: 1rem;
	margin-top: 1rem;
	position: relative;
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
	
			// .radiobutton:nth-last-child(1) & {
			// 	color: var(--ion-color-primary);
			// }
	
			// .radiobutton:nth-last-child(2) & {
			// 	color: var(--ion-color-medium);
			// }
	
			// .radiobutton:nth-last-child(3) & {
			// 	color: var(--bronze);
			// }
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
		.radiobutton {
			width: 80%;
			max-width: unset;
		}
	}
}

.prev {
	position: absolute;
	left: 0;
	top: calc(50% - 12px);
	width: 24px;
	height: 24px;
	z-index: 10;
}
.next {
	position: absolute;
	right: 0;
	top: calc(50% - 12px);
	width: 24px;
	height: 24px;
	z-index: 10;
}

.plan-tablet {
	@media (max-width: 992px) {
		flex-direction: column;
		align-items: center;
	}
}
.membership {
  padding: 24px;
  margin-top: 64px;

  .membership-buttons {
    padding-top: 48px;

    ion-button#change {
      --background: var(--beige);
      --border-radius: 12px;
      --color: #000000;
      font: 700 16px/1 var(--ion-font-family);
    }
    ion-button#cancel {
      --background: #DBB582;
      --border-radius: 12px;
      --color: var(--gray-700);
      font: 700 16px/1 var(--ion-font-family);
    }
  }
}

.radiobutton {
  font-size: 14px;
  line-height: 1.5;
  --min-height: 48px;
  --padding-top: 0;
  --border-radius: 8px;
  --padding-bottom: 8px;
  --border-radius: 4px;
  --color: var(--ion-color-medium);
  --inner-padding-top: 12px;
  --inner-padding-bottom: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  --background: var(--gray-700);
  --padding-start: var(--container-offset);
  --padding-end: var(--container-offset);
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
    display: flex;
  }

  &__icon {
    width: 48px;
    height: 48px;
    display: flex;
    flex-shrink: 0;
    line-height: 1;
    font-size: 24px;
    border-radius: 4px;
    margin-right: 12px;
    align-items: center;
    justify-content: center;
    color: var(--ion-color-white);
    box-shadow: inset 0 0 0 0.8px var(--gray-600);

    .radiobutton:nth-last-child(1) & {
      color: var(--ion-color-primary);
    }

    .radiobutton:nth-last-child(2) & {
      color: var(--ion-color-medium);
    }

    .radiobutton:nth-last-child(3) & {
      color: var(--bronze);
    }
  }

  &__description {
    flex: 1 1 auto;
  }

  &__label {
    margin-right: 8px;
    font-weight: 500;
    font-size: 16px;
    margin-bottom: 3px;
    --color: var(--ion-color-white);
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
      }
    }

    ion-icon {
      font-size: 10px;
      margin-right: 6px;
    }
  }
}

.holder-button {
  backdrop-filter: blur(10px);
  background: rgba(var(--ion-color-gray-900-rgb), 0.88);
  padding: 8px 24px calc(8px + var(--ion-safe-area-top));

  .button {
    margin: 0;
  }
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
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
