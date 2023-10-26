<template>
  <div>
    <ion-item class="title ion-text-start">
      <ion-icon
        @click="onBack"
        class=""
        mode="ios"
        color="medium"
        :icon="chevronBackOutline">
      </ion-icon>
      <span class="medium ion-padding-end clickable">{{ facilityItem?.facility?.name }}</span>
    </ion-item>
  </div>
  <ion-grid fixed>
    <ion-row>
      <ion-col size="12">
        <ion-spinner v-if="loadingFacilityPass" name="lines" class="spinner" />
        <div v-else>
          <div  v-if="!facilityItem">
            <empty-block
              class="empty-block"
              :title="emptyTitle"
              hideButton
              :text="emptyText"
              :icon= "emptyImage"
            />
          </div>
         <div v-else>
          <div class="list-container">
            <ion-item class="thumbnail-container ion-no-padding" lines="none">
              <ion-avatar slot="start">
                <img :src="facilityItem.facility.media[0].pathUrl" />
              </ion-avatar>
              <ion-label>
                <h3>
                  {{ facilityItem.title }}
                </h3>
              </ion-label>
            </ion-item>
            <ion-item class="ion-no-padding" lines="none">
              <ion-label>
                <p>
                  Duration
                </p>
                <h4>
                  {{ facilityItem.duration }} {{ unit }}
                </h4>
              </ion-label>
            </ion-item>
            <ion-item class="ion-no-padding" lines="none">
              <ion-label>
                <p>
                  Features
                </p>
                <h4>
                  Full access(amenities & equipment)
                </h4>
              </ion-label>
            </ion-item>
            <ion-item class="ion-no-padding" lines="none">
              <ion-label>
                <p>
                  Pass Fee
                </p>
                <h4>
                  ${{ formatNumber(facilityItem.price) }}
                </h4>
              </ion-label>
            </ion-item>
            <ion-item class="ion-no-padding" lines="none">
              <ion-label>
                <p>
                  Address
                </p>
                <h4>
                  {{ facilityItem.facility?.address?.street }} {{ facilityItem.facility?.address?.city?.name }}, {{ facilityItem.facility?.address?.city?.state?.name }}
                </h4>
              </ion-label>
            </ion-item>
            <div class="btn-container">
              <ion-button size="small" @click="handlePurchase">{{ facilityItem.item_type === "PASS" ? 'Subscribe' : 'Buy' }}</ion-button>
            </div>
          </div>
        </div>
        </div>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  toastController
} from "@ionic/vue";
import {
  FacilityItemDocument,
} from "@/generated/graphql";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { chevronBackOutline } from "ionicons/icons";
import { AddFacilityItemToCartDocument, FacilityDocument } from "@/generated/graphql";
import dayjs from "dayjs";
import { EntitiesEnum } from "@/const/entities";

const router = useRouter();
const route = useRoute();

// facility items
const {
  result: facilityItemResult,
  loading: loadingFacilityPass,
  onResult
} = useQuery(FacilityItemDocument, {
  id: route.params.id
});

const facilityItem = computed(() => {
  return facilityItemResult.value?.facilityItemById;
});
const unit = computed(() => {
  return facilityItem.value?.item_type === "PASS" ? "Months" : "Days";
});

const emptyTitle = computed(() => {
  return facilityItem.value?.item_type === "PASS" ? "Passes Empty" : "Drop-ins Empty";
});

const emptyText = computed(() => {
  return facilityItem.value?.item_type === "PASS" ? "No Gym pass created yet" : "No drop-ins created yet";
});

const emptyImage = computed(() => {
  return facilityItem.value?.item_type === "PASS" ? "assets/icon/gym-user-icon.svg" : "assets/icon/dropin.svg";
});

const { mutate: addToCartMutation, loading: addToCartLoading } = useMutation(
    AddFacilityItemToCartDocument
);

const handlePurchase = () => {
  console.log('purchase');
  
  router.push({
    name: EntitiesEnum.GymOrderCalendar,
    params: {
      facility: facilityItem.value?.facility?.id,
      id: facilityItem.value?.id
    }
  });
  // addToCartMutation({
  //   input: {
  //     facility_item_id: route.params.id,
  //     // start_date: dayjs(new Date(selectedDay.value as any)).utc(),
  //   },
  // })
  //   .then((res) => {
  //     router.push({
  //       name: EntitiesEnum.FacilityOrder,
  //       params: {
  //         id: route.params.id,
  //       },
  //       query: {
  //         cart_id: res?.data?.addFacilityItemToCart?.id,
  //       },
  //     });
  //   })
  //   .catch(async () => {
  //     const toast = await toastController.create({
  //       message: "Something went wrong. Try again.",
  //       duration: 2000,
  //       icon: "assets/icon/info.svg",
  //       cssClass: "warning-toast",
  //     });
  //     toast.present();
  //   });
}

const onBack = () => {
  router.go(-1);
};

const formatNumber = ((num: any) => {
  return (Math.round((num / 100) * 100) / 100).toFixed(2)
})
</script>

<style scoped lang="scss">
.title {
  padding: 0;
  display: block;
  color: var(--beige);
  font: 400 24px var(--ion-font-family);

  ion-icon {
    margin-right: 8px;
    margin-left: -6px;
  }
}

.pass-list {
  background-color: var(--gray-700);

  &__top {
    margin-bottom: 16px;
    padding: 8px 24px;

    .button {
      height: 42px;
    }
  }
}

.segment {
  margin-bottom: 72px;
  width: fit-content;
}

ion-segment {
  border: 1px solid var(--beige);
  --background: var(--gray-700);
  border-radius: 0;
  width: 230px;
}

ion-segment-button {
  padding: 12px 16px;
  --indicator-color: var(--beige);
  --color: var(--ion-color-light);
  --color-checked: var(--ion-color-dark);
  --border-radius: 0;
  margin: 0 -2px;
}

ion-label {
  font-size: 16px;
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
.title {
  padding: 0;
  display: block;
  font: 400 24px var(--ion-font-family);
  --background: transparent;
  cursor: pointer;
  ion-icon {
    margin-right: 8px;
    margin-left: -6px;
  }
}

.btn-container {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 15px;

  ion-button {
    cursor: pointer;
  }
}

.list-container {
  background-color: #262626;
  padding: 16px 8px;
  margin: 12px;
  border-radius: 8px;
  max-width: 400px;
  margin: 0 auto;
}

.thumbnail-container {
  border-bottom: 2px solid #3d3d3d;

  ion-avatar {
    height: 80px;
    width: 80px;

    img {
      height: 100%;
      width: 100%;
    }
  }

  p {
    font-size: 12px;
    font-weight: 500;
    font-family: 'Lato';
    color: #AFAFAF;
    text-transform: capitalize;
  }

  h3 {
    font-size: 20px;
    font-family: 'Lato';
    font-weight: 500;
    color: #EFEFEF;
  }
}

ion-item {
  --background: transparent;
}
</style>
