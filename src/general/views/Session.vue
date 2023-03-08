<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header close-btn :title="sessionTypeName" @back="onBack" />
    </template>
    <template #content>
      <div class="holder-content ion-padding-horizontal">
        <div class="main">
          <ion-text color="light" class="title">
            {{ sessionTypeName }} details
          </ion-text>

          <div class="session-preview">
            <div class="session-preview__user" v-if="user">
              <avatar
                :src="user.avatarUrl"
                :symbols="avatarSymbols"
                class="session-preview__user__avatar"
              />
              <div class="session-preview__user__info">
                <div class="session-preview__user__head">
                  <strong class="session-preview__user__name">
                    {{ user.first_name }} {{ user.last_name }}
                  </strong>
                  <div class="session-preview__user__rating">
                    <span
                      class="session-preview__user__rating-item session-preview__user__rating-item--like"
                    >
                      <ion-icon
                        src="assets/icon/like.svg"
                        class="session-preview__user__rating-item__icon"
                      />
                      {{ user.positive_reviews_count }}
                    </span>
                    <span
                      class="session-preview__user__rating-item session-preview__user__rating-item--dislike"
                    >
                      <ion-icon
                        src="assets/icon/dislike.svg"
                        class="session-preview__user__rating-item__icon"
                      />
                      {{ user.negative_reviews_count }}
                    </span>
                  </div>
                </div>
                <address-item
                  class="session-preview__user__address"
                  v-if="user.address"
                >
                  {{ user.address.street }}
                </address-item>
              </div>
            </div>
            <template v-if="sessionType === EntitiesEnum.Facility">
              <div class="session-preview__row">
                <strong class="session-preview__row__title">Plan</strong>
                <span class="session-preview__row__data">
                  {{ facilityPassResult?.facilityItemPass.facilityItem.title }}
                </span>
              </div>
              <div class="session-preview__row">
                <strong class="session-preview__row__title">Description</strong>
                <span class="session-preview__row__data">
                  {{
                    facilityPassResult?.facilityItemPass.facilityItem
                      .description
                  }}
                </span>
              </div>
              <div class="session-preview__row">
                <strong class="session-preview__row__title">
                  Bundle valid until
                </strong>
                <span class="session-preview__row__data">
                  {{
                    dayjs(facilityPassResult?.facilityItemPass.end_date).format(
                      "MM/DD/YYYY"
                    )
                  }}
                </span>
              </div>
            </template>
            <template v-else-if="sessionType === EntitiesEnum.Training">
              <div class="session-preview__row">
                <strong class="session-preview__row__title">Date</strong>
                <span class="session-preview__row__data">
                  {{
                    dayjs(trainingResult?.training.start_date).format(
                      "D MMMM YYYY - dddd"
                    )
                  }}
                </span>
              </div>
              <div class="session-preview__row">
                <strong class="session-preview__row__title">Time</strong>
                <span class="session-preview__row__data">
                  {{
                    dayjs(trainingResult?.training.start_date).format("h:mm A")
                  }}
                </span>
              </div>
              <div class="session-preview__row">
                <strong class="session-preview__row__title">Total</strong>
                <span class="session-preview__row__data">
                  ${{ trainingResult?.training.order.front_total }}
                </span>
              </div>
            </template>
            <template v-else-if="sessionType === EntitiesEnum.Event">
              <div class="session-preview__row">
                <strong class="session-preview__row__title">Event</strong>
                <span class="session-preview__row__data">
                  {{ eventResult?.event.title }}
                </span>
              </div>
              <div class="session-preview__row">
                <strong class="session-preview__row__title">Date</strong>
                <span class="session-preview__row__data">
                  {{
                    dayjs(eventResult?.event.start_date).format(
                      "D MMMM YYYY - dddd"
                    )
                  }}
                </span>
              </div>
              <div class="session-preview__row">
                <strong class="session-preview__row__title">Time</strong>
                <span class="session-preview__row__data">
                  {{ dayjs(eventResult?.event.start_date).format("h:mm A") }}
                </span>
              </div>
            </template>
          </div>
        </div>
        <div
          class="footer"
          v-if="
            sessionType === EntitiesEnum.Training &&
            trainingResult?.training.state === TrainingStatesEnum.Started
          "
        >
          <ion-button expand="block" @click="finishTraining">
            Finish {{ sessionTypeName }}
          </ion-button>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonText, IonIcon, IonButton } from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRoute, useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { computed, onMounted } from "vue";
import Avatar from "@/general/components/blocks/Avatar.vue";
import AddressItem from "@/general/components/AddressItem.vue";
import { useLazyQuery, useMutation } from "@vue/apollo-composable";
import {
  FacilityItemPassDocument,
  TrainingDocument,
  EventDocument,
  UserDocument,
  TrainingStatesEnum,
  TrainingFinishDocument,
} from "@/generated/graphql";
import dayjs from "dayjs";

const router = useRouter();
const route = useRoute();

const sessionType = route.query.type;
const sessionTypeName = computed<string>(() => {
  switch (sessionType) {
    case EntitiesEnum.Facility:
      return "Bundle";

    case EntitiesEnum.Training:
      return "Training";

    case EntitiesEnum.Event:
      return "Member";

    default:
      return "";
  }
});

const { load: getFacilityPass, result: facilityPassResult } = useLazyQuery(
  FacilityItemPassDocument,
  {
    id: route.params.id,
  }
);

const { load: getTraining, result: trainingResult } = useLazyQuery(
  TrainingDocument,
  {
    id: route.params.id,
  }
);

const { load: getEvent, result: eventResult } = useLazyQuery(EventDocument, {
  id: route.params.id,
});

const { load: getUser, result: userResult } = useLazyQuery(UserDocument, {
  id: route.query.userId,
});

onMounted(() => {
  switch (sessionType) {
    case EntitiesEnum.Facility:
      return getFacilityPass();

    case EntitiesEnum.Training:
      return getTraining();

    case EntitiesEnum.Event: {
      getUser();
      return getEvent();
    }

    default:
      return "";
  }
});

const user = computed(() => {
  switch (sessionType) {
    case EntitiesEnum.Facility:
      return facilityPassResult.value?.facilityItemPass.user;

    case EntitiesEnum.Training:
      return trainingResult.value?.training.user;

    case EntitiesEnum.Event:
      return userResult.value?.user;

    default:
      return null;
  }
});

const avatarSymbols = computed<string>(() => {
  switch (sessionType) {
    case EntitiesEnum.Facility:
      return `${facilityPassResult.value?.facilityItemPass.user.first_name
        .charAt(0)
        .toUpperCase()}${facilityPassResult.value?.facilityItemPass.user.last_name
        .charAt(0)
        .toUpperCase()}`;

    case EntitiesEnum.Training:
      return `${trainingResult.value?.training.user.first_name
        .charAt(0)
        .toUpperCase()}${trainingResult.value?.training.user.last_name
        .charAt(0)
        .toUpperCase()}`;

    case EntitiesEnum.Event:
      return "EV";

    default:
      return "";
  }
});

const onBack = () => {
  router.go(-1);
};

const { mutate: trainingFinishMutate, onDone: trainingFinished } = useMutation(
  TrainingFinishDocument
);

const finishTraining = () => {
  trainingFinishMutate({
    input: { training_id: trainingResult.value?.training.id },
  });
};

trainingFinished(() => {
  router.push({
    name: EntitiesEnum.TrainerSchedule,
  });
});
</script>

<style scoped lang="scss">
.holder-content {
  height: 100%;
  display: flex;
  padding-top: 24px;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: calc(20px + var(--ion-safe-area-bottom));
}

.title {
  display: block;
  font-size: 16px;
  margin: 0 0 16px;
  font-weight: 500;
  line-height: 1.5;
}

.session-preview {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  border-radius: 8px;
  padding: 0 16px 24px;
  background: var(--gray-700);
  color: var(--ion-color-white);

  .search-result {
    padding-left: 0;
    padding-right: 0;
    margin-bottom: 0;
  }

  &__user {
    display: flex;
    padding-top: 16px;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 12px;
    justify-content: flex-start;
    border-bottom: 1px solid var(--gray-600);

    &__avatar {
      --size: 68px;
      flex-shrink: 0;
      margin-right: 16px;
    }

    &__info {
      flex: 1 1 100%;
    }

    &__head {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    &__name {
      display: block;
      font-size: 16px;
      overflow: hidden;
      font-weight: 500;
      line-height: 1.5;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: var(--ion-color-light);
      max-width: calc(100vw - 240px);
    }

    &__rating {
      display: flex;
      align-items: center;
      margin: 0 -2px 0 10px;
      justify-content: flex-start;
    }

    &__rating-item {
      margin: 0 2px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      &--like {
        color: var(--ion-color-success-tint);
      }

      &--dislike {
        color: var(--ion-color-danger-tint);
      }

      &__icon {
        line-height: 1;
        font-size: 24px;
      }
    }

    &__address {
      margin-top: 16px;
    }
  }

  &__row {
    margin-top: 12px;

    &__title {
      display: block;
      font-size: 12px;
      line-height: 1.5;
      font-weight: 500;
      color: var(--ion-color-secondary);
    }

    &__data {
      display: block;
    }
  }
}

.footer {
  .button {
    margin: 0;
  }
}
</style>
