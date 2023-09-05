<template>
  <ion-modal ref="workoutModal" class="modal" swipeToClose cssClass="auto-height">
    <div class="modal__content">
      <div class="header d-flex align-items-center justify-content-center">
        <span class="modal__closed"></span>
        <ion-label class="modal__title font-medium font-20 color-white">
          {{ viewTitle }}
        </ion-label>
      </div>
      <div class="description-field">
        <ion-text class="font-medium font-14">{{ viewDescription }}</ion-text>
      </div>
      <div v-if="total_count" class="customer-list">
        <customer-item @open-description-modal="showReviewDescriptionModal(id)" />
      </div>
      <div v-else class="d-flex align-items-center justify-content-center w-100 h-100">
        <ion-text class="font-medium font-20 color-white">No customers</ion-text>
      </div>
      <div v-if="isReviewDescriptionModalOpen" class="backdrop" />
    </div>
  </ion-modal>
  <ion-modal
    ref="modal"
    :is-open="isReviewDescriptionModalOpen"
    class="review-descrition-modal common-style"
    @willDismiss="isReviewDescriptionModalOpen = false"
  >
    <div class="d-flex-col gap-12">
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-8">
          <ion-img id="reviewerAvatar" :src="reviewDescription.reviewerAvatar" class="w-68 h-68" />
          <div class="d-flex-col gap-2">
            <ion-text class="font-medium font-16 color-white">
              {{ reviewDescription.reviewerName }}
            </ion-text>
            <ion-text class="font-medium font-12 color-gray">
              {{ reviewDescription.reviewerEmail }}
            </ion-text>
          </div>
        </div>
        <div>
          {{ reviewDescription.date }}
        </div>
      </div>
      <div>
        <ion-text class="font-light font-14 color-gray-400">{{ reviewDescription.reviewMessage }}</ion-text>
      </div>
      <div class="d-flex align-items-center justify-content-center w-100">
        <ion-button class="w-60" @click="() => isReviewDescriptionModalOpen = false">Close</ion-button>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonButton,
  IonContent,
  IonRadio,
  IonRadioGroup,
  IonItem,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
  IonSearchbar,
  IonIcon,
  IonLabel,
  toastController,
  IonSpinner,
} from "@ionic/vue";
import { defineExpose, defineEmits, ref, defineProps } from "vue";
import { Capacitor } from '@capacitor/core';
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { EntitiesEnum } from "@/const/entities";
import { useLazyQuery } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";
import CustomerItem from "@/general/components/modals/workout/CustomerItem.vue";

const router = useRouter();
const route = useRoute();

const workoutModal = ref<typeof IonModal | null>(null);
const viewTitle = ref<string>("");
const viewDescription = ref<string>("");
const reviewDescription = ref<any>({});
const total_count = ref<number>(0);

const present = ( props: any ) => {
  viewTitle.value = props.title;
  viewDescription.value = props.description;
  total_count.value = props.total_count;
  workoutModal?.value?.$el.present();
};

const isReviewDescriptionModalOpen = ref<boolean>(false);
const showReviewDescriptionModal = (id: any) => {
  reviewDescription.value = {
    reviewerName: 'Amina Sally',
    reviewerAvatar: 'assets/mock/profile.jpeg',
    reviewerEmail: 'aminasaliat@gmail.com',
    reviewMessage: '',
    date: '6 June, 2022'
  }
  isReviewDescriptionModalOpen.value = true;
};

defineExpose({
  present,
});

</script>

<style scoped lang="scss">
.modal {
  --ion-backdrop-opacity: 0.6;
  --ion-backdrop-color: var(--ion-color-black);

  .backdrop {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: #0000006a;
  }

  &__content {
    background: var(--gray-800);
    border-radius: 18px 18px 0 0;
    min-height: 60%;
    padding: 30px 0;
    position: relative;
  }

  &__closed {
    top: 12px;
    left: 50%;
    width: 48px;
    height: 4px;
    display: block;
    border-radius: 2px;
    margin-left: -24px;
    position: absolute;
    background: rgba(var(--ion-color-dark-contrast-rgb), 0.12);
  }

  &__title {
    display: block;
    margin-bottom: 16px;
    font-weight: 500;
    font-size: 16px;
    line-height: 1.5;
    color: var(--ion-color-white);
  }
}
.description-field {
  padding: 17px 9px;
}
.customer-list {
  padding-left: 16px;
  padding-right: 32px;
  overflow-y: scroll;
  max-height: 250px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.header {
  border-bottom: 1px solid ;
  padding: 0 12px;
}
.common-style {
  .w-68 {
    width: 68px;
  }
  .h-68 {
    height: 68px;
  }

  .font-12 {
    font-size: 12px;
  }
  .font-14 {
    font-size: 14px;
  }
  .font-16 {
    font-size: 16px;
  }
  .font-20 {
    font-size: 20px;
  }
}
.review-descrition-modal {
  --height: auto;
  align-items: flex-end;
  --backdrop-opacity: 0.6;
  --ion-backdrop-color: var(--ion-color-black);

  &::part(content) {
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
    border-radius: 20px 20px 0 0;
    -webkit-overflow-scrolling: touch;
    padding: 16px 24px calc(16px + var(--ion-safe-area-bottom));
    max-height: calc(
      100vh - 136px - var(--ion-safe-area-top) - var(--ion-safe-area-bottom)
    );
  }
}
ion-img#reviewerAvatar{
  &::part(image) {
    border-radius: 100px;
  }
}
</style>
