<template>
	<ion-menu side="end" content-id="main-content">
    <ion-header>
      <ion-toolbar class="title">
        <ion-menu-toggle class="back-btn" :auto-hide="false">
          <ion-icon src="assets/icon/arrow-back.svg"></ion-icon>
        </ion-menu-toggle>
        <ion-title>Add new manager</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="tile">
        <photo-loader
            circle-shape
            type="avatar"
            :progress="percentLoaded"
            :loading="previewOnLoading"
            :photo="previewUrl"
            @change="photoSelected"
          />
      </div>
      <div class="tile">
        <base-input
          label="First name"
          v-model:value="firstName"
          :error-message="firstNameError"
          placeholder="First Name"
          name="firstName"
          class="form-row__control"
          required
        />
      </div>
      <div class="tile">
        <base-input
          label="Last name"
          v-model:value="lastName"
          :error-message="lastNameError"
          placeholder="Last Name"
          name="lastName"
          class="form-row__control"
          required
        />
      </div>
      <div class="tile">
        <base-input
          label="Email"
          v-model:value="emailInput"
          :error-message="emailInputError"
          type="email"
          placeholder="Enter email address"
        />
      </div>
      <div class="tile">
        <base-input
          label="Postal Code"
          v-model:value="postal"
          name="postal"
          class="form-row__control"
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
        <base-input
          v-model:value="birth"
          type="date"
          name="birth"
          class="form-row__control"
        />
      </div>
      <div class="tile">
        <ion-label>Address</ion-label>
        <GMapAutocomplete
          placeholder="Enter your address"
          class="search-form__control form-row__control"
          @place_changed="setPlace"
        >
        </GMapAutocomplete>
      </div>
      <div class="tile">
        <ion-label>Employment Type</ion-label>
        <ion-input placeholder="Full Time"></ion-input>
      </div>
      <div class="tile">
        <base-input
          label="Tax ID"
          v-model:value="taxId"
          name="taxId"
          class="form-row__control"
        />
      </div>
      <ion-menu-toggle>
        <ion-button @click="addManager">Add Manager</ion-button>
      </ion-menu-toggle>
    </ion-content>
  </ion-menu>
  <!-- <date-picker-modal ref="datePickerModal" @select="dateSelected" /> -->
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
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import DatePickerModal from "@/general/components/DatePickerModal.vue";
import BaseInput from "@/general/components/base/BaseInput.vue";
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

const { value: emailInput, errorMessage: emailInputError } = useField<string>(
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
    const address = gmapObjToNativeGeocoderResultObject(place)
    if (address.locality) {
      getCityByName({
        first: 15,
        name: address.locality,
        state_code: address.administrativeArea,
      })?.then(async (res) => {
        const res_city = res.data.cities.data[0];
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

</script>

<style scoped lang="scss">


.title {
  position: relative;
  text-align: center;
  padding: 9px;
}
.back-btn {
  position: absolute;
  inset: 0;
  padding-top: 9px;
  padding-bottom: 9px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
}

.tile {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
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
</style>
