import { RouteRecordRaw } from "vue-router";
import auth from "@/router/middleware/auth";
import { EntitiesEnum } from "@/const/entities";
import guest from "@/router/middleware/guest";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/auth/login",
  },
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
    path: "/trainers/create-event",
    component: () => import("@/general/views/events/create/Index.vue"),
    meta: {
      middleware: [auth],
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
];
