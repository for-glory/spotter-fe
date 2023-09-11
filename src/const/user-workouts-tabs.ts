import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "./entities";

export const TABS: TabItem[] = [
  {
    name: EntitiesEnum.UserWorkouts,
    labelActive: "assets/icon/workout.svg",
    labelInactive: "assets/icon/workout.svg",
  },
  {
    name: EntitiesEnum.UserPurchasedWorkouts,
    labelActive: "assets/icon/workout.svg",
    labelInactive: "assets/icon/workout.svg",
  },
];

export default {};
