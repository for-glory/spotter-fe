<template>
    <div>
        <div class="banner">
            <ion-icon class="cursor-pointer" @click="goBack" src="assets/icon/arrow-back.svg" />
            <ion-label>Passes List</ion-label>
            <ion-icon class="cursor-pointer" src="assets/icon/arrow-back.svg" />
            <ion-label>Frank Autumn Profile</ion-label>
        </div>
        
        <div>
            <div class="image-container">
                <ion-avatar slot="start">
                    <img src="assets/backgrounds/banner1.jpeg" />
                </ion-avatar>
            </div>

            <ion-item class="ion-no-padding ion-text-center">
                <ion-label>
                    <h1>
                        Frank Autumn
                    </h1>
                    <h3>
                        frankaut@gmail.com
                    </h3>
                </ion-label>
            </ion-item>
            <ion-item class="d-flex align-items-center address-content">
                <ion-icon color="light" src="assets/icon/location.svg"></ion-icon>
                <ion-text>Summer Gym, Wall Street, 24</ion-text>
            </ion-item>
            <div class="detail">
                <ion-row>
                    <ion-col size="4" class="ion-no-padding">
                        <ion-item class="ion-no-padding ion-text-center" lines="none">
                            <ion-label class="border-right">
                                <h3>
                                    15-08-2023
                                </h3>
                                <p>
                                    Date
                                </p>
                            </ion-label>
                        </ion-item>
                    </ion-col>
                    <ion-col size="4" class="ion-no-padding">
                        <ion-item class="ion-no-padding ion-text-center" lines="none">
                            <ion-label class="border-right">
                                <h3>
                                    Full Gym Access
                                </h3>
                                <p>
                                    Session
                                </p>
                            </ion-label>
                        </ion-item>
                    </ion-col>
                    <ion-col size="4" class="ion-no-padding">
                        <ion-item class="ion-no-padding ion-text-center" lines="none">
                            <ion-label>
                                <h3>
                                    1 Day
                                </h3>
                                <p>
                                    Duration
                                </p>
                            </ion-label>
                        </ion-item>
                    </ion-col>
                </ion-row>
            </div>
            <div class="ion-text-center status-data">
                <ion-button class="ion-padding-top" size="small">Bundle</ion-button>
                <div class="detail">
                    <ion-row class="ion-margin-top">
                        <ion-col class="ion-no-padding" size="4">
                            <ion-item class="ion-no-padding ion-text center" lines="none">
                                <ion-label class="ion-text-center">
                                    <h3>
                                        Description
                                    </h3>
                                    <h3>
                                       -
                                    </h3>
                                </ion-label>
                            </ion-item>
                        </ion-col>
                        <ion-col class="ion-no-padding" size="4">
                            <ion-item class="ion-no-padding ion-text center" lines="none">
                                <ion-label class="ion-text-center">
                                    <h3>
                                        Bundle valid until
                                    </h3>
                                    <h3>
                                        -
                                    </h3>
                                </ion-label>
                            </ion-item>
                        </ion-col>
                        <ion-col class="ion-no-padding" size="4">
                            <ion-item class="ion-no-padding ion-text center" lines="none">
                                <ion-label class="ion-text-center">
                                    <h3>
                                        Status
                                    </h3>
                                    <h2 class="color-danger">
                                        Expired
                                    </h2>
                                </ion-label>
                            </ion-item>
                        </ion-col>
                    </ion-row>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IonButton, IonIcon, IonGrid, IonCol, IonRow, IonText } from "@ionic/vue";
import { chevronForwardOutline } from "ionicons/icons";
import { chevronBackOutline } from "ionicons/icons";
import dayjs from "dayjs";
import { defineProps, withDefaults } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

withDefaults(
    defineProps<{
        PassDropinsData: any;
    }>(),
    {
        PassDropinsData: []
    }
);
const goBack = () => {
  router.go(-1);
}
</script>

<style scoped lang="scss">
ion-item {
    --background: transparent;
    --inner-padding-end: 0;
}

.image-container {
    width: 100%;
    margin-top: 5%;
    ion-avatar {
        height: 159px;
        width: 159px;
        margin: 0 auto;
    }
}

.address-content {
    width: fit-content;
    margin: 0 auto;
    ion-text {
        color: #E1DBC5;
    }
}

.detail {
    color: #C4C4C4;
    width: 26.1vw;
    background-color: #262626;
    border-radius: 8px;
    margin: 0 auto;

    .border-right {
        border-right: 2px solid #19191B;
    }
}

.status-data {
    ion-button {
        --padding-start: 20px;
        --padding-end: 20px;
    }
    background-color: #262626;
    width: 60.2vw;
    height: 25.8vh;
    margin: 0 auto;
    margin-top: 32px;
    border-radius: 8px;
    color: #C4C4C4;
}

.color-danger {
    color: #ff0000;
}
.cursor-pointer {
  cursor: pointer;
}

.banner {
    ion-icon {
        font-size: 30px;
    }
    ion-label {
        font-size: 22px;
        padding-left: 10px;
    }
    display: flex;
    justify-content: left;
}
</style>