<template>
    <div class="list-container ion-margin-vertical" v-for="(item, index) in allData">
        <ion-card>
            <ion-card-content>
                <div class="d-flex ion-align-items-center ion-justify-content-center" style="gap: 10px">
                    <div>
                        <ion-thumbnail>
                            <img alt="" :src="item?.media && item?.media?.length ? item?.media[0]?.pathUrl : null" />
                        </ion-thumbnail>
                    </div>
                    <div class="text-content">
                        <div class="d-flex justify-content-between title">
                            <span>{{ item?.name }}</span>
                        </div>
                        <div class="d-flex-col">
                            <div class="d-flex justify-content-start ion-align-items-center subtitle">
                                <ion-icon src="assets/icon/location.svg"></ion-icon>
                                <span>{{ item.address?.street }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="delete-icon">
                        <ion-icon class="ion-margin-end" src="assets/icon/delete.svg"></ion-icon>
                    </div>
                </div>
            </ion-card-content>
        </ion-card>
    </div>
</template>


<script setup lang="ts">
import { IonButton, IonIcon, IonGrid, IonRow, IonCol, IonText } from "@ionic/vue";
import { chevronForwardOutline } from "ionicons/icons";
import { chevronBackOutline } from "ionicons/icons";
import dayjs from "dayjs";
import { defineProps, withDefaults } from "vue";

const props = withDefaults(
    defineProps<{
        allData: any;
    }>(),
    {
        allData: [],
    }
);

console.log("!!!! ", props)
</script>
<style scoped lang="scss">
.list-container {
    width: 84.7%;
    border-radius: 8px;
    border: 1px solid #E1DBC5;
    background-color: #262626;
    height: 99px;

    ion-card {
        margin: 0;
        border-radius: 10px;

        ion-card-content {
            div {
                max-height: 65px;
            }
        }
    }

    .text-content {
        width: 100%;

        .title {
            font: Yantramanav;
            font-weight: 700;
            font-size: 16px;
            line-height: 24px;
            color: #E1DBC5;
            min-height: 50px
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
    }


    ion-thumbnail {
        --size: 68px;
        --border-radius: 8px;
    }



    .delete-icon {
        height: 24px;
        color: #F86969;
        font-size: 18px;
    }
}
</style>
