import { RouteRecordRaw } from "vue-router";
import auth from "@/router/middleware/auth";
import { EntitiesEnum } from "@/const/entities";

export const routes: Array<RouteRecordRaw> = [
  {
    name: EntitiesEnum.TrainersExtraPersonal,
    path: "/register/extra-personal",
    component: () => import("@/trainers/views/registration/ExtraPersonal.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainersExtraFacilities,
    path: "/register/extra-facilities",
    component: () =>
      import("@/trainers/views/registration/ExtraFacilities.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainerSchedule,
    path: "/trainers/schedule",
    component: () => import("@/trainers/views/schedule/Index.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainerWorkouts,
    path: "/trainers/workouts",
    component: () => import("@/trainers/views/workouts/Index.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainerWorkoutList,
    path: "/trainers/workouts/workout-list",
    component: () => import("@/trainers/views/workouts/WorkoutList.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainerCreateWorkout,
    path: "/trainers/workouts/create-workout",
    component: () => import("@/trainers/views/workouts/Workout.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainerWorkoutTypes,
    path: "/trainers/workouts/types",
    component: () => import("@/trainers/views/workouts/Types.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainerMuscleTypes,
    path: "/trainers/workouts/muscle-types",
    component: () => import("@/trainers/views/workouts/MuscleTypes.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainerCreateExercise,
    path: "/trainers/workouts/create-exercise/:id",
    component: () => import("@/trainers/views/workouts/Exercise.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainerPreviewExercise,
    path: "/trainers/workouts/preview-exercise/:id",
    component: () => import("@/trainers/views/workouts/PreviewExercise.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainerExerciseList,
    path: "/trainers/workouts/exercise-list/:id?",
    component: () => import("@/trainers/views/workouts/ExercisesList.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainerEvents,
    path: "/trainers/events",
    component: () => import("@/general/views/events/Index.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.Training,
    path: "/trainers/schedule/training/:id(\\d+)",
    component: () => import("@/trainers/views/schedule/Training.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainersEventTraining,
    path: "/trainers/schedule/event/:id(\\d+)",
    component: () => import("@/trainers/views/schedule/TrainingEvent.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainerUserProfile,
    path: "/user/profile/:id(\\d+)",
    component: () => import("@/general/views/UserProfile.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ChatList,
    path: "/trainers/schedule/chat",
    component: () => import("@/general/views/chat/List.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainerScheduleCalendar,
    path: "/trainers/schedule/calendar",
    component: () => import("@/trainers/views/schedule/Calendar.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.CreateProfileAccount,
    path: "/trainers/registration/create-event",
    component: () =>
      import("@/trainers/views/registration/CreateProfileAccount.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ChooseGymAccount,
    path: "/trainers/registration/choose-gym",
    component: () =>
      import("@/trainers/views/registration/ChooseGymAccount.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.FreelancerTrainer,
    path: "/register/freelancer-trainer",
    component: () =>
      import("@/trainers/views/registration/FreelancerTrainer.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainersUpcomingTrainings,
    path: "/trainers/schedule/trainings",
    component: () => import("@/trainers/views/schedule/Trainings.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.LocationRate,
    path: "/trainers/registration/location-rate",
    component: () => import("@/trainers/views/registration/LocationRate.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.CreateBothProfileAccount,
    path: "/trainers/registration/create-both-profile",
    component: () =>
      import("@/trainers/views/registration/CreateBothProfileAccount.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileScan,
    path: "/qr/scan",
    component: () => import("@/general/views/qr/Scan.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileMembership,
    path: "/profile/membership",
    component: () => import("@/general/views/profile/Membership.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.SubscriptionPaymentMethod,
    path: "/subscription/:subscriptionId(\\d+)",
    component: () => import("@/general/views/profile/ChoosePaymentMethod.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileWorkingSchedule,
    path: "/profile/working-schedule",
    component: () => import("@/general/views/profile/WorkingSchedule.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.WorkoutPreview,
    path: "/trainers/workouts/exercise/:id(\\d+)",
    component: () => import("@/trainers/views/workouts/ExercisePreview.vue"),
    meta: {
      middleware: [auth],
    },
  },
];
