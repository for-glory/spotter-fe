<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <page-header
        @back="headerBackHandle"
        @skip="headerSkipHandle"
        :skip-btn="isSkipBtnVisible"
        back-btn
      />
    </ion-header>
    <ion-content :fullscreen="true" class="page-content">
      <p v-if="error" class="ion-text-center">Something went wrong...</p>
      <ion-spinner name="lines" v-if="loadingQuizzes" class="spinner" />
      <quizz-item
        v-if="quizzes.length"
        @next="saveQuizzValue($event)"
        :loading="loadingQuizzAnswer"
        :quizz="quizzes[activeQuizzIndex]"
        :key="activeQuizzIndex"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { IonPage, IonHeader, IonContent, IonSpinner } from "@ionic/vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import QuizzItem, {
  IQuizzItem,
  QuizzItemAnswer,
} from "@/general/components/QuizzItem.vue";
import {
  QuizzesDocument,
  QuizzesQueryVariables,
  QuizzesQuery,
  QuizzStatusEnum,
  QuizzTypesEnum,
  RoleEnum,
  UpdateUserSettingsDocument,
} from "@/generated/graphql";
import { v4 as uuidv4 } from "uuid";

import { useMutation, useQuery } from "@vue/apollo-composable";
import useRoles from "@/hooks/useRole";
import { CreateQuizzAnswerDocument } from "@/graphql/documents/authDocuments";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { dataURItoFile } from "@/utils/fileUtils";
import useId from "@/hooks/useId";
import { setSettings } from "@/hooks/useSettings";
import { ProfileSettings } from "@/ts/enums/user";

const { role } = useRoles();

const {
  mutate: saveAnswer,
  loading: loadingQuizzAnswer,
  onDone: onQuizzAnswerLoaded,
} = useMutation(CreateQuizzAnswerDocument, {
  context: {
    useMultipart: true,
  },
});

const router = useRouter();

const activeQuizzIndex = ref<number>(0);
const quizzesParams: QuizzesQueryVariables = {
  role,
};

const {
  result,
  loading: loadingQuizzes,
  error,
} = useQuery<QuizzesQuery>(QuizzesDocument, quizzesParams);

const quizzes = computed<IQuizzItem[]>(() => result.value?.quizzes?.data ?? []);

const total = computed<number>(
  () => result.value?.quizzes?.paginatorInfo?.total || 0
);

const isSkipBtnVisible = ref<boolean>(
  quizzes.value[activeQuizzIndex.value]?.status === QuizzStatusEnum.Unnecessary
);

const headerBackHandle = (): void => {
  activeQuizzIndex.value
    ? goToQuizz(activeQuizzIndex.value - 1)
    : router.go(-1);
};

const headerSkipHandle = (): void => {
  goToQuizz(activeQuizzIndex.value + 1);
};

const saveQuizzValue = (data: QuizzItemAnswer): void => {
  if (
    quizzes.value[activeQuizzIndex.value].type === QuizzTypesEnum.File &&
    typeof data.value === "string"
  ) {
    const file = dataURItoFile(data.value, uuidv4());
    saveAnswer({
      quizz_id: quizzes.value[activeQuizzIndex.value].id,
      value: file,
    });

    return;
  }
  saveAnswer({
    quizz_id: quizzes.value[activeQuizzIndex.value].id,
    value: Array.isArray(data.value) ? data.value.toString() : data.value,
  });
};

const goToQuizz = (index: number): void => {
  if (index < total.value) {
    activeQuizzIndex.value = index;
  } else {
    const { id } = useId();
    setSettings([{ isQuizzDone: true }]);
    const front_settings = localStorage.getItem(ProfileSettings.UserSettings);
    updateUserSettings({
      id,
      front_settings,
    });
  }
};

const { mutate: updateUserSettings, onDone: settingsUpdated } = useMutation(
  UpdateUserSettingsDocument
);

settingsUpdated(() => {
  if (role === RoleEnum.Trainer) {
    const { id } = useId();
    router.push({
      name: EntitiesEnum.Trainer,
      params: {
        id,
      },
    });
  } else {
    router.push({ name: EntitiesEnum.RegistrationDone });
  }
});

onQuizzAnswerLoaded(() => {
  goToQuizz(activeQuizzIndex.value + 1);
});

watch(
  () => activeQuizzIndex.value,
  () => {
    isSkipBtnVisible.value =
      quizzes.value[activeQuizzIndex.value]?.status ===
      QuizzStatusEnum.Unnecessary;
  }
);
</script>

<style scoped>
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(50vh - 60px) auto 0;
}

.page-content {
  --padding-start: 24px;
  --padding-end: 24px;
}
</style>
