<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn title="Preferences" @back="onBack" />
    </template>
    <template #content>
      <div class="preferences">
        <ion-spinner v-if="loading" class="spinner" />
        <div class="radiobutton__group" v-else>
          <div class="toggle-btns" v-if="role === RoleEnum.User">
            <base-toggle
              :value="selectedItem === EntitiesEnum.Facilities"
              content="Display gyms"
              @click="onChange(EntitiesEnum.Facilities)"
            />
            <base-toggle
              :value="selectedItem === EntitiesEnum.Trainers"
              content="Display trainers"
              @click="onChange(EntitiesEnum.Trainers)"
            />
          </div>
          <div class="radio-btns" v-if="role !== RoleEnum.User">
            <ion-radio-group
              @ionChange="onRadioChange($event)"
              :value="selectedItem"
            >
              <div class="radiobutton__container">
                <ion-item class="radiobutton">
                  Display gyms
                  <ion-radio
                    class="radiobutton__radio"
                    slot="end"
                    :value="EntitiesEnum.Facilities"
                  />
                </ion-item>
              </div>

              <div class="radiobutton__container">
                <ion-item class="radiobutton">
                  Display trainers
                  <ion-radio
                    class="radiobutton__radio"
                    slot="end"
                    :value="EntitiesEnum.Trainers"
                  />
                </ion-item>
              </div>
            </ion-radio-group>
          </div>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import {
  IonRadioGroup,
  IonItem,
  IonRadio,
  IonSpinner,
  toastController,
} from "@ionic/vue";
import {
  MeDocument,
  RoleEnum,
  UpdateUserDocument,
  SettingsCodeEnum,
} from "@/generated/graphql";
import BaseToggle from "@/general/components/base/BaseToggle.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { EntitiesEnum } from "@/const/entities";
import useId from "@/hooks/useId";
import useRoles from "@/hooks/useRole";

import {
  IonRadioGroupCustomEvent,
  RadioGroupChangeEventDetail,
} from "@ionic/core";

const selectedItem = ref("");
const router = useRouter();
const { role } = useRoles();

const { id } = useId();

const { onResult, refetch, loading } = useQuery(
  MeDocument,
  { id },
  {
    fetchPolicy: "no-cache",
  }
);

onResult(({ data }) => {
  selectedItem.value = data.me?.settings?.find(
    (setting: any) =>
      setting.setting.code === SettingsCodeEnum.DisplayPreference
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

const onRadioChange = (
  ev: IonRadioGroupCustomEvent<RadioGroupChangeEventDetail<string>>
) => {
  onChange(ev.target.value);
};

const onChange = (value: EntitiesEnum) => {
  selectedItem.value = value;
  mutate({
    id,
    input: {
      settings: [
        {
          code: SettingsCodeEnum.DisplayPreference,
          value: value,
        },
      ],
    },
  })
    .then(() => {
      refetch();
      showToast("Preferences successfully updated", "success", "success");
    })
    .catch(() => {
      showToast("Something went wrong. Try again.", "danger", "info");
    });
};

const onBack = () => {
  router.go(-1);
};
</script>
<style scoped lang="scss">
.radiobutton {
  --background: var(--gray-700);
  --border-radius: 8px;
  --inner-padding-end: 16px;
  font-weight: 300;
  font-size: 14px;
  color: var(--ion-color-white);
  margin-top: 8px;

  &__container {
    margin-bottom: 24px;
  }

  &__group {
    padding: 24px;
    .toggle-btns {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }

  &__radio {
    &::part(mark) {
      background-size: 12px 9px;
      background-position: 50% 50%;
      background-repeat: no-repeat;
      background-image: url(/public/assets/icon/check-mark.svg);
    }

    &.radio-checked {
      &::part(mark) {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
</style>
