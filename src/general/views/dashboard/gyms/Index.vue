<template>
	<div
		class="holder-content ion-padding-horizontal"
		:class="{ 'holder-content--empty': !loading }"
	>
    <div class="banner">
      <ion-icon src="assets/icon/arrow-back.svg" />
      <ion-title class="banner__title">Gabby's gym</ion-title>
    </div>
    <div>
      <div class="carousel">
        <ion-img src="assets/gym-image.png"></ion-img>
      </div>
      <div class="data-box d-flex justify-content-between">
        <div class="d-flex-col">
          <ion-text>{{"Gabby"}} Gym</ion-text>
          <ion-label class="field-label">
            <ion-icon src="assets/icon/location.svg"></ion-icon>
            Dallas, Wall Street, 24
          </ion-label>
        </div>
        <div class="d-flex-col align-items-center">
          <ion-text>Ratings {{5.0}}</ion-text>
        </div>
        <div class="d-flex-col align-items-center">
          <ion-text>Reviews</ion-text>
        </div>
      </div>
      <div class="description-field">
        <ion-title>Description:</ion-title>
        <ion-text>{{"Want your body to be healthy? Join our program with directions according to body’s goals. Increasing physical strength is the goal of strenght training."}}</ion-text>
      </div>
      <div class="feature-field d-flex justify-content-between">
        <div>
          <ion-title>Equipment</ion-title>
          <div class="features">
            <ion-button 
              v-for="(item, id) in equipments" 
              :key="id" 
              fill="outline"
            >
              <ion-icon :src="item.iconPath"></ion-icon>
              {{item.name}}
            </ion-button>
          </div>
        </div>
        <div>
          <ion-title>Amenities</ion-title>
          <div class="features">
            <ion-button 
              v-for="(item, id) in amenities" 
              :key="id" 
              fill="outline"
            >
              <ion-icon :src="item.iconPath"></ion-icon>
              {{item.name}}
            </ion-button>
          </div>
        </div>
      </div>
    </div>
	</div> 
</template>

<script setup lang="ts">
import {
  IonButton,
  IonSpinner,
  IonLabel,
  IonText,
  IonIcon
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import {
  WorkoutsDocument,
  QueryWorkoutsOrderByColumn,
  RoleEnum,
  SortOrder,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import useId from "@/hooks/useId";
import useFacilityId from "@/hooks/useFacilityId";
// import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";
import { v4 as uuidv4 } from "uuid";

const filter = ref<string>('profile');

const { id: myId } = useId();
const { id: myFacilityId } = useFacilityId();
const { role: myRole } = useRoles();

const { id } = JSON.parse(localStorage.getItem("user") || "{}");

const equipments = ref<Array<object>>([
  {
    id: uuidv4(),
    name: "Cardio Items",
    iconPath: "assets/icon/gym/gym-heart.svg"
  },{
    id: uuidv4(),
    name: "Gym Items",
    iconPath: "assets/icon/gym/gym-man.svg"
  },{
    id: uuidv4(),
    name: "Shower & Bath",
    iconPath: "assets/icon/gym/gym-shower.svg"
  },{
    id: uuidv4(),
    name: "Gym Items",
    iconPath: "assets/icon/gym/gym-dumbbell.svg"
  },{
    id: uuidv4(),
    name: "Cycling Items",
    iconPath: "assets/icon/gym/gym-cycling.svg"
  },
]);

const amenities = ref<Array<object>>([
  {
    id: uuidv4(),
    name: "Play Maze",
    iconPath: "assets/icon/gym/gym-maze.svg"
  },{
    id: uuidv4(),
    name: "Sauna",
    iconPath: "assets/icon/gym/gym-sauna.svg"
  },{
    id: uuidv4(),
    name: "SPA",
    iconPath: "assets/icon/gym/gym-spa.svg"
  },{
    id: uuidv4(),
    name: "Steam Room",
    iconPath: "assets/icon/gym/gym-steam.svg"
  },{
    id: uuidv4(),
    name: "Lounge",
    iconPath: "assets/icon/gym/gym-lounge.svg"
  },{
    id: uuidv4(),
    name: "Cafe",
    iconPath: "assets/icon/gym/gym-cafe.svg"
  },{
    id: uuidv4(),
    name: "Cardio Equipment",
    iconPath: "assets/icon/gym/gym-heart.svg"
  },
]);


const router = useRouter();

</script>

<style scoped lang="scss">
.holder-content {
  padding-left: 50px;
  padding-right: 37px;
  padding-top: -40px;
}
.banner {
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding-bottom: 40px;

  &__title {
    padding: 0;
    color: var(--gold);
    font-family: Lato;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
}
.carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  ion-img {
    max-width: 650px;
    max-height: 310px;
  }
}
.data-box {
  padding-bottom: 40px;
  ion-text {
    font: 500 20px/1 var(--ion-font-family);
  }
}
.d-flex-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.description-field {
  margin-bottom: 24px;

  ion-title {
    font: 500 20px/1 var(--ion-font-family);
    padding: 0;
    margin-bottom: 10px;
  }
  ion-text {
    font: 16px/1 var(--ion-font-family);
    color: var(--grey-text);
  }
}
.feature-field {

  .features {
    display: flex;
    flex-wrap: wrap;

    ion-icon {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }
  }

  ion-title {
    padding: 0;
  }
}
</style>
