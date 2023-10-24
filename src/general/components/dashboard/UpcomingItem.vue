<template>
  <IonItem
    class="upcoming-item"
    :class="{ 'mb-30': isLast, 'native-upcoming': isNative || nativeItem }"
    lines="none"
  >

    <img v-if="imgPath"
      :src="imgPath"
      alt="image"
      slot="start"
      :class="['round-img', { 'square-img': squareImg }]"
    />
    <div v-else slot="start" class="avatar-txt d-flex align-items-center justify-content-center native-app">
      {{ avatarTitle }}
    </div>

    <div class="content d-flex">
      <div class="title-wrapper">
        <IonLabel
          :class="['title', { 'native-app': role === RoleEnum.User }]"
          >{{ title }}</IonLabel
        >
        <div class="time" v-if="rightDate">
          <IonIcon v-if="timeIcon" :icon="time" />
          {{ rightDate }}
        </div>
        <div class="day ytmn" v-else>{{ days }}</div>
      </div>

      <div class="date native-app" v-if="subTitle">{{ subTitle }}</div>
      <div :class="['location', { 'location-max-width': itemType }]">
        <IonIcon src="/assets/icon/location.svg"></IonIcon>
        <IonLabel class="native-app"> {{ address }} </IonLabel>
      </div>

      <div :class="['end', itemType]" v-if="itemType">
        {{ itemType }}
      </div>
    </div>
  </IonItem>
</template>
<script lang="ts" setup>
import { EntitiesEnum } from "@/const/entities";
import { RoleEnum } from "@/generated/graphql";
import { Capacitor } from "@capacitor/core";
import { IonItem, IonIcon, IonLabel } from "@ionic/vue";
import dayjs from "dayjs";
import { time } from "ionicons/icons";
import { computed, ref } from "vue";

interface UpcommingItemProps {
  item?: any;
  imgSrc?: string;
  title: string;
  subtitle?: string;
  location?: string;
  isUpcomming?: boolean;
  squareImg?: boolean;
  isLast?: boolean;
  upcomingType?: string;
  isShortTime?: boolean;
  days?: string;
  role?: RoleEnum;
  nativeItem?: boolean;
  typeName?: string;
}

const props = withDefaults(defineProps<UpcommingItemProps>(), {
  squareImg: false,
  isLast: false,
  isUpcomming: false,
  isShortTime: false,
  upcomingType: "Upcoming",
  nativeItem: false,
});

const isNative = ref(Capacitor.isNativePlatform());
const timeIcon = ref(true);

const imgPath = computed(() => {
  switch (props.typeName) {
    case EntitiesEnum.Events:
      if (props.item.media?.length) { 
        return props.item.media[0]?.pathUrl;
      }
      break;

    case EntitiesEnum.Trainings:
      return props.item?.trainer?.avatarUrl;

    case EntitiesEnum.Facilities: 
      const data = props.item?.facilityItem?.facility.media
      if (data?.length) {
        return data[0].pathUrl;
      }
      break;
    
    case EntitiesEnum.FacilityDropins: 
      if (props.item?.facilityItem?.facility.media?.length) {
        return props.item?.facilityItem?.facility.media[0].pathUrl;
      }
      break;
    
  default:
      break;
  }
});

const title = computed(() => {
  switch (props.typeName) {
    case EntitiesEnum.Events:
      return props.item?.title;

    case EntitiesEnum.Facilities:
      return props.item?.facilityItem?.title;

    case EntitiesEnum.FacilityDropins:
      return props.item?.facilityItem?.title;

    case EntitiesEnum.Trainings:
      return `${props.item?.trainer?.first_name} ${props.item?.trainer?.last_name}`;

    default:
      break;
  }
});

const avatarTitle = computed(() => {
  switch (props.typeName) {
    case EntitiesEnum.Events:
    case EntitiesEnum.Facilities:
      return title.value?.charAt(0);
    
    case EntitiesEnum.FacilityDropins:
      return title.value?.charAt(0);

    case EntitiesEnum.Trainings:
      return props.item?.trainer?.first_name.charAt(0) + ' ' + props.item?.trainer?.last_name.charAt(0)
  
    default:
      break;
  }
})

const rightDate = computed(() => {
  switch (props?.typeName) {
    case EntitiesEnum.Events:
    case EntitiesEnum.Trainings:
      if (props.item?.start_date) {
        return dayjs(props.item?.start_date).format("hh mm A");
      }
      break;
    case EntitiesEnum.Facilities:
      if (props.item?.start_date) {
        timeIcon.value = false;
        const currDate = dayjs(new Date());
        const startDate = dayjs(props.item?.start_date);
        const diff = startDate.diff(currDate, "days");
        return `${diff} days left`;
      }
      break;
    
    case EntitiesEnum.FacilityDropins:
      if (props.item?.start_date) {
        timeIcon.value = false;
        const currDate = dayjs(new Date());
        const startDate = dayjs(props.item?.start_date);
        const diff = startDate.diff(currDate, "days");
        return `${diff} days left`;
      }
      break;

    default:
      break;
  }
});

const subTitle = computed(() => {
  switch (props?.typeName) {
    case EntitiesEnum.Events:
    case EntitiesEnum.Trainings:
      if (props.item?.start_date) {
        return dayjs(props.item?.start_date).format("DD MMM");
      }
      break;

    case EntitiesEnum.Facilities:
      return null;
      
    case EntitiesEnum.FacilityDropins:
      return null;

    default:
      break;
  }
});

const address = computed(() => {
  switch (props?.typeName) {
    case EntitiesEnum.Events:
      return props.item?.address?.street;

    case EntitiesEnum.Facilities:
      return props.item?.facilityItem?.facility?.address?.street;
      
    case EntitiesEnum.FacilityDropins:
      return props.item?.facilityItem?.facility?.address?.street;

    case EntitiesEnum.Trainings:
      return props.item?.trainer?.address?.street;
    default:
      break;
  }
});

const itemType = computed(() => {
  switch (props?.typeName) {
    case EntitiesEnum.Events:
      if (props.item?.start_date) {
        if (new Date() < new Date(props.item?.start_date)) {
          return "upcoming";
        } else {
          return "finished";
        }
      }
      break;
    // case EntitiesEnum.Facilities:
    //   if (props.item?.start_date) {
    //     if (new Date() < new Date(props.item?.start_date)) {
    //       return "premium";
    //     } else {
    //       return "expired";
    //     }
    //   }
    //   break;
    default:
      return ""
      break;
  }
});
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

  .avatar-txt {
    width: 100px;
    height: 90px;
    min-width: 90px;
    min-height: 90px;
    border-radius: 50%;
    margin-inline-end: 15px;
    background: var(--gray-700);
    font-size: 2rem;
    font-weight: 900;
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

    .location-max-width {
      max-width: clamp(140px, 60%, 400px);
    }

    .clac-location {
      width: calc(100% - 35%);
    }

    .end {
      position: absolute;
      text-transform: capitalize;
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
      font-family: Yantramanav;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
    }

    .expired {
      color: #dc5858;
      font-family: Yantramanav;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
    }

    .upcoming-days {
      color: #e1dbc5;
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
  color: #afafaf !important;
  border: 1px solid #afafaf !important;
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
