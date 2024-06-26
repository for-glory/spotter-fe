<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" :title="route.params.id ? 'Edit Manager' : 'Add New Manager'">
      </page-header>
    </template>
    <template #content>
      <div class="main-content">
        <div class="inputs-form">
          <div class="form-row">
            <base-input required v-model:value="managerName" placeholder="First name, Last name" label="Full name" />
          </div>
          <div class="form-row">
            <base-input required v-model:value="managerEmail" placeholder="Enter email address" label="Email" />
          </div>
          <div class="form-row">
            <base-input label="Phone number" v-model:value="managerPhoneNumber" placeholder="Phone number" />
          </div>
          <div class="form-row">
            <base-input required v-model:value="managerPostalCode" placeholder="" label="Postal Code" />
          </div>
          <div class="form-row">
            <ion-label class="label"> Date of Birth </ion-label>
            <choose-block title="Date of Birth" :value="managerBOD ? dayjs(managerBOD).format('D MMMM YYYY') : ''"
              @handle-click="
                showDatePikerModal('DOB', managerBOD, {
                  min: 0,
                  title: 'Date of Birth',
                })
                " :disabled="loading" />
          </div>

          <div class="form-row">
            <ion-label class="label"> Address </ion-label>
            <choose-block title="Address" :value="selectedAddress?.street" @handle-click="onChooseLocation" />
            <!-- <choose-block
              title="Address"
              class="form-row__control"
              @handle-click="openAddressModal"
              :value="(selectedState?.name ? selectedState?.name : '') + (selectedCity?.name ? ', ' + selectedCity?.name : '')"
            /> -->
          </div>

          <div class="form-row">
            <ion-label class="label"> Employment Type </ion-label>
            <choose-block :title="managerType" @handle-click="isEmploymentTypeModal = true"
              class="form-row__control" />
          </div>

          <div class="form-row">
            <base-input label="Tax ID" v-model:value="managerTaxID" placeholder="Tax ID" />
          </div>

          <div class="actions-wrapper">
            <ion-button expand="block" fill="solid" @click="addManager" :disabled="!isValidForm">
              {{ route.params.id ? 'Update Manager' : 'Add New Manager' }}
            </ion-button>
          </div>
        </div>
        <!-- <choose-address-modal ref="chooseAddressModal" @select="addressSelected" /> -->
        <choose-location-modal ref="chooseLocationModal" @select="addressSelected" />
        <date-picker-modal ref="datePickerModal" @select="dateSelected" />
        <IonModal :is-open="isEmploymentTypeModal" @didDismiss="isEmploymentTypeModal = false">
          <employment-type :is-modal="true" @dismiss="isEmploymentTypeModal = false"/>
        </IonModal>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import {
  IonLabel,
  IonButton,
  toastController,
IonModal
} from "@ionic/vue";
import PhotosLoader from "@/general/components/PhotosLoader.vue";
import { EntitiesEnum } from "@/const/entities";
import {
  ref,
  computed,
} from "vue";
import { useRouter } from "vue-router";
import {
  FilePreloadDocument,
  CitiesDocument,
  MeDocument,
  EmploymentTypeEnum,
  CreateManagerDocument,
  Address,
  UpdateUserDocument,
} from "@/generated/graphql";
import { ChooseAddresModalResult } from "@/interfaces/ChooseAddressModalOption";
import { v4 as uuidv4 } from "uuid";
import { dataURItoFile } from "@/utils/fileUtils";
import { useLazyQuery, useMutation, useQuery } from "@vue/apollo-composable";
import { useNewFacilityStore } from "@/facilities/store/new-facility";
import DatePickerModal from "@/general/components/DatePickerModal.vue";
import {
  DatePickerModalResult,
} from "@/interfaces/DatePickerModal";
import dayjs from "dayjs";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import BaseInput from "@/general/components/base/BaseInput.vue";
import ChooseLocationModal from "@/facilities/components/ChooseLocationModal.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useManagerStore } from "@/facilities/store/manager";
import { useRoute } from "vue-router";
import EmploymentType from "../EmploymentType.vue";

const { load: getCities, refetch: getCityByName } = useLazyQuery(
  CitiesDocument,
  {
    first: 15,
    name: "",
    state_code: "",
  }
);
getCities();

const router = useRouter();
const route = useRoute();
const store = useNewFacilityStore();

const managerName = ref<string>("");
const managerEmail = ref<string>("");
const managerPostalCode = ref<string>("");
const managerBOD = ref<any>();
const managerTaxID = ref<string>();
const managerPhoneNumber = ref<string>();
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
const error = ref<string>();
const managerType = computed(()=>managerStore?.employment_type == EmploymentTypeEnum.PartTime ? 'Contract' : 'Full Time');

// const selectedState = computed(() => store.address.state);
// const selectedCity = computed(() => store.address.city);
const selectedAddress = ref<Address>();
const chooseLocationModal = ref<typeof ChooseLocationModal | null>(null);

const photoOnLoad = ref<boolean>(false);
const percentPhotoLoaded = ref<number | undefined>();

const datePickerModal = ref<typeof DatePickerModal | null>(null);
const currentFacility = useFacilityStore();
const managerStore = useManagerStore();
const isEmploymentTypeModal = ref(false)
const { mutate: updateUser, loading: updateUserLoading } = useMutation(UpdateUserDocument);

const isValidForm = computed(
  () => {
   return !!(
      managerName.value && managerEmail.value && managerBOD.value && managerPhoneNumber.value && managerType.value && managerTaxID.value
    )
}
);


if (route.params.id) {
  console.log('managerStore', managerStore);
  managerName.value = managerStore?.first_name + ' ' + managerStore?.last_name;
  managerEmail.value = managerStore?.email;
  managerBOD.value = managerStore?.birth;
  managerPhoneNumber.value = managerStore?.phone_number;
  managerTaxID.value = managerStore?.tax_id;
  managerPostalCode.value = managerStore?.postal_code;
  selectedAddress.value = managerStore.address;
}

const { mutate } = useMutation(CreateManagerDocument);

const { onResult, refetch, loading, result } = useQuery(MeDocument, { id: currentFacility.facility.id });

const onChooseLocation = () => {
  // router.push({
  //   name: EntitiesEnum.ChooseLocation,
  //   params: { type: 'facility' }
  // });
  chooseLocationModal.value?.present({
    title: "Address",
  });
};

const addressSelected = (selected: ChooseAddresModalResult) => {
  console.log('selected address', selected);
  store.setAddress(selected.state, selected.city, selected.address);
  selectedAddress.value = {
    city: { ...selected.city as any },
    street: selected.address?.thoroughfare ? selected.address?.thoroughfare : selected.address?.subThoroughfare,
    lat: Number(selected.address?.latitude),
    lng: Number(selected.address?.longitude),
    id: selected.city?.id as string
  };
};

const savedMedia = computed(() =>
  result.value?.me?.media
    ? result.value?.me?.media.reduce((acc: any, cur: any) => {
      acc.push({ ...cur, url: cur.pathUrl });
      return acc;
    }, [])
    : []
);

const uploadPhoto = async (photo: string, index?: number) => {
  const file = dataURItoFile(photo, uuidv4());
  photoOnLoad.value = true;
  percentPhotoLoaded.value = 0;
  await filePreload({ file })
    .then((res) => {
      media.value = [
        {
          path: res?.data.filePreload.path,
          url: `${process.env.VUE_APP_MEDIA_URL}${res?.data.filePreload.path}`,
          id: `_${uuidv4()}`,
          title: uuidv4(),
        },
        ...media.value,
      ];
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

// const openAddressModal = () => {
//   chooseAddressModal.value?.present({
//     type: EntitiesEnum.City,
//     title: "Choose your address",
//     // selected: selectedAddress.value?.latitude
//     //   ? {
//     //     lat: Number(selectedAddress.value?.latitude),
//     //     lng: Number(selectedAddress.value?.longitude),
//     //   }
//     //   : null,
//     // state: selectedState.value,
//     // city: selectedCity.value,
//   });
// };

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
};

const showDatePikerModal = (
  field: string,
  value?: number | null,
  options?: any
) => {
  datePickerModal.value?.present({ field, value, options });
};

const dateSelected = (result: DatePickerModalResult) => {
  managerBOD.value = result.date;
};

const getMedia = (media: any, savedMedia: any) => {
  return media.reduce((acc: any, cur: any) => {
    const isMediaSaved = savedMedia?.filter(
      (i: { id: string; }) => i.id === cur.id
    );
    if (!isMediaSaved?.length) {
      acc.push({
        file: cur.path,
        title: cur.title,
      });
    }

    return acc;
  }, []);
};
// const phoneRegex = /^(?:\+1)?[-. ]?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/ as RegExp;

// function isValidPhoneNumber(phoneNumber: any): boolean {
//   return phoneRegex.test(phoneNumber);
// }

const addManager = () => {
  if(route.params.id){
    updateManager();
    return;
  }
  const newMedia = getMedia(media.value, savedMedia.value);
  mutate({
    input: {
      avatar:
        newMedia && getMedia(media.value, savedMedia.value)?.pop()?.file,
      first_name: managerName.value.split(" ")[0],
      last_name: managerName.value.split(" ")[1],
      email: managerEmail.value,
      address: {
        lat: Number(store.$state.address.address?.latitude),
        lng: Number(store.$state.address.address?.longitude),
        street: store.$state.address.address?.thoroughfare,
        city_id: store.$state.address.city?.id,
        extra: store.$state.address.address?.subThoroughfare,
      },
      role: 'MANAGER',
      employment_type: managerType.value?.toLocaleLowerCase() === 'full time' ? EmploymentTypeEnum.FullTime : EmploymentTypeEnum.PartTime,
      tax_id: managerTaxID.value,
      postal: managerPostalCode.value,
      facility_id: currentFacility?.facility.id,
      birth: dayjs(managerBOD.value).format("YYYY-MM-DD HH:mm:ss"),
      phone: managerPhoneNumber.value
    }
  }).then(async () => {
    const toast = await toastController.create({
      message: "Added successfully",
      duration: 2000,
      icon: "assets/icon/success.svg",
      cssClass: "success-toast",
    });
    toast.present();
    refetch();
  }).catch(async (error) => {
    const toast = await toastController.create({
      message: "Something went wrong. Please try again.",
      icon: "assets/icon/info.svg",
      cssClass: "danger-toast",
    });
    toast.present();

    throw new Error(error);
  });
};

const updateManager = () => {
  const newMedia = getMedia(media.value, savedMedia.value);
  if (isValidForm.value) {
    updateUser({
      id: route.params.id,
      input: {
        avatar:
          newMedia && getMedia(media.value, savedMedia.value)?.pop()?.file,
        first_name: managerName.value.split(" ")[0],
        last_name: managerName.value.split(" ")[1],
        email: managerEmail.value,
        address: {
          lat: selectedAddress.value?.lat,
          lng: selectedAddress.value?.lng,
          street: selectedAddress.value?.street,
          city_id: selectedAddress.value?.id,
        },
        role: 'MANAGER',
        employment_type: managerType.value?.toLocaleLowerCase() === 'full time' ? EmploymentTypeEnum.FullTime : EmploymentTypeEnum.PartTime,
        tax_id: managerTaxID.value,
        postal: managerPostalCode.value,
        facility_id: currentFacility?.facility.id,
        birth: dayjs(managerBOD.value).format("YYYY-MM-DD HH:mm:ss"),
        phone: managerPhoneNumber.value
      }
    }).then(async (data) => {
      if(data?.errors?.length){
        throw data.errors
      }
      const toast = await toastController.create({
        message: "Update manager successfully",
        duration: 2000,
        icon: "assets/icon/success.svg",
        cssClass: "success-toast",
      });
      toast.present();
      router.back();
    }).catch(async (error) => {
      const toast = await toastController.create({
        message: "Something went wrong. Please try again.",
        icon: "assets/icon/info.svg",
        cssClass: "danger-toast",
      });
      toast.present();

      throw new Error(error);
    });
  }
};

const onBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.main-content {
  padding: 16px 20px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}

.managers-table {
  border: 1px solid #E1DBC5;
  background: var(--gray-700);
  width: 100%;
  padding: 0;
  margin-top: 14px;
}

.table-header {
  background-color: var(--main-color);
  color: var(--gold);
  border-bottom: 1px solid var(--beige);

  ion-col {
    padding: 7px 15px 7px;
  }

  ion-text {
    font: 14px/1 Lato;
    color: #E1DBC5;
  }
}

.table-row {

  // border-top: 1px solid var(--beige);
  ion-col {
    padding: 15px 15px;
    border: 1px solid var(--beige);
  }

  ion-text {
    color: #ffffff6a;
    font: 12px/1 Lato;
  }
}

.status-text {
  border-radius: 16px;
  height: 20px;
  text-transform: capitalize;
  font: 10px/1 Lato;
}

.available {
  color: #2ED47A;
  border: solid 1px #2ED47A;
  padding: 2px 8px;
}

.unavailable {
  color: #FFB946;
  border: solid 1px #FFB946;
  padding: 2px 8px;
}

.membership {
  margin-top: 16px;

  .count {
    font-size: 1.625rem;
    color: var(--gold);
    padding-left: 0.6rem;
    font-weight: bold;
  }

  .period {
    font-size: 1rem;
    color: grey;
    padding-bottom: 0.6rem;
  }

  .time {
    font-size: 0.875rem;
    color: var(--gold);
  }

  .content {
    font-size: 1rem;
    color: #797979;
  }

  ion-row {
    justify-content: space-between;
    gap: 24px;
  }
}

.block {
  width: 100%;
  background-color: #262626;
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 1rem 1rem 1rem 1rem;

  ion-row {
    padding-top: 4px;
    padding-bottom: 4px;
  }
}

.title {
  padding: 8px 0px;
  font-size: 1.6rem;
  line-height: 1.3;
  font-weight: 400;
  color: var(--fitnesswhite);
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
</style>
