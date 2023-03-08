<template>
  <div
    class="inputs-form"
    :class="{ 'inputs-form--footer-fixed': footerFixed }"
  >
    <div class="form-row">
      <ion-label class="label"> Choose photos for gym </ion-label>
      <photos-loader
        @upload="uploadPhoto"
        @delete="deletePhoto"
        @change="uploadPhoto"
        :circle-shape="false"
        :photos="facilityPhotos"
        :loading="photoOnLoad"
        :progress="percentPhotoLoaded"
      />
    </div>

    <div class="form-row">
      <base-input
        required
        @change="facilityTitleChange"
        v-model:value="facilityTitle"
        placeholder="Enter title for gym"
        label="What’s the name of your gym"
      />
    </div>

    <div class="form-row">
      <base-input
        :rows="3"
        :maxlength="150"
        label="Describe your gym"
        @change="facilityDescriptionChange"
        v-model:value="facilityDescription"
        placeholder="Enter description for gym"
      />
    </div>

    <div class="form-row">
      <ion-label class="label"> Choose your gym location </ion-label>
      <choose-block
        title="State"
        class="form-row__control"
        @handle-click="chooseState"
        :value="selectedState?.name"
      />
      <choose-block
        title="City"
        class="form-row__control"
        @handle-click="chooseCity"
        :value="selectedCity?.name"
        :disabled="!selectedState"
      />
      <choose-block
        title="Address"
        class="form-row__control"
        @handle-click="chooseAddress"
        :disabled="!selectedCity"
        :value="
          selectedAddress
            ? `${selectedAddress.thoroughfare} ${selectedAddress.subThoroughfare}`
            : ''
        "
      />
    </div>

    <div class="form-row">
      <ion-label class="label"> Choose equipment and amenitites </ion-label>
      <choose-block
        title="Equipment and amenities"
        @handle-click="onChooseAmenities"
        :value="facilityEquipments?.length + facilityAmenities?.length || ''"
      />
    </div>

    <div
      class="actions-wrapper"
      :class="{ 'actions-wrapper--fixed': footerFixed }"
    >
      <ion-button
        expand="block"
        class="secondary"
        @click="onPreview"
        v-if="previewButton"
        :disabled="
          !facilityTitle?.length || !facilityPhotos?.length || !selectedAddress
        "
      >
        Preview
      </ion-button>
      <ion-button
        expand="block"
        @click="onConfirm"
        :disabled="
          !facilityTitle?.length || !facilityPhotos?.length || !selectedAddress
        "
      >
        {{ buttonText }}
      </ion-button>
    </div>
  </div>
  <choose-address-modal ref="chooseAddressModal" @select="addressSelected" />
  <equipment-and-amenities
    ref="equipmentAndAmenitiessModal"
    @cancel="equipmentAndAmenitiessSelected"
  />
</template>

<script setup lang="ts">
import { IonLabel, IonButton } from "@ionic/vue";
import PhotosLoader from "@/general/components/PhotosLoader.vue";
import { EntitiesEnum } from "@/const/entities";
import {
  ref,
  computed,
  defineEmits,
  withDefaults,
  defineProps,
  defineExpose,
} from "vue";
import { useRouter } from "vue-router";
import ChooseAddressModal from "@/general/components/ChooseAddressModal.vue";
import { FilePreloadDocument } from "@/generated/graphql";
import { ChooseAddresModalResult } from "@/interfaces/ChooseAddressModalOption";
import { v4 as uuidv4 } from "uuid";
import { dataURItoFile } from "@/utils/fileUtils";
import { useMutation } from "@vue/apollo-composable";
import { useNewFacilityStore } from "../store/new-facility";
import EquipmentAndAmenities from "@/general/views/EquipmentAndAmenities.vue";
import { EquipmentAndAmenitiesModalResult } from "@/interfaces/EquipmentAndAmenitiesModal";
import { newFacilityStoreTypes } from "@/ts/types/store";
import { CheckboxValueType } from "@/ts/types/checkbox-value";

const props = withDefaults(
  defineProps<{
    buttonText?: string;
    previewButton?: boolean;
    footerFixed?: boolean;
    edit?: boolean;
  }>(),
  {
    buttonText: "Save",
  }
);

const router = useRouter();

const store = useNewFacilityStore();

const emits = defineEmits<{
  (e: "submit", data?: newFacilityStoreTypes): void;
  (e: "on-delete-media", id: string): void;
}>();

const facilityPhotos = computed(() => store.photos);

const facilityTitle = computed(() => store.title);
const facilityTitleChange = (value: string) => {
  store.setTitle(value);
};

const facilityDescription = computed(() => store.description);
const facilityDescriptionChange = (value: string) => {
  store.setDescription(value);
};

const facilityEquipments = computed(() => store.equipments);
const facilityAmenities = computed(() => store.amenities);

const equipmentAndAmenitiessModal = ref<typeof EquipmentAndAmenities | null>(
  null
);
const equipmentAndAmenitiessSelected = (
  result: EquipmentAndAmenitiesModalResult
) => {
  store.setEquipments(result.equipments || []);
  store.setAmenities(result.amenities || []);
};

const selectedState = computed(() => store.address.state);
const selectedCity = computed(() => store.address.city);
const selectedAddress = computed(() => store.address.address);

const onChooseAmenities = () => {
  equipmentAndAmenitiessModal.value?.present({
    title: "Amenities",
    equipments: store.getEquipments.map(
      (option: CheckboxValueType) => option.id as string
    ),
    amenities: store.getAmenities.map(
      (option: CheckboxValueType) => option.id as string
    ),
  });
};

const chooseAddressModal = ref<typeof ChooseAddressModal | null>(null);

const chooseState = () => {
  chooseAddressModal.value?.present({
    type: EntitiesEnum.State,
    title: "Select state",
    selected: selectedState.value?.id,
  });
};

const chooseCity = () => {
  chooseAddressModal.value?.present({
    type: EntitiesEnum.City,
    title: "Select city",
    selected: selectedCity.value?.id,
    state: selectedState.value,
  });
};

const chooseAddress = () => {
  chooseAddressModal.value?.present({
    type: EntitiesEnum.Address,
    title: "Choose your address",
    selected: selectedAddress.value?.latitude
      ? {
          lat: Number(selectedAddress.value?.latitude),
          lng: Number(selectedAddress.value?.longitude),
        }
      : null,
    state: selectedState.value,
    city: selectedCity.value,
  });
};

const addressSelected = (selected: ChooseAddresModalResult) => {
  store.setAddress(selected.state, selected.city, selected.address);
};

const photoOnLoad = ref<boolean>(false);
const percentPhotoLoaded = ref<number | undefined>();

const uploadPhoto = async (photo: string, index?: number) => {
  const file = dataURItoFile(photo, uuidv4());
  photoOnLoad.value = true;
  percentPhotoLoaded.value = 0;
  await filePreload({ file })
    .then((res) => {
      store.addPhoto(
        {
          path: res?.data.filePreload.path,
          url: `${process.env.VUE_APP_MEDIA_URL}${res?.data.filePreload.path}`,
        },
        index
      );
      photoOnLoad.value = false;
      percentPhotoLoaded.value = undefined;
    })
    .catch((error) => {
      console.error(error);
      abort();
      photoOnLoad.value = false;
      percentPhotoLoaded.value = undefined;
    });
};

let abort: any;

const { mutate: filePreload } = useMutation(FilePreloadDocument, {
  context: {
    fetchOptions: {
      useUpload: true,
      onProgress: (ev: ProgressEvent) => {
        percentPhotoLoaded.value = (ev.loaded / ev.total) * 100;
      },
      onAbortPossible: (abortHandler: any) => {
        abort = abortHandler;
      },
    },
  },
});

const deletePhoto = (index: number, id: string) => {
  store.deletePhoto(index);
  if (props.edit && id) {
    emits("on-delete-media", id);
  }
};

const onPreview = () => {
  router.push({ name: EntitiesEnum.FacilityPreview });
};

const onConfirm = () => {
  emits("submit", {
    title: facilityTitle.value,
    description: facilityDescription.value,
    photos: facilityPhotos.value,
    address: {
      state: selectedState.value,
      city: selectedCity.value,
      address: selectedAddress.value,
    },
    equipments: facilityEquipments.value,
    amenities: facilityAmenities.value,
  });
};

const clearStore = () => {
  store.clear();
};

defineExpose({
  clearStore,
});
</script>

<style scoped lang="scss">
.form-row {
  &__control {
    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}

.inputs-form {
  &--footer-fixed {
    padding-bottom: calc(48px + var(--ion-safe-area-bottom));
  }
}

.actions-wrapper {
  display: flex;
  margin: 0 -8px;
  justify-content: space-between;

  &--fixed {
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 25;
    position: fixed;
    padding: 0 24px calc(16px + var(--ion-safe-area-bottom));
  }

  .button {
    margin: 0 8px;
    flex: 1 1 calc(59% - 16px);

    &.secondary {
      flex: 1 1 calc(41% - 16px);
      --background: var(--gray-800);
    }
  }
}
</style>
