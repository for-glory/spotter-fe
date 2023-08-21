import { RouteRecordRaw } from "vue-router";
import auth from "@/router/middleware/auth";
import { EntitiesEnum } from "@/const/entities";

export const routes: Array<RouteRecordRaw> = [
  {
    name: EntitiesEnum.ChooseFacilityType,
    path: "/register/choose-facility-type",
    component: () =>
      import("@/facilities/views/registration/ChooseFacilityType.vue"),
    meta: {
      middleware: [auth],
      mode: EntitiesEnum.ChooseFacilityType
    },
  },
  {
    name: EntitiesEnum.StartMembership,
    path: "/register/start-membership",
    component: () => import("@/facilities/views/registration/StartMembership.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.SelectMembership,
    path: "/register/select-membership",
    component: () => import("@/facilities/views/registration/SelectMembership.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.CreateFacilityType,
    path: "/register/create-facility-type",
    component: () =>
      import("@/facilities/views/registration/CreateFacilityType.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.EnterCode,
    path: "/register/enter-code",
    component: () => import("@/facilities/views/registration/EnterCode.vue"),
    meta: {
      middleware: [auth],
      mode: EntitiesEnum.EnterCode
    },
  },
  {
    name: EntitiesEnum.SelectExistingFacility,
    path: "/register/select-existing-facility",
    component: () =>
      import("@/facilities/views/registration/SelectExistingFacility.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.FacilityPreview,
    path: "/facility-preview",
    component: () => import("@/facilities/views/FacilityPreview.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.FacilitiesEvents,
    path: "/facilities/events",
    component: () => import("@/general/views/events/Index.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.CreateFacility,
    path: "/register/create-facility",
    component: () =>
      import("@/facilities/views/registration/CreateFacility.vue"),
    meta: {
      middleware: [auth],
      mode: EntitiesEnum.CreateFacility,
    },
  },
  {
    name: EntitiesEnum.RegisterCreateEvent,
    path: "/register/create-event",
    component: () =>
      import("@/facilities/views/registration/CreateEvent.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileEditGym,
    path: "/profile/edit-gym",
    component: () => import("@/facilities/views/EditGym.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.AddNewGym,
    path: "/profile/add-new-gym",
    component: () => import("@/facilities/views/AddNewGym.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.Membership,
    path: "/facilities/membership",
    component: () => import("@/facilities/views/Membership.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ChangeMembership,
    path: "/facilities/change-membership",
    component: () => import("@/facilities/views/ChangeMembership.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileGymLocation,
    path: "/profile/gym-location",
    component: () => import("@/facilities/views/GymLocation.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.Bundle,
    path: "/facilities/bundle/:id(\\d+)",
    component: () => import("@/facilities/views/Bundle.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.TrainingDetails,
    path: "/facilities/training/:id(\\d+)",
    component: () => import("@/facilities/views/Training.vue"),
    meta: {
      middleware: [auth],
    },
  },
];
