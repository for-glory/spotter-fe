<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="isConfirmedModalOpen = true" :title="'Create ' + type" />
    </template>
    <template #content>
      <div class="form-body">
        <ion-grid v-if="previousItem" fixed>
          <ion-row>
            <ion-col size="12" size-md="6">
              <div class="form-row">
                <div class="label">Duration</div>
                <wheel-picker :options="dayOptions" :name="type">
                  <template #button>
                    <choose-block add-border 
                        border-color="var(--gray-500)"
                        end-icon-color="var(--gray-500)"
                        title="Duration"
                        :value="nextSelectedOption"
                        @handle-click="
                          openPicker(type, nextSelectedOption, dayOptions, 'next')
                        "
                      />
                  </template>
                </wheel-picker>
              </div>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="12" size-md="6">
              <!-- <div class="form-row">
                <div class="label">Title of {{ type }}</div>
                <input
                  class="input-text-field prev"
                  type="text"
                  :placeholder="previousItem?.title"
                  name="plan"
                  disabled
                />
              </div> -->
              <div class="form-row">
                <div class="label">Choose equipment and amenities</div>
                <choose-block add-border
                  border-color="var(--gray-60)"
                  end-icon-color="var(--gray-500)"
                  title="Equipment and amenities"
                  @handle-click="onChooseAmenities"
                  :value="facilityEquipments?.length + facilityAmenities?.length || ''"
                />
              </div>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="12" size-md="6">
              <div class="form-row">
                <div class="label">Set the price for {{ type }}(USD $)</div>
                <input
                  class="input-text-field prev"
                  type="number"
                  :placeholder="previousItem?.price"
                  name="cost"
                  disabled
                />
              </div>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="12" size-md="6">
              <ion-title class="next-title">Next {{ type }}</ion-title>
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
                <div class="label">Title of {{ type }}</div>
                <input
                  class="input-text-field"
                  type="text"
                  placeholder="Enter title"
                  name="plan"
                  v-model="itemTitle"
                />
              </div>
            </ion-col>
            <ion-col size="12" size-md="6">
              <div class="form-row">
                <div class="label">Duration</div>
                <wheel-picker :options="dayOptions" :name="type">
                  <template #button>
                    <choose-block add-border 
                        border-color="var(--gray-60)"
                        end-icon-color="var(--gray-500)"
                        title="Duration"
                        :value="selectedOption"
                        @handle-click="
                          openPicker(type, selectedOption, dayOptions)
                        "
                      />
                  </template>
                </wheel-picker>
              </div>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="12" size-md="6">
              <div class="form-row">
                <div class="label">Choose equipment and amenities</div>
                <choose-block add-border
                  border-color="var(--gray-60)"
                  end-icon-color="var(--gray-500)"
                  title="Equipment and amenities"
                  @handle-click="onChooseAmenities"
                  :value="facilityEquipments?.length + facilityAmenities?.length || ''"
                />
              </div>
            </ion-col>
            <ion-col size="12" size-md="6">
              <div class="form-row">
                <div class="label">Set the price for {{ type }}(USD $)</div>
                <input
                  class="input-text-field"
                  type="number"
                  placeholder="Enter price"
                  name="cost"
                  v-model="itemPrice"
                />
              </div>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="12" size-md="6">
              <div class="submit-buttons">
                <ion-button @click="addNextFacilityItem" type="submit"> Add next {{ type }} </ion-button>
                <ion-button
                  fill="outline"
                  color="medium"
                  type="submit"
                  @click="createNewFacilityItem"
                >
                  Create {{ type }}
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
import { IonButton, toastController, IonTitle, IonGrid, IonRow, IonCol, pickerController, PickerColumnOption } from "@ionic/vue";
import {
  ref,
  computed,
} from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter, useRoute } from "vue-router";
import { v4 as uuidv4 } from "uuid";
import { 
  FilePreloadDocument, 
  CitiesDocument,
  CreateFacilityItemDocument
} from "@/generated/graphql";
import EquipmentAndAmenities from "@/general/views/EquipmentAndAmenities.vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import { EquipmentAndAmenitiesModalResult } from "@/interfaces/EquipmentAndAmenitiesModal";
import { useNewFacilityStore } from "../../facilities/store/new-facility";
import { CheckboxValueType } from "@/ts/types/checkbox-value";
import { dataURItoFile } from "@/utils/fileUtils";
import { useLazyQuery, useMutation } from "@vue/apollo-composable";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import PhotosLoader from "@/general/components/PhotosLoader.vue";
import WheelPicker from "@/general/components/blocks/WheelPicker.vue";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import { daysDuration } from "@/const/days-durations";

const router = useRouter();
const navigate = (name: EntitiesEnum) => {
  router.push({ name });
};
const route = useRoute();
const equipmentAndAmenitiessModal = ref<typeof EquipmentAndAmenities | null>(
  null
);

const store = useNewFacilityStore();
const currentFacility = useFacilityStore();
const isConfirmedModalOpen = ref(false);
const facilityEquipments = computed(() => store.equipments);
const facilityAmenities = computed(() => store.amenities);
const facilityPhotos = computed(() => store.photos);
const itemTitle = ref<string>();
const itemDuration = ref<number>();
const itemPrice = ref<number>();
const previousItem = ref<any>(null);
const type = computed(() => route.params.type);
console.log("type", type.value);
const selectedOption = ref<any>(null);
const nextSelectedOption = ref(null);
const activePicker = ref('create');
const days = daysDuration(type.value === "drop-ins" ? 31 : 13);

const equipmentAndAmenitiessSelected = (
  result: EquipmentAndAmenitiesModalResult
) => {
  store.setEquipments(result.equipments || []);
  store.setAmenities(result.amenities || []);
};

const photoOnLoad = ref<boolean>(false);
const percentPhotoLoaded = ref<number | undefined>();

const dayCoulmns = [
  {
    name: "days",
    options: days,
  },
]

const dayOptions = {
  columns: dayCoulmns,
  buttons: [
    {
      text: "Select number of " + (type.value === "drop-ins" ? "days" : "months"),
      role: "cancel",
    },
    {
      text: "Choose " + (type.value === "drop-ins" ? "number" : "months"),
      handler: (value: any) => {
        console.log("value", value);
        console.log("activePicker.value", activePicker.value);
          
        if(activePicker.value === 'create'){
          selectedOption.value = value?.days.value;
        } else {
          nextSelectedOption.value = value?.days.value;
        }
      }
    }
  ]

}

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


const openPicker = async (
  name: string,
  values: any,
  options: { columns: any[]; buttons: any },
  from = 'create'
) => {
  activePicker.value = from
  const columns = options.columns.map(
    (column: { options: any[]; name: any }) => {
      const options = column.options.map(
        (option: { value: any; text: any }) => {
          return {
            value: option.value,
            text: option.text,
          };
        }
      );
      return {
        name: column.name,
        options,
        selectedIndex: values
          ? column.options.findIndex(
              (option: { value: any }) => option.value === values
            )
          : -1,
      };
    }
  );

  const picker = await pickerController.create({
    buttons: options.buttons,
    mode: "ios",
    columns,
    cssClass: 'trainer-picker',
  });

  await picker.present();
};

const discardModalClosed = (approved: boolean) => {
  isConfirmedModalOpen.value = false;
  if (approved) {
      onBack()
  }
};

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

const addNextFacilityItem = () => {
  previousItem.value = {
    title: itemTitle.value,
    price: itemPrice.value,
    duration: itemDuration.value,
  }
  console.log(previousItem.value);
  // createNewFacilityItem();
}

const { mutate: createFacilityItem, onDone: facilityItemCreated } = useMutation(
  CreateFacilityItemDocument
);

const createNewFacilityItem = () => {
  createFacilityItem({
    input: {
      facility_id: currentFacility.facility.id,
      title: itemTitle.value,
      price: itemPrice.value,
      duration: itemDuration.value,
      item_type: type.value === 'pass' ? 'PASS' : 'DROPIN',
    },
  })
    .then(async () => {
      const toast = await toastController.create({
        message: "New Gym Item was created successfully",
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
  padding: 0px 16px;
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
  border: 1px solid var(--gray-60);
  border-radius: 8px;
  font-size: 13px;
  color: var(--color-white);
}

.input-select-field {
  width: 100%;
  padding: 14px;
  background: #262626;
  border: 1px solid var(--gray-500);
  border-radius: 8px;
  font-size: 13px;
  color: var(--ion-color-medium);
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

  .label {
    color: var(--gray-60);
    font-family: Lato;
    font-size: 14px;
    font-weight: 500;
  }

  .prev {
    border: 1px solid var(--gray-500);
  }
}
.next-title {
  text-align: center;
  font-family: Lato;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
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
