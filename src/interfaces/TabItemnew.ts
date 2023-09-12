import { EntitiesEnum } from "@/const/entities";
import { ReviewTypeEnum } from "@/generated/graphql";

export type TabItemNew= {
  name: EntitiesEnum | ReviewTypeEnum;
  label:string;
  disabled?: boolean;
};
