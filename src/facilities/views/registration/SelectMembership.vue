<template>
  <div class="scrolled-page">
    <ion-grid :fixed="true">
      <div>
        <ion-spinner v-if="plansLoading" name="lines" class="spinner" />
        <div class="content" v-else>
          <div class="plan">
            <ion-title class="font-medium white-text" color="primary">
              Start with 30 days free trial
            </ion-title>
            <ion-title class="font-large" color="primary">
              Choose your plan
            </ion-title>
            <div class="plan-features">
              <div class="plan-features__item font-small">
                <ion-icon src="assets/icon/check-mark.svg" color="primary" />
                <ion-text>All Features</ion-text>
              </div>
              <div class="plan-features__item font-small">
                <ion-icon src="assets/icon/check-mark.svg" color="primary" />
                <ion-text>Other Features</ion-text>
              </div>
              <div class="plan-features__item font-small">
                <ion-icon src="assets/icon/check-mark.svg" color="primary" />
                <ion-text>Premium Access</ion-text>
              </div>
            </div>
          </div>
          <div class="membership w-100">
            <ion-radio-group class="plans" v-model="selectedPlanId">
              <ion-item
                lines="none"
                class="radiobutton"
                v-for="plan in plans"
                :key="plan.id"
                @click="selectMembership(plan.id)"
                :class="{
                  'item-radio-checked':
                    plan.owned && dayjs(plan.expiryDate).isAfter(dayjs()),
                }"
                :disabled="
                  plan.owned && dayjs(plan.expiryDate).isAfter(dayjs())
                "
              >
                <div class="radiobutton__block">
                  <div class="radiobutton__icon">
                    <ion-icon
                      src="assets/icon/medal.svg"
                      :class="
                        plan?.tier === 'BRONZE'
                          ? 'bronze'
                          : plan?.tier === 'SILVER'
                          ? 'silver'
                          : 'gold'
                      "
                    />
                  </div>
                  <div class="radiobutton__description">
                    <ion-label class="radiobutton__label">
                      {{ plan.title }}
                      <span
                        class="status-text"
                        v-if="
                          currentPlan?.tier.toLowerCase() ===
                            plan?.tier.toLowerCase() || plan?.tier === 'GOLD'
                        "
                      >
                        {{
                          currentPlan?.tier.toLowerCase() ===
                          plan?.tier.toLowerCase()
                            ? "Current"
                            : plan?.tier === "GOLD"
                            ? "TOP"
                            : ""
                        }}
                      </span>
                    </ion-label>

                    <ion-text class="radiobutton__cost font-small">
                      ${{ plan?.prices[0].price / 100 }}
                      <span class="font-mini">
                        /{{
                          plan?.tier === "GOLD"
                            ? "for first location"
                            : "per location"
                        }}
                      </span>
                    </ion-text>
                    <ul>
                      <li
                        class="accessibility d-flex align-items-center"
                        v-for="(benefit, idx) in plan?.benefits"
                        :key="idx"
                      >
                        <ion-icon src="assets/icon/accessibility.svg" />
                        <span>{{ benefit?.description }}</span>
                      </li>
                      <!-- TODO add inaccessible features -->
                      <!-- <li>
												<ion-icon src="assets/icon/inaccessible.svg" />
												Top Features
											</li> -->
                    </ul>
                  </div>
                </div>
                <ion-radio :value="plan.id" slot="end"></ion-radio>
              </ion-item>
            </ion-radio-group>
          </div>
          <div class="buttons">
            <ion-button
              @click="handleContinue"
              :disabled="isLoading || !selectedProductId"
            >
              Continue
            </ion-button>
          </div>
        </div>
      </div>
    </ion-grid>
  </div>
</template>

<script setup lang="ts">
import {
  IonSlides,
  IonSlide,
  IonTitle,
  IonText,
  IonCheckbox,
  IonLabel,
  IonImg,
  IonButton,
  IonIcon,
  IonGrid,
  IonRadioGroup,
  IonItem,
  IonRadio,
  IonSpinner,
  isPlatform,
} from "@ionic/vue";
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
import { InAppPurchase2, IAPProduct } from "@ionic-native/in-app-purchase-2";
import { Capacitor } from "@capacitor/core";

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
  });
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

const handleContinue = () => {
  isLoading.value = true;
  console.log(selectedItem.value);
  // onCardCreation();
  // router.push({
  // 	name: EntitiesEnum.SubscriptionPaymentMethod,
  // 	params: { subscriptionId: selectedItem.value.product_id },
  // 	query: {
  // 			// facilityId: route?.query?.facilityId || "",
  // 		},
  // });
  const { mutate: createSubscriptionIntent } =
    backendStripe.createSubscriptionIntent();
  createSubscriptionIntent({
    product_id: selectedItem.value.product_id,
    fees_percent: selectedPlan.value.fee,
  })
    .then((data) => {
      console.log("data==>", data);
      let intent = JSON.parse(data?.data?.createSubscriptionIntent?.session);
      backendStripe.redirectToCheckout(intent.id);
    })
    .catch((err) => {
      errorMessage.value = err;
      throw new Error(err);
    });
};
const selectMembership = (id: any) => {
  plans.value.forEach((plan: any) => {
    if (plan.id == id) {
      console.log(plan);
      selectedPlan.value = plan;
      selectedItem.value = plan.subscriptionPlan;
      selectedProductId.value = plan.subscriptionPlan.product_id;
    }
  });
};

const onLogout = () => {
  clearAuthItems();
  router.push({ name: EntitiesEnum.Login });
};
</script>

<style scoped lang="scss">
.membership {
  padding: 24px;
}

@media (max-width: 992px) {
  .membership {
    padding: 0px;
  }
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 32px 24px calc(32px + var(--ion-safe-area-bottom));
  min-height: calc(100% - 337px - var(--ion-safe-area-top));
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
      width: 100%;
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
  border-radius: 8px;
  background: #e1dbc5;
  width: 80%;
  @media (max-width: 992px) {
    width: 100%;
  }
  ion-button {
    @media (max-width: 992px) {
      width: 99%;
    }
    text-align: center;
    background: #e1dbc5;
    color: var(--dark-grey, #262626);
    text-align: center;
    font-family: Lato;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%; /* 20.8px */
    --border-radius: 12px;
  }
}
.font-large {
  font: 500 40px/1 Lato;
}
.font-medium {
  font: 500 20px/1 Lato;
}
.font-small {
  font: 500 14px/1 Lato;
}
.font-mini {
  font: 500 12px/1 Lato;
}
.status-text {
  color: var(--gray-700);
  background-color: #e1dbc5;
  border-radius: 20px;
  font: 500 12px/1 Lato;
  padding: 2px 9px 2px 9px;
}
</style>
