import { EntitiesEnum } from "@/const/entities";
import { ReviewTypeEnum } from "@/generated/graphql";

export type TabItemNew= {
  name: EntitiesEnum | ReviewTypeEnum;
  labelActive: string;
  labelInactive:string,
  disabled?: boolean;
};
