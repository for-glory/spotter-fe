<template>
  <base-layout
    :full-width-footer="false"
    :header-fixed="false"
    :content-full-height="false"
  >
    <template #header>
      <page-header
        @back="onBack"
        back-btn
        title="My Order"
        class="page-header"
      />
    </template>
    <template #content>
      <ion-spinner name="lines" class="spinner" v-if="loading" />
      <template v-else>
        <div class="order">
          <order-item
            :type="EntitiesEnum.Trainer"
            :item="trainer"
            :hourly-rate="store.price"
            :orderDate="store.date"
            :orderTime="store.time"
            :is-mobile="isMo"
          />
        </div>
        <div :class="['training-place__container', { 'user-place__container': role === RoleEnum.User  }]" v-if="showChoosePlace">
          <ion-text class="training-place__title">
            Choose place of training session
          </ion-text>
          <choose
            :value="store?.place?.text"
            title="Place"
            @handle-click="onChoosePlace"
            class="training-place__info"
          />
        </div>
      </template>
    </template>
    <template #footer>
      <ion-button
        @click="confirmOrder"
        :class="['submit-btn', { 'native-app': role === RoleEnum.User }]"
        :disabled="disabled || addToCartLoading"
      >
        Confirm
      </ion-button>
    </template>
  </base-layout>

  <terms-of-use
    :is-confirmed="isConfirmed"
    @agree="onAgree"
    @decline="onDecline"
  />
  <discard-changes
    :is-open="isConfirmedModalOpen"
    @close="discardModalClosed"
    title="Do you want to discard changes?"
    text="Changes will not be saved"
    cancelButton="Cancel"
    button="Discard changes"
  />
  <waiting
    :is-open="store.isOpenWaitingModal"
    @close="onCloseModal"
    @open-chat="openChat"
  />
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import OrderItem from "@/users/components/Order.vue";
import TermsOfUse from "@/general/components/modals/terms/TermsOfUse.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { IonButton, IonText, IonSpinner } from "@ionic/vue";
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import Choose from "@/general/components/blocks/Choose.vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  Query,
  UserDocument,
  TrainerTypeEnum,
  AddTrainingToCartDocument,
  AvailableTrainingOptionsEnum,
  CreateChatDocument,
RoleEnum,
PurchasableProductsEnum,
} from "@/generated/graphql";
import { paymentGatewaysStore } from "@/users/store/paymentGatewaysStore";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import Waiting from "@/general/components/modals/approval/Waiting.vue";
import { PlaceType } from "@/ts/enums/user";
import { toastController } from "@ionic/core";
import { debounce } from "lodash";
import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";

const isConfirmed = ref(false);
const router = useRouter();
const route = useRoute();
const store = paymentGatewaysStore();
const loading = ref(true);
const { role } = useRoles();

const stopLoading = debounce(() => {
  loading.value = false;
}, 1000);

const { mutate: addToCartMutation, loading: addToCartLoading } = useMutation(
  AddTrainingToCartDocument
);

const { mutate: createChatMutation } = useMutation(CreateChatDocument);

const onAgree = () => {
  localStorage.setItem("terms_of_use", JSON.stringify(true));
  isConfirmed.value = true;
};

const onCloseModal = () => {
  store.setValue("isOpenWaitingModal", false);
  router.push({
    name: EntitiesEnum.Dashboard,
  });
};

const openChat = () => {
  createChatMutation({ participant_id: route.params.id }).then((res) => {
    store.setValue("isOpenWaitingModal", false);
    router.push({
      name: EntitiesEnum.ChatPersonal,
      params: { id: res?.data?.createChat?.id },
    });
  });
};

onMounted(() => {
  isConfirmed.value = !!localStorage.getItem("terms_of_use");
  stopLoading();
});

const onDecline = () => {
  router.go(-1);
};

const disabled = computed(() => {
  if (showChoosePlace.value && store.place?.value === PlaceType.UserGym) {
    return !store.facility;
  } else {
    return showChoosePlace.value && !store.place?.value;
  }
});

const onChoosePlace = () => {
  router.push({
    name: EntitiesEnum.ChoosePlace,
    params: { id: route.params.id },
  });
};

const onBack = () => {
  router.go(-1);
};

const getTrainingOptions = () => {
  if (trainerType.value === TrainerTypeEnum.WorkingInGym) {
    return AvailableTrainingOptionsEnum.InTrainerGym;
  }
  if (store?.place?.value === PlaceType.UserHome) {
    return AvailableTrainingOptionsEnum.TrainerRemote;
  }
  if (store?.place?.value === PlaceType.UserGym) {
    return AvailableTrainingOptionsEnum.InUserGym;
  }
  return "";
};

const getParams = () => {
  const params: {
    available_user_gym_id?: string;
    training_option: AvailableTrainingOptionsEnum | "";
    trainer_id: string;
    start_date: Date;
    end_date: Date;
  } = {
    training_option: getTrainingOptions(),
    trainer_id: route.params.id as string,
    start_date: dayjs(new Date(store.getStartDate)).utc(),
    end_date: dayjs(new Date(store.getEndDate)).utc(),
  };

  if (store.place?.value === PlaceType.UserGym) {
    params.available_user_gym_id = store?.facility?.id;
  }
  return params;
};

const confirmOrder = () => {
  // if (role === RoleEnum.User) {
  //   router.push({
  //     name: EntitiesEnum.PaymentSuccess,
  //     params: {
  //       id: route.params.id,
  //     },
  //     query: {
  //       session: EntitiesEnum.Trainer
  //     }
  //   })

  //   return;
  // }
  addToCartMutation({
    input: getParams(),
  })
    .then((res) => {
      router.push({
        name: EntitiesEnum.PaymentsMethods,
        params: {
          orderId: route.params.id,
        },
        query: {
          cart_id: res?.data?.addTrainingToCart?.id,
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

const { result } = useQuery<Pick<Query, "user">>(UserDocument, {
  id: route.params.id,
});

const trainer = computed(() => result.value?.user);
const trainerType = computed(() => result.value?.user?.trainer_type);

const showChoosePlace = computed(() => {
  const isMobile = store?.isMobile;
  const isBoth = trainerType.value === TrainerTypeEnum.Both;
  const isNotGym = trainerType.value !== TrainerTypeEnum.WorkingInGym;

  return isMobile && (isBoth || isNotGym);
});

const isConfirmedModalOpen = ref(false);

const discardModalClosed = () => {
  store.clearCart();
  router.go(-1);
};
</script>

<style scoped lang="scss">
.training-place {
  &__container {
    margin: 24px;
  }

  &__title {
    color: var(--ion-color-white);
  }

  &__info {
    margin-top: 16px;
  }
}

.submit-btn {
  width: 100%;
}

.order {
  padding-top: 24px;
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

.user-place__container {
  .training-place__title {
    color: var(--fitnesswhite);
    font-family: Yantramanav;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
