<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Create gym pass" />
    </template>
    <template #content>
      <div class="form-body">
        <ion-grid v-if="previousPass" fixed>
          <ion-row>
            <ion-col size="12" size-md="6">
              <div class="form-row">
                <div class="label">Title of gym pass</div>
                <input
                  class="input-text-field"
                  type="text"
                  :placeholder="previousPass?.title"
                  name="plan"
                  disabled
                />
              </div>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="12" size-md="6">
              <div class="form-row">
                <div class="label">Duration</div>
                <select class="input-select-field" name="cars" id="cars" disabled>
                  <option value="30">30 days (1 month)</option>
                </select>
              </div>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="12" size-md="6">
              <div class="form-row">
                <div class="label">Set the price for gym pass(USD $)</div>
                <input
                  class="input-text-field"
                  type="number"
                  :placeholder="previousPass?.price"
                  name="cost"
                  disabled
                />
              </div>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="12" size-md="6">
              <ion-title>Next gym pass</ion-title>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-grid fixed>
          <ion-row>
            <ion-col size="12">
              <div class="form-row">
                <div class="label">Upload gym logo</div>
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
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="12" size-md="6">
              <div class="form-row">
                <div class="label">Title of gym pass</div>
                <input
                  class="input-text-field"
                  type="text"
                  placeholder="Basic"
                  name="plan"
                  v-model="passTitle"
                />
              </div>
            </ion-col>
            <ion-col size="12" size-md="6">
              <div class="form-row">
                <div class="label">Duration</div>
                <select class="input-select-field" name="cars" id="cars">
                  <option value="30">30 days (1 month)</option>
                </select>
              </div>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="12" size-md="6">
              <div class="form-row">
                <div class="label">Choose equipment and amenities</div>
                <choose-block
                  title="Equipment and amenities"
                  @handle-click="onChooseAmenities"
                  :value="facilityEquipments?.length + facilityAmenities?.length || ''"
                />
              </div>
            </ion-col>
            <ion-col size="12" size-md="6">
              <div class="form-row">
                <div class="label">Set the price for gym pass(USD $)</div>
                <input
                  class="input-text-field"
                  type="number"
                  placeholder="Enter price"
                  name="cost"
                  v-model="passPrice"
                />
              </div>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="12" size-md="6">
              <div class="submit-buttons">
                <ion-button @click="addNextFacilityItemPass" type="submit"> Add next Gym pass </ion-button>
                <ion-button
                  fill="outline"
                  color="medium"
                  type="submit"
                  @click="createNewFacilityItemPass"
                >
                  Create Gym pass
                </ion-button>
              </div>
            </ion-col>
            <ion-col size="0" size-md="3"></ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </template>
  </base-layout>
  <equipment-and-amenities
    ref="equipmentAndAmenitiessModal"
    @cancel="equipmentAndAmenitiessSelected"
  />
  <date-picker-modal ref="datePickerModal" @select="dateSelected" />
</template>

<script setup lang="ts">
import { IonButton, IonIcon, IonLabel, toastController } from "@ionic/vue";
import {
  ref,
  computed,
  defineEmits,
  withDefaults,
  defineProps,
  defineExpose,
} from "vue";
import { chevronBackOutline } from "ionicons/icons";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { v4 as uuidv4 } from "uuid";
import { 
  FilePreloadDocument,
  CitiesDocument,
  CreateFacilityItemDocument
} from "@/generated/graphql";
import EquipmentAndAmenities from "@/general/views/EquipmentAndAmenities.vue";
import { EquipmentAndAmenitiesModalResult } from "@/interfaces/EquipmentAndAmenitiesModal";
import { newFacilityStoreTypes } from "@/ts/types/store";
import { useNewFacilityStore } from "../../store/new-facility";
import { CheckboxValueType } from "@/ts/types/checkbox-value";
import { dataURItoFile } from "@/utils/fileUtils";
import { useLazyQuery, useMutation } from "@vue/apollo-composable";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import PhotosLoader from "@/general/components/PhotosLoader.vue";

const router = useRouter();
const navigate = (name: EntitiesEnum) => {
  router.push({ name });
};
const equipmentAndAmenitiessModal = ref<typeof EquipmentAndAmenities | null>(
  null
);

const store = useNewFacilityStore();
const currentFacility = useFacilityStore();

const facilityEquipments = computed(() => store.equipments);
const facilityAmenities = computed(() => store.amenities);
const facilityPhotos = computed(() => store.photos);
const passTitle = ref<string>();
const passDuration = ref<number>();
const passPrice = ref<number>();
const previousPass = ref<any>(null);

const equipmentAndAmenitiessSelected = (
  result: EquipmentAndAmenitiesModalResult
) => {
  store.setEquipments(result.equipments || []);
  store.setAmenities(result.amenities || []);
};

const photoOnLoad = ref<boolean>(false);
const percentPhotoLoaded = ref<number | undefined>();

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

let abort: any;

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

const { mutate: createFacilityItemPass, onDone: facilityItemPassCreated } = useMutation(
  CreateFacilityItemDocument
);

const addNextFacilityItemPass = () => {
  previousPass.value = {
    title: passTitle.value,
    price: passPrice.value,
    duration: passDuration.value,
  }
  createNewFacilityItemPass();
}
const createNewFacilityItemPass = () => {
  createFacilityItemPass({
    input: {
      facility_id: currentFacility.facility.id,
      title: passTitle.value,
      price: passPrice.value,
      duration: passDuration.value,
      item_type: "PASS",
    },
  })
    .then(async () => {
      const toast = await toastController.create({
        message: "New Gym Pass was created successfully",
        duration: 2000,
        icon: "assets/icon/success.svg",
        cssClass: "success-toast",
      });
      toast.present();
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
.title {
  padding: 0;
  display: block;
  font: 400 24px var(--ion-font-family);

  ion-icon {
    margin-right: 8px;
    margin-left: -6px;
  }
}

.current-crumb {
  color: var(--beige);
}

.form-body {
  padding: 0px 32px;
}

ion-button {
  min-width: 100px;
}

ion-label {
  color: var(--ion-color-white);
}

.loader-area {
  width: fit-content;
  text-align: center;
  border: 2px dashed var(--gray-500);
  color: var(--gray-400);
  padding: 16px 32px;
  border-radius: 8px;
  line-height: 24px;
  font-size: 14px;
}

.input-text-field {
  width: 100%;
  padding: 14px;
  background: #262626;
  border: 1px solid var(--gray-500);
  border-radius: 8px;
  font-size: 13px;
  color: #E1DBC5;
}

.input-select-field {
  width: 100%;
  padding: 14px;
  background: #262626;
  border: 1px solid var(--gray-500);
  border-radius: 8px;
  font-size: 13px;
  color: #E1DBC5;
}

// .input-select-field::after {
//   display: block;
//   content: " - Remember this";
//   background-color: yellow;
//   color: red;
//   font-weight: bold;
//   padding-right: 10px;
// }

select:focus,
input:focus {
  outline: none;
}
.clickable {
  cursor: pointer;
}
.form-row {
  margin-bottom: 0px;
}
.submit-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 26px;

  ion-button {
    width: 100%;
  }
}
</style>
