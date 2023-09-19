<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Getting paid" title-class="header_trainer__title" />
    </template>
    <template #content>
      <div class="getting-paid">
        <div class="info-wrapper ion-padding d-flex align-items-center gap-12">
          <ion-icon src="assets/icon/warning-2.svg" />
          <p>In order to withdraw income, please set up the <span>Withdrawal method</span>.</p>
        </div>
        <div class="fund-card-wrapper">
          <h3 class="card-label">Available funds</h3>
          <div class="card-detail d-flex">
            <span>Your available balance is:</span>
            <p>$ 3,689,076</p>
          </div>
        </div>
        <div class="fund-card-wrapper ion-margin-top">
          <h3 class="card-label">Withdrawal method</h3>
          <div class="card-detail d-flex">
            <span>Add/change withdrawal method</span>
          </div>
          <ion-button color="primary" fill="outline">
            Add new method
          </ion-button>
        </div>
        <ion-label class="section-header">
          Revenue
        </ion-label>
        <div class="revenue-wrapper">
          <div class="revenue-card">
            <div class="revenue">
              <div class="type">Total revenue</div>
              <div class="period">Today</div>
              <div class="percent">
                0.8%
                <ion-icon class="arrow" src="assets/icon/call_made.svg" />
              </div>
            </div>
            <div class="chain">$3,689,076</div>
          </div>
          <div class="revenue-card">
            <div class="revenue">
              <div class="type">Quarterly revenue</div>
              <div class="period">Earned</div>
              <div class="percent">
                0.8%
                <ion-icon class="arrow" src="assets/icon/call_made.svg" />
              </div>
            </div>
            <div class="chain">$3,689,076</div>
          </div>
          <div class="revenue-card">
            <div class="revenue">
              <div class="type">Earned revenue</div>
              <div class="period">This year</div>
              <div class="percent">
                0.8%
                <ion-icon class="arrow" src="assets/icon/call_made.svg" />
              </div>
            </div>
            <div class="chain">$3,689,076</div>
          </div>
        </div>
      </div>
    </template>
  </base-layout>
</template>
  
<script setup lang="ts">
import {
  IonButton,
  IonIcon,
  IonLabel
} from "@ionic/vue";
import { useRouter } from "vue-router";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";

const router = useRouter();

const onBack = () => {
  router.go(-1);
};
</script>
  
<style scoped lang="scss">
.getting-paid {
  padding: 16px 20px calc(32px + var(--ion-safe-area-bottom));

  .info-wrapper {
    background: linear-gradient(0deg, rgba(11, 11, 11, 0.10) 0%, rgba(11, 11, 11, 0.10) 100%), #2D2D2D;
    border-radius: 8px;
    margin-bottom: 24px;

    ion-icon {
      font-size: 24px;
    }

    p {
      font-size: 12px;
      color: var(--gray-500);
      margin: 0;

      span {
        color: #109CF1;
      }
    }
  }

  .fund-card-wrapper {
    padding: 16px 24px;
    background: #54534E;

    .card-label {
      margin: 0;
      margin-bottom: 16px;
      font-size: 20px;
      color: var(--gold);
      font-weight: 700;
    }

    .card-detail {
      gap: 8px;

      p {
        font-size: 16px;
        color: var(--ion-color-white);
        font-weight: 700;
        margin: 0;
      }

      span {
        font-size: 14px;
        color: #A5A5A5;
      }
    }

    ion-button {
      margin: 0;
      margin-top: 16px;
      height: 40px;
    }
  }

  .section-header {
    font-size: 16px;
    font-weight: 600;
    color: var(--fitnesswhite);
    margin-top: 16px;
    margin-bottom: 8px;
    display: block;
  }

  .revenue-wrapper {
    padding: 21px 13px;
    background: linear-gradient(0deg, rgba(11, 11, 11, 0.10) 0%, rgba(11, 11, 11, 0.10) 100%), #2D2D2D;
    border-radius: 4px;

    .revenue-card {
      background: var(--dark-grey);
      padding: 16px 15px;
      border: 1.033px solid #D0D3D9;
      border-radius: 8.267px;
      display: flex;
      gap: 34px;
      padding-bottom: 50px;
      margin-bottom: 8px;

      .revenue {
        display: flex;
        flex-direction: column;
        gap: 4.13px;
        .type {
          font-size: 16px;
          color: var(--fitnesswhite);
          font-weight: 500;
        }

        .period {
          font-size: 16.533px;
          font-weight: 500;
        }

        .percent {
          color: #2ED47A;
          font-family: "Inter";
          font-size: 24px;
          font-weight: 600;
          display: flex;
          gap: 12.4px;
        }
      }

      .chain {
        color: var(--fitnesswhite);
        font-size: 24px;
        font-weight: 600;
        align-self: flex-end;
      }
    }
  }
}
</style>
  