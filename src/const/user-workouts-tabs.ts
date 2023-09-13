import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "./entities";
import { TabItemNew } from "@/interfaces/TabItemnew";

export const TABS: TabItemNew[] = [
  {
    name: EntitiesEnum.UserWorkouts,
    label:'Workouts'
    // labelActive: "assets/icon/workout.svg",
    // labelInactive: "assets/icon/workout.svg",
  },
  {
    name: EntitiesEnum.UserPurchasedWorkouts,
    label:'Purchaged'
    // labelActive: "assets/icon/workout.svg",
    // labelInactive: "assets/icon/workout.svg",
  },
];

export default {};
