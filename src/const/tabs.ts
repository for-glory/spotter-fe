import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "@/const/entities";

export const discoverTabs: TabItem[] = [
  {
    name: EntitiesEnum.ActivitiesNearby,
    // label: "Nearby",
    labelActive: "assets/icon/workout.svg",
    labelInactive: "assets/icon/workout.svg",
  },
  {
    name: EntitiesEnum.MyTraining,
    // label: "Events",
    labelActive: "assets/icon/workout.svg",
    labelInactive: "assets/icon/workout.svg",
  },
];
export const scheduleTabs: TabItem[] = [
  {
    name: EntitiesEnum.Trainings,
    // label: "Trainings",
    labelActive: "assets/icon/workout.svg",
    labelInactive: "assets/icon/workout.svg",
  },
  {
    name: EntitiesEnum.Events,
    // label: "Events",
    labelActive: "assets/icon/workout.svg",
    labelInactive: "assets/icon/workout.svg",
  },
];
