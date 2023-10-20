<template>
  <ComponentBaseLayout title="Pronouns" @save="setPronounce">
    <template #content>
      <div class="pronouns-container flex-2">
        <ion-radio-group @ionChange="(e) => selectedPronounce = e?.target?.value" :value="selectedPronounce">
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
  </ComponentBaseLayout>
</template>
<script setup lang="ts">
import { IonItem, IonLabel, IonRadio, IonRadioGroup, toastController } from "@ionic/vue";
import ComponentBaseLayout from "../ComponentBaseLayout.vue";
import { MeDocument, SettingsCodeEnum, UpdateUserDocument } from "@/generated/graphql";
import useId from "@/hooks/useId";
import useRoles from "@/hooks/useRole";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const { id } = useId();
const selectedPronounce = ref("");

const { onResult, refetch, loading } = useQuery(
  MeDocument,
  { id },
  {
    fetchPolicy: "no-cache",
  }
);

const { role } = useRoles();

onResult(({ data }) => {
  selectedPronounce.value = data.me?.settings?.find(
    (setting: any) => setting.setting.code === SettingsCodeEnum.UserPronounce
  )?.value;
});

const { mutate } = useMutation(UpdateUserDocument);

const setPronounce = () => {
  mutate({
    id,
    input: {
      settings: [
        {
          code: SettingsCodeEnum.UserPronounce,
          value: selectedPronounce.value,
        },
      ],
    },
  })
    .then(() => {
      refetch();
      showToast("Pronounce successfully updated", "success", "success");
    })
    .catch(() => {
      showToast("Pronounce went wrong. Try again.", "danger", "info");
    });
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
</script>
<style scoped lang="scss">
.pronouns-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 327px;
  margin-top: 25px;

  .radiobutton {
    font-size: 14px;
    line-height: 1.5;
    --min-height: 48px;
    --padding-top: 0;
    --border-radius: 8px;
    margin-bottom: 16px;
    --padding-bottom: 0;
    --color: var(--ion-color-medium);
    --inner-padding-top: 4px;
    --inner-padding-bottom: 4px;
    --inner-padding-start: 0;
    --inner-padding-end: 0;
    --background: var(--gray-700);
    --padding-start: var(--container-offset);
    --padding-end: var(--container-offset);

    ion-label {
      font-family: Yantramanav;
      color: #fff;
      font-weight: 300;
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
  }
}
</style>
