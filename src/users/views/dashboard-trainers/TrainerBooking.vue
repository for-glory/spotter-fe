
<template>
    <div class="dashboard web-bookings d-flex-col h-100">
        <div class="d-flex align-items-center page-header">
            <ion-button class="common-back-btn" fill="clear" @click="handleBack">
                <ion-icon src="assets/icon/arrow-back.svg" />
            </ion-button>
            <ion-title class="banner__title">Back</ion-title>
        </div>
        <div class="d-flex gap-16 h-100 overflow-hidden">
            <div class="flex-1 h-100 d-flex-col justify-content-between hide-scrollbar">
                <div class="holder-dates ion-padding-horizontal" v-if="!orderDetail">
                    <IonTitle class="ion-text-center date-title">Book {{ user?.first_name }} {{ user?.last_name }}
                    </IonTitle>
                    <TrainerItem v-if="!loading" :trainer="(user as User)"></TrainerItem>
                    <base-calendar :times="uptime" @change-day="onChangeDay" :loading="availabilityLoading"
                        @change-time="onChangeTime" :selected="selectedDay" />
                </div>
                <div v-else>
                    <div class="order">
                        <order-item :type="EntitiesEnum.Trainer" :item="user" :hourly-rate="hourlyRate"
                            :orderDate="selectedDay" :orderTime="paymentStore.time" :trainer-cart="cart" />
                    </div>
                    <div class="training-place__container" v-if="showChoosePlace">
                        <ion-text class="training-place__title">
                            Choose training location
                        </ion-text>
                        <choose :value="paymentStore?.place?.text" title="Place" class="training-place__info"
                            :class="{ 'active': isExpanded }" :is-web-item="true" :item-outline="!isExpanded"
                            @handle-click="isExpanded = !isExpanded" />
                    </div>
                    <ChoosePlace v-if="isExpanded" :is-web-view="true"></ChoosePlace>
                </div>
                <IonButton :disabled="disabledBtn" class="ion-margin" @click="onNext">Confirm</IonButton>
            </div>
            <div class="flex-2 h-100 hide-scrollbar">
                <BaseCustomCalendar class="web-custom-calendar" week-days-format="W" />
            </div>
        </div>
    </div>
    <terms-of-use v-if="!isConfirmed" :is-confirmed="isConfirmed" @agree="onAgree" @decline="onDecline" />
    <waiting :is-open="paymentStore.isOpenWaitingModal" @close="onCloseWaitingModal" @open-chat="openChat" />
</template>
  
<script setup lang="ts">
import { IonIcon, IonTitle, IonButton, toastController, IonText } from "@ionic/vue";
import BaseCustomCalendar from "@/general/components/base/BaseCustomCalendar.vue";
import BaseCalendar from "@/general/components/base/BaseCalendar.vue";
import { computed, ref, watch } from "vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";
import { AddTrainingToCartDocument, AvailableTrainingOptionsEnum, Cart, CreateChatDocument, Query, SettingsCodeEnum, TrainerRate, TrainerTypeEnum, User, UserAvailabilityDocument, UserAvailabilityQuery, UserDocument } from "@/generated/graphql";
import utc from "dayjs/plugin/utc";
import { EntitiesEnum } from "@/const/entities";
import { paymentGatewaysStore } from "@/users/store/paymentGatewaysStore";
import TrainerItem from "@/general/components/TrainerItem.vue";
import { getSumForPayment } from "@/general/helpers/getSumForPayment";
import dayjs, { Dayjs } from "dayjs";
import TermsOfUse from "@/general/components/modals/terms/TermsOfUse.vue";
import OrderItem from "@/users/components/Order.vue";
import Choose from "@/general/components/blocks/Choose.vue";
import ChoosePlace from "../trainers/ChoosePlace.vue";
import { PlaceType } from "@/ts/enums/user";
import Waiting from "@/general/components/modals/approval/Waiting.vue";
import { GetTrainerDocument } from "@/graphql/documents/userDocuments";
import { date } from "yup";

dayjs.extend(utc);
const router = useRouter();

const route = useRoute();
const selectedDay = ref(dayjs.utc());
const paymentStore = paymentGatewaysStore();
const orderDetail = ref<boolean>(false);
const selectedTime = ref<Dayjs | null>(null);
const isConfirmed = ref<boolean>(true);
const isExpanded = ref<boolean>(false);
const selectedHourDifferent = ref<number>(1);
const cart = ref<Cart | null>(null);

const { mutate: createChatMutation } = useMutation(CreateChatDocument);

const { result, loading } = useQuery<Pick<Query, "user">>(GetTrainerDocument, {
    id: route.params.id,
});

watch(
  () => paymentStore?.place?.text,
  () => {
    cart.value = null;
  }
);

const openChat = () => {
    createChatMutation({ participant_id: route.params.id }).then((res) => {
        paymentStore.setValue("isOpenWaitingModal", false);
        router.push({
            name: EntitiesEnum.DashboardMessage,
            params: { id: res?.data?.createChat?.id },
        });
    });
};

const onCloseWaitingModal = () => {
    paymentStore.setValue("isOpenWaitingModal", false);
    router.push({
        name: EntitiesEnum.Dashboard,
    });
};

const showChoosePlace = computed(() => {
    const isBoth = user.value?.trainer_type === TrainerTypeEnum.Both;
    const isNotGym = user.value?.trainer_type !== TrainerTypeEnum.WorkingInGym;

    return (isBoth || isNotGym);
});
const { mutate: addToCartMutation, loading: addToCartLoading } = useMutation(
    AddTrainingToCartDocument
);
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

const hasFreeHours = computed(
    () => availabilityResult.value?.userAvailability?.hours?.length
);
//

const disabledBtn = computed(
    () => {
        if (orderDetail?.value) {
            return !paymentStore.place?.text;
        }
        return !selectedDay.value || !selectedTime.value || !hasFreeHours.value || !paymentStore.endDate;
    }
);

const user = computed(() => result.value?.user);

const hourlyRate = computed(() => {
    let rate;
    if (result?.value?.user?.trainer_type === TrainerTypeEnum.Freelancer) {
        rate = result.value?.user?.settings?.find(
            (setting: any) => setting.setting?.code === SettingsCodeEnum.RemoteHourlyRate
        );
    } else {
        rate = result.value?.user?.settings?.find(
            (setting: any) => setting.setting?.code === SettingsCodeEnum.HourlyRate
        );
        if (paymentStore?.place?.value === PlaceType.UserHome) {
            rate = result.value?.user?.settings?.find(
                (setting: any) => setting.setting?.code === SettingsCodeEnum.RemoteHourlyRate
            );
        }
    }
    let calcRate: any = rate?.value ? getSumForPayment(rate.value, true) : "0.00";
    const diff = dayjs(paymentStore.endDate).diff(dayjs(paymentStore.startDate),'hour',true);
    if(diff){
       return (calcRate * diff)
    }
    return calcRate;
    
});
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
                if(dayjs(cur.from).minute() > 30){
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
const onAgree = () => {
    localStorage.setItem("terms_of_use", JSON.stringify(true));
    isConfirmed.value = true;
    orderDetail.value = true;
};

const onDecline = () => {
    localStorage.setItem("terms_of_use", JSON.stringify(false));
    isConfirmed.value = true;
};

const handleBack = () => {
    if (orderDetail?.value) {
        orderDetail.value = false;
        cart.value = null;
        paymentStore.setValue('endDate','');
        return;
    }
    router.back();
};
const getTrainingOptions = () => {
    if (user.value?.trainer_type === TrainerTypeEnum.WorkingInGym) {
        return AvailableTrainingOptionsEnum.InTrainerGym;
    }
    if (paymentStore?.place?.value === PlaceType.UserHome) {
        return AvailableTrainingOptionsEnum.TrainerRemote;
    }
    if (paymentStore?.place?.value === PlaceType.UserGym) {
        return AvailableTrainingOptionsEnum.InUserGym;
    }

    console.log('userType', user.value?.trainer_type);

    return AvailableTrainingOptionsEnum.InTrainerGym;
};
const getTrainerParams = () => {
    const params: {
        available_user_gym_id?: string;
        training_option: AvailableTrainingOptionsEnum | string;
        trainer_id: string;
        start_date: Date;
        end_date: Date;
    } = {
        training_option: getTrainingOptions(),
        trainer_id: route.params.id as string,
        start_date: dayjs(new Date(paymentStore.getStartDate)).utc().toDate(),
        end_date: dayjs(new Date(paymentStore.getEndDate)).utc().toDate(),
    };

    if (paymentStore.place?.value === PlaceType.UserGym) {
        params.available_user_gym_id = paymentStore?.facility?.id;
    }
    return params;
};

const onNext = () => {
    const data = localStorage.getItem("terms_of_use");
    let terms = null;
    if (data) {
        terms = JSON.parse(data);
    }
    if (!terms) {
        isConfirmed.value = false;
        return;
    }
    if (!orderDetail.value) {
        orderDetail.value = true;
        return;
    }
    console.log(cart.value);

    if (!cart.value) {
        addToCartMutation({
            input: getTrainerParams(),
        })
            .then((res) => {
                console.log(res);
                cart.value = res?.data?.addTrainingToCart;
            })
            .catch(async () => {
                const toast = await toastController.create({
                    message: "Something went wrong. Try again.",
                    duration: 2000,
                    icon: "assets/icon/info.svg",
                    cssClass: "warning-toast",
                });
                toast.present();
            });
        return;
    }
    router.push({
        name: EntitiesEnum.GymPaymentMethod,
        params: {
            id: route.params.id,
        },
        query: {
            cart_id: cart?.value?.id,
        },
    });
};



</script>
  
<style scoped lang="scss">
.dashboard {
    padding: 24px 16px 64px;

    &__navigation {
        width: 16vw;
        display: flex;
        align-items: flex-end;
        font-size: 18px;
        color: var(white);
        gap: 25px;
    }
}

.banner__title {
    margin-top: -3px;
}

.empty-block {
    margin-top: 48px;
}

.web-bookings {
    padding: 0 64px;
}

.page-header {
    padding-top: 21px;
    margin-bottom: 26px;

    ion-title {
        font-size: 24px;
        padding-left: 7px;
        color: var(--gold);
    }

    ion-icon {
        color: var(--gray-500);
        font-size: 20px;
    }
}

.flex-1,
.flex-2 {
    width: 100%;
    overflow: auto;
}

.flex-1 {
    max-width: 360px;
    background: var(--gray-700);
    padding-top: 20px;
}

.overflow-hidden {
    overflow: hidden;
}

.date-title {
    font-family: "Yantramanav";
    font-size: 16px;
    font-weight: 500;
    margin-top: 10px;
    margin-bottom: 23px;
}

.training-place {
    &__container {
        padding: 0 24px;
    }

    &__title {
        margin-bottom: 16px;
        display: block;
    }

    &__info {
        :deep {
            .choose-place__icon {
                transition: all 250ms;
            }
        }

        &.active {
            :deep {
                .choose-place__icon {
                    transform: rotate(90deg);
                }
            }
        }
    }
}
</style>
  