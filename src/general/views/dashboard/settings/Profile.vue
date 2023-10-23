<template>
  <div>
    <ion-title class="title">
      My Profile
    </ion-title>
    <div class="content-box content-box__top justify-content-between">
      <div class="d-flex align-items-center">
        <ion-avatar class="photo">
					<ion-img v-if="facilityStore.facility.media?.length" :src="facilityStore.facility.media[0]?.pathUrl"></ion-img>
					<template v-else>
						{{ facilityStore.facility.name.charAt(0) }}
					</template>
				</ion-avatar>
        <div class="main-info-box">
          <ion-title class="content-box__title">{{ facilityStore.facility.name }}</ion-title>
          <ion-label class="main-info-box__label" color="medium">{{ roleText }}</ion-label>
          <ion-label class="main-info-box__label" color="medium">{{facilityStore.facility.address?.street}}</ion-label>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <!-- <ion-menu-toggle :auto-hide="false">
        </ion-menu-toggle> -->
        <ion-button fill="outline" class="content-box__button" @click="goToGymEdit">Edit</ion-button>
      </div>
    </div>
    <!-- <div class="content-box">
      <div class="content-box__top justify-content-between">
        <ion-title class="content-box__title">Personal Information</ion-title>
      </div>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-label class="text-label" color="medium">First Name</ion-label>
            <ion-text class="text-value">{{ store.first_name }}</ion-text>
          </ion-col>
          <ion-col>
            <ion-label class="text-label" color="medium">Last Name</ion-label>
            <ion-text class="text-value">{{ store.last_name }}</ion-text>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-label class="text-label" color="medium">Email Address</ion-label>
            <ion-text class="text-value">{{ store.email }}</ion-text>
          </ion-col>
          <ion-col>
            <ion-label class="text-label" color="medium">Phone</ion-label>
            <ion-text class="text-value">N/A</ion-text>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-label class="text-label" color="medium">Tax ID</ion-label>
            <ion-text class="text-value">N/A</ion-text>
          </ion-col>
          <ion-col>
            <ion-label class="text-label" color="medium">Address</ion-label>
            <ion-text class="text-value">N/A</ion-text>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div> -->
    <!-- <div class="content-box">
      <div class="content-box__top justify-content-between">
        <ion-title class="content-box__title">Address</ion-title>
        <ion-button fill="outline"  class="content-box__button">Edit</ion-button>
      </div>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-label class="text-label" color="medium">Country</ion-label>
            <ion-text class="text-value">United States</ion-text>
          </ion-col>
          <ion-col>
            <ion-label class="text-label" color="medium">City/State</ion-label>
            <ion-text class="text-value">Arizona, USA</ion-text>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-label class="text-label" color="medium">Postal code</ion-label>
            <ion-text class="text-value">100011</ion-text>
          </ion-col>
          <ion-col>
            <ion-label class="text-label" color="medium">Tax ID</ion-label>
            <ion-text class="text-value">AA742GA667</ion-text>
          </ion-col>
        </ion-row>      
      </ion-grid>
    </div> -->
  </div>
  <create-facility-modal ref="createFacilityModal"/>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, ref, inject } from "vue";
import {
	IonTitle,
  IonButton,
  IonLabel,
  IonAvatar,
  IonImg,
	IonGrid,
	IonRow,
	IonCol,
  IonMenuToggle
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { minutesDuration } from "@/const/minutes-durations";
import { useField } from "vee-validate";
import { EntitiesEnum } from "@/const/entities";
import { useProfileStore } from "../../../stores/profile";
import { requiredFieldSchema } from "@/validations/authValidations";
import { v4 as uuidv4 } from "uuid";
import { Query, RoleEnum } from "@/generated/graphql";
import useRoles from "@/hooks/useRole";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { dataURItoFile } from "@/utils/fileUtils";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import { Emitter, EventType } from "mitt";
import { useNewFacilityStore } from "@/facilities/store/new-facility";
import { GetFacilityDocument } from "@/graphql/documents/userDocuments";
import CreateFacilityModal from "@/general/views/dashboard/gyms/CreateFacility.vue";
import { useFacilityStore } from "@/general/stores/useFacilityStore";

const facilityStore = useFacilityStore();
const createFacilityModal = ref<typeof CreateFacilityModal | null>(null);

const newFacilityStore = useNewFacilityStore();
const { result, loading, onResult, refetch } = useQuery<Pick<Query, "facility">>(
  GetFacilityDocument,
  {
    id: facilityStore.facility.id,
  }
);

const goToGymEdit = () => {
  newFacilityStore.clear();
  const curFacility = result.value.facility;
  newFacilityStore.setAddress(
    curFacility?.address?.city?.state,
    curFacility?.address?.city,
    {
      thoroughfare: curFacility?.address?.street,
      subThoroughfare: curFacility?.address?.extra,
      latitude: curFacility?.address?.lat,
      longitude: curFacility?.address?.lng,
    } as any
  );

  const amenities = curFacility?.amenities?.map((option) => {
    return {
      id: option.id,
      label: option.name || "",
      value: option.id || "",
      isChecked: true,
      iconUrl: option.iconUrl || undefined,
    };
  });
  const equipments = curFacility?.equipments?.map((option) => {
    return {
      id: option.id,
      label: option.name || "",
      value: option.id || "",
      isChecked: true,
      iconUrl: option.iconUrl || undefined,
    };
  });

  curFacility.media?.map((option) => {
    newFacilityStore.addPhoto({
      ...option,
      url: option.pathUrl,
    });
  });
  newFacilityStore.setAmenities(amenities);
  newFacilityStore.setDescription(curFacility.description);
  newFacilityStore.setEquipments(equipments);
  newFacilityStore.setTitle(curFacility.name);

  createFacilityModal.value?.present({
    isEdit: true,
    selectedFacilityId: result?.value?.facility?.id
  });
}

const editFacility = () => {
  createFacilityModal.value?.present({
    isEdit: true,
    selectedFacilityId: facilityStore.facility.id
  });
}


const { role } = useRoles();

const roleText = computed(() => {
  if (role === RoleEnum.Admin) {
    return "Admin";
  } else if (role === RoleEnum.FacilityOwner) {
    return "Gym Owner";
  } else if (role === RoleEnum.Manager) {
    return "Gym Manager";
  } else if (role === RoleEnum.OrganizationOwner) {
    return "Organization Owner";
  } else if (role === RoleEnum.Trainer) {
    return "Trainer";
  } else return "User";
});

</script>

<style lang="scss" scoped>

ion-grid {
  padding: 0;

  ion-col {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0; 
  }

  ion-row {
    padding-top: 8px;
    padding-bottom: 8px;
  }
}

.title {
  padding: 0;
  font-size: 28px;
  line-height: 1.3;
  font-weight: 400;
  margin-bottom: 24px;
}
.top-buttons {
  display: flex;
  justify-content: space-between;
}
.dashboard-btn {
  margin-top: 10px;
}
.content-box {
  background-color: #0000001a;
  margin-top: 20px;
  margin-bottom: 20px;
  padding-top: 18px;
  padding-left: 21px;
  padding-bottom: 20px;

  .photo {
    width: 94px;
    height: 94px;
    margin-right: 24px;
  }

  &__top {
    display: flex;
    padding-right: 13px;
    padding-bottom: 18px;
  }

  &__title {
    padding-top: 5px;
    padding-left: 0px;
    padding-right: 0px;

  }

  &__button {
    max-height: 40px;
    max-width: 73px;
  }

}
.main-info-box {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__label {
    font: 14px/1 var(--ion-font-family);
  }
}
.text-value {
  color: var(--grey-text);
  font: 600 18px/1 var(--ion-font-family);
}
.text-label {
  font: 400 12px/1 var(--ion-font-family);
}
</style>
