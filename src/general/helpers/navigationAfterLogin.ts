import { EntitiesEnum } from "@/const/entities";
import { RoleEnum, SubscriptionsTierEnum, User } from "@/generated/graphql";
import useRoles from "@/hooks/useRole";
import { useSettings } from "@/hooks/useSettings";
import useSubscription from "@/hooks/useSubscription";
import useStripeConnect from "@/hooks/useStripeConnect";
import useVerified from "@/hooks/useVerified";
import useFacilityId from "@/hooks/useFacilityId";
import router from "../../router/index";

const navigationAfterAuth = (user: User) => {
  if (!user.email?.length) {
    router.push({ name: EntitiesEnum.UpdateEmail });
    return;
  }

  const { verified } = useVerified();

  if (!verified) {
    router.push({ name: EntitiesEnum.VerifyEmail });
    return;
  }

  const { isRoleSelected } = useSettings();
  if (!isRoleSelected) {
    router.push({ name: EntitiesEnum.SelectRole });
    return;
  }

  const { role } = useRoles();

  switch (role) {
    case RoleEnum.User: {
      const { isQuizzDone } = useSettings();
      if (!isQuizzDone) {
        router.push({ name: EntitiesEnum.Quizz });
        break;
      }

      router.push({ name: EntitiesEnum.Facilities });
      break;
    }
    case RoleEnum.Trainer: {
      const { isAddressSelected, isQuizzDone, isIdentityVerified } =
        useSettings();
      if (!isAddressSelected) {
        router.push({ name: EntitiesEnum.FreelancerTrainer });
        break;
      }

      if (!isIdentityVerified) {
        router.push({ name: EntitiesEnum.TrainersExtraPersonal });
        break;
      }

      if (!isQuizzDone) {
        router.push({ name: EntitiesEnum.Quizz });
        break;
      }

      const { type: subscriptionType } = useSubscription();
      if (subscriptionType === SubscriptionsTierEnum.Basic) {
        router.push({ name: EntitiesEnum.Profile });
        break;
      }

      router.push({ name: EntitiesEnum.TrainerSchedule });
      break;
    }
    case RoleEnum.Manager:
    case RoleEnum.FacilityOwner: {
      const { type: subscriptionType } = useSubscription();
      console.log(subscriptionType)
      const { stripeAccountState } = useStripeConnect();

      if (subscriptionType === SubscriptionsTierEnum.Basic) {
        router.push({ name: EntitiesEnum.SelectMembership });
        break;
      }

      if (stripeAccountState !== "ACTIVE") {
        router.push({ name: EntitiesEnum.SuccessMembership });
        break;
      }

      const { id: myFacilityId } = useFacilityId();

      if(!myFacilityId) {
        router.push({ name: EntitiesEnum.SuccessStripeConnect });
        break;
      }
      router.push({ name: EntitiesEnum.Dashboard });
      break;
    }
    case RoleEnum.OrganizationOwner: {
      const { isFacilitySetUp } = useSettings();
      if (!isFacilitySetUp) {
        router.push({ name: EntitiesEnum.ChooseFacilityType });
        break;
      }

      router.push({ name: EntitiesEnum.Profile });
      break;
    }
    default:
      break;
  }
};

export default navigationAfterAuth;
