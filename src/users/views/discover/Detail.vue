<template>
  <ion-spinner v-if="loading" name="lines" class="spinner" />
  <detail
    v-else
    :name="result?.facility?.name ?? ''"
    :photos-url="photosWithUrl"
    :likes="result?.facility?.positive_reviews_count || 0"
    :total-rating="result?.facility?.score || 0"
    :dislikes="result?.facility?.negative_reviews_count || 0"
    :is-followed="isFollowed"
    :address="result?.facility?.address?.street ?? ''"
    :distance="distance"
    :is-trusted="isTrusted"
    button-text="Buy"
    advantages-title="Equipment"
    @handle-follow="handleFollow"
    @handle-book="handleBuy"
    :viewAllLink="EntitiesEnum.FacilityReviews"
  >
    <template #info>
      <div class="info">
        {{ result?.facility?.description }}
      </div>
    </template>
    <template #reviews>
      <review-slides :reviews="reviews" />
    </template>
    <template #advantages>
      <advantage-item icon="heart" title="Cardio Items" />
      <advantage-item icon="pool" title="Pool" />
      <advantage-item icon="shower" title="Shower & bath" />
    </template>
  </detail>
</template>

<script setup lang="ts">
import { IonSpinner, toastController } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import Detail from "@/general/components/Detail.vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  MeDocument,
  Query,
  Review,
  ReviewsDocument,
  SettingsCodeEnum,
} from "@/generated/graphql";
import {
  GetFacilityDocument,
  FollowFacilityDocument,
  UnfollowFacilityDocument,
} from "@/graphql/documents/userDocuments";
import { computed, ref } from "vue";
import AdvantageItem from "@/general/components/blocks/AdvantageItem.vue";
import { EntitiesEnum } from "@/const/entities";
import { Review as UserReview } from "@/ts/types/user";
import ReviewSlides from "@/general/components/blocks/ratings/ReviewSlides.vue";
import { distanceBetweenCoords } from "@/helpers/distance-between-coords";
import { PositionLatLng } from "@/ts/types/map";
import { Geolocation } from "@capacitor/geolocation";

const route = useRoute();
const router = useRouter();
const isFollowed = ref(false);
const isTrusted = ref(false);

const { result, loading, onResult } = useQuery<Pick<Query, "facility">>(
  GetFacilityDocument,
  {
    id: route.params.id,
  }
);

const { mutate: follow, onDone: onFollowed } = useMutation(
  FollowFacilityDocument,
  {
    variables: { facility_id: route.params.id },
  }
);
const { mutate: unfollow, onDone: onUnfollowed } = useMutation(
  UnfollowFacilityDocument,
  {
    variables: { facility_id: route.params.id },
  }
);

const photosWithUrl = computed(() =>
  process.env.VUE_APP_CDN
    ? result?.value?.facility?.media?.map(
        (media) => `${process.env.VUE_APP_CDN}${media?.path}`
      )
    : []
);

const handleFollow = () => {
  if (isFollowed.value) {
    unfollow();
  } else {
    follow();
  }
};

const handleBuy = () => {
  router.push({ name: EntitiesEnum.FacilitySubscription });
};

onResult(() => {
  if (result?.value?.facility?.is_followed) {
    isFollowed.value = result?.value?.facility?.is_followed;
  }
});

onFollowed(() => {
  isFollowed.value = true;
});

onUnfollowed(() => {
  isFollowed.value = false;
});

const { result: reviewsResult } = useQuery(ReviewsDocument, {
  id: route.params.id,
});

const reviews = computed(() =>
  reviewsResult?.value?.reviews?.data.reduce(
    (acc: UserReview[], cur: Review) => {
      acc.push({
        id: cur.id,
        date: cur.created_at,
        rating: cur.score || 0,
        text: cur.review,
        avatarUrl: cur.author?.avatarUrl || "",
        fullName: `${cur.author?.first_name} ${cur.author?.last_name}`,
      });
      return acc;
    },
    []
  )
);

const myCoords = ref<PositionLatLng>({
  lat: 0,
  lng: 0,
});

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

  if (
    !response.data.me.settings.find(
      (settings: any) =>
        settings.setting.code === SettingsCodeEnum.UsePhoneLocation
    )?.value
  ) {
    myCoords.value = {
      lat: response.data.me.address.lat,
      lng: response.data.me.address.lng,
    };
  } else {
    myCoords.value = await getUserLocation();
  }
});

const getUserLocation = async (): Promise<PositionLatLng> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition()
      .then((myPosition) => {
        resolve({
          lat: myPosition.coords.latitude,
          lng: myPosition.coords.longitude,
        });
      })
      .catch(async () => {
        const toast = await toastController.create({
          message:
            "Failed to get your location. Check the permissions for the application.",
          duration: 2000,
          icon: "assets/icon/info.svg",
          cssClass: "warning-toast",
        });
        toast.present();
        await Geolocation.requestPermissions();
        reject();
      });
  });
};

const distance = computed(
  () =>
    `(${distanceBetweenCoords(
      {
        lat: result.value?.facility?.address?.lat || 0,
        lng: result.value?.facility?.address?.lng || 0,
      },
      {
        lat: myCoords.value.lat || 0,
        lng: myCoords.value.lng || 0,
      }
    ).toFixed(1)} mi)`
);
</script>

<style scoped lang="scss">
.info {
  font-weight: 300;
  font-size: 14px;
  margin: 27px 32px 24px 16px;
  color: var(--ion-color-secondary);
}

.spinner {
  position: fixed;
  top: 50vh;
  left: 50vw;
  --color: var(--ion-color-white);
}
</style>
