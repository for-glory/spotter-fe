<template>
  <div class="create-event">
    <ion-grid>
      <ion-row>
        <ion-col offset="2">
          <div class="form-row">
            <ion-label class="label"> Choose cover for event </ion-label>
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
        </ion-col>
      </ion-row>
      <ion-row>
        
        <ion-col offset="2" size="4">
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
        </ion-col>
        
        <ion-col  size="4">
          <div class="form-row">
            <base-input
              type="text"
              :disabled="loading"
              @change="eventPriceChange"
              v-model:value="eventPrice"
              label="Entry fee(USD $)"
              placeholder="Set entry fee"
            />
          </div>
        </ion-col>
        <ion-col  offset="2" size="4">
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
        </ion-col>
        <ion-col  size="4">
           <template v-if="true">
            
            <ion-label class="label"> Venus </ion-label>
      <div class="form-row">
        <choose-block
          title="Venue"
          class="form-row__control"
          @handle-click="onChooseLocation"
          :value="
            selectedAddress
              ? `${selectedAddress?.thoroughfare} ${selectedAddress?.subThoroughfare}`
              : ''
          "
        />
      </div>
    </template>
        </ion-col>

        
    <template v-if="true"> 
        <ion-col offset="2" size="4">
      <div class="form-row">
        <base-input
          type="text"
          :disabled="loading"
          @change="eventMaxParticipantsChange"
          v-model:value="eventMaxParticipants"
          placeholder="Capacity"
          label="Set the max participants for event"
        />
      </div>
            </ion-col>
        <ion-col  size="4">

      <div class="form-row">
        <base-input
          type="text"
          :disabled="loading"
          label="Discount (optional)"
          placeholder="Enter discount value"
        />
      </div>
            </ion-col>
        <ion-col offset="2"  size="4">

      <div class="form-row">
        <ion-label class="label"> Choose date of event </ion-label>
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
            </ion-col>
        <ion-col  size="4">

            <div class="form-row">
        <ion-label class="label"> End date </ion-label>
        <choose-block
          title="End date"
          :disabled="!eventStartDate || !eventStartTime || loading"
          :value="eventEndDate ? dayjs(eventEndDate).format('D MMMM') : ''"
          @handle-click="
            showDatePikerModal(DateFieldsEnum.EndDate, eventEndDate, {
              min: eventStartDate ?? undefined,
              title: 'End date',
            })
          "
        />
      </div>

            </ion-col>
        <ion-col  offset="2" size="4">
    
    <div class="form-row">
        <ion-label class="label"> Choose time of event </ion-label>
        <wheel-picker :options="startTimeOptions" name="startTime">
          <template #button>
            <choose-block
              title="Start time"
              :value="eventStartTime"
              :disabled="!eventStartDate || loading"
              @handle-click="openPicker('startTime')"
            />
          </template>
        </wheel-picker>
      </div>
     
            </ion-col>
        <ion-col  size="4">

      <div class="form-row">
        <ion-label class="label"> Choose end time </ion-label>
        <wheel-picker :options="endTimeOptions" name="endTime">
          <template #button>
            <choose-block
              title="End time"
              :value="eventEndTime"
              :disabled="!eventEndDate || loading"
              @handle-click="openPicker('endTime')"
            />
          </template>
        </wheel-picker>
      </div>
            </ion-col>
        <ion-col offset="2" size="8">

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
            </ion-col>
            
    </template>
 
        
      </ion-row>
   
<ion-row class="btn">
    <!-- <div
      class="actions-wrapper"
      :class="{ 'actions-wrapper--fixed': footerFixed }"
    > -->
    <ion-button @click="onBack" >
      Cancel
    </ion-button>
      <ion-button style="margin-right: 14px;"
        expand="block"
        class="secondary"
        @click="submitEvent('exit')"
        fill="outline"
        :disabled="
          !eventTitle?.length || !eventPhotos?.length || !selectedAddress
        "
      >
        {{ saveButtonText || 'Save' }}
      </ion-button>
      <ion-button
        expand="block"
        @click="submitEvent('next')"
        v-if="nextButton"
        :disabled="
          !eventTitle?.length || !eventPhotos?.length || !selectedAddress
        "
      >
        {{ nextButtonText || 'Next' }}
      </ion-button>
    <!-- </div> -->
    </ion-row>
     </ion-grid>


     
  </div>
    <discard-changes
    :is-open="isConfirmedModalOpen"
    @close="discardModalClosed"
  />
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
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";

enum DateFieldsEnum {
  StartDate = "START_DATE",
  EndDate = "END_DATE",
}
const isConfirmedModalOpen = ref(false);
const onBack = () => {
  isConfirmedModalOpen.value = true;
};

const discardModalClosed = (approved: boolean) => {
  isConfirmedModalOpen.value = false;
  if (approved) {
    router.go(-1);
  }
};
const emits = defineEmits<{
  (e: "submit", data?: any, type?: string): void;
}>();

const props = withDefaults(
  defineProps<{
    edit?: boolean;
    loading?: boolean;
    data?: CreateEventInput | any;
    saveButtonText?: string;
    nextButtonText?: string;
    nextButton?: boolean;
    footerFixed?: boolean;
  }>(), {}
);

watch(
  () => props.data,
  (newVal) => {
    if (!newVal) return;
    store.setTitle(newVal.title ?? "");
    store.setPrice(newVal.price ?? "");
   // store.setAddress(newVal.address.state,newVal.address.city, newVal.address.address);
    store.setMaxParticipants(newVal.max_participants ?? "")
    store.setStartDate(newVal.start_date ?? "")
     store.setStartTime(newVal.start_time ?? "")
     store.setEndDate(newVal.end_date ?? "")
      store.setEndTime(newVal.end_time ?? "")
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
console.log(selectedAddress.value?.thoroughfare , 'address')
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

const submitEvent = async (type: string) => {
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
            ? Number(selectedAddress.value?.latitude)
            : 34.034744,
          lng: selectedAddress.value?.longitude
            ? Number(selectedAddress.value?.longitude)
            : -118.2381,
          street: `${
            selectedAddress.value?.thoroughfare
              ? selectedAddress.value?.thoroughfare + ", "
              : ""
          }${selectedAddress.value?.subThoroughfare || ""}`,
          city_id: selectedCity.value?.id,
        },
        max_participants: parseInt(eventMaxParticipants.value),
        equipments: eventEquipments.value.map((equipment) => equipment.id),
        amenities: eventAmenities.value.map((amenity) => amenity.id),
        media: eventPhotos.value?.map((photo, index) => {
          console.log(photo, 'photossss');
          return {
            title: `${eventTitle.value
              .replace(/\s/g, "")
              .toLowerCase()}-${index}`,
            file: photo.url,
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
             console.log(photo, 'photossss');
            return {
              title: `${eventTitle.value
                .replace(/\s/g, "")
                .toLowerCase()}-${index}`,
              file: photo.url,
            };
          })
          .filter((photo) => photo.file),
      };

  emits("submit", {
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
            ? Number(selectedAddress.value?.latitude)
          : 34.034744,
        lng: selectedAddress.value?.longitude
          ? Number(selectedAddress.value?.longitude)
          : -118.2381,
        street: `${
          selectedAddress.value?.thoroughfare
            ? selectedAddress.value?.thoroughfare + ", "
            : ""
        }${selectedAddress.value?.subThoroughfare || ""}`,
        city_id: selectedCity.value?.id,
      },
      max_participants: parseInt(eventMaxParticipants.value),
      equipments: eventEquipments.value.map((equipment) => equipment.id),
      amenities: eventAmenities.value.map((amenity) => amenity.id),
      media: eventPhotos.value?.map((photo, index) => {
         console.log(photo, 'photossss');
        return {
          title: `${eventTitle.value
            .replace(/\s/g, "")
            .toLowerCase()}-${index}`,
          file: photo.url,
        };
      }),
  }, type);
};

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
  flex-direction: column;
  gap: 16px;
  width: 100%;

  .button {
    margin: 0;
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
}
.create-event {
    background: #333;;
    border-radius: 10px;
    padding: 20px;
    height: 1000px;
}
.btn {
  float: right;
  margin-right: 16%;
}
.label {
 color: var(--ion-color-white) !important;
}
ion-item.input-container {

  --border-color: var(--white-1000) !important;

}

.choose-place {
  border: 1px solid #fff !important;;
  border-radius: 8px  !important;
}
</style>