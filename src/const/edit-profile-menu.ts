import { EditProfileMenuItem } from "@/interfaces/EditProfileMenuItem";
import { EntitiesEnum } from "@/const/entities";

type EditProfileMenu = Record<string, EditProfileMenuItem[]>;

export const editProfileMenu: EditProfileMenu = {
  USER: [
    {
      name: EntitiesEnum.ProfileEmail,
      label: "Change email",
    },
    {
      name: EntitiesEnum.ProfilePassword,
      label: "Change password",
    },
    // {
    //   name: EntitiesEnum.ProfileLanguages,
    //   label: "Language",
    //   value: EntitiesEnum.Language,
    // },
    // {
    //   name: EntitiesEnum.ProfileAppMode,
    //   label: "App mode",
    //   value: EntitiesEnum.AppMode,
    // },
    // {
    //   name: EntitiesEnum.ProfileNotifications,
    //   label: "Notifications",
    // },
    {
      name: EntitiesEnum.ProfilePreferences,
      label: "Preferences",
    },
    {
      name: EntitiesEnum.ProfileLocation,
      label: "Location",
    },
  ],
  TRAINER: [
    {
      name: EntitiesEnum.ProfileEditTrainer,
      label: "Edit trainer information",
    },
    {
      name: EntitiesEnum.ProfileEmail,
      label: "Change email",
    },
    {
      name: EntitiesEnum.ProfilePassword,
      label: "Change password",
    },
    {
      name: EntitiesEnum.ProfilePronounce,
      label: "Pronounce",
    },
    // {
    //   name: EntitiesEnum.ProfileLanguages,
    //   label: "Language",
    //   value: EntitiesEnum.Language,
    // },
    // {
    //   name: EntitiesEnum.ProfileAppMode,
    //   label: "App mode",
    //   value: EntitiesEnum.AppMode,
    // },
    // {
    //   name: EntitiesEnum.ProfileNotifications,
    //   label: "Notifications",
    // },
    // {
    //   name: EntitiesEnum.ProfilePreferences,
    //   label: "Add social links",
    // },
    {
      name: EntitiesEnum.ProfileLocation,
      label: "Location",
    },
    {
      name: EntitiesEnum.ProfileOrderConfirmation,
      label: "Order confirmation",
    },
  ],
  FACILITY: [
    {
      name: EntitiesEnum.ProfileEditGym,
      label: "Edit gym information",
    },
    {
      name: EntitiesEnum.ProfileEmail,
      label: "Change email",
    },
    {
      name: EntitiesEnum.ProfilePassword,
      label: "Change password",
    },
    {
      name: EntitiesEnum.ProfileLanguages,
      label: "Language",
      value: EntitiesEnum.Language,
    },
    {
      name: EntitiesEnum.ProfileAppMode,
      label: "App mode",
      value: EntitiesEnum.AppMode,
    },
    {
      name: EntitiesEnum.ProfileNotifications,
      label: "Notifications",
    },
    {
      name: EntitiesEnum.Profile,
      label: "Add social links",
    },
    {
      name: EntitiesEnum.ProfileOrderConfirmation,
      label: "Order confirmation",
    },
  ],
};
