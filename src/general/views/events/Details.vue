<template>
  <ion-spinner v-if="loading" name="lines" class="spinner" />
  <detail
    hiddenReviews
    :name="eventData?.title"
    :photos-url="eventData?.media"
    :address="eventData?.address"
    footer-subtitle="Event"
    buttonText="Purchase Entry"
    advantagesTitle="Amenities"
    equipmentsTitle="Equipments"
    :show-share-button="eventData?.trainerId !== id"
    :edit-button="eventData?.trainerId === id"
    @handle-book="onBook"
    @handle-edit="onEdit"
    :is-trusted="isTrusted"
    :disabled="addToCartLoading"
    :ordered="ordered"
    v-else
    :show-advantages="eventData?.amenities.length"
    :show-equipments="eventData?.equipments.length"
  >
    <template #info>
      <info
        :start-date="eventData?.startDate || ''"
        start-date-label="Start date"
        :price="`$${eventData?.price}`"
        price-label="Entry"
        :members="`${eventData?.bookedCount}/${eventData?.maxParticipants}`"
        members-label="Members"
      />
    </template>
    <template #content>
      <div class="holder-content ion-padding-horizontal">
        <ion-text v-html="eventData?.description || ''" />
      </div>
    </template>
    <template #advantages>
      <advantage-item
        v-for="(amenity, index) in eventData?.amenities"
        :icon="amenityIcon(amenity)"
        :title="amenity?.name"
        :key="index"
      />
    </template>
    <template #equipments>
      <advantage-item
        v-for="(equipment, index) in eventData?.equipments"
        :icon="amenityIcon(equipment)"
        :title="equipment?.name"
        :key="index"
      />
    </template>
  </detail>
  <confirmation
    :is-visible="showConfirmationModal"
    title="Do you want to delete account"
    :description="eventData?.title + 'will be deleted'"
    button-text="Delete"
    cancel-button-text="Cancel"
    @discard="onDelete"
    @decline="hideModal"
  />
</template>

<script lang="ts">
export default {
  name: "EventDetail",
};
</script>

<script setup lang="ts">
import { IonText, IonSpinner, actionSheetController } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import Detail from "@/general/components/Detail.vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  AddToCartDocument,
  AddToCartPurchasableEnum,
  EventDocument,
  MeDocument,
  Media,
  SettingsCodeEnum,
  DeleteEventDocument,
} from "@/generated/graphql";
import AdvantageItem from "@/general/components/blocks/AdvantageItem.vue";
import { EntitiesEnum } from "@/const/entities";
import Info from "@/general/components/blocks/Info.vue";
import { formateDayMonth } from "@/helpers/date-formater";
import { computed, ref } from "vue";
import { getSumForPayment } from "@/general/helpers/getSumForPayment";
import { toastController } from "@ionic/core";
import useId from "@/hooks/useId";
import { Share } from "@capacitor/share";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";

const route = useRoute();
const router = useRouter();
const isTrusted = ref(false);

const { showConfirmationModal, showModal, hideModal } = useConfirmationModal();

const { result, loading } = useQuery(
  EventDocument,
  {
    id: route.params.id,
  },
  {
    fetchPolicy: "no-cache",
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

const { mutate: addToCartMutation, loading: addToCartLoading } =
  useMutation(AddToCartDocument);

const eventData = computed(() => ({
  id: result?.value?.event?.id || null,
  title: result?.value?.event?.title || "",
  description: result?.value?.event?.description || "",
  startDate: formateDayMonth(result?.value?.event?.start_date) || "",
  endDate: result?.value?.event?.end_date || "",
  price: getSumForPayment(result?.value?.event?.price, true) || "0.00",
  trainerId: result?.value?.event?.trainer?.id || null,
  address: result?.value?.event?.address?.street || "",
  media:
    result?.value?.event?.media?.map((media: Media) => media?.pathUrl) ?? [],
  maxParticipants: result?.value?.event?.max_participants,
  bookedCount: result?.value?.event?.booked_count || 0,
  amenities: result?.value?.event?.amenities || "",
  equipments: result?.value?.event?.equipments || "",
}));

const ordered = computed(() => result?.value?.event?.was_ordered_by_me);
const { mutate } = useMutation(DeleteEventDocument);

const amenityIcon = (icon: string) =>
  icon?.iconUrl || `assets/icon/advantages/gym.svg`;

const onBook = () => {
  addToCartMutation({
    input: {
      purchasable_id: route.params.id,
      purchasable: AddToCartPurchasableEnum.Event,
    },
  })
    .then((res) => {
      router.push({
        name: EntitiesEnum.EventOrder,
        params: {
          id: route.params.id,
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

const { id } = useId();

enum actionTypesEnum {
  EditEvent = "EDIT_EVENT",
  ShareEvent = "SHARE_EVENT",
  DeleteEvent = "DELETE_EVENT",
}

const onEdit = async () => {
  const actionSheet = await actionSheetController.create({
    mode: "ios",
    buttons: [
      {
        text: "Delete event",
        data: {
          type: actionTypesEnum.DeleteEvent,
        },
      },
      {
        text: "Edit event",
        data: {
          type: actionTypesEnum.EditEvent,
        },
      },
      {
        text: "Share event",
        data: {
          type: actionTypesEnum.ShareEvent,
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
    [actionTypesEnum.EditEvent]: () => editEvent(),
    [actionTypesEnum.ShareEvent]: () => shareEvent(),
    [actionTypesEnum.DeleteEvent]: () => showModal(),
  };

  if (actions[type]) {
    actions[type]();
  }
};

const editEvent = () => {
  router.push({
    name: EntitiesEnum.EditEvent,
    params: { id: eventData.value.id },
  });
};

const shareEvent = async () => {
  await Share.share({
    title: result?.value?.event?.title,
    text: result?.value?.event?.description,
    url: `https://${process.env.VUE_APP_URL}/users/activites/event/${result?.value?.event?.id}`,
    dialogTitle: "Share",
  });
};

const onDelete = () => {
  hideModal();
  mutate({
    id: eventData.value.id,
  })
    .then(() => {
      onBack();
    })
    .catch((err) => {
      console.log(err);
    });
}

const onBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.holder-content {
  font-weight: 300;
  font-size: 14px;
  line-height: 1.5;
  color: var(--gray-400);
  padding-bottom: 15px;
}

.spinner {
  position: fixed;
  top: 50vh;
  left: 50vw;
  --color: var(--ion-color-white);
}
</style>
