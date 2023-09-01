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
      media: [],
      exercises: {},
      workoutMuscleTypes: [],
      trainer: {},
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
      // this.setExercise({
      //   title: payload.exercises?.title,
      //   description: payload.exercises?.description || "",
      //   id: payload.exercises.id,
      //   videoPath: payload.exercises?.pathUrl,
      //   path: payload.exercises?.pathUrl,
      //   videoSize: "",
      //   videoName: "",
      // });
      // this.setMedia();
    },
  },
});
