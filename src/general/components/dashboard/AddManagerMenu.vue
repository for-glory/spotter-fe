<template>
	<ion-menu menu-id="add-manager-menu" side="end" content-id="main-content"  class="add-manager-panel">
    <ion-header class="ion-no-border">
      <ion-toolbar class="title">
        <!-- <ion-menu-toggle slot="start" class="back-btn" :auto-hide="false" > -->
          <IonButton fill="clear" size="small" shape="round" slot="start" @click="onBack">
            <ion-icon src="assets/icon/arrow-back.svg"></ion-icon>
          </IonButton>
        <!-- </ion-menu-toggle> -->
        <ion-title>Invite Team Member</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="tile">
        <IonLabel>Choose profile photo</IonLabel>
        <photos-loader />
      </div>
      <div class="tile">
        <base-input
          label="Full name"
          gray-input
          placeholder="First name, Last name"
          name="first-last-name"
          class="form-row__control"
          required
        />
      </div>
      <!-- <div class="tile">
        <base-input
          label="Last name"
          v-model:value="lastName"
          :error-message="lastNameError"
          placeholder="Last Name"
          name="lastName"
          class="form-row__control"
          required
        />
      </div> -->
      <div class="tile">
        <base-input
          label="Email"
          gray-input
          v-model:value="emailInput"
          :error-message="emailInputError"
          type="email"
          placeholder="Enter email address"
        />
      </div>
      <div class="tile">
        <base-input
          label="Phone"
          gray-input
          v-model:value="postal"
          name="phone"
          class="form-row__control"
          placeholder="Enter phone number"
        />
      </div>
      <div class="tile">
        <ion-label>Date Of Birth</ion-label>
        <!-- <ion-input placeholder="DD/MM/YY"
          :value="eventStartDate ? dayjs(eventStartDate).format('D MMMM') : ''"
          @click="
            showDatePikerModal(DateFieldsEnum.StartDate, eventStartDate, {
              title: 'Start date',
            })
          "
        ></ion-input> -->
        <!-- <base-input
          v-model:value="birth"
          type="date"
          name="birth"
          class="form-row__control"
        /> -->
        <!-- <ion-item class="address-input ion-no-padding" lines="none"> -->
          <choose-block
            title="Date of birth" add-border is-light-item
            end-icon-color="var(--gray-500)"
            :value="birth ? dayjs(birth).format('D MMMM') : ''"
            @handle-click="showDatePikerModal(DateFieldsEnum.birth, {title: 'Date of birth',})"
          />
        <!-- </ion-item> -->
      </div>
      <div class="tile">
         <ion-label>Address</ion-label>
        <ChooseBlock title="Address" end-icon-color="var(--gray-500)" add-border :value="selectedAddress" @handle-click="openLocationModal" :isLightItem="true" />
        <!-- <ion-item class="address-input" lines="none">
          <GMapAutocomplete
            placeholder="Enter your address"
            class="search-form__control form-row__control"
            @place_changed="setPlace"
          >
          </GMapAutocomplete>
        </ion-item>  -->
      </div>
      <div class="tile">
        <CustomSelection choose-block 
                        border-color="var(--gray-600)"
                        active-bg-color="var(--gray-700)"
                        label="Employment Type" 
                        placeholder="Full Time" 
                        :selected-value="selectedEmpType"
                        @select-change="(e) => selectedEmpType = e"
                        :options="empOptions" />
        <!-- <ion-item class="address-input" lines="none"> -->
          <!-- <ion-input placeholder="Full Time"></ion-input> -->
          <!-- <ion-select
            interface="popover"
            placeholder="Select type"
          >
            <ion-select-option>Full Time</ion-select-option>
            <ion-select-option>Contract</ion-select-option>
          </ion-select>
        </ion-item> -->
      </div>
      <div class="tile">
        <base-input
          label="Tax ID"
          gray-input
          v-model:value="taxId"
          placeholder="Enter Tax ID"
          name="taxId"
          class="form-row__control"
        />
      </div>
      <ion-menu-toggle>
        <ion-button class="add-manager-btn" @click="addManager">Save</ion-button>
      </ion-menu-toggle>
    </ion-content>
  </ion-menu>
  <ChooseLocationModal ref="chooseLocationModal" title="Address" :forAddress="true" :is-web-view="true" @select="addressSelected" />
  <!-- <date-picker-modal ref="datePickerModal" @select="dateSelected" /> -->
  <date-picker-modal ref="datePickerModal" @select="dateSelected" />
  <discard-changes
    :is-open="isConfirmedModalOpen"
    @close="discardModalClosed"
    title="Do you want to discard changes?"
    text="Changes will not be saved"
    cancelButton="Cancel"
    button="Discard changes"
  />
</template>

<script setup lang="ts">
import {
  IonButton,
  IonText,
  IonTitle,
  IonIcon,
  IonMenuToggle,
  IonInput,
  IonMenu,
  IonContent,
  IonToolbar,
  IonLabel,
  IonHeader,
  menuController,
  IonSelect,
  IonSelectOption,
  IonItem
} from "@ionic/vue";
import DatePickerModal from "@/general/components/DatePickerModal.vue";
import BaseInput from "@/general/components/base/BaseInput.vue";
import PhotosLoader from "@/general/components/PhotosLoader.vue";
import ChooseLocationModal from "@/facilities/components/ChooseLocationModal.vue";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import CustomSelection from "@/general/views/dashboard/settings/CustomSelection.vue";
import {
  FilePreloadDocument,
  EmploymentTypeEnum,
  CitiesDocument,
  RoleEnum,
  CreateManagerDocument
} from "@/generated/graphql";
import { useLazyQuery, useMutation } from "@vue/apollo-composable";
import { useField } from "vee-validate";
import { requiredFieldSchema, emailSchema } from "@/validations/authValidations";
import { City, State } from "@/generated/graphql";
import PhotoLoader from "@/general/components/blocks/PhotoLoader.vue";
import { ref, toRef, computed } from "vue";
import { useRouter } from "vue-router";
import useId from "@/hooks/useId";
import useFacilityId from "@/hooks/useFacilityId";
import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";
import { dataURItoFile } from "@/utils/fileUtils";
import { v4 as uuidv4 } from "uuid";
import { toastController } from "@ionic/vue";
import {
  DatePickerModalResult,
  DatePickerOptions,
} from "@/interfaces/DatePickerModal";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import {
  NativeGeocoderResult,
} from "@awesome-cordova-plugins/native-geocoder";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";

interface MenuCustomEvent<T = any> extends CustomEvent {
  detail: T;
  target: HTMLIonMenuElement;
}
enum DateFieldsEnum {
  birth = "BIRTH_DATE"
}
const isConfirmedModalOpen = ref(false);
const selectedEmpType = ref(null)
const empOptions = [
  {
    title: "Full Time",
    value: "Full Time"
  },
  {
    title: "Contract",
    value: "Contract"
  }
];

const datePickerModal = ref<typeof DatePickerModal | null>(null);
const chooseLocationModal = ref<typeof ChooseLocationModal | null>(null);
const filter = ref<string>('profile');
const imageUrl = ref<string>('');

const { id: myId } = useId();
const { id: myFacilityId } = useFacilityId();
const { role: myRole } = useRoles();

const { id } = JSON.parse(localStorage.getItem("user") || "{}");

const router = useRouter();
const currentFacility = useFacilityStore();

const selectedState = ref<State | null>(null);
const selectedCity = ref<City | null>(null);
const selectedAddress = ref<NativeGeocoderResult | null>(null);


const previewOnLoading = ref<boolean>(false);
const previewUrl = ref<string>("");
const previewPath = ref<string>("");
const percentLoaded = ref<number | undefined>();

const { value: firstName, errorMessage: firstNameError } = useField<string>(
  "firstName",
  requiredFieldSchema
);

const { value: lastName, errorMessage: lastNameError } = useField<string>(
  "lastName",
  requiredFieldSchema
);

const { value: emailInput, errorMessage: emailInputError, setValue: setEmailValue } = useField<string>(
  "email",
  emailSchema
);

const { value: postal } = useField<string>(
  "postal",
);

const { value: taxId } = useField<string>(
  "taxId",
);

const { value: birth } = useField<string>(
  "birth",
);

const isValidForm = computed(() => !emailInputError.value && emailInput.value);

let abort: any;

const { mutate: filePreload } = useMutation(FilePreloadDocument, {
  context: {
    fetchOptions: {
      useUpload: true,
      onProgress: (ev: ProgressEvent) => {
        percentLoaded.value = (ev.loaded / ev.total) * 100;
      },
      onAbortPossible: (abortHandler: any) => {
        abort = abortHandler;
      },
    },
  },
});

const { mutate } = useMutation(CreateManagerDocument);

const addManager = () => {
  console.log({
    avatar: previewPath.value,
    email: emailInput.value,
    facility_id: currentFacility.facility.id,
    first_name: firstName.value,
    last_name: lastName.value,
    role: RoleEnum.Manager,
    tax_id: taxId.value,
    postal: postal.value,
    birth: dayjs(birth.value).format("YYYY-MM-DD HH:mm:ss"),
  })
  if (isValidForm.value) {
    mutate({
      input: {
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
        avatar: previewPath.value,
        email: emailInput.value,
        facility_id: currentFacility.facility.id,
        first_name: firstName.value,
        last_name: lastName.value,
        role: RoleEnum.Manager,
        // employment_type: EmploymentTypeEnum.value,
        tax_id: taxId.value,
        postal: postal.value,
        birth: dayjs(birth.value).format("YYYY-MM-DD HH:mm:ss"),
      },
    })
      .then(async () => {
        const toast = await toastController.create({
          message: "Manager added!",
          duration: 2000,
          icon: "assets/icon/success.svg",
          cssClass: "success-toast",
        });
        toast.present();
      })
      .catch(async (error) => {
        const toast = await toastController.create({
          message:
            "failed!",
          duration: 2000,
          icon: "assets/icon/info.svg",
          cssClass: "warning-toast",
        });
        toast.present();
        console.error(error)
      });
  }
}

const addressSelected = () => {
  console.log("addressSelected");
}

const openLocationModal = () => {
  console.log('openLocationModal');  
  chooseLocationModal.value?.present({
    title: "Address",
  });
}
const removePhoto = () => {
  previewUrl.value = "";
};

const photoSelected = async (value: string): Promise<void> => {
  if (!value?.length) {
    removePhoto();

    return;
  }
  const file = dataURItoFile(value, uuidv4());
  previewOnLoading.value = true;
  percentLoaded.value = 0;
  await filePreload({ file })
    .then((res) => {
      previewPath.value = res?.data.filePreload.path;
      previewUrl.value = `${process.env.VUE_APP_MEDIA_URL}${res?.data.filePreload.path}`;
      
      previewOnLoading.value = false;
      percentLoaded.value = undefined;
    })
    .catch(async (error) => {
      const toast = await toastController.create({
        message:
          "Image upload failed!",
        duration: 2000,
        icon: "assets/icon/info.svg",
        cssClass: "warning-toast",
      });
      toast.present();
      console.error(error);
      abort();
      previewOnLoading.value = false;
      percentLoaded.value = undefined;
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
  for (let i=0; i < gmObj?.address_components.length; i++)
  {
    if(gmObj?.address_components[i]?.types.includes("postal_code"))
    {
      address.postalCode = gmObj?.address_components[i]?.long_name;
    }
    if(gmObj?.address_components[i]?.types.includes("locality"))
    {
      address.locality = gmObj?.address_components[i]?.long_name;
    }
    if(gmObj?.address_components[i]?.types.includes("subLocality"))
    {
      address.subLocality = gmObj?.address_components[i]?.long_name;
    }
    if(gmObj?.address_components[i]?.types.includes("country"))
    {
      address.countryName = gmObj?.address_components[i]?.long_name;
      address.countryCode = gmObj?.address_components[i]?.short_name;
    }
    if(gmObj?.address_components[i]?.types.includes("administrative_area_level_1"))
    {
      address.administrativeArea = gmObj?.address_components[i]?.short_name;
    }
    if(gmObj?.address_components[i]?.types.includes("administrative_area_level_2"))
    {
      address.subAdministrativeArea = gmObj?.address_components[i]?.long_name;
    }
    if(gmObj?.address_components[i]?.types.includes("street_number"))
    {
      street_number = gmObj?.address_components[i]?.long_name;
    }
    if(gmObj?.address_components[i]?.types.includes("route"))
    {
      route = gmObj?.address_components[i]?.long_name;
    }
  }
  address.thoroughfare = street_number + " " + route
  return address;
}

const setPlace = (place: any) => {
  if (place) {
    const address = gmapObjToNativeGeocoderResultObject(place)
    if (address.locality) {
      getCityByName({
        first: 15,
        name: address.locality,
        state_code: address.administrativeArea,
      })?.then(async (res) => {
        const res_city = res?.data?.cities?.data[0];
        console.log("selected city", res_city)
        selectedState.value = res_city.state;
        selectedCity.value = res_city;
        selectedAddress.value = address;
      })
    }
  }
}

const { load: getCities, refetch: getCityByName } = useLazyQuery(
  CitiesDocument,
  {
    first: 15,
    name: "",
    state_code: "",
  }
);
getCities();

// const dateSelected = (result: DatePickerModalResult) => {
//   switch (result.field) {
//     case DateFieldsEnum.StartDate:
//       store.setStartDate(result.date);
//       if (
//         eventEndDate.value &&
//         (!result.date || result.date > eventEndDate.value)
//       ) {
//         store.setEndDate(null);
//       }
//       break;

//     case DateFieldsEnum.EndDate:
//       store.setEndDate(result.date);
//       break;

//     default:
//       break;
//   }
// };

const showDatePikerModal = (
  field: string,
  options?: DatePickerOptions
) => {
  datePickerModal.value?.present({ field, options });
};

const dateSelected = (result: DatePickerModalResult) => {
  if (result.date) {
    console.log('selected date: ', result?.date);
  }
};

const onBack = () => {
  // menuController.enable(false);
  // menuController.close();
  isConfirmedModalOpen.value = true;
};

const discardModalClosed = (approved: boolean) => {
  isConfirmedModalOpen.value = false;
  if (approved) {
    menuController.close();
    // router.push({
    //   name: router?.currentRoute?.value?.name,
    //   params: { step: 'upload' },
    // });
  }
};

</script>

<style scoped lang="scss">
.add-manager-panel {
  --width: 375px;
}

.title {
  position: relative;
  text-align: center;
  padding: 9px;

  ion-title {
    color: var(--color-white);
    text-align: center;
    font-family: Yantramanav;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
  }

  ion-button {
    width: fit-content;
    max-height: 48px;
    --padding-bottom: 10px;
    --padding-top: 10px;
    --border-radius: 50%;
  }
}
.back-btn {
  position: absolute;
  inset: 0;
  padding: 9px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  z-index: 999;
}

.tile {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;

  ion-label {
    color: var(--gray-60);
  }
}
.image-upload {
  background-color: var(--main-color);
  width: 88px;
  height: 88px;
  border: 1px dashed var(--gray-500);
  border-radius: 8px;
  position: relative;

  .icon {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

ion-button {
  max-height: 48px;
  width: 100%;
}
ion-input {
  border: solid;
  border-color: #FFFFFF6a;
  border-radius: 8px;
  border-width: 1px;
  margin-top: 6px;
  margin-bottom: 6px;
  --placeholder-color: var(--ion-color-medium);
}
ion-label {
  font: 400 14px/1 var(--ion-font-family);
}
.address-input {
  --color: var(--ion-color-white);
  --background: var(--gray-700);
  --border-radius: 8px;
  --border-width: 1px;
  --border-color: var(--gray-600);
  --highlight-color-focused: var(--gray-500);
  --padding-top: 0;
  --padding-bottom: 0;
  --min-height: 46px;
  font-size: 14px;
  .choose-place {
    width: 100%;
  }
  .form-row__control {
    background-color: transparent;
    border: none;
    width: 100%;
    padding: 0;
    margin: 0;
    height: 100%;
  }
  ion-input {
    border: none !important;
  }
  ion-select {
    width: 100%;
  }
}
.add-manager-btn {
  margin-top: 20.4%;
}

@media (max-width: 767px) {
  .add-manager-panel {
    --width: 100% !important;
  }
}
</style>
