<template>
  <base-layout :full-width-footer="false" :header-fixed="false" :content-full-height="false">
    <template #header>
      <page-header back-btn title="Book your trainer" @back="onBack" />
    </template>
    <template #content>
      <ion-spinner v-if="loading" class="spinner" />
      <div class="content__container" v-else>
        <trainer-item :trainer="trainer" class="trainer" />
        <base-calendar :times="uptime" @change-day="onChangeDay" :loading="availabilityLoading"
          @change-time="onChangeTime" :selected="selectedDay" />
      </div>
    </template>

    <template #footer>
      <ion-button :class="['submit-btn', { 'user-submit-btn': role === RoleEnum.User }]" :disabled="disabledBtn"
        @click="next">
        Next</ion-button>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { IonButton, IonSpinner, toastController } from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import BaseCalendar from "@/general/components/base/BaseCalendar.vue";
import TrainerItem from "@/general/components/TrainerItem.vue";
import { useQuery } from "@vue/apollo-composable";
import {
  PurchasableProductsEnum,
  Query,
  RoleEnum,
  UserAvailabilityDocument,
  UserAvailabilityQuery,
} from "@/generated/graphql";
import { GetTrainerDocument } from "@/graphql/documents/userDocuments";
import { computed, ref } from "vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { paymentGatewaysStore } from "@/users/store/paymentGatewaysStore";
import useRoles from "@/hooks/useRole";

dayjs.extend(utc);

const router = useRouter();
const route = useRoute();
const selectedDay = ref(dayjs.utc());
const selectedTime = ref<Dayjs | null>(null);
const paymentStore = paymentGatewaysStore();
const { role } = useRoles();

const { result, loading } = useQuery<Pick<Query, "user">>(GetTrainerDocument, {
  id: route.params.id,
});

const isCurrDaySelected = (value) => {
  return dayjs.utc(value).diff(dayjs.utc(new Date()), "minute") <= 0;
};

const getParams = () => {
  const day = selectedDay.value;
  return {
    id: route.params.id,
    from: isCurrDaySelected(day)
      ? dayjs.utc(new Date()).format("YYYY-MM-DD HH:mm:ss")
      : `${dayjs.utc(day).format("YYYY-MM-DD")} 00:01:00`,
    to: `${dayjs.utc(day).format("YYYY-MM-DD")} 23:59:00`,
  };
};

const {
  result: availabilityResult,
  refetch: availabilityRefetch,
  loading: availabilityLoading,
} = useQuery<UserAvailabilityQuery>(UserAvailabilityDocument, getParams());

const trainer = computed(() => result.value?.user);
console.log('trainer', trainer);


const uptime = computed(() =>
  availabilityResult.value?.userAvailability.hours?.reduce(
    (acc: { value: string; paymentTime: Dayjs; }[], cur) => {
      const trainingTimes =
        availabilityResult.value?.userAvailability.trainings?.reduce(
          (acc: string[], cur) => {
            acc.push(dayjs(cur.start_date).format("hh:mm A"));
            return acc;
          },
          []
        );

      const dateFrom = dayjs(cur.from);
      const dateTo = dayjs(cur.to);

      for (let i = 0; i < dateTo.diff(dateFrom, "hour"); i++) {
        let currHour = null;
        if (dayjs(cur.from).minute() > 30) {
          currHour = dayjs(cur.from).add(i, "hour").format("hh:30 A");
        }
        else {
          currHour = dayjs(cur.from).add(i, "hour").format("hh:00 A");
        }
        const halfAnHourBefore = dayjs(cur.from)
          .add(i * 60 - 30, "minute")
          .format("hh:00 A");
        const halfAnHourAfter = dayjs(cur.from)
          .add(i * 60 + 30, "minute")
          .format(`hh:${dayjs(cur.from).minute() > 30 ? '00' : '30'} A`);
        const hourAfter = dayjs(cur.from)
          .add(i * 60 + 60, "minute")
          .format("hh:00 A");

        if (
          !trainingTimes?.includes(currHour) &&
          !trainingTimes?.includes(halfAnHourBefore)
        ) {
          // set each hour
          if (!(dayjs().isSame(cur.from, 'date') && dayjs().isAfter(dayjs(new Date(`${dayjs(cur.from).format('YYYY-MMM-DD')} ${currHour}`)), 'minutes'))) {
            acc.push({
              value: currHour,
              paymentTime: dayjs(cur.from).add(i, "hour"),
            });

            if (!trainingTimes?.includes(hourAfter)) {
              acc.push({
                value: halfAnHourAfter,
                paymentTime: dayjs(cur.from).add(i * 60 + 30, "minute"),
              });
            }
          }


        }
      }
      if (acc.length) {
        paymentStore.setValue("startDate", acc[0].paymentTime);
        paymentStore.setValue("time", acc[0].value);
        paymentStore.setValue("paymentTime", acc[0].paymentTime);
        selectedTime.value = acc[0].paymentTime;
      }
      return acc;
    },
    []
  )
);

const hasFreeHours = computed(
  () => availabilityResult.value?.userAvailability?.hours?.length
);
//

const disabledBtn = computed(
  () => !selectedDay.value || !selectedTime.value || !hasFreeHours.value || !paymentStore.endDate
);

const onBack = () => {
  router.go(-1);
};

const onChangeDay = (day: Dayjs) => {
  selectedDay.value = day;
  paymentStore.setValue("startDate", day);
  availabilityRefetch(getParams());
};

const onChangeTime = (time: string, timeLabel: string) => {
  selectedTime.value = time;
  paymentStore.setValue("paymentTime", time);
  paymentStore.setValue("startDate", time);
  paymentStore.setValue("time", timeLabel);
  paymentStore.setValue("endDate", '');
};

const next = () => {
  router.push({
    name: EntitiesEnum.ConfirmOrder,
    params: { id: route.params.id },
  });
};

const confirmOrder = async () => {
  if (isCurrDaySelected(selectedTime.value)) {
    const toast = await toastController.create({
      message: "The booking time already passed. Please, choose another time.",
      duration: 2000,
      icon: "assets/icon/info.svg",
      cssClass: "warning-toast",
    });
    toast.present();
  } else {
    const data = [
      {
        key: "date",
        value: selectedDay.value,
      },
      {
        key: "purchasable",
        value: PurchasableProductsEnum.Training,
      },
      {
        key: "title",
        value: `${trainer.value?.first_name} ${trainer.value?.last_name}`,
      },
    ];
    data.forEach((i) => paymentStore.setValue(i.key, i.value));

    router.push({
      name: EntitiesEnum.ConfirmOrder,
      params: { id: route.params.id },
    });
  }
};
</script>

<style scoped lang="scss">
.content {
  &__container {
    margin: 24px 16px;
    border-radius: 8px;
  }
}

.trainer {
  margin-bottom: 12px;
}

.spinner {
  position: fixed;
  left: 50vw;
  --color: var(--ion-color-white);
}

.submit-btn {
  width: 100%;
}

.user-submit-btn {
  color: var(--gray-700);
  font-family: Yantramanav;
  font-size: 16px;
  font-weight: 500;
}
</style>
