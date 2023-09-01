import { BodyPart, Workout, WorkoutType } from "@/generated/graphql";
import { CheckboxValueType } from "@/ts/types/checkbox-value";
import { ExerciseType, workoutsStoreTypes } from "@/ts/types/store";
import { defineStore } from "pinia";

export const useDailysItemStore = defineStore("dailys-item", {
  state: (): any => {
    return {
      workoutTitle: "",
      workoutType: null,
      workoutMuscleTypesIds: [],
      workoutDuration: "",
      workoutPrice: null,
      workoutPreview: "",
      workoutPath: "",
      media: [],
      exercises: {},
      workoutMuscleTypes: [],
    };
  },
  actions: {
    setValue(key: string, value: string | number | WorkoutType | BodyPart) {
      this[key] = value;
    },
    setMuscleTypes(payload: string[], option: CheckboxValueType) {
      this.workoutMuscleTypesIds = payload;
      if (option.isChecked)
        this.workoutMuscleTypes = [...this.workoutMuscleTypes, option];
      if (!option.isChecked)
        this.workoutMuscleTypes = [...this.workoutMuscleTypes].filter(
          (i) => i.id !== option.id
        );
    },
    setExercise(payload: any) {
      this.exercises = { ...payload };
    },
    editExercise(payload: any) {
      this.exercises = payload;
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
      if (payload.type) this.workoutType = payload.type;
      if (payload.bodyParts)
        this.workoutMuscleTypesIds = payload.bodyParts as unknown as string[];
      this.workoutDuration = payload?.duration?.toString() || "";
      if (payload.price) this.workoutPrice = payload.price;
      this.workoutPreview = payload.preview || "";
      this.workoutPath = payload.previewUrl || "";
      this.setExercise({
        title: payload.exercises?.title,
        description: payload.exercises?.description || "",
        id: payload.exercises.id,
        videoPath: payload.exercises?.pathUrl,
        path: payload.exercises?.pathUrl,
        videoSize: "",
        videoName: "",
      });
      this.setMedia();
    },
  },
});
