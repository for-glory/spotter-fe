<template>
  <ion-menu menu-id="add-manager-menu" :swipe-gesture="false" @ion-did-close="sideMenuStore.setToDefault()" side="end"
    content-id="main-content" class="add-manager-panel">
    <ion-header class="ion-no-border">
      <ion-toolbar class="title">
        <!-- <ion-menu-toggle slot="start" class="back-btn" :auto-hide="false" > -->
        <IonButton fill="clear" size="small" shape="round" slot="start" @click="onBack">
          <ion-icon src="assets/icon/arrow-back.svg"></ion-icon>
        </IonButton>
        <!-- </ion-menu-toggle> -->
        <ion-title>{{ options.title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>

      <div class="tile" v-if="options.showImg">
        <IonLabel>Choose profile photo</IonLabel>
        <!-- <photos-loader @upload="photoSelected" :photos=""/> -->
        <photos-loader @upload="photoSelected" @change="photoSelected" :circle-shape="false"
              :photos="media" :loading="previewOnLoading" :progress="percentLoaded"
              :disabled="previewOnLoading" />
      </div>

      <div class="tile">
        <base-input label="Full name" gray-input placeholder="First name, Last name" name="fullName"
          class="form-row__input-web" v-model:value="fullName" required :error-message="fullNameError" />
      </div>

      <div class="tile">
        <base-input label="Email" gray-input v-model:value="emailInput" :error-message="emailInputError" type="email"
          placeholder="Enter email address" class="form-row__input-web" />
      </div>

      <div class="tile">
        <base-input label="Phone" gray-input v-model:value="phoneNumber" name="phone" class="form-row__input-web"
          placeholder="Enter phone number" />
      </div>

      <div class="tile">
        <base-input label="Postal code" gray-input v-model:value="postalCode" name="postal" class="form-row__input-web"
          placeholder="Enter postal code" />
      </div>

      <!-- <div class="tile ion-margin-bottom">
        <ion-label class="form-label">Date Of Birth</ion-label>
        <choose-block :title="selectDate" add-border is-light-item end-icon-color="var(--gray-500)"
          :value="birth ? dayjs(birth).format('D MMMM') : ''"
          @handle-click="showDatePikerModal(DateFieldsEnum.birth, { title: 'Date of birth', })" />
      </div> -->

      <div class="tile ion-margin-bottom">
        <ion-label class="form-label"> Date of Birth </ion-label>
        <choose-block title="Date of Birth" :value="managerBOD ? dayjs(managerBOD).format('D MMMM YYYY') : ''"
          @handle-click="
            showDatePikerModal('DOB', managerBOD, {
              min: 0,
              title: 'Date of Birth',
            })
            " />
      </div>

      <div class="tile ion-margin-bottom">
        <ion-label class="form-label">Address</ion-label>
        <ChooseBlock title="Address" end-icon-color="var(--gray-500)" add-border :value="selectedAddress?.street ?? ''"
          @handle-click="openLocationModal" :isLightItem="true" />
      </div>

      <div class="tile ion-margin-bottom">
        <CustomSelection choose-block border-color="var(--gray-600)" active-bg-color="var(--gray-700)"
          label="Employment Type" placeholder="Full Time" :selected-value="selectedEmpType"
          @select-change="(e) => selectedEmpType = e" :options="empOptions" />
      </div>

      <div class="tile">
        <base-input label="Tax ID" gray-input v-model:value="taxId" placeholder="Enter Tax ID" name="taxId"
          class="form-row__input-web" :error-message="taxIdError" />
      </div>

      <ion-button class="add-manager-btn" :disabled="!isValidForm" @click="addManager">{{ sideMenuStore.options.isEdit ?
        'Save' : 'Add Team Member' }}</ion-button>
    </ion-content>
  </ion-menu>

  <ChooseLocationModal ref="chooseLocationModal" title="Address" :is-web-view="true" @select="(addressSelected as any)" />
  <date-picker-modal ref="datePickerModal" @select="(dateSelected as any)" />
  <discard-changes :is-open="isConfirmedModalOpen" @close="discardModalClosed" title="Do you want to discard changes?"
    text="Changes will not be saved" cancelButton="Cancel" button="Discard changes" />
</template>

<script setup lang="ts">
import {
  IonButton,
  IonTitle,
  IonIcon,
  IonMenu,
  IonContent,
  IonToolbar,
  IonLabel,
  IonHeader,
  menuController,
} from "@ionic/vue";
import DatePickerModal from "@/general/components/DatePickerModal.vue";
import BaseInput from "@/general/components/base/BaseInput.vue";
import PhotosLoader from "@/general/components/PhotosLoader.vue";
import ChooseLocationModal from "@/facilities/components/ChooseLocationModal.vue";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import CustomSelection from "@/general/views/dashboard/settings/CustomSelection.vue";
import {
  FilePreloadDocument,
  RoleEnum,
  CreateManagerDocument,
  Address,
  EmploymentTypeEnum,
  UpdateUserDocument
} from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { useField } from "vee-validate";
import { requiredFieldSchema, emailSchema } from "@/validations/authValidations";
import { ref, computed, watch } from "vue";
import dayjs from "dayjs";
import { dataURItoFile } from "@/utils/fileUtils";
import { v4 as uuidv4 } from "uuid";
import { toastController } from "@ionic/vue";
import {
  DatePickerModalResult,
} from "@/interfaces/DatePickerModal";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import { useSideMenu } from "@/general/stores/sideMenuStore";
import { storeToRefs } from "pinia";
import { ChooseAddresModalResult } from "@/interfaces/ChooseAddressModalOption";
import { useRoute } from "vue-router";
import { useManagerStore } from "@/facilities/store/manager";


const isConfirmedModalOpen = ref(false);
const route = useRoute();
const selectedEmpType = ref({
  title: "Full Time",
  value: EmploymentTypeEnum.FullTime as string
});
const empOptions = [
  {
    title: "Full Time",
    value: EmploymentTypeEnum.FullTime
  },
  {
    title: "Contract",
    value: EmploymentTypeEnum.PartTime
  }
];

const sideMenuStore = useSideMenu();
const managerStore = useManagerStore();
const { options, values } = storeToRefs(sideMenuStore);
const managerBOD = ref<any>();

const datePickerModal = ref<typeof DatePickerModal | null>(null);
const chooseLocationModal = ref<typeof ChooseLocationModal | null>(null);

// const filter = ref<string>('profile');
// const imageUrl = ref<string>('');

// const { id: myId } = useId();
// const { id: myFacilityId } = useFacilityId();
// const { role: myRole } = useRoles();

// const { id } = JSON.parse(localStorage.getItem("user") || "{}");

// const router = useRouter();
const currentFacility = useFacilityStore();

// const selectedState = ref<State | null>(null);
// const selectedCity = ref<City | null>(null);
// const selectedAddress = ref<NativeGeocoderResult | null>(null);
const selectedAddress = ref<Address>();


const previewOnLoading = ref<boolean>(false);
const previewUrl = ref<string>("");
const previewPath = ref<string>("");
const percentLoaded = ref<number | undefined>();

// const { value: firstName, errorMessage: firstNameError } = useField<string>(
//   "firstName",
//   requiredFieldSchema
// );

// const { value: lastName, errorMessage: lastNameError } = useField<string>(
//   "lastName",
//   requiredFieldSchema
// );

const { value: fullName, errorMessage: fullNameError } = useField<string>(
  "fullName",
  requiredFieldSchema
);

const { value: emailInput, errorMessage: emailInputError, setValue: setEmailValue } = useField<string>(
  "email",
  emailSchema
);

const { value: phoneNumber } = useField<string>(
  "phone",
);

const { value: postalCode } = useField<string>(
  "postal",
);

const { value: taxId, errorMessage: taxIdError } = useField<string>(
  "taxId",
  requiredFieldSchema
);
const media = ref<
  Array<{
    __typename?: "Media";
    pathUrl?: string;
    path?: string;
    id?: string;
    title?: string;
    url?: string;
  }>
>([]);

const isValidForm = computed(
  () =>
    !!(
      !fullNameError.value &&
      !emailInputError.value &&
      !taxIdError.value &&
      fullName.value &&
      emailInput.value &&
      taxId.value
    )
);

let abort: any;

watch(() => sideMenuStore.options.isEdit, () => {
  if (sideMenuStore.options.isEdit && route.params.id) {
    console.log('managerStore', managerStore);
    fullName.value = managerStore?.first_name + ' ' + managerStore?.last_name;
    emailInput.value = managerStore?.email;
    managerBOD.value = managerStore?.birth;
    phoneNumber.value = managerStore?.phone_number;
    taxId.value = managerStore?.tax_id;
    postalCode.value = managerStore?.postal_code;
    selectedAddress.value = managerStore.address;
  }
});
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
const { mutate: updateUser, loading: updateUserLoading } = useMutation(UpdateUserDocument);

const addManager = () => {
  if (route.params.id) {
    updateManager();
    return;
  }
  if (isValidForm.value) {
    mutate({
      input: {
        address: {
          lat: selectedAddress.value?.lat,
          lng: selectedAddress.value?.lng,
          street: selectedAddress.value?.street,
          city_id: selectedAddress.value?.city?.id,
        },
        avatar: media.value.length ? media.value[0].path : null,
        email: emailInput.value,
        facility_id: currentFacility.facility.id,
        first_name: fullName.value.split(' ')[0],
        last_name: fullName.value.split(' ')[1],
        role: RoleEnum.Manager,
        employment_type: selectedEmpType.value.value,
        tax_id: taxId.value,
        birth: dayjs(managerBOD.value).format("YYYY-MM-DD HH:mm:ss"),
        postal: postalCode.value,
        phone: phoneNumber.value
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
        console.error(error);
      }).finally(() => menuController.close());
  }
};

const updateManager = () => {
  if (isValidForm.value) {
    updateUser({
      id: route.params.id,
      input: {
        address: {
          lat: selectedAddress.value?.lat,
          lng: selectedAddress.value?.lng,
          street: selectedAddress.value?.street,
          city_id: selectedAddress.value?.id,
        },
        email: emailInput.value,
        facility_id: currentFacility.facility.id,
        first_name: fullName.value.split(' ')[0],
        last_name: fullName.value.split(' ')[1],
        role: RoleEnum.Manager,
        employment_type: selectedEmpType.value.value,
        tax_id: taxId.value,
        birth: dayjs(managerBOD.value).format("YYYY-MM-DD HH:mm:ss"),
        postal: postalCode.value,
        phone: phoneNumber.value
      },
    }).then(async (data: any) => {
      if (data?.errors?.length) {
        throw data.errors;
      }
      const toast = await toastController.create({
        message: "Update manager successfully",
        duration: 2000,
        icon: "assets/icon/success.svg",
        cssClass: "success-toast",
      });
      toast.present();
    }).catch(async (error: any) => {
      const toast = await toastController.create({
        message: "Something went wrong. Please try again.",
        duration: 2000,
        icon: "assets/icon/info.svg",
        cssClass: "danger-toast",
      });
      toast.present();

      throw new Error(error);
    }).finally(() => {
      menuController.close();
    });
  }
};

const addressSelected = (e: ChooseAddresModalResult) => {
  console.log('selected address', e);
  selectedAddress.value = {
    city: { ...e.city as any },
    street: e.address?.thoroughfare ? e.address?.thoroughfare : e.address?.subThoroughfare,
    lat: Number(e.address?.latitude),
    lng: Number(e.address?.longitude),
    id: e.city?.id as string
  };
};

const openLocationModal = () => {
  console.log('openLocationModal');
  chooseLocationModal.value?.present({
    title: "Address",
  });
};
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
      // previewPath.value = res?.data.filePreload.path;
      // previewUrl.value = `${process.env.VUE_APP_MEDIA_URL}${res?.data.filePreload.path}`;

      media.value = [
        {
          path: res?.data.filePreload.path,
          url: `${process.env.VUE_APP_MEDIA_URL}${res?.data.filePreload.path}`,
          id: `_${uuidv4()}`,
          title: uuidv4(),
        }
      ];

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
  value?: any,
  options?: any
) => {
  datePickerModal.value?.present({ field, value, options });
};

const dateSelected = (result: DatePickerModalResult) => {
  if (result.date) {
    managerBOD.value = result?.date;
  }
};

const onBack = () => {
  // menuController.enable(false);
  // menuController.close();
  isConfirmedModalOpen.value = true;
};

const discardModalClosed = async (approved: boolean) => {
  isConfirmedModalOpen.value = false;
  if (approved) {
    await menuController.close();
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

ion-content {
  --padding-start: 20px;
  --padding-end: 20px;
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
    width: 85%;
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

.form-label {
  font-family: Lato;
  font-size: 14px;
  font-style: normal;
  margin-top: 8px;
}
</style>
