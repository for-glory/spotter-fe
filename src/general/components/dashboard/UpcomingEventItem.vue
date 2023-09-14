<template>
  <ion-card>
    <ion-card-content>
      <div class="d-flex ion-align-items-center ion-justify-content-center" style="gap: 10px">
        <ion-thumbnail>
          <img alt="Silhouette of mountains" :src="media" />
        </ion-thumbnail>
        <div class="" style="width: 100%;">
          <div style="width: 100%; min-height: 50px">
            <div class="d-flex justify-content-between title" >
              <span>{{title}}</span>
              <span>${{formatNumber(price)}}</span>
            </div>
            <div class="d-flex justify-content-between" >
              <span>{{getDate}}</span>
              <span class="subtitle">Entry</span>
            </div>
          </div>
          <div class="d-flex-col time-location" style="">
            <div class="d-flex justify-content-start ion-align-items-center" style="gap: 0.25rem" >
              <ion-icon :icon="time"></ion-icon> <span class="time"> {{getTime}} </span>
            </div>
            <div class="d-flex justify-content-start ion-align-items-center subtitle" style="gap: 0.25rem">
              <ion-icon style="margin-bottom: 9%;" size="14px" :icon="location"></ion-icon> <span class="break">{{street}}</span>
            </div>
            <div class="upcoming">Upcoming</div>
          </div>
        </div>
      </div>
    </ion-card-content>

    <div v-show="isLast" class="view-details">
      <ion-button>View full info</ion-button>
    </div>
  </ion-card>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import {computed, defineProps, withDefaults} from "vue";
 import { IonIcon, IonButton } from '@ionic/vue';
  import { time, location } from 'ionicons/icons';
const props = withDefaults(
  defineProps<{
     title?: string;
     street?: string;
     price?: string;
     start_date?: Date;
     media?: string;
    status?: string;
    isLast?: number;
  }>(),
  { 
    status: "Upcoming",
  }
);
const getDate = computed(() => {
  return dayjs(props.start_date).format('DD MMM') || ''
})

const formatNumber = ((num: any) => {
    return parseFloat(num).toFixed(2)
  })
const getTime = computed(() => {
  return dayjs(props.start_date).format('HH:mm a') || ''
})
</script>
<style scoped lang="scss">
.time-location {
  width: 100%;
  min-height: 52px;
  gap: 0.44rem;
  position: relative;
  .upcoming {
    position: absolute;
    right: 0;
    bottom: 1px;
    background-color: #EDE8D7;
    border-radius: 30px;
    padding: 5px 7px;
    color: #F7685B;
    font-family: Lato;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
}
ion-card-content {
  padding-inline-start: 16px;
  padding-inline-end: 13px;
  padding-top: 19px;
  padding-bottom: 0px;
  margin-bottom: 14px;
}

ion-thumbnail {
  --size: 68px;
  --border-radius: 8px;
}

.title {
  color: var(--white, #FFF);
  /* yantra/body 1 */
  font-family: Yantramanav;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 1.5rem */
}
.subtitle {
  color: var(--light-grey, #C4C4C4);
  text-align: center;
  /* yantra/body3 */
  font-family: Yantramanav;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 300;
  line-height: 150%; /* 1.3125rem */
}

.date {

}

ion-icon {
  color: #EDE8D7;
}

.break {
  display: block;
    width: 100px;
    overflow-wrap: break-word;
}

.time {
  color: var(--white, #FFF);
  /* yantra/body 2 */
  font-family: Yantramanav;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
}

.view-details {
  width: 100%;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  padding-right: 10px;
  border: 1px solid #DBB582;
  background: #EDE8D7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  ion-button {
    --background: white;
    --border-radius: 0.5rem;
    --border-style: solid;
    --border-width: 1px;
    --border-color: #FFB946;
    --padding-start: 1rem;
    --padding-end: 1rem;
    --padding-top: 0.5rem;
    --padding-bottom: 0.5rem;
      color: #323C47;
      font-family: Lato;
      font-size: 0.875rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
  }
}
</style>
