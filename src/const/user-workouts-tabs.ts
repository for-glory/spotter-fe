import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "./entities";

export const TABS: TabItem[] = [
  {
    name: EntitiesEnum.UserWorkouts,
    label: "Workouts",
  },
  {
    name: EntitiesEnum.UserPurchasedWorkouts,
    label: "Purchased",
  },
];

export default {};
