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
        placeholder="What's the name of your gym"
        label="Gym name"
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
      <choose-block
        title="Choose your gym location"
        class="form-row__control"
        @handle-click="onChooseLocation"
        :value="
          selectedAddress
            ? `${selectedAddress?.thoroughfare} ${selectedAddress?.subThoroughfare}`
            : ''
        "
      />
      <!-- <ion-label class="label"> Choose your gym location </ion-label>
      <choose-block
        title="Location"
        class="form-row__control"
        @handle-click="onChooseLocation"
        :value="selectedState?.name + ', ' + selectedCity?.name"
      /> -->
      <!-- <choose-block
        title="State"
        class="form-row__control"
        @handle-click="chooseState"
        :value="selectedState?.name"
      /> -->
      <!-- <choose-block
        title="City"
        class="form-row__control"
        @handle-click="chooseCity"
        :value="selectedCity?.name"
        :disabled="!selectedState"
      /> -->
      <!-- <choose-block
        title="Address"
        class="form-row__control"
        @handle-click="chooseAddress"
        :disabled="!selectedCity"
        :value="
          selectedAddress
            ? `${selectedAddress.thoroughfare} ${selectedAddress.subThoroughfare}`
            : ''
        "
      /> -->
      <!-- <div class="address-container">
        <ion-text class="address-content">
          Address
        </ion-text>
        <ion-text class="address-content" v-if="selectedAddress?.thoroughfare">
          {{ `${selectedAddress?.thoroughfare} ${selectedAddress?.subThoroughfare}` }},
          {{ `${selectedCity?.name}` }},
          {{ `${selectedCity?.state?.name}` }}
        </ion-text>
      </div>
      <GMapAutocomplete
          placeholder="Enter your address"
          class="search-form__control"
          :class="{
            'search-form__control--on-focus': isFocused,
          }"
          @place_changed="setPlace"
        >
      </GMapAutocomplete> -->
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
        @click="onSaveAndExit"
        fill="outline"
        :disabled="
          !facilityTitle?.length || !facilityPhotos?.length || !selectedAddress
        "
      >
        {{ saveButtonText }}
      </ion-button>
      <ion-button
        expand="block"
        @click="onNext"
        v-if="nextButton"
        :disabled="
          !facilityTitle?.length || !facilityPhotos?.length || !selectedAddress
        "
      >
        {{ nextButtonText }}
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
import { FilePreloadDocument, CitiesDocument } from "@/generated/graphql";
import { ChooseAddresModalResult } from "@/interfaces/ChooseAddressModalOption";
import { v4 as uuidv4 } from "uuid";
import { dataURItoFile } from "@/utils/fileUtils";
import { useLazyQuery, useMutation } from "@vue/apollo-composable";
import { useNewFacilityStore } from "../store/new-facility";
import EquipmentAndAmenities from "@/general/views/EquipmentAndAmenities.vue";
import { EquipmentAndAmenitiesModalResult } from "@/interfaces/EquipmentAndAmenitiesModal";
import { newFacilityStoreTypes } from "@/ts/types/store";
import { CheckboxValueType } from "@/ts/types/checkbox-value";
import {
  NativeGeocoderResult,
} from "@awesome-cordova-plugins/native-geocoder";

const { load: getCities, refetch: getCityByName } = useLazyQuery(
  CitiesDocument,
  {
    first: 15,
    name: "",
    state_code: "",
  }
);
getCities();

const props = withDefaults(
  defineProps<{
    saveButtonText?: string;
    nextButtonText?: string;
    nextButton?: boolean;
    footerFixed?: boolean;
    edit?: boolean;
  }>(),{
    edit: false
  }
);

const router = useRouter();

const store = useNewFacilityStore();

const emits = defineEmits<{
  (e: "submit", data?: newFacilityStoreTypes, mode?: string): void;
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

const onChooseLocation = () => {
  router.push({
    name: EntitiesEnum.ChooseLocation, 
    params: { type: 'facility' }
  });
}

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

const gmapObjToNativeGeocoderResultObject = (gmObj: any) => {
  let street_number =''
  let route =''
  const address:NativeGeocoderResult = {
    latitude: gmObj.geometry.location.lat().toString(),
    longitude: gmObj.geometry.location.lng().toString(),
    countryCode: '',
    countryName: '',
    postalCode: '',
    administrativeArea: '',
    subAdministrativeArea: '',
    locality: '',
    subLocality: '',
    thoroughfare: '',
    subThoroughfare: '',
    areasOfInterest: []
  }
  for (let i=0; i < gmObj.address_components.length; i++)
  {
    if(gmObj.address_components[i].types.includes("postal_code"))
    {
      address.postalCode = gmObj.address_components[i].long_name;
    }
    if(gmObj.address_components[i].types.includes("locality"))
    {
      address.locality = gmObj.address_components[i].long_name;
    }
    if(gmObj.address_components[i].types.includes("subLocality"))
    {
      address.subLocality = gmObj.address_components[i].long_name;
    }
    if(gmObj.address_components[i].types.includes("country"))
    {
      address.countryName = gmObj.address_components[i].long_name;
      address.countryCode = gmObj.address_components[i].short_name;
    }
    if(gmObj.address_components[i].types.includes("administrative_area_level_1"))
    {
      address.administrativeArea = gmObj.address_components[i].short_name;
    }
    if(gmObj.address_components[i].types.includes("administrative_area_level_2"))
    {
      address.subAdministrativeArea = gmObj.address_components[i].long_name;
    }
    if(gmObj.address_components[i].types.includes("street_number"))
    {
      street_number = gmObj.address_components[i].long_name;
    }
    if(gmObj.address_components[i].types.includes("route"))
    {
      route = gmObj.address_components[i].long_name;
    }
  }
  address.thoroughfare = street_number + " " + route
  return address;
}
const setPlace = (place: any) => {
  if (place) {
    console.log("selected place", selectedState.value, selectedCity.value, selectedAddress.value)
    const address = gmapObjToNativeGeocoderResultObject(place)
    if (address.locality) {
      getCityByName({
        first: 15,
        name: address.locality,
        state_code: address.administrativeArea,
      })?.then(async (res) => {
        const res_city = res.data.cities.data[0];
        console.log("selected city", res_city)
        store.setAddress(res_city.state, res_city, address);
      })
    }
  }
}

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

const onSaveAndExit = () => {
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
  }, "exit");
};

const onNext = () => {
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
  }, "create_event");
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
  flex-direction: column;
  margin: 0 -8px;
  gap: 16px;

  &--fixed {
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 25;
    position: fixed;
    padding: 0 24px calc(16px + var(--ion-safe-area-bottom));
  }

  ion-button {
    width: 100%;
  }
  // .button {
  //   margin: 0 8px;
  //   flex: 1 1 calc(59% - 16px);

  //   &.secondary {
  //     flex: 1 1 calc(41% - 16px);
  //     --background: var(--gray-800);
  //   }
  // }
}
.search-form {
  position: relative;
  padding: calc(16px + var(--ion-safe-area-top)) 24px 0;
  justify-content: flex-end;
  transition: background-color 0.35s ease;

  &--on-focus {
    background-color: var(--gray-800);
  }

  &__control {
    border: 1px solid;
    margin-top: 10px;
    padding: 0;
    width: 100%;
    z-index: 15;
    transition: right 0.35s ease;
    padding: 15px 20px 12px 20px;
    background: var(--gray-800);
    border-radius: var(--border-radius);
    --border-radius: 8px;
    --color: var(--ion-color-white);
    --placeholder-opacity: 1;
    --background: var(--gray-700);
    --placeholder-font-weight: 300;
    --placeholder-color: var(--gray-500);
    --box-shadow: inset 0 0 0 0.8px var(--gray-600);
  }
}
.address-container {
  display: flex;
  min-height: 48px;
  flex-direction: row;
  border-radius: 8px;
  align-items: center;
  padding: 8px 16px 8px;
  background: var(--gray-700);
  justify-content: space-between;
}
.address-content {
  font-weight: 300;
  font-size: 14px;
  color: var(--ion-color-white);
}
</style>
