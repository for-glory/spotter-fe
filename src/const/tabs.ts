import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "@/const/entities";

export const discoverTabs: TabItem[] = [
  {
    name: EntitiesEnum.ActivitiesNearby,
    label: "Nearby",
  },
  {
    name: EntitiesEnum.MyTraining,
    label: "Events",
  },
];
export const scheduleTabs: TabItem[] = [
  {
    name: EntitiesEnum.Trainings,
    label: "Trainings",
  },
  {
    name: EntitiesEnum.Events,
    label: "Events",
  },
];
