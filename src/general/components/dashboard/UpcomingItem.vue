<template>
  <IonItem class="upcoming-item" :class="{ 'mb-30': isLast, 'native-upcoming': (isNative || nativeItem) }" lines="none">
    <img
      :src="imgSrc || '/assets/gym.png'"
      alt="image"
      slot="start"
      :class="['round-img', { 'square-img': squareImg }]"
    />

    <div class="content d-flex">
      <div class="title-wrapper">
        <IonLabel :class="['title', { 'native-app': role === RoleEnum.User }]">{{ title || "Jacob Jones"}}</IonLabel>
        <div class="time" v-if="!days">
          <IonIcon :icon="time" />
            {{ isShortTime ? "08:00 AM" : " 7 June, Monday 08:00 AM"}}
        </div>
        <div class="day ytmn" v-else>{{ days }}</div>
      </div>

      <div class="date native-app" v-if="subtitle">17 June</div>
        <div class="location" :class="{'clac-location': isUpcomming}">
          <IonIcon src="/assets/icon/location.svg"></IonIcon>
          <IonLabel class="native-app"> {{ location || "Summer Gym, Wall Street, 24"}} </IonLabel>
        </div>

        <div :class="['end', endItemClass]" v-if="isUpcomming">{{ upcomingType }}</div>
    </div>
  </IonItem>
</template>
<script lang="ts" setup>
import { RoleEnum } from "@/generated/graphql";
import { Capacitor } from "@capacitor/core";
import { IonItem, IonIcon, IonLabel } from "@ionic/vue";
import { time } from "ionicons/icons";
import { computed, ref } from "vue";

interface UpcommingItemProps {
  imgSrc?: string;
  title: string;
  subtitle?: string;
  location?: string;
  isUpcomming?: boolean;
  squareImg?: boolean;
  isLast?: boolean;
  upcomingType?:string;
  isShortTime?:boolean;
  days?:string;
  role?:RoleEnum;
  nativeItem?: boolean
}

const props = withDefaults(defineProps<UpcommingItemProps>(), {
  squareImg: false,
  isLast: false,
  isUpcomming:false,
  isShortTime: false,
  upcomingType: "Upcoming",
  nativeItem: false
});

const isNative = ref(Capacitor.isNativePlatform())

const endItemClass = computed(()=> {
  if (props.upcomingType === 'Finished') {
    return "finished";
  } else if (props.upcomingType === 'Upcoming'){
    return "upcoming";
  } else if (props.upcomingType === 'Premium') {
    return "premium ytmn"
  } else if (props.upcomingType === "Expired") {
    return "expired ytmn"
  } else {
    return "upcoming-days ytmn"
  }
})
</script>
<style lang="scss" scoped>
.upcoming-item {
  --padding-top: 10px;
  --padding-bottom: 10px;
  --border-radius: 8px;
  --min-height: 99px;
  margin-bottom: 10px;
  .round-img {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    margin-inline-end: 15px;
  }

  .square-img {
    border-radius: 15px;
  }

  .content {
    height: 100%;
    width: 100%;
    flex-direction: column;
    justify-content: space-around;
    padding: 5px 0;
    position: relative;

    ion-icon {
      color: #e1dbc5;
    }

    .title-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--white, #fff);
      .title {
        font-family: Lato;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
      }

      .time {
        font-family: Lato;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 9px;
      }

      .day {
        color: var(--fitnesswhite);
      }
    }

    .date {
      font-size: 14px;
    }

      .location {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 4px;

        ion-label {
          font-size: 14px;
          font-style: normal;
          font-weight: 300;
        }
      }

      .clac-location {
        width: calc(100% - 35%);
      }

      .end {
        position: absolute;
        right: 0;
        bottom: 12px;
        width: fit-content;
        padding: 2px 8px;
        border-radius: 30px;
      }
      .upcoming {
        background-color: #ede8d7;
        color: #f7685b;
        font-family: Manrope;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }
      .premium {
        color: var(--gold);
      }

      .expired {
        color: #DC5858;
      }

      .upcoming-days {
        color: #E1DBC5;
      }
  }

  @media (max-width: 900px) {
    --min-height: 80px;

    .round-img {
      width: 60px;
      height: 60px;
    }
  }
}

.native-upcoming {
  --background: #262626;
    .upcoming {
      font-family: Lato !important;
      color: var(--main-color) !important ;
      padding: 2px 8px !important;
      bottom: 16px !important;
    }

    .time {
      font-family: Lato;
    }

}
.finished {
      font-size: 12px;
      color: #AFAFAF !important;
      border: 1px solid #AFAFAF !important;
      background-color: transparent !important;
}

.mb-30 {
  margin-bottom: 30px;
}

.ytmn {
  font-family: Yantramanav;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
}
</style>
