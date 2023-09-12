<template>
  <base-dashboard-layout>
    <template  #right-section>
			<dashboard-searchbar />
      <div class="content">
        <ion-row>
          <ion-col size="12" class="col-gap">
            <h4 @click="handleBack"  fill="outline">
              
              <img class="white" src="assets/icon/arrow-back.svg" />
              {{eventData?.title}}
            </h4>  
          </ion-col>
          <ion-col size="3" class="col-gap">
            
          </ion-col>
          <ion-col size="6" class="col-gap">
            <ion-card>
            <img class="cardImage" :src="eventData.media?.length ? eventData?.media[0] : null" />
            <ion-card-header class="d-flex">
              <div>
                <ion-card-title v-html="eventData?.title || ''"></ion-card-title>
                <ion-card-subtitle v-html="eventData?.address || ''"></ion-card-subtitle>
              </div>
              <div class="stack d-flex">
                <div>
                  <h4 v-html="eventData?.startDate || ''"></h4>
                  <p>Start date</p>
                </div>
                <div>
                  <h4 v-html="eventData?.startTime || ''"></h4>
                  <p>Start time</p>
                </div>
                <div>
                  <h4 v-html="eventData?.price || ''"></h4>
                  <p>Entry</p>
                </div>
              </div>
            </ion-card-header>

            <ion-card-content>
              <h4>Description</h4>
              <p v-html="eventData?.description || ''" ></p>
            
              <h4>Amenities</h4>
              
              <ion-button 
                color="default" fill="outline">
                  <img src="assets/icon/drink.svg" />
                 Drink
              </ion-button>
              
              <ion-button 
                color="default" fill="outline">
                  <img src="assets/icon/snackBar.svg" />
                Snack Bar
              </ion-button>
              
            </ion-card-content>
          </ion-card>
          </ion-col>
          <ion-col size="3" class="col-gap">
            <ion-button
              expand="block"
              class="primary"   @click="shareEvent">
              Share Event
            </ion-button>

            <ion-button
              expand="block"
              class="primary" @click="editEvent">
              Edit
            </ion-button>

            <ion-button
              expand="block"
              color="danger" fill="outline" @click="onDelete">
              Delete
            </ion-button>

            
          </ion-col>
        </ion-row>
      </div>
    </template>
  </base-dashboard-layout>
</template>

<script setup lang="ts">
import { IonTitle, IonCol, IonGrid, IonRow, IonText, IonImg, IonButton, IonIcon, IonSpinner } from "@ionic/vue";
import { star } from 'ionicons/icons';
import BaseDashboardLayout from "@/general/components/base/BaseDashboardLayout.vue";
import DashboardSearchbar from "@/general/components/blocks/DashboardSearchbar.vue"; 
import Follow from "@/general/components/blocks/Follow.vue";
// import Share from "@/general/components/blocks/Share.vue";
import { Share } from "@capacitor/share";
import Rating from "@/general/components/blocks/ratings/Rating.vue";
import GymFixed from "@/general/components/blocks/GymFixed.vue";
import DetailPhoto from "@/general/components/blocks/DetailPhoto.vue";
import { defineProps, defineEmits, withDefaults, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import VideoPlayer from "@/general/components/VideoPlayer.vue";
import useId from "@/hooks/useId";
import { useLazyQuery, useMutation, useQuery } from "@vue/apollo-composable";
import { DeleteEventDocument, EventDocument, Media, MeDocument } from "@/generated/graphql";
import { formateDayMonth } from "@/helpers/date-formater";
import { getSumForPayment } from "../helpers/getSumForPayment";
import dayjs from "dayjs";

const props = withDefaults(
  defineProps<{
    name?: string;
    address?: string;
    description: string;
    totalRating?: number | string;
    likes?: number | string;
    dislikes?: number | string;
    photosUrl?: string[];
    isFollowed?: boolean;
    buttonText?: string;
    hiddenReviews?: boolean;
    showShareButton?: boolean;
    advantagesTitle?: string;
    equipmentsTitle?: string;
    footerSubtitle?: string;
    videoUrl?: string;
    editButton?: boolean;
    distance?: string;
    photoUrl?: string;
    certificatesTitle?: string;
    labilitiesTitle?: string;
    draggableBackground?: string;
    viewAllLink?: string;
    hiddenFooter?: boolean;
    disabled?: boolean;
    showAdvantages?: boolean;
    showEquipments?: boolean;
    ordered?: boolean;
    symbols?: string;
    isTrusted?: boolean;
  }>(),
  {
    buttonText: "Book now",
    hiddenReviews: false,
    showShareButton: false,
    advantagesTitle: "Certifications",
    equipmentsTitle: "",
    editButton: false,
    address: "",
    draggableBackground: "",
    like: 0,
    dislikes: 0,
    totalRating: "0.0",
    hiddenFooter: false,
    disabled: false,
    ordered: false,
    symbols: "",
    isTrusted: true,
  }
);
const route = useRoute();
const { result, loading } = useQuery(
  EventDocument,
  {
    id: route.params.id,
  },
  {
    fetchPolicy: "no-cache",
  }
);


const eventData = computed(() => ({
  id: result?.value?.event?.id || null,
  title: result?.value?.event?.title || "",
  description: result?.value?.event?.description || "",
  startDate: formateDayMonth(result?.value?.event?.start_date) || "",
  startTime: dayjs(result?.value?.event?.start_date).format('HH:mm a') ||  "",
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

const emits = defineEmits<{
  (e: "handle-follow"): void;
  (e: "handle-book"): void;
  (e: "handle-edit"): void;
}>();

const router = useRouter();

const handleBack = () => {
  router.go(-1);
};

const handleBook = () => {
  emits("handle-book");
};

const handleEdit = () => {
  emits("handle-edit");
};

const { role } = JSON.parse(localStorage.getItem("user") || "{}");

const { id } = useId();
const isMyProfile = computed(() => route.params.id === id);

const {
  onResult: gotProfile,
  load: getProfile,
  loading: gettingProfile,
} = useLazyQuery(MeDocument, {
  fetchPolicy: "no-cache",
});

const handleStart = () => {
  getProfile();
};

gotProfile((response) => {
  const user = {
    ...JSON.parse(localStorage.getItem("user") ?? "{}"),
    first_name: response.data.me.first_name,
    last_name: response.data.me.last_name,
  };
  localStorage.setItem("user", JSON.stringify(user));
  router.push({ name: EntitiesEnum.TrainerSchedule });
});

const shareEvent = async () => {
  await Share.share({
    title: props.name,
    text: props.description,
    url: `https://${process.env.VUE_APP_URL}/users/activites/event/${route.params.id}`,
    dialogTitle: "Share",
  });
};

const editEvent = () => {
  router.push({
    name: EntitiesEnum.EditEvent,
    params: { id: route.params.id},
  });
};

const { mutate } = useMutation(DeleteEventDocument);
const onDelete = () => {
  mutate({
    id: route.params.id,
  })
    .then(() => {
      onBack();
    })
    .catch((err: any) => {
      console.log(err);
    });
}

const onBack = () => {
  router.go(-1);
};

</script>

<style scoped lang="scss">
img.white {
  filter: invert(1);
}
ion-title {
  font-family: "Yantramanav", serif;
  font-weight: 500;
  display: inline-block;
  font-size: 20px;
  line-height: 150%;
  padding: 0;
  --color: var(--ion-color-white);
}
ion-card-title {
   color: var(--FITNESS-BEIGE, var(--Beige, #E1DBC5));
font-family: Lato;
font-size: 24px;
font-style: normal;
font-weight: 700;
line-height: 150%; /* 36px */
}
h4 {
  color: var(--FITNESS-WHITE, var(--Spotter-new, #EFEFEF));
font-family: Lato;
font-size: 20px;
font-style: normal;
font-weight: 500;
line-height: normal;
}
.cardImage {
  width: 100%;
}
.stack {
  display: flex; 
height: 78px;
padding: 16px 43px; 
justify-content: center;
align-items: center;
gap: 10px;
    flex-direction: row;
background-color: #3b3b3b;
    border-radius: 10px;
    
    margin-left: auto;
    width: 80%;
}

.stack h4 {
  color: var(--FITNESS-WHITE, var(--Spotter-new, #EFEFEF));
text-align: center;
font-family: Lato;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 150%; /* 24px */
}
.stack p {
  color: var(--Grey-text, #AFAFAF);
text-align: center;
font-family: Lato;
font-size: 14px;
font-style: normal;
font-weight: 300;
line-height: 150%; /* 21px */
}
ion-text {
  font-weight: 400;
  font-size: 14px;
  color: var(--gray-400);

  &.main-info {
    font-weight: 500;
    font-size: 16px;
    padding: 4px;
    --color: var(--ion-color-white);
  }

  &.secondary-info {
    font-weight: 300;
    font-size: 14px;
  }
}

.detail {
  &__container {
    padding-bottom: 24px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 6px;
  }
}

.main-info {
  display: flex;
  flex: 1 1 100%;
  flex-direction: column;
}

.name {
  padding-bottom: 9px;
}

.address {
  display: flex;
  align-items: flex-start;

  &__icon {
    font-size: 18px;
    padding-right: 10px;
  }
}

.distance {
  color: var(--ion-color-primary);
}

.follow {
  margin-top: 2px;
  margin-right: 13px;
}

.photos {
  z-index: 10;
  width: 100vw;
  height: 100%;
  position: relative;

  .swiper {
    height: 100%;
  }
}

.video {
  width: 100vw;
  z-index: 10;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 100%;

  .video-js .vjs-tech {
    position: static !important;
  }

  .vjs-tech {
    position: static !important;
  }
}

.reviews {
  &__container {
    margin-bottom: 16px;
  }

  &__header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    gap: 10px;
    padding: 0 16px;
    margin-bottom: 14px;
  }

  &__all {
    font-weight: 400;
    font-size: 14px;
    margin-left: auto;
  }

  &__title {
    font-weight: 500;
    font-size: 16px;
    color: var(--ion-color-white);
  }
}

.advantages {
  &__header {
    font-weight: 500;
    font-size: 16px;
    color: var(--ion-color-white);
    padding: 10px 16px;
    margin-bottom: 6px;
  }

  &__title {
    font-weight: 500;
    font-size: 16px;
    color: var(--ion-color-white);
  }

  &__content {
    display: flex;
    padding: 0 16px;
    flex-wrap: wrap;
  }
}

.rating {
  display: flex;
  align-items: center;

  &__icon {
    font-size: 18px;
    margin-right: 3px;
  }

  &__likes {
    color: var(--ion-color-success-tint);
  }

  &__dislikes {
    color: var(--ion-color-danger-tint);
  }
}

.header-btn {
  margin: 0;
  height: 32px;
  font-size: 24px;
  display: block;
  min-width: 32px;
  backdrop-filter: blur(4px);
  border-radius: 50%;
  --border-radius: 50% !important;
  --icon-font-size: 24px;
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  --icon-padding-bottom: 0;
  --icon-padding-end: 0;
  --icon-padding-start: 0;
  --icon-padding-top: 0;
  --min-height: 32px;
  --min-width: 32px;
  --background: rgba(var(--ion-color-black-rgb), 0.12);

  ion-icon {
    font-size: 1em;
  }
}

.share-btn {
  margin-left: 16px;
}

.button-panel {
  padding-bottom: calc(32px + var(--ion-safe-area-bottom));

  .button {
    margin: 0;
  }
}

.fixed-holder {
  .button {
    margin: 0;
  }
}

.symbols {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  font-size: 84px;
  line-height: 1.5;
  font-weight: 700;
  text-align: center;
  position: absolute;
  align-items: center;
  flex-direction: column;
  color: var(--gray-700);
  justify-content: center;
  background: var(--gray-600);
}
</style>
