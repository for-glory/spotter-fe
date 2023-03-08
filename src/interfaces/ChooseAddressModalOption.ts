import { EntitiesEnum } from "@/const/entities";
import { City, State } from "@/generated/graphql";
import { PositionLatLng } from "@/ts/types/map";
import { NativeGeocoderResult } from "@awesome-cordova-plugins/native-geocoder";

export type ChooseAddresModalOptions = {
  title?: string;
  selected?: string | PositionLatLng;
  options: ChooseAddressModalOptionInterface[];
  type?: EntitiesEnum;
  state?: State;
  city?: City;
};

export type ChooseAddressModalOptionInterface = {
  id: string;
  name: string;
  disabled?: boolean;
};

export type ChooseAddresModalResult = {
  state: State | null;
  city: City | null;
  address: NativeGeocoderResult | null;
};
