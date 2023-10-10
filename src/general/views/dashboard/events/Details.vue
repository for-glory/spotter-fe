<template>
  <ion-spinner v-if="loading" name="lines" class="spinner" />
  <div v-else>
    <div :class="{ 'user-detail-container': role === RoleEnum.User }" v-if="!Capacitor.isNativePlatform()">
      <div>
        <div class="btn-back" @click="onBack">
          <ion-icon class="white" src="assets/icon/arrow-back.svg" />
          {{eventData?.title}}
        </div>
      </div>
      <ion-row :class="['detail-container']">
        <ion-col size="12" :size-lg="role !== RoleEnum.User ? '9' : '12'">
          <div class="event-detail">
            <div>
              <div class="event-detail__img">
                        <ion-img :src="eventData?.media" />
                        <ion-button class="more-btn" fill="clear" color="light" @click="handleMore">
                            <ion-icon :icon="ellipsisVertical" />
                        </ion-button>
                    </div>
              <div class="d-flex ion-justify-content-between align-items-center">
                <div>
                  <ion-title class="event-detail__title" v-html="eventData?.title || ''"> </ion-title>
                  <div class="event-detail__address" >
                    <img src="assets/location.svg" />
                    <span> {{eventData?.address || ''}} </span>
                  </div>
                </div>
                <info
                  :start-date="eventData?.startDate || ''"
                  start-date-label="Start date"
                  :price="`$${eventData?.price}`"
                  price-label="Entry"
                  :members="`${eventData?.bookedCount}/${eventData?.maxParticipants}`"
                  members-label="Members"
                />
                <!-- <follow /> -->
              </div>
      
              <div class="mt-3">
                <h4>Description:</h4>
                <ion-text class="description">{{ eventData?.description || '' }}</ion-text>
                
                <div v-if="eventData?.amenities.length">
                  <h4 class="ion-padding-top">Amenities</h4>
                  <div class="d-flex ion-wrap">
                    <advantage-item
                      v-for="(amenity, index) in eventData?.amenities"
                      :icon="amenityIcon(amenity)"
                      :title="amenity?.name"
                      :key="index"
                      light-item
                    />
                  </div>
                </div>
                <div v-if="eventData?.equipments.length">
                  <h4 class="ion-padding-top">Equipments</h4>
                  <div class="d-flex ion-wrap">
                    <advantage-item
                      v-for="(equipment, index) in eventData?.equipments"
                      :icon="amenityIcon(equipment)"
                      :title="equipment?.name"
                      :key="index"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ion-col>
        <ion-col size="12" size-lg="3" v-if="role !== RoleEnum.User">
          <div class="event-action">
            <ion-button
              expand="block"
              class="primary btn-event" style="margin-bottom: 20px;"  @click="shareEvent">
              Share Event 
              <img src="assets/icon/export.svg" />
            </ion-button>
      
            <ion-button
              expand="block"
              class="primary btn-event" style="margin-bottom: 20px;" @click="editEvent">
              Edit
            </ion-button>
      
            <ion-button
              expand="block"
              class="btn-event"
              color="danger" fill="outline" @click="showModal">
              Delete
            </ion-button>
          </div>
        </ion-col>
      </ion-row>
    </div>
    <detail
      v-else
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
  </div>
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
import { IonText, IonSpinner, actionSheetController, IonRow, IonCol, IonButton, IonIcon, IonImg } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import { ellipsisVertical } from "ionicons/icons";
import EventDetail from "@/general/components/EventDetail.vue";
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
  RoleEnum,
} from "@/generated/graphql";
import AdvantageItem from "@/general/components/blocks/AdvantageItem.vue";
import Follow from "@/general/components/blocks/Follow.vue";
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
import { Capacitor } from "@capacitor/core";
import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";

const route = useRoute();
const router = useRouter();
const isTrusted = ref(false);
const { role } = useRoles();
const isNative = ref(true);
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
  startTime: dayjs(result?.value?.event?.start_date).format("HH:mm") || "",
  endDate: result?.value?.event?.end_date || "",
  price: getSumForPayment(result?.value?.event?.price, true) || "0.00",
  trainerId: result?.value?.event?.trainer?.id || null,
  address: result?.value?.event?.address?.street || "",
  media:
    result?.value?.event?.media?.map((media: Media) => media?.pathUrl) ?? [],
  maxParticipants: result?.value?.event?.max_participants,
  bookedCount: result?.value?.event?.booked_count || 0,
  amenities: result?.value?.event?.amenities || [],
  equipments: result?.value?.event?.equipments || [],
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
    name: EntitiesEnum.DashboardEditEvent,
    params: { id: eventData.value.id },
  });
};

const handleMore = () => {
  console.log('handle more');  
}

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
.btn-back {
  padding: 16px 16px 0 65px;
  display: flex;
  align-items: center;
  color: var(--gold);
  font-family: Lato;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%; /* 31.2px */
}

.detail-container {
  & .event-detail {
    width: 100%;
    max-width: 593px;
    margin: 0 auto;
    color: var(--fitnesswhite);
    font-family: Lato;
    font-size: 16px;
    font-style: normal;
    font-weight: 300;
    line-height: 150%; /* 24px */

    &__img {
      margin: 24px 0;
      --size: 68px;
      z-index: 10;
      position: relative;
      width: 100%;
      height: 275px;

      ion-img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
    }
    .more-btn {
        position: absolute;
        top: 0;
        right: 0;
    }
    }
    &__title {
      color: var(--gold);
      font-family: Lato;
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: 150%; /* 36px */
      padding-left: 0;
      margin: 12px 0;
    }
    &__address {
      display: flex;
      align-items: center;
    }

    .info {
      margin: 0 !important;
    }
  }
  & .event-action {
    width: 175px;
  }

  .description {
    color: var(--grey-text);
    font-family: Lato;
    font-size: 16px;
    font-style: normal;
    font-weight: 300;
  }
}

.spinner {
  position: fixed;
  top: 50vh;
  left: 50vw;
  --color: var(--ion-color-white);
}

.user-detail-container {
  .detail-container {

    justify-content: center;
    
    .event-detail {
      max-width: 800px;
    }
  }
}
</style>
