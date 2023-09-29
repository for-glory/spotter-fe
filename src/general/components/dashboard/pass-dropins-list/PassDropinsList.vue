<template>
  <div>
    <ion-row>
      <ion-col class="ion-no-padding" size="4" v-for="item in dataList">
        <div class="list-container">
          <ion-item class="thumbnail-container ion-no-padding" lines="none">
            <ion-avatar slot="start">
              <img :src="item.facility.media[0].pathUrl" />
            </ion-avatar>
            <ion-label>
              <!-- <p>
                Title
              </p> -->
              <h3>
                {{ item.title }}
              </h3>
            </ion-label>
          </ion-item>
          <ion-item class="ion-no-padding" lines="none">
            <ion-label>
              <p>
                Duration
              </p>
              <h4>
                {{ item.duration }} {{ unit }}
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
                ${{ formatNumber(item.price) }}
              </h4>
            </ion-label>
          </ion-item>
          <div class="btn-container">
            <ion-button size="small" @click="toEdit(item)">Edit</ion-button>
            <ion-button size="small" color="danger" fill="outline" @click="toDelete(item)">Delete</ion-button>
          </div>
        </div>
      </ion-col>
    </ion-row>
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
    dataList: any,
    unit: string
  }>(),
  {
    dataList: [],
    unit: ''
  }
);

const emits = defineEmits<{
  (e: "delete", data: any): void;
  (e: "edit", data: any): void;
}>();

const toDelete = (pass: any) => {
  emits("delete",pass);
  // router.push({
  //   params: pass
  // });
};

const toEdit = (pass: any) => {
  console.log('toEdit', pass);
  emits("edit", pass);
}

const formatNumber = ((num: any) => {
  return (parseFloat(num)/100).toFixed(2)
})

</script>

<style scoped lang="scss">
.btn-container {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 15px;

  ion-button {
    width: 6.313vw;
    cursor: pointer;
  }
}

.list-container {
  background-color: #262626;
  padding: 16px 8px;
  margin: 12px;
  border-radius: 8px;
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
}</style>
