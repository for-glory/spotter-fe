<template>
  <div v-if="!Capacitor.isNativePlatform()">
    <div class="flex-row">
      <ion-text class="page">Getting Paid</ion-text>
      <ion-icon src="assets/icon/arrow-next.svg" />
    </div>
    <ion-grid class="gap">
      <ion-row>
        <ion-col size="12" size-xl="8">
          <div class="box1">
            <ion-text class="title">Available funds</ion-text>
            <div class="flex-container">
              <ion-text class="content"
                >Your available balance is
                <span class="fund">$3,689,076</span>
              </ion-text>
              <IonButton class="get" @click="handleGet">Get paid now</IonButton>
            </div>
          </div>
          <div class="box2">
            <ion-text class="title2">Withdrawal method</ion-text>
            <div class="flex-container">
              <ion-text class="content">
                Add/change withdrawal method
              </ion-text>
              <IonButton class="add" @click="handleAdd"
                >Add new method</IonButton
              >
            </div>
          </div>
        </ion-col>
        <ion-col size="12" size-xl="4">
          <div class="box3">
            <ion-title>Revenue</ion-title>
            <ion-grid class="gap">
              <ion-row>
                <ion-col size="12" size-xl="12">
                  <div class="revenue">
                    <div class="type">Total revenue</div>
                    <div class="period">Today</div>
                    <div class="percent">
                      0.8%
                      <ion-icon class="arrow" src="assets/icon/call_made.svg" />
                    </div>
                    <div class="chain">$3,689,076</div>
                  </div>
                </ion-col>
                <ion-col size="12" size-xl="12">
                  <div class="revenue flex-container">
                    <div>
                      <div class="type">Quarterly revenue</div>
                      <div class="period">Earned</div>
                      <div class="percent">70%</div>
                      <div class="chain">
                        $1068<span class="period">/ day</span>
                      </div>
                    </div>
                    <ion-icon
                      class="vector"
                      src="assets/icon/chat/Vector.svg"
                    />
                  </div>
                </ion-col>
                <ion-col size="12" size-xl="12">
                  <div class="revenue">
                    <div class="type">Earned revenue</div>
                    <div class="period">This year</div>
                    <div class="percent">
                      0.8%
                      <ion-icon class="arrow" src="assets/icon/call_made.svg" />
                    </div>
                    <div class="chain">$689,076</div>
                  </div>
                </ion-col>
              </ion-row>
            </ion-grid>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
  <base-layout v-else>
    <template #header>
      <page-header back-btn @back="onBack" title="Getting paid" />
    </template>
    <template #content>
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-xl="8">
            <div class="box1__native">
              <ion-text class="title__native">Available funds</ion-text>
              <div class="flex-container">
                <ion-text class="content"
                  >Your available balance is
                  <span class="fund">$3,689,076</span>
                </ion-text>
                <IonButton class="get" @click="handleGet">Get paid now</IonButton>
              </div>
            </div>
            <div class="box2__native">
              <ion-text class="title2__native">Withdrawal method</ion-text>
              <div class="flex-container">
                <ion-text class="content">
                  Add/change withdrawal method
                </ion-text>
                <IonButton class="add" @click="handleAdd"
                  >Add new method</IonButton
                >
              </div>
            </div>
          </ion-col>
          <ion-col size="12" size-xl="4">
            <div class="box3__native">
              <ion-title>Revenue</ion-title>
              <ion-grid class="gap">
                <ion-row>
                  <ion-col size="12" size-xl="12">
                    <div class="revenue">
                      <div class="type">Total revenue</div>
                      <div class="period">Today</div>
                      <div class="percent">
                        0.8%
                        <ion-icon class="arrow" src="assets/icon/call_made.svg" />
                      </div>
                      <div class="chain">$3,689,076</div>
                    </div>
                  </ion-col>
                  <ion-col size="12" size-xl="12">
                    <div class="revenue flex-container">
                      <div>
                        <div class="type">Quarterly revenue</div>
                        <div class="period">Earned</div>
                        <div class="percent">70%</div>
                        <div class="chain">
                          $1068<span class="period">/ day</span>
                        </div>
                      </div>
                      <ion-icon
                        class="vector"
                        src="assets/icon/chat/Vector.svg"
                      />
                    </div>
                  </ion-col>
                  <ion-col size="12" size-xl="12">
                    <div class="revenue">
                      <div class="type">Earned revenue</div>
                      <div class="period">This year</div>
                      <div class="percent">
                        0.8%
                        <ion-icon class="arrow" src="assets/icon/call_made.svg" />
                      </div>
                      <div class="chain">$689,076</div>
                    </div>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import {
  IonCol,
  IonGrid,
  IonRow,
  IonText,
  IonTitle,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { Capacitor } from '@capacitor/core';

const router = useRouter();
const handleGet = () => {
  console.log("get");
};
const handleAdd = () => {
  console.log("add");
};
const onBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.page {
  color: var(--gold);
  font-size: 25px;
}
.type {
  font-size: 1rem;
  color: white;
  padding-bottom: 10px;
}
.vector {
  position: absolute;
  height: 50%;
  width: 140%;
  top: 60px;
}
.percent {
  font-size: 1.625rem;
  color: #2ed47a;
  padding-bottom: 5px;
}
.chain {
  font-size: 1.625rem;
  color: white;
}
.title {
  padding: 0;
  font-size: 1.6rem;
  line-height: 1.3;
  font-weight: 400;
}
.dashboard-btn {
  margin-top: 10px;
}
.block {
  width: 100%;
  background-color: var(--gray-700);
  border-radius: 10px;
  margin-bottom: 1rem;
  padding: 1rem 1rem 1rem 1rem;
}
.flex-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 1rem;
  grid-gap: 1rem;
  align-items: center;
}
.flex-row {
  display: flex;
  margin-top: -40px;
  flex-direction: row;
  justify-content: flex-start;
  grid-gap: 1rem;
  align-items: center;
}
.count {
  font-size: 1.625rem;
  color: var(--gold);
  padding-left: 0.6rem;
  font-weight: bold;
}
.period {
  font-size: 1rem;
  color: grey;
  padding-bottom: 0.6rem;
}
.time {
  font-size: 0.875rem;
  color: var(--gold);
}
.content {
  font-size: 1rem;
  color: #797979;
}
.revenue {
  margin: 0.3rem 0.3rem;
  padding: 1rem 0 1rem 1rem;
  border: 1px solid white;
  border-radius: 10px;
}
.arrow {
  padding-left: 0.6rem;
}
.box1 {
  background-color: #534e4e;
  padding: 20px 20px 8px 20px;
  margin-top: 100px;
  margin-left: 0.5rem;
  margin-right: 0.5rem;

  &__native {
    background-color: #54534E;
    padding: 20px 20px 8px 20px;
  }
}
.box2 {
  background-color: #534e4e;
  padding: 20px 20px 8px 20px;
  margin-top: 30px;
  margin-left: 0.5rem;
  margin-right: 0.5rem;

  &__native {
    margin-top: 30px;
    background-color: #54534E;
    padding: 20px 20px 8px 20px;
  }
}
.box3 {
  padding: 20px 0 100px 0;
  background: #312f2f;
  border-radius: 15px;
  margin-left: 0.5rem;
  margin-right: 0.5rem;

  &__native {
    background-color: #262626;
    border-radius: 15px;
    padding: 20px 0 100px 0;
  }
}
.title {
  font-size: 20px;
  display: block;
  margin-bottom: 40px;

  &__native {
    font-size: 20px;
    display: block;
    margin-bottom: 10px;
  }
}
.content {
  color: #9b9999;
}
.fund {
  font-size: 20px;
  color: white;
}
.title2 {
  font-size: 25px;
  margin-bottom: 70px;
  display: block;
  
  &__native {
    font-size: 25px;
    display: block;
  }
}
.add {
  color: var(--gold);
  --background: #534e4e;
  border: 1px solid var(--gold);
  border-radius: 10px;
  height: 45px;
}
.get {
  height: 45px;
}
@media (max-width: 800px) {
  .flex-container {
    display: flex;
    flex-wrap: wrap;
    margin-top: 1rem;
    justify-content: left;
  }
}
</style>
