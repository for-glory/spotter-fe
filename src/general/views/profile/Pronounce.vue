<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn title="Your pronounce" @back="onBack" />
    </template>
    <template #content>
      <ion-spinner v-if="loading" class="spinner" />
      <div :class="['pronounce',  { 'user-pronounce': role === RoleEnum.User }]" v-else>
        <ion-radio-group @ionChange="onChange" :value="selectedItem">
          <ion-item lines="none" class="radiobutton">
            <ion-label class="radiobutton__label"> They/Them/Theirs </ion-label>
            <ion-radio slot="end" value="They/Them/Theirs" />
          </ion-item>
          <ion-item lines="none" class="radiobutton">
            <ion-label class="radiobutton__label"> She/Her/Hers </ion-label>
            <ion-radio slot="end" value="She/Her/Hers" />
          </ion-item>
          <ion-item lines="none" class="radiobutton">
            <ion-label class="radiobutton__label"> He/Him/His </ion-label>
            <ion-radio slot="end" value="He/Him/His" />
          </ion-item>
          <ion-item lines="none" class="radiobutton">
            <ion-label class="radiobutton__label">
              Prefer not to say
            </ion-label>
            <ion-radio slot="end" value="Prefer not to say" />
          </ion-item>
        </ion-radio-group>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import {
  IonItem,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonSpinner,
  toastController,
} from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRouter } from "vue-router";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  MeDocument,
  RoleEnum,
  SettingsCodeEnum,
  UpdateUserDocument,
  WorkoutType,
} from "@/generated/graphql";
import useId from "@/hooks/useId";
import { ref } from "vue";
import {
  IonRadioGroupCustomEvent,
  RadioGroupChangeEventDetail,
} from "@ionic/core";
import useRoles from "@/hooks/useRole";

const router = useRouter();
const { id } = useId();
const selectedItem = ref("");

const { onResult, refetch, loading } = useQuery(
  MeDocument,
  { id },
  {
    fetchPolicy: "no-cache",
  }
);

const { role } = useRoles();

onResult(({ data }) => {
  selectedItem.value = data.me?.settings?.find(
    (setting: any) => setting.setting.code === SettingsCodeEnum.UserPronounce
  )?.value;
});

const { mutate } = useMutation(UpdateUserDocument);

const showToast = async (msg: string, key: string, icon: string) => {
  const toast = await toastController.create({
    message: msg,
    duration: 2000,
    icon: `assets/icon/${icon}.svg`,
    cssClass: `${key}-toast`,
  });
  return toast.present();
};

const onChange = (
  ev: IonRadioGroupCustomEvent<RadioGroupChangeEventDetail<WorkoutType>>
) => {
  selectedItem.value = ev.target.value;
  mutate({
    id,
    input: {
      settings: [
        {
          code: SettingsCodeEnum.UserPronounce,
          value: ev.target.value,
        },
      ],
    },
  })
    .then(() => {
      refetch();
      showToast("Pronounce succesfully updated", "success", "success");
    })
    .catch(() => {
      showToast("Pronounce went wrong. Try again.", "danger", "info");
    });
};

const onBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.pronounce {
  padding: 24px;
}

.radiobutton {
  font-size: 14px;
  line-height: 1.5;
  --min-height: 48px;
  --padding-top: 0;
  --border-radius: 8px;
  margin-bottom: 15px;
  --padding-bottom: 0;
  --color: var(--ion-color-medium);
  --inner-padding-top: 4px;
  --inner-padding-bottom: 4px;
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  --background: var(--gray-700);
  --padding-start: var(--container-offset);
  --padding-end: var(--container-offset);

  &.item-radio-checked {
    --color: var(--ion-color-white);
  }

  ion-radio {
    width: 18px;
    height: 18px;
    border-width: 1.8px;
    margin: 3px 3px 3px 20px;
    --color: var(--ion-color-medium);
    --mark-width: 12px;
    --mark-height: 9px;

    &::part(mark) {
      background-position: 50% 50%;
      background-repeat: no-repeat;
      width: calc(100% + var(--border-width));
      height: calc(100% + var(--border-width));
      background-size: var(--mark-width) var(--mark-height);
      background-image: url(/public/assets/icon/check-mark.svg);
    }
  }

  &__label {
    font-weight: 300;
    font-size: 14px;
    --color: var(--ion-color-white);
  }
}

.user-pronounce {
    .radiobutton__label {
      font-family: 'Yantramanav';
    }
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
</style>
