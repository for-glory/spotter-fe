<template>
  <ion-page
    ref="page"
    :class="{ 'web-schedule': role === RoleEnum.Trainer && isFromModal }"
  >
    <base-layout hide-navigation-menu>
      <template #header>
        <page-header
          :back-btn="isFromModal && role === RoleEnum.Trainer ? false : true"
          title="Working schedule"
          @back="onBack"
        />
      </template>
      <template #content>
        <ion-spinner v-if="loading || updateUserLoading" class="spinner" />
        <template v-else>
          <div class="ion-padding-horizontal pb-16">
            <ion-label
              class="schedule__label"
              :class="{ 'native-app': role === RoleEnum.Trainer }"
            >
              Today, {{ today }}</ion-label
            >
            <ion-segment class="job-day segment" v-model="selectedDay">
              <ion-segment-button
                :value="day.value"
                v-for="day in scheduleDays"
                :key="day.value"
                :class="{
                  'active-day': isWorkingDay[day.value],
                  'trainer-active-day':
                    role === RoleEnum.Trainer && isWorkingDay[day.value],
                }"
              >
                <ion-label :class="{ 'native-app': role === RoleEnum.Trainer }"
                  >{{ day.label }}
                </ion-label>
              </ion-segment-button>
            </ion-segment>
          </div>
          <div class="schedule">
            <div class="grid-wrapper">
              <div>
                <ion-label
                  class="schedule__label"
                  :class="{ 'native-app': role === RoleEnum.Trainer }"
                >
                  Are you working on this day?
                </ion-label>
                <base-toggle
                  class="schedule__toggle"
                  :class="{ 'native-app': role === RoleEnum.Trainer }"
                  content="Working day"
                  :value="isWorkingDay[selectedDay]"
                  @change="onIsWorkingChecked"
                />
              </div>
              <div>
                <ion-label
                  class="schedule__label"
                  :class="{ 'native-app': role === RoleEnum.Trainer }"
                >
                  Set your work hours</ion-label
                >
                <div
                  v-for="(_, idx) in workingHoursRange[selectedDay]"
                  :key="idx"
                  class="date-range"
                >
                  <wheel-picker
                    :options="startTimeOptions"
                    :name="`startTime-${selectedDay}-${idx}`"
                    :values="[
                      getTimeWheelPickerValue(idx, 'startTime')?.hour,
                      getTimeWheelPickerValue(idx, 'startTime')?.minutes,
                      getTimeWheelPickerValue(idx, 'startTime')?.text,
                    ]"
                  >
                    <template #button>
                      <choose-block
                        title="From"
                        :value="getTimeValue(Number(idx), 'startTime')"
                        @handle-click="
                          openPicker(
                            `startTime-${selectedDay}-${idx}`,
                            getTimeValue(idx, 'startTime'),
                            startTimeOptions
                          )
                        "
                        class="workout-type"
                        :disabled="!isWorkingDay[selectedDay]"
                      />
                    </template>
                  </wheel-picker>
                  <wheel-picker
                    :options="endTimeOptions"
                    :name="`endTime-${selectedDay}-${idx}`"
                    :values="[
                      getTimeWheelPickerValue(idx, 'endTime')?.hour,
                      getTimeWheelPickerValue(idx, 'endTime')?.minutes,
                      getTimeWheelPickerValue(idx, 'endTime')?.text,
                    ]"
                  >
                    <template #button>
                      <choose-block
                        title="To"
                        :value="getTimeValue(idx, 'endTime')"
                        @handle-click="
                          openPicker(
                            `endTime-${selectedDay}-${idx}`,
                            getTimeValue(idx, 'endTime'),
                            endTimeOptions
                          )
                        "
                        class="workout-type"
                        :disabled="!isWorkingDay[selectedDay]"
                      />
                    </template>
                  </wheel-picker>
                </div>
              </div>
            </div>

            <div class="grid-wrapper">
              <ion-button
                class="secondary"
                :class="{ 'trainer-secondary-btn': role === RoleEnum.Trainer }"
                expand="block"
                @click="resetWorkingHour"
              >
                Reset set hours
              </ion-button>
              <ion-button
                class="secondary"
                :class="{ 'trainer-secondary-btn': role === RoleEnum.Trainer }"
                expand="block"
                @click="addWorkingHours"
              >
                Add additional hours
              </ion-button>
            </div>
          </div>
        </template>
      </template>
    </base-layout>
  </ion-page>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import WheelPicker from "@/general/components/blocks/WheelPicker.vue";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import { minutesDuration } from "@/const/minutes-durations";
import { hoursDuration } from "@/const/hours-durations";
import BaseToggle from "@/general/components/base/BaseToggle.vue";
import {
  IonButton,
  IonPage,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  PickerColumnOption,
  IonSpinner,
  toastController,
  modalController,
} from "@ionic/vue";
import { scheduleDays } from "@/const/schedule-days";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { MeDocument, UpdateUserDocument } from "@/generated/graphql";
import useId from "@/hooks/useId";
import { pickerController } from "@ionic/vue";
import customParseFormat from "dayjs/plugin/customParseFormat";
import debounce from "lodash/debounce";
import { HOURS_RANGE, IS_WORKING_DAYS, WEEKDAYS } from "@/const/schedule";
import useRoles from "@/hooks/useRole";
import { RoleEnum } from "@/generated/graphql";
import TimePicker from "@/general/components/modals/time-picker/TimePicker.vue";
dayjs.extend(customParseFormat);

const props = withDefaults(
  defineProps<{
    isFromModal?: boolean;
  }>(),
  {
    isFromModal: false,
  }
);

console.log("props===", props);

const router = useRouter();
const { role } = useRoles();

const onBack = () => {
  router.go(-1);
};

const page = ref<typeof IonPage | null>(null);
const today = ref(dayjs(new Date()).format("DD MMMM YYYY"));
const selectedDay = ref(dayjs().format("dddd").toLowerCase());
const workingHoursRange = reactive<{
  [index: string]: { [index: string | number]: string }[];
}>(HOURS_RANGE);
const isWorkingDay = reactive<{
  [index: string]: boolean;
}>(IS_WORKING_DAYS);
const curIndex = ref<string | number>("");
const openingHour = reactive<{
  [index: string]: { [index: string]: string }[];
}>(WEEKDAYS);
const { id } = useId();

const hours = hoursDuration();
const minutes = minutesDuration(30, 60, 0);

const getTimeValue = (idx: number, key: string) => {
  if (
    openingHour[selectedDay.value][idx] &&
    openingHour[selectedDay.value][idx][key]
  ) {
    return openingHour[selectedDay.value][idx][key];
  } else {
    return "";
  }
};

const getTimeWheelPickerValue = (idx: number, key: string) => {
  const value = getTimeValue(idx, key);
  const hour = value ? value.split(":")[0] : "";
  const minutes = value ? value.split(":")[1]?.split(" ")[0] : "";
  const text = value ? value.split(" ")[1] : "";

  return {
    hour,
    minutes,
    text,
  };
};

const showToast = async (msg: string, key: string, icon: string) => {
  const toast = await toastController.create({
    message: msg,
    duration: 2000,
    icon: `assets/icon/${icon}.svg`,
    cssClass: `${key}-toast`,
  });
  return toast.present();
};

const dateVerification = (startTime: string, endTime: string): boolean => {
  const dateFrom = dayjs(startTime, "h:mm A");
  const dateTo = dayjs(endTime, "h:mm A");
  return dateTo.diff(dateFrom, "minute") <= 0;
};

const updateTime = debounce(() => {
  mutate({
    id,
    input: {
      opening_hours: JSON.stringify(getHoursParams()),
    },
  })
    .then(() => {
      refetch();
      showToast("Time succesfully updated", "success", "success");
    })
    .catch(() => {
      showToast("Something went wrong. Try again.", "danger", "info");
    });
}, 1000);

const { onResult, refetch, loading } = useQuery(
  MeDocument,
  { id },
  {
    fetchPolicy: "no-cache",
  }
);

const { mutate, loading: updateUserLoading } = useMutation(UpdateUserDocument);

onResult(({ data }) => {
  const userHours = JSON.parse(data?.me?.opening_hours);
  if (userHours) {
    Object.keys(userHours).forEach((day: string) => {
      isWorkingDay[day] = !!userHours[day].length;
      workingHoursRange[day] = [...Array(userHours[day]?.length || 1)];
      openingHour[day] = userHours[day].map((range: string) => {
        const [start, end] = range.split("-");
        return {
          startTime: dayjs(start, "HH:mm").format("h:mm A"),
          endTime: dayjs(end, "HH:mm").format("h:mm A"),
        };
      });
    });
  }
});

const openPicker = async (
  name: string,
  values: { [x: string]: any },
  options: { columns: any[]; buttons: any }
) => {
  const columns = options.columns.map(
    (column: { options: any[]; name: any }) => {
      const options = column.options.map(
        (option: { value: any; text: any }) => {
          return {
            value: option.value,
            text: option.text,
          };
        }
      );
      return {
        name: column.name,
        options,
        selectedIndex: values
          ? column.options.findIndex(
              (option: { value: any }) => option.value === values.split(":")[0]
            )
          : -1,
      };
    }
  );
  let pickerClass: string;
  if (role === RoleEnum.Trainer) {
    pickerClass = "trainer-picker";
    if (props.isFromModal) {
      pickerClass = "trainer-picker web-trainer-picker";
    }
  }

  const picker = await pickerController.create({
    buttons: options.buttons,
    mode: "ios",
    columns,
    cssClass: pickerClass,
  });

  curIndex.value = name.split("-")[2];
  await picker.present();
};

const onIsWorkingChecked = (checked: boolean) => {
  isWorkingDay[selectedDay.value] = checked;

  if (!checked && openingHour[selectedDay.value].length) {
    clearDayTime();
  }
};

const isCurTimeShouldBeUpdated = () => {
  if (
    openingHour[selectedDay.value][curIndex.value] &&
    openingHour[selectedDay.value][curIndex.value].startTime &&
    openingHour[selectedDay.value][curIndex.value].endTime
  ) {
    updateTime();
  }
};

const timePickerColums = [
  {
    name: "hours",
    options: hours,
  },
  {
    name: "minutes",
    options: minutes,
  },
  {
    name: "time",
    options: [
      {
        text: "AM",
        value: "AM",
      },
      {
        text: "PM",
        value: "PM",
      },
    ],
  },
];
const startTimeOptions = {
  columns: timePickerColums,
  buttons: [
    {
      text: "Form",
      role: "cancel",
    },
    {
      text: "Choose time",
      handler: (value: PickerColumnOption) => {
        const minutes =
          value.minutes?.value && Number(value.minutes.value) < 10
            ? `0` + value.minutes?.value
            : value.minutes?.value;

        if (openingHour[selectedDay.value][curIndex.value]?.endTime) {
          const notValid = dateVerification(
            `${value.hours?.value}:${minutes} ${value.time?.value}`,
            openingHour[selectedDay.value][curIndex.value].endTime
          );
          if (notValid) {
            showToast("Please specify the correct time ", "danger", "info");
            return;
          } else {
            openingHour[selectedDay.value][curIndex.value] = {
              ...openingHour[selectedDay.value][curIndex.value],
              startTime: `${value.hours?.value}:${minutes} ${value.time?.value}`,
            };
          }
        } else {
          openingHour[selectedDay.value][curIndex.value] = {
            ...openingHour[selectedDay.value][curIndex.value],
            startTime: `${value.hours?.value}:${minutes} ${value.time?.value}`,
          };
        }

        isCurTimeShouldBeUpdated();
      },
    },
  ],
};
const endTimeOptions = {
  columns: timePickerColums,
  buttons: [
    {
      text: "To",
      role: "cancel",
    },
    {
      text: "Choose time",
      handler: (value: PickerColumnOption) => {
        const minutes =
          value.minutes?.value && Number(value.minutes.value) < 10
            ? `0` + value.minutes?.value
            : value.minutes?.value;

        if (openingHour[selectedDay.value][curIndex.value]?.startTime) {
          const notValid = dateVerification(
            openingHour[selectedDay.value][curIndex.value]?.startTime,
            `${value.hours?.value}:${minutes} ${value.time?.value}`
          );
          if (notValid) {
            showToast("Please specify the correct time ", "danger", "info");
            return;
          } else {
            openingHour[selectedDay.value][curIndex.value] = {
              ...openingHour[selectedDay.value][curIndex.value],
              endTime: `${value.hours?.value}:${minutes} ${value.time?.value}`,
            };
          }
        } else {
          openingHour[selectedDay.value][curIndex.value] = {
            ...openingHour[selectedDay.value][curIndex.value],
            endTime: `${value.hours?.value}:${minutes} ${value.time?.value}`,
          };
        }

        isCurTimeShouldBeUpdated();
      },
    },
  ],
};

const addWorkingHours = () => {
  workingHoursRange[selectedDay.value] = [
    ...Array(Number(workingHoursRange[selectedDay.value].length) + 1),
  ];
};

const getHoursParams = () => {
  return Object.keys(openingHour).reduce((acc, cur) => {
    acc = {
      ...acc,
      [cur]: openingHour[cur].reduce((hourAcc, curHour) => {
        hourAcc.push(
          `${dayjs(curHour.startTime, "h:mm A").format("HH:mm")}-${dayjs(
            curHour.endTime,
            "h:mm A"
          ).format("HH:mm")}`
        );
        return hourAcc;
      }, []),
    };
    return acc;
  }, {});
};

const clearDayTime = () => {
  workingHoursRange[selectedDay.value] = [...Array(1)];
  openingHour[selectedDay.value] = [];
  updateTime();
};

const resetWorkingHour = () => {
  clearDayTime();
};
</script>

<style scoped lang="scss">
.header {
  margin-bottom: 24px;
}

.schedule {
  padding: 24px;

  &__label {
    display: block;
    margin-bottom: 18px;
    font-weight: 500;
    font-size: 16px;
    line-height: 1.5;
    color: var(--ion-color-white);
  }

  &__toggle {
    margin-bottom: 25px;
  }

  .workout-type {
    margin-bottom: 15px;
    --color: var(--ion-color-medium);
  }

  .secondary {
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 400;
  }
  .trainer-secondary-btn {
    border: 1px solid var(--gold);
    border-radius: 8px;
    --color: var(--fitnesswhite);
    font-family: Yantramanav;
    font-weight: 700;
  }
}

.job-day {
  justify-content: space-between;

  ion-segment-button {
    flex: 0 0 38px;
    min-width: 38px;
    width: 38px;
    min-height: 38px;
    height: 38px;
    border-radius: 50%;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    --padding-start: 0;
    --padding-end: 0;
    --color: var(--ion-color-secondary);
    --background: var(--gray-600);
    --color-checked: var(--gray-700);
    --background-checked: var(--ion-color-primary);
    --indicator-height: 0;

    &.active-day {
      --background: var(--ion-color-white);
      --color: var(--gray-700);
    }
    &.trainer-active-day {
      --background: var(--fitnesswhite);
    }
  }
}

.modal-date {
  &__content {
    padding: 12px 24px;
    border-radius: 18px 18px 0 0;
    background: var(--gray-800);
  }

  &__closed {
    display: block;
    margin: 0 auto 7px;
    width: 48px;
    height: 4px;
    border-radius: 2px;
    background: rgba(var(--ion-color-gray-900-contrast-rgb), 0.12);
  }

  &__title {
    display: block;
    margin-bottom: 12px;
    font-weight: 500;
    font-size: 16px;
    line-height: 1.5;
    color: var(--ion-color-white);
  }

  .calendar {
    margin-left: -8px;
    margin-right: -8px;
    margin-bottom: 16px;
  }

  .button--submit {
    margin-bottom: 32px;
  }
}

.date-range {
  margin-bottom: 35px;
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

.web-schedule {
  ion-segment {
    gap: 32px;
    justify-content: flex-start;
  }

  .grid-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    ion-button {
      margin: 0;
    }
  }

  .pb-16 {
    padding-bottom: 16px;
  }

  .schedule {
    padding: 20px 16px;
  }

  .date-range {
    margin-bottom: 27px;
  }
}
</style>
