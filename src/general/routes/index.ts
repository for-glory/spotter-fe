import { RouteRecordRaw } from "vue-router";
import auth from "@/router/middleware/auth";
import gymOwnerSubscription from "@/router/middleware/gymOwnerSubscription";
import gymOwnerRole from "@/router/middleware/gymOwnerRole";
import { EntitiesEnum } from "@/const/entities";
import guest from "@/router/middleware/guest";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/auth/",
    component: () => import("@/general/views/Authentication.vue"),
    redirect: { name: EntitiesEnum.Login },
    children: [
      {
        name: EntitiesEnum.Login,
        path: "login",
        component: () => import("@/general/views/Login.vue"),
        meta: { middleware: [guest], mode: EntitiesEnum.Login },
      },
      {
        name: EntitiesEnum.Register,
        path: "register",
        component: () => import("@/general/views/Register.vue"),
        meta: { middleware: [guest], mode: EntitiesEnum.Register },
      },
      {
        name: EntitiesEnum.CheckEmail,
        path: "email-check",
        component: () => import("@/general/views/CheckEmail.vue"),
        meta: { mode: EntitiesEnum.CheckEmail },
      },
      {
        name: EntitiesEnum.ForgotPassword,
        path: "forgot-password",
        component: () => import("@/general/views/ForgotPassword.vue"),
      },
      {
        name: EntitiesEnum.ForgotPasswordCheckEmail,
        path: "forgot-password-check-email",
        component: () => import("@/general/views/ForgotPasswordCheckEmail.vue"),
      },
      {
        name: EntitiesEnum.UpdateEmail,
        path: "update-email",
        component: () => import("@/general/views/UpdateEmail.vue"),
      },
    ],
  },
  {
    name: EntitiesEnum.ManagerPasswordSet,
    path: "/manager-password/:email",
    component: () => import("@/general/views/ManagerPasswordSet.vue"),
    meta: { mode: EntitiesEnum.CheckEmail },
  },
  {
    name: EntitiesEnum.PasswordReset,
    path: "/password-reset/:id",
    component: () => import("@/general/views/PasswordReset.vue"),
  },
  {
    name: EntitiesEnum.VerifyEmail,
    path: "/email-verify",
    component: () => import("@/general/views/EmailConfirmationPage.vue"),
    meta: { mode: EntitiesEnum.Register },
  },
  {
    name: EntitiesEnum.SelectRole,
    path: "/select-role",
    component: () => import("@/general/views/SelectRole.vue"),
    meta: {
      middleware: [auth],
      mode: EntitiesEnum.SelectRole,
    },
  },
  {
    name: EntitiesEnum.SuccessMembership,
    path: "/select-membership-success",
    component: () => import("@/general/views/SuccessPage.vue"),
    meta: {
      middleware: [auth],
      mode: EntitiesEnum.SuccessMembership,
    },
  },
  {
    name: EntitiesEnum.SuccessStripeConnect,
    path: "/stripe-connect-success",
    component: () => import("@/general/views/SuccessConnectPage.vue"),
    meta: {
      middleware: [auth],
      mode: EntitiesEnum.SuccessStripeConnect,
    },
  },
  {
    name: EntitiesEnum.Quizz,
    path: "/quizz",
    component: () => import("@/general/views/Quizz.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.Profile,
    path: "/profile",
    component: () => import("@/general/views/profile/Index.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileEdit,
    path: "/profile/edit",
    component: () => import("@/general/views/profile/Edit.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileEditName,
    path: "/profile/edit",
    component: () => import("@/general/views/profile/UserName.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileGettingPaid,
    path: "/profile/getting-paid",
    component: () => import("@/general/views/profile/GettingPaid.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileEmail,
    path: "/profile/edit/email",
    component: () => import("@/general/views/profile/Email.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfilePassword,
    path: "/profile/edit/password",
    component: () => import("@/general/views/profile/Password.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileLanguages,
    path: "/profile/edit/language",
    component: () => import("@/general/views/profile/Languages.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileAppMode,
    path: "/profile/edit/app-mode",
    component: () => import("@/general/views/profile/AppMode.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfilePreferences,
    path: "/profile/edit/preferences",
    component: () => import("@/general/views/profile/Preferences.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileNotifications,
    path: "/profile/edit/notifications",
    component: () => import("@/general/views/profile/Notifications.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileAddSocialLink,
    path: "/profile/edit/add-social-link",
    component: () => import("@/general/views/profile/AddSocialLink.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileLocation,
    path: "/profile/edit/location",
    component: () => import("@/general/views/profile/Location.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileIdentityVerification,
    path: "/profile/identity-verification",
    component: () => import("@/general/views/profile/IdentityVerification.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.VerifyPersonalInfo,
    path: "/profile/verify-personal",
    component: () => import("@/general/views/profile/VerifyPersonalInfo.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfilePaymentMethods,
    path: "/profile/payment-methods",
    component: () => import("@/general/views/profile/PaymentMethods.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileCalendar,
    path: "/profile/calendar",
    component: () => import("@/general/views/profile/Calendar.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfilePronounce,
    path: "/profile/pronounce",
    component: () => import("@/general/views/profile/Pronounce.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileEditTrainer,
    path: "/profile/edit-trainer",
    component: () => import("@/general/views/profile/EditTrainer.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileChoosePlace,
    path: "/profile/choose-place",
    component: () => import("@/general/views/profile/ChoosePlace.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileOrderConfirmation,
    path: "/profile/order-confirmation",
    component: () => import("@/general/views/profile/OrderConfirmation.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileAddCard,
    path: "/profile/add-card",
    component: () => import("@/general/views/profile/AddCard.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileBookingHistory,
    path: "/profile/booking-history",
    component: () => import("@/general/views/profile/BookingHistory.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ChatList,
    path: "/chat",
    component: () => import("@/general/views/chat/List.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ChatPersonal,
    path: "/chat/:id(\\d+)",
    component: () => import("@/general/views/chat/Personal.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.Favourites,
    path: "/favourites",
    component: () => import("@/general/views/Favourites.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.MyTraining,
    path: "/users/activities/events",
    component: () => import("@/general/views/events/MyTraining.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.EmptyState,
    path: "/trainers/events",
    component: () => import("@/general/views/events/Index.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.EditEvent,
    path: "/trainers/events/:id(\\d+)/edit",
    component: () => import("@/general/views/events/edit/Index.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.CreateEvent,
    path: "/event/create-event",
    component: () => import("@/general/views/events/create/Index.vue"),
    meta: {
      middleware: [auth],
      mode: EntitiesEnum.CreateEvent,
    },
  },
  {
    name: EntitiesEnum.WorkoutList,
    path: "/dailys/list",
    component: () => import("@/general/views/workout/index.vue"),
    meta: {
      middleware: [auth],
      mode: EntitiesEnum.WorkoutList,
    },
  },
  {
    name: EntitiesEnum.WorkoutView,
    path: "/dailys/:id",
    component: () => import("@/general/views/workout/View.vue"),
    meta: {
      middleware: [auth],
      mode: EntitiesEnum.WorkoutList,
    },
  },
  {
    name: EntitiesEnum.CreateWorkout,
    path: "/dailys/create-dailys",
    component: () => import("@/general/views/workout/CreateWorkout.vue"),
    meta: {
      middleware: [auth],
      mode: EntitiesEnum.CreateWorkout,
    },
  },
  {
    name: EntitiesEnum.EditWorkout,
    path: "/dailys/edit-workout/:id",
    component: () => import("@/general/views/workout/EditWorkout.vue"),
    meta: {
      middleware: [auth],
      mode: EntitiesEnum.WorkoutList,
    },
  },
  {
    name: EntitiesEnum.WorkoutTypes,
    path: "/workout/types",
    component: () => import("@/general/views/workout/Types.vue"),
    meta: {
      middleware: [auth],
      mode: EntitiesEnum.CreateWorkout,
    },
  },
  {
    name: EntitiesEnum.WorkoutReviews,
    path: "/workout/reviews/:id",
    component: () => import("@/general/views/workout/Reviews.vue"),
    meta: {
      middleware: [auth],
      mode: EntitiesEnum.WorkoutList,
    },
  },
  {
    name: EntitiesEnum.MuscleTypes,
    path: "/workout/muscle-types",
    component: () => import("@/general/views/workout/MuscleTypes.vue"),
    meta: {
      middleware: [auth],
      mode: EntitiesEnum.CreateWorkout,
    },
  },
  {
    name: EntitiesEnum.CreateExercise,
    path: "/workout/create-exercise/:id",
    component: () => import("@/general/views/workout/Exercise.vue"),
    meta: {
      middleware: [auth],
      mode: EntitiesEnum.CreateWorkout,
    },
  },
  {
    name: EntitiesEnum.Session,
    path: "/session/:id(\\d+)",
    component: () => import("@/general/views/Session.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    path: "/about-us",
    component: () => import("@/general/views/AboutUs.vue"),
    meta: {
      title: "About us",
      description: "About us",
    },
  },
  {
    path: "/contact-us",
    component: () => import("@/general/views/ContactUs.vue"),
    meta: {
      title: "Contact us",
      description: "Contact us",
    },
  },
  {
    path: "/terms-of-use",
    component: () => import("@/general/views/TermsOfUse.vue"),
    meta: {
      title: "Terms of use",
      description: "Terms of use",
    },
  },
  {
    path: "/how-it-works",
    component: () => import("@/general/views/HowItWorks.vue"),
    meta: {
      title: "How it works",
      description: "How it works",
    },
  },
  {
    path: "/faqs",
    component: () => import("@/general/views/Faqs.vue"),
    meta: {
      title: "FAQs",
      description: "FAQs",
    },
  },
  {
    name: EntitiesEnum.ChooseLocation,
    path: "/choose-location/:type?",
    component: () => import("@/general/views/ChooseLocation.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.Overview,
    path: "/overview",
    component: () => import("@/general/views/Overview.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ViewPassAndDropins,
    path: "/products/:type",
    component: () => import("@/general/views/ItemsList.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.CreateFacilitySuccess,
    path: "/facility-profile-success",
    component: () => import("@/general/views/SuccessFacilityProfile.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    path: "/dashboard/",
    component: () => import("@/general/views/dashboard/Index.vue"),
    redirect: { name: EntitiesEnum.DashboardOverview },
    meta: {
      middleware: [auth],
    },
    children: [
      {
        name: EntitiesEnum.DashboardOverview,
        path: "overview",
        component: () => import("@/general/views/dashboard/Overview.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardUserOverview,
        path: "user-overview",
        component: () => import("@/general/views/dashboard/UserOverview.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardUserCalendar,
        path: "web-user-calendar/:type?/:id?",
        component: () => import("@/general/views/dashboard/WebUserCalendar.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardDiscover,
        path: "discover",
        component: () => import("@/general/views/dashboard/Discover.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardBookings,
        path: "bookings",
        component: () => import("@/general/views/dashboard/bookings/index.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      { 
        name: EntitiesEnum.DashboardBookingsHistory,
        path: "booking-history",
        component: () => import("@/users/views/booking/BookingHistory.vue")
      },
      {
        name: EntitiesEnum.DashboardTrainings,
        path: "trainings",
        component: () =>
          import("@/general/views/dashboard/bookings/upcoming-trainings.vue"),
      },
      {
        name: EntitiesEnum.DashboardUserProfile,
        path: "user/profile/:id(\\d+)",
        component: () =>
          import("@/general/views/dashboard/bookings/user-profile.vue"),
      },
      {
        name:EntitiesEnum.UserDashboardCalendar,
        path: "user-calendar",
        component: () => import("@/users/views/dashboards/UserCalendar.vue"),
      },
      {
        name: EntitiesEnum.DashboardTrainingsCalendar,
        path: "trainings-calendar/:date?/:id(\\d+)?",
        component: () =>
          import("@/general/views/dashboard/bookings/trainings-calendar.vue"),
      },
      {
        name: EntitiesEnum.Upcoming,
        path: "/upcoming/:type",
        component: () => import("@/general/views/dashboard/Upcoming.vue"),
      },
      {
        name: EntitiesEnum.DashboardEvent,
        path: "event",
        component: () => import("@/general/views/dashboard/events/Index.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardEventDetail,
        path: "event/:id(\\d+)",
        component: () => import("@/general/views/dashboard/events/Details.vue"),
        meta: {
          middleware: [auth],
        },
      },
      {
        name: EntitiesEnum.DashboardCreateEvent,
        path: "create-event",
        component: () =>
          import("@/general/views/dashboard/events/CreateEvent.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardEditEvent,
        path: "event/:id(\\d+)/edit",
        component: () => import("@/general/views/dashboard/events/EditEvent.vue"),
        meta: {
          middleware: [auth],
        },
      },
      {
        name: EntitiesEnum.DashboardMembership,
        path: "membership",
        component: () =>
          import("@/general/views/dashboard/membership/Index.vue"),
      },
      {
        name: EntitiesEnum.DashboardStartMembership,
        path: "membership/start",
        component: () =>
          import("@/general/views/dashboard/membership/StartMembership.vue"),
      },
      {
        name: EntitiesEnum.DashboardSelectMembership,
        path: "membership/select",
        component: () =>
          import("@/general/views/dashboard/membership/SelectMembership.vue"),
      },
      {
        name: EntitiesEnum.DashboardWorkout,
        path: "workout",
        component: () => import("@/general/views/dashboard/workout/Index.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardClientDailys,
        path: "dailys",
        component: () => import("@/general/views/dashboard/workout/user/Index.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardClientPurchasedDailys,
        path: "purchased-dailys",
        component: () => import("@/general/views/dashboard/workout/user/Purchased.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardCreateWorkout,
        path: "workout/create",
        component: () =>
          import("@/general/views/dashboard/workout/CreateWorkout.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardEditWorkout,
        path: "workout/edit/:id",
        component: () =>
          import("@/general/views/dashboard/workout/EditWorkout.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardWorkoutTypes,
        path: "workout/type",
        component: () => import("@/general/views/dashboard/workout/Types.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardMuscleTypes,
        path: "workout/muscle-type",
        component: () =>
          import("@/general/views/dashboard/workout/MuscleTypes.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardCreateExercise,
        path: "workout/create/exercise",
        component: () =>
          import("@/general/views/dashboard/workout/Exercise.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardExerciseList,
        path: "/workout/exercise-list/:id?",
        component: () =>
          import("@/general/views/dashboard/workout/ExercisesList.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardGettingPaid,
        path: "getting-paid",
        component: () => import("@/general/views/dashboard/GettingPaid.vue"),
        meta: {
          middleware: [gymOwnerSubscription, gymOwnerRole],
        },
      },
      {
        name: EntitiesEnum.Gyms,
        path: "gyms/:type",
        component: () => import("@/users/views/gyms/Index.vue"),
        meta: {
          middleware: [auth],
        },
      },
      {
        name: EntitiesEnum.Trainers,
        path: "trainers/:type?",
        component: () => import("@/users/views/dashboard-trainers/Index.vue"),
        meta: {
          middleware: [auth],
        },
      },
      {
        name: EntitiesEnum.TrainerPreview,
        path: "trainers/:id(\\d+)",
        component: () => import("@/users/views/dashboard-trainers/TrainerPreview.vue"),
        meta: {
          middleware: [auth],
        },
      },
      {
        name: EntitiesEnum.DashboardTrainerReviews,
        path: "trainers/:id(\\d+)/reviews",
        component: () => import("@/users/views/dashboard-trainers/TrainerReviews.vue"),
        meta: {
          middleware: [auth],
        },
      },
      {
        name: EntitiesEnum.TrainerBooking,
        path: "trainers/:id(\\d+)/booking",
        component: () => import("@/users/views/dashboard-trainers/TrainerBooking.vue"),
        meta: {
          middleware: [auth],
        },
      },
      {
        name: EntitiesEnum.GymDetails,
        path: "gym-preview/:id",
        component: () => import("@/users/views/gyms/GymPreview.vue"),
        meta: {
          middleware: [auth],
        },
      },
      {
        name: EntitiesEnum.GymOrderCalendar,
        path: ":id/:facility/order-calendar",
        component: () => import("@/users/views/gyms/OrderCalendar.vue"),
        meta: {
          middleware: [auth],
        },
      },
      {
        name: EntitiesEnum.GymPaymentMethod,
        path: ":id/payment-method",
        component: () => import("@/users/views/gyms/PaymentMethods.vue"),
        meta: {
          middleware: [auth],
        },
      },
      {
        name: EntitiesEnum.GymReviews,
        path: ":id/gym-reviews",
        component: () => import("@/users/views/gyms/Reviews.vue"),
        meta: {
          middleware: [auth],
        },
      },
      {
        name: EntitiesEnum.DashboardSettings,
        path: "settings",
        component: () => import("@/general/views/dashboard/settings/Index.vue"),
        meta: {
          middleware: [gymOwnerSubscription, gymOwnerRole],
        },
      },
      {
        name: EntitiesEnum.DashboardUserProfilePreview,
        path: "profile-preview",
        component: () => import("@/general/views/dashboard/settings/UserProfile.vue"),
        meta: {
          middleware: [gymOwnerSubscription, gymOwnerRole],
        },
      },
      {
        name: EntitiesEnum.DashboardPassList,
        path: "pass/list",
        component: () => import("@/general/views/dashboard/pass/List.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardPassViewList,
        path: "pass/listpasses",
        component: () => import("@/general/views/dashboard/pass/ListPases.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardDropinsPassDetail,
        path: "pass-dropin/details/:id?",
        component: () => import("@/general/views/dashboard/PassDropinsDetails.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardDropinsPassesDetail,
        path: "pass-dropin/purchase/:id?",
        component: () => import("@/general/views/dashboard/pass/PassesDetail.vue"),
        meta: {
          middleware: [auth],
        },
      },
      {
        name: EntitiesEnum.DashboardPassCreate,
        path: "pass/create-pass/:id?",
        component: () =>
          import("@/general/views/dashboard/pass/CreatePass.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardPassProfile,
        path: "pass/profile",
        component: () => import("@/general/views/dashboard/pass/Profile.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardDropinList,
        path: "dropin/list",
        component: () => import("@/general/views/dashboard/dropins/List.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardDropinViewList,
        path: "dropin/listdropin",
        component: () => import("@/general/views/dashboard/dropins/ListDropin.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardDropinCreate,
        path: "dropin/create-drop-in/:id?",
        component: () =>
          import("@/general/views/dashboard/dropins/CreateDropin.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardDropinProfile,
        path: "pass/profile",
        component: () => import("@/general/views/dashboard/pass/Profile.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardMessage,
        path: "message/:id?",
        component: () => import("@/general/views/dashboard/message/Index.vue"),
        meta: {
          middleware: [gymOwnerSubscription],
        },
      },
      {
        name: EntitiesEnum.DashboardGymManager,
        path: "gym-manager",
        component: () =>
          import("@/general/views/dashboard/gymManager/Index.vue"),
        meta: {
          middleware: [gymOwnerSubscription, gymOwnerRole],
        },
      },
      {
        name: EntitiesEnum.DashboardGymManagerProfile,
        path: "manager-profile/:id(\\d+)",
        component: () =>
          import("@/general/views/dashboard/gymManager/ManagerProfile.vue"),
        meta: {
          middleware: [gymOwnerSubscription, gymOwnerRole],
        },
      },
      {
        name: EntitiesEnum.DashboardManageGyms,
        path: "gyms/:id",
        component: () => import("@/general/views/dashboard/gyms/Index.vue"),
        meta: {
          middleware: [gymOwnerSubscription, gymOwnerRole],
        },
      },
      {
        name: EntitiesEnum.DashboardListGyms,
        path: "list-gyms",
        component: () => import("@/general/views/dashboard/gyms/List.vue"),
        meta: {
          middleware: [gymOwnerSubscription, gymOwnerRole],
        },
      },
      {
        name: EntitiesEnum.CreateItem,
        path: "/products/create/:type",
        component: () => import("@/general/views/CreateItem.vue"),
      },
      {
        name: EntitiesEnum.DashboardGymCreate,
        path: "gyms/create-new-gym",
        component: () =>
          import("@/general/views/dashboard/gyms/CreateFacility.vue"),
        meta: {
          middleware: [gymOwnerRole],
        },
      },
    ],
  },
];
