<template>
  <ion-spinner v-if="loading" name="lines" class="spinner" />
  <detail
    v-else
    :name="fullName"
    :likes="user?.positive_reviews_count || 0"
    :total-rating="user?.score || '0.0'"
    :dislikes="user?.negative_reviews_count || 0"
    :is-followed="isFollowed"
    :photos-url="photosWithUrl && photosWithUrl[0] ? (photosWithUrl as string[]) : undefined"
    :address="address"
    @handle-book="onBook"
    :is-trusted="isTrusted"
    @handle-edit="onEdit"
    @handle-follow="handleFollow"
    :certificatesTitle="
      user?.certificates?.length ? 'Certificates' : undefined
    "
    :labilitiesTitle="
      user?.weiver_and_labilities?.length ? 'Waiver and Labilities' : undefined
    "
    :viewAllLink="reviews?.length ? EntitiesEnum.TrainerReviews : undefined"
    :symbols="symbols"
  >
    <template #info>
      <div class="info">
        <div class="info__block">
          <ion-text class="main-info"> ${{ hourlyRate }} </ion-text>
          <ion-text class="info__secondary"> Hourly rate </ion-text>
        </div>
        <div class="info__block">
          <ion-text class="main-info">
            {{ user?.completed_trainings_count || 0 }}
          </ion-text>
          <ion-text class="info__secondary"> Completed </ion-text>
        </div>
        <div class="info__block">
          <ion-text class="main-info"> {{ user?.reviews_count }} </ion-text>
          <ion-text class="info__secondary"> Reviews </ion-text>
        </div>
      </div>
    </template>
    <template #reviews>
      <review-slides :reviews="reviews" heightFixed v-if="reviews?.length" />
      <ion-text color="secondary" class="no-reviews" v-else>
        There are no reviews yet...
      </ion-text>
    </template>
    <template #certificates>
      <div
        v-for="certificate in user?.certificates"
        :key="certificate.id"
        @click="onOpenDocumet(certificate.pathUrl)"
      >
        <advantage-item
          icon="assets/icon/advantages/certificate.svg"
          :title="certificate.title || ''"
        />
      </div>
    </template>
    <template #labilities>
      <div
        v-for="lability in user?.weiver_and_labilities"
        :key="lability.id"
        id="open-pdf-modal"
        @click="onOpenDocumet(lability.pathUrl)"
      >
        <advantage-item
          icon="assets/icon/advantages/certificate.svg"
          :title="lability.title || ''"
        />
      </div>
    </template>
  </detail>
</template>

<script setup lang="ts">
import { IonText, IonSpinner, actionSheetController } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import Detail from "@/general/components/Detail.vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import {
  Query,
  UserDocument,
  UnfollowDocument,
  FollowTypeEnum,
  FollowDocument,
  ReviewsDocument,
  Review,
  SettingsCodeEnum,
  TrainerTypeEnum,
  MeDocument,
} from "@/generated/graphql";
import { computed, ref } from "vue";
import AdvantageItem from "@/general/components/blocks/AdvantageItem.vue";
import ReviewSlides from "@/general/components/blocks/ratings/ReviewSlides.vue";
import { getUnifiedString } from "@/utils/textUtils";
import { EntitiesEnum } from "@/const/entities";
import { Review as UserReview } from "@/ts/types/user";
import { paymentGatewaysStore } from "@/users/store/paymentGatewaysStore";
import { Browser } from "@capacitor/browser";
import { getSumForPayment } from "@/general/helpers/getSumForPayment";
import { Share } from "@capacitor/share";

const route = useRoute();
const router = useRouter();

const isFollowed = ref(false);
const isTrusted = ref(false);

const paymentProductsStore = paymentGatewaysStore();

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

const { result, loading, onResult } = useQuery<Pick<Query, "user">>(
  UserDocument,
  {
    id: route.params.id,
  }
);

const { mutate: follow, onDone: onFollowed } = useMutation(FollowDocument, {
  variables: { id: route.params.id, type: FollowTypeEnum.User },
});

const { mutate: unfollow, onDone: onUnfollowed } = useMutation(
  UnfollowDocument,
  {
    variables: { id: route.params.id, type: FollowTypeEnum.User },
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

onResult(() => {
  if (result?.value?.user?.is_followed) {
    isFollowed.value = result?.value?.user?.is_followed;
  }
});

const isMobile = computed(() =>
  result.value?.user?.settings?.find(
    (setting) => setting.setting?.code === SettingsCodeEnum.IsMobile
  )
);

onFollowed(() => {
  isFollowed.value = true;
});

onUnfollowed(() => {
  isFollowed.value = false;
});

const user = computed(() => result.value?.user);

const hourlyRate = computed(() => {
  let rate;
  if (result?.value?.user?.trainer_type === TrainerTypeEnum.Freelancer) {
    rate = result.value?.user?.settings?.find(
      (setting) => setting.setting?.code === SettingsCodeEnum.RemoteHourlyRate
    );
  } else {
    rate = result.value?.user?.settings?.find(
      (setting) => setting.setting?.code === SettingsCodeEnum.HourlyRate
    );
  }
  return rate?.value ? getSumForPayment(rate.value, true) : "0.00";
});

const fullName = computed(() => {
  return getUnifiedString(
    [result.value?.user?.first_name, result.value?.user?.last_name],
    " "
  );
});

const symbols = computed(
  () =>
    `${result.value?.user?.first_name?.charAt(
      0
    )}${result.value?.user?.last_name?.charAt(0)}`
);

const photosWithUrl = computed(() =>
  result?.value?.user?.media?.reduce(
    (acc, cur) => {
      if (cur?.pathUrl) {
        acc.push(cur.pathUrl);
      }
      return acc;
    },
    [result?.value?.user.avatarUrl]
  )
);

const address = computed(() => {
  return result.value?.user?.facilities?.[0]?.address?.street || "";
});

const onBook = () => {
  if (user.value) paymentProductsStore.clearCart();
  paymentProductsStore.setValue("price", hourlyRate.value);
  paymentProductsStore.setValue("isMobile", isMobile.value);
  router.push({
    name: EntitiesEnum.BookTrainer,
    params: { id: route.params.id },
  });
};

enum actionTypesEnum {
  // DeleteProfile = "DELETE_PROFILE",
  EditProfile = "EDIT_PROFILE",
  ShareProfile = "SHARE_PROFILE",
}

const onEdit = async () => {
  const actionSheet = await actionSheetController.create({
    mode: "ios",
    buttons: [
      // {
      //   text: "Delete profile",
      //   role: "destructive",
      //   data: {
      //     type: actionTypesEnum.DeleteProfile,
      //   },
      // },
      {
        text: "Edit profile",
        data: {
          type: actionTypesEnum.EditProfile,
        },
      },
      {
        text: "Share profile",
        data: {
          type: actionTypesEnum.ShareProfile,
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
    // [actionTypesEnum.DeleteProfile]: () => deleteProfile(),
    [actionTypesEnum.EditProfile]: () => editProfile(),
    [actionTypesEnum.ShareProfile]: () => shareProfile(),
  };

  if (actions[type]) {
    actions[type]();
  }
};
const editProfile = () => {
  router.push({
    name: EntitiesEnum.ProfileEdit,
  });
};

const shareProfile = async () => {
  await Share.share({
    title: fullName.value,
    url: `https://${process.env.VUE_APP_URL}/users/trainers/${route.params.id}`,
    dialogTitle: "Share",
  });
};

const handleFollow = () => {
  if (isFollowed.value) {
    unfollow();
  } else {
    follow();
  }
};

const onOpenDocumet = async (url: string) => {
  await Browser.open({ url: url });
};
</script>

<style scoped lang="scss">
ion-text {
  font-weight: 400;
  font-size: 14px;
  color: var(--gray-400);

  &.main-info {
    font-weight: 500;
    font-size: 16px;
    padding: 4px;
    --color: var(--white);
  }
}
.info {
  display: flex;
  justify-content: space-between;
  margin: 25px 16px;
  background-color: var(--gray-700);
  padding: 16px;
  text-align: center;
  border-radius: 8px;
  gap: 20px;

  &__block {
    flex: 1 1 100%;
    white-space: nowrap;
    display: flex;
    padding: 0 8px;
    position: relative;
    flex-direction: column;
    align-items: center;

    &:not(:first-child) {
      &:before {
        left: 0;
        top: 50%;
        content: "";
        height: 32px;
        margin-top: -16px;
        position: absolute;
        border-left: 1px solid var(--gray-600);
      }
    }
  }
}

.separator {
  height: 32px;
  width: 1px;
  margin: auto 0;
  background-color: var(--gray-600);
}

.spinner {
  position: fixed;
  top: 50vh;
  left: 50vw;
  --color: var(--white);
}

.review-slide {
  width: 85%;
}

.no-reviews {
  margin: 16px;
  padding: 16px;
  display: block;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  border-radius: 8px;
  background: var(--gray-700);
}
</style>
