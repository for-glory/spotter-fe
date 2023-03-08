<template>
  <detail
    edit-button
    :name="facilityTitle ?? ''"
    :photos-url="facilityPhotosUrl"
    :likes="64"
    :total-rating="4.8"
    :dislikes="48"
    :is-followed="isFollowed"
    @handle-follow="isFollowed = !isFollowed"
    :address="
      selectedCity && selectedAddress
        ? `${selectedCity?.name}, ${selectedAddress?.thoroughfare} ${selectedAddress?.subThoroughfare}`
        : ''
    "
    button-text="Let's start"
    advantages-title="Equipment"
    labilities-title="Amenities"
    @handle-book="saveFacility"
    @handle-edit="onBack"
  >
    <template #info>
      <div class="info">
        {{ facilityDescription }}
      </div>
    </template>
    <template #reviews>
      <review-slides :reviews="reviews" />
    </template>
    <template #advantages v-if="facilityEquipments?.length">
      <template v-for="equipment in facilityEquipments" :key="equipment.id">
        <advantage-item
          :icon="equipment?.iconUrl || ''"
          :title="String(equipment?.label) || ''"
        />
      </template>
    </template>
    <template #labilities v-if="facilityAmenities?.length">
      <template v-for="amenity in facilityAmenities" :key="amenity.id">
        <advantage-item
          :icon="amenity?.iconUrl || ''"
          :title="String(amenity?.label) || ''"
        />
      </template>
    </template>
  </detail>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useNewFacilityStore } from "../store/new-facility";
import Detail from "@/general/components/Detail.vue";
import AdvantageItem from "@/general/components/blocks/AdvantageItem.vue";
import ReviewSlides from "@/general/components/blocks/ratings/ReviewSlides.vue";
import { useMutation } from "@vue/apollo-composable";
import {
  CreateFacilityDocument,
  UpdateUserSettingsDocument,
} from "@/generated/graphql";
import { EntitiesEnum } from "@/const/entities";
import { setSettings } from "@/hooks/useSettings";
import useId from "@/hooks/useId";
import { ProfileSettings } from "@/ts/enums/user";

const router = useRouter();
const store = useNewFacilityStore();

const facilityPhotos = computed(() => store.photos);
const facilityPhotosUrl = computed(() =>
  store.photos.map((photo) => photo.url)
);
const facilityTitle = computed(() => store.title);
const facilityDescription = computed(() => store.description);
const facilityEquipments = computed(() => store.equipments);
const facilityAmenities = computed(() => store.amenities);
const selectedCity = computed(() => store.address.city);
const selectedAddress = computed(() => store.address.address);

const isFollowed = ref<boolean>(false);

const onBack = () => {
  router.go(-1);
};

const { mutate: createFacility, onDone: facilityCreated } = useMutation(
  CreateFacilityDocument
);

const saveFacility = () => {
  const { registration_code } = JSON.parse(
    localStorage.getItem("organization") || "{}"
  );

  createFacility({
    input: {
      name: facilityTitle.value,
      description: facilityDescription.value,
      address: {
        lat: Number(selectedAddress.value?.latitude),
        lng: Number(selectedAddress.value?.longitude),
        street: `${selectedAddress.value?.thoroughfare || ""} ${
          selectedAddress.value?.subThoroughfare || ""
        }`,
        city_id: selectedCity.value?.id,
      },
      media: facilityPhotos.value.map((photo, index) => {
        return {
          title: `${facilityTitle.value}-${index}`,
          file: photo.path,
        };
      }),
      equipments: facilityEquipments.value.map((equipment) => equipment.id),
      amenities: facilityAmenities.value.map((amenity) => amenity.id),
      registration_code,
    },
  });
};

facilityCreated(() => {
  updateSettings();
});

const { mutate: updateUserSettings, onDone: settingsUpdated } = useMutation(
  UpdateUserSettingsDocument
);

const updateSettings = () => {
  setSettings([{ isFacilitySetUp: true }]);
  const { id } = useId();

  const front_settings = localStorage.getItem(ProfileSettings.UserSettings);

  updateUserSettings({
    id,
    front_settings,
  });
};

settingsUpdated(() => {
  localStorage.removeItem("organization");
  router.push({
    name: EntitiesEnum.Profile,
  });
});

const reviews = [
  {
    id: 1,
    date: new Date("2022-06-06").toLocaleDateString(),
    avatarUrl: "assets/mock/reviewer.jpg",
    fullName: "Sharon Jem",
    rating: 4.9,
    text: "Had such an amazing session. She instantly picked up on the level of my fitness and adjusted the workout to suit me.",
  },
  {
    id: 2,
    date: new Date("2022-06-06"),
    avatarUrl: "assets/mock/reviewer-2.jpg",
    fullName: "Sharon Jem",
    rating: 4.9,
    text: "Had such an amazing session. She instantly picked up on the level of my fitness and adjusted the workout to suit me.",
  },
  {
    id: 3,
    date: new Date("2022-06-06"),
    avatarUrl: "assets/mock/reviewer.jpg",
    fullName: "Sharon Jem",
    rating: 4.9,
    text: "Had such an amazing session. She instantly picked up on the level of my fitness and adjusted the workout to suit me.",
  },
  {
    id: 4,
    date: new Date("2022-06-06"),
    avatarUrl: "assets/mock/reviewer-2.jpg",
    fullName: "Sharon Jem",
    rating: 4.9,
    text: "Had such an amazing session. She instantly picked up on the level of my fitness and adjusted the workout to suit me.",
  },
];
</script>

<style scoped lang="scss">
.info {
  font-size: 14px;
  font-weight: 300;
  margin: 27px 32px 24px 16px;
  color: var(--ion-color-secondary);
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
