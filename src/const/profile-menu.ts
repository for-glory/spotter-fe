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
      name: EntitiesEnum.ProfileEdit,
      label: "Edit profile",
      icon: "edit",
    },
    {
      name: "View Profile",
      label: "View profile",
      icon: 'profile'
    },
    {
      name: EntitiesEnum.ProfileMembership,
      label: "Membership",
      icon: "membership",
      isTrusted: true,
    },
    {
      name: EntitiesEnum.ProfileScan,
      label: "Scan",
      icon: "scan",
    },
    // {
    //   name: EntitiesEnum.ProfileWorkingSchedule,
    //   label: "Working schedule",
    //   icon: "working",
    //   isTrusted: true,
    // },
    {
      name: EntitiesEnum.ProfilePaymentMethods,
      label: "Getting Paid",
      icon: "paid",
      isTrusted: true,
    },
    // {
    //   name: EntitiesEnum.ProfilePaymentMethods,
    //   label: "Payment methods",
    //   icon: "payment",
    //   isTrusted: true,
    // },
    // {
    //   name: EntitiesEnum.ProfileBookingHistory,
    //   label: "Booking history",
    //   icon: "history",
    //   isTrusted: true,
    // },
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
      name: EntitiesEnum.ManagersOverview,
      label: "Managers",
      icon: "working",
      isTrusted: true,
    },
    {
      name: EntitiesEnum.Membership,
      label: "Membership",
      icon: "membership",
      isTrusted: true,
    },
    {
      name: EntitiesEnum.ProfileScan,
      label: "Scan",
      icon: "qr-code",
      isTrusted: true,
    },
    {
      name: EntitiesEnum.DashboardGettingPaid,
      label: "Getting Paid",
      icon: "payment",
      isTrusted: true,
    },

  ],
};
