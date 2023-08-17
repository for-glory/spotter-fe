import { ProfileMenuItem } from "@/interfaces/ProfileMenuItem";
import { EntitiesEnum } from "@/const/entities";

type ProfileMenu = Record<string, ProfileMenuItem[]>;

export const profileMenu: ProfileMenu = {
  USER: [
    {
      name: EntitiesEnum.ProfileIdentityVerification,
      label: "Identify verification",
      icon: "identity",
    },
    {
      name: EntitiesEnum.ProfileEdit,
      label: "Edit profile",
      icon: "edit",
    },
    {
      name: EntitiesEnum.ProfilePaymentMethods,
      label: "Payment methods",
      icon: "payment",
      isTrusted: true,
    },
    {
      name: EntitiesEnum.ProfileBookingHistory,
      label: "Booking history",
      icon: "history",
      isTrusted: true,
    },
  ],
  TRAINER: [
    {
      name: EntitiesEnum.ProfileScan,
      label: "Scan code",
      icon: "scan",
    },
    {
      name: EntitiesEnum.ProfileEdit,
      label: "Edit profile",
      icon: "edit",
    },
    {
      name: EntitiesEnum.ProfileWorkingSchedule,
      label: "Working schedule",
      icon: "working",
      isTrusted: true,
    },
    {
      name: EntitiesEnum.ProfileMembership,
      label: "Membership",
      icon: "membership",
      isTrusted: true,
    },
    {
      name: EntitiesEnum.ProfilePaymentMethods,
      label: "Payment methods",
      icon: "payment",
      isTrusted: true,
    },
    {
      name: EntitiesEnum.ProfileBookingHistory,
      label: "Booking history",
      icon: "history",
      isTrusted: true,
    },
  ],
  FACILITY: [
    {
      name: EntitiesEnum.ProfileEdit,
      label: "Edit profile",
      icon: "edit",
    },
    {
      name: EntitiesEnum.Facility,
      label: "View profile",
      icon: "profile",
      isTrusted: true,
    },
    {
      name: EntitiesEnum.ProfileMembership,
      label: "Membership",
      icon: "membership",
      isTrusted: true,
    },
    {
      name: EntitiesEnum.ProfilePaymentMethods,
      label: "Payment methods",
      icon: "payment",
      isTrusted: true,
    },
    {
      name: EntitiesEnum.ProfileBookingHistory,
      label: "Booking history",
      icon: "search",
      isTrusted: true,
    },
    {
      name: EntitiesEnum.Profile,
      label: "Gym pass",
      icon: "pass",
      isTrusted: true,
    },
    {
      name: EntitiesEnum.Profile,
      label: "Drop ins",
      icon: "eye",
      isTrusted: true,
    },
    {
      name: EntitiesEnum.Profile,
      label: "Daily Plan",
      icon: "history",
      isTrusted: true,
    },
  ],
};
