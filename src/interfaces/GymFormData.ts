import { CheckboxValueType } from "@/ts/types/checkbox-value";
import { facilityPhoto } from "@/ts/types/store";
import { ChooseAddresModalResult } from "./ChooseAddressModalOption";

export type GymFormData = {
  photos: facilityPhoto[];
  title: string;
  description: string;
  address: ChooseAddresModalResult;
  equipments: CheckboxValueType[];
  amenities: CheckboxValueType[];
};
