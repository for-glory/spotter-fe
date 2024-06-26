<template>
  <ion-item class="title ion-text-start"
    ><ion-icon
      class=""
      mode="ios"
      color="medium"
      :icon="chevronBackOutline"
    ></ion-icon>
    <span
      @click="navigate(EntitiesEnum.DashboardPassViewList)"
      class="medium ion-padding-end clickable"
    >
      Passes
    </span>
    <ion-icon
      class=""
      mode="ios"
      color="primary"
      :icon="chevronBackOutline"
    ></ion-icon>
    <span class="current-crumb">Create passes</span>
  </ion-item>

  <div class="form-body">
    <ion-grid fixed>
      <ion-row>
        <ion-col size="12" size-md="6">
          <div class="form-row">
            <ion-label class="label"> Title of Gym pass </ion-label>
            <input
              class="input-text-field"
              type="text"
              placeholder="Enter plan name"
              name="plan"
              v-model="planName"
            />
          </div>
        </ion-col>
        <ion-col size="12" size-md="6">
          <div class="form-row">
            <ion-label class="label"> Duration </ion-label>
            <!-- <select class="input-select-field" name="cars" id="cars">
            </select> -->
            <input class="input-text-field d-block" @click="openSimplePicker" type="select" v-model="duration" placeholder="Select number of months"/>
          </div>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12" size-md="6">
          <div class="form-row">
            <ion-label class="label"> Set the price for gym pass (USD $) </ion-label>
            <input
              class="input-text-field"
              type="text"
              placeholder="Amount"
              name="cost"
              v-model="planPrice"
            />
          </div>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12" size-md="6"> </ion-col>
        <ion-col size="12" size-md="6">
          <div class="ion-text-end">
            <ion-button
              fill="outline"
              color="medium"
              type="submit"
              class="ion-margin-end"
              @click="cancel"
              >Cancel</ion-button
            >
            <ion-button type="submit" v-if="!isEdit" @click="createNewFacilityItemPass" :disabled="!isValidForm">Create</ion-button>
            <ion-button type="submit" v-else @click="createNewFacilityItemPass" :disabled="!isValidForm">Save</ion-button>
          </div>
        </ion-col>
        <ion-col size="0" size-md="3"></ion-col>
      </ion-row>
    </ion-grid>
  </div>
  <equipment-and-amenities
    ref="equipmentAndAmenitiessModal"
    @cancel="equipmentAndAmenitiessSelected"
  />
</template>

<script setup lang="ts">
import { IonButton, IonIcon, IonLabel, toastController, pickerController } from "@ionic/vue";
import { chevronBackOutline } from "ionicons/icons";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import {
  Query,
  CreateFacilityItemDocument, UpdateFacilityItemDocument
} from "@/generated/graphql";
import {
  ref,
  computed,
  defineEmits,
  withDefaults,
  defineProps,
  defineExpose,
} from "vue";
import EquipmentAndAmenities from "@/general/views/EquipmentAndAmenities.vue";
import { EquipmentAndAmenitiesModalResult } from "@/interfaces/EquipmentAndAmenitiesModal";
import { CheckboxValueType } from "@/ts/types/checkbox-value";
// import { useNewFacilityStore } from "../store/new-facility";
import { useNewFacilityStore } from "../../../../facilities/store/new-facility";
import { dataURItoFile } from "@/utils/fileUtils";
import { v4 as uuidv4 } from "uuid";
import { FilePreloadDocument, CitiesDocument } from "@/generated/graphql";
import PhotosLoader from "@/general/components/PhotosLoader.vue";
import { usePassDropinsItemsStore } from "@/general/stores/usePassDropinsItemsStore";
import { useRoute } from "vue-router";
import { object } from "yup";
import { GetFacilityDocument } from "@/graphql/documents/userDocuments";

const currentFacility = useFacilityStore();
const facilityEquipments = ref([]);
const facilityAmenities = ref([]);
const store = useNewFacilityStore();

const { result, loading, onResult, refetch } = useQuery<Pick<Query, "facility">>(
  GetFacilityDocument,
  {
    id: currentFacility?.facility?.id,
  }
);

onResult((result:any) => {
  const amenities = result?.data?.facility?.amenities?.map((option) => {
    return {
      id: option.id,
      label: option.name || "",
      value: option.id || "",
      isChecked: true,
      iconUrl: option.iconUrl || undefined,
    };
  });
  const equipments = result?.data?.facility?.equipments?.map((option) => {
    return {
      id: option.id,
      label: option.name || "",
      value: option.id || "",
      isChecked: true,
      iconUrl: option.iconUrl || undefined,
    };
  });
  facilityEquipments.value = amenities;
  facilityAmenities.value = equipments;
  store.setAmenities(amenities);
  store.setEquipments(equipments);
});

const route = useRoute();
const passDropinsItemsStore = usePassDropinsItemsStore();
passDropinsItemsStore.passDropinsData
const router = useRouter();
const navigate = (name: EntitiesEnum) => {
  router.push({ name });
};
const equipmentAndAmenitiessModal = ref<typeof EquipmentAndAmenities | null>(
  null
);
const photoOnLoad = ref<boolean>(false);
const percentPhotoLoaded = ref<number | undefined>();
const facilityPhotos = computed(() => store.photos);
const { mutate: createFacilityItemPass, onDone: facilityItemPassCreated } = useMutation(
  CreateFacilityItemDocument
);
const { mutate: updateFacilityItemPass, onDone: facilityItemPassUpdated } = useMutation(
  UpdateFacilityItemDocument
);
let duration = ref<string>(passDropinsItemsStore?.passDropinsData?.duration || "");
let planName = ref<string>(passDropinsItemsStore?.passDropinsData?.title || "");
let planPrice = ref<string|number>(Number(passDropinsItemsStore?.passDropinsData?.price)? Number(passDropinsItemsStore?.passDropinsData?.price)/100 : "");

const isValidForm = computed(
  () =>
    duration.value &&
    planName.value &&
    planPrice.value &&
    Number(planPrice.value)
);

const isEdit = ref(false);
isEdit.value = route.params.id ? true : false;

const createNewFacilityItemPass = () => {
  if (!isEdit.value) {
    createFacilityItemPass({
      input: {
        facility_id: currentFacility.facility.id,
        title: planName.value,
        price: Math.floor(Number(planPrice.value)*100),
        duration: Number(duration.value),
        item_type: "PASS",
      },
    })
      .then(async () => {
        const toast = await toastController.create({
          message: "New Pass was created successfully",
          duration: 2000,
          icon: "assets/icon/success.svg",
          cssClass: "success-toast",
        });
        toast.present();
        passDropinsItemsStore.clearState();
        router.go(-1);
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
  } else {
    updateFacilityItemPass({
    id: route.params.id,
      input: {
        // facility_id: currentFacility.facility.id,
        title: planName.value,
        price: Math.floor(Number(planPrice.value)*100),
        duration: Number(duration.value),
        // item_type: "PASS",
      },
    })
      .then(async () => {
        const toast = await toastController.create({
          message: "Pass was updated successfully",
          duration: 2000,
          icon: "assets/icon/success.svg",
          cssClass: "success-toast",
        });
        toast.present();
        passDropinsItemsStore.clearState();
        router.go(-1);
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

};

const cancel = () => {
  passDropinsItemsStore.clearState();
  router.go(-1);
}

    const getColumns = (numColumns: any, columnOptions: any) => {
      let columns = [];
      for (let i = 0; i < numColumns; i++) {
        let len = columnOptions[i].data.length;
        // if a na,e is provided then set the object to the
        // the name provided
        let colName = columnOptions[i].name || `col-${i}`;
        let col = {
          name: colName,
          options: getColumnOptions(i, len, columnOptions),
        };
        columns.push(col);
      }
      return columns;
    };

    const getColumnOptions = (
      columnIndex: any,
      numOptions: any,
      columnOptions: any
    ) => {
      let options = [];
      for (let i = 0; i < numOptions; i++) {
        // if there is no value property provided in the column data
        // then set value to the row index
        if (typeof columnOptions[columnIndex].data[i] == "object") {
          options.push({
            text: columnOptions[columnIndex].data[i % numOptions][0],
            value: columnOptions[columnIndex].data[i % numOptions][1],
          });
        } else {
          options.push({
            text: columnOptions[columnIndex].data[i % numOptions],
            value: i,
          });
        }
      }
      return options;
    };

    const openSimplePicker = async () => {
      // set the arry for the column information, you can set the name of the column
      // and the array of data that should be rendered in the column
      let colOptions = [
        {
          name: "Months",
          data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        },
      ];
      // now create the picker, but first you need to create the columns
      // in the proper format for ionic vue to deal with them
      const picker = await pickerController.create({
        columns: getColumns(1, colOptions),
        cssClass: 'duration-select',
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Confirm",
            role: "confirm",
            handler: (value) => {
              // console.log("Got Value", value);
              duration.value = value?.Months?.text;
              console.log('duration: ', duration);
              picker.dismiss(value, "confirm");
            },
          },
        ],
      });
      picker.onDidDismiss().then((v) => {
        console.log("onDidDismiss", v);
      });
      // present the picker
      await picker.present();
    };

const equipmentAndAmenitiessSelected = (
  result: EquipmentAndAmenitiesModalResult
) => {
  // store.setEquipments(result.equipments || []);
  // store.setAmenities(result.amenities || []);
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
}

const deletePhoto = (index: number, id: string) => {
  store.deletePhoto(index);
  // if (props.edit && id) {
  //   emits("on-delete-media", id);
  // }
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
  margin: 48px 10px 0;
  padding: 16px 72px;
  background-color: var(--gray-700);
  border-radius: 8px;
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
  // padding: 16px 32px;
  border-radius: 8px;
  line-height: 24px;
  font-size: 14px;
  height: 88px;
  width: 88px;

  .image-area{
    height: 84px;
    object-fit: cover;
    border-radius: 8px;
  }
}

.input-text-field {
  width: 100%;
  padding: 16px;
  background: #262626;
  border: 1px solid var(--gray-500);
  border-radius: 8px;
  font-size: 13px;
  color: var(--ion-color-medium);
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
.equipment-amenitites-field {
  width: 100%;
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

.d-block {
  display: block;
}

ion-button {
  cursor: pointer;
}

</style>
