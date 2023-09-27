import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "./entities";
import { TabItemNew } from "@/interfaces/TabItemnew";

export const TABS: TabItem[] = [
  {
    name: EntitiesEnum.UserWorkouts,
    label:'Trending'
  },
  {
    name: EntitiesEnum.UserPurchasedWorkouts,
    label:'My Library'
  },
];

export default {};
