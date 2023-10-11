<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Add New Manager">
      </page-header>
    </template>
    <template #content>
      <div class="main-content">
        <div
          class="inputs-form"
          :class="{ 'inputs-form--footer-fixed': footerFixed }"
        >
          <div class="form-row">
            <base-input
              required
              v-model:value="managerName"
              placeholder="First name, Last name"
              label="Full name"
            />
          </div>
          <div class="form-row">
            <base-input
              required
              v-model:value="managerEmail"
              placeholder="Enter email address"
              label="Email"
            />
          </div>
          <div class="form-row">
            <base-input
              label="Phone number"
              v-model:value="managerPhoneNumber"
              placeholder="Phone number"
            />
          </div>
          <div class="form-row">
            <base-input
              required
              v-model:value="managerCode"
              placeholder=""
              label="Postal Code"
            />
          </div>
          <div class="form-row">
            <ion-label class="label"> Date of Birth </ion-label>
            <choose-block
              title="Date of Birth"
              :value="managerBOD ? dayjs(managerBOD).format('D MMMM YYYY') : ''"
              @handle-click="
                showDatePikerModal( 'DOB', managerBOD, {
                  min: 0,
                  title: 'Date of Birth',
                })
              "
              :disabled="loading"
            />
          </div>

          <div class="form-row">
            <ion-label class="label"> Address </ion-label>
            <choose-block
              title="Address"
              class="form-row__control"
              @handle-click="onChooseLocation"
              :value="(selectedState?.name ? selectedState?.name : '') + (selectedCity?.name ? ', ' + selectedCity?.name : '')"
            />
          </div>

          <div class="form-row">
            <ion-label class="label"> Employement Type </ion-label>
            <choose-block
              title="Full Time"
              @handle-click="$router.push({ name: EntitiesEnum.EmploymentType })"
              class="form-row__control"
            />
          </div>

          <div class="form-row">
            <base-input
              label="Tax ID"
              v-model:value="managerTaxID"
              placeholder="Tax ID"
            />
          </div>

          <div
            class="actions-wrapper"
            :class="{ 'actions-wrapper--fixed': footerFixed }"
          >
            <ion-button
              expand="block"
              fill="solid"
              @click="addManager"
            >
              Send Invitation
            </ion-button>
          </div>
        </div>
        <choose-address-modal ref="chooseAddressModal" @select="addressSelected" />
        <date-picker-modal ref="datePickerModal" @select="dateSelected" />
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { 
  IonLabel,
  IonButton,
  toastController
 } from "@ionic/vue";
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
import { 
  FilePreloadDocument, 
  CitiesDocument, 
  CreateMangerDocument,
  MeDocument,
  EmploymentTypeEnum,
} from "@/generated/graphql";
import { ChooseAddresModalResult } from "@/interfaces/ChooseAddressModalOption";
import { v4 as uuidv4 } from "uuid";
import { dataURItoFile } from "@/utils/fileUtils";
import { useLazyQuery, useMutation, useQuery } from "@vue/apollo-composable";
import { useNewFacilityStore } from "@/facilities/store/new-facility";
import { newFacilityStoreTypes } from "@/ts/types/store";
import { CheckboxValueType } from "@/ts/types/checkbox-value";
import {
  NativeGeocoderResult,
} from "@awesome-cordova-plugins/native-geocoder";
import DatePickerModal from "@/general/components/DatePickerModal.vue";
import {
  DatePickerModalResult,
  DatePickerOptions,
} from "@/interfaces/DatePickerModal";
import dayjs from "dayjs";
import { useFacilityStore } from "@/general/stores/useFacilityStore";

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
const store = useNewFacilityStore();

const managerName = ref<string>("");
const managerEmail = ref<string>("");
const managerCode = ref<string>("");
const managerBOD = ref<any>();
const managerType = ref<string>();
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

const selectedState = computed(() => store.address.state);
const selectedCity = computed(() => store.address.city);
const selectedAddress = computed(() => store.address.address);
const chooseAddressModal = ref<typeof ChooseAddressModal | null>(null);

const photoOnLoad = ref<boolean>(false);
const percentPhotoLoaded = ref<number | undefined>();

const datePickerModal = ref<typeof DatePickerModal | null>(null);
const currentFacility = useFacilityStore();

const { mutate } = useMutation(CreateMangerDocument);

const { onResult, refetch, loading, result } = useQuery(MeDocument, { id: currentFacility.facility.id });

const onChooseLocation = () => {
  router.push({
    name: EntitiesEnum.ChooseLocation, 
    params: { type: 'facility' }
  });
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
      (i: { id: string }) => i.id === cur.id
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
const phoneRegex = /^(?:\+1)?[-. ]?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/ as RegExp;

function isValidPhoneNumber(phoneNumber: any): boolean {
  return phoneRegex.test(phoneNumber);
}

const addManager = () => {
  const newMedia = getMedia(media.value, savedMedia.value);
  mutate({
    input: {
      avatar:
        newMedia && getMedia(media.value, savedMedia.value)?.pop()?.file,
      first_name: managerName.value.split(" ")[0],
      last_name: managerName.value.split(" ")[1],
      email: managerEmail.value,
      address: {
          lat: selectedAddress.value?.address?.latitude
            ? Number(selectedAddress.value?.address.latitude)
            : 34.034744,
          lng: selectedAddress.value?.address?.longitude
            ? Number(selectedAddress.value?.address.longitude)
            : -118.2381,
          street: `${
            selectedAddress.value?.address?.thoroughfare
              ? selectedAddress.value?.address?.thoroughfare + ", "
              : ""
          }${selectedAddress.value?.address?.subThoroughfare || ""}`,
          city_id: selectedCity.value?.id,
        },
      role: 'MANAGER',
      employment_type: managerType.value?.toLocaleLowerCase() === 'full time' ? EmploymentTypeEnum.FullTime : EmploymentTypeEnum.PartTime,
      tax_id: managerTaxID.value,
      postal: managerCode.value,
      facility_id: currentFacility?.facility.id,
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
      })
      .catch(async (error) => {
      const toast = await toastController.create({
        message: "Something went wrong. Please try again.",
        icon: "assets/icon/info.svg",
        cssClass: "danger-toast",
      });
      toast.present();

      throw new Error(error);
    });
}

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
