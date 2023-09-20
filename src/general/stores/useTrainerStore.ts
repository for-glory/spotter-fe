import { defineStore } from "pinia";
import { Trainer, SubscriptionsTierEnum, TrainerTypeEnum } from "@/generated/graphql";
import { TrainerState } from "@/ts/types/trainer";

export const useTrainerStore = defineStore("currentTrainer", {
  state: (): TrainerState => {
    return {
      trainer: {
        id: "",
        first_name: "",
        last_name: "",
        avatarUrl: "",
        tax_id: "",
        email: "",
        address: null,
        currentSubscription: SubscriptionsTierEnum.Basic,
        score: 0,
        reviews_count: 0,
        recommended_count: 0,
        not_recommended_count: 0,
        trainings_count: 0,
        positive_reviews_count: 0,
        negative_reviews_count: 0,
        completed_trainings_count: 0,
        trainer_type: TrainerTypeEnum.Both,
        trainerRates: [],
        created_at: "",
      },
    };
  },
  actions: {
    setTrainer(trainer: Trainer) {
      this.trainer = trainer;
    },
    clearState() {
      this.trainer = {
        id: "",
        first_name: "",
        last_name: "",
        avatarUrl: "",
        tax_id: "",
        email: "",
        address: null,
        currentSubscription: SubscriptionsTierEnum.Basic,
        score: 0,
        reviews_count: 0,
        recommended_count: 0,
        not_recommended_count: 0,
        trainings_count: 0,
        positive_reviews_count: 0,
        negative_reviews_count: 0,
        completed_trainings_count: 0,
        trainer_type: TrainerTypeEnum.Both,
        trainerRates: [],
        created_at: "",
      };
    },
  },
});
