<template>
  <ion-spinner v-if="loading" name="lines" class="spinner" />
  <div class="holder-content ion-padding-horizontal" :class="{ 'holder-content--empty': !loading }" v-else>
    <div class="banner d-flex justify-content-between align-items-center">
      <ion-title class="banner__title">Team Member Profile</ion-title>
    </div>
    <div class="d-flex">
      <div class="content-container flex-2">
        <div class="profile-field">
          <div class="contact-field">
            <ion-avatar class="photo">
              <ion-img v-if="manager.avatarUrl" :src="manager.avatarUrl"></ion-img>
              <template v-else>
                {{ manager.first_name?.charAt(0) }}
              </template>
            </ion-avatar>
            <ion-label class="name">
              {{ `${manager.first_name} ${manager.last_name}` }}
            </ion-label>
            <!-- <ion-text class="contact">{{ manager.employment_type }}</ion-text> -->
            <ion-text class="contact">{{ manager.email }}</ion-text>
            <!-- <ion-text class="contact">{{"(+1)70 8750 9216"}}</ion-text> -->
          </div>
          <div class="data-box">
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex-col align-items-center data-box__item">
                <ion-text>{{ dayjs(manager.birth).format("D MMMM YY") }}</ion-text>
                <ion-text class="field-label">Birthday</ion-text>
              </div>
              <div class="vertical-line" />
              <div class="d-flex-col align-items-center data-box__item">
                <ion-text>{{ manager.tax_id }}</ion-text>
                <ion-text class="field-label">Tax ID</ion-text>
              </div>
              <div class="vertical-line" />
              <div class="d-flex-col align-items-center data-box__item">
                <ion-text>{{ manager.postal }}</ion-text>
                <ion-text class="field-label">Postal Code</ion-text>
              </div>
            </div>
            <div class="horizontal-line" />
            <div>
              <div class="d-flex-col align-items-center">
                <ion-text>{{ `${manager.address?.street} ${manager.address?.city?.state?.name}
                                  ${manager.address?.city?.country?.name}` }}</ion-text>
                <ion-text class="field-label">Address</ion-text>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex flex-direction-column flex-1 btn-wrapper">
        <ion-menu-toggle :auto-hide="false" @click="editTeamMember">
          <ion-button>Edit</ion-button>
        </ion-menu-toggle>
        <ion-button @click="showModal" class="add-gym-btn cursor-pointer" color="danger"
          fill="outline">Delete</ion-button>
      </div>
    </div>
  </div>
  <confirmation :is-visible="showConfirmationModal" title="Do you want to delete account"
    description="Gym manager will be deleted" button-text="Delete" cancel-button-text="Cancel" @discard="onDeleteManager"
    @decline="hideModal" />
</template>

<script setup lang="ts">
import {
  IonButton,
  IonSpinner,
  IonText,
  IonTitle,
  IonAvatar,
  IonImg,
  IonLabel,
  IonMenuToggle
} from "@ionic/vue";
import {
  DeleteManagerDocument,
  UserDocument,
} from "@/generated/graphql";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import { useRouter } from "vue-router";
import { useSideMenu } from "@/general/stores/sideMenuStore";

const { showConfirmationModal, showModal, hideModal } = useConfirmationModal();
const { mutate } = useMutation(DeleteManagerDocument);

const route = useRoute();
const router = useRouter();
const menuStore = useSideMenu();

const { result, loading } = useQuery(UserDocument, {
  id: route.params.id
});

const manager = computed(() => {
  return result.value?.user ?? {
    first_name: "",
    last_name: "",
    avatarUrl: "",
    employment_type: ""
  };
});

const editTeamMember = () => {
  menuStore.setOption({ showImg: false, title: "Edit Team Member", isEdit:true });
};

const onDeleteManager = () => {
  console.log("delete manager");
  hideModal();
  mutate({
    id: route.params.id,
  })
    .then(() => {
      router.back();
    })
    .catch((err: any) => {
      console.log(err);
    });
};
</script>

<style scoped lang="scss">
.holder-content {
  padding-left: 50px;
  padding-right: 28px;
  padding-top: -40px;
}

.banner {
  width: 100%;
  position: relative;
  overflow: hidden;

  &__title {
    padding: 0;
    color: var(--gold);
    font-family: Lato;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
}

.content-container {
  padding-top: 51px;
  display: flex;
  gap: 62px;
  justify-content: center;

  .top {
    margin-bottom: 40px;
  }

  .profile-field {
    display: flex;
    flex-direction: column;
    gap: 22px;

    .calendar-title {
      font: 20px/1 var(--ion-font-family);
      color: #ffffff6a;
      padding: 0;
    }
  }

  .data-field {
    flex: auto;
  }

  .contact-field {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    .name {
      font: 500 24px/1 var(--ion-font-family);
      color: var(--fitnesswhite);
    }

    .contact {
      font: 16px/1 var(--ion-font-family);
      color: var(--gray-400);
    }

    ion-img {
      width: 86px;
    }
  }
}

.content-box {
  background-color: var(--gray-700);
  padding-top: 34px;
  padding-left: 31px;
  padding-right: 31px;
  padding-bottom: 20px;
  border-radius: 8px;
  margin-bottom: 18px;
}

.data-box {
  background-color: var(--gray-700);
  padding-top: 15px;
  padding-bottom: 15px;
  padding-right: 28px;
  padding-left: 28px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__item {
    width: 140px;
  }

  .field-label {
    font: 300 14px/1 var(--ion-font-family);
    color: var(--gray-400);
    padding-top: 4px;
  }
}

.notification-box {
  display: flex;
  flex-direction: column;
  gap: 17px;
}

.d-flex-col {
  display: flex;
  flex-direction: column;
}

.vertical-line {
  border: solid;
  border-width: 1px;
  border-radius: 1px;
  min-height: 32px;
  border-color: var(--main-color);
}

.horizontal-line {
  border: solid;
  border-width: 1px;
  border-radius: 1px;
  min-width: 70%;
  border-color: var(--main-color);
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

.photo {
  width: 94px;
  height: 94px;
}

.btn-wrapper {
  ion-button {
    width: fit-content;
    min-width: 173px;
  }

  align-items: flex-end;
}
</style>
