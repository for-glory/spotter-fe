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
    name: EntitiesEnum.CreateDailys,
    path: "/register/create-dailys/:step",
    component: () =>
      import("@/facilities/views/registration/CreateDailys.vue"),
    meta: {
      middleware: [auth],
    },
  },
  {
    name: EntitiesEnum.ProfileEditGym,
    path: "/profile/edit-gym/:id?",
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
  {
    name: EntitiesEnum.FacilityPassList,
    path: "/facilities/pass/list",
    component: () => import("@/facilities/views/pass/List.vue"),
  },
  {
    name: EntitiesEnum.FacilityDropins,
    path: "/facilities/:type/list",
    component: () => import("@/facilities/views/dropins/List.vue"),
  },
  {
    name: EntitiesEnum.FacilityDropinsList,
    path: "/facilities/dropins/dropin-list",
    component: () => import("@/facilities/views/dropins/DropsinList.vue"),
  },
  {
    name: EntitiesEnum.FacilityCreateEvent,
    path: "/facilities/events/create",
    component: () => import("@/facilities/views/CreateEvent.vue"),
  },
  {
    name: EntitiesEnum.ManagersOverview,
    path: "/facilities/managers",
    component: () => import("@/facilities/views/managers/index.vue"),
  },
  {
    name: EntitiesEnum.AddManager,
    path: "/facilities/managers/add-new-manager",
    component: () => import("@/facilities/views/managers/AddManager.vue"),
  },
  {
    name: EntitiesEnum.ManagerProfile,
    path: "/facilities/managers/profile/:id",
    component: () => import("@/facilities/views/managers/ManagerProfile.vue"),
  },
  {
    name: EntitiesEnum.EmploymentType,
    path: "/facilities/employment-type",
    component: () => import("@/facilities/views/EmploymentType.vue"),
  }
];
