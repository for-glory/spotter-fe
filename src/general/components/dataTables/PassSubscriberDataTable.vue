<template>
  <div>
    <ion-grid class="event-table" v-if="passes && passes.length">
      <ion-row class="table-header">
        <ion-col size="2" class="table-th">
          <ion-text>Members</ion-text>
        </ion-col>
        <ion-col size="2" class="table-th">
          <ion-text>Pass type</ion-text>
        </ion-col>
        <ion-col size="2" class="table-th">
          <ion-text>E-mail</ion-text>
        </ion-col>
        <ion-col size="2" class="table-th">
          <ion-text>Start date</ion-text>
        </ion-col>
        <ion-col size="2" class="table-th">
          <ion-text>End date</ion-text>
        </ion-col>
        <ion-col size="2" class="table-th">
          <ion-text>Status</ion-text>
        </ion-col>
      </ion-row>
      <ion-row class="table-row" v-for="pass in passes" :key="pass.id">
        <ion-col size="2" class="table-td" @click="gymPassDetails(pass)">
          <ion-text>{{ `${pass.user?.first_name} ${pass.user?.last_name}` }}</ion-text>
        </ion-col>
        <ion-col size="2" class="table-td">
          <ion-text>{{ pass.facilityItem?.title }}</ion-text>
        </ion-col>
        <ion-col size="2" class="table-td">
          <ion-text>{{ pass.user?.email }}</ion-text>
        </ion-col>
        <ion-col size="2" class="table-td">
          <ion-text>{{ pass.start_date?dayjs(pass.start_date).format("MM/DD/YY"):"-" }}</ion-text>
        </ion-col>
        <ion-col size="2" class="table-td">
          <ion-text>{{ pass.end_date?dayjs(pass.end_date).format("MM/DD/YY"):"-" }}</ion-text>
        </ion-col>
        <ion-col size="2" class="table-td">
          <ion-button
            size="small"
            :color="pass.is_active_pass?'success':'danger'"
            class="button-rounded"
            fill="outline"
          >
            {{ pass.is_active_pass?'Active':'Expired' }}
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
      <!-- <p @click="gymPassDetails({isGymDetails: true, id: 11})">Click me</p> -->
    <!-- <ion-grid>
      <ion-row class="pagination-bar">
        <ion-col size="2">
          <ion-button
            color="medium"
            size="small"
            :disabled="true"
            class=""
            fill="outline"
            ><ion-icon
              class="ion-margin-end"
              mode="ios"
              color="light"
              :icon="chevronBackOutline"
            ></ion-icon>
            Previous</ion-button
          >
        </ion-col>

        <ion-col size="8" class="ion-text-center pagination-counter">
          <span class="active" fill="solid" color="dark">1</span>
          <span class="inactive" fill="solid" color="dark">2</span>
          <span class="inactive" fill="solid" color="dark">3</span>
          <span class="inactive" fill="solid" color="dark">4</span>
          <span class="inactive" fill="solid" color="dark">5</span>
          <span class="inactive" fill="solid" color="dark">6</span>
          <span class="inactive" fill="solid" color="dark">7</span>
        </ion-col>

        <ion-col size="2" class="ion-text-end">
          <ion-button color="medium" size="small" class="" fill="outline"
            >Next
            <ion-icon
              class="ion-margin-start"
              mode="ios"
              color="light"
              :icon="chevronForwardOutline"
            ></ion-icon
          ></ion-button>
        </ion-col>
      </ion-row>
    </ion-grid> -->
  </div>
</template>

<script setup lang="ts">
import { IonButton, IonIcon, IonGrid, IonCol, IonRow, IonText } from "@ionic/vue";
import { chevronForwardOutline } from "ionicons/icons";
import { chevronBackOutline } from "ionicons/icons";
import dayjs from "dayjs";
import { defineProps, withDefaults } from "vue";

withDefaults(
  defineProps<{
    passes: any;
  }>(),
  {
		passes:[]
  }
);
const emits = defineEmits<{
  (e: "passDetails", data: any): void;
}>();

// const gymPassDetails = (pass: any) => {
//   emits("passDetails",pass);
// };

const gymPassDetails = (pass: any) => {
  console.log('toEdit', pass);
  emits("passDetails", pass);
}
</script>

<style scoped lang="scss">
.event-table {
  border: 1px solid var(--fitnesswhite);
  background: var(--gray-700);
  width: 100%;
  padding: 0;

  .table-th {
    border-bottom: 1px solid var(--beige);
    padding: 10px 16px;
    // border-right: 1px solid var(--beige);
  }
  ion-col {
    border-right: 1px solid var(--beige);
    display: flex;
    align-items: center;
  }
  .table-td {
    //  border: 1px solid var(--beige);
    padding: 0 0 0 16px;
  
    ion-button {
      font-size: 14px;
      height: 32px;
      margin: 16px 0;
    }
  }
}
.table-header {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: var(--main-color);
  color: var(--gold);
}

.table-row {
  border-top: 1px solid var(--beige);
}
.pagination-bar {
  margin-top: 64px;
}

.pagination-counter {
  .active {
    padding: 12px 16px;
    margin-right: 4px;
    margin-left: 4px;
    color: var(--fitnesswhite);
    background: var(--gray-600);
    border-radius: 8px;
  }
  .inactive {
    padding: 12px 16px;
    margin-right: 4px;
    margin-left: 4px;
    color: var(--gray-600);
  }
}
</style>
