import gql from "graphql-tag";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
  DateTimeUtc: any;
  JSON: any;
  Mixed: any;
  StringOrUpload: any;
  Upload: any;
};

export type Activity = Facility | User | Workout;

export type AddFacilityItemToCartInput = {
  cart_id?: InputMaybe<Scalars["ID"]>;
  facility_item_id: Scalars["ID"];
  start_date: Scalars["DateTimeUtc"];
};

export type AddToCartInput = {
  cart_id?: InputMaybe<Scalars["ID"]>;
  purchasable: AddToCartPurchasableEnum;
  purchasable_id: Scalars["ID"];
};

/** AddToCartPurchasableEnum Variants */
export enum AddToCartPurchasableEnum {
  /** EVENT */
  Event = "EVENT",
  /** WORKOUT */
  Workout = "WORKOUT",
}

export type AddTrainingToCartInput = {
  available_user_gym_id?: InputMaybe<Scalars["ID"]>;
  cart_id?: InputMaybe<Scalars["ID"]>;
  end_date: Scalars["DateTimeUtc"];
  start_date: Scalars["DateTimeUtc"];
  trainer_id: Scalars["ID"];
  training_option: AvailableTrainingOptionsEnum;
};

export type Address = {
  __typename?: "Address";
  city?: Maybe<City>;
  extra?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  lat?: Maybe<Scalars["Float"]>;
  lng?: Maybe<Scalars["Float"]>;
  street?: Maybe<Scalars["String"]>;

};

export type AddressInput = {
  city_id: Scalars["ID"];
  extra?: InputMaybe<Scalars["String"]>;
  lat: Scalars["Float"];
  lng: Scalars["Float"];
  street?: InputMaybe<Scalars["String"]>;

};

export type Amenity = {
  __typename?: "Amenity";
  icon?: Maybe<Scalars["String"]>;
  iconUrl?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
};

/** A paginated list of Amenity items. */
export type AmenityPaginator = {
  __typename?: "AmenityPaginator";
  /** A list of Amenity items. */
  data: Array<Amenity>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type AppleGooglePaymentIntent = {
  __typename?: "AppleGooglePaymentIntent";
  customerId: Scalars["String"];
  paymentIntent: Scalars["String"];
};

export type AttachToFacilityInput = {
  facility_id: Scalars["ID"];
  registration_code: Scalars["String"];
};

export type AuthPayload = {
  __typename?: "AuthPayload";
  access_token?: Maybe<Scalars["String"]>;
  expires_in?: Maybe<Scalars["Int"]>;
  refresh_token?: Maybe<Scalars["String"]>;
  token_type?: Maybe<Scalars["String"]>;
  user?: Maybe<User>;
};

export type Availability = {
  __typename?: "Availability";
  events?: Maybe<Array<Event>>;
  hours?: Maybe<Array<AvailabilityHours>>;
  trainings?: Maybe<Array<Training>>;
};

export enum AvailabilityExceptionsTypeEnum {
  Event = "EVENT",
  NotAvailable = "NOT_AVAILABLE",
  Training = "TRAINING",
}

export type AvailabilityHours = {
  __typename?: "AvailabilityHours";
  from: Scalars["DateTime"];
  to: Scalars["DateTime"];
};

/** AvailableTrainingOptionsEnum Variants */
export enum AvailableTrainingOptionsEnum {
  /** IN_TRAINER_GYM */
  InTrainerGym = "IN_TRAINER_GYM",
  /** IN_USER_GYM */
  InUserGym = "IN_USER_GYM",
  /** TRAINER_REMOTE */
  TrainerRemote = "TRAINER_REMOTE",
}

export type BodyPart = {
  __typename?: "BodyPart";
  created_at: Scalars["DateTime"];
  icon?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  name: Scalars["String"];
  updated_at: Scalars["DateTime"];
};

/** A paginated list of BodyPart items. */
export type BodyPartPaginator = {
  __typename?: "BodyPartPaginator";
  /** A list of BodyPart items. */
  data: Array<BodyPart>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type CardDetached = {
  __typename?: "CardDetached";
  message: Scalars["String"];
  success: Scalars["Boolean"];
};

export type Cart = {
  __typename?: "Cart";
  discount: Scalars["Int"];
  end_date?: Maybe<Scalars["DateTime"]>;
  front_total: Scalars["String"];
  id: Scalars["ID"];
  items?: Maybe<Array<Maybe<CartItem>>>;
  start_date?: Maybe<Scalars["DateTime"]>;
  sub_total: Scalars["Int"];
  total: Scalars["Int"];
  type: PurchasableProductsEnum;
  user: User;
};

export type CartItem = {
  __typename?: "CartItem";
  cart: Cart;
  discount: Scalars["Int"];
  front_total: Scalars["String"];
  gatewayProductable: PaymentGatewayProduct;
  id: Scalars["ID"];
  productable: Productable;
  sub_total: Scalars["Int"];
  total: Scalars["Int"];
};

/** A paginated list of Cart items. */
export type CartPaginator = {
  __typename?: "CartPaginator";
  /** A list of Cart items. */
  data: Array<Cart>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type ChangePaymentMethod = {
  card_id: Scalars["ID"];
};

export type ChangeTrainingState = {
  id: Scalars["ID"];
  state: TrainingStatesForChangeEnum;
};

export type Chat = {
  __typename?: "Chat";
  id: Scalars["ID"];
  messages?: Maybe<Array<ChatMessage>>;
  participants?: Maybe<Array<User>>;
};

export type ChatMessage = {
  __typename?: "ChatMessage";
  chat?: Maybe<Chat>;
  id: Scalars["ID"];
  message: Scalars["String"];
  sender: User;
  sender_name?: Maybe<Scalars["String"]>;
  type: ChatMessageTypeEnum;
};

export type ChatMessageInput = {
  attachment?: InputMaybe<Scalars["Upload"]>;
  message?: InputMaybe<Scalars["String"]>;
  operation_data?: InputMaybe<Scalars["JSON"]>;
  type: ChatMessageTypeEnum;
};

/** ChatMessageTypeEnum Variants */
export enum ChatMessageTypeEnum {
  /** ATTACHMENT */
  Attachment = "ATTACHMENT",
  /** CANCEL */
  Cancel = "CANCEL",
  /** CONFIRM */
  Confirm = "CONFIRM",
  /** INFO */
  Info = "INFO",
  /** MESSAGE */
  Message = "MESSAGE",
  /** OPERATION_REQUIRED */
  OperationRequired = "OPERATION_REQUIRED",
}

/** ChatOperationsEnum Variants */
export enum ChatOperationsEnum {
  /** BOOKING_TRAINING */
  BookingTraining = "BOOKING_TRAINING",
}

export type CheckinByPassInput = {
  facility_item_pass_id: Scalars["ID"];
  manager_id: Scalars["ID"];
};

export type City = {
  __typename?: "City";
  country: Country;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  state: State;
};

/** A paginated list of City items. */
export type CityPaginator = {
  __typename?: "CityPaginator";
  /** A list of City items. */
  data: Array<City>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type ClearCartInput = {
  cart_id: Scalars["ID"];
};

export enum ConnectType {
  OrganizationOwner = "ORGANIZATION_OWNER",
  Trainer = "TRAINER",
}

export type Country = {
  __typename?: "Country";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
};

/** A paginated list of Country items. */
export type CountryPaginator = {
  __typename?: "CountryPaginator";
  /** A list of Country items. */
  data: Array<Country>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type CreateCartInput = {
  purchasable: AddToCartPurchasableEnum;
};

export type CreateDeviceTokenInput = {
  token: Scalars["String"];
};

export type CreateEventInput = {
  address: AddressInput;
  amenities?: InputMaybe<Array<Scalars["ID"]>>;
  description?: InputMaybe<Scalars["String"]>;
  end_date: Scalars["DateTime"];
  equipments?: InputMaybe<Array<Scalars["ID"]>>;
  max_participants: Scalars["Int"];
  media?: InputMaybe<Array<MediaImageInput>>;
  price?: InputMaybe<Scalars["Float"]>;
  start_date: Scalars["DateTime"];
  title: Scalars["String"];
  facility_id?: Scalars["ID"];
};

export type CreateFacilityInput = {
  address: AddressInput;
  amenities?: InputMaybe<Array<Scalars["ID"]>>;
  description?: InputMaybe<Scalars["String"]>;
  equipments?: InputMaybe<Array<Scalars["ID"]>>;
  media?: InputMaybe<Array<MediaImageInput>>;
  name: Scalars["String"];
  registration_code?: InputMaybe<Scalars["String"]>;
};

/** TrainerTypeEnum Variants */
export enum FacilityItemTypeEnum {
  /** Pass */
  Pass = "PASS",
  /** Drop in */
  DropIn = "DROPIN",
}

export type CreateFacilityItemInput = {
  facility_id: Scalars["ID"];
  title: Scalars["String"];
  front_price?: Scalars["String"];
  price: Scalars["Int"];
  // product_id: Scalars['String'];
  qr_code_lifetime_enum?: Scalars["String"];
  qr_code_lifetime_value?: Maybe<Scalars["Int"]>;
  duration?: Maybe<Scalars["Int"]>;
  item_type?: Maybe<FacilityItemTypeEnum>;
};

export type UpdateFacilityItemInput = {
  title?: Scalars["String"];
  front_price?: Scalars["String"];
  price?: Scalars["Int"];
  qr_code_lifetime_enum?: Scalars["String"];
  qr_code_lifetime_value?: Maybe<Scalars["Int"]>;
  duration?: Maybe<Scalars["Int"]>;
};

export type FacilityDashboardWidget = {
  event_count?: Scalars["Int"];
  message_count?: Scalars["Int"];
  expiring_membership_count?: Scalars["Int"];
  today_earn?: Scalars["Int"];
  earn_last_thirty_days?: Scalars["Int"];
  year_earn?: Scalars["Int"];
};

export type CreateQuizzAnswerInput = {
  quizz_id: Scalars["ID"];
  value: Scalars["StringOrUpload"];
};

export type CreateTrainerWorkoutInput = {
  body_parts: Array<Scalars["ID"]>;
  description?: InputMaybe<Scalars["String"]>;
  duration: Scalars["Int"];
  exercises?: InputMaybe<Array<WorkoutVideosInput>>;
  preview?: InputMaybe<Scalars["StringOrUpload"]>;
  price: Scalars["Float"];
  title: Scalars["String"];
  type_id?: InputMaybe<Scalars["ID"]>;
};

export type CreateDailyInput = {
  body_parts: Array<Scalars["ID"]>;
  description?: InputMaybe<Scalars["String"]>;
  duration?: Scalars["Int"];
  video?: InputMaybe<Scalars["StringOrUpload"]>;
  preview?: InputMaybe<Scalars["StringOrUpload"]>;
  price: Scalars["Float"];
  title: Scalars["String"];
  type_id?: InputMaybe<Scalars["ID"]>;
  facility_id?: InputMaybe<Scalars["ID"]>;
};

export type DateTimeRange = {
  from: Scalars["DateTime"];
  to: Scalars["DateTime"];
};

/** DaysEnum Variants */
export enum DaysEnum {
  /** FRIDAY */
  Friday = "FRIDAY",
  /** MONDAY */
  Monday = "MONDAY",
  /** SATURDAY */
  Saturday = "SATURDAY",
  /** SUNDAY */
  Sunday = "SUNDAY",
  /** THURSDAY */
  Thursday = "THURSDAY",
  /** TUESDAY */
  Tuesday = "TUESDAY",
  /** WEDNESDAY */
  Wednesday = "WEDNESDAY",
}

export type DeleteProfileResponse = {
  __typename?: "DeleteProfileResponse";
  status: OperationStatusEnum;
};

export type DetachCardInput = {
  card_id: Scalars["ID"];
};

export type DeviceToken = {
  __typename?: "DeviceToken";
  id: Scalars["ID"];
  token: Scalars["String"];
  user: User;
};

export type Document = {
  __typename?: "Document";
  created_at: Scalars["DateTime"];
  documentable: Documentable;
  id: Scalars["ID"];
  path: Scalars["String"];
  pathUrl: Scalars["String"];
  title?: Maybe<Scalars["String"]>;
  type?: Maybe<DocumentsTypeEnum>;
  updated_at: Scalars["DateTime"];
};

export type DocumentUploadInput = {
  file: Scalars["StringOrUpload"];
  id?: InputMaybe<Scalars["ID"]>;
  title: Scalars["String"];
};

export type Documentable = User;

/** DocumentsTypeEnum Variants */
export enum DocumentsTypeEnum {
  /** CERTIFICATE */
  Certificate = "CERTIFICATE",
  /** WAIVER_AND_LABILITIES */
  WaiverAndLabilities = "WAIVER_AND_LABILITIES",
}

export type Equipment = {
  __typename?: "Equipment";
  icon?: Maybe<Scalars["String"]>;
  iconUrl?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
};

/** A paginated list of Equipment items. */
export type EquipmentPaginator = {
  __typename?: "EquipmentPaginator";
  /** A list of Equipment items. */
  data: Array<Equipment>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type Event = {
  __typename?: "Event";
  address?: Maybe<Address>;
  amenities?: Maybe<Array<Amenity>>;
  booked_count?: Maybe<Scalars["Int"]>;
  description?: Maybe<Scalars["String"]>;
  end_date?: Maybe<Scalars["DateTime"]>;
  equipments?: Maybe<Array<Equipment>>;
  facility?: Maybe<Facility>;
  front_price: Scalars["String"];
  id: Scalars["ID"];
  max_participants: Scalars["Int"];
  media?: Maybe<Array<Maybe<Media>>>;
  price: Scalars["Int"];
  products?: Maybe<Array<Maybe<PaymentGatewayProduct>>>;
  start_date?: Maybe<Scalars["DateTime"]>;
  title: Scalars["String"];
  trainer?: Maybe<User>;
  was_ordered_by_me?: Maybe<Scalars["Boolean"]>;
};

/** A paginated list of Event items. */
export type EventPaginator = {
  __typename?: "EventPaginator";
  /** A list of Event items. */
  data: Array<Event>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type Facility = {
  __typename?: "Facility";
  address?: Maybe<Address>;
  amenities?: Maybe<Array<Maybe<Amenity>>>;
  created_at: Scalars["DateTime"];
  description: Scalars["String"];
  equipments?: Maybe<Array<Maybe<Equipment>>>;
  id: Scalars["ID"];
  is_followed?: Maybe<Scalars["Boolean"]>;
  media?: Maybe<Array<Maybe<Media>>>;
  name: Scalars["String"];
  negative_reviews_count?: Maybe<Scalars["Int"]>;
  not_recommended_count?: Maybe<Scalars["Int"]>;
  organization: Organization;
  positive_reviews_count?: Maybe<Scalars["Int"]>;
  productItems?: Maybe<Array<Maybe<FacilityItem>>>;
  recommended_count?: Maybe<Scalars["Int"]>;
  reviews_count?: Maybe<Scalars["Int"]>;
  score?: Maybe<Scalars["Float"]>;
  updated_at: Scalars["DateTime"];
  was_commented_by_me?: Maybe<Scalars["Boolean"]>;
  was_visited_by_me?: Maybe<Scalars["Boolean"]>;
};

export type FacilityItem = {
  __typename?: "FacilityItem";
  checkin_counter?: Maybe<Scalars["Int"]>;
  created_at: Scalars["DateTime"];
  description: Scalars["String"];
  facility: Facility;
  front_price: Scalars["String"];
  id: Scalars["ID"];
  is_unlimited_checkin: Scalars["Boolean"];
  price: Scalars["Int"];
  product_id: Scalars["String"];
  products?: Maybe<Array<Maybe<PaymentGatewayProduct>>>;
  qr_code_lifetime_enum: Scalars["String"];
  qr_code_lifetime_value?: Maybe<Scalars["Int"]>;
  title: Scalars["String"];
  updated_at: Scalars["DateTime"];
};

export type FacilityItemPass = {
  __typename?: "FacilityItemPass";
  end_date: Scalars["DateTime"];
  facilityItem: FacilityItem;
  id: Scalars["ID"];
  is_active_pass: Scalars["Boolean"];
  order: Order;
  start_date: Scalars["DateTime"];
  user: User;
};

/** A paginated list of FacilityItemPass items. */
export type FacilityItemPassPaginator = {
  __typename?: "FacilityItemPassPaginator";
  /** A list of FacilityItemPass items. */
  data: Array<FacilityItemPass>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** A paginated list of Facility items. */
export type FacilityPaginator = {
  __typename?: "FacilityPaginator";
  /** A list of Facility items. */
  data: Array<Facility>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** FeedbackEntityEnum Variants */
export enum FeedbackEntityEnum {
  /** Facility */
  Facility = "facility",
  /** User */
  User = "user",
  /** Workout */
  Workout = "workout",
}

export type FilePreloadResponse = {
  __typename?: "FilePreloadResponse";
  path?: Maybe<Scalars["String"]>;
};

export type FollowInput = {
  id: Scalars["ID"];
  type: FollowTypeEnum;
};

export type FollowType = Facility | User;

/** FollowTypeEnum Variants */
export enum FollowTypeEnum {
  /** Facility */
  Facility = "facility",
  /** User */
  User = "user",
}

export type ForgotPasswordInput = {
  email: Scalars["String"];
};

export type ForgotPasswordResponse = {
  __typename?: "ForgotPasswordResponse";
  message?: Maybe<Scalars["String"]>;
  status: Scalars["String"];
};

export type GatewayProduct = PaypalProduct | StripeProduct;

/** GenderEnum Variants */
export enum GenderEnum {
  /** FEMALE */
  Female = "FEMALE",
  /** MALE */
  Male = "MALE",
  /** OTHER */
  Other = "OTHER",
}

export type GeneralDocument = {
  __typename?: "GeneralDocument";
  code: GeneralDocumentsEnum;
  id: Scalars["ID"];
  value?: Maybe<Scalars["String"]>;
};

/** A paginated list of GeneralDocument items. */
export type GeneralDocumentPaginator = {
  __typename?: "GeneralDocumentPaginator";
  /** A list of GeneralDocument items. */
  data: Array<GeneralDocument>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** GeneralDocumentsEnum Variants */
export enum GeneralDocumentsEnum {
  /** ACCEPTABLE_USE_POLICY */
  AcceptableUsePolicy = "ACCEPTABLE_USE_POLICY",
  /** COOKIE_POLICY */
  CookiePolicy = "COOKIE_POLICY",
  /** DISCLAIMER */
  Disclaimer = "DISCLAIMER",
  /** EULA */
  Eula = "EULA",
  /** PRIVACY_POLICY */
  PrivacyPolicy = "PRIVACY_POLICY",
  /** RETURN_POLICY */
  ReturnPolicy = "RETURN_POLICY",
  /** TERMS_OF_USE */
  TermsOfUse = "TERMS_OF_USE",
}

export type LeftFeedbackInput = {
  feedback_entity: FeedbackEntityEnum;
  feedback_entity_id: Scalars["ID"];
  message?: InputMaybe<Scalars["String"]>;
  recommend?: InputMaybe<Scalars["Boolean"]>;
  score?: InputMaybe<Scalars["Float"]>;
};

export type LoginInput = {
  password: Scalars["String"];
  username: Scalars["String"];
};

export type LogoutResponse = {
  __typename?: "LogoutResponse";
  message?: Maybe<Scalars["String"]>;
  status: Scalars["String"];
};

export type Media = {
  __typename?: "Media";
  created_at: Scalars["DateTime"];
  description?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  mediable: Mediable;
  path: Scalars["String"];
  pathUrl: Scalars["String"];
  title: Scalars["String"];
  updated_at: Scalars["DateTime"];
};

/** MediaAccessEnum Variants */
export enum MediaAccessEnum {
  /** COMMERCIAL */
  Commercial = "COMMERCIAL",
  /** FREE */
  Free = "FREE",
  /** TRIAL */
  Trial = "TRIAL",
}

export type MediaImageInput = {
  description?: InputMaybe<Scalars["String"]>;
  file: Scalars["StringOrUpload"];
  id?: InputMaybe<Scalars["ID"]>;
  title: Scalars["String"];
};

/** MediaTypeEnum Variants */
export enum MediaTypeEnum {
  /** DOCUMENT */
  Document = "DOCUMENT",
  /** IMAGE */
  Image = "IMAGE",
  /** VIDEO */
  Video = "VIDEO",
}

export type Mediable = Facility | Workout;

export type Mutation = {
  __typename?: "Mutation";
  addFacilityItemToCart?: Maybe<Cart>;
  addToCart?: Maybe<Cart>;
  addTrainingToCart?: Maybe<Cart>;
  attachToFacility: User;
  blockTrainer: User;
  changePaymentMethod?: Maybe<StripeCard>;
  changeTrainingState: TrainingStateChanged;
  checkinByPass: FacilityItemPass;
  clearCart?: Maybe<Cart>;
  createCart?: Maybe<Cart>;
  createChat: Chat;
  createDeviceToken: DeviceToken;
  createEvent?: Maybe<Event>;
  createFacility: Facility;
  createFacilityItem: FacilityItem;
  createQuizzAnswer: QuizzAnswer;
  createTrainerWorkout: Workout;
  createGymWorkout: Workout;
  deleteChat: Chat;
  deleteDocument: Document;
  deleteEvent: Event;
  deleteMedia: Media;
  deleteMessage: ChatMessage;
  deleteProfile: DeleteProfileResponse;
  detachCard: CardDetached;
  filePreload?: Maybe<FilePreloadResponse>;
  follow: FollowType;
  forgotPassword: ForgotPasswordResponse;
  hideWorkout: Workout;
  leftFeedback?: Maybe<RegularOperation>;
  login: AuthPayload;
  logout: LogoutResponse;
  payWithPaypal: PaypalPaymentResult;
  paymentGatewayRefund: Refund;
  paymentIntent: PaymentIntent;
  /** Purchase a workout */
  purchaseWorkout?: Maybe<RegularOperation>;
  readMessage: ChatMessage;
  refreshToken: RefreshTokenPayload;
  register: RegisterResponse;
  removeFromCart?: Maybe<Cart>;
  resendEmailConfirmation: RegisterResponse;
  sendMessage: ChatMessage;
  showWorkout: Workout;
  socialLogin: AuthPayload;
  trainingCheckin: Training;
  trainingFinish: Training;
  unblockTrainer: User;
  unfollow: FollowType;
  updateEvent?: Maybe<Event>;
  updateFacility?: Maybe<Facility>;
  updateForgottenPassword: ForgotPasswordResponse;
  updatePassword: UpdatePasswordResponse;
  managerPasswordSet: ManagerPasswordResponse;
  updateTrainerWorkout: Workout;
  updateUser: User;
  verifyEmail: AuthPayload;
};

export type MutationAddFacilityItemToCartArgs = {
  input: AddFacilityItemToCartInput;
};

export type MutationAddToCartArgs = {
  input: AddToCartInput;
};

export type MutationAddTrainingToCartArgs = {
  input: AddTrainingToCartInput;
};

export type MutationAttachToFacilityArgs = {
  input: AttachToFacilityInput;
};

export type MutationBlockTrainerArgs = {
  id: Scalars["ID"];
};

export type MutationChangePaymentMethodArgs = {
  input: ChangePaymentMethod;
};

export type MutationChangeTrainingStateArgs = {
  input: ChangeTrainingState;
};

export type MutationCheckinByPassArgs = {
  input?: InputMaybe<CheckinByPassInput>;
};

export type MutationClearCartArgs = {
  input: ClearCartInput;
};

export type MutationCreateCartArgs = {
  input: CreateCartInput;
};

export type MutationCreateChatArgs = {
  participant_id: Scalars["ID"];
};

export type MutationCreateDeviceTokenArgs = {
  input: CreateDeviceTokenInput;
};

export type MutationCreateEventArgs = {
  input: CreateEventInput;
};

export type MutationCreateFacilityArgs = {
  input: CreateFacilityInput;
};

export type MutationCreateFacilityItemArgs = {
  input: CreateFacilityItemInput;
};

export type MutationCreateQuizzAnswerArgs = {
  input: CreateQuizzAnswerInput;
};

export type MutationCreateTrainerWorkoutArgs = {
  input?: InputMaybe<CreateTrainerWorkoutInput>;
};

export type MutationCreateDailyArgs = {
  input?: InputMaybe<CreateDailyInput>;
};

export type MutationDeleteChatArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteDocumentArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteEventArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteMediaArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteMessageArgs = {
  id: Scalars["ID"];
};

export type MutationDetachCardArgs = {
  input: DetachCardInput;
};

export type MutationFilePreloadArgs = {
  file: Scalars["Upload"];
};

export type MutationFollowArgs = {
  input: FollowInput;
};

export type MutationForgotPasswordArgs = {
  input: ForgotPasswordInput;
};

export type MutationHideWorkoutArgs = {
  id: Scalars["ID"];
};

export type MutationLeftFeedbackArgs = {
  input: LeftFeedbackInput;
};

export type MutationLoginArgs = {
  input?: InputMaybe<LoginInput>;
};

export type MutationPayWithPaypalArgs = {
  input: PayWithPaypalInput;
};

export type MutationPaymentGatewayRefundArgs = {
  input: RefundInput;
};

export type MutationPaymentIntentArgs = {
  input: PaymentIntentInput;
};

export type MutationPurchaseWorkoutArgs = {
  id: Scalars["Int"];
};

export type MutationReadMessageArgs = {
  id: Scalars["ID"];
};

export type MutationRefreshTokenArgs = {
  input?: InputMaybe<RefreshTokenInput>;
};

export type MutationRegisterArgs = {
  input?: InputMaybe<RegisterInput>;
};

export type MutationRemoveFromCartArgs = {
  input: RemoveFromCartInput;
};

export type MutationResendEmailConfirmationArgs = {
  input?: InputMaybe<ResendEmailConfirmationInput>;
};

export type MutationSendMessageArgs = {
  chat_id: Scalars["ID"];
  input: ChatMessageInput;
};

export type MutationShowWorkoutArgs = {
  id: Scalars["ID"];
};

export type MutationSocialLoginArgs = {
  input: SocialLoginInput;
};

export type MutationTrainingCheckinArgs = {
  input: TrainingCheckinInput;
};

export type MutationTrainingFinishArgs = {
  input: TrainingFinishInput;
};

export type MutationUnblockTrainerArgs = {
  id: Scalars["ID"];
};

export type MutationUnfollowArgs = {
  input: UnfollowInput;
};

export type MutationUpdateEventArgs = {
  id: Scalars["ID"];
  input: UpdateEventInput;
};

export type MutationUpdateFacilityArgs = {
  id: Scalars["ID"];
  input: UpdateFacilityInput;
};

export type MutationUpdateForgottenPasswordArgs = {
  input?: InputMaybe<NewPasswordWithCodeInput>;
};

export type MutationUpdatePasswordArgs = {
  input: UpdatePassword;
};

export type MutationManagerPasswordArgs = {
  input: ManagerPassword;
};

export type MutationUpdateTrainerWorkoutArgs = {
  id: Scalars["ID"];
  input?: InputMaybe<UpdateTrainerWorkoutInput>;
};

export type MutationUpdateDailyArgs = {
  id: Scalars["ID"];
  input?: InputMaybe<UpdateDailyInput>;
};

export type MutationUpdateUserArgs = {
  id: Scalars["ID"];
  input: UpdateUserInput;
};

export type MutationVerifyEmailArgs = {
  input: VerifyEmailInput;
};

export type NearFilter = {
  lat: Scalars["Float"];
  lng: Scalars["Float"];
  radius: Scalars["Int"];
};

export type NewPasswordWithCodeInput = {
  email: Scalars["String"];
  password: Scalars["String"];
  password_confirmation: Scalars["String"];
  token: Scalars["String"];
};

/** OperationResponseStatusEnum Variants */
export enum OperationResponseStatusEnum {
  /** ERROR */
  Error = "ERROR",
  /** SUCCESS */
  Success = "SUCCESS",
}

/** OperationStatusEnum Variants */
export enum OperationStatusEnum {
  /** ERROR */
  Error = "ERROR",
  /** SUCCESS */
  Success = "SUCCESS",
}

export type Order = {
  __typename?: "Order";
  created_at: Scalars["DateTime"];
  fee: Scalars["Int"];
  front_total: Scalars["String"];
  id: Scalars["ID"];
  items: Array<Maybe<OrderItem>>;
  order_subtotal: Scalars["Int"];
  state: TransactionStatesEnum;
  total: Scalars["Int"];
  trainings?: Maybe<Training>;
  updated_at: Scalars["DateTime"];
  user: User;
};

/** Allows ordering a list of records. */
export type OrderByClause = {
  /** The column that is used for ordering. */
  column: Scalars["String"];
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** OrderByDirectionEnum Variants */
export enum OrderByDirectionEnum {
  /** Asc */
  Asc = "asc",
  /** Desc */
  Desc = "desc",
}

/** Aggregate functions when ordering by a relation without specifying a column. */
export enum OrderByRelationAggregateFunction {
  /** Amount of items. */
  Count = "COUNT",
}

/** Aggregate functions when ordering by a relation that may specify a column. */
export enum OrderByRelationWithColumnAggregateFunction {
  /** Average. */
  Avg = "AVG",
  /** Amount of items. */
  Count = "COUNT",
  /** Maximum. */
  Max = "MAX",
  /** Minimum. */
  Min = "MIN",
  /** Sum. */
  Sum = "SUM",
}

export type OrderItem = {
  __typename?: "OrderItem";
  created_at: Scalars["DateTime"];
  front_price: Scalars["String"];
  id: Scalars["ID"];
  orderable: Orderable;
  payment_gateway: PaymentProvidersEnum;
  price: Scalars["Int"];
  productable?: Maybe<PaymentGatewayProduct>;
};

/** A paginated list of Order items. */
export type OrderPaginator = {
  __typename?: "OrderPaginator";
  /** A list of Order items. */
  data: Array<Order>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type Orderable = Event | FacilityItem | TrainerRate | Workout;

export type Organization = {
  __typename?: "Organization";
  contact_phone: Scalars["String"];
  email: Scalars["String"];
  facilities?: Maybe<Array<Maybe<Facility>>>;
  id: Scalars["ID"];
  name: Scalars["String"];
  owner?: Maybe<User>;
  rating?: Maybe<Scalars["Float"]>;
};

export type OrganizationRegistrationCode = {
  __typename?: "OrganizationRegistrationCode";
  code: Scalars["String"];
  id: Scalars["ID"];
  organization: Organization;
};

/** Information about pagination using a Relay style cursor connection. */
export type PageInfo = {
  __typename?: "PageInfo";
  /** Number of nodes in the current page. */
  count: Scalars["Int"];
  /** Index of the current page. */
  currentPage: Scalars["Int"];
  /** The cursor to continue paginating forwards. */
  endCursor?: Maybe<Scalars["String"]>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars["Boolean"];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars["Boolean"];
  /** Index of the last available page. */
  lastPage: Scalars["Int"];
  /** The cursor to continue paginating backwards. */
  startCursor?: Maybe<Scalars["String"]>;
  /** Total number of nodes in the paginated connection. */
  total: Scalars["Int"];
};

/** Information about pagination using a fully featured paginator. */
export type PaginatorInfo = {
  __typename?: "PaginatorInfo";
  /** Number of items in the current page. */
  count: Scalars["Int"];
  /** Index of the current page. */
  currentPage: Scalars["Int"];
  /** Index of the first item in the current page. */
  firstItem?: Maybe<Scalars["Int"]>;
  /** Are there more pages after this one? */
  hasMorePages: Scalars["Boolean"];
  /** Index of the last item in the current page. */
  lastItem?: Maybe<Scalars["Int"]>;
  /** Index of the last available page. */
  lastPage: Scalars["Int"];
  /** Number of items per page. */
  perPage: Scalars["Int"];
  /** Number of total available items. */
  total: Scalars["Int"];
};

export type PayWithPaypalInput = {
  cart_id: Scalars["ID"];
  nonce: Scalars["String"];
};

export type PaymentGatewayProduct = {
  __typename?: "PaymentGatewayProduct";
  checkin_number?: Maybe<Scalars["String"]>;
  currency: Scalars["String"];
  duration?: Maybe<Scalars["String"]>;
  end_date?: Maybe<Scalars["DateTime"]>;
  gatewayProductable?: Maybe<GatewayProduct>;
  id?: Maybe<Scalars["ID"]>;
  price: Scalars["Int"];
  product_id: Scalars["String"];
  productable?: Maybe<Productable>;
  provider: Scalars["String"];
  start_date?: Maybe<Scalars["DateTime"]>;
  state: Scalars["String"];
};

/** PaymentGatewayProductEnum Variants */
export enum PaymentGatewayProductEnum {
  /** Active */
  Active = "active",
  /** Disabled */
  Disabled = "disabled",
}

export type PaymentIntent = {
  __typename?: "PaymentIntent";
  session?: Maybe<Scalars["String"]>;
  zeroPayment: Scalars["Boolean"];
};

export type PaymentIntentInput = {
  cart_id: Scalars["ID"];
  purchasable_product_id: Scalars["ID"];
};

/** PaymentProvidersEnum Variants */
export enum PaymentProvidersEnum {
  /** APPLE */
  Apple = "APPLE",
  /** FREE_PURCHASE */
  FreePurchase = "FREE_PURCHASE",
  /** GOOGLE */
  Google = "GOOGLE",
  /** PAYPAL */
  Paypal = "PAYPAL",
  /** STRIPE */
  Stripe = "STRIPE",
}

export type PaypalPaymentResult = {
  __typename?: "PaypalPaymentResult";
  result: Scalars["String"];
};

export type PaypalProduct = {
  __typename?: "PaypalProduct";
  active: Scalars["Boolean"];
  currency: Scalars["String"];
  id?: Maybe<Scalars["ID"]>;
  name: Scalars["String"];
  price_id?: Maybe<Scalars["String"]>;
  product_id: Scalars["String"];
  unit_amount: Scalars["Int"];
};

export type PaypalToken = {
  __typename?: "PaypalToken";
  token: Scalars["String"];
};

export type Plan = {
  __typename?: "Plan";
  benefits?: Maybe<Array<SubscriptionBenefit>>;
  description?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  is_active?: Maybe<Scalars["Boolean"]>;
  subscriptionPlans?: Maybe<Array<SubscriptionPlan>>;
  title: Scalars["String"];
  prices?: Maybe<Array<SubscriptionPrice>>;
  type: SubscriptionsTypeEnum;
};

/** A paginated list of Plan items. */
export type PlanPaginator = {
  __typename?: "PlanPaginator";
  /** A list of Plan items. */
  data: Array<Plan>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type Productable = Event | FacilityItem | TrainerRate | Workout;

/** PurcahsableServicesEnum Variants */
export enum PurcahsableServicesEnum {
  /** FACILITY_ITEM */
  FacilityItem = "FACILITY_ITEM",
  /** TRAINING */
  Training = "TRAINING",
}

/** PurchasableProductsEnum Variants */
export enum PurchasableProductsEnum {
  /** EVENT */
  Event = "EVENT",
  /** FACILITY_ITEM */
  FacilityItem = "FACILITY_ITEM",
  /** TRAINING */
  Training = "TRAINING",
  /** WORKOUT */
  Workout = "WORKOUT",
}

/** Indicates what fields are available at the top level of a query operation. */
export type Query = {
  __typename?: "Query";
  activities: Array<Activity>;
  amenities?: Maybe<AmenityPaginator>;
  amenity: Amenity;
  appleGooglePaymentIntent: AppleGooglePaymentIntent;
  bodyPart: BodyPart;
  bodyParts?: Maybe<BodyPartPaginator>;
  cards?: Maybe<StripeCardPaginator>;
  checkOrganizationRegistrationCode: Organization;
  cities?: Maybe<CityPaginator>;
  connectAccount?: Maybe<StripeConnectAccount>;
  countries?: Maybe<CountryPaginator>;
  equipment: Equipment;
  equipments?: Maybe<EquipmentPaginator>;
  event: Event;
  events?: Maybe<EventPaginator>;
  facilities?: Maybe<FacilityPaginator>;
  facility?: Maybe<Facility>;
  facilityAvailability: Availability;
  facilityItemPass: FacilityItemPass;
  general_document: GeneralDocument;
  general_documents?: Maybe<GeneralDocumentPaginator>;
  getCart?: Maybe<Cart>;
  links: StripeConnectAccountLink;
  me: User;
  myCarts?: Maybe<CartPaginator>;
  myEvents?: Maybe<EventPaginator>;
  myFacilityItemPasses?: Maybe<FacilityItemPassPaginator>;
  myTrainings?: Maybe<TrainingPaginator>;
  myWorkouts?: Maybe<WorkoutPaginator>;
  order: Order;
  orders?: Maybe<OrderPaginator>;
  paypalToken: PaypalToken;
  plan: Plan;
  plans?: Maybe<PlanPaginator>;
  /** Find a single quizz by id or code. */
  quizz?: Maybe<Quizz>;
  quizzAnswers?: Maybe<QuizzAnswerPaginator>;
  quizzOptions?: Maybe<QuizzOptionPaginator>;
  quizzes?: Maybe<QuizzPaginator>;
  /** Get list of recommended workouts for user. */
  recommendedWorkouts?: Maybe<WorkoutPaginator>;
  recommendedWorkoutsByBodyParts?: Maybe<WorkoutPaginator>;
  recommendedWorkoutsByType?: Maybe<WorkoutPaginator>;
  reviews?: Maybe<ReviewPaginator>;
  setting?: Maybe<Setting>;
  settings?: Maybe<SettingPaginator>;
  setupIntent: SetupIntent;
  states?: Maybe<StatePaginator>;
  trainerTrainings?: Maybe<TrainingPaginator>;
  training: Training;
  user?: Maybe<User>;
  userAvailability: Availability;
  userTrainings?: Maybe<TrainingPaginator>;
  users?: Maybe<UserPaginator>;
  /** Get workout by id */
  workout: Workout;
  workoutTypes?: Maybe<WorkoutTypePaginator>;
  /** Get list of workouts for the auth trainer. */
  workouts?: Maybe<WorkoutPaginator>;
  facilityDashboardWidget?: Maybe<FacilityDashboardWidget>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryActivitiesArgs = {
  limitPerUnit?: InputMaybe<Scalars["Int"]>;
  near?: InputMaybe<NearFilter>;
  search?: InputMaybe<Scalars["String"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryAmenitiesArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryAmenityArgs = {
  id: Scalars["ID"];
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryAppleGooglePaymentIntentArgs = {
  cart_id: Scalars["ID"];
  provider: PaymentProvidersEnum;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryBodyPartArgs = {
  id: Scalars["ID"];
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryBodyPartsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryCardsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryCheckOrganizationRegistrationCodeArgs = {
  code: Scalars["String"];
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryCitiesArgs = {
  country_id?: InputMaybe<Scalars["ID"]>;
  first: Scalars["Int"];
  name?: InputMaybe<Scalars["String"]>;
  page?: InputMaybe<Scalars["Int"]>;
  state_code?: InputMaybe<Scalars["String"]>;
  state_id?: InputMaybe<Scalars["ID"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryCountriesArgs = {
  first: Scalars["Int"];
  name?: InputMaybe<Scalars["String"]>;
  page?: InputMaybe<Scalars["Int"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryEquipmentArgs = {
  id: Scalars["ID"];
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryEquipmentsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryEventArgs = {
  id?: InputMaybe<Scalars["ID"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryEventsArgs = {
  created_by_facility?: InputMaybe<Scalars["ID"]>;
  created_by_trainer?: InputMaybe<Scalars["ID"]>;
  end_date?: InputMaybe<DateTimeRange>;
  first?: InputMaybe<Scalars["Int"]>;
  near?: InputMaybe<NearFilter>;
  notOwnedByUser?: InputMaybe<Scalars["ID"]>;
  orderBy?: InputMaybe<Array<QueryEventsOrderByOrderByClause>>;
  ownedByUser?: InputMaybe<Scalars["ID"]>;
  page?: InputMaybe<Scalars["Int"]>;
  start_date?: InputMaybe<DateTimeRange>;
  title?: InputMaybe<Scalars["String"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryFacilitiesArgs = {
  city_id?: InputMaybe<Scalars["ID"]>;
  first?: InputMaybe<Scalars["Int"]>;
  is_followed?: InputMaybe<Scalars["Boolean"]>;
  name?: InputMaybe<Scalars["String"]>;
  near?: InputMaybe<NearFilter>;
  organization_id?: InputMaybe<Scalars["ID"]>;
  page?: InputMaybe<Scalars["Int"]>;
  search?: InputMaybe<Scalars["String"]>;
  state_id?: InputMaybe<Scalars["ID"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryFacilityArgs = {
  id: Scalars["ID"];
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryFacilityAvailabilityArgs = {
  from: Scalars["DateTime"];
  id: Scalars["ID"];
  to: Scalars["DateTime"];
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryFacilityItemPassArgs = {
  id?: InputMaybe<Scalars["ID"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryGeneral_DocumentArgs = {
  code: GeneralDocumentsEnum;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryGeneral_DocumentsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryGetCartArgs = {
  id?: InputMaybe<Scalars["ID"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryMyCartsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryMyEventsArgs = {
  end_date?: InputMaybe<DateTimeRange>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<QueryMyEventsOrderByOrderByClause>>;
  page?: InputMaybe<Scalars["Int"]>;
  start_date?: InputMaybe<DateTimeRange>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryMyFacilityItemPassesArgs = {
  end_date?: InputMaybe<DateTimeRange>;
  first?: InputMaybe<Scalars["Int"]>;
  id?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<QueryMyFacilityItemPassesOrderByOrderByClause>>;
  page?: InputMaybe<Scalars["Int"]>;
  start_date?: InputMaybe<DateTimeRange>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryMyTrainingsArgs = {
  end_date?: InputMaybe<DateTimeRange>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<QueryMyTrainingsOrderByOrderByClause>>;
  page?: InputMaybe<Scalars["Int"]>;
  start_date?: InputMaybe<DateTimeRange>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryMyWorkoutsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<QueryMyWorkoutsOrderByOrderByClause>>;
  page?: InputMaybe<Scalars["Int"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryOrderArgs = {
  id?: InputMaybe<Scalars["ID"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryOrdersArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
  states?: InputMaybe<Array<InputMaybe<TransactionStatesEnum>>>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryPlanArgs = {
  id?: InputMaybe<Scalars["ID"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryPlansArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
  type?: InputMaybe<SubscriptionsTypeEnum>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryQuizzArgs = {
  code?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryQuizzAnswersArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
  quizz_user_id?: InputMaybe<Scalars["Int"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryQuizzOptionsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
  quizz_id?: InputMaybe<Scalars["Int"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryQuizzesArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
  role: RoleEnum;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryRecommendedWorkoutsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  notOwnedByUser?: InputMaybe<Scalars["ID"]>;
  ownedByUser?: InputMaybe<Scalars["ID"]>;
  page?: InputMaybe<Scalars["Int"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryRecommendedWorkoutsByBodyPartsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryRecommendedWorkoutsByTypeArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryReviewsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  id: Scalars["ID"];
  orderBy?: InputMaybe<Array<QueryReviewsOrderByOrderByClause>>;
  page?: InputMaybe<Scalars["Int"]>;
  review_type?: InputMaybe<ReviewTypeEnum>;
  type?: InputMaybe<FeedbackEntityEnum>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QuerySettingArgs = {
  id: Scalars["ID"];
};

/** Indicates what fields are available at the top level of a query operation. */
export type QuerySettingsArgs = {
  codes?: InputMaybe<Array<SettingsCodeEnum>>;
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QuerySetupIntentArgs = {
  product_id?: InputMaybe<Scalars["ID"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryStatesArgs = {
  country_id?: InputMaybe<Scalars["ID"]>;
  first: Scalars["Int"];
  name?: InputMaybe<Scalars["String"]>;
  page?: InputMaybe<Scalars["Int"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryTrainerTrainingsArgs = {
  filters?: InputMaybe<TrainingsFilterInput>;
  first: Scalars["Int"];
  orderBy?: InputMaybe<Array<QueryTrainerTrainingsOrderByOrderByClause>>;
  page?: InputMaybe<Scalars["Int"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryTrainingArgs = {
  id: Scalars["ID"];
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryUserArgs = {
  id: Scalars["ID"];
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryUserAvailabilityArgs = {
  from: Scalars["DateTime"];
  id: Scalars["ID"];
  to: Scalars["DateTime"];
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryUserTrainingsArgs = {
  filters?: InputMaybe<TrainingsFilterInput>;
  first: Scalars["Int"];
  orderBy?: InputMaybe<Array<QueryUserTrainingsOrderByOrderByClause>>;
  page?: InputMaybe<Scalars["Int"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryUsersArgs = {
  availability?: InputMaybe<UsersAvailabilityFilter>;
  facilities?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  first?: InputMaybe<Scalars["Int"]>;
  is_followed?: InputMaybe<Scalars["Boolean"]>;
  near?: InputMaybe<NearFilter>;
  page?: InputMaybe<Scalars["Int"]>;
  role?: InputMaybe<RoleEnum>;
  search?: InputMaybe<Scalars["String"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryWorkoutArgs = {
  id: Scalars["ID"];
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryWorkoutTypesArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryWorkoutsArgs = {
  dynamic_search?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  has_body_parts?: InputMaybe<Array<Scalars["ID"]>>;
  orderBy?: InputMaybe<Array<QueryWorkoutsOrderByOrderByClause>>;
  page?: InputMaybe<Scalars["Int"]>;
  trainer_id?: InputMaybe<Scalars["ID"]>;
  type_id?: InputMaybe<Scalars["ID"]>;
};

/** Allowed column names for Query.events.orderBy. */
export enum QueryEventsOrderByColumn {
  Description = "DESCRIPTION",
  EndDate = "END_DATE",
  FrontPrice = "FRONT_PRICE",
  Id = "ID",
  Price = "PRICE",
  StartDate = "START_DATE",
  Title = "TITLE",
  WasOrderedByMe = "WAS_ORDERED_BY_ME",
}

/** Order by clause for Query.events.orderBy. */
export type QueryEventsOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryEventsOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.myEvents.orderBy. */
export enum QueryMyEventsOrderByColumn {
  Description = "DESCRIPTION",
  EndDate = "END_DATE",
  Id = "ID",
  StartDate = "START_DATE",
  Title = "TITLE",
}

/** Order by clause for Query.myEvents.orderBy. */
export type QueryMyEventsOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryMyEventsOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.myFacilityItemPasses.orderBy. */
export enum QueryMyFacilityItemPassesOrderByColumn {
  Id = "ID",
  StartDate = "START_DATE",
}

/** Order by clause for Query.myFacilityItemPasses.orderBy. */
export type QueryMyFacilityItemPassesOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryMyFacilityItemPassesOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.myTrainings.orderBy. */
export enum QueryMyTrainingsOrderByColumn {
  EndDate = "END_DATE",
  Id = "ID",
  StartDate = "START_DATE",
}

/** Order by clause for Query.myTrainings.orderBy. */
export type QueryMyTrainingsOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryMyTrainingsOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.myWorkouts.orderBy. */
export enum QueryMyWorkoutsOrderByColumn {
  Description = "DESCRIPTION",
  Duration = "DURATION",
  Id = "ID",
  Price = "PRICE",
  Title = "TITLE",
}

/** Order by clause for Query.myWorkouts.orderBy. */
export type QueryMyWorkoutsOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryMyWorkoutsOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.reviews.orderBy. */
export enum QueryReviewsOrderByColumn {
  CreatedAt = "CREATED_AT",
  Review = "REVIEW",
  Score = "SCORE",
}

/** Order by clause for Query.reviews.orderBy. */
export type QueryReviewsOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryReviewsOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.trainerTrainings.orderBy. */
export enum QueryTrainerTrainingsOrderByColumn {
  CreatedAt = "CREATED_AT",
  EndDate = "END_DATE",
  StartDate = "START_DATE",
}

/** Order by clause for Query.trainerTrainings.orderBy. */
export type QueryTrainerTrainingsOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryTrainerTrainingsOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.userTrainings.orderBy. */
export enum QueryUserTrainingsOrderByColumn {
  CreatedAt = "CREATED_AT",
  EndDate = "END_DATE",
  StartDate = "START_DATE",
}

/** Order by clause for Query.userTrainings.orderBy. */
export type QueryUserTrainingsOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryUserTrainingsOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.workouts.orderBy. */
export enum QueryWorkoutsOrderByColumn {
  CreatedAt = "CREATED_AT",
  Description = "DESCRIPTION",
  Duration = "DURATION",
  Id = "ID",
  Price = "PRICE",
  Title = "TITLE",
}

/** Order by clause for Query.workouts.orderBy. */
export type QueryWorkoutsOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryWorkoutsOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.facilityWorkouts.orderBy. */
export enum QueryFacilityWorkoutsOrderByColumn {
  CreatedAt = "CREATED_AT",
  Description = "DESCRIPTION",
  Duration = "DURATION",
  Id = "ID",
  Price = "PRICE",
  Title = "TITLE",
}

/** Order by clause for Query.facilityWorkouts.orderBy. */
export type QueryFacilityWorkoutsOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryFacilityWorkoutsOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

export type Quizz = {
  __typename?: "Quizz";
  answers?: Maybe<Array<Maybe<QuizzAnswer>>>;
  code: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  media?: Maybe<Array<Maybe<Media>>>;
  options?: Maybe<Array<Maybe<QuizzOption>>>;
  order?: Maybe<Scalars["Int"]>;
  role: RoleEnum;
  status?: Maybe<QuizzStatusEnum>;
  title: Scalars["String"];
  type: QuizzTypesEnum;
  users?: Maybe<Array<Maybe<User>>>;
};

export type QuizzAnswer = {
  __typename?: "QuizzAnswer";
  id: Scalars["ID"];
  quizzUser?: Maybe<QuizzUser>;
  value: Scalars["String"];
};

/** A paginated list of QuizzAnswer items. */
export type QuizzAnswerPaginator = {
  __typename?: "QuizzAnswerPaginator";
  /** A list of QuizzAnswer items. */
  data: Array<QuizzAnswer>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type QuizzOption = {
  __typename?: "QuizzOption";
  id: Scalars["ID"];
  quizz?: Maybe<Quizz>;
  title: Scalars["String"];
  value: Scalars["String"];
};

/** A paginated list of QuizzOption items. */
export type QuizzOptionPaginator = {
  __typename?: "QuizzOptionPaginator";
  /** A list of QuizzOption items. */
  data: Array<QuizzOption>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** A paginated list of Quizz items. */
export type QuizzPaginator = {
  __typename?: "QuizzPaginator";
  /** A list of Quizz items. */
  data: Array<Quizz>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** QuizzStatusEnum Variants */
export enum QuizzStatusEnum {
  /** NECESSARY */
  Necessary = "NECESSARY",
  /** SYSTEM */
  System = "SYSTEM",
  /** UNNECESSARY */
  Unnecessary = "UNNECESSARY",
}

/** QuizzTypesEnum Variants */
export enum QuizzTypesEnum {
  /** FILE */
  File = "FILE",
  /** INPUT */
  Input = "INPUT",
  /** MODEL_SELECT */
  ModelSelect = "MODEL_SELECT",
  /** MULTI_MODEL_SELECT */
  MultiModelSelect = "MULTI_MODEL_SELECT",
  /** MULTI_SELECT */
  MultiSelect = "MULTI_SELECT",
  /** SELECT */
  Select = "SELECT",
}

export type QuizzUser = {
  __typename?: "QuizzUser";
  id: Scalars["ID"];
  quizzes?: Maybe<Quizz>;
  users?: Maybe<User>;
};

export type RefreshTokenInput = {
  refresh_token?: InputMaybe<Scalars["String"]>;
};

export type RefreshTokenPayload = {
  __typename?: "RefreshTokenPayload";
  access_token: Scalars["String"];
  expires_in: Scalars["Int"];
  refresh_token: Scalars["String"];
  token_type: Scalars["String"];
};

export type Refund = {
  __typename?: "Refund";
  message?: Maybe<Scalars["String"]>;
  success: Scalars["Boolean"];
};

export type RefundInput = {
  order_id?: InputMaybe<Scalars["ID"]>;
};

/** RefundableProductsEnum Variants */
export enum RefundableProductsEnum {
  /** EVENT */
  Event = "EVENT",
  /** FACILITY_ITEM */
  FacilityItem = "FACILITY_ITEM",
  /** TRAINER_RATE */
  TrainerRate = "TRAINER_RATE",
}

export type RegisterInput = {
  email: Scalars["String"];
  first_name: Scalars["String"];
  gender?: InputMaybe<GenderEnum>;
  last_name: Scalars["String"];
  password: Scalars["String"];
  password_confirmation: Scalars["String"];
  quizzAnswers?: InputMaybe<Array<InputMaybe<CreateQuizzAnswerInput>>>;
  role: RoleEnum;
};

export type RegisterResponse = {
  __typename?: "RegisterResponse";
  quizzAnswers?: Maybe<QuizzAnswerPaginator>;
  role?: Maybe<Role>;
  status: RegisterStatuses;
  tokens?: Maybe<AuthPayload>;
};

export type RegisterResponseQuizzAnswersArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
};

export enum RegisterStatuses {
  MustVerifyEmail = "MUST_VERIFY_EMAIL",
  Success = "SUCCESS",
}

export type RegularOperation = {
  __typename?: "RegularOperation";
  message?: Maybe<Scalars["String"]>;
  state?: Maybe<OperationResponseStatusEnum>;
};

export type RemoveFromCartInput = {
  cart_id: Scalars["ID"];
  cart_item_id: Scalars["ID"];
};

export type ResendEmailConfirmationInput = {
  email: Scalars["String"];
};

export type Review = {
  __typename?: "Review";
  author: User;
  created_at: Scalars["DateTime"];
  id: Scalars["ID"];
  review: Scalars["String"];
  score?: Maybe<Scalars["Float"]>;
  updated_at: Scalars["DateTime"];
};

/** A paginated list of Review items. */
export type ReviewPaginator = {
  __typename?: "ReviewPaginator";
  /** A list of Review items. */
  data: Array<Review>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** ReviewTypeEnum Variants */
export enum ReviewTypeEnum {
  /** Negative */
  Negative = "Negative",
  /** Positive */
  Positive = "Positive",
  /** Recent */
  Recent = "Recent",
}

export type Role = {
  __typename?: "Role";
  code: RoleEnum;
  created_at: Scalars["DateTime"];
  id: Scalars["ID"];
  updated_at: Scalars["DateTime"];
};

/** RoleEnum Variants */
export enum RoleEnum {
  /** ADMIN */
  Admin = "ADMIN",
  /** FACILITY_OWNER */
  FacilityOwner = "FACILITY_OWNER",
  /** MANAGER */
  Manager = "MANAGER",
  /** ORGANIZATION_OWNER */
  OrganizationOwner = "ORGANIZATION_OWNER",
  /** TRAINER */
  Trainer = "TRAINER",
  /** USER */
  User = "USER",
}

/** Employment Type Variants */
export enum EmploymentTypeEnum {
  /** PART_TIME */
  PartTime = "PART_TIME",
  /** FULL_TIME */
  FullTime = "FULL_TIME",
}

/** The available SQL operators that are used to filter query results. */
export enum SqlOperator {
  /** Whether a value is within a range of values (`BETWEEN`) */
  Between = "BETWEEN",
  /** Equal operator (`=`) */
  Eq = "EQ",
  /** Greater than operator (`>`) */
  Gt = "GT",
  /** Greater than or equal operator (`>=`) */
  Gte = "GTE",
  /** Whether a value is within a set of values (`IN`) */
  In = "IN",
  /** Whether a value is not null (`IS NOT NULL`) */
  IsNotNull = "IS_NOT_NULL",
  /** Whether a value is null (`IS NULL`) */
  IsNull = "IS_NULL",
  /** Simple pattern matching (`LIKE`) */
  Like = "LIKE",
  /** Less than operator (`<`) */
  Lt = "LT",
  /** Less than or equal operator (`<=`) */
  Lte = "LTE",
  /** Not equal operator (`!=`) */
  Neq = "NEQ",
  /** Whether a value is not within a range of values (`NOT BETWEEN`) */
  NotBetween = "NOT_BETWEEN",
  /** Whether a value is not within a set of values (`NOT IN`) */
  NotIn = "NOT_IN",
  /** Negation of simple pattern matching (`NOT LIKE`) */
  NotLike = "NOT_LIKE",
}

export type SetSettingInput = {
  code: SettingsCodeEnum;
  value?: InputMaybe<Scalars["Mixed"]>;
};

export type Setting = {
  __typename?: "Setting";
  code: SettingsCodeEnum;
  id: Scalars["ID"];
  options?: Maybe<Array<SettingsPossibleValues>>;
  title?: Maybe<Scalars["String"]>;
  type: SettingsTypeEnum;
  value?: Maybe<Scalars["Mixed"]>;
};

/** A paginated list of Setting items. */
export type SettingPaginator = {
  __typename?: "SettingPaginator";
  /** A list of Setting items. */
  data: Array<Setting>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** SettingsCodeEnum Variants */
export enum SettingsCodeEnum {
  /** APP_MODE */
  AppMode = "APP_MODE",
  /** ASSIGNED_TO_GYM */
  AssignedToGym = "ASSIGNED_TO_GYM",
  /** AUTO_ORDER_CONFIRMATION */
  AutoOrderConfirmation = "AUTO_ORDER_CONFIRMATION",
  /** DISPLAY_PREFERENCE */
  DisplayPreference = "DISPLAY_PREFERENCE",
  /** ENABLE_SOUND_FOR_NOTIFICATIONS */
  EnableSoundForNotifications = "ENABLE_SOUND_FOR_NOTIFICATIONS",
  /** ENABLE_VIBRATION_ON_NOTIFICATION */
  EnableVibrationOnNotification = "ENABLE_VIBRATION_ON_NOTIFICATION",
  /** FACILITIES */
  Facilities = "FACILITIES",
  /** HOURLY_RATE */
  HourlyRate = "HOURLY_RATE",
  /** IS_MOBILE */
  IsMobile = "IS_MOBILE",
  /** LANGUAGE */
  Language = "LANGUAGE",
  /** REMOTE_HOURLY_RATE */
  RemoteHourlyRate = "REMOTE_HOURLY_RATE",
  /** SHOW_NOTIFICATIONS */
  ShowNotifications = "SHOW_NOTIFICATIONS",
  /** TRAINERS */
  Trainers = "TRAINERS",
  /** TRAINER_FEE */
  TrainerFee = "TRAINER_FEE",
  /** TRAINER_REMOTE_DISTANCE */
  TrainerRemoteDistance = "TRAINER_REMOTE_DISTANCE",
  /** USER_PRONOUNCE */
  UserPronounce = "USER_PRONOUNCE",
  /** USE_PHONE_LOCATION */
  UsePhoneLocation = "USE_PHONE_LOCATION",
  /** VERIFIED_USER */
  VerifiedUser = "VERIFIED_USER",
}

export type SettingsPossibleValues = {
  __typename?: "SettingsPossibleValues";
  code: Scalars["String"];
  value: Scalars["Mixed"];
};

/** SettingsTypeEnum Variants */
export enum SettingsTypeEnum {
  /** BOOL */
  Bool = "BOOL",
  /** INT */
  Int = "INT",
  /** SELECT */
  Select = "SELECT",
  /** STRING */
  String = "STRING",
}

export type SetupIntent = {
  __typename?: "SetupIntent";
  session?: Maybe<Scalars["String"]>;
};

/** Information about pagination using a simple paginator. */
export type SimplePaginatorInfo = {
  __typename?: "SimplePaginatorInfo";
  /** Number of items in the current page. */
  count: Scalars["Int"];
  /** Index of the current page. */
  currentPage: Scalars["Int"];
  /** Index of the first item in the current page. */
  firstItem?: Maybe<Scalars["Int"]>;
  /** Are there more pages after this one? */
  hasMorePages: Scalars["Boolean"];
  /** Index of the last item in the current page. */
  lastItem?: Maybe<Scalars["Int"]>;
  /** Number of items per page. */
  perPage: Scalars["Int"];
};

export type SocialLoginInput = {
  provider: SocialProvidersEnum;
  token: Scalars["String"];
};

/** SocialProvidersEnum Variants */
export enum SocialProvidersEnum {
  /** APPLE */
  Apple = "APPLE",
  /** FACEBOOK */
  Facebook = "FACEBOOK",
  /** GOOGLE */
  Google = "GOOGLE",
}

/** Directions for ordering a list of records. */
export enum SortOrder {
  /** Sort records in ascending order. */
  Asc = "ASC",
  /** Sort records in descending order. */
  Desc = "DESC",
}

export type State = {
  __typename?: "State";
  code?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
};

/** A paginated list of State items. */
export type StatePaginator = {
  __typename?: "StatePaginator";
  /** A list of State items. */
  data: Array<State>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type StripeCard = {
  __typename?: "StripeCard";
  brand: Scalars["String"];
  card_holder: Scalars["String"];
  exp_month: Scalars["Int"];
  exp_year: Scalars["Int"];
  id: Scalars["Int"];
  is_default: Scalars["Boolean"];
  pm_last_four: Scalars["Int"];
};

/** A paginated list of StripeCard items. */
export type StripeCardPaginator = {
  __typename?: "StripeCardPaginator";
  /** A list of StripeCard items. */
  data: Array<StripeCard>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type StripeConnectAccount = {
  __typename?: "StripeConnectAccount";
  externalAccount?: Maybe<StripeConnectExternalAccount>;
  state: StripeConnectStatesEnum;
  type: ConnectType;
};

export type StripeConnectAccountLink = {
  __typename?: "StripeConnectAccountLink";
  expires_at: Scalars["DateTime"];
  url: Scalars["String"];
};

export type StripeConnectExternalAccount = {
  __typename?: "StripeConnectExternalAccount";
  country: Scalars["String"];
  currency: Scalars["String"];
  exp_month?: Maybe<Scalars["String"]>;
  exp_year?: Maybe<Scalars["String"]>;
  last4: Scalars["String"];
  name: Scalars["String"];
  routing_number?: Maybe<Scalars["String"]>;
  type: StripeConnectExternalAccountType;
};

/** StripeConnectExternalAccountType Variants */
export enum StripeConnectExternalAccountType {
  /** BANK_ACCOUNT */
  BankAccount = "BANK_ACCOUNT",
  /** CARD */
  Card = "CARD",
}

/** StripeConnectStatesEnum Variants */
export enum StripeConnectStatesEnum {
  /** ACTIVE */
  Active = "ACTIVE",
  /** PENDING */
  Pending = "PENDING",
}

export type StripeProduct = {
  __typename?: "StripeProduct";
  active: Scalars["Boolean"];
  currency: Scalars["String"];
  id?: Maybe<Scalars["ID"]>;
  name: Scalars["String"];
  price_id?: Maybe<Scalars["String"]>;
  product_id: Scalars["String"];
  unit_amount: Scalars["Int"];
};

export type SubscriptionBenefit = {
  __typename?: "SubscriptionBenefit";
  benefit_key: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
};

export type SubscriptionPrice = {
  __typename?: "SubscriptionPrice";
  price: number;
  id: Scalars["ID"];
};

/** SubscriptionBronzeGymFacilityBenefitsKeyEnum Variants */
export enum SubscriptionBronzeGymFacilityBenefitsKeyEnum {
  /** ACCESS_TO_DASHBOARD */
  AccessToDashboard = "ACCESS_TO_DASHBOARD",
  /** BOOKING_15_PERCENTS_FEE */
  Booking_15PercentsFee = "BOOKING_15_PERCENTS_FEE",
  /** DROPIN_RATES_AND_BUNDLES */
  DropinRatesAndBundles = "DROPIN_RATES_AND_BUNDLES",
  /** LIST_UP_TO_10_OFFERINGS */
  ListUpTo_10Offerings = "LIST_UP_TO_10_OFFERINGS",
  /** SEARCHABLE_PROFILE */
  SearchableProfile = "SEARCHABLE_PROFILE",
  /** WAIVER_AND_LIABILITY_UPLOAD */
  WaiverAndLiabilityUpload = "WAIVER_AND_LIABILITY_UPLOAD",
}

/** SubscriptionBronzeTrainerBenefitsKeyEnum Variants */
export enum SubscriptionBronzeTrainerBenefitsKeyEnum {
  /** ACCESS_TO_DASHBOARD */
  AccessToDashboard = "ACCESS_TO_DASHBOARD",
  /** BOOKING_FEEFTEEN_PERCENTS_FEE */
  BookingFeefteenPercentsFee = "BOOKING_FEEFTEEN_PERCENTS_FEE",
  /** FREE_MESSAGING */
  FreeMessaging = "FREE_MESSAGING",
  /** SEARCHABLE_PROFILE */
  SearchableProfile = "SEARCHABLE_PROFILE",
  /** WAIVER_AND_LIABILITY_UPLOAD */
  WaiverAndLiabilityUpload = "WAIVER_AND_LIABILITY_UPLOAD",
}

/** SubscriptionGoldGymFacilityBenefitsKeyEnum Variants */
export enum SubscriptionGoldGymFacilityBenefitsKeyEnum {
  /** ALL_BRONZE_AND_SILVER_FEATURES */
  AllBronzeAndSilverFeatures = "ALL_BRONZE_AND_SILVER_FEATURES",
  /** CREATE_AND_POST_EVENTS */
  CreateAndPostEvents = "CREATE_AND_POST_EVENTS",
  /** MARKETING_BRANDING_CONSULTATION */
  MarketingBrandingConsultation = "MARKETING_BRANDING_CONSULTATION",
  /** REDUCED_BOOKING_FEE */
  ReducedBookingFee = "REDUCED_BOOKING_FEE",
  /** REPORTING_CAPABILITIES_ON_DASHBOARD */
  ReportingCapabilitiesOnDashboard = "REPORTING_CAPABILITIES_ON_DASHBOARD",
}

/** SubscriptionGoldTrainerBenefitsKeyEnum Variants */
export enum SubscriptionGoldTrainerBenefitsKeyEnum {
  /** ALL_BRONZE_AND_SILVER_FEATURES */
  AllBronzeAndSilverFeatures = "ALL_BRONZE_AND_SILVER_FEATURES",
  /** MANUAL_BOOKING_APPROVAL */
  ManualBookingApproval = "MANUAL_BOOKING_APPROVAL",
  /** POST_30_SELL_20_DAILIES */
  Post_30Sell_20Dailies = "POST_30_SELL_20_DAILIES",
  /** REDUCED_BOOKING_FEE */
  ReducedBookingFee = "REDUCED_BOOKING_FEE",
  /** REPORTING_CAPABILITIES_ON_DASHBOARD */
  ReportingCapabilitiesOnDashboard = "REPORTING_CAPABILITIES_ON_DASHBOARD",
}

export type SubscriptionPlan = {
  __typename?: "SubscriptionPlan";
  billing_period: Scalars["String"];
  grace_period?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  is_active?: Maybe<Scalars["Boolean"]>;
  product_id: Scalars["String"];
  provider: SubscriptionProvidersEnum;
  renewal_type: Scalars["String"];
};

/** SubscriptionProvidersEnum Variants */
export enum SubscriptionProvidersEnum {
  /** APPLE */
  Apple = "APPLE",
  /** GOOGLE */
  Google = "GOOGLE",
  /** WEB */
  Web = "WEB",
}

/** SubscriptionSilverGymFacilityBenefitsKeyEnum Variants */
export enum SubscriptionSilverGymFacilityBenefitsKeyEnum {
  /** ALL_BRONZE_FEATURES */
  AllBronzeFeatures = "ALL_BRONZE_FEATURES",
  /** REDUCED_BOOKING_FEE */
  ReducedBookingFee = "REDUCED_BOOKING_FEE",
  /** UNLIMITED_OFFERINGS */
  UnlimitedOfferings = "UNLIMITED_OFFERINGS",
}

/** SubscriptionSilverTrainerBenefitsKeyEnum Variants */
export enum SubscriptionSilverTrainerBenefitsKeyEnum {
  /** ALL_BRONZE_FEATURES */
  AllBronzeFeatures = "ALL_BRONZE_FEATURES",
  /** CREATE_EVENTS */
  CreateEvents = "CREATE_EVENTS",
  /** POST_15_SELL_10_DAILIES */
  Post_15Sell_10Dailies = "POST_15_SELL_10_DAILIES",
  /** REDUCED_BOOKING_FEE */
  ReducedBookingFee = "REDUCED_BOOKING_FEE",
}

/** SubscriptionsTierEnum Variants */
export enum SubscriptionsTierEnum {
  /** BASIC */
  Basic = "BASIC",
  /** BRONZE */
  Bronze = "BRONZE",
  /** GOLD */
  Gold = "GOLD",
  /** SILVER */
  Silver = "SILVER",
}

/** SubscriptionsTypeEnum Variants */
export enum SubscriptionsTypeEnum {
  /** GYM_AND_FACILITIES */
  GymAndFacilities = "GYM_AND_FACILITIES",
  /** TRAINER */
  Trainer = "TRAINER",
}

/** SystemQuizzEnum Variants */
export enum SystemQuizzEnum {
  /** DISCOVER_YOUR_NEEDS */
  DiscoverYourNeeds = "DISCOVER_YOUR_NEEDS",
  /** DISPLAY_PREFERENCE */
  DisplayPreference = "DISPLAY_PREFERENCE",
  /** FAVORITE_TOPICS */
  FavoriteTopics = "FAVORITE_TOPICS",
  /** GENDER */
  Gender = "GENDER",
  /** GYM_TYPE */
  GymType = "GYM_TYPE",
  /** PERSONAL_GOAL */
  PersonalGoal = "PERSONAL_GOAL",
  /** UPLOAD_AVATAR */
  UploadAvatar = "UPLOAD_AVATAR",
}

export type TrainerDashboardStats = {
  __typename?: "TrainerDashboardStats";
  earn_last_thirty_days?: Maybe<Scalars["Float"]>;
  total_bookings?: Maybe<Scalars["Int"]>;
  total_earn?: Maybe<Scalars["Float"]>;
};

export type TrainerRate = {
  __typename?: "TrainerRate";
  front_price: Scalars["String"];
  id: Scalars["ID"];
  price: Scalars["Int"];
  products?: Maybe<Array<PaymentGatewayProduct>>;
  rate_type: TrainerRateType;
  title: Scalars["String"];
  user: User;
};

export enum TrainerRateType {
  HourlyRate = "HOURLY_RATE",
  RemoteHourlyRate = "REMOTE_HOURLY_RATE",
}

/** TrainerTypeEnum Variants */
export enum TrainerTypeEnum {
  /** BOTH */
  Both = "BOTH",
  /** FREELANCER */
  Freelancer = "FREELANCER",
  /** WORKING_IN_GYM */
  WorkingInGym = "WORKING_IN_GYM",
}

export type Training = {
  __typename?: "Training";
  address_string?: Maybe<Scalars["String"]>;
  created_at: Scalars["DateTime"];
  end_date: Scalars["DateTime"];
  id: Scalars["ID"];
  order: Order;
  start_date: Scalars["DateTime"];
  state: TrainingStatesEnum;
  trainer: User;
  user: User;
};

export type TrainingCheckinInput = {
  training_id: Scalars["ID"];
  user_id: Scalars["ID"];
};

export type TrainingFinishInput = {
  training_id: Scalars["ID"];
};

/** A paginated list of Training items. */
export type TrainingPaginator = {
  __typename?: "TrainingPaginator";
  /** A list of Training items. */
  data: Array<Training>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type TrainingStateChanged = {
  __typename?: "TrainingStateChanged";
  message: Scalars["String"];
  success: Scalars["Boolean"];
  training: Training;
};

/** TrainingStatesEnum Variants */
export enum TrainingStatesEnum {
  /** ACCEPTED */
  Accepted = "ACCEPTED",
  /** EXPIRED */
  Expired = "EXPIRED",
  /** FINISHED */
  Finished = "FINISHED",
  /** PENDING */
  Pending = "PENDING",
  /** REJECTED */
  Rejected = "REJECTED",
  /** STARTED */
  Started = "STARTED",
  /** WAITING_FOR_APPROVAL */
  WaitingForApproval = "WAITING_FOR_APPROVAL",
  /** WAIT_FOR_RESCHEDULE */
  WaitForReschedule = "WAIT_FOR_RESCHEDULE",
}

/** TrainingStatesForChangeEnum Variants */
export enum TrainingStatesForChangeEnum {
  /** ACCEPTED */
  Accepted = "ACCEPTED",
  /** REJECTED */
  Rejected = "REJECTED",
}

export type TrainingsFilterInput = {
  end_date?: InputMaybe<Scalars["DateTime"]>;
  start_date?: InputMaybe<Scalars["DateTime"]>;
  state?: InputMaybe<TrainingStatesEnum>;
  states?: InputMaybe<Array<InputMaybe<TrainingStatesEnum>>>;
};

/** TransactionStatesEnum Variants */
export enum TransactionStatesEnum {
  /** CANCELED */
  Canceled = "CANCELED",
  /** ERROR */
  Error = "ERROR",
  /** PENDING */
  Pending = "PENDING",
  /** REFUND */
  Refund = "REFUND",
  /** SUCCESS */
  Success = "SUCCESS",
  /** USER */
  User = "USER",
}

/** Specify if you want to include or exclude trashed results from a query. */
export enum Trashed {
  /** Only return trashed results. */
  Only = "ONLY",
  /** Return both trashed and non-trashed results. */
  With = "WITH",
  /** Only return non-trashed results. */
  Without = "WITHOUT",
}

export type UnfollowInput = {
  id: Scalars["ID"];
  type: FollowTypeEnum;
};

export type UpdateEventInput = {
  address?: InputMaybe<AddressInput>;
  amenities?: InputMaybe<Array<Scalars["ID"]>>;
  description?: InputMaybe<Scalars["String"]>;
  end_date?: InputMaybe<Scalars["DateTime"]>;
  equipments?: InputMaybe<Array<Scalars["ID"]>>;
  max_participants?: InputMaybe<Scalars["Int"]>;
  media?: InputMaybe<Array<MediaImageInput>>;
  price?: InputMaybe<Scalars["Float"]>;
  start_date?: InputMaybe<Scalars["DateTime"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type UpdateFacilityInput = {
  address?: InputMaybe<AddressInput>;
  amenities?: InputMaybe<Array<Scalars["ID"]>>;
  description?: InputMaybe<Scalars["String"]>;
  equipments?: InputMaybe<Array<Scalars["ID"]>>;
  media?: InputMaybe<Array<MediaImageInput>>;
  name: Scalars["String"];
};

export type UpdatePassword = {
  old_password: Scalars["String"];
  password: Scalars["String"];
  password_confirmation: Scalars["String"];
};

export type UpdatePasswordResponse = {
  __typename?: "UpdatePasswordResponse";
  message?: Maybe<Scalars["String"]>;
  status: Scalars["String"];
};

export type ManagerPassword = {
  email: Scalars["String"];
  password: Scalars["String"];
  password_confirmation: Scalars["String"];
};

export type ManagerPasswordResponse = {
  __typename?: "ManagerPasswordResponse";
  message?: Maybe<Scalars["String"]>;
  status: Scalars["String"];
};

export type UpdateTrainerWorkoutInput = {
  body_parts?: InputMaybe<Array<Scalars["ID"]>>;
  description?: InputMaybe<Scalars["String"]>;
  duration?: InputMaybe<Scalars["Int"]>;
  level?: InputMaybe<Scalars["ID"]>;
  media?: InputMaybe<Array<WorkoutVideosInput>>;
  preview?: InputMaybe<Scalars["StringOrUpload"]>;
  price?: InputMaybe<Scalars["Float"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type UpdateDailyInput = {
  body_parts?: InputMaybe<Array<Scalars["ID"]>>;
  description?: InputMaybe<Scalars["String"]>;
  duration?: InputMaybe<Scalars["Int"]>;
  level?: InputMaybe<Scalars["ID"]>;
  preview?: InputMaybe<Scalars["StringOrUpload"]>;
  video?: InputMaybe<Scalars["StringOrUpload"]>;
  price?: InputMaybe<Scalars["Float"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type UpdateUserInput = {
  address?: InputMaybe<AddressInput>;
  avatar?: InputMaybe<Scalars["StringOrUpload"]>;
  certificates?: InputMaybe<Array<DocumentUploadInput>>;
  email?: InputMaybe<Scalars["String"]>;
  facility_id?: InputMaybe<Scalars["ID"]>;
  first_name?: InputMaybe<Scalars["String"]>;
  front_settings?: InputMaybe<Scalars["JSON"]>;
  last_name?: InputMaybe<Scalars["String"]>;
  media?: InputMaybe<Array<MediaImageInput>>;
  opening_hours?: InputMaybe<Scalars["JSON"]>;
  role?: InputMaybe<RoleEnum>;
  settings?: InputMaybe<Array<SetSettingInput>>;
  trainer_type?: InputMaybe<TrainerTypeEnum>;
  weiver_and_labilities?: InputMaybe<Array<DocumentUploadInput>>;
};

export type CreateManagerInput = {
  address?: InputMaybe<AddressInput>;
  avatar?: InputMaybe<Scalars["StringOrUpload"]>;
  email?: InputMaybe<Scalars["String"]>;
  facility_id?: InputMaybe<Scalars["ID"]>;
  first_name?: InputMaybe<Scalars["String"]>;
  last_name?: InputMaybe<Scalars["String"]>;
  role?: InputMaybe<RoleEnum>;
  employment_type?: InputMaybe<EmploymentTypeEnum>;
  tax_id?: InputMaybe<Scalars["String"]>;
  postal?: InputMaybe<Scalars["String"]>;
  birth?: InputMaybe<Scalars["DateTime"]>;
};

export type User = {
  __typename?: "User";
  address?: Maybe<Address>;
  answers?: Maybe<Array<Maybe<QuizzAnswer>>>;
  avatar?: Maybe<Scalars["String"]>;
  avatarUrl?: Maybe<Scalars["String"]>;
  blocked_trainers?: Maybe<Array<User>>;
  certificates?: Maybe<Array<Document>>;
  checkins_count: Scalars["Int"];
  completed_trainings_count?: Maybe<Scalars["Int"]>;
  created_at?: Maybe<Scalars["DateTime"]>;
  currentSubscription: SubscriptionsTierEnum;
  done_workouts_count: Scalars["Int"];
  email?: Maybe<Scalars["String"]>;
  email_verified_at?: Maybe<Scalars["DateTime"]>;
  facilities?: Maybe<Array<Maybe<Facility>>>;
  facilityItemPasses?: Maybe<Array<Maybe<FacilityItemPass>>>;
  firebase_auth_token?: Maybe<Scalars["String"]>;
  first_name?: Maybe<Scalars["String"]>;
  front_settings?: Maybe<Scalars["JSON"]>;
  gender: GenderEnum;
  has_password?: Maybe<Scalars["Boolean"]>;
  id: Scalars["ID"];
  is_blocked?: Maybe<Scalars["Boolean"]>;
  is_followed?: Maybe<Scalars["Boolean"]>;
  last_name?: Maybe<Scalars["String"]>;
  left_reviews_count?: Maybe<Scalars["Int"]>;
  media?: Maybe<Array<Maybe<Media>>>;
  negative_reviews_count?: Maybe<Scalars["Int"]>;
  not_recommended_count?: Maybe<Scalars["Int"]>;
  opening_hours?: Maybe<Scalars["JSON"]>;
  owned_facilities?: Maybe<Array<Maybe<Facility>>>;
  positive_reviews_count?: Maybe<Scalars["Int"]>;
  quizzes?: Maybe<Array<Maybe<Quizz>>>;
  recommended_count?: Maybe<Scalars["Int"]>;
  reviews_count?: Maybe<Scalars["Int"]>;
  role?: Maybe<RoleEnum>;
  score?: Maybe<Scalars["Float"]>;
  settings?: Maybe<Array<UserSetting>>;
  trainerRates?: Maybe<Array<Maybe<TrainerRate>>>;
  trainer_dashboard_stats?: Maybe<TrainerDashboardStats>;
  trainer_type?: Maybe<TrainerTypeEnum>;
  trainer_workouts?: Maybe<Array<Maybe<Workout>>>;
  trainings_count: Scalars["Int"];
  updated_at: Scalars["DateTime"];
  was_commented_by_me?: Maybe<Scalars["Boolean"]>;
  was_visited_by_me?: Maybe<Scalars["Boolean"]>;
  weiver_and_labilities?: Maybe<Array<Document>>;
  workouts?: Maybe<Array<Maybe<Workout>>>;
};

export type UserSettingsArgs = {
  setting_codes?: InputMaybe<Array<InputMaybe<SettingsCodeEnum>>>;
};

/** A paginated list of User items. */
export type UserPaginator = {
  __typename?: "UserPaginator";
  /** A list of User items. */
  data: Array<User>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type UserSetting = {
  __typename?: "UserSetting";
  setting?: Maybe<Setting>;
  user?: Maybe<User>;
  value?: Maybe<Scalars["Mixed"]>;
};

export type UsersAvailabilityFilter = {
  date_from?: InputMaybe<Scalars["DateTime"]>;
  date_to?: InputMaybe<Scalars["DateTime"]>;
};

export type VerifyEmailInput = {
  token: Scalars["String"];
};

/** Dynamic WHERE conditions for queries. */
export type WhereConditions = {
  /** A set of conditions that requires all conditions to match. */
  AND?: InputMaybe<Array<WhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: InputMaybe<WhereConditionsRelation>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: InputMaybe<Array<WhereConditions>>;
  /** The column that is used for the condition. */
  column?: InputMaybe<Scalars["String"]>;
  /** The operator that is used for the condition. */
  operator?: InputMaybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: InputMaybe<Scalars["Mixed"]>;
};

/** Dynamic HAS conditions for WHERE condition queries. */
export type WhereConditionsRelation = {
  /** The amount to test. */
  amount?: InputMaybe<Scalars["Int"]>;
  /** Additional condition logic. */
  condition?: InputMaybe<WhereConditions>;
  /** The comparison operator to test against the amount. */
  operator?: InputMaybe<SqlOperator>;
  /** The relation that is checked. */
  relation: Scalars["String"];
};

export type Workout = {
  __typename?: "Workout";
  bodyParts?: Maybe<Array<Maybe<BodyPart>>>;
  created_at: Scalars["DateTime"];
  description?: Maybe<Scalars["String"]>;
  duration?: Maybe<Scalars["Int"]>;
  exercises?: Maybe<Array<WorkoutExercise>>;
  front_price: Scalars["String"];
  id: Scalars["ID"];
  media?: Maybe<Array<Maybe<Media>>>;
  preview?: Maybe<Scalars["String"]>;
  previewUrl?: Maybe<Scalars["String"]>;
  video?: Maybe<Scalars["String"]>;
  videoUrl?: Maybe<Scalars["String"]>;
  price: Scalars["Int"];
  products?: Maybe<Array<PaymentGatewayProduct>>;
  state: WorkoutStatesEnum;
  title: Scalars["String"];
  trainer: User;
  type?: Maybe<WorkoutType>;
  updated_at: Scalars["DateTime"];
  was_ordered_by_me?: Maybe<Scalars["Boolean"]>;
};

export type WorkoutExercise = {
  __typename?: "WorkoutExercise";
  access: MediaAccessEnum;
  description?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  path: Scalars["String"];
  pathUrl: Scalars["String"];
  preview?: Maybe<Scalars["String"]>;
  previewUrl?: Maybe<Scalars["String"]>;
  title: Scalars["String"];
};

/** A paginated list of Workout items. */
export type WorkoutPaginator = {
  __typename?: "WorkoutPaginator";
  /** A list of Workout items. */
  data: Array<Workout>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** WorkoutStatesEnum Variants */
export enum WorkoutStatesEnum {
  /** ACTIVE */
  Active = "ACTIVE",
  /** HIDDEN */
  Hidden = "HIDDEN",
}

export type WorkoutType = {
  __typename?: "WorkoutType";
  created_at: Scalars["DateTime"];
  icon?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  name: Scalars["String"];
  updated_at: Scalars["DateTime"];
};

/** A paginated list of WorkoutType items. */
export type WorkoutTypePaginator = {
  __typename?: "WorkoutTypePaginator";
  /** A list of WorkoutType items. */
  data: Array<WorkoutType>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type WorkoutVideosInput = {
  access?: InputMaybe<MediaAccessEnum>;
  description?: InputMaybe<Scalars["String"]>;
  file: Scalars["StringOrUpload"];
  id?: InputMaybe<Scalars["ID"]>;
  preview?: InputMaybe<Scalars["StringOrUpload"]>;
  title: Scalars["String"];
};

export type AttachToFacilityMutationVariables = Exact<{
  input: AttachToFacilityInput;
}>;

export type AttachToFacilityMutation = {
  __typename?: "Mutation";
  attachToFacility: { __typename?: "User"; id: string };
};

export type CreateFacilityMutationVariables = Exact<{
  input: CreateFacilityInput;
}>;

export type CreateFacilityItemMutationVariables = Exact<{
  input: CreateFacilityItemInput;
}>;

export type CreateFacilityMutation = {
  __typename?: "Mutation";
  createFacility: {
    __typename?: "Facility";
    id: string;
    name: string;
    description: string;
    score?: number | null;
    equipments?: Array<{
      __typename?: "Equipment";
      name?: string | null;
      iconUrl?: string | null;
    } | null> | null;
    amenities?: Array<{
      __typename?: "Amenity";
      name?: string | null;
      iconUrl?: string | null;
    } | null> | null;
    organization: {
      __typename?: "Organization";
      id: string;
      name: string;
      email: string;
    };
  };
};

export type CheckOrganizationRegistrationCodeQueryVariables = Exact<{
  code: Scalars["String"];
}>;

export type CheckOrganizationRegistrationCodeQuery = {
  __typename?: "Query";
  checkOrganizationRegistrationCode: {
    __typename?: "Organization";
    id: string;
    name: string;
  };
};

export type UpdateUserRoleMutationVariables = Exact<{
  id: Scalars["ID"];
  role?: InputMaybe<RoleEnum>;
}>;

export type UpdateUserRoleMutation = {
  __typename?: "Mutation";
  updateUser: { __typename?: "User"; id: string; role?: RoleEnum | null };
};

export type AddFacilityItemToCartMutationVariables = Exact<{
  input: AddFacilityItemToCartInput;
}>;

export type AddFacilityItemToCartMutation = {
  __typename?: "Mutation";
  addFacilityItemToCart?: {
    __typename?: "Cart";
    id: string;
    type: PurchasableProductsEnum;
    discount: number;
    start_date?: any | null;
    end_date?: any | null;
    total: number;
    sub_total: number;
    front_total: string;
    user: { __typename?: "User"; email?: string | null };
    items?: Array<{
      __typename?: "CartItem";
      id: string;
      productable:
        | { __typename?: "Event"; id: string; title: string }
        | { __typename?: "FacilityItem"; id: string; title: string }
        | { __typename?: "TrainerRate"; front_price: string }
        | { __typename?: "Workout"; id: string; title: string };
    } | null> | null;
  } | null;
};

export type AddToCartMutationVariables = Exact<{
  input: AddToCartInput;
}>;

export type AddToCartMutation = {
  __typename?: "Mutation";
  addToCart?: {
    __typename?: "Cart";
    id: string;
    type: PurchasableProductsEnum;
    discount: number;
    total: number;
    sub_total: number;
    front_total: string;
    user: { __typename?: "User"; email?: string | null };
    items?: Array<{
      __typename?: "CartItem";
      id: string;
      productable:
        | { __typename?: "Event"; id: string; title: string }
        | { __typename?: "FacilityItem"; id: string; title: string }
        | { __typename?: "TrainerRate"; front_price: string }
        | { __typename?: "Workout"; id: string; title: string };
    } | null> | null;
  } | null;
};

export type AddTrainingToCartMutationVariables = Exact<{
  input: AddTrainingToCartInput;
}>;

export type AddTrainingToCartMutation = {
  __typename?: "Mutation";
  addTrainingToCart?: {
    __typename?: "Cart";
    id: string;
    type: PurchasableProductsEnum;
    discount: number;
    start_date?: any | null;
    end_date?: any | null;
    total: number;
    sub_total: number;
    front_total: string;
    user: { __typename?: "User"; email?: string | null };
    items?: Array<{
      __typename?: "CartItem";
      id: string;
      productable:
        | { __typename?: "Event"; id: string; title: string }
        | { __typename?: "FacilityItem"; id: string; title: string }
        | {
            __typename?: "TrainerRate";
            id: string;
            title: string;
            front_price: string;
          }
        | { __typename?: "Workout"; id: string; title: string };
    } | null> | null;
  } | null;
};

export type ChangeTrainingStateMutationVariables = Exact<{
  input: ChangeTrainingState;
}>;

export type ChangeTrainingStateMutation = {
  __typename?: "Mutation";
  changeTrainingState: {
    __typename?: "TrainingStateChanged";
    success: boolean;
    message: string;
    training: { __typename?: "Training"; id: string };
  };
};

export type CheckinByPassMutationVariables = Exact<{
  input?: InputMaybe<CheckinByPassInput>;
}>;

export type CheckinByPassMutation = {
  __typename?: "Mutation";
  checkinByPass: {
    __typename?: "FacilityItemPass";
    id: string;
    user: {
      __typename?: "User";
      first_name?: string | null;
      last_name?: string | null;
    };
  };
};

export type ClearCartMutationVariables = Exact<{
  input: ClearCartInput;
}>;

export type ClearCartMutation = {
  __typename?: "Mutation";
  clearCart?: {
    __typename?: "Cart";
    id: string;
    type: PurchasableProductsEnum;
    discount: number;
    start_date?: any | null;
    end_date?: any | null;
    total: number;
    sub_total: number;
    front_total: string;
    user: { __typename?: "User"; email?: string | null };
    items?: Array<{
      __typename?: "CartItem";
      id: string;
      productable:
        | { __typename?: "Event"; id: string; title: string }
        | { __typename?: "FacilityItem"; id: string; title: string }
        | { __typename?: "TrainerRate"; front_price: string }
        | { __typename?: "Workout"; id: string; title: string };
    } | null> | null;
  } | null;
};

export type CreateCartMutationVariables = Exact<{
  input: CreateCartInput;
}>;

export type CreateCartMutation = {
  __typename?: "Mutation";
  createCart?: { __typename?: "Cart"; id: string } | null;
};

export type CreateChatMutationVariables = Exact<{
  participant_id: Scalars["ID"];
}>;

export type CreateChatMutation = {
  __typename?: "Mutation";
  createChat: { __typename?: "Chat"; id: string };
};

export type CreateDeviceTokenMutationVariables = Exact<{
  token: Scalars["String"];
}>;

export type CreateDeviceTokenMutation = {
  __typename?: "Mutation";
  createDeviceToken: { __typename?: "DeviceToken"; id: string };
};

export type CreateEventMutationVariables = Exact<{
  input: CreateEventInput;
}>;

export type CreateEventMutation = {
  __typename?: "Mutation";
  createEvent?: { __typename?: "Event"; id: string } | null;
};

export type DeleteChatMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DeleteChatMutation = {
  __typename?: "Mutation";
  deleteChat: { __typename?: "Chat"; id: string };
};

export type DeleteDocumentMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DeleteDocumentMutation = {
  __typename?: "Mutation";
  deleteDocument: { __typename?: "Document"; id: string };
};

export type DeleteEventMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DeleteEventMutation = {
  __typename?: "Mutation";
  deleteEvent: { __typename?: "Event"; id: string };
};

export type DeleteMediaMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DeleteMediaMutation = {
  __typename?: "Mutation";
  deleteMedia: { __typename?: "Media"; id: string };
};

export type DeleteMessageMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DeleteMessageMutation = {
  __typename?: "Mutation";
  deleteMessage: { __typename?: "ChatMessage"; id: string };
};

export type DeleteProfileMutationVariables = Exact<{ [key: string]: never }>;

export type DeleteProfileMutation = {
  __typename?: "Mutation";
  deleteProfile: {
    __typename?: "DeleteProfileResponse";
    status: OperationStatusEnum;
  };
};

export type DetachCardMutationVariables = Exact<{
  card_id: Scalars["ID"];
}>;

export type DetachCardMutation = {
  __typename?: "Mutation";
  detachCard: {
    __typename?: "CardDetached";
    success: boolean;
    message: string;
  };
};

export type FollowMutationVariables = Exact<{
  id: Scalars["ID"];
  type: FollowTypeEnum;
}>;

export type FollowMutation = {
  __typename?: "Mutation";
  follow:
    | { __typename?: "Facility"; id: string }
    | { __typename?: "User"; id: string };
};

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars["String"];
}>;

export type ForgotPasswordMutation = {
  __typename?: "Mutation";
  forgotPassword: {
    __typename?: "ForgotPasswordResponse";
    status: string;
    message?: string | null;
  };
};

export type LeftFeedbackMutationVariables = Exact<{
  input: LeftFeedbackInput;
}>;

export type LeftFeedbackMutation = {
  __typename?: "Mutation";
  leftFeedback?: {
    __typename?: "RegularOperation";
    state?: OperationResponseStatusEnum | null;
    message?: string | null;
  } | null;
};

export type LoginMutationVariables = Exact<{
  username: Scalars["String"];
  password: Scalars["String"];
}>;

export type LoginMutation = {
  __typename?: "Mutation";
  login: {
    __typename?: "AuthPayload";
    access_token?: string | null;
    refresh_token?: string | null;
    expires_in?: number | null;
    user?: {
      __typename?: "User";
      firebase_auth_token?: string | null;
      id: string;
      email?: string | null;
      role?: RoleEnum | null;
      first_name?: string | null;
      last_name?: string | null;
      created_at?: any | null;
      email_verified_at?: any | null;
      front_settings?: any | null;
      trainer_type?: TrainerTypeEnum | null;
      currentSubscription: SubscriptionsTierEnum;
      facilities?: Array<{
        __typename?: "Facility";
        id: string;
        address?: {
          __typename?: "Address";
          lat?: number | null;
          lng?: number | null;
          street?: string | null;
          extra?: string | null;
        } | null;
      } | null> | null;
      owned_facilities?: Array<{
        __typename?: "Facility";
        id: string;
        address?: {
          __typename?: "Address";
          lat?: number | null;
          lng?: number | null;
          street?: string | null;
          extra?: string | null;
        } | null;
      } | null> | null;
    } | null;
  };
};

export type PayWithPaypalMutationVariables = Exact<{
  nonce: Scalars["String"];
  cart_id: Scalars["ID"];
}>;

export type PayWithPaypalMutation = {
  __typename?: "Mutation";
  payWithPaypal: { __typename?: "PaypalPaymentResult"; result: string };
};

export type PaymentGatewayRefundMutationVariables = Exact<{
  input: RefundInput;
}>;

export type PaymentGatewayRefundMutation = {
  __typename?: "Mutation";
  paymentGatewayRefund: {
    __typename?: "Refund";
    success: boolean;
    message?: string | null;
  };
};

export type ReadMessageMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type ReadMessageMutation = {
  __typename?: "Mutation";
  readMessage: { __typename?: "ChatMessage"; id: string };
};

export type RemoveFromCartMutationVariables = Exact<{
  input: RemoveFromCartInput;
}>;

export type RemoveFromCartMutation = {
  __typename?: "Mutation";
  removeFromCart?: {
    __typename?: "Cart";
    id: string;
    type: PurchasableProductsEnum;
    discount: number;
    start_date?: any | null;
    end_date?: any | null;
    total: number;
    sub_total: number;
    front_total: string;
    user: { __typename?: "User"; email?: string | null };
    items?: Array<{
      __typename?: "CartItem";
      id: string;
      productable:
        | { __typename?: "Event"; id: string; title: string }
        | { __typename?: "FacilityItem"; id: string; title: string }
        | { __typename?: "TrainerRate"; front_price: string }
        | { __typename?: "Workout"; id: string; title: string };
    } | null> | null;
  } | null;
};

export type SendMessageMutationVariables = Exact<{
  chat_id: Scalars["ID"];
  input: ChatMessageInput;
}>;

export type SendMessageMutation = {
  __typename?: "Mutation";
  sendMessage: { __typename?: "ChatMessage"; id: string };
};

export type SocialLoginMutationVariables = Exact<{
  token: Scalars["String"];
  provider: SocialProvidersEnum;
}>;

export type SocialLoginMutation = {
  __typename?: "Mutation";
  socialLogin: {
    __typename?: "AuthPayload";
    access_token?: string | null;
    refresh_token?: string | null;
    expires_in?: number | null;
    user?: {
      __typename?: "User";
      firebase_auth_token?: string | null;
      id: string;
      email?: string | null;
      role?: RoleEnum | null;
      first_name?: string | null;
      last_name?: string | null;
      created_at?: any | null;
      email_verified_at?: any | null;
      front_settings?: any | null;
      trainer_type?: TrainerTypeEnum | null;
      currentSubscription: SubscriptionsTierEnum;
      facilities?: Array<{
        __typename?: "Facility";
        id: string;
        address?: {
          __typename?: "Address";
          lat?: number | null;
          lng?: number | null;
          street?: string | null;
          extra?: string | null;
        } | null;
      } | null> | null;
      owned_facilities?: Array<{
        __typename?: "Facility";
        id: string;
        address?: {
          __typename?: "Address";
          lat?: number | null;
          lng?: number | null;
          street?: string | null;
          extra?: string | null;
        } | null;
      } | null> | null;
    } | null;
  };
};

export type ChangePaymentMethodMutationVariables = Exact<{
  card_id: Scalars["ID"];
}>;

export type ChangePaymentMethodMutation = {
  __typename?: "Mutation";
  changePaymentMethod?: {
    __typename?: "StripeCard";
    id: number;
    pm_last_four: number;
    brand: string;
    exp_year: number;
    exp_month: number;
    is_default: boolean;
  } | null;
};

export type PaymentIntentMutationVariables = Exact<{
  purchasable_product_id: Scalars["ID"];
  cart_id: Scalars["ID"];
}>;

export type PaymentIntentMutation = {
  __typename?: "Mutation";
  paymentIntent: {
    __typename?: "PaymentIntent";
    session?: string | null;
    zeroPayment: boolean;
  };
};
export type CreateSubscriptionIntentMutation = {
  __typename?: "Mutation";
  createSubscriptionIntent: {
    __typename?: "CreateSubscriptionIntent";
    session?: string | null;
  };
};

export type UpdateFirstSubscriptionInput = {
  facility_id?: InputMaybe<Scalars["ID"]>;
};

export type TrainingCheckinMutationVariables = Exact<{
  input: TrainingCheckinInput;
}>;

export type TrainingCheckinMutation = {
  __typename?: "Mutation";
  trainingCheckin: {
    __typename?: "Training";
    id: string;
    user: {
      __typename?: "User";
      first_name?: string | null;
      last_name?: string | null;
    };
  };
};

export type TrainingFinishMutationVariables = Exact<{
  input: TrainingFinishInput;
}>;

export type TrainingFinishMutation = {
  __typename?: "Mutation";
  trainingFinish: {
    __typename?: "Training";
    id: string;
    user: {
      __typename?: "User";
      first_name?: string | null;
      last_name?: string | null;
    };
  };
};

export type UnfollowMutationVariables = Exact<{
  id: Scalars["ID"];
  type: FollowTypeEnum;
}>;

export type UnfollowMutation = {
  __typename?: "Mutation";
  unfollow:
    | { __typename?: "Facility"; id: string }
    | { __typename?: "User"; id: string };
};

export type UpdateEventMutationVariables = Exact<{
  id: Scalars["ID"];
  input: UpdateEventInput;
}>;

export type UpdateEventMutation = {
  __typename?: "Mutation";
  updateEvent?: { __typename?: "Event"; id: string } | null;
};

export type UpdateFacilityMutationVariables = Exact<{
  id: Scalars["ID"];
  input: UpdateFacilityInput;
}>;

export type UpdateFacilityMutation = {
  __typename?: "Mutation";
  updateFacility?: { __typename?: "Facility"; id: string } | null;
};

export type UpdateForgottenPasswordMutationVariables = Exact<{
  email: Scalars["String"];
  token: Scalars["String"];
  password: Scalars["String"];
  password_confirmation: Scalars["String"];
}>;

export type UpdateForgottenPasswordMutation = {
  __typename?: "Mutation";
  updateForgottenPassword: {
    __typename?: "ForgotPasswordResponse";
    status: string;
    message?: string | null;
  };
};

export type UpdatePasswordMutationVariables = Exact<{
  input: UpdatePassword;
}>;

export type UpdatePasswordMutation = {
  __typename?: "Mutation";
  updatePassword: {
    __typename?: "UpdatePasswordResponse";
    status: string;
    message?: string | null;
  };
};

export type UpdateUserMutationVariables = Exact<{
  id: Scalars["ID"];
  input: UpdateUserInput;
}>;

export type UpdateUserMutation = {
  __typename?: "Mutation";
  updateUser: { __typename?: "User"; id: string };
};

export type UpdateUserEmailMutationVariables = Exact<{
  id: Scalars["ID"];
  email?: InputMaybe<Scalars["String"]>;
}>;

export type UpdateUserEmailMutation = {
  __typename?: "Mutation";
  updateUser: { __typename?: "User"; id: string };
};

export type UpdateUserNameMutationVariables = Exact<{
  id: Scalars["ID"];
  first_name?: InputMaybe<Scalars["String"]>;
  last_name?: InputMaybe<Scalars["String"]>;
}>;

export type UpdateUserNameMutation = {
  __typename?: "Mutation";
  updateUser: {
    __typename?: "User";
    id: string;
    first_name?: string | null;
    last_name?: string | null;
  };
};

export type UpdateUserSettingsMutationVariables = Exact<{
  id: Scalars["ID"];
  front_settings?: InputMaybe<Scalars["JSON"]>;
}>;

export type UpdateUserSettingsMutation = {
  __typename?: "Mutation";
  updateUser: { __typename?: "User"; id: string };
};

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars["String"];
}>;

export type VerifyEmailMutation = {
  __typename?: "Mutation";
  verifyEmail: {
    __typename?: "AuthPayload";
    access_token?: string | null;
    refresh_token?: string | null;
    expires_in?: number | null;
    user?: {
      __typename?: "User";
      id: string;
      email?: string | null;
      role?: RoleEnum | null;
      first_name?: string | null;
      last_name?: string | null;
      email_verified_at?: any | null;
      front_settings?: any | null;
      facilities?: Array<{
        __typename?: "Facility";
        address?: {
          __typename?: "Address";
          lat?: number | null;
          lng?: number | null;
          street?: string | null;
          extra?: string | null;
        } | null;
      } | null> | null;
    } | null;
  };
};

export type ActivitiesQueryVariables = Exact<{
  search?: InputMaybe<Scalars["String"]>;
  near?: InputMaybe<NearFilter>;
  limitPerUnit?: InputMaybe<Scalars["Int"]>;
}>;

export type ActivitiesQuery = {
  __typename?: "Query";
  activities: Array<
    | {
        __typename: "Facility";
        id: string;
        name: string;
        media?: Array<{ __typename?: "Media"; pathUrl: string } | null> | null;
        organization: { __typename?: "Organization"; name: string };
        address?: {
          __typename?: "Address";
          lat?: number | null;
          lng?: number | null;
          street?: string | null;
        } | null;
      }
    | {
        __typename: "User";
        id: string;
        first_name?: string | null;
        last_name?: string | null;
        pathUrl?: string | null;
        facilities?: Array<{
          __typename?: "Facility";
          address?: { __typename?: "Address"; street?: string | null } | null;
        } | null> | null;
      }
    | {
        __typename: "Workout";
        id: string;
        title: string;
        description?: string | null;
        pathUrl?: string | null;
        type?: { __typename?: "WorkoutType"; id: string; name: string } | null;
      }
  >;
};

export type AmenitiesQueryVariables = Exact<{
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
}>;

export type AmenitiesQuery = {
  __typename?: "Query";
  amenities?: {
    __typename?: "AmenityPaginator";
    data: Array<{
      __typename?: "Amenity";
      id: string;
      name?: string | null;
      icon?: string | null;
      iconUrl?: string | null;
    }>;
  } | null;
};

export type AppleGooglePaymentIntentQueryVariables = Exact<{
  provider: PaymentProvidersEnum;
  cart_id: Scalars["ID"];
}>;

export type AppleGooglePaymentIntentQuery = {
  __typename?: "Query";
  appleGooglePaymentIntent: {
    __typename?: "AppleGooglePaymentIntent";
    customerId: string;
    paymentIntent: string;
  };
};

export type CitiesQueryVariables = Exact<{
  name?: InputMaybe<Scalars["String"]>;
  country_id?: InputMaybe<Scalars["ID"]>;
  state_id?: InputMaybe<Scalars["ID"]>;
  state_code?: InputMaybe<Scalars["String"]>;
  first: Scalars["Int"];
  page?: InputMaybe<Scalars["Int"]>;
}>;

export type CitiesQuery = {
  __typename?: "Query";
  cities?: {
    __typename?: "CityPaginator";
    data: Array<{
      __typename?: "City";
      id: string;
      name?: string | null;
      state: { __typename?: "State"; id: string; name?: string | null };
      country: { __typename?: "Country"; id: string; name?: string | null };
    }>;
    paginatorInfo: { __typename?: "PaginatorInfo"; total: number };
  } | null;
};

export type CountriesQueryVariables = Exact<{
  name?: InputMaybe<Scalars["String"]>;
  first: Scalars["Int"];
  page?: InputMaybe<Scalars["Int"]>;
}>;

export type CountriesQuery = {
  __typename?: "Query";
  countries?: {
    __typename?: "CountryPaginator";
    data: Array<{ __typename?: "Country"; id: string; name?: string | null }>;
    paginatorInfo: { __typename?: "PaginatorInfo"; total: number };
  } | null;
};

export type DashboardWidgetQueryVariables = Exact<{ [key: string]: never }>;

export type DashboardWidgetQuery = {
  __typename?: "Query";
  me: {
    __typename?: "User";
    completed_trainings_count?: number | null;
    checkins_count: number;
    reviews_count?: number | null;
    positive_reviews_count?: number | null;
    negative_reviews_count?: number | null;
    recommended_count?: number | null;
    left_reviews_count?: number | null;
    trainings_count: number;
    trainer_dashboard_stats?: {
      __typename?: "TrainerDashboardStats";
      total_earn?: number | null;
      earn_last_thirty_days?: number | null;
      total_bookings?: number | null;
    } | null;
  };
};

export type FacilityDashboardWidgetQueryVariables = Exact<{
  [key: string]: never;
}>;
export type FacilityDashboardWidgetQuery = {
  __typename?: "Query";
  facilityDashboardWidget: {
    __typename?: "dashboard";
    event_count?: number | null;
    message_count?: number | null;
    expiring_membership_count?: number | null;
    today_earn?: number | null;
    earn_last_thirty_days?: number | null;
    year_earn?: number | null;
  };
};

export type EquipmentsQueryVariables = Exact<{
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
}>;

export type EquipmentsQuery = {
  __typename?: "Query";
  equipments?: {
    __typename?: "EquipmentPaginator";
    data: Array<{
      __typename?: "Equipment";
      id: string;
      name?: string | null;
      icon?: string | null;
      iconUrl?: string | null;
    }>;
  } | null;
};

export type EventQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type EventQuery = {
  __typename?: "Query";
  event: {
    __typename?: "Event";
    id: string;
    title: string;
    description?: string | null;
    start_date?: any | null;
    end_date?: any | null;
    price: number;
    front_price: string;
    max_participants: number;
    booked_count?: number | null;
    was_ordered_by_me?: boolean | null;
    trainer?: {
      __typename?: "User";
      id: string;
      avatarUrl?: string | null;
      first_name?: string | null;
      last_name?: string | null;
      score?: number | null;
      address?: { __typename?: "Address"; street?: string | null } | null;
      facilities?: Array<{
        __typename?: "Facility";
        address?: { __typename?: "Address"; street?: string | null } | null;
      } | null> | null;
      settings?: Array<{
        __typename?: "UserSetting";
        value?: any | null;
        setting?: { __typename?: "Setting"; code: SettingsCodeEnum } | null;
      }> | null;
    } | null;
    facility?: {
      __typename?: "Facility";
      id: string;
      name: string;
      score?: number | null;
      media?: Array<{ __typename?: "Media"; pathUrl: string } | null> | null;
      address?: { __typename?: "Address"; street?: string | null } | null;
    } | null;
    address?: { __typename?: "Address"; street?: string | null } | null;
    media?: Array<{
      __typename?: "Media";
      id: string;
      pathUrl: string;
    } | null> | null;
    equipments?: Array<{
      __typename?: "Equipment";
      id: string;
      name?: string | null;
      icon?: string | null;
      iconUrl?: string | null;
    }> | null;
    amenities?: Array<{
      __typename?: "Amenity";
      id: string;
      name?: string | null;
      icon?: string | null;
      iconUrl?: string | null;
    }> | null;
    products?: Array<{
      __typename?: "PaymentGatewayProduct";
      product_id: string;
      price: number;
    } | null> | null;
  };
};

export type EventsQueryVariables = Exact<{
  title?: InputMaybe<Scalars["String"]>;
  near?: InputMaybe<NearFilter>;
  start_date?: InputMaybe<DateTimeRange>;
  end_date?: InputMaybe<DateTimeRange>;
  created_by_trainer?: InputMaybe<Scalars["ID"]>;
  created_by_facility?: InputMaybe<Scalars["ID"]>;
  orderBy?: InputMaybe<
    Array<QueryEventsOrderByOrderByClause> | QueryEventsOrderByOrderByClause
  >;
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
  ownedByUser?: InputMaybe<Scalars["ID"]>;
}>;

export type EventsQuery = {
  __typename?: "Query";
  events?: {
    __typename?: "EventPaginator";
    data: Array<{
      __typename?: "Event";
      description?: string | null;
      end_date?: any | null;
      id: string;
      max_participants: number;
      was_ordered_by_me?: boolean | null;
      price: number;
      start_date?: any | null;
      title: string;
      address?: {
        __typename?: "Address";
        lat?: number | null;
        lng?: number | null;
        street?: string | null;
      } | null;
      amenities?: Array<{
        __typename?: "Amenity";
        icon?: string | null;
        iconUrl?: string | null;
        name?: string | null;
      }> | null;
      equipments?: Array<{
        __typename?: "Equipment";
        icon?: string | null;
        iconUrl?: string | null;
        name?: string | null;
      }> | null;
      media?: Array<{ __typename?: "Media"; pathUrl: string } | null> | null;
    }>;
    paginatorInfo: { __typename?: "PaginatorInfo"; total: number };
  } | null;
};

export type FacilitiesQueryVariables = Exact<{
  near?: InputMaybe<NearFilter>;
  search?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  name?: InputMaybe<Scalars["String"]>;
  page?: InputMaybe<Scalars["Int"]>;
  city_id?: InputMaybe<Scalars["ID"]>;
  state_id?: InputMaybe<Scalars["ID"]>;
  organization_id?: InputMaybe<Scalars["ID"]>;
  is_followed?: InputMaybe<Scalars["Boolean"]>;
}>;

export type FacilitiesQuery = {
  __typename?: "Query";
  facilities?: {
    __typename?: "FacilityPaginator";
    data: Array<{
      __typename?: "Facility";
      id: string;
      name: string;
      score?: number | null;
      is_followed?: boolean | null;
      media?: Array<{
        __typename?: "Media";
        path: string;
        pathUrl: string;
      } | null> | null;
      address?: {
        __typename?: "Address";
        lat?: number | null;
        lng?: number | null;
        street?: string | null;
      } | null;
      productItems?: Array<{
        __typename?: "FacilityItem";
        id: string;
        qr_code_lifetime_value?: number | null;
        qr_code_lifetime_enum: string;
        checkin_counter?: number | null;
        is_unlimited_checkin: boolean;
        title: string;
        product_id: string;
        price: number;
        products?: Array<{
          __typename?: "PaymentGatewayProduct";
          provider: string;
          price: number;
          product_id: string;
          duration?: string | null;
          currency: string;
          start_date?: any | null;
          end_date?: any | null;
          checkin_number?: string | null;
          state: string;
          gatewayProductable?:
            | {
                __typename?: "PaypalProduct";
                id?: string | null;
                name: string;
                product_id: string;
                price_id?: string | null;
                unit_amount: number;
                currency: string;
                active: boolean;
              }
            | {
                __typename?: "StripeProduct";
                id?: string | null;
                name: string;
                product_id: string;
                price_id?: string | null;
                unit_amount: number;
                currency: string;
                active: boolean;
              }
            | null;
        } | null> | null;
      } | null> | null;
    }>;
    paginatorInfo: {
      __typename?: "PaginatorInfo";
      total: number;
      firstItem?: number | null;
    };
  } | null;
};

export type FacilityQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type FacilityQuery = {
  __typename?: "Query";
  facility?: {
    __typename?: "Facility";
    created_at: any;
    id: string;
    is_followed?: boolean | null;
    name: string;
    score?: number | null;
    description: string;
    not_recommended_count?: number | null;
    recommended_count?: number | null;
    reviews_count?: number | null;
    positive_reviews_count?: number | null;
    negative_reviews_count?: number | null;
    address?: {
      __typename?: "Address";
      lat?: number | null;
      lng?: number | null;
      street?: string | null;
    } | null;
    equipments?: Array<{
      __typename?: "Equipment";
      name?: string | null;
      id: string;
    } | null> | null;
    media?: Array<{
      __typename?: "Media";
      path: string;
      pathUrl: string;
    } | null> | null;
    amenities?: Array<{
      __typename?: "Amenity";
      id: string;
      name?: string | null;
      icon?: string | null;
      iconUrl?: string | null;
    } | null> | null;
    productItems?: Array<{
      __typename?: "FacilityItem";
      id: string;
      qr_code_lifetime_value?: number | null;
      qr_code_lifetime_enum: string;
      checkin_counter?: number | null;
      is_unlimited_checkin: boolean;
      title: string;
      product_id: string;
      price: number;
      front_price: string;
      description: string;
      products?: Array<{
        __typename?: "PaymentGatewayProduct";
        provider: string;
        price: number;
        product_id: string;
        duration?: string | null;
        currency: string;
        start_date?: any | null;
        end_date?: any | null;
        checkin_number?: string | null;
        state: string;
        gatewayProductable?:
          | {
              __typename?: "PaypalProduct";
              id?: string | null;
              name: string;
              product_id: string;
              price_id?: string | null;
              unit_amount: number;
              currency: string;
              active: boolean;
            }
          | {
              __typename?: "StripeProduct";
              id?: string | null;
              name: string;
              product_id: string;
              price_id?: string | null;
              unit_amount: number;
              currency: string;
              active: boolean;
            }
          | null;
      } | null> | null;
    } | null> | null;
  } | null;
};

export type FacilityItemPassQueryVariables = Exact<{
  id?: InputMaybe<Scalars["ID"]>;
}>;

export type FacilityItemPassQuery = {
  __typename?: "Query";
  facilityItemPass: {
    __typename?: "FacilityItemPass";
    id: string;
    start_date: any;
    end_date: any;
    is_active_pass: boolean;
    order: { __typename?: "Order"; front_total: string };
    facilityItem: {
      __typename?: "FacilityItem";
      title: string;
      description: string;
      facility: {
        __typename?: "Facility";
        id: string;
        name: string;
        score?: number | null;
        media?: Array<{ __typename?: "Media"; pathUrl: string } | null> | null;
        address?: { __typename?: "Address"; street?: string | null } | null;
      };
    };
    user: {
      __typename?: "User";
      id: string;
      first_name?: string | null;
      last_name?: string | null;
      avatarUrl?: string | null;
      positive_reviews_count?: number | null;
      negative_reviews_count?: number | null;
      address?: { __typename?: "Address"; street?: string | null } | null;
    };
  };
};

export type General_DocumentQueryVariables = Exact<{
  code: GeneralDocumentsEnum;
}>;

export type General_DocumentQuery = {
  __typename?: "Query";
  general_document: { __typename?: "GeneralDocument"; value?: string | null };
};

export type GetCartQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetCartQuery = {
  __typename?: "Query";
  getCart?: {
    __typename?: "Cart";
    id: string;
    start_date?: any | null;
    type: PurchasableProductsEnum;
    user: { __typename?: "User"; email?: string | null };
    items?: Array<{
      __typename?: "CartItem";
      id: string;
      front_total: string;
      productable:
        | {
            __typename?: "Event";
            id: string;
            title: string;
            description?: string | null;
            start_date?: any | null;
            end_date?: any | null;
            price: number;
            max_participants: number;
            front_price: string;
            booked_count?: number | null;
            address?: { __typename?: "Address"; street?: string | null } | null;
            media?: Array<{
              __typename?: "Media";
              pathUrl: string;
            } | null> | null;
          }
        | {
            __typename?: "FacilityItem";
            id: string;
            qr_code_lifetime_value?: number | null;
            qr_code_lifetime_enum: string;
            checkin_counter?: number | null;
            is_unlimited_checkin: boolean;
            title: string;
            product_id: string;
            price: number;
            front_price: string;
            facility: { __typename?: "Facility"; name: string };
          }
        | {
            __typename?: "TrainerRate";
            front_price: string;
            price: number;
            rate_type: TrainerRateType;
            title: string;
          }
        | {
            __typename?: "Workout";
            id: string;
            title: string;
            description?: string | null;
            duration?: number | null;
            preview?: string | null;
            previewUrl?: string | null;
            front_price: string;
            price: number;
            type?: {
              __typename?: "WorkoutType";
              id: string;
              name: string;
              icon?: string | null;
            } | null;
            exercises?: Array<{
              __typename?: "WorkoutExercise";
              id: string;
              title: string;
              description?: string | null;
              path: string;
              previewUrl?: string | null;
              pathUrl: string;
            }> | null;
            trainer: {
              __typename?: "User";
              id: string;
              first_name?: string | null;
              last_name?: string | null;
              gender: GenderEnum;
              role?: RoleEnum | null;
              score?: number | null;
            };
          };
    } | null> | null;
  } | null;
};

export type StripeCardsQueryVariables = Exact<{ [key: string]: never }>;

export type StripeCardsQuery = {
  __typename?: "Query";
  cards?: {
    __typename?: "StripeCardPaginator";
    data: Array<{
      __typename?: "StripeCard";
      id: number;
      pm_last_four: number;
      brand: string;
      card_holder: string;
      exp_year: number;
      exp_month: number;
      is_default: boolean;
    }>;
  } | null;
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: "Query";
  me: {
    __typename?: "User";
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    avatar?: string | null;
    avatarUrl?: string | null;
    trainer_type?: TrainerTypeEnum | null;
    opening_hours?: any | null;
    has_password?: boolean | null;
    currentSubscription: SubscriptionsTierEnum;
    settings?: Array<{
      __typename?: "UserSetting";
      value?: any | null;
      setting?: { __typename?: "Setting"; code: SettingsCodeEnum } | null;
    }> | null;
    facilities?: Array<{
      __typename?: "Facility";
      id: string;
      name: string;
      media?: Array<{ __typename?: "Media"; pathUrl: string } | null> | null;
      address?: { __typename?: "Address"; street?: string | null } | null;
    } | null> | null;
    owned_facilities?: Array<{
      __typename?: "Facility";
      description: string;
      id: string;
      name: string;
      media?: Array<{
        __typename?: "Media";
        pathUrl: string;
        id: string;
      } | null> | null;
      amenities?: Array<{
        __typename?: "Amenity";
        id: string;
        name?: string | null;
        icon?: string | null;
        iconUrl?: string | null;
      } | null> | null;
      equipments?: Array<{
        __typename?: "Equipment";
        id: string;
        name?: string | null;
        icon?: string | null;
        iconUrl?: string | null;
      } | null> | null;
      address?: {
        __typename?: "Address";
        id: string;
        lat?: number | null;
        lng?: number | null;
        extra?: string | null;
        street?: string | null;
        city?: {
          __typename?: "City";
          id: string;
          name?: string | null;
          state: { __typename?: "State"; name?: string | null };
        } | null;
      } | null;
    } | null> | null;
    media?: Array<{
      __typename?: "Media";
      pathUrl: string;
      id: string;
    } | null> | null;
    address?: {
      __typename?: "Address";
      id: string;
      lat?: number | null;
      lng?: number | null;
      extra?: string | null;
      street?: string | null;
      city?: {
        __typename?: "City";
        id: string;
        name?: string | null;
        state: {
          __typename?: "State";
          name?: string | null;
          id: string;
          code?: string | null;
        };
        country: { __typename?: "Country"; name?: string | null; id: string };
      } | null;
    } | null;
    weiver_and_labilities?: Array<{
      __typename?: "Document";
      id: string;
      title?: string | null;
      path: string;
      pathUrl: string;
      type?: DocumentsTypeEnum | null;
    }> | null;
    certificates?: Array<{
      __typename?: "Document";
      id: string;
      title?: string | null;
      path: string;
      pathUrl: string;
      type?: DocumentsTypeEnum | null;
    }> | null;
  };
};

export type MyCartsQueryVariables = Exact<{ [key: string]: never }>;

export type MyCartsQuery = {
  __typename?: "Query";
  myCarts?: {
    __typename?: "CartPaginator";
    data: Array<{
      __typename?: "Cart";
      id: string;
      type: PurchasableProductsEnum;
      discount: number;
      start_date?: any | null;
      end_date?: any | null;
      total: number;
      sub_total: number;
      front_total: string;
      user: { __typename?: "User"; email?: string | null };
      items?: Array<{
        __typename?: "CartItem";
        id: string;
        productable:
          | { __typename?: "Event"; id: string; title: string }
          | { __typename?: "FacilityItem"; id: string; title: string }
          | { __typename?: "TrainerRate"; front_price: string }
          | { __typename?: "Workout"; id: string; title: string };
      } | null> | null;
    }>;
  } | null;
};

export type MyTrainingsQueryVariables = Exact<{
  start_date?: InputMaybe<DateTimeRange>;
  end_date?: InputMaybe<DateTimeRange>;
  orderBy?: InputMaybe<
    | Array<QueryMyTrainingsOrderByOrderByClause>
    | QueryMyTrainingsOrderByOrderByClause
  >;
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
}>;

export type MyTrainingsQuery = {
  __typename?: "Query";
  myTrainings?: {
    __typename?: "TrainingPaginator";
    data: Array<{
      __typename?: "Training";
      id: string;
      state: TrainingStatesEnum;
      start_date: any;
      trainer: {
        __typename?: "User";
        avatarUrl?: string | null;
        first_name?: string | null;
        last_name?: string | null;
        address?: { __typename?: "Address"; street?: string | null } | null;
      };
    }>;
    paginatorInfo: { __typename?: "PaginatorInfo"; total: number };
  } | null;
};

export type MyWorkoutsQueryVariables = Exact<{
  orderBy?: InputMaybe<
    | Array<QueryMyWorkoutsOrderByOrderByClause>
    | QueryMyWorkoutsOrderByOrderByClause
  >;
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
}>;

export type MyWorkoutsQuery = {
  __typename?: "Query";
  myWorkouts?: {
    __typename?: "WorkoutPaginator";
    data: Array<{
      __typename?: "Workout";
      id: string;
      previewUrl?: string | null;
      title: string;
      description?: string | null;
      price: number;
      duration?: number | null;
      type?: {
        __typename?: "WorkoutType";
        id: string;
        name: string;
        icon?: string | null;
      } | null;
      trainer: {
        __typename?: "User";
        first_name?: string | null;
        last_name?: string | null;
      };
      exercises?: Array<{
        __typename?: "WorkoutExercise";
        id: string;
        title: string;
        description?: string | null;
        path: string;
        pathUrl: string;
      }> | null;
    }>;
    paginatorInfo: {
      __typename?: "PaginatorInfo";
      count: number;
      currentPage: number;
      total: number;
      perPage: number;
    };
  } | null;
};

export type OrdersQueryVariables = Exact<{
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
  states?: InputMaybe<
    Array<InputMaybe<TransactionStatesEnum>> | InputMaybe<TransactionStatesEnum>
  >;
}>;

export type OrdersQuery = {
  __typename?: "Query";
  orders?: {
    __typename?: "OrderPaginator";
    data: Array<{
      __typename?: "Order";
      id: string;
      items: Array<{
        __typename?: "OrderItem";
        price: number;
        orderable:
          | {
              __typename: "Event";
              id: string;
              title: string;
              start_date?: any | null;
              media?: Array<{
                __typename?: "Media";
                pathUrl: string;
              } | null> | null;
              address?: {
                __typename?: "Address";
                street?: string | null;
                extra?: string | null;
                city?: { __typename?: "City"; name?: string | null } | null;
              } | null;
            }
          | {
              __typename: "FacilityItem";
              id: string;
              created_at: any;
              facility: {
                __typename?: "Facility";
                name: string;
                id: string;
                score?: number | null;
                productItems?: Array<{
                  __typename?: "FacilityItem";
                  price: number;
                  created_at: any;
                } | null> | null;
                media?: Array<{
                  __typename?: "Media";
                  pathUrl: string;
                } | null> | null;
                address?: {
                  __typename?: "Address";
                  street?: string | null;
                  extra?: string | null;
                  city?: { __typename?: "City"; name?: string | null } | null;
                } | null;
              };
            }
          | {
              __typename: "TrainerRate";
              front_price: string;
              id: string;
              title: string;
              user: {
                __typename?: "User";
                avatarUrl?: string | null;
                first_name?: string | null;
                last_name?: string | null;
                score?: number | null;
                facilities?: Array<{
                  __typename?: "Facility";
                  address?: {
                    __typename?: "Address";
                    street?: string | null;
                    extra?: string | null;
                  } | null;
                } | null> | null;
              };
            }
          | {
              __typename: "Workout";
              id: string;
              title: string;
              price: number;
              previewUrl?: string | null;
              created_at: any;
            };
      } | null>;
    }>;
    paginatorInfo: { __typename?: "PaginatorInfo"; total: number };
  } | null;
};

export type PaypalTokenQueryVariables = Exact<{ [key: string]: never }>;

export type PaypalTokenQuery = {
  __typename?: "Query";
  paypalToken: { __typename?: "PaypalToken"; token: string };
};

export type PlansQueryVariables = Exact<{
  type?: InputMaybe<SubscriptionsTypeEnum>;
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
}>;

export type PlansQuery = {
  __typename?: "Query";
  plans?: {
    __typename?: "PlanPaginator";
    paginatorInfo: { __typename?: "PaginatorInfo"; total: number };
    data: Array<{
      __typename?: "Plan";
      id: string;
      title: string;
      description?: string | null;
      type: SubscriptionsTypeEnum;
      is_active?: boolean | null;
      prices?: Array<{
        __typename?: "SubscriptionPrice";
        id: string;
        price: number;
      }> | null;
      benefits?: Array<{
        __typename?: "SubscriptionBenefit";
        id: string;
        benefit_key: string;
        description?: string | null;
      }> | null;
      subscriptionPlans?: Array<{
        __typename?: "SubscriptionPlan";
        id: string;
        billing_period: string;
        renewal_type: string;
        grace_period?: string | null;
        is_active?: boolean | null;
        provider: SubscriptionProvidersEnum;
        product_id: string;
      }> | null;
    }>;
  } | null;
};

export type QuizzesQueryVariables = Exact<{
  role: RoleEnum;
}>;

export type QuizzesQuery = {
  __typename?: "Query";
  quizzes?: {
    __typename?: "QuizzPaginator";
    data: Array<{
      __typename?: "Quizz";
      id: string;
      type: QuizzTypesEnum;
      title: string;
      description?: string | null;
      status?: QuizzStatusEnum | null;
      options?: Array<{
        __typename?: "QuizzOption";
        id: string;
        title: string;
        value: string;
      } | null> | null;
    }>;
    paginatorInfo: { __typename?: "PaginatorInfo"; total: number };
  } | null;
};

export type RecommendedWorkoutsQueryVariables = Exact<{
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
}>;

export type RecommendedWorkoutsQuery = {
  __typename?: "Query";
  recommendedWorkouts?: {
    __typename?: "WorkoutPaginator";
    data: Array<{
      __typename?: "Workout";
      id: string;
      preview?: string | null;
      previewUrl?: string | null;
      title: string;
      description?: string | null;
      price: number;
      duration?: number | null;
      was_ordered_by_me?: boolean | null;
      type?: {
        __typename?: "WorkoutType";
        id: string;
        name: string;
        icon?: string | null;
      } | null;
      exercises?: Array<{
        __typename?: "WorkoutExercise";
        id: string;
        title: string;
        description?: string | null;
        path: string;
        previewUrl?: string | null;
        pathUrl: string;
      }> | null;
      trainer: {
        __typename?: "User";
        first_name?: string | null;
        last_name?: string | null;
        score?: number | null;
        address?: {
          __typename?: "Address";
          lat?: number | null;
          lng?: number | null;
        } | null;
        facilities?: Array<{
          __typename?: "Facility";
          media?: Array<{
            __typename?: "Media";
            pathUrl: string;
          } | null> | null;
          address?: {
            __typename?: "Address";
            lat?: number | null;
            lng?: number | null;
          } | null;
        } | null> | null;
      };
    }>;
    paginatorInfo: {
      __typename?: "PaginatorInfo";
      count: number;
      firstItem?: number | null;
      currentPage: number;
      total: number;
      perPage: number;
    };
  } | null;
};

export type RecommendedWorkoutsByBodyPartsQueryVariables = Exact<{
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
}>;

export type RecommendedWorkoutsByBodyPartsQuery = {
  __typename?: "Query";
  recommendedWorkoutsByBodyParts?: {
    __typename?: "WorkoutPaginator";
    data: Array<{
      __typename?: "Workout";
      id: string;
      preview?: string | null;
      previewUrl?: string | null;
      title: string;
      description?: string | null;
      price: number;
      duration?: number | null;
      was_ordered_by_me?: boolean | null;
      type?: {
        __typename?: "WorkoutType";
        id: string;
        name: string;
        icon?: string | null;
      } | null;
      exercises?: Array<{
        __typename?: "WorkoutExercise";
        id: string;
        title: string;
        description?: string | null;
        path: string;
        previewUrl?: string | null;
        pathUrl: string;
      }> | null;
      trainer: {
        __typename?: "User";
        first_name?: string | null;
        last_name?: string | null;
        facilities?: Array<{
          __typename?: "Facility";
          media?: Array<{
            __typename?: "Media";
            pathUrl: string;
          } | null> | null;
          address?: {
            __typename?: "Address";
            lat?: number | null;
            lng?: number | null;
          } | null;
        } | null> | null;
      };
    }>;
    paginatorInfo: {
      __typename?: "PaginatorInfo";
      count: number;
      currentPage: number;
      total: number;
      perPage: number;
    };
  } | null;
};

export type RecommendedWorkoutsByTypeQueryVariables = Exact<{
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
}>;

export type RecommendedWorkoutsByTypeQuery = {
  __typename?: "Query";
  recommendedWorkoutsByType?: {
    __typename?: "WorkoutPaginator";
    data: Array<{
      __typename?: "Workout";
      id: string;
      preview?: string | null;
      previewUrl?: string | null;
      title: string;
      description?: string | null;
      price: number;
      duration?: number | null;
      was_ordered_by_me?: boolean | null;
      type?: {
        __typename?: "WorkoutType";
        id: string;
        name: string;
        icon?: string | null;
      } | null;
      exercises?: Array<{
        __typename?: "WorkoutExercise";
        id: string;
        title: string;
        description?: string | null;
        path: string;
        previewUrl?: string | null;
        pathUrl: string;
      }> | null;
      trainer: {
        __typename?: "User";
        first_name?: string | null;
        last_name?: string | null;
        facilities?: Array<{
          __typename?: "Facility";
          media?: Array<{
            __typename?: "Media";
            pathUrl: string;
          } | null> | null;
          address?: {
            __typename?: "Address";
            lat?: number | null;
            lng?: number | null;
          } | null;
        } | null> | null;
      };
    }>;
    paginatorInfo: {
      __typename?: "PaginatorInfo";
      count: number;
      currentPage: number;
      total: number;
      perPage: number;
    };
  } | null;
};

export type ReviewsQueryVariables = Exact<{
  type?: InputMaybe<FeedbackEntityEnum>;
  id: Scalars["ID"];
  review_type?: InputMaybe<ReviewTypeEnum>;
}>;

export type ReviewsQuery = {
  __typename?: "Query";
  reviews?: {
    __typename?: "ReviewPaginator";
    data: Array<{
      __typename?: "Review";
      id: string;
      review: string;
      score?: number | null;
      created_at: any;
      author: {
        __typename?: "User";
        id: string;
        first_name?: string | null;
        last_name?: string | null;
        avatarUrl?: string | null;
      };
    }>;
  } | null;
};

export type StatesQueryVariables = Exact<{
  name?: InputMaybe<Scalars["String"]>;
  country_id?: InputMaybe<Scalars["ID"]>;
  first: Scalars["Int"];
  page?: InputMaybe<Scalars["Int"]>;
}>;

export type StatesQuery = {
  __typename?: "Query";
  states?: {
    __typename?: "StatePaginator";
    data: Array<{
      __typename?: "State";
      id: string;
      name?: string | null;
      code?: string | null;
    }>;
    paginatorInfo: { __typename?: "PaginatorInfo"; total: number };
  } | null;
};

export type SetupIntentQueryVariables = Exact<{
  product_id?: InputMaybe<Scalars["ID"]>;
}>;

export type SetupIntentQuery = {
  __typename?: "Query";
  setupIntent: { __typename?: "SetupIntent"; session?: string | null };
};

export type TrainingQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type TrainingQuery = {
  __typename?: "Query";
  training: {
    __typename?: "Training";
    id: string;
    start_date: any;
    state: TrainingStatesEnum;
    order: {
      __typename?: "Order";
      id: string;
      front_total: string;
      state: TransactionStatesEnum;
    };
    user: {
      __typename?: "User";
      id: string;
      first_name?: string | null;
      last_name?: string | null;
      avatarUrl?: string | null;
      positive_reviews_count?: number | null;
      negative_reviews_count?: number | null;
      address?: { __typename?: "Address"; street?: string | null } | null;
    };
    trainer: {
      __typename?: "User";
      id: string;
      avatarUrl?: string | null;
      first_name?: string | null;
      last_name?: string | null;
      score?: number | null;
      address?: { __typename?: "Address"; street?: string | null } | null;
      facilities?: Array<{
        __typename?: "Facility";
        address?: { __typename?: "Address"; street?: string | null } | null;
      } | null> | null;
      settings?: Array<{
        __typename?: "UserSetting";
        value?: any | null;
        setting?: { __typename?: "Setting"; code: SettingsCodeEnum } | null;
      }> | null;
    };
  };
};

export type UserQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type UserQuery = {
  __typename?: "Query";
  user?: {
    __typename?: "User";
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    avatar?: string | null;
    was_commented_by_me?: boolean | null;
    was_visited_by_me?: boolean | null;
    avatarUrl?: string | null;
    trainings_count: number;
    created_at?: any | null;
    is_followed?: boolean | null;
    trainer_type?: TrainerTypeEnum | null;
    has_password?: boolean | null;
    currentSubscription: SubscriptionsTierEnum;
    positive_reviews_count?: number | null;
    negative_reviews_count?: number | null;
    completed_trainings_count?: number | null;
    reviews_count?: number | null;
    score?: number | null;
    weiver_and_labilities?: Array<{
      __typename?: "Document";
      id: string;
      title?: string | null;
      path: string;
      pathUrl: string;
      type?: DocumentsTypeEnum | null;
    }> | null;
    certificates?: Array<{
      __typename?: "Document";
      id: string;
      title?: string | null;
      path: string;
      pathUrl: string;
      type?: DocumentsTypeEnum | null;
    }> | null;
    settings?: Array<{
      __typename?: "UserSetting";
      value?: any | null;
      setting?: { __typename?: "Setting"; code: SettingsCodeEnum } | null;
    }> | null;
    facilities?: Array<{
      __typename?: "Facility";
      id: string;
      name: string;
      media?: Array<{ __typename?: "Media"; pathUrl: string } | null> | null;
      address?: { __typename?: "Address"; street?: string | null } | null;
    } | null> | null;
    media?: Array<{
      __typename?: "Media";
      pathUrl: string;
      id: string;
    } | null> | null;
    owned_facilities?: Array<{
      __typename?: "Facility";
      id: string;
      name: string;
      media?: Array<{ __typename?: "Media"; pathUrl: string } | null> | null;
      address?: { __typename?: "Address"; street?: string | null } | null;
    } | null> | null;
    address?: {
      __typename?: "Address";
      street?: string | null;
      city?: {
        __typename?: "City";
        name?: string | null;
        state: { __typename?: "State"; name?: string | null };
        country: { __typename?: "Country"; name?: string | null };
      } | null;
    } | null;
    trainerRates?: Array<{
      __typename?: "TrainerRate";
      rate_type: TrainerRateType;
      front_price: string;
      products?: Array<{
        __typename?: "PaymentGatewayProduct";
        product_id: string;
      }> | null;
    } | null> | null;
    facilityItemPasses?: Array<{
      __typename?: "FacilityItemPass";
      is_active_pass: boolean;
      facilityItem: {
        __typename?: "FacilityItem";
        qr_code_lifetime_value?: number | null;
        qr_code_lifetime_enum: string;
        checkin_counter?: number | null;
        is_unlimited_checkin: boolean;
        title: string;
        product_id: string;
        price: number;
      };
    } | null> | null;
    quizzes?: Array<{
      __typename?: "Quizz";
      code: string;
      answers?: Array<{
        __typename?: "QuizzAnswer";
        value: string;
      } | null> | null;
    } | null> | null;
  } | null;
};

export type UserAvailabilityQueryVariables = Exact<{
  id: Scalars["ID"];
  from: Scalars["DateTime"];
  to: Scalars["DateTime"];
}>;

export type UserAvailabilityQuery = {
  __typename?: "Query";
  userAvailability: {
    __typename?: "Availability";
    hours?: Array<{
      __typename?: "AvailabilityHours";
      from: any;
      to: any;
    }> | null;
    trainings?: Array<{
      __typename?: "Training";
      id: string;
      state: TrainingStatesEnum;
      start_date: any;
      end_date: any;
      order: {
        __typename?: "Order";
        total: number;
        fee: number;
        order_subtotal: number;
      };
    }> | null;
    events?: Array<{
      __typename?: "Event";
      start_date?: any | null;
      end_date?: any | null;
    }> | null;
  };
};

export type UsersQueryVariables = Exact<{
  role?: InputMaybe<RoleEnum>;
  near?: InputMaybe<NearFilter>;
  search?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
  is_followed?: InputMaybe<Scalars["Boolean"]>;
  availability?: InputMaybe<UsersAvailabilityFilter>;
  facilities?: InputMaybe<
    Array<InputMaybe<Scalars["ID"]>> | InputMaybe<Scalars["ID"]>
  >;
}>;

export type UsersQuery = {
  __typename?: "Query";
  users?: {
    __typename?: "UserPaginator";
    data: Array<{
      __typename?: "User";
      id: string;
      score?: number | null;
      first_name?: string | null;
      last_name?: string | null;
      avatarUrl?: string | null;
      is_followed?: boolean | null;
      trainer_type?: TrainerTypeEnum | null;
      address?: {
        __typename?: "Address";
        lat?: number | null;
        lng?: number | null;
        street?: string | null;
      } | null;
      facilities?: Array<{
        __typename?: "Facility";
        id: string;
        name: string;
        address?: {
          __typename?: "Address";
          lat?: number | null;
          lng?: number | null;
          street?: string | null;
        } | null;
      } | null> | null;
      media?: Array<{ __typename?: "Media"; pathUrl: string } | null> | null;
      settings?: Array<{
        __typename?: "UserSetting";
        value?: any | null;
        setting?: { __typename?: "Setting"; code: SettingsCodeEnum } | null;
      }> | null;
    }>;
    paginatorInfo: {
      __typename?: "PaginatorInfo";
      total: number;
      firstItem?: number | null;
    };
  } | null;
};

export type WorkoutQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type WorkoutQuery = {
  __typename?: "Query";
  workout: {
    __typename?: "Workout";
    id: string;
    previewUrl?: string | null;
    title: string;
    was_ordered_by_me?: boolean | null;
    description?: string | null;
    price: number;
    duration?: number | null;
    type?: {
      __typename?: "WorkoutType";
      id: string;
      name: string;
      icon?: string | null;
    } | null;
    exercises?: Array<{
      __typename?: "WorkoutExercise";
      id: string;
      title: string;
      description?: string | null;
      path: string;
      previewUrl?: string | null;
      pathUrl: string;
    }> | null;
    products?: Array<{
      __typename?: "PaymentGatewayProduct";
      product_id: string;
    }> | null;
    trainer: {
      __typename?: "User";
      id: string;
      first_name?: string | null;
      last_name?: string | null;
      gender: GenderEnum;
      role?: RoleEnum | null;
      score?: number | null;
    };
  };
};

export type WorkoutsQueryVariables = Exact<{
  dynamic_search: Scalars["String"];
  trainer_id?: InputMaybe<Scalars["ID"]>;
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
  type_id?: InputMaybe<Scalars["ID"]>;
  has_body_parts?: InputMaybe<Array<Scalars["ID"]> | Scalars["ID"]>;
  order: SortOrder;
  orderByColumn: QueryWorkoutsOrderByColumn;
}>;

export type WorkoutsQuery = {
  __typename?: "Query";
  workouts?: {
    __typename?: "WorkoutPaginator";
    data: Array<{
      __typename?: "Workout";
      id: string;
      preview?: string | null;
      previewUrl?: string | null;
      title: string;
      description?: string | null;
      price: number;
      duration?: number | null;
      was_ordered_by_me?: boolean | null;
      state: WorkoutStatesEnum;
      type?: {
        __typename?: "WorkoutType";
        id: string;
        name: string;
        icon?: string | null;
      } | null;
      exercises?: Array<{
        __typename?: "WorkoutExercise";
        id: string;
        title: string;
        description?: string | null;
        path: string;
        previewUrl?: string | null;
        pathUrl: string;
      }> | null;
      trainer: {
        __typename?: "User";
        first_name?: string | null;
        last_name?: string | null;
        score?: number | null;
        address?: {
          __typename?: "Address";
          lat?: number | null;
          lng?: number | null;
        } | null;
        facilities?: Array<{
          __typename?: "Facility";
          media?: Array<{
            __typename?: "Media";
            pathUrl: string;
          } | null> | null;
          address?: {
            __typename?: "Address";
            lat?: number | null;
            lng?: number | null;
          } | null;
        } | null> | null;
      };
    }>;
    paginatorInfo: {
      __typename?: "PaginatorInfo";
      count: number;
      firstItem?: number | null;
      currentPage: number;
      total: number;
      perPage: number;
    };
  } | null;
};

export type CreateTrainerWorkoutMutationVariables = Exact<{
  body_parts: Array<Scalars["ID"]> | Scalars["ID"];
  type_id?: InputMaybe<Scalars["ID"]>;
  title: Scalars["String"];
  description?: InputMaybe<Scalars["String"]>;
  price: Scalars["Float"];
  duration: Scalars["Int"];
  preview?: InputMaybe<Scalars["StringOrUpload"]>;
  exercises?: InputMaybe<Array<WorkoutVideosInput> | WorkoutVideosInput>;
}>;

export type CreateTrainerWorkoutMutation = {
  __typename?: "Mutation";
  createTrainerWorkout: {
    __typename?: "Workout";
    id: string;
    title: string;
    description?: string | null;
    price: number;
    duration?: number | null;
    preview?: string | null;
    previewUrl?: string | null;
    type?: {
      __typename?: "WorkoutType";
      id: string;
      name: string;
      icon?: string | null;
    } | null;
    trainer: {
      __typename?: "User";
      id: string;
      first_name?: string | null;
      last_name?: string | null;
    };
    exercises?: Array<{
      __typename?: "WorkoutExercise";
      id: string;
      title: string;
      description?: string | null;
      path: string;
      pathUrl: string;
    }> | null;
    bodyParts?: Array<{
      __typename?: "BodyPart";
      id: string;
      name: string;
      icon?: string | null;
    } | null> | null;
  };
};

export type CreateGymWorkoutMutationVariables = Exact<{
  body_parts: Array<Scalars["ID"]> | Scalars["ID"];
  facility_id?: InputMaybe<Scalars["ID"]>;
  type_id?: InputMaybe<Scalars["ID"]>;
  title: Scalars["String"];
  description?: InputMaybe<Scalars["String"]>;
  price: Scalars["Float"];
  duration: Scalars["Int"];
  preview?: InputMaybe<Scalars["StringOrUpload"]>;
  exercises?: InputMaybe<Array<WorkoutVideosInput> | WorkoutVideosInput>;
}>;

export type CreateGymWorkoutMutation = {
  __typename?: "Mutation";
  createGymWorkout: {
    __typename?: "Workout";
    id: string;
    title: string;
    description?: string | null;
    price: number;
    duration?: number | null;
    preview?: string | null;
    previewUrl?: string | null;
    type?: {
      __typename?: "WorkoutType";
      id: string;
      name: string;
      icon?: string | null;
    } | null;
    facility?: { __typename?: "Facility"; id: string; name: string } | null;
    trainer: {
      __typename?: "User";
      id: string;
      first_name?: string | null;
      last_name?: string | null;
    };
    exercises?: Array<{
      __typename?: "WorkoutExercise";
      id: string;
      title: string;
      description?: string | null;
      path: string;
      pathUrl: string;
    }> | null;
    bodyParts?: Array<{
      __typename?: "BodyPart";
      id: string;
      name: string;
      icon?: string | null;
    } | null> | null;
  };
};

export type FilePreloadMutationVariables = Exact<{
  file: Scalars["Upload"];
}>;

export type FilePreloadMutation = {
  __typename?: "Mutation";
  filePreload?: {
    __typename?: "FilePreloadResponse";
    path?: string | null;
  } | null;
};

export type HideWorkoutMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type HideWorkoutMutation = {
  __typename?: "Mutation";
  hideWorkout: { __typename?: "Workout"; id: string; state: WorkoutStatesEnum };
};

export type ShowWorkoutMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type ShowWorkoutMutation = {
  __typename?: "Mutation";
  showWorkout: { __typename?: "Workout"; id: string; state: WorkoutStatesEnum };
};

export type UpdateTrainerTypeMutationVariables = Exact<{
  id: Scalars["ID"];
  trainer_type?: InputMaybe<TrainerTypeEnum>;
  facility_id?: InputMaybe<Scalars["ID"]>;
  settings?: InputMaybe<Array<SetSettingInput> | SetSettingInput>;
  address?: InputMaybe<AddressInput>;
  opening_hours?: InputMaybe<Scalars["JSON"]>;
}>;

export type UpdateTrainerTypeMutation = {
  __typename?: "Mutation";
  updateUser: {
    __typename?: "User";
    id: string;
    trainer_type?: TrainerTypeEnum | null;
    facilities?: Array<{
      __typename?: "Facility";
      id: string;
      name: string;
    } | null> | null;
    settings?: Array<{
      __typename?: "UserSetting";
      value?: any | null;
      setting?: { __typename?: "Setting"; code: SettingsCodeEnum } | null;
    }> | null;
    trainerRates?: Array<{
      __typename?: "TrainerRate";
      id: string;
      title: string;
      front_price: string;
    } | null> | null;
    address?: {
      __typename?: "Address";
      lat?: number | null;
      lng?: number | null;
      street?: string | null;
      extra?: string | null;
      city?: {
        __typename?: "City";
        name?: string | null;
        state: { __typename?: "State"; name?: string | null };
        country: { __typename?: "Country"; name?: string | null };
      } | null;
    } | null;
  };
};

export type BodyPartsQueryVariables = Exact<{
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
}>;

export type BodyPartsQuery = {
  __typename?: "Query";
  bodyParts?: {
    __typename?: "BodyPartPaginator";
    data: Array<{ __typename?: "BodyPart"; id: string; name: string }>;
  } | null;
};

export type TrainerTrainingsQueryVariables = Exact<{
  filters?: InputMaybe<TrainingsFilterInput>;
  orderBy?: InputMaybe<
    | Array<QueryTrainerTrainingsOrderByOrderByClause>
    | QueryTrainerTrainingsOrderByOrderByClause
  >;
  first: Scalars["Int"];
  page?: InputMaybe<Scalars["Int"]>;
}>;

export type TrainerTrainingsQuery = {
  __typename?: "Query";
  trainerTrainings?: {
    __typename?: "TrainingPaginator";
    data: Array<{
      __typename?: "Training";
      address_string?: string | null;
      id: string;
      start_date: any;
      state: TrainingStatesEnum;
      user: {
        __typename?: "User";
        avatar?: string | null;
        avatarUrl?: string | null;
        first_name?: string | null;
        last_name?: string | null;
        media?: Array<{ __typename?: "Media"; pathUrl: string } | null> | null;
        address?: { __typename?: "Address"; street?: string | null } | null;
      };
      order: { __typename?: "Order"; total: number };
      trainer: {
        __typename?: "User";
        facilities?: Array<{
          __typename?: "Facility";
          address?: { __typename?: "Address"; street?: string | null } | null;
        } | null> | null;
      };
    }>;
    paginatorInfo: { __typename?: "PaginatorInfo"; total: number };
  } | null;
};

export type WorkoutTypesQueryVariables = Exact<{
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
}>;

export type WorkoutTypesQuery = {
  __typename?: "Query";
  workoutTypes?: {
    __typename?: "WorkoutTypePaginator";
    data: Array<{ __typename?: "WorkoutType"; id: string; name: string }>;
  } | null;
};

export type MyEventsQueryVariables = Exact<{
  start_date?: InputMaybe<DateTimeRange>;
  end_date?: InputMaybe<DateTimeRange>;
  orderBy?: InputMaybe<
    Array<QueryMyEventsOrderByOrderByClause> | QueryMyEventsOrderByOrderByClause
  >;
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
}>;

export type MyEventsQuery = {
  __typename?: "Query";
  myEvents?: {
    __typename?: "EventPaginator";
    data: Array<{
      __typename?: "Event";
      id: string;
      title: string;
      start_date?: any | null;
      address?: { __typename?: "Address"; street?: string | null } | null;
      media?: Array<{ __typename?: "Media"; pathUrl: string } | null> | null;
    }>;
    paginatorInfo: { __typename?: "PaginatorInfo"; total: number };
  } | null;
};

export type MyFacilityItemPassesQueryVariables = Exact<{
  start_date?: InputMaybe<DateTimeRange>;
  end_date?: InputMaybe<DateTimeRange>;
  orderBy?: InputMaybe<
    | Array<QueryMyFacilityItemPassesOrderByOrderByClause>
    | QueryMyFacilityItemPassesOrderByOrderByClause
  >;
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
}>;

export type MyFacilityItemPassesQuery = {
  __typename?: "Query";
  myFacilityItemPasses?: {
    __typename?: "FacilityItemPassPaginator";
    data: Array<{
      __typename?: "FacilityItemPass";
      id: string;
      start_date: any;
      end_date: any;
      is_active_pass: boolean;
      facilityItem: {
        __typename?: "FacilityItem";
        title: string;
        qr_code_lifetime_value?: number | null;
        facility: {
          __typename?: "Facility";
          id: string;
          name: string;
          media?: Array<{
            __typename?: "Media";
            pathUrl: string;
          } | null> | null;
          address?: { __typename?: "Address"; street?: string | null } | null;
        };
      };
    }>;
    paginatorInfo: { __typename?: "PaginatorInfo"; total: number };
  } | null;
};

export const AttachToFacilityDocument = gql`
  mutation attachToFacility($input: AttachToFacilityInput!) {
    attachToFacility(input: $input) {
      id
    }
  }
`;
export const CreateFacilityDocument = gql`
  mutation createFacility($input: CreateFacilityInput!) {
    createFacility(input: $input) {
      id
      name
      description
      score
      equipments {
        name
        iconUrl
      }
      amenities {
        name
        iconUrl
      }
      organization {
        id
        name
        email
      }
    }
  }
`;
export const CheckOrganizationRegistrationCodeDocument = gql`
  query checkOrganizationRegistrationCode($code: String!) {
    checkOrganizationRegistrationCode(code: $code) {
      id
      name
    }
  }
`;
export const UpdateUserRoleDocument = gql`
  mutation updateUserRole($id: ID!, $role: RoleEnum) {
    updateUser(id: $id, input: { role: $role }) {
      id
      role
    }
  }
`;
export const AddFacilityItemToCartDocument = gql`
  mutation addFacilityItemToCart($input: AddFacilityItemToCartInput!) {
    addFacilityItemToCart(input: $input) {
      id
      type
      discount
      start_date
      end_date
      total
      sub_total
      front_total
      user {
        email
      }
      items {
        id
        productable {
          ... on Event {
            id
            title
          }
          ... on Workout {
            id
            title
          }
          ... on FacilityItem {
            id
            title
          }
          ... on TrainerRate {
            front_price
          }
        }
      }
    }
  }
`;
export const AddToCartDocument = gql`
  mutation addToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      id
      type
      discount
      type
      total
      sub_total
      front_total
      user {
        email
      }
      items {
        id
        productable {
          ... on Event {
            id
            title
          }
          ... on Workout {
            id
            title
          }
          ... on FacilityItem {
            id
            title
          }
          ... on TrainerRate {
            front_price
          }
        }
      }
    }
  }
`;
export const AddTrainingToCartDocument = gql`
  mutation addTrainingToCart($input: AddTrainingToCartInput!) {
    addTrainingToCart(input: $input) {
      id
      type
      discount
      start_date
      end_date
      total
      sub_total
      front_total
      user {
        email
      }
      items {
        id
        productable {
          ... on Event {
            id
            title
          }
          ... on Workout {
            id
            title
          }
          ... on FacilityItem {
            id
            title
          }
          ... on TrainerRate {
            id
            title
            front_price
          }
        }
      }
    }
  }
`;
export const ChangeTrainingStateDocument = gql`
  mutation changeTrainingState($input: ChangeTrainingState!) {
    changeTrainingState(input: $input) {
      success
      message
      training {
        id
      }
    }
  }
`;
export const CheckinByPassDocument = gql`
  mutation checkinByPass($input: CheckinByPassInput) {
    checkinByPass(input: $input) {
      id
      user {
        first_name
        last_name
      }
    }
  }
`;
export const ClearCartDocument = gql`
  mutation clearCart($input: ClearCartInput!) {
    clearCart(input: $input) {
      id
      type
      discount
      start_date
      end_date
      total
      type
      sub_total
      front_total
      user {
        email
      }
      items {
        id
        productable {
          ... on Event {
            id
            title
          }
          ... on Workout {
            id
            title
          }
          ... on FacilityItem {
            id
            title
          }
          ... on TrainerRate {
            front_price
          }
        }
      }
    }
  }
`;
export const CreateCartDocument = gql`
  mutation createCart($input: CreateCartInput!) {
    createCart(input: $input) {
      id
    }
  }
`;
export const CreateChatDocument = gql`
  mutation createChat($participant_id: ID!) {
    createChat(participant_id: $participant_id) {
      id
    }
  }
`;
export const CreateDeviceTokenDocument = gql`
  mutation CreateDeviceToken($token: String!) {
    createDeviceToken(input: { token: $token }) {
      id
    }
  }
`;
export const CreateEventDocument = gql`
  mutation createEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
    }
  }
`;
export const DeleteChatDocument = gql`
  mutation deleteChat($id: ID!) {
    deleteChat(id: $id) {
      id
    }
  }
`;
export const DeleteDocumentDocument = gql`
  mutation deleteDocument($id: ID!) {
    deleteDocument(id: $id) {
      id
    }
  }
`;
export const DeleteEventDocument = gql`
  mutation deleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      id
    }
  }
`;
export const DeleteMediaDocument = gql`
  mutation deleteMedia($id: ID!) {
    deleteMedia(id: $id) {
      id
    }
  }
`;
export const DeleteMessageDocument = gql`
  mutation deleteMessage($id: ID!) {
    deleteMessage(id: $id) {
      id
    }
  }
`;
export const DeleteProfileDocument = gql`
  mutation deleteProfile {
    deleteProfile {
      status
    }
  }
`;
export const DetachCardDocument = gql`
  mutation detachCard($card_id: ID!) {
    detachCard(input: { card_id: $card_id }) {
      success
      message
    }
  }
`;
export const FollowDocument = gql`
  mutation follow($id: ID!, $type: FollowTypeEnum!) {
    follow(input: { id: $id, type: $type }) {
      ... on User {
        id
      }
      ... on Facility {
        id
      }
    }
  }
`;
export const ForgotPasswordDocument = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(input: { email: $email }) {
      status
      message
    }
  }
`;
export const LeftFeedbackDocument = gql`
  mutation leftFeedback($input: LeftFeedbackInput!) {
    leftFeedback(input: $input) {
      state
      message
    }
  }
`;
export const LoginDocument = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      access_token
      refresh_token
      expires_in
      user {
        firebase_auth_token
        id
        email
        role
        first_name
        last_name
        created_at
        email_verified_at
        front_settings
        trainer_type
        currentSubscription
        facilities {
          id
          address {
            lat
            lng
            street
            extra
          }
        }
        owned_facilities {
          id
          address {
            lat
            lng
            street
            extra
          }
        }
      }
    }
  }
`;
export const PayWithPaypalDocument = gql`
  mutation PayWithPaypal($nonce: String!, $cart_id: ID!) {
    payWithPaypal(input: { nonce: $nonce, cart_id: $cart_id }) {
      result
    }
  }
`;
export const PaymentGatewayRefundDocument = gql`
  mutation paymentGatewayRefund($input: RefundInput!) {
    paymentGatewayRefund(input: $input) {
      success
      message
    }
  }
`;
export const ReadMessageDocument = gql`
  mutation readMessage($id: ID!) {
    readMessage(id: $id) {
      id
    }
  }
`;
export const RemoveFromCartDocument = gql`
  mutation removeFromCart($input: RemoveFromCartInput!) {
    removeFromCart(input: $input) {
      id
      type
      discount
      start_date
      end_date
      total
      type
      sub_total
      front_total
      user {
        email
      }
      items {
        id
        productable {
          ... on Event {
            id
            title
          }
          ... on Workout {
            id
            title
          }
          ... on FacilityItem {
            id
            title
          }
          ... on TrainerRate {
            front_price
          }
        }
      }
    }
  }
`;
export const SendMessageDocument = gql`
  mutation sendMessage($chat_id: ID!, $input: ChatMessageInput!) {
    sendMessage(chat_id: $chat_id, input: $input) {
      id
    }
  }
`;
export const SocialLoginDocument = gql`
  mutation SocialLogin($token: String!, $provider: SocialProvidersEnum!) {
    socialLogin(input: { token: $token, provider: $provider }) {
      access_token
      refresh_token
      expires_in
      user {
        firebase_auth_token
        id
        email
        role
        first_name
        last_name
        created_at
        email_verified_at
        front_settings
        trainer_type
        currentSubscription
        facilities {
          id
          address {
            lat
            lng
            street
            extra
          }
        }
        owned_facilities {
          id
          address {
            lat
            lng
            street
            extra
          }
        }
      }
    }
  }
`;
export const ChangePaymentMethodDocument = gql`
  mutation ChangePaymentMethod($card_id: ID!) {
    changePaymentMethod(input: { card_id: $card_id }) {
      id
      pm_last_four
      brand
      exp_year
      exp_month
      is_default
    }
  }
`;
export const PaymentIntentDocument = gql`
  mutation PaymentIntent($purchasable_product_id: ID!, $cart_id: ID!) {
    paymentIntent(
      input: {
        purchasable_product_id: $purchasable_product_id
        cart_id: $cart_id
      }
    ) {
      session
      zeroPayment
    }
  }
`;
export const PayoutDocument = gql`
  mutation stripePayout($id: ID) {
    stripePayout(id: $id) {
      message
      success
    }
  }
`;

export const getRevenuesDocument = gql`
  query facilityDashboardWidget($id: ID!) {
    facilityDashboardWidget(id: $id) {
      today_earn
      earn_last_thirty_days
      year_earn
    }
  }
`;
export const CreateSubscriptionIntentDocument = gql`
  mutation CreateSubscriptionIntent(
    $product_id: ID!
    $fees_percent: Int!
    $facility_id: ID
  ) {
    createSubscriptionIntent(
      input: {
        product_id: $product_id
        fees_percent: $fees_percent
        facility_id: $facility_id
      }
    ) {
      session
    }
  }
`;
export const CancelSubscriptionDocument = gql`
  mutation CancelSubscription($unique_identifier: String!) {
    cancelSubscription(input: { unique_identifier: $unique_identifier }) {
      plan_id
      start_date
      end_date
      grace_period_end_date
      canceled_at
      unique_identifier
      verified
      facility_id
    }
  }
`;
export const UpdateSubscriptionDocument = gql`
  mutation UpdateSubscription(
    $unique_identifier: String!
    $new_product_id: String!
    $fees_percent: Int!
    $facility_id: ID
  ) {
    updateSubscription(
      input: {
        unique_identifier: $unique_identifier
        new_product_id: $new_product_id
        fees_percent: $fees_percent
        facility_id: $facility_id
      }
    ) {
      session
    }
  }
`;
export const SubscriptionUserDocument = gql`
  mutation subscriptionUser($facility_id: ID, $unique_identifier: String) {
    subscriptionUser(
      input: {
        facility_id: $facility_id
        unique_identifier: $unique_identifier
      }
    ) {
      plan_id
      start_date
      end_date
      grace_period_end_date
      canceled_at
      unique_identifier
      verified
      facility_id
    }
  }
`;
export const UpdateFirstSubscriptionDocument = gql`
  mutation UpdateFirstSubscription($input: UpdateFirstSubscriptionInput!) {
    updateFirstSubscription(input: $input) {
      id
    }
  }
`;
export const TrainingCheckinDocument = gql`
  mutation trainingCheckin($input: TrainingCheckinInput!) {
    trainingCheckin(input: $input) {
      id
      user {
        first_name
        last_name
      }
    }
  }
`;
export const TrainingFinishDocument = gql`
  mutation trainingFinish($input: TrainingFinishInput!) {
    trainingFinish(input: $input) {
      id
      user {
        first_name
        last_name
      }
    }
  }
`;
export const UnfollowDocument = gql`
  mutation unfollow($id: ID!, $type: FollowTypeEnum!) {
    unfollow(input: { id: $id, type: $type }) {
      ... on User {
        id
      }
      ... on Facility {
        id
      }
    }
  }
`;
export const UpdateEventDocument = gql`
  mutation updateEvent($id: ID!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
      id
    }
  }
`;
export const UpdateFacilityDocument = gql`
  mutation updateFacility($id: ID!, $input: UpdateFacilityInput!) {
    updateFacility(id: $id, input: $input) {
      id
    }
  }
`;
export const UpdateForgottenPasswordDocument = gql`
  mutation UpdateForgottenPassword(
    $email: String!
    $token: String!
    $password: String!
    $password_confirmation: String!
  ) {
    updateForgottenPassword(
      input: {
        email: $email
        token: $token
        password: $password
        password_confirmation: $password_confirmation
      }
    ) {
      status
      message
    }
  }
`;
export const UpdatePasswordDocument = gql`
  mutation updatePassword($input: UpdatePassword!) {
    updatePassword(input: $input) {
      status
      message
    }
  }
`;
export const ManagerPasswordSetDocument = gql`
  mutation managerPasswordSet($input: ManagerPassword!) {
    managerPasswordSet(input: $input) {
      status
      message
    }
  }
`;
export const UpdateUserDocument = gql`
  mutation updateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
    }
  }
`;
export const UpdateUserEmailDocument = gql`
  mutation updateUserEmail($id: ID!, $email: String) {
    updateUser(id: $id, input: { email: $email }) {
      id
    }
  }
`;
export const UpdateUserNameDocument = gql`
  mutation updateUserName($id: ID!, $first_name: String, $last_name: String) {
    updateUser(
      id: $id
      input: { first_name: $first_name, last_name: $last_name }
    ) {
      id
      first_name
      last_name
    }
  }
`;
export const UpdateUserSettingsDocument = gql`
  mutation updateUserSettings($id: ID!, $front_settings: JSON) {
    updateUser(id: $id, input: { front_settings: $front_settings }) {
      id
    }
  }
`;
export const VerifyEmailDocument = gql`
  mutation verifyEmail($token: String!) {
    verifyEmail(input: { token: $token }) {
      access_token
      refresh_token
      expires_in
      user {
        id
        email
        role
        first_name
        last_name
        email_verified_at
        front_settings
        facilities {
          address {
            lat
            lng
            street
            extra
          }
        }
      }
    }
  }
`;
export const ActivitiesDocument = gql`
  query activities($search: String, $near: NearFilter, $limitPerUnit: Int) {
    activities(search: $search, near: $near, limitPerUnit: $limitPerUnit) {
      __typename
      ... on User {
        id
        first_name
        last_name
        pathUrl: avatarUrl
        facilities {
          address {
            street
          }
        }
      }
      ... on Workout {
        id
        title
        pathUrl: previewUrl
        description
        type {
          id
          name
        }
      }
      ... on Facility {
        id
        name
        media {
          pathUrl
        }
        organization {
          name
        }
        address {
          lat
          lng
          street
        }
      }
    }
  }
`;
export const AmenitiesDocument = gql`
  query amenities($first: Int, $page: Int) {
    amenities(first: $first, page: $page) {
      data {
        id
        name
        icon
        iconUrl
      }
    }
  }
`;
export const AppleGooglePaymentIntentDocument = gql`
  query appleGooglePaymentIntent(
    $provider: PaymentProvidersEnum!
    $cart_id: ID!
  ) {
    appleGooglePaymentIntent(cart_id: $cart_id, provider: $provider) {
      customerId
      paymentIntent
    }
  }
`;
export const CitiesDocument = gql`
  query cities(
    $name: String
    $country_id: ID
    $state_id: ID
    $state_code: String
    $first: Int!
    $page: Int
  ) {
    cities(
      name: $name
      country_id: $country_id
      state_id: $state_id
      state_code: $state_code
      first: $first
      page: $page
    ) {
      data {
        id
        name
        state {
          id
          name
        }
        country {
          id
          name
        }
      }
      paginatorInfo {
        total
      }
    }
  }
`;
export const CountriesDocument = gql`
  query countries($name: String, $first: Int!, $page: Int) {
    countries(name: $name, first: $first, page: $page) {
      data {
        id
        name
      }
      paginatorInfo {
        total
      }
    }
  }
`;
export const DashboardWidgetDocument = gql`
  query dashboardWidget {
    me {
      completed_trainings_count
      checkins_count
      reviews_count
      positive_reviews_count
      negative_reviews_count
      reviews_count
      recommended_count
      left_reviews_count
      completed_trainings_count
      trainings_count
      trainer_dashboard_stats {
        total_earn
        earn_last_thirty_days
        total_bookings
      }
    }
  }
`;
export const EquipmentsDocument = gql`
  query equipments($first: Int, $page: Int) {
    equipments(first: $first, page: $page) {
      data {
        id
        name
        icon
        iconUrl
      }
    }
  }
`;
export const EventDocument = gql`
  query event($id: ID!) {
    event(id: $id) {
      id
      title
      description
      start_date
      end_date
      price
      front_price
      trainer {
        id
        avatarUrl
        first_name
        last_name
        score
        address {
          id
          lat
          lng
          extra
          street
          city {
            id
            name
            state {
              name
            }
          }
        }
        facilities {
          address {
            street
          }
        }
        settings {
          setting {
            code
          }
          value
        }
      }
      facility {
        id
        name
        score
        media {
          pathUrl
        }
        address {
          street
        }
      }
      address {
        id
        lat
        lng
        extra
        street
        city {
          id
          name
          country {
            id
            name
          }
          state {
            id
            name
          }
          }
         
      }
      media {
        id
        pathUrl
      }
      max_participants
      booked_count
      was_ordered_by_me
      equipments {
        id
        name
        icon
        iconUrl
      }
      amenities {
        id
        name
        icon
        iconUrl
      }
      products {
        product_id
        price
      }
    }
  }
`;
export const EventsDocument = gql`
  query events(
    $title: String
    $near: NearFilter
    $start_date: DateTimeRange
    $end_date: DateTimeRange
    $created_by_trainer: ID
    $created_by_facility: ID
    $orderBy: [QueryEventsOrderByOrderByClause!]
    $first: Int
    $page: Int
    $ownedByUser: ID
  ) {
    events(
      title: $title
      near: $near
      start_date: $start_date
      end_date: $end_date
      created_by_trainer: $created_by_trainer
      created_by_facility: $created_by_facility
      orderBy: $orderBy
      first: $first
      page: $page
      ownedByUser: $ownedByUser
    ) {
      data {
        address {
          lat
          lng
          street
        }
        amenities {
          icon
          iconUrl
          name
        }
        description
        end_date
        equipments {
          icon
          iconUrl
          name
        }
        id
        max_participants
        booked_count
        was_ordered_by_me
        media {
          pathUrl
        }
        price
        start_date
        title
      }
      paginatorInfo {
        total
      }
    }
  }
`;
export const FacilitiesDocument = gql`
  query facilities(
    $near: NearFilter
    $search: String
    $first: Int
    $name: String
    $page: Int
    $city_id: ID
    $state_id: ID
    $organization_id: ID
    $is_followed: Boolean
  ) {
    facilities(
      near: $near
      search: $search
      first: $first
      name: $name
      page: $page
      city_id: $city_id
      state_id: $state_id
      organization_id: $organization_id
      is_followed: $is_followed
    ) {
      data {
        id
        name
        score
        is_followed
        media {
          path
          pathUrl
        }
        address {
          lat
          lng
          street
        }
        productItems {
          id
          qr_code_lifetime_value
          qr_code_lifetime_enum
          checkin_counter
          is_unlimited_checkin
          title
          product_id
          price
          products {
            provider
            price
            product_id
            duration
            currency
            start_date
            end_date
            checkin_number
            state
            gatewayProductable {
              ... on StripeProduct {
                id
                name
                product_id
                price_id
                unit_amount
                currency
                active
              }
              ... on PaypalProduct {
                id
                name
                product_id
                price_id
                unit_amount
                currency
                active
              }
            }
          }
        }
      }
      paginatorInfo {
        total
        firstItem
      }
    }
  }
`;
export const FacilityDocument = gql`
  query facility($id: ID!) {
    facility(id: $id) {
      address {
        lat
        lng
        street
      }
      created_at
      equipments {
        name
        id
      }
      id
      is_followed
      media {
        path
        pathUrl
      }
      name
      score
      description
      not_recommended_count
      recommended_count
      reviews_count
      positive_reviews_count
      negative_reviews_count
      amenities {
        id
        name
        icon
        iconUrl
      }
      productItems {
        id
        qr_code_lifetime_value
        qr_code_lifetime_enum
        checkin_counter
        is_unlimited_checkin
        title
        product_id
        price
        front_price
        description
        products {
          provider
          price
          product_id
          duration
          currency
          start_date
          end_date
          checkin_number
          state
          gatewayProductable {
            ... on StripeProduct {
              id
              name
              product_id
              price_id
              unit_amount
              currency
              active
            }
            ... on PaypalProduct {
              id
              name
              product_id
              price_id
              unit_amount
              currency
              active
            }
          }
        }
      }
    }
  }
`;
export const FacilityItemPassDocument = gql`
  query facilityItemPass($id: ID) {
    facilityItemPass(id: $id) {
      id
      start_date
      end_date
      is_active_pass
      order {
        front_total
      }
      facilityItem {
        title
        description
        facility {
          id
          name
          score
          media {
            pathUrl
          }
          address {
            street
          }
        }
      }
      user {
        id
        first_name
        last_name
        avatarUrl
        address {
          street
        }
        positive_reviews_count
        negative_reviews_count
      }
    }
  }
`;
export const General_DocumentDocument = gql`
  query general_document($code: GeneralDocumentsEnum!) {
    general_document(code: $code) {
      value
    }
  }
`;
export const GetCartDocument = gql`
  query getCart($id: ID!) {
    getCart(id: $id) {
      id
      start_date
      user {
        email
      }
      type
      items {
        id
        front_total
        productable {
          ... on Event {
            id
            title
            description
            start_date
            end_date
            price
            max_participants
            front_price
            address {
              street
            }
            media {
              pathUrl
            }
            max_participants
            booked_count
          }
          ... on Workout {
            id
            title
            description
            duration
            preview
            previewUrl
            front_price
            price
            type {
              id
              name
              icon
            }
            exercises {
              id
              title
              description
              path
              previewUrl
              pathUrl
            }
            trainer {
              id
              first_name
              last_name
              gender
              role
              score
            }
          }
          ... on FacilityItem {
            id
            facility {
              name
            }
            qr_code_lifetime_value
            qr_code_lifetime_enum
            checkin_counter
            is_unlimited_checkin
            title
            product_id
            price
            front_price
          }
          ... on TrainerRate {
            front_price
            price
            rate_type
            title
          }
        }
      }
    }
  }
`;
export const LinksDocument = gql`
  query links {
    links {
      url
      expires_at
    }
  }
`;
export const StripeCardsDocument = gql`
  query stripeCards {
    cards {
      data {
        id
        pm_last_four
        brand
        card_holder
        exp_year
        exp_month
        is_default
      }
    }
  }
`;
export const MeDocument = gql`
  query me {
    me {
      id
      first_name
      last_name
      avatar
      avatarUrl
      trainer_type
      opening_hours
      has_password
      currentSubscription
      settings {
        setting {
          code
        }
        value
      }
      facilities {
        id
        name
        media {
          pathUrl
        }
        address {
          street
        }
      }
      owned_facilities {
        description
        id
        name
        media {
          pathUrl
          id
        }
        amenities {
          id
          name
          icon
          iconUrl
        }
        equipments {
          id
          name
          icon
          iconUrl
        }
        address {
          id
          lat
          lng
          extra
          street
          city {
            id
            name
            state {
              name
            }
          }
        }
      }
      media {
        pathUrl
        id
      }
      address {
        id
        lat
        lng
        extra
        street
        city {
          id
          name
          state {
            name
            id
            code
          }
          country {
            name
            id
          }
        }
      }
      weiver_and_labilities {
        id
        title
        path
        pathUrl
        type
      }
      certificates {
        id
        title
        path
        pathUrl
        type
      }
    }
  }
`;
export const MyStripeConnectDocument = gql`
  query myStripeConnect {
    myStripeConnect {
      account_id
      state
    }
  }
`;
export const MyCartsDocument = gql`
  query myCarts {
    myCarts {
      data {
        id
        type
        discount
        start_date
        end_date
        total
        type
        sub_total
        front_total
        user {
          email
        }
        items {
          id
          productable {
            ... on Event {
              id
              title
            }
            ... on Workout {
              id
              title
            }
            ... on FacilityItem {
              id
              title
            }
            ... on TrainerRate {
              front_price
            }
          }
        }
      }
    }
  }
`;
export const MyTrainingsDocument = gql`
  query myTrainings(
    $start_date: DateTimeRange
    $end_date: DateTimeRange
    $orderBy: [QueryMyTrainingsOrderByOrderByClause!]
    $first: Int
    $page: Int
  ) {
    myTrainings(
      orderBy: $orderBy
      first: $first
      page: $page
      start_date: $start_date
      end_date: $end_date
    ) {
      data {
        id
        state
        start_date
        trainer {
          avatarUrl
          first_name
          last_name
          address {
            street
          }
        }
      }
      paginatorInfo {
        total
      }
    }
  }
`;
export const MyWorkoutsDocument = gql`
  query myWorkouts(
    $orderBy: [QueryMyWorkoutsOrderByOrderByClause!]
    $first: Int = 10
    $page: Int
  ) {
    myWorkouts(orderBy: $orderBy, first: $first, page: $page) {
      data {
        id
        type {
          id
          name
          icon
        }
        trainer {
          first_name
          last_name
        }
        previewUrl
        title
        description
        price
        duration
        exercises {
          id
          title
          description
          path
          pathUrl
        }
      }
      paginatorInfo {
        count
        currentPage
        total
        perPage
      }
    }
  }
`;
export const OrdersDocument = gql`
  query orders($first: Int = 10, $page: Int, $states: [TransactionStatesEnum]) {
    orders(first: $first, page: $page, states: $states) {
      data {
        id
        items {
          price
          orderable {
            __typename
            ... on FacilityItem {
              id
              created_at
              facility {
                name
                id
                score
                productItems {
                  price
                  created_at
                }
                media {
                  pathUrl
                }
                address {
                  street
                  extra
                  city {
                    name
                  }
                }
              }
            }
            ... on Workout {
              id
              title
              price
              previewUrl
              created_at
            }
            ... on Event {
              id
              title
              start_date
              media {
                pathUrl
              }
              address {
                street
                extra
                city {
                  name
                }
              }
            }
            ... on TrainerRate {
              front_price
              id
              title
              user {
                avatarUrl
                first_name
                last_name
                score
                facilities {
                  address {
                    street
                    extra
                  }
                }
              }
            }
          }
        }
      }
      paginatorInfo {
        total
      }
    }
  }
`;
export const PaypalTokenDocument = gql`
  query paypalToken {
    paypalToken {
      token
    }
  }
`;
export const PlansDocument = gql`
  query plans($type: SubscriptionsTypeEnum, $first: Int = 10, $page: Int) {
    plans(type: $type, first: $first, page: $page) {
      paginatorInfo {
        total
      }
      data {
        id
        title
        description
        fee
        prices {
          id
          price
        }
        tier
        type
        is_active
        benefits {
          id
          benefit_key
          description
        }
        subscriptionPlans {
          id
          billing_period
          renewal_type
          grace_period
          is_active
          provider
          product_id
        }
      }
    }
  }
`;
export const QuizzesDocument = gql`
  query quizzes($role: RoleEnum!) {
    quizzes(role: $role) {
      data {
        id
        type
        title
        description
        status
        options {
          id
          title
          value
        }
      }
      paginatorInfo {
        total
      }
    }
  }
`;
export const RecommendedWorkoutsDocument = gql`
  query recommendedWorkouts($first: Int = 10, $page: Int) {
    recommendedWorkouts(first: $first, page: $page) {
      data {
        id
        preview
        reviews_count
        recommended_count
        video
        videoUrl
        purchases
        views_count
        type {
          id
          name
          icon
        }
        previewUrl
        title
        description
        price
        duration
        was_ordered_by_me
        exercises {
          id
          title
          description
          path
          previewUrl
          pathUrl
        }
        trainer {
          first_name
          last_name
          score
          address {
            lat
            lng
          }
          facilities {
            media {
              pathUrl
            }
            address {
              lat
              lng
            }
          }
        }
      }
      paginatorInfo {
        count
        firstItem
        currentPage
        total
        perPage
      }
    }
  }
`;
export const RecommendedWorkoutsByBodyPartsDocument = gql`
  query recommendedWorkoutsByBodyParts($first: Int = 10, $page: Int) {
    recommendedWorkoutsByBodyParts(first: $first, page: $page) {
      data {
        id
        preview
        reviews_count
        recommended_count
        video
        videoUrl
        purchases
        views_count
        type {
          id
          name
          icon
        }
        previewUrl
        title
        description
        price
        duration
        was_ordered_by_me
        exercises {
          id
          title
          description
          path
          previewUrl
          pathUrl
        }
        trainer {
          first_name
          last_name
          facilities {
            media {
              pathUrl
            }
            address {
              lat
              lng
            }
          }
        }
      }
      paginatorInfo {
        count
        currentPage
        total
        perPage
      }
    }
  }
`;
export const RecommendedWorkoutsByTypeDocument = gql`
  query recommendedWorkoutsByType($first: Int = 10, $page: Int) {
    recommendedWorkoutsByType(first: $first, page: $page) {
      data {
        id
        preview
        reviews_count
        recommended_count
        video
        videoUrl
        purchases
        views_count
        type {
          id
          name
          icon
        }
        previewUrl
        title
        description
        price
        duration
        exercises {
          id
          title
          description
          path
          previewUrl
          pathUrl
        }
        was_ordered_by_me
        trainer {
          first_name
          last_name
          facilities {
            media {
              pathUrl
            }
            address {
              lat
              lng
            }
          }
        }
      }
      paginatorInfo {
        count
        currentPage
        total
        perPage
      }
    }
  }
`;
export const ReviewsDocument = gql`
  query reviews(
    $type: FeedbackEntityEnum
    $id: ID!
    $review_type: ReviewTypeEnum
  ) {
    reviews(type: $type, id: $id, review_type: $review_type) {
      data {
        author {
          id
          first_name
          last_name
          avatarUrl
        }
        id
        review
        score
        created_at
      }
    }
  }
`;
export const StatesDocument = gql`
  query states($name: String, $country_id: ID, $first: Int!, $page: Int) {
    states(name: $name, country_id: $country_id, first: $first, page: $page) {
      data {
        id
        name
        code
      }
      paginatorInfo {
        total
      }
    }
  }
`;
export const SetupIntentDocument = gql`
  query setupIntent($product_id: ID) {
    setupIntent(product_id: $product_id) {
      session
    }
  }
`;
export const TrainingDocument = gql`
  query training($id: ID!) {
    training(id: $id) {
      id
      start_date
      state
      order {
        id
        front_total
        state
      }
      user {
        id
        email
        first_name
        last_name
        avatarUrl
        positive_reviews_count
        negative_reviews_count
        address {
          street
        }
      }
      trainer {
        id
        avatarUrl
        first_name
        last_name
        score
        address {
          street
        }
        facilities {
          address {
            street
          }
        }
        settings {
          setting {
            code
          }
          value
        }
      }
    }
  }
`;
export const UserDocument = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      email
      employment_type
      birth
      postal
      tax_id
      role
      first_name
      last_name
      avatar
      was_commented_by_me
      was_visited_by_me
      avatarUrl
      trainings_count
      created_at
      is_followed
      trainer_type
      has_password
      currentSubscription
      weiver_and_labilities {
        id
        title
        path
        pathUrl
        type
      }
      certificates {
        id
        title
        path
        pathUrl
        type
      }
      positive_reviews_count
      negative_reviews_count
      completed_trainings_count
      reviews_count
      score
      settings {
        setting {
          code
        }
        value
      }
      facilities {
        id
        name
        media {
          pathUrl
        }
        address {
          street
        }
      }
      media {
        pathUrl
        id
      }
      owned_facilities {
        id
        name
        media {
          pathUrl
        }
        address {
          street
        }
      }
      address {
        street
        city {
          name
          state {
            name
          }
          country {
            name
          }
        }
      }
      trainerRates {
        rate_type
        front_price
        products {
          product_id
        }
      }
      facilityItemPasses {
        is_active_pass
        facilityItem {
          qr_code_lifetime_value
          qr_code_lifetime_enum
          checkin_counter
          is_unlimited_checkin
          title
          product_id
          price
        }
      }
      quizzes {
        code
        answers {
          value
        }
      }
    }
  }
`;
export const UserAvailabilityDocument = gql`
  query userAvailability($id: ID!, $from: DateTime!, $to: DateTime!) {
    userAvailability(id: $id, from: $from, to: $to) {
      hours {
        from
        to
      }
      trainings {
        id
        order {
          total
          fee
          order_subtotal
        }
        state
        start_date
        end_date
      }
      events {
        start_date
        end_date
      }
    }
  }
`;
export const UsersDocument = gql`
  query users(
    $role: RoleEnum
    $near: NearFilter
    $search: String
    $first: Int
    $page: Int
    $is_followed: Boolean
    $availability: UsersAvailabilityFilter
    $facilities: [ID]
  ) {
    users(
      role: $role
      near: $near
      search: $search
      first: $first
      page: $page
      is_followed: $is_followed
      availability: $availability
      facilities: $facilities
    ) {
      data {
        id
        score
        first_name
        last_name
        avatarUrl
        is_followed
        trainer_type
        address {
          lat
          lng
          street
        }
        facilities {
          id
          name
          address {
            lat
            lng
            street
          }
        }
        media {
          pathUrl
        }
        settings {
          setting {
            code
          }
          value
        }
      }
      paginatorInfo {
        total
        firstItem
      }
    }
  }
`;
export const WorkoutDocument = gql`
    query workout($id: ID!) {
  workout(id: $id) {
    id
    type {
      id
      name
      icon
    }
    previewUrl
    title
    was_ordered_by_me
    description
    price
    duration
    exercises {
      id
      title
      description
      path
      previewUrl
      pathUrl
    }
    products {
      product_id
    }
    trainer {
      id
      first_name
      last_name
      gender
      role
      score
    }
    positive_reviews_count
    negative_reviews_count
  }
}
    `;
export const WorkoutsDocument = gql`
  query workouts(
    $dynamic_search: String!
    $trainer_id: ID
    $first: Int
    $page: Int
    $type_id: ID
    $has_body_parts: [ID!]
    $order: SortOrder!
    $orderByColumn: QueryWorkoutsOrderByColumn!
  ) {
    workouts(
      dynamic_search: $dynamic_search
      trainer_id: $trainer_id
      first: $first
      page: $page
      type_id: $type_id
      has_body_parts: $has_body_parts
      orderBy: { column: $orderByColumn, order: $order }
    ) {
      data {
        id
        preview
        type {
          id
          name
          icon
        }
        previewUrl
        title
        description
        price
        duration
        was_ordered_by_me
        exercises {
          id
          title
          description
          path
          previewUrl
          pathUrl
        }
        trainer {
          first_name
          last_name
          score
          address {
            lat
            lng
          }
          facilities {
            media {
              pathUrl
            }
            address {
              lat
              lng
            }
          }
        }
        state
      }
      paginatorInfo {
        count
        firstItem
        currentPage
        total
        perPage
      }
    }
  }
`;
export const WorkoutsByFacilityDocument = gql`
  query facilityWorkouts(
    $dynamic_search: String
    $facility_id: ID
    $first: Int
    $page: Int
    $type_id: ID
    $has_body_parts: [ID!]
    $order: SortOrder!
    $orderByColumn: QueryFacilityWorkoutsOrderByColumn!
  ) {
    facilityWorkouts(
      dynamic_search: $dynamic_search
      facility_id: $facility_id
      first: $first
      page: $page
      type_id: $type_id
      has_body_parts: $has_body_parts
      orderBy: { column: $orderByColumn, order: $order }
    ) {
      data {
        id
        preview
        reviews_count
        recommended_count
        total_revenue
        views_count
        purchases
        video
        videoUrl
        type {
          id
          name
          icon
        }
        previewUrl
        title
        description
        price
        duration
        was_ordered_by_me
        created_at
        exercises {
          id
          title
          description
          path
          previewUrl
          pathUrl
        }
        trainer {
          first_name
          last_name
          score
          address {
            lat
            lng
          }
          facilities {
            media {
              pathUrl
            }
            address {
              lat
              lng
            }
          }
        }
        state
      }
      paginatorInfo {
        count
        firstItem
        currentPage
        total
        perPage
      }
    }
  }
`;
export const CreateTrainerWorkoutDocument = gql`
  mutation createTrainerWorkout(
    $body_parts: [ID!]!
    $type_id: ID
    $title: String!
    $description: String
    $price: Float!
    $duration: Int!
    $preview: StringOrUpload
    $exercises: [WorkoutVideosInput!]
  ) {
    createTrainerWorkout(
      input: {
        body_parts: $body_parts
        type_id: $type_id
        title: $title
        description: $description
        price: $price
        duration: $duration
        exercises: $exercises
        preview: $preview
      }
    ) {
      id
      type {
        id
        name
        icon
      }
      trainer {
        id
        first_name
        last_name
      }
      title
      description
      price
      duration
      preview
      previewUrl
      exercises {
        id
        title
        description
        path
        pathUrl
      }
      bodyParts {
        id
        name
        icon
      }
    }
  }
`;
export const CreateDailyDocument = gql`
  mutation createDaily(
    $body_parts: [ID!]
    $facility_id: ID
    $type_id: ID
    $title: String!
    $description: String
    $price: Float!
    $duration: Int
    $preview: StringOrUpload
    $video: StringOrUpload
  ) {
    createDaily(
      input: {
        body_parts: $body_parts
        facility_id: $facility_id
        type_id: $type_id
        title: $title
        description: $description
        price: $price
        duration: $duration
        video: $video
        preview: $preview
      }
    ) {
      id
      type {
        id
        name
        icon
      }
      title
      description
      price
      duration
      preview
      previewUrl
      video
      videoUrl
      bodyParts {
        id
        name
        icon
      }
    }
  }
`;

export const UpdateDailyDocument = gql`
  mutation updateDaily($id: ID!, $input: UpdateDailyInput!) {
    updateDaily(id: $id, input: $input) {
      id
    }
  }
`;

export const DeleteDailyDocument = gql`
  mutation deleteDaily($id: ID!) {
    deleteDaily(id: $id) {
      id
    }
  }
`;
export const DailyAnalyticsDocument = gql`
  query dailyAnalytics($facility_id: ID!) {
    dailyAnalytics(facility_id: $facility_id) {
      total_revenue
      purchases
      views
      per_daily_views
    }
  }
`;
export const DailyPerformanceDocument = gql`
  query dailyPerformance($facility_id: ID!, $limit: Int) {
    dailyPerformance(facility_id: $facility_id, limit: $limit) {
      date
      count
    }
  }
`;
export const FilePreloadDocument = gql`
  mutation filePreload($file: Upload!, $upload_dir: String) {
    filePreload(file: $file, upload_dir: $upload_dir) {
      path
    }
  }
`;

export const VideoPreloadDocument = gql`
  mutation videoPreload($file: Upload!, $upload_dir: String) {
    videoPreload(file: $file, upload_dir: $upload_dir) {
      path
      thumbnail_path
      duration
    }
  }
`;
export const HideWorkoutDocument = gql`
  mutation hideWorkout($id: ID!) {
    hideWorkout(id: $id) {
      id
      state
    }
  }
`;
export const ShowWorkoutDocument = gql`
  mutation showWorkout($id: ID!) {
    showWorkout(id: $id) {
      id
      state
    }
  }
`;
export const UpdateTrainerTypeDocument = gql`
  mutation updateTrainerType(
    $id: ID!
    $trainer_type: TrainerTypeEnum
    $facility_id: ID
    $settings: [SetSettingInput!]
    $address: AddressInput
    $opening_hours: JSON
  ) {
    updateUser(
      id: $id
      input: {
        trainer_type: $trainer_type
        facility_id: $facility_id
        settings: $settings
        address: $address
        opening_hours: $opening_hours
      }
    ) {
      id
      trainer_type
      facilities {
        id
        name
      }
      settings {
        setting {
          code
        }
        value
      }
      trainerRates {
        id
        title
        front_price
      }
      address {
        lat
        lng
        street
        extra
        city {
          name
          state {
            name
          }
          country {
            name
          }
        }
      }
      first_name
      last_name
    }
  }
`;
export const BodyPartsDocument = gql`
  query bodyParts($first: Int, $page: Int) {
    bodyParts(first: $first, page: $page) {
      data {
        id
        name
      }
    }
  }
`;
export const TrainerTrainingsDocument = gql`
  query trainerTrainings(
    $filters: TrainingsFilterInput
    $orderBy: [QueryTrainerTrainingsOrderByOrderByClause!]
    $first: Int!
    $page: Int
  ) {
    trainerTrainings(
      filters: $filters
      orderBy: $orderBy
      first: $first
      page: $page
    ) {
      data {
        address_string
        id
        start_date
        state
        user {
          avatar
          avatarUrl
          media {
            pathUrl
          }
          first_name
          last_name
          address {
            street
          }
        }
        order {
          total
        }
        trainer {
          facilities {
            address {
              street
            }
          }
        }
      }
      paginatorInfo {
        total
      }
    }
  }
`;
export const WorkoutTypesDocument = gql`
  query workoutTypes($first: Int, $page: Int) {
    workoutTypes(first: $first, page: $page) {
      data {
        id
        name
      }
    }
  }
`;
export const MyEventsDocument = gql`
  query myEvents(
    $start_date: DateTimeRange
    $end_date: DateTimeRange
    $orderBy: [QueryMyEventsOrderByOrderByClause!]
    $first: Int
    $page: Int
  ) {
    myEvents(
      start_date: $start_date
      end_date: $end_date
      orderBy: $orderBy
      first: $first
      page: $page
    ) {
      data {
        id
        title
        address {
          street
        }
        start_date
        media {
          pathUrl
        }
      }
      paginatorInfo {
        total
      }
    }
  }
`;
export const MyFacilityItemPassesDocument = gql`
  query myFacilityItemPasses(
    $start_date: DateTimeRange
    $end_date: DateTimeRange
    $orderBy: [QueryMyFacilityItemPassesOrderByOrderByClause!]
    $first: Int
    $page: Int
  ) {
    myFacilityItemPasses(
      start_date: $start_date
      end_date: $end_date
      orderBy: $orderBy
      first: $first
      page: $page
    ) {
      data {
        id
        start_date
        end_date
        is_active_pass
        facilityItem {
          title
          qr_code_lifetime_value
          facility {
            id
            name
            media {
              pathUrl
            }
            address {
              street
            }
          }
        }
      }
      paginatorInfo {
        total
      }
    }
  }
`;
export const FacilityDashboardWidgetDocument = gql`
  query facilityDashboardWidget($id: ID!) {
    facilityDashboardWidget(id: $id) {
      event_count
      dropin_count
      pass_count
      daily_count
      message_count
      expiring_membership_count
      today_earn
      earn_last_thirty_days
      year_earn
      checkin_data {
        value
        month
      }
    }
  }
`;
export const CreateFacilityItemDocument = gql`
  mutation createFacilityItem($input: CreateFacilityItemInput!) {
    createFacilityItem(input: $input) {
      id
      title
      price
      facility {
        id
      }
      product_id
      duration
      item_type
    }
  }
`;

export const UpdateFacilityItemDocument = gql`
  mutation updateFacilityItem($id: ID!, $input: UpdateFacilityItemInput!) {
    updateFacilityItem(id: $id, input: $input) {
      id
    }
  }
`;

export const DeleteFacilityItemDocument = gql`
  mutation deleteFacilityItem($id: ID!) {
    deleteFacilityItem(id: $id) {
      id
    }
  }
`;

export const FacilityItemDocument = gql`
  query facilityItemById($id: ID!) {
    facilityItemById(id: $id) {
      id
      title
      price
      facility_id
      product_id
      duration
      item_type
    }
  }
`;

export const FacilityItemsByFacilityIdAndTypeDocument = gql`
  query facilityItemsByFacilityIdAndType(
    $facility_id: ID!
    $item_type: FacilityItemTypeEnum
  ) {
    facilityItemsByFacilityIdAndType(
      facility_id: $facility_id
      item_type: $item_type
    ) {
      data {
        id
        title
        price
        facility {
          id
        }
        product_id
        duration
        item_type
      }
    }
  }
`;

export const GetCustomersByFacilityItemsDocument = gql`
  query getCustomersByFacilityItems(
    $facility_id: ID!
    $item_type: FacilityItemTypeEnum
  ) {
    getCustomersByFacilityItems(
      facility_id: $facility_id
      item_type: $item_type
    ) {
      data {
        id
        start_date
        end_date
        is_active_pass
        created_at
        user {
          id
          email
          first_name
          last_name
          avatarUrl
        }
        facilityItem {
          title
          qr_code_lifetime_value
          duration
          facility {
            id
            name
            media {
              pathUrl
            }
            address {
              street
            }
          }
        }
      }
      paginatorInfo {
        total
      }
    }
  }
`;

export const CreateManagerDocument = gql`
  mutation createManager($input: CreateManagerInput!) {
    createManager(input: $input) {
      id
    }
  }
`;

export const DeleteManagerDocument = gql`
  mutation deleteManager($id: ID!) {
    deleteManager(id: $id) {
      id
    }
  }
`;

export const GetManagersByFacilityDocument = gql`
  query managers($role: RoleEnum, $first: Int, $page: Int, $facilities: [ID]) {
    managers(role: $role, facilities: $facilities, first: $first, page: $page) {
      data {
        id
        email
        employment_type
        email_verified_at
        score
        first_name
        last_name
        avatarUrl
        is_followed
        trainer_type
        address {
          lat
          lng
          street
        }
        facilities {
          id
          name
          address {
            lat
            lng
            street
          }
        }
        media {
          pathUrl
        }
        settings {
          setting {
            code
          }
          value
        }
      }
      paginatorInfo {
        total
        firstItem
      }
    }
  }
`;

export const GetFacilitySubscriptionDocument = gql`
  query facilitySubscription($facility_id: ID) {
    facilitySubscription(facility_id: $facility_id) {
      subscription
    }
  }
`;
export const DailyViewsAndPurchasesDocument = gql`
    query workout($id: ID!) {
  workout(id: $id) {
    id
    recommended_users {
      id
      first_name
      last_name
      email
      avatarUrl
      was_commented_by_self
    }
    purchased_users {
      id
      first_name
      last_name
      email
      avatarUrl
      was_commented_by_self
    }
    viewed_users {
      id
      first_name
      last_name
      email
      avatarUrl
      was_commented_by_self
    }
  }
}
`;
