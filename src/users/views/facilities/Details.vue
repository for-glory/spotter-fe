<template>
  <ion-spinner v-if="loading" name="lines" class="spinner" />
  <detail
    v-else
    :edit-button="isMyFacility"
    :name="facility?.name ?? ''"
    :photos-url="photosWithUrl"
    :likes="facility?.positive_reviews_count || 0"
    :total-rating="facility?.score || 0"
    :dislikes="facility?.negative_reviews_count || 0"
    :is-followed="isFollowed"
    :address="facility?.address?.street ?? ''"
    button-text="Buy"
    :is-trusted="isTrusted"
    advantages-title="Equipment"
    @handle-follow="handleFollow"
    @handle-book="handleBuy"
    :viewAllLink="EntitiesEnum.FacilityReviews"
    @handle-edit="onEdit"
  >
    <template #info>
      <div class="info">
        {{ facility?.description }}
      </div>
    </template>
    <template #reviews>
      <review-slides :reviews="reviews" />
    </template>
    <template #advantages>
      <template v-for="equipment in facility?.equipments" :key="equipment.id">
        <advantage-item
          :icon="equipment?.iconUrl || ''"
          :title="equipment?.name || ''"
        />
      </template>
    </template>
  </detail>
</template>

<script setup lang="ts">
import { actionSheetController, IonSpinner } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import Detail from "@/general/components/Detail.vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  Facility,
  FollowDocument,
  FollowTypeEnum,
  MeDocument,
  Query,
  Review,
  ReviewsDocument,
  RoleEnum,
  SettingsCodeEnum,
  UnfollowDocument,
} from "@/generated/graphql";
import { Review as UserReview } from "@/ts/types/user";
import { GetFacilityDocument } from "@/graphql/documents/userDocuments";
import { computed, ref } from "vue";
import AdvantageItem from "@/general/components/blocks/AdvantageItem.vue";
import ReviewSlides from "@/general/components/blocks/ratings/ReviewSlides.vue";
import { EntitiesEnum } from "@/const/entities";
import useRoles from "@/hooks/useRole";

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

const facility = computed(() => result.value?.facility);

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

const { mutate: follow, onDone: onFollowed } = useMutation(FollowDocument, {
  variables: { id: route.params.id, type: FollowTypeEnum.Facility },
});

const { mutate: unfollow, onDone: onUnfollowed } = useMutation(
  UnfollowDocument,
  {
    variables: { id: route.params.id, type: FollowTypeEnum.Facility },
  }
);

const photosWithUrl = computed(() =>
  process.env.VUE_APP_CDN
    ? result?.value?.facility?.media?.map(
        (media) => `${process.env.VUE_APP_CDN}${media?.path}`
      )
    : []
);

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

const { role } = useRoles();

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

const isMyFacility = computed(() => {
  const myFacilities =
    JSON.parse(localStorage.getItem("user") || "")?.owned_facilities || [];
  return (
    myFacilities.find(
      (facility: Facility) => facility.id === route.params.id
    ) &&
    (role === RoleEnum.OrganizationOwner ||
      role === RoleEnum.FacilityOwner ||
      role === RoleEnum.Manager)
  );
});

enum actionTypesEnum {
  DeleteGym = "DELETE_GYM",
  EditGym = "EDIT_GYM",
}

const onEdit = async () => {
  const actionSheet = await actionSheetController.create({
    mode: "ios",
    buttons: [
      {
        text: "Delete gym",
        role: "destructive",
        data: {
          type: actionTypesEnum.DeleteGym,
        },
      },
      {
        text: "Edit gym",
        data: {
          type: actionTypesEnum.EditGym,
        },
      },
      {
        text: "Cancel",
        role: "cancel",
      },
    ],
  });

  await actionSheet.present();
};
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
