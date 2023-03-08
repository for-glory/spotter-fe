<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header
        class="header"
        title="Scan code"
        back-btn
        @back="back"
        transparent
      />
    </template>
    <template #content>
      <div class="scanner" v-if="scanActive">
        <span class="scanner__corner scanner__corner--tl"></span>
        <span class="scanner__corner scanner__corner--tr"></span>
        <span class="scanner__corner scanner__corner--br"></span>
        <span class="scanner__corner scanner__corner--bl"></span>
        <span class="scanner__scan"></span>
        <div class="scanner__hint">
          <ion-icon
            class="scanner__hint__icon"
            src="assets/icon/scanner.svg"
          ></ion-icon>
          <span class="scanner__hint__text">
            Scan the cleint’s QR-code. The code should be in the center of
            scanner.
          </span>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script lang="ts" setup>
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRouter } from "vue-router";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { onMounted, onUnmounted, ref } from "vue";
import { IonIcon, toastController } from "@ionic/vue";
import CryptoJs from "crypto-js";
import useId from "@/hooks/useId";
import { useLazyQuery, useMutation } from "@vue/apollo-composable";
import {
  FacilityItemPassDocument,
  Query,
  RoleEnum,
  TrainingDocument,
  TrainingStatesEnum,
  CheckinByPassDocument,
  TrainingCheckinDocument,
  CheckinByPassMutationVariables,
  TrainingCheckinMutationVariables,
} from "@/generated/graphql";
import { EntitiesEnum } from "@/const/entities";
import useFacilityId from "@/hooks/useFacilityId";
import useRoles from "@/hooks/useRole";

const router = useRouter();

const back = () => {
  router.go(-1);
};

const scanActive = ref<boolean>(true);

onMounted(() => {
  startScanner();
});

onUnmounted(() => {
  stopScanner();
});

const checkPermission = () => {
  return new Promise((resolve, reject) => {
    BarcodeScanner.checkPermission({ force: true })
      .then((status) => {
        if (status.granted) {
          resolve(true);
        } else if (status.denied) {
          BarcodeScanner.openAppSettings();
          reject(false);
        }
      })
      .catch((err) => {
        console.log("check permission error: ", err);
      });
  });
};

const startScanner = async () => {
  const allowed = await checkPermission();

  if (allowed) {
    scanActive.value = true;
    BarcodeScanner.hideBackground();
    document.body.classList.add("bg-transparent");

    const result = await BarcodeScanner.startScan();

    if (result.hasContent && result.content) {
      scanActive.value = false;
      const { id: myId } = useId();
      const { role } = useRoles();
      const { id: myFacilityId } = useFacilityId();
      const res = CryptoJs.AES.decrypt(
        result.content,
        role === RoleEnum.Trainer ? myId : myFacilityId
      )
        .toString(CryptoJs.enc.Utf8)
        .split("/");

      switch (res[0]) {
        case "facilityPass":
          return getFacilityPass(FacilityItemPassDocument, { id: res[1] });

        case "training":
          return getTraining(TrainingDocument, { id: res[1] });

        case "event":
          return router.push({
            name: EntitiesEnum.Session,
            params: { id: res[1] },
            query: {
              userId: res[2],
              type: EntitiesEnum.Event,
            },
          });

        default: {
          showToast("Nothing found!", "warning-toast");
          startScanner();
          break;
        }
      }
    } else {
      startScanner();
    }
  } else {
    showToast("Permission not allowed!", "warning-toast");
    back();
  }
};

const showToast = async (message: string, cssClass: string) => {
  const toast = await toastController.create({
    message,
    cssClass,
    duration: 2000,
    icon: "assets/icon/info.svg",
  });
  toast.present();
};

const stopScanner = () => {
  document.body.classList.remove("bg-transparent");
  BarcodeScanner.stopScan();
  scanActive.value = false;
};

const {
  onResult: checkFacilityPass,
  load: getFacilityPass,
  onError: facilityPassError,
} = useLazyQuery<Pick<Query, "facilityItemPass">>(FacilityItemPassDocument);

facilityPassError(() => {
  startScanner();
});

const {
  mutate: checkinByPass,
  onDone: byPassCheckedIn,
  onError: byPassCheckinError,
} = useMutation(CheckinByPassDocument);

checkFacilityPass((facilityPassResult) => {
  const facilityItemPass = facilityPassResult.data.facilityItemPass;

  if (!facilityItemPass?.is_active_pass)
    return showToast("This GYM pass is not active", "warning-toast");

  const { id: myId } = useId();
  const checkinByPassVariables: CheckinByPassMutationVariables = {
    input: {
      facility_item_pass_id: facilityItemPass.id,
      manager_id: myId,
    },
  };

  checkinByPass(checkinByPassVariables);
});

byPassCheckinError((error) => {
  showToast(error.message, "danger-toast");
});

byPassCheckedIn((response) => {
  showToast(
    `${response.data.checkinByPass.user.first_name} ${response.data.checkinByPass.user.last_name} successfully checked in`,
    "success-toast"
  );

  router.push({
    name: EntitiesEnum.Session,
    params: { id: response.data.checkinByPass.id },
    query: {
      type: EntitiesEnum.Facility,
    },
  });
});

const {
  onResult: checkTraining,
  load: getTraining,
  onError: trainingError,
} = useLazyQuery<Pick<Query, "training">>(TrainingDocument);

trainingError(() => {
  startScanner();
});

const {
  mutate: trainingCheckin,
  onDone: trainingCheckedIn,
  onError: trainingCheckinError,
} = useMutation(TrainingCheckinDocument);

checkTraining((trainingResult) => {
  const training = trainingResult.data.training;
  if (training.state !== TrainingStatesEnum.Accepted) {
    if (training.state === TrainingStatesEnum.Started)
      return router.push({
        name: EntitiesEnum.Session,
        params: { id: training.id },
        query: {
          type: EntitiesEnum.Training,
        },
      });

    return showToast(
      `Error! Training status is ${training.state}`,
      "warning-toast"
    );
  }

  const trainingCheckinParams: TrainingCheckinMutationVariables = {
    input: {
      training_id: training.id,
      user_id: training.user.id,
    },
  };

  trainingCheckin(trainingCheckinParams);
});

trainingCheckinError((error) => {
  showToast(error.message, "danger-toast");
});

trainingCheckedIn((response) => {
  showToast(
    `Training with ${response.data.training.user.first_name} ${response.data.training.user.last_name} was started`,
    "success-toast"
  );

  router.push({
    name: EntitiesEnum.Session,
    params: { id: response.data.training.id },
    query: {
      type: EntitiesEnum.Training,
    },
  });
});
</script>

<style lang="scss" scoped>
.header {
  top: 0;
  left: 0;
  right: 0;
  position: absolute;
}

.header-btn {
  margin: 0;
  height: 32px;
  font-size: 24px;
  display: block;
  min-width: 32px;
  backdrop-filter: blur(4px);
  border-radius: 50%;
  --border-radius: 50% !important;
  --icon-font-size: 24px;
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  --icon-padding-bottom: 0;
  --icon-padding-end: 0;
  --icon-padding-start: 0;
  --icon-padding-top: 0;
  --min-height: 32px;
  --min-width: 32px;
  --background: rgba(var(--ion-color-black-rgb), 0.12);

  ion-icon {
    font-size: 1em;
  }
}

.scanner {
  top: 50%;
  left: 50%;
  width: 252px;
  border-radius: 6px;
  position: absolute;
  pointer-events: none;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 9999px rgba(var(--ion-color-black-rgb), 0.64);

  &:before {
    content: "";
    display: block;
    padding-top: 100%;
  }

  &__corner {
    width: 1em;
    height: 1em;
    font-size: 64px;
    position: absolute;
    border-width: 1.2px;
    border-style: solid;

    &--tl {
      top: -8px;
      left: -8px;
      border-radius: 8px 0 0 0;
      border-width: 1px 0 0 1px;
    }

    &--tr {
      top: -8px;
      right: -8px;
      border-radius: 0 8px 0 0;
      border-width: 1px 1px 0 0;
    }

    &--br {
      right: -8px;
      bottom: -8px;
      border-radius: 0 0 8px 0;
      border-width: 0 1px 1px 0;
    }

    &--bl {
      left: -8px;
      bottom: -8px;
      border-radius: 0 0 0 8px;
      border-width: 0 0 1px 1px;
    }
  }

  &__scan {
    top: 50%;
    left: -17px;
    right: -17px;
    height: 1.2px;
    position: absolute;
    animation: scan 5s ease infinite;
    background: var(--ion-color-white);
  }

  &__hint {
    top: 100%;
    left: 50%;
    display: flex;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    margin-top: 48px;
    padding: 10px 16px;
    border-radius: 8px;
    position: absolute;
    align-items: center;
    width: calc(100vw - 52px);
    backdrop-filter: blur(10px);
    justify-content: flex-start;
    transform: translateX(-50%);
    color: var(--ion-color-white);
    background: var(--toast-background);

    &__icon {
      flex: 0 0 1em;
      line-height: 1;
      font-size: 24px;
      margin-right: 12px;
      color: var(--ion-color-primary);
    }
  }
}

@keyframes scan {
  0% {
    top: 5%;
  }
  50% {
    top: 95%;
  }
  100% {
    top: 5%;
  }
}
</style>

<style lang="scss">
body.bg-transparent,
body.bg-transparent .base-layout {
  background-color: transparent;

  .page-content {
    --background: transparent;
  }
}
</style>
