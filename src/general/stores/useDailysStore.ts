import { BodyPart, Workout, WorkoutType } from "@/generated/graphql";
import { CheckboxValueType } from "@/ts/types/checkbox-value";
import { ExerciseType, workoutsStoreTypes } from "@/ts/types/store";
import { defineStore } from "pinia";

export const useDailysStore = defineStore("dailys", {
  state: (): any => {
    return {
      workoutTitle: "",
      workoutType: null,
      workoutMuscleTypesIds: [],
      workoutDuration: "",
      workoutPrice: null,
      workoutPreview: "", //thumbnail path
      workoutPath: "", //thumbnail path without cdn
      path: "", //video path without cdn
      media: [],
      exercises: {},
      workoutMuscleTypes: [],
      trainer: '',
      totalRevenue: 0,
      recommendedCount: 0,
      reviewsCount: 0,
      updates: {}
    };
  },
  actions: {
    setMuscleTypes(payload: string[], option: CheckboxValueType) {
      this.workoutMuscleTypesIds = payload;
      if (option.isChecked)
        this.workoutMuscleTypes = [...this.workoutMuscleTypes, option];
      if (!option.isChecked)
        this.workoutMuscleTypes = [...this.workoutMuscleTypes].filter(
          (i) => i.id !== option.id
        );
    },
    setValue(key: string, value: string | number | WorkoutType | BodyPart) {
      this[key] = value;
    },
    setExercise(payload: any) {
      this.exercises = { ...payload };
    },
    setMedia() {
      this.media = Object.values(this.exercises);
    },
    clearState() {
      this.workoutTitle = "";
      this.workoutType = null;
      this.workoutMuscleTypesIds = [];
      this.workoutDuration = "";
      this.workoutPrice = null;
      this.workoutPreview = "";
      this.workoutPath = "";
      this.media = [];
      this.exercises = {};
      this.workoutMuscleTypes = [];
      this.trainer = '';
      this.totalRevenue = 0;
      this.recommendedCount = 0;
      this.reviewsCount = 0;
    },
    setWorkout(payload: any) {
      this.exercises = {};
      this.workoutTitle = payload.title || "";
      if (payload.type) this.workoutType = payload.type;
      if (payload.bodyParts)
        this.workoutMuscleTypesIds = payload.bodyParts as unknown as string[];
      this.workoutDuration = payload.duration?.toString() || "";
      if (payload.price) this.workoutPrice = payload.price;
      this.setExercise(payload.exercise);
      this.trainer = payload.trainer,
      this.totalRevenue = payload.totalRevenue,
      this.recommendedCount = payload.recommendedCount,
      this.reviewsCount = payload.reviewsCount,
      this.setMedia();
    },
  },
});
