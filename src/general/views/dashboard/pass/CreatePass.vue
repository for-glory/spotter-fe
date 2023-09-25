<template>
  <ion-item class="title ion-text-start"
    ><ion-icon
      class=""
      mode="ios"
      color="medium"
      :icon="chevronBackOutline"
    ></ion-icon>
    <span
      @click="navigate(EntitiesEnum.DashboardPassList)"
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
        <ion-col size="12">
          <div class="form-row">
            <div class="label">Upload gym logo</div>
            <div class="loader-area">
              Drag and Drop file <br />or<br />Choose file
            </div>
            <photo-loader />
          </div>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12" size-md="6">
          <div class="form-row">
            <ion-label class="label"> Title of pass </ion-label>
            <input
              class="input-text-field"
              type="text"
              placeholder="Enter plan name"
              name="plan"
            />
          </div>
        </ion-col>
        <ion-col size="12" size-md="6">
          <div class="form-row">
            <ion-label class="label"> Duration </ion-label>
            <select class="input-select-field" name="cars" id="cars">
              <option value="30">30 days (1 month)</option>
            </select>
          </div>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12" size-md="6">
          <div class="form-row">
            <ion-label class="label"> Choose equipment and amenitites </ion-label>
            <!-- <input
              class="input-text-field"
              type="text"
              placeholder="e.g: Cycling classes"
              name="features"
            /> -->
             <choose-block
              class="input-text-field"
              title="Equipment and amenities"
              @handle-click="onChooseAmenities"
              :value="facilityEquipments?.length + facilityAmenities?.length || ''"
            />
          </div>
          <!-- <div class="form-row">
            <ion-label class="label"> Choose equipment and amenitites </ion-label>
           
          </div> -->
        </ion-col>
        <ion-col size="12" size-md="6">
          <div class="form-row">
            <ion-label class="label"> Cost </ion-label>
            <input
              class="input-text-field"
              type="text"
              placeholder="Amount"
              name="cost"
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
              >Cancel</ion-button
            >
            <ion-button type="submit" @click="createNewFacilityItemPass"> Create </ion-button>
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
import { IonButton, IonIcon, IonLabel, toastController } from "@ionic/vue";
import { chevronBackOutline } from "ionicons/icons";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { useMutation } from "@vue/apollo-composable";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import {
  CreateFacilityItemDocument,
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

const router = useRouter();
const navigate = (name: EntitiesEnum) => {
  router.push({ name });
};
const equipmentAndAmenitiessModal = ref<typeof EquipmentAndAmenities | null>(
  null
);
const currentFacility = useFacilityStore();

const { mutate: createFacilityItemPass, onDone: facilityItemPassCreated } = useMutation(
  CreateFacilityItemDocument
);
const facilityEquipments = computed(() => []);
const facilityAmenities = computed(() => []);

const createNewFacilityItemPass = () => {
  const sampledata = {
    title: "test item pass",
    price: 50,
    duration: 20,
  }
  createFacilityItemPass({
    input: {
      facility_id: currentFacility.facility.id,
      title: sampledata.title,
      price: sampledata.price,
      duration: sampledata.duration,
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
};

const store = useNewFacilityStore();

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
</style>
