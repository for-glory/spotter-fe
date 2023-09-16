<template>


  <div class="add-gym-container">
      <ion-button class="add-gym-btn" @click="goToGymCreate({
              data: null,
              title: 'New Gym',
            })">Add new gym</ion-button>
    </div>
    <div class="list-container" v-for="(item, index) in facilities">
        <ion-card >
            <ion-card-content>
                <div class="d-flex ion-align-items-center ion-justify-content-center" style="gap: 10px">
                    <div>
                        <ion-thumbnail>
                            <img alt="" :src="item.media && item.media.length ? item.media[0]?.pathUrl : null" />
                        </ion-thumbnail>
                    </div>

                    <div class="" style="width: 100%;" @click="goToGymDetails(item)">
                        <div style="width: 100%; min-height: 50px">
                            <div class="d-flex justify-content-between title">
                                <span>{{ item.name }}</span>
                            </div>
                        </div>
                        <div class="d-flex-col time-location">
                            <div class="d-flex justify-content-start ion-align-items-center subtitle">
                                <ion-icon size="14px" src="assets/icon/location.svg"></ion-icon> <span>{{
                                    item.address?.street }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="delete-icon">
                        <ion-icon src="assets/icon/delete.svg"></ion-icon>
                    </div>
                </div>
            </ion-card-content>
        </ion-card>
    </div>
    <create-facility-modal ref="createFacilityModal" />
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import { defineProps, ref, withDefaults } from "vue";
import { useQuery } from "@vue/apollo-composable";
import {
  RoleEnum,
  Query,

  UserDocument
} from "@/generated/graphql";
import { GetFacilityDocument } from "@/graphql/documents/userDocuments";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import useId from "@/hooks/useId";
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import CreateFacilityModal from "@/general/views/dashboard/gyms/CreateFacility.vue";

const facilities = ref();
const { id } = useId();
const {
  result,
  refetch,
  onResult: gotUser,
} = useQuery<Pick<Query, "user">>(UserDocument, { id });
const router = useRouter();

gotUser(({ data }) => {
	if(data.user?.role === RoleEnum.Manager) {
		facilities.value = result.value?.user?.facilities;
	}
	else {
		facilities.value = result.value?.user?.owned_facilities;
	}
});

const createFacilityModal = ref<typeof CreateFacilityModal | null>(null);

const goToGymCreate = () => {
  // router.push({
  //   name: EntitiesEnum.DashboardGymCreate
  // })
  console.log("sdasdsad");
  createFacilityModal.value?.present();
}

const goToGymDetails = (gym:any) => {
    console.log("sasada ", gym.id);
    router.push({
        name: EntitiesEnum.DashboardManageGyms,
        params: {
            id: gym.id,
        }
    })
}
</script>
<style scoped lang="scss">
.list-container {
    margin: 10px 0;
    width: 84.7%;
    border-radius: 8px;
    border: 1px solid #E1DBC5;
    background-color: #262626;
    ion-card {
        margin: 0;
        border-radius: 10px;
    }

    .title {
        font: Yantramanav;
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
        color: #E1DBC5;
    }

    ion-thumbnail {
        --size: 68px;
        --border-radius: 8px;
    }

    .subtitle {
        ion-icon {
            color: #E1DBC5;
            font-size: 14px;
            height: 24px;
        }

        span {
            font-family: Yantramanav;
            font-weight: 300;
            font-size: 14px;
            line-height: 21px;
        }
    }

    .delete-icon {
        height: 24px;
        color: #F86969;
        font-size: 18px;
    }
}
.add-gym-container {
    display: flex;
    justify-content: end;
    padding: 15px;
    background-color: #262626;
    ion-button {
      height: 40px;
    }
  }
</style>