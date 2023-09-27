<template>
  <base-layout :hide-navigation-menu="role !== RoleEnum.User ? true : false ">
    <template #header>
      <page-header back-btn @back="onBack" title="Payment methods">
        <template #custom-btn>
          <ion-button fill="clear" class="edit-btn" @click="toggleMode">
            {{ editMode ? "Done" : "Edit" }}
          </ion-button>
        </template>
      </page-header>
    </template>
    <template #content>
      <div class="cards">
        <div class="cards__container" v-if="cards.length">
          <base-carousel
            show-start
            :items="cards"
            :slides-offset-after="16"
            :slides-offset-before="16"
          >
            <template #start>
              <ion-button
                v-if="!editMode"
                @click="onCardCreation"
                class="add-card"
              >
                <ion-icon src="assets/icon/payment/plus.svg" class="add-icon" />
              </ion-button>
            </template>
            <template v-slot:default="cards">
              <card
                v-for="card in cards"
                :deletable="editMode"
                :key="card.id"
                :card-holder="card.card_holder"
                :card-number="card.pm_last_four"
                :exp-date="card.exp_month + '/' + card.exp_year"
                :is-default="card.is_default"
                class="card-slide"
                @delete="onDelete(card.id)"
                @click="changePaymentMethod(card.id)"
              />
            </template>
          </base-carousel>
        </div>
        <template v-else>
          <add-card-button class="add-card-btn" @click="onCardCreation" />
        </template>
      </div>
      <template v-if="role !== RoleEnum.User">
        <div v-if="!editMode" class="separator">
          <ion-text class="optional">or other payment methods</ion-text>
        </div>
        <div v-if="!editMode" class="payment__methods">
          <!-- @click="handleAdditionalPaymentMethod(paymentMethod.key)" -->
          <payment-method icon="paypal" title="PayPal" />
        </div>
      </template>
    </template>

    <template  #footer>
      <buttons-footer main-button-text="Confirm"/>
    </template>
  </base-layout>
  <confirmation
    :is-visible="showConfirmationModal"
    title="Do you want to delete this card?"
    description="Card will be permanently deleted"
    button-text="Delete card"
    @discard="onCardDeletionConfirmed"
    @decline="hideModal"
  />
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import ButtonsFooter from "@/general/components/blocks/footers/ButtonsFooter.vue";
import { IonText, IonButton, IonIcon } from "@ionic/vue";
import PaymentMethod from "@/general/components/blocks/payment/PaymentMethod.vue";
import { ref, onMounted, onUnmounted } from "vue";
import Card from "@/general/components/blocks/payment/Card.vue";
import BaseCarousel from "@/general/components/base/BaseCarousel.vue";
import { useRouter } from "vue-router";
import { BackendStripe } from "@/services/stripe/stripe";
import AddCardButton from "@/general/components/blocks/payment/AddCardButton.vue";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";
import {
  StripeCardsDocument,
  StripeCardsQuery,
  StripeCard,
  DetachCardDocument,
RoleEnum,
} from "@/generated/graphql";
import { useMutation, useQuery } from "@vue/apollo-composable";
import useRoles from "@/hooks/useRole";

const router = useRouter();
const errorMessage = ref("");
const editMode = ref(false);
const cards = ref<StripeCard[]>([]);
const curCartId = ref("");
const interval = ref(null);
const { role } = useRoles();

const backendStripe = new BackendStripe(
  process.env.VUE_APP_STRIPE_PUBLIC_KEY || ""
);

onUnmounted(() => {
  clearInterval(interval.value);
});

onMounted(() => {
  refetch();

  backendStripe.init();

  interval.value = setInterval(() => {
    refetch();
  }, 5000);
});

const { onResult, refetch } = useQuery<StripeCardsQuery>(StripeCardsDocument, {
  fetchPolicy: "no-cache",
});
const { mutate: changeCard } = backendStripe.changePaymentMethod();

const { mutate: deleteCartMutate } = useMutation(DetachCardDocument);

onResult(({ data }) => {
  if (data?.cards?.data) {
    cards.value = data.cards.data;
  }
});

const onCardDeletionConfirmed = () => {
  deleteCartMutate({ card_id: curCartId.value }).then(() => {
    refetch();
  });
  hideModal();
};

const { showConfirmationModal, showModal, hideModal } = useConfirmationModal();

const onCardCreation = async () => {
  const { onResult } = backendStripe.createSetupIntent();
  onResult((setupIntentResult) => {
    let intent = JSON.parse(setupIntentResult?.data?.setupIntent?.session);
    backendStripe.redirectToCardSaving(intent.id, intent.url);
  });
};

const changePaymentMethod = (cardId: number) => {
  changeCard({ card_id: cardId })
    .then(() => {
      refetch();
    })
    .catch((err) => {
      errorMessage.value = err;
      throw new Error(err);
    });
};

const toggleMode = () => {
  editMode.value = !editMode.value;
};

const onBack = () => {
  router.go(-1);
};

const onDelete = (id: string) => {
  if (editMode.value) {
    curCartId.value = id;
    showModal();
  }
};
</script>
<style scoped lang="scss">
.optional {
  font-weight: 300;
  font-size: 14px;
  line-height: 150%;
  color: var(--gray-500);
}

.payment__methods {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px 24px;
}

.separator {
  display: flex;
  justify-content: center;
}

.submit-btn {
  width: 100%;
}

.cards {
  margin: 24px 0;

  &__container {
    height: 170px;
    display: flex;
    padding-right: 10px;
  }

  &__title {
    font-family: "Yantramanav", serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    color: var(--ion-color-white);
    margin-bottom: 12px;
    padding: 0 16px;
  }
}

.add-card {
  height: 170px;
  --padding-start: 16px;
  --padding-end: 16px;
  --background: var(--gray-700);
  --box-shadow: none;
  color: var(--ion-color-white);
  margin: 0;
}

.add-icon {
  font-size: 16px;
}

.card-slide {
  width: calc(100vw - 90px);
}

.edit-btn {
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;
  margin: 0 -8px 0 0;
  --border-radius: 4px;
  --padding-start: 8px;
  --padding-end: 8px;
  --color: var(--ion-color-white);
}

.add-card-btn {
  margin: 18px 24px;
}
</style>
