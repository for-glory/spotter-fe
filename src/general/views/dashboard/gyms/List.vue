<template>
    <base-layout :hide-navigation-menu="role !== RoleEnum.Trainer" v-if="!isWebView">
        <template #header>
        <page-header
            class="cursor-pointer"
            back-btn
            :title="'Gym Locations'"
            @back="onBack"
        />
        </template>
        <template #content>
            <div class="add-gym-container">
                <ion-button class="add-gym-btn cursor-pointer" @click="goToGymCreate({
                    data: null,
                    title: 'New Gym',
                    })">Add new gym</ion-button>
            </div>
            <div class="list-container" v-for="(item, index) in facilities">
                <ion-card class="background-grey">
                    <ion-card-content>
                        <div class="d-flex ion-align-items-center ion-justify-content-center background-grey" style="gap: 10px">
                            <div>
                                <ion-thumbnail>
                                    <img alt="" :src="item.media && item.media.length ? item.media[0]?.pathUrl : null" />
                                </ion-thumbnail>
                            </div>

                            <div class="cursor-pointer" style="width: 100%;" @click="goToGymDetails(item)">
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
                            <div class="delete-icon ion-margin-end">
                                <ion-icon class="cursor-pointer" src="assets/icon/delete.svg"></ion-icon>
                            </div>
                        </div>
                    </ion-card-content>
                </ion-card>
            </div>
        </template>
    </base-layout>
    <template v-else>
        <div class="add-gym-container">
            <ion-button class="add-gym-btn cursor-pointer" @click="goToGymCreate({
                    data: null,
                    title: 'New Gym',
                    })">Add new gym</ion-button>
            </div>
            <div class="list-container" v-for="(item, index) in facilities">
                <ion-card class="background-grey">
                    <ion-card-content class="card-content">
                        <div class="d-flex ion-align-items-center ion-justify-content-center background-grey" style="gap: 10px">
                            <div>
                                <ion-thumbnail>
                                    <img alt="" :src="item.media && item.media.length ? item.media[0]?.pathUrl : null" />
                                </ion-thumbnail>
                            </div>

                            <div class="text-content cursor-pointer" @click="goToGymDetails(item)">
                                <div class="name-header">
                                    <div class="d-flex justify-content-between title">
                                        <span>{{ item.name }}</span>
                                    </div>
                                </div>
                                <div class="d-flex-col time-location">
                                    <div class="d-flex justify-content-start ion-align-items-center subtitle">
                                        <ion-icon src="assets/icon/location.svg"></ion-icon> <span>{{
                                            item.address?.street }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="delete-icon ion-margin-end">
                                <ion-icon class="cursor-pointer" src="assets/icon/delete.svg"></ion-icon>
                            </div>
                        </div>
                    </ion-card-content>
                </ion-card>
            </div>
    </template>
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
import useRoles from "@/hooks/useRole";
import { Capacitor } from '@capacitor/core';

const { role } = useRoles();

const props = withDefaults(
  defineProps<{
    isWebView?: boolean;
  }>(),
  {
    isWebView:  Capacitor.isNativePlatform() ? false : true,
  }
);

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
  createFacilityModal.value?.present();
}

const goToGymDetails = (gym:any) => {
    router.push({
        name: EntitiesEnum.DashboardManageGyms,
        params: {
            id: gym.id,
        }
    })
}

const onBack = () => {
  router.go(-1);
};
</script>
<style scoped lang="scss">
.list-container {
    margin: 16px 0;
    width: 84.7%;
    border-radius: 8px;
    border: 1px solid #E1DBC5;
    background-color: #262626 !important;
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
            font-size: 1.6rem;
            height: 26px;
        }

        span {
            font-family: Yantramanav;
            font-weight: 300;
            font-size: 14px;
            line-height: 21px;
        }
    }

    .delete-icon {
        height: 26px;
        color: #F86969;
        font-size: 1.6rem;
    }
}
.add-gym-container {
    display: flex;
    justify-content: end;
    padding: 15px;
    background-color: #262626;
    margin: 0 0 3.861% 0;
    ion-button {
      height: 40px;
    }
}
.background-grey {
    background-color: #262626 !important;
}

.text-content {
    width: 100%;
}
.card-content {
    padding: 12px 16px !important;
}

.name-header {
    height: 3.9vh;
    padding: 5px 0;
}
.time-location {
    height: 3.9vh;
    padding: 5px 0;
}

@media (max-width: 767px) {
  .list-container{
    width: auto;
    margin: 16px;
    .delete-icon {
        margin-right: 0;
    }
  }
}
.cursor-pointer {
  cursor: pointer;
}
</style>