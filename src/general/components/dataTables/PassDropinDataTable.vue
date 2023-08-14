<template>
  <div>
    <ion-grid class="event-table">
      <ion-row class="table-header">
        <ion-col class="table-th">
          <ion-text>Members</ion-text>
        </ion-col>
        <ion-col class="table-th">
          <ion-text>Pass type</ion-text>
        </ion-col>
        <ion-col class="table-th">
          <ion-text>E-mail</ion-text>
        </ion-col>
        <ion-col class="table-th">
          <ion-text>Start date</ion-text>
        </ion-col>
        <ion-col class="table-th">
          <ion-text>End date</ion-text>
        </ion-col>
        <ion-col class="table-th">
          <ion-text>Status</ion-text>
        </ion-col>
      </ion-row>
      <ion-row class="table-row ion-align-items-center">
        <ion-col size="2" class="table-td">
          <ion-text>Nick Fox</ion-text>
        </ion-col>
        <ion-col size="2" class="table-td">
          <ion-text>Basic</ion-text>
        </ion-col>
        <ion-col size="2" class="table-td">
          <ion-text>nickfox@gmail.com</ion-text>
        </ion-col>
        <ion-col size="2" class="table-td">
          <ion-text>11/07/2023</ion-text>
        </ion-col>
        <ion-col size="2" class="table-td">
          <ion-text>11/08/2023</ion-text>
        </ion-col>
        <ion-col size="2" class="table-td">
          <ion-button
            size="small"
            color="warning"
            class="button-rounded"
            fill="outline"
          >
            Pending renewal
          </ion-button>
        </ion-col>
      </ion-row>
      <ion-row class="table-row ion-align-items-center">
        <ion-col size="2" class="table-td">
          <ion-text>Nick Fox</ion-text>
        </ion-col>
        <ion-col size="2" class="table-td">
          <ion-text>Basic</ion-text>
        </ion-col>
        <ion-col size="2" class="table-td">
          <ion-text>nickfox@gmail.com</ion-text>
        </ion-col>
        <ion-col size="2" class="table-td">
          <ion-text>11/07/2023</ion-text>
        </ion-col>
        <ion-col size="2" class="table-td">
          <ion-text>11/08/2023</ion-text>
        </ion-col>
        <ion-col size="2" class="table-td">
          <ion-button
            size="small"
            color="success"
            class="button-rounded"
            fill="outline"
          >
            Active
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>

    <ion-grid>
      <ion-row class="pagination-bar ion-align-items-center">
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
          <ion-button
            color="medium"
            size="small"
            :disabled="true"
            fill="outline"
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
    </ion-grid>
  </div>
</template>

<script setup lang="ts">
import { IonButton, IonIcon } from "@ionic/vue";
import { chevronForwardOutline } from "ionicons/icons";
import { chevronBackOutline } from "ionicons/icons";
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
