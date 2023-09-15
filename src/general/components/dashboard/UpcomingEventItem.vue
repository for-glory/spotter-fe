<template>
  <ion-card>
    <ion-card-content>
      <div class="event-wrapper d-flex">
        <div
          class="d-flex ion-align-items-center ion-justify-content-center"
          style="gap: 10px"
        >
          <!-- <ion-thumbnail> -->
          <img alt="Silhouette of mountains" class="event-img" :src="media" />
          <!-- </ion-thumbnail> -->
          <div class="" style="width: 100%">
            <div style="width: 100%; min-height: 50px">
              <div class="d-flex justify-content-between title">
                <span>{{ title }}</span>
                <span>${{ formatNumber(price) }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="subtitle">{{ getDate }}</span>
                <span class="subtitle">Entry</span>
              </div>
            </div>
            <div class="d-flex-col time-location" style="">
              <div
                class="d-flex justify-content-start ion-align-items-center"
                style="gap: 0.25rem"
              >
                <ion-icon :icon="time"></ion-icon>
                <span class="time"> {{ getTime }} </span>
              </div>
              <div
                class="d-flex justify-content-start ion-align-items-center subtitle"
                style="gap: 0.25rem"
              >
                <ion-icon size="14px" :icon="location"></ion-icon>
                <span>{{ street }}</span>
              </div>
              <div class="upcoming">Upcoming</div>
            </div>
          </div>
        </div>
        <template v-if="role === RoleEnum.Trainer">
          <div class="content native-app">
            Ready to take the biggest 2022 competition event? Join our event and
            win the best trophies as: one-time pass to “Summer Gym”, personal
            training with fitness trainer Jenny Cooper and much more
            interesting!
          </div>

          <div class="footer">
            <div class="title">Amenities</div>

            <div class="amenities-wrapper d-flex">
              <div class="amenities native-app d-flex">
                <ion-icon src="/assets/icon/drinks.svg"></ion-icon>
                Drinks
              </div>
              <div class="amenities native-app d-flex">
                <ion-icon src="/assets/icon/snack-bar-icon.svg"></ion-icon>
                Snack Bar
              </div>
            </div>
          </div>
        </template>
      </div>
    </ion-card-content>

    <div v-show="isLast" class="view-details">
      <ion-button>View full info</ion-button>
    </div>
  </ion-card>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import { computed, defineProps, withDefaults } from "vue";
import { IonIcon, IonButton } from "@ionic/vue";
import { time } from "ionicons/icons";
import useRoles from "@/hooks/useRole";
import { RoleEnum } from "@/generated/graphql";

const { role } = useRoles();
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
  return dayjs(props.start_date).format("DD MMM") || "";
});
const formatNumber = (num: any) => {
  return parseFloat(num).toFixed(2);
};
const getTime = computed(() => {
  return dayjs(props.start_date).format("HH:mm a") || "";
});
</script>
<style scoped lang="scss">
ion-card {
  margin-bottom: 30px;
}
.time-location {
  width: 100%;
  min-height: 52px;
  gap: 4px;
  position: relative;
  .upcoming {
    position: absolute;
    right: 0;
    bottom: 1px;
    background-color: #ede8d7;
    border-radius: 30px;
    padding: 5px 7px;
    color: #f7685b;
    font-family: Manrope;
    font-size: 12px;
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
  margin-bottom: 16px;
}

.event-wrapper {
  flex-direction: column;
  gap: 24px;
}

.event-img {
  width: 80px;
  height: 80px;
  border-radius: 14px;
}

.title {
  color: var(--white, #fff);
  /* yantra/body 1 */
  font-family: Yantramanav;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 1.5rem */
}
.subtitle {
  color: var(--light-grey, #c4c4c4);
  text-align: center;
  /* yantra/body3 */
  font-family: Yantramanav;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 300;
  line-height: 150%; /* 1.3125rem */

  ion-icon {
    font-size: 16px;
  }
}

ion-icon {
  color: #ede8d7;
}
.break {
  display: block;
  width: 100px;
  overflow-wrap: break-word;
}
.time {
  color: var(--white, #fff);
  /* yantra/body 2 */
  font-family: Yantramanav;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
}

.content {
  font-size: 14px;
  font-weight: 300;
  color: var(--gray-400);
}

.footer {
  .title {
    padding-bottom: 16px;
  }
  .amenities-wrapper {
    gap: 12px;
    .amenities {
      height: 42px;
      font-size: 14px;
      border-radius: 8px;
      justify-content: center;
      align-items: center;
      padding: 0 16px;
      border: 0.8px solid var(--dark-grey-2, #3d3d3d);
      ion-icon {
        font-size: 22px;
        padding-right: 10px;
      }
    }
  }
}

.view-details {
  width: 100%;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  padding-right: 10px;
  border: 1px solid #dbb582;
  background: #ede8d7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  ion-button {
    --background: white;
    --border-radius: 0.5rem;
    --border-style: solid;
    --border-width: 1px;
    --border-color: #ffb946;
    --padding-start: 1rem;
    --padding-end: 1rem;
    --padding-top: 0.5rem;
    --padding-bottom: 0.5rem;
    color: #323c47;
    font-family: Lato;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
}
</style>
