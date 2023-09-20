import { RouteRecordRaw } from "vue-router";
import auth from "@/router/middleware/auth";
import { EntitiesEnum } from "@/const/entities";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/auth/registration-done",
    name: EntitiesEnum.RegistrationDone,
    component: () => import("@/users/views/auth/RegistrationDone.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.Facilities,
    path: "/users/facilities",
    component: () => import("@/users/views/facilities/Index.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.WriteReview,
    path: "/feature/write-review/:id(\\d+)",
    component: () => import("@/users/views/facilities/WriteReview.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.AddReview,
    path: "/feature/add-review/:id(\\d+)",
    component: () => import("@/users/views/facilities/AddReview.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainingReview,
    path: "/users/trainer/:id(\\d+)/write-review",
    component: () => import("@/users/views/training/TrainingReview.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.SendReviewForm,
    path: "/users/trainer/:id(\\d+)/send-review-form",
    component: () => import("@/general/components/forms/SendReviewForm.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.WriteTrainingReview,
    path: "/users/trainer/:id(\\d+)/write-review/send",
    component: () => import("@/users/views/training/AddTrainingReview.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainingReviewSuccessful,
    path: "/users/trainer/write-review/successful",
    component: () =>
      import("@/users/views/training/TrainingReviewSuccessful.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainerDemo,
    path: "/users/trainer-demo",
    component: () => import("@/users/views/trainers/Index.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.FacilityReviews,
    path: "/users/facilities/:id(\\d+)/reviews",
    component: () => import("@/users/views/facilities/Reviews.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.FacilitySubscription,
    path: "/users/facilities/:id(\\d+)/subscriptions",
    component: () => import("@/users/views/facilities/Subscription.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.FacilityDates,
    path: "/users/facility/:id/dates",
    component: () => import("@/users/views/facilities/Dates.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.FacilityOrder,
    path: "/users/facilities/order/:id(\\d+)",
    component: () => import("@/users/views/orders/Details.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainerReviews,
    path: "/users/trainers/:id(\\d+)/reviews",
    component: () => import("@/users/views/trainers/Reviews.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.BookMore,
    path: "/users/trainers/:id(\\d+)/book-more",
    component: () =>
      import("@/users/views/training/TrainingReviewSuccessful.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.BookTrainer,
    path: "/users/trainers/:id(\\d+)/booking",
    component: () => import("@/users/views/booking/Trainer.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ConfirmOrder,
    path: "/users/trainers/:id(\\d+)/order",
    component: () => import("@/users/views/trainers/Order.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ChoosePlace,
    path: "/users/trainers/choose-place/:id(\\d+)",
    component: () => import("@/users/views/trainers/ChoosePlace.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ChooseGym,
    path: "/users/trainers/choose-gym",
    component: () => import("@/users/views/trainers/ChooseFacility.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.PaymentsMethods,
    path: "/users/orders/:orderId(\\d+)/payment-method",
    component: () => import("@/users/views/orders/ChoosePaymentMethod.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.PaymentSuccess,
    path: "/users/order/:id/success",
    component: () => import("@/users/views/orders/PaymentSuccessfull.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.Trainer,
    path: "/users/trainers/:id(\\d+)",
    component: () => import("@/users/views/trainers/Detail.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.Facility,
    path: "/users/facilities/:id(\\d+)",
    component: () => import("@/users/views/facilities/Details.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.Dashboard,
    path: "/users/dashboard",
    component: () => import("@/users/views/dashboards/Index.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.DashboardEvents,
    path: "/users/dashboard/events",
    component: () => import("@/users/views/dashboards/Events.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.DashboardCalendar,
    path: "/users/dashboard/calendar",
    component: () => import("@/users/views/dashboards/Calendar.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ActivitiesNearby,
    path: "/users/activities",
    component: () => import("@/users/views/activities/Index.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.EventsDetailed,
    path: "/users/activites/event/:id(\\d+)",
    component: () => import("@/general/views/events/Details.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.EventOrder,
    path: "/users/activites/order/:id(\\d+)",
    component: () => import("@/general/views/events/Order.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.UserWorkouts,
    path: "/users/workouts",
    component: () => import("@/users/views/workouts/Index.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.UserExercisesList,
    path: "/users/workouts/exercises-list/:id(\\d+)",
    component: () => import("@/users/views/workouts/ExercisesList.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.UserPreviewExercise,
    path: "/user/workouts/preview-exercise/:id",
    component: () => import("@/users/views/workouts/PreviewExercise.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.UserPurchasedWorkouts,
    path: "/users/workouts/purchased",
    component: () => import("@/users/views/workouts/Purchased.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.NearbyGym,
    path: "/users/activities/:id(\\d+)",
    component: () => import("@/users/views/activities/Detail.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.Workouts,
    path: "/users/activities/recommended-workouts",
    component: () => import("@/users/views/activities/Workouts.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.WorkoutOrder,
    path: "/users/workouts/order/:id(\\d+)",
    component: () => import("@/users/views/workouts/Order.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.UserWorkout,
    path: "/users/workouts/:id(\\d+)",
    component: () => import("@/users/views/workouts/Preview.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.UserWorkoutPayment,
    path: "/users/workouts/:id(\\d+)/purchase",
    component: () => import("@/users/views/workouts/Payment.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.UserWorkoutList,
    path: "/users/workouts/workout-list",
    component: () => import("@/users/views/workouts/WorkoutList.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.GymsNearby,
    path: "/users/activities/gyms-nearby",
    component: () => import("@/users/views/activities/GymsNearby.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainersNearby,
    path: "/users/activities/trainers-nearby",
    component: () => import("@/users/views/activities/TrainersNearby.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.BookedTraining,
    path: "/users/training/:id(\\d+)",
    component: () => import("@/users/views/training/Index.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: 'DISCOVER',
    path: "/users/discover",
    component: () => import("@/users/views/discover/Index.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: 'Events_detail',
    path: "/users/discover/event_detail",
    component: () => import("@/users/views/discover/event_detail.vue"),
    meta: {
      middleware: [auth],
    },
  },

  {
    name: 'Gym_detail',
    path: "/users/discover/gym_detail",
    component: () => import("@/users/views/discover/gym_detail.vue"),
    meta: {
      middleware: [auth],
    },
  },
];
