<template>
  <div class="upcoming-event-item">
    <div class="flex-container">
<ion-card class="full-width">
  <ion-card-content>
    <ion-list>
      <ion-item>
        <ion-thumbnail slot="start">
          <img alt="Silhouette of mountains" :src="media" />
        </ion-thumbnail>
        <ion-label>{{title}}
          <span class="ion-float-right">${{price}}</span><br>
          <span class="ion-float-left">{{start_date}}</span><br>
          <ion-icon :icon="time" slot="start"></ion-icon> 08:30 AM<br>
          <ion-icon :icon="location" slot="start"></ion-icon> {{street}}
          <div class="container">
        <div class="statusUp ion-float-right">{{ status }}</div>
      </div> 
        </ion-label>
      </ion-item>
    </ion-list>
  </ion-card-content>
</ion-card>

      <!-- <div>
        <div class="title">{{ title }}</div>
        <div class="date-time">{{ dateTime }}</div>
      </div>
      <div>
        <div class="status">{{ status }}</div>
      </div> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, withDefaults } from "vue";
 import { IonIcon, IonItem, IonLabel } from '@ionic/vue';
  import { informationCircle, time, location } from 'ionicons/icons';
const props = withDefaults(
  defineProps<{
     title?: string;
     street?: string;
     price?: string;
     start_date?: Date;
     media?: string;
    status?: string;
  }>(),
  { 
    status: "Upcoming",
  }
);
</script>
<style scoped lang="scss">
.content {
  display: contents;
}
.status {
  font-size: 14px;
  border-radius: 20px;
  background-color: grey;
  color: white;
  padding: 3px 8px;
}

.statusUp {
  font-size: 14px;
  border-radius: 20px;
  background-color: #EDE8D7;
  color: #F7685B;
  padding: 3px 8px;
}
.event-item {
  border-radius: 10px;
  background-color: var(--gray-800);
  margin-top: 1rem;
  padding: 1rem;
  .title {
    color: var(--grey-text);
    font-size: 16px;
    padding-bottom: 0.5rem;
  }
  .date-time {
    color: var(--fitnesswhite);
    font-size: 14px;
  }
}
.flex-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  grid-gap: 1.5rem;
}
.full-width {
  width: 100%;
}

.container {
  float: right;
}
</style>
