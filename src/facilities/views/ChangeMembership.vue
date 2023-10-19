<template>
  <base-layout>
    <template #header>
      <page-header back-btn title="Change Membership" @back="onBack" />
    </template>
    <template #content>
      <ion-spinner
        v-if="loading || plansLoading || subscriptionUserLoading"
        name="lines"
        class="spinner"
      />
      <div class="membership" v-else>
        <ion-radio-group v-model="selectedPlanId">
          <ion-item
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
            <div class="content d-flex">
            <!-- <div class="radiobutton__block"> -->
              <div class="radiobutton__icon">
                <ion-icon src="assets/icon/medal.svg" 
                  :class="plan?.tier === 'BRONZE' ? 'bronze' : plan?.tier === 'SILVER' ? 'silver' : 'gold'"
                />
              </div>
              <div class="radiobutton__description">
                <ion-label class="radiobutton__label">
                  {{ plan.title }}
                  <span class="status-text" v-if="currentPlan?.tier.toLowerCase() === plan?.tier.toLowerCase() || plan?.tier === 'GOLD'">
                    {{currentPlan?.tier.toLowerCase() === plan?.tier.toLowerCase() ? 'Current' : plan?.tier === 'GOLD' ? 'TOP' : '' }}
                  </span>
                </ion-label>

                <ion-text class="radiobutton__cost"
                  >${{ plan?.prices[0].price / 100 }}
                  <span v-if="role !== RoleEnum.Trainer">
                    /{{ plan?.tier === 'GOLD' ? 'for first location' : 'per location'}}
                  </span>
                  <span class="plan-unit" v-else-if="role === RoleEnum.Trainer">
                      /per month
                  </span>
                </ion-text>
                <ul>
                  <li
                    class="accessibility"
                    v-for="(benefit, idx) in plan?.benefits"
                    :key="idx"
                  >
                    <ion-icon src="assets/icon/accessibility.svg" />
                    {{ benefit?.description }}
                  </li>
                  <!-- TODO add inaccessible features -->
                  <!-- <li>
                    <ion-icon src="assets/icon/inaccessible.svg" />
                    Top Features
                  </li> -->
                </ul>
            <div class="short-note" v-if="currentSubscription === plan?.tier">
              * Short “workout of the day” videos Trainers can post for Clients/Users to purchase and download
            </div>
              </div>
            </div>
            <ion-radio :value="plan.id" slot="end"></ion-radio>
          </ion-item>
        </ion-radio-group>
      </div>
    </template>
    <template #footer>
      <div class="holder-button">
        <div class="checkbox" v-if="role !== RoleEnum.Trainer && role !== RoleEnum.FacilityOwner">
          <ion-checkbox
            mode="ios"
            :modelValue="isAgreed"
            @update:modelValue="isAgreed = $event"
          >
          </ion-checkbox>
          <ion-label>
            I confirm that I read and accept
            <ion-text
              @click.stop="
                showAgreement(
                  'https://app.termly.io/document/privacy-policy/90cdb569-0bff-4241-9edd-7d3584f78bfc'
                )
              "
              color="primary"
            >
              Privacy Policy
            </ion-text>
            and
            <ion-text
              @click.stop="
                showAgreement(
                  'https://app.termly.io/document/terms-of-use-for-saas/60ed2ae3-4eee-4617-b3d7-957ac10623b7'
                )
              "
              color="primary"
            >
              Terms of Use
            </ion-text>
          </ion-label>
        </div>
        <ion-button
          expand="block"
          @click="handleChange"
        >
          <ion-spinner name="lines" v-if="isLoading"></ion-spinner>
          <template v-else>Continue</template>
        </ion-button>
      </div>
      <div>
        {{ errorMessage }}
      </div>
    </template>
  </base-layout>
  <change-membership
    :is-visible="showChangeConfirmModal"
		:currentPlan="currentPlan"
		:newPlan="selectedPlan"
    @confirm="handleChangeMembership"
    @cancel="hideChangeModal"
  />
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
} from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRouter, useRoute } from "vue-router";
import { useLazyQuery, useQuery, useMutation } from "@vue/apollo-composable";
import {
  MeDocument,
  PlansDocument,
  RoleEnum,
  SubscriptionProvidersEnum,
  SubscriptionsTypeEnum,
  UpdateSubscriptionDocument,
  SubscriptionUserDocument,
} from "@/generated/graphql";
import {
  Stripe as capacitorStripe,
  ApplePayEventsEnum,
  GooglePayEventsEnum,
} from "@capacitor-community/stripe";
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
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import { useFacilityStore } from "@/general/stores/useFacilityStore";

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
const currentPlan = ref<any>();
const currentStripeSubscription = ref<any>();
const changeMembershipModal = ref<typeof ChangeMembership | null>(null);
const currentFacility = useFacilityStore();
const selectedPlan = ref<any>({});
const VUE_APP_STRIPE_PUBLIC_KEY = process.env.VUE_APP_STRIPE_PUBLIC_KEY;

const {
  showConfirmationModal: showChangeConfirmModal,
  hideModal: hideChangeModal,
  showModal: showChangeModal
} = useConfirmationModal();

const { currentSubscription } = useSubscription();
console.log("currentPlan", currentSubscription);

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
const { loading: subscriptionUserLoading, onResult } = useQuery(
  SubscriptionUserDocument,
  {
    facility_id: currentFacility.facility?.id,
    unique_identifier: currentStripeSubscription?.value?.unique_identifier,
  }
);

onResult(({ data }) => {
  currentStripeSubscription.value = data?.subscriptionUser;

  if (!data?.subscriptionUser) {
    router.push({
      name: EntitiesEnum.StartMembership,
    });
  }
});

onMounted(async () => {
  InAppPurchase2.validator =
    process.env.VUE_APP_IAP_RECEIPT_VALIDATION_URL + `/${id}`;
  // InAppPurchase2.validator = validationUrl;
  InAppPurchase2.applicationUsername = () => id;

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
    currentPlan.value = plans.value.filter((plan) => plan.tier.toLowerCase() === currentSubscriptionType.toLowerCase() && plan)[0];
    selectedPlanId.value = currentPlan.value.id;
    InAppPurchase2.ready(() => {
      products.value = InAppPurchase2.products;
      console.log("set up listeners after ready");
    });
    if (Capacitor.isPluginAvailable("Stripe")) {
      console.log("PUBLIC KEY==>>>>", VUE_APP_STRIPE_PUBLIC_KEY)
      debugger;
      capacitorStripe.initialize({
        publishableKey: VUE_APP_STRIPE_PUBLIC_KEY,
      })
    }
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

const selectMembership = () => {
  plans.value.forEach((plan: any) => {
    if (plan.id == selectedPlanId.value) {
      console.log("SelectedMembership=>>>>", plan)
      selectedPlan.value = plan
      selectedItem.value = plan.subscriptionPlan
    }
  });
}

const handleChange = () => {
  selectMembership()
  showChangeModal();
};

const {
  mutate: updateSubscription,
  onDone: updatedSubscription,
  loading: updateLoading,
} = useMutation(UpdateSubscriptionDocument);

const handleChangeMembership = () => {
  hideChangeModal();
  console.log("************Change Membership********");
  updateSubscription({
    unique_identifier: currentStripeSubscription.value.unique_identifier,
    new_product_id: selectedItem.value.product_id,
    fees_percent: selectedPlan.value.fee,
    facility_id: currentFacility.facility?.id
  }).then(async (data) => {
    console.log("data==>", data)
    let intent = JSON.parse(data?.data?.updateSubscription?.session);
    console.log("session id=>>>", intent.id)
    await capacitorStripe.createPaymentSheet({
      paymentIntentClientSecret: intent.id,
      merchantDisplayName: "Inclusive Innovation Incubator",
    });
    const { paymentResult } = await capacitorStripe.presentPaymentSheet();
    console.log("paymentResutl===>", paymentResult);
  })
    .catch((err) => {
      throw new Error(err);
    });
};

const selectProduct = (plan: any) => {
  console.log("selectedPlanId", selectedPlanId.value);
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

const { type: currentSubscriptionType } = useSubscription();
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

const showAgreement = async (url: string) => {
  await Browser.open({ url });
};
</script>

<style scoped lang="scss">
.membership {
  padding: 24px;
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

    .gold {
      color: var(--new-gold);
    }

    .silver {
      color: var(--silver);
    }

    .bronze {
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
        font-family: "Lato";
        font-size: 10px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%;
        margin: 8px 0px;
        display: flex;
      }
    }

    ion-icon {
      font-size: 14px;
      margin-right: 8px;
      margin-bottom: -4px;
    }
  }
}

.status-text {
  font-family: "Lato";
  color: var(--gray-700);
  background-color: #E1DBC5;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 500;
  padding: 3px 8px;
  margin-left: 11px;
  line-height: 150%;
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

.plan-unit {
  font-family: "Lato";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
}

.short-note {
  font-family: "Lato";
  font-size: 10px;
  font-style: italic;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.60);
}
</style>
