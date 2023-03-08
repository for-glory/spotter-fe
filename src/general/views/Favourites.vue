<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header title="Favorites" back-btn @back="onBack" />
    </template>
    <template #content>
      <div class="favourites">
        <ion-spinner
          name="lines"
          class="spinner"
          v-if="
            (activeTab === EntitiesEnum.Facilities && facilitiesLoading) ||
            (activeTab === EntitiesEnum.Trainers && trainiersLoading)
          "
        />
        <list-empty
          v-else-if="
            (activeTab === EntitiesEnum.Facilities &&
              !facilities?.facilities?.data.length) ||
            (activeTab === EntitiesEnum.Trainers &&
              !trainers?.users?.data.length)
          "
        />
        <template v-else>
          <template v-if="activeTab === EntitiesEnum.Facilities">
            <router-link
              v-for="facility in facilities?.facilities?.data"
              :key="facility.id"
              :to="{
                name: EntitiesEnum.Facility,
                params: { id: facility.id },
              }"
            >
              <search-result show-rating :item="facility">
                <template #end>
                  <ion-button
                    fill="clear"
                    color="light"
                    class="like-btn"
                    @click.prevent="
                      unfollow(facility.id, FollowTypeEnum.Facility)
                    "
                  >
                    <ion-icon
                      slot="icon-only"
                      src="assets/icon/heart-filled.svg"
                    />
                  </ion-button>
                </template>
              </search-result>
            </router-link>
          </template>
          <template v-if="activeTab === EntitiesEnum.Trainers">
            <router-link
              :to="{ name: EntitiesEnum.Trainer, params: { id: trainer.id } }"
              v-for="trainer in trainers?.users?.data"
              :key="trainer.id"
            >
              <trainer-item :trainer="trainer">
                <template #end>
                  <ion-button
                    fill="clear"
                    color="light"
                    class="like-btn"
                    @click.prevent="unfollow(trainer.id, FollowTypeEnum.User)"
                  >
                    <ion-icon
                      slot="icon-only"
                      src="assets/icon/heart-filled.svg"
                    />
                  </ion-button>
                </template>
              </trainer-item>
            </router-link>
          </template>
        </template>
      </div>
      <page-tabs
        :tabs="tabs"
        :value="activeTab"
        class="page-tabs"
        @change="tabsChanged"
      />
    </template>
  </base-layout>
  <confirmation
    :is-visible="showConfirmationModal"
    title="Do you want to unfollow?"
    :description="`${
      unfollowItem?.type === FollowTypeEnum.User ? 'Trainer' : 'GYM'
    } will be removed from this list`"
    button-text="Unfollow"
    @discard="onUnfollowConfirmed"
    @decline="onUnfollowRejected"
  />
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  FacilitiesDocument,
  FollowTypeEnum,
  RoleEnum,
  UnfollowDocument,
  UsersDocument,
} from "@/generated/graphql";
import { IonIcon, IonSpinner, IonButton } from "@ionic/vue";
import PageTabs from "@/general/components/PageTabs.vue";
import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "@/const/entities";
import { ref } from "vue";
import TrainerItem from "@/general/components/TrainerItem.vue";
import SearchResult from "@/users/views/facilities/SearchResult.vue";
import ListEmpty from "@/general/components/blocks/favourites/ListEmpty.vue";
import router from "@/router";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";

const {
  result: facilities,
  loading: facilitiesLoading,
  refetch: facilitiesRefetch,
} = useQuery(
  FacilitiesDocument,
  {
    is_followed: true,
  },
  {
    fetchPolicy: "no-cache",
  }
);
const {
  result: trainers,
  loading: trainiersLoading,
  refetch: trainersRefetch,
} = useQuery(
  UsersDocument,
  {
    role: RoleEnum.Trainer,
    is_followed: true,
  },
  {
    fetchPolicy: "no-cache",
  }
);

const tabs: TabItem[] = [
  {
    name: EntitiesEnum.Facilities,
    label: "Gyms",
  },
  {
    name: EntitiesEnum.Trainers,
    label: "Trainers",
  },
];

const activeTab = ref<EntitiesEnum>(EntitiesEnum.Facilities);

const tabsChanged = (ev: EntitiesEnum) => {
  if (ev) activeTab.value = ev;
};

const onBack = () => {
  router.go(-1);
};

const { showConfirmationModal, hideModal, showModal } = useConfirmationModal();

const unfollowItem = ref<{ id: string; type: FollowTypeEnum } | null>(null);

const unfollow = (id: string, type: FollowTypeEnum) => {
  unfollowItem.value = { id, type };
  showModal();
};

const onUnfollowRejected = () => {
  unfollowItem.value = null;
  hideModal();
};

const { mutate: unfollowMutate, onDone: onUnfollowed } =
  useMutation(UnfollowDocument);

const onUnfollowConfirmed = () => {
  hideModal();
  unfollowMutate({
    id: unfollowItem.value?.id,
    type: unfollowItem.value?.type,
  });
};

onUnfollowed(() => {
  unfollowItem.value = null;
  switch (activeTab.value) {
    case EntitiesEnum.Facilities:
      facilitiesRefetch();
      break;

    case EntitiesEnum.Trainers:
      trainersRefetch();
      break;

    default:
      break;
  }
});
</script>

<style scoped lang="scss">
.favourites {
  padding: 24px 16px calc(68px + var(--ion-safe-area-bottom));
}

.page-tabs {
  left: 0;
  right: 0;
  display: flex;
  z-index: 21000;
  position: fixed;
  align-items: center;
  pointer-events: none;
  flex-direction: column;
  justify-content: center;
  bottom: calc(24px + var(--ion-safe-area-bottom));
  --btn-min-width: 105px;
}

.like-btn {
  margin: 0;
  height: 1em;
  font-size: 24px;
  display: block;
  min-width: 1em;
  --icon-font-size: 24px;
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  --icon-padding-bottom: 0;
  --icon-padding-end: 0;
  --icon-padding-start: 0;
  --icon-padding-top: 0;
  --min-height: 1em;
  --min-width: 1em;

  ion-icon {
    font-size: 1em;
  }
}

.spinner {
  display: block;
  margin: calc(30vh - 60px) auto 0;
}

.item-wrap {
  &:first-child {
    margin-top: 0;
  }
}
</style>
