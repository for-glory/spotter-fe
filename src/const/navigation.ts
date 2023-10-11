import { NavigationItem } from "@/interfaces/NavigationItem";
import { EntitiesEnum } from "@/const/entities";

type NavigationMenu = Record<string, NavigationItem[]>;

export const navigationMenu: NavigationMenu = {
  USER: [
    {
      name: EntitiesEnum.Dashboard,
      label: "Dashboard",
      icon: "assets/icon/overview.svg",
      category: "/dashboard",
    },
    {
      name: EntitiesEnum.UserWorkouts,
      label: "Dailys",
      id: "dailys",
      icon: "assets/icon/youtube.svg",
      category: "/users/dailys",
    },
    {
      name: EntitiesEnum.Facilities,
      label: "Trainers",
      icon: "assets/icon/trainers.svg",
      category: "/facilities",
      queryParam: EntitiesEnum.Trainers,
      queryKey: "type",
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
      name: EntitiesEnum.Facilities,
      label: "Gyms",
      id: "workout",
      icon: "assets/icon/booking.svg",
      category: "/facilities",
      queryParam: EntitiesEnum.Facilities,
      queryKey: "type"
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
      queryParam: 'dropins'
    },
    {
      name: EntitiesEnum.FacilityDropins,
      label: "Passes",
      icon: "assets/icon/gym-user-icon.svg",
      category: "/facilities/passes",
      queryParam: 'passes'
    },
    // {
    //   name: EntitiesEnum.Profile,
    //   label: "Profile",
    //   icon: "assets/icon/Setting.svg",
    //   category: "/profile",
    // },
  ],
};
