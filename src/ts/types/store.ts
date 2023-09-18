import {
  BodyPart,
  WorkoutType,
  FacilityItem,
  Workout,
  Event,
  User,
  PaymentGatewayProduct,
  Maybe,
} from "@/generated/graphql";
import { FacilitySearchResult } from "@/interfaces/FacilitySearchResult";
import { PlaceType } from "../enums/user";
import { Dayjs } from "dayjs";
import { CheckboxValueType } from "./checkbox-value";
import { ChooseAddresModalResult } from "@/interfaces/ChooseAddressModalOption";

export interface ExerciseType {
  title: string;
  description?: string;
  videoPath: string;
  previewUrl: string;
  previewPath: string;
  path: string;
  id: string;
  videoSize: string;
  videoName: string;
}

export interface ExercisesType {
  [id: string]: ExerciseType;
}

export interface workoutsStoreTypes {
  workoutTitle: string;
  workoutType: WorkoutType | null;
  workoutMuscleTypes: CheckboxValueType[];
  workoutMuscleTypesIds: string[];
  workoutPreview: string;
  workoutDuration: string;
  workoutPrice: number | null;
  media: ExerciseType[];
  workoutPath: string;
  exercises: ExercisesType;
  [index: string]:
    | string
    | number
    | null
    | WorkoutType
    | BodyPart
    | ExerciseType[]
    | ExercisesType
    | string[]
    | CheckboxValueType[];
}

export interface selectedAddressStoreTypes {
  assignedFacility: FacilitySearchResult | null;
  hourlyRate: number | null;
  remoteHourlyRate: number | null;
  travelRadius: number | null;
  useTrainerLocation: boolean;
  workingInGym: boolean;
  edit?: boolean;
}

export interface newFacilityStoreTypes {
  photos: facilityPhoto[];
  title: string;
  description: string;
  address: ChooseAddresModalResult;
  equipments: CheckboxValueType[];
  amenities: CheckboxValueType[];
}

export interface newEventStoreTypes {
  photos: facilityPhoto[];
  title: string;
  description: string;
  address: ChooseAddresModalResult;
  start_date: number | null;
  end_date: number | null;
  start_time: string;
  end_time: string;
  equipments: CheckboxValueType[];
  amenities: CheckboxValueType[];
  max_participants: number | null;
  price: number | null;
}

export interface facilityPhoto {
  id?: string;
  url: string;
  path?: string;
  pathUrl: string;
}

export interface ProductableTrainer extends User {
  price: number;
  title: string;
  products: Maybe<Maybe<PaymentGatewayProduct>[]>;
}

export type Productable = Event | Workout | FacilityItem | ProductableTrainer;

export interface paymentGatewayProducts {
  date: Dayjs | string;
  paymentTime: Dayjs | string;
  price: number | null | string;
  time: Dayjs | string;
  title: string;
  startDate: string;
  endDate: string;
  facility: FacilitySearchResult | null;
  place: PlaceTypes | null;
  isOpenWaitingModal: boolean;
  productItemId: string;
  purchasable: string;
  [index: string]:
    | string
    | null
    | FacilitySearchResult
    | PlaceTypes
    | number
    | Dayjs
    | boolean;
}

export interface PlaceTypes {
  value: PlaceType;
  text: string;
}

export interface profileStore {
  email: string;
  state: string;
  city: string;
  first_name: string;
  last_name: string;
  avatarUrl: string;
  [index: string]: string;
}
