import { NavigationItem } from "@/interfaces/NavigationItem";
import { EntitiesEnum } from "@/const/entities";

type NavigationMenu = Record<string, NavigationItem[]>;

export const navigationMenu: NavigationMenu = {
  USER: [
    {
      name: EntitiesEnum.Dashboard,
      label: "Dashboard",
      icon: "assets/icon/dashboard.svg",
      category: "/dashboard",
    },
    {
      name: EntitiesEnum.ActivitiesNearby,
      label: "Dailys",
      id: "dailys",
      icon: "assets/icon/youtube.svg",
      category: "/activities",
    },
    {
      name: EntitiesEnum.Profile,
      label: "Trainers",
      icon: "assets/icon/trainers.svg",
      category: "/profile",
    },
    {
      // name: EntitiesEnum.Facilities,
      // label: "Booking",
      // icon: "assets/icon/Trainer.png",
      // // isMainButton: true,
      // // isActive: true,
      // category: "/facilities",
      name: EntitiesEnum.Discover,
      label: "Discover",
      id: "discover",
      icon: "assets/icon/discover.svg",
      category: "/discover",
    },
    {
      name: EntitiesEnum.UserWorkouts,
      label: "Gyms",
      id: "workout",
      icon: "assets/icon/booking.svg",
      category: "/workouts",
    },
  ],
  TRAINER: [
    {
      name: EntitiesEnum.Overview,
      label: "Overview",
      icon: "assets/icon/overview.svg",
      category: "/overview",
    },
    {
      name: EntitiesEnum.WorkoutList,
      label: "Dailys",
      icon: "assets/icon/daily.svg",
      category: "/dailys",
    },
    {
      name: EntitiesEnum.TrainerSchedule,
      label: "Bookings",
      icon: "assets/icon/calendar.svg",
      // isMainButton: true,
      // isActive: true,
      category: "/schedule",
    },
    {
      name: EntitiesEnum.TrainerEvents,
      label: "Events",
      icon: "assets/icon/events.svg",
      category: "/events",
    },
    {
      name: EntitiesEnum.Profile,
      label: "Settings",
      icon: "assets/icon/Setting.svg",
      category: "/profile",
    },
  ],
  FACILITY: [
    {
      name: EntitiesEnum.Overview,
      label: "Overview",
      icon: "assets/icon/dashboard.svg",
      category: "/overview",
    },
    {
      name: EntitiesEnum.WorkoutList,
      label: "Dailys",
      icon: "assets/icon/daily.svg",
      category: "/dailys",
    },
    {
      name: EntitiesEnum.FacilitiesEvents,
      label: "Events",
      icon: "assets/icon/events.svg",
      category: "/events",
    },
    {
      name: EntitiesEnum.FacilityDropins,
      label: "Drop-ins",
      icon: "assets/icon/drop-ins.svg",
      category: "/facilities/dropins",
    },
    {
      name: EntitiesEnum.FacilityPassList,
      label: "Passes",
      icon: "assets/icon/gym-user-icon.svg",
      category: "/facilities/pass",
    },
    // {
    //   name: EntitiesEnum.Profile,
    //   label: "Profile",
    //   icon: "assets/icon/Setting.svg",
    //   category: "/profile",
    // },
  ],
};
