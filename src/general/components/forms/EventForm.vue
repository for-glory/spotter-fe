<template>
  <div class="create-event" v-if="!Capacitor.isNativePlatform()">
    <div class="form-row">
      <ion-label class="label"> Choose photos for event </ion-label>
      <photos-loader
        @upload="uploadPhoto"
        @delete="deletePhoto"
        @change="uploadPhoto"
        :circle-shape="false"
        :photos="eventPhotos"
        :loading="photoOnLoad"
        :progress="percentPhotoLoaded"
        :disabled="mediaDeleting || loading"
      />
    </div>

    <div class="form-row">
      <base-input
        required
        :disabled="loading"
        @change="eventTitleChange"
        v-model:value="eventTitle"
        label="Event name"
        placeholder="Enter event name"
      />
    </div>

    <div class="form-row">
      <base-input
        type="number"
        :disabled="loading"
        @change="eventPriceChange"
        v-model:value="eventPrice"
        label="Entry fee"
        placeholder="Set entry fee"
      />
    </div>

    <div class="form-row">
      <ion-label class="label"> Choose equioment and amenitites </ion-label>
      <choose-block
        :disabled="loading"
        title="Equipment and amenities"
        @handle-click="onChooseAmenities"
        :value="
          eventEquipments.length + eventAmenities.length > 0
            ? String(eventEquipments.length + eventAmenities.length)
            : ''
        "
      />
    </div>

    <template v-if="!edit">
      <div class="form-row">
        <ion-label class="label"> Venue </ion-label>
        <choose-block
          title="Location"
          :disabled="loading"
          class="form-row__control"
          @handle-click="onChooseLocation"
          :value="selectedState?.name + ', ' + selectedCity?.country?.name"
        />
      </div>
    </template>

    <div class="form-row">
      <base-input
        :rows="3"
        :maxlength="150"
        :disabled="loading"
        label="Event description"
        @change="eventDescriptionChange"
        v-model:value="eventDescription"
        placeholder="Enter a description"
      />
    </div>

    <template v-if="!edit">
      <div class="form-row">
        <base-input
          type="number"
          :disabled="loading"
          @change="eventMaxParticipantsChange"
          v-model:value="eventMaxParticipants"
          placeholder="Capacity"
          label="Set the max participants for event"
        />
      </div>

      <div class="form-row">
        <base-input
          type="number"
          :disabled="loading"
          label="Discount"
          placeholder="Enter discount value"
        />
      </div>

      <div class="form-row">
        <ion-label class="label"> Start date </ion-label>
        <choose-block
          title="Start date"
          :value="eventStartDate ? dayjs(eventStartDate).format('D MMMM') : ''"
          @handle-click="
            showDatePikerModal(DateFieldsEnum.StartDate, eventStartDate, {
              title: 'Start date',
            })
          "
          :disabled="loading"
        />
      </div>

      <div class="form-row">
        <ion-label class="label"> End date </ion-label>
        <choose-block
          title="End date"
          :disabled="!eventStartDate || loading"
          :value="eventEndDate ? dayjs(eventEndDate).format('D MMMM') : ''"
          @handle-click="
            showDatePikerModal(DateFieldsEnum.EndDate, eventEndDate, {
              min: eventStartDate ?? undefined,
              title: 'End date',
            })
          "
        />
      </div>
    </template>

    <div class="holder-button">
      <ion-button
        expand="block"
        class="secondary"
        v-if="hasSkipButton"
        @click="onSkip"
      >
        {{ skipText }}
      </ion-button>
      <ion-button
        class="button"
        expand="block"
        @click="submitEvent"
        :disabled="loading || invalid || mediaDeleting"
      >
        <template v-if="!loading">{{ submitButtonText }}</template>
        <ion-spinner v-else name="lines" />
      </ion-button>
    </div>
  </div>
  <div class="create-event" v-else>
    <div class="form-row">
      <ion-label class="label"> Choose photos for event </ion-label>
      <photos-loader
        @upload="uploadPhoto"
        @delete="deletePhoto"
        @change="uploadPhoto"
        :circle-shape="false"
        :photos="eventPhotos"
        :loading="photoOnLoad"
        :progress="percentPhotoLoaded"
        :disabled="mediaDeleting || loading"
      />
    </div>

    <div class="form-row">
      <base-input
        required
        :disabled="loading"
        @change="eventTitleChange"
        v-model:value="eventTitle"
        label="Event name"
        placeholder="Enter event name"
      />
    </div>

    <div class="form-row">
      <base-input
        type="number"
        :disabled="loading"
        @change="eventPriceChange"
        v-model:value="eventPrice"
        label="Entry fee"
        placeholder="Set entry fee"
      />
    </div>

    <div class="form-row">
      <ion-label class="label"> Choose equioment and amenitites </ion-label>
      <choose-block
        :disabled="loading"
        title="Equipment and amenities"
        @handle-click="onChooseAmenities"
        :value="
          eventEquipments.length + eventAmenities.length > 0
            ? String(eventEquipments.length + eventAmenities.length)
            : ''
        "
      />
    </div>

    <template v-if="!edit">
      <div class="form-row">
        <ion-label class="label"> Venue </ion-label>
        <choose-block
          title="Location"
          :disabled="loading"
          class="form-row__control"
          @handle-click="onChooseLocation"
          :value="selectedState?.name + ', ' + selectedCity?.name"
        />
      </div>
    </template>

    <div class="form-row">
      <base-input
        :rows="3"
        :maxlength="150"
        :disabled="loading"
        label="Event description"
        @change="eventDescriptionChange"
        v-model:value="eventDescription"
        placeholder="Enter a description"
      />
    </div>

    <template v-if="!edit">
      <div class="form-row">
        <base-input
          type="number"
          :disabled="loading"
          @change="eventMaxParticipantsChange"
          v-model:value="eventMaxParticipants"
          placeholder="Capacity"
          label="Set the max participants for event"
        />
      </div>

      <div class="form-row">
        <base-input
          :disabled="loading"
          label="Discount"
          placeholder="Enter discount value"
        />
      </div>

      <div class="form-row">
        <ion-label class="label"> Start date </ion-label>
        <choose-block
          title="Start date"
          :value="eventStartDate ? dayjs(eventStartDate).format('D MMMM') : ''"
          @handle-click="
            showDatePikerModal(DateFieldsEnum.StartDate, eventStartDate, {
              title: 'Start date',
            })
          "
          :disabled="loading"
        />
      </div>

      <div class="form-row">
        <ion-label class="label"> End date </ion-label>
        <choose-block
          title="End date"
          :disabled="!eventStartDate || loading"
          :value="eventEndDate ? dayjs(eventEndDate).format('D MMMM') : ''"
          @handle-click="
            showDatePikerModal(DateFieldsEnum.EndDate, eventEndDate, {
              min: eventStartDate ?? undefined,
              title: 'End date',
            })
          "
        />
      </div>
    </template>

    <div class="holder-button">
      <ion-button
        expand="block"
        class="secondary"
        v-if="hasSkipButton"
        @click="onSkip"
      >
        {{ skipText }}
      </ion-button>
      <ion-button
        class="button"
        expand="block"
        @click="submitEvent"
        :disabled="loading || invalid || mediaDeleting"
      >
        <template v-if="!loading">{{ submitButtonText }}</template>
        <ion-spinner v-else name="lines" />
      </ion-button>
    </div>
  </div>

  <choose-address-modal ref="chooseAddressModal" @select="addressSelected" />
  <date-picker-modal ref="datePickerModal" @select="dateSelected" />
  <equipment-and-amenities
    ref="equipmentAndAmenitiessModal"
    @cancel="equipmentAndAmenitiessSelected"
  />
</template>

<script lang="ts" setup>
import PhotosLoader from "@/general/components/PhotosLoader.vue";
import BaseInput from "@/general/components/base/BaseInput.vue";
import WheelPicker from "@/general/components/blocks/WheelPicker.vue";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import {
  IonButton,
  IonLabel,
  PickerColumnOption,
  IonSpinner,
  toastController,
} from "@ionic/vue";
import {
  inject,
  ref,
  computed,
  defineEmits,
  defineProps,
  defineExpose,
  watch,
  withDefaults,
} from "vue";
import { minutesDuration } from "@/const/minutes-durations";
import { hoursDuration } from "@/const/hours-durations";
import { Emitter, EventType } from "mitt";
import EquipmentAndAmenities from "@/general/views/EquipmentAndAmenities.vue";
import { dataURItoFile } from "@/utils/fileUtils";
import { v4 as uuidv4 } from "uuid";
import {
  CreateEventInput,
  FilePreloadDocument,
  DeleteMediaDocument,
  CitiesDocument,
} from "@/generated/graphql";
import { useLazyQuery, useMutation } from "@vue/apollo-composable";
import { useNewEventStore } from "@/general/stores/new-event";
import ChooseAddressModal from "@/general/components/ChooseAddressModal.vue";
import DatePickerModal from "@/general/components/DatePickerModal.vue";
import { ChooseAddresModalResult } from "@/interfaces/ChooseAddressModalOption";
import {
  DatePickerModalResult,
  DatePickerOptions,
} from "@/interfaces/DatePickerModal";
import { EntitiesEnum } from "@/const/entities";
import dayjs from "dayjs";
import { EquipmentAndAmenitiesModalResult } from "@/interfaces/EquipmentAndAmenitiesModal";
import {
  NativeGeocoderResult,
} from "@awesome-cordova-plugins/native-geocoder";
import { Capacitor } from '@capacitor/core';
import { useRouter } from "vue-router";

enum DateFieldsEnum {
  StartDate = "START_DATE",
  EndDate = "END_DATE",
}

const emits = defineEmits<{
  (e: "submit", data?: any): void;
  (e: "onSkip", params?: any): void;
}>();

const props = withDefaults(
  defineProps<{
    edit?: boolean;
    loading?: boolean;
    data?: CreateEventInput | any;
    submitButtonText?: string;
    skipText?: string;
    hasSkipButton?: boolean;
  }>(),
  {
    submitButtonText: "Create",
  }
);

watch(
  () => props.data,
  (newVal) => {
    if (!newVal) return;
    store.setTitle(newVal.title ?? "");
    store.setDescription(newVal.description ?? "");
    store.setPhotos(newVal.photos ?? []);
    store.setEquipments(newVal.equipments ?? []);
    store.setAmenities(newVal.amenities ?? []);
  }
);

const { load: getCities, refetch: getCityByName } = useLazyQuery(
  CitiesDocument,
  {
    first: 15,
    name: "",
    state_code: "",
  }
);
getCities();

const store = useNewEventStore();

const router = useRouter();

const eventPhotos = computed(() => store.photos);

const eventTitle = computed(() => store.title);
const eventTitleChange = (value: string) => {
  store.setTitle(value);
};

const eventDescription = computed(() => store.description);
const eventDescriptionChange = (value: string) => {
  store.setDescription(value);
};

const selectedState = computed(() => store.address.state);
const selectedCity = computed(() => store.address.city);
const selectedAddress = computed(() => store.address.address);
console.log({selectedCity});
console.log({selectedState});

const eventStartDate = computed(() => store.start_date);
const eventEndDate = computed(() => store.end_date);
const eventStartTime = computed(() => store.start_time);
const eventEndTime = computed(() => store.end_time);

const eventEquipments = computed(() => store.equipments);
const eventAmenities = computed(() => store.amenities);

const eventMaxParticipants = computed(() =>
  store.max_participants !== null ? String(store.max_participants) : ""
);
const eventMaxParticipantsChange = (value: string) => {
  store.setMaxParticipants(value?.length ? Number(value) : null);
};

const eventPrice = computed(() =>
  store.price !== null ? String(store.price / 100) : ""
);
const eventPriceChange = (value: string) => {
  store.setPrice(value?.length ? Number(value) * 100 : null);
};

const photoOnLoad = ref<boolean>(false);
const percentPhotoLoaded = ref<number | undefined>();
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

const uploadPhoto = async (photo: string, index?: number, id?: string) => {
  const file = dataURItoFile(photo, uuidv4());
  photoOnLoad.value = true;
  percentPhotoLoaded.value = 0;

  if (id) {
    deleteMedia({ id });
  }

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

const { mutate: deleteMedia, loading: mediaDeleting } =
  useMutation(DeleteMediaDocument);

const deletePhoto = (index: number, id?: string) => {
  if (!props.edit) {
    store.deletePhoto(index);
  } else {
    deleteMedia({ id }).then(() => {
      store.deletePhoto(index);
    });
  }
};

const chooseAddressModal = ref<typeof ChooseAddressModal | null>(null);

const onChooseLocation = () => {
  router.push({
    name: EntitiesEnum.ChooseLocation, 
    params: { type: 'event' }
  });
}

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

const datePickerModal = ref<typeof DatePickerModal | null>(null);

const showDatePikerModal = (
  field: string,
  value?: number | null,
  options?: DatePickerOptions
) => {
  datePickerModal.value?.present({ field, value, options });
};

const dateSelected = (result: DatePickerModalResult) => {
  switch (result.field) {
    case DateFieldsEnum.StartDate:
      store.setStartDate(result.date);
      if (
        eventEndDate.value &&
        (!result.date || result.date > eventEndDate.value)
      ) {
        store.setEndDate(null);
      }
      break;

    case DateFieldsEnum.EndDate:
      store.setEndDate(result.date);
      break;

    default:
      break;
  }
};

const openPicker = (name: string): void => {
  emitter?.emit("open-picker", name);
};

const hours = hoursDuration();
const minutes = minutesDuration(5, 60, 0);

const emitter: Emitter<Record<EventType, unknown>> | undefined =
  inject("emitter");

const timePickerColums = [
  {
    name: "hours",
    options: hours,
  },
  {
    name: "minutes",
    options: minutes,
  },
  {
    name: "time",
    options: [
      {
        text: "AM",
        value: "AM",
      },
      {
        text: "PM",
        value: "PM",
      },
    ],
  },
];

const startTimeOptions = {
  columns: timePickerColums,
  buttons: [
    {
      text: "Cancel",
      role: "cancel",
    },
    {
      text: "Choose time",
      handler: (value: PickerColumnOption) => {
        const minutes =
          value.minutes?.value && Number(value.minutes.value) < 10
            ? `0` + value.minutes?.value
            : value.minutes?.value;
        store.setStartTime(
          `${value.hours?.value}:${minutes} ${value.time?.value}`
        );
      },
    },
  ],
};

const endTimeOptions = {
  columns: timePickerColums,
  buttons: [
    {
      text: "Cancel",
      role: "cancel",
    },
    {
      text: "Choose time",
      handler: (value: PickerColumnOption) => {
        const minutes =
          value.minutes?.value && Number(value.minutes.value) < 10
            ? `0` + value.minutes?.value
            : value.minutes?.value;
        store.setEndTime(
          `${value.hours?.value}:${minutes} ${value.time?.value}`
        );
      },
    },
  ],
};

const equipmentAndAmenitiessModal = ref<typeof EquipmentAndAmenities | null>(
  null
);
const equipmentAndAmenitiessSelected = (
  result: EquipmentAndAmenitiesModalResult
) => {
  store.setEquipments(result.equipments || []);
  store.setAmenities(result.amenities || []);
};

const onChooseAmenities = () => {
  equipmentAndAmenitiessModal.value?.present({
    title: "Amenities",
    equipments: eventEquipments.value.map((equipment) => equipment.id),
    amenities: eventAmenities.value.map((amenity) => amenity.id),
  });
};

const invalid = computed<boolean>(
  () =>
    !eventTitle.value?.length ||
    (!props.edit &&
      (!eventStartDate.value ||
        !selectedState.value ||
        !selectedCity.value ||
        !selectedAddress.value ||
        !eventEndDate.value ||
        !eventMaxParticipants.value))
);

const submitEvent = async () => {
  if (
    !props.edit &&
    formatTime(eventStartDate.value as number, eventStartTime.value) >=
      formatTime(eventEndDate.value as number, eventEndTime.value)
  ) {
    const toast = await toastController.create({
      message: "Check start/end dates",
      duration: 2000,
      icon: "assets/icon/info.svg",
      cssClass: "danger-toast",
    });
    toast.present();
    return;
  }

  const data = !props.edit
    ? {
        title: eventTitle.value,
        description: eventDescription.value,
        start_date: formatTime(
          eventStartDate.value as number,
          eventStartTime.value
        ),
        end_date: formatTime(eventEndDate.value as number, eventEndTime.value),
        price: Number(store.price),
        address: {
          lat: selectedAddress.value?.latitude
            ? Number(selectedAddress.value.latitude)
            : 34.034744,
          lng: selectedAddress.value?.longitude
            ? Number(selectedAddress.value.longitude)
            : -118.2381,
          street: `${
            selectedAddress.value?.thoroughfare
              ? selectedAddress.value?.thoroughfare + ", "
              : ""
          }${selectedAddress.value?.subThoroughfare || ""}`,
          city_id: selectedCity.value?.id,
        },
        max_participants: store.max_participants,
        equipments: eventEquipments.value.map((equipment) => equipment.id),
        amenities: eventAmenities.value.map((amenity) => amenity.id),
        media: eventPhotos.value?.map((photo, index) => {
          return {
            title: `${eventTitle.value
              .replace(/\s/g, "")
              .toLowerCase()}-${index}`,
            file: photo.path,
          };
        }),
      }
    : {
        title: eventTitle.value,
        description: eventDescription.value,
        equipments: eventEquipments.value.map((equipment) => equipment.id),
        amenities: eventAmenities.value.map((amenity) => amenity.id),
        media: eventPhotos.value
          ?.map((photo, index) => {
            return {
              title: `${eventTitle.value
                .replace(/\s/g, "")
                .toLowerCase()}-${index}`,
              file: photo.path,
            };
          })
          .filter((photo) => photo.file),
      };

  emits("submit", data);
};
const onSkip = () => {
  emits("onSkip");
}

const formatTime = (date: number, time: string): string => {
  return dayjs(date)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0)
    .format("YYYY-MM-DD HH:mm:ss");
};

const clearStore = () => {
  store.clear();
};

defineExpose({
  clearStore,
});
</script>

<style lang="scss">
.form-row {
  &__control {
    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}

.holder-button {
  display: flex;
  gap: 16px;

  .button {
    margin: 0;
  }
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
