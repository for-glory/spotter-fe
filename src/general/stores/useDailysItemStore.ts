import { BodyPart, Workout, WorkoutType } from "@/generated/graphql";
import { CheckboxValueType } from "@/ts/types/checkbox-value";
import { ExerciseType, workoutsStoreTypes } from "@/ts/types/store";
import { defineStore } from "pinia";

export const useDailysItemStore = defineStore("dailys-item", {
  state: (): any => {
    return {
      workoutTitle: "",
      workoutDuration: "",
      workoutPreview: "",
      workoutPath: "",
      workoutType: "",
      media: [],
      exercises: {},
      workoutMuscleTypes: [],
      trainer: '',
      total_revenue: 0,
      recommended_count: 0,
      reviews_count: 0,
    };
  },
  actions: {
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
    },
    setWorkout(payload: any) {
      this.exercises = {};
      this.workoutTitle = payload.title || "";
      this.workoutDuration = payload?.duration?.toString() || "";
      this.workoutPreview = payload.preview || "";
      this.workoutPath = payload.previewUrl || "";
      this.trainer = payload.trainer;
      this.workoutType = payload.type;
      this.total_revenue = payload.total_revenue;
      this.recommended_count = payload.recommended_count;
      this.reviews_count = payload.reviews_count;
      this.setExercise(payload.exercise);
    },
  },
});
