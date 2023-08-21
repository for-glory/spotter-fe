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
      label: "Discover",
      id: "discover",
      icon: "assets/icon/discover.svg",
      category: "/activities",
    },
    {
      name: EntitiesEnum.Facilities,
      label: "Booking",
      icon: "assets/icon/booking.svg",
      isMainButton: true,
      isActive: true,
      category: "/facilities",
    },
    {
      name: EntitiesEnum.UserWorkouts,
      label: "Workout",
      id: "workout",
      icon: "assets/icon/workout.svg",
      category: "/workouts",
    },
    {
      name: EntitiesEnum.Profile,
      label: "Profile",
      icon: "assets/icon/profile.svg",
      category: "/profile",
    },
  ],
  TRAINER: [
    {
      name: EntitiesEnum.TrainerWorkouts,
      label: "Workout",
      icon: "assets/icon/workout.svg",
      category: "/workout",
    },
    {
      name: EntitiesEnum.TrainerEvents,
      label: "Events",
      icon: "assets/icon/events.svg",
      category: "/events",
    },
    {
      name: EntitiesEnum.TrainerSchedule,
      label: "Schedule",
      icon: "assets/icon/calendar.svg",
      isMainButton: true,
      isActive: true,
      category: "/schedule",
    },
    {
      name: EntitiesEnum.ChatList,
      label: "Chats",
      icon: "assets/icon/chat.svg",
      category: "/chat",
    },
    {
      name: EntitiesEnum.Profile,
      label: "Profile",
      icon: "assets/icon/profile.svg",
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
      name: EntitiesEnum.FacilitiesEvents,
      label: "Events",
      icon: "assets/icon/events.svg",
      category: "/events",
    },
    {
      name: EntitiesEnum.FacilityPassList,
      label: "Gym Pass",
      icon: "assets/icon/Pass.svg",
      category: "/facilities/pass/list",
    },
    {
      name: EntitiesEnum.Overview,
      label: "Drop-ins",
      icon: "assets/icon/drop-ins.svg",
      category: "/drop-ins",
    },
    {
      name: EntitiesEnum.Overview,
      label: "Dailys",
      icon: "assets/icon/gym-user-icon.svg",
      category: "/dailys",
    },
    {
      name: EntitiesEnum.Profile,
      label: "Profile",
      icon: "assets/icon/profile.svg",
      category: "/profile",
    },
  ],
};
