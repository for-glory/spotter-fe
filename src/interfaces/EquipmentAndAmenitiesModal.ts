import { CheckboxValueType } from "@/ts/types/checkbox-value";

export type EquipmentAndAmenitiesModalOptions = {
  title?: string;
  equipments?: string[];
  amenities?: string[];
};

export type EquipmentAndAmenitiesModalResult = {
  equipments?: CheckboxValueType[];
  amenities?: CheckboxValueType[];
};
