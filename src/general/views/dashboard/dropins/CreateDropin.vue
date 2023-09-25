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
    />
    <span class="current-crumb">Create drop in</span>
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
            <ion-label class="label"> Title of Drop in </ion-label>
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
              <option value="30">24 hours (1 day)</option>
            </select>
          </div>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12" size-md="6">
          <div class="form-row">
            <ion-label class="label"> Features </ion-label>
            <input
              class="input-text-field"
              type="text"
              placeholder="e.g: Cycling classes"
              name="features"
            />
          </div>
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
            <ion-button type="submit"> Create </ion-button>
          </div>
        </ion-col>
        <ion-col size="0" size-md="3"></ion-col>
      </ion-row>
    </ion-grid>
  </div>
</template>

<script setup lang="ts">
import { FacilityItemsByFacilityIdAndTypeDocument, GetCustomersByFacilityItemsDocument } from "@/generated/graphql";
import { IonButton, IonIcon, IonLabel,  } from "@ionic/vue";
import { chevronBackOutline } from "ionicons/icons";
import { useQuery } from "@vue/apollo-composable";
import { EntitiesEnum } from "@/const/entities";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
// import { Multiselect } from "vue-multiselect";

const router = useRouter();
const route = useRoute();

const navigate = (name: EntitiesEnum) => {
  router.push({ name });
};

const dropinsDetail = route.params.data;
const currentFacilityId = route.params.id;
console.log("currentId", currentFacilityId);
// Dropins start
const {
  result: dropinResult,
  loading: loadingFacilityDropin
} = useQuery(GetCustomersByFacilityItemsDocument, {
  facility_id: currentFacilityId,
  item_type: 'DROPIN',
});

const dropins = computed(() => {
  console.log("### dropinResult ", dropinResult.value?.facilityItemsByFacilityIdAndType);
  return dropinResult.value?.facilityItemsByFacilityIdAndType?.data;
});

// Dropins End
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
