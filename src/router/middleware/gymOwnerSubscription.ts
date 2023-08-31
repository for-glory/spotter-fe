import { SubscriptionUserDocument, RoleEnum } from "@/generated/graphql";
import { Middleware } from "@/ts/types/router";

import initializeApollo from "@/apollo";
import { EntitiesEnum } from "@/const/entities";
import useRoles from "@/hooks/useRole";

const { role } = useRoles();

export const getFacilitySubscription = () => {
  const apolloClient = initializeApollo();
  const facility_id = localStorage.getItem("selectedGym");

  return apolloClient
    .mutate({
      mutation: SubscriptionUserDocument,
      variables: { facility_id: facility_id },
    })
    .then((response) => {
      return response.data.subscriptionUser;
    })
    .catch((error) => {
      console.error(error);
    });
};

export const setSelectedGym = (id: number) => {
  localStorage.setItem('selectedGym', id.toString());
};

const gymOwnerSubscription: Middleware = async ({ next, router }) => {
  if (localStorage.getItem("selectedGym") && role !== RoleEnum.Manager) {
    await getFacilitySubscription()
      .then((data) => {
				console.log("data--->", data);
				if(data) {
					return next();
				}
				else return router.push({ name: EntitiesEnum.DashboardStartMembership });
      })
      .catch(() => {
        return router.push({ name: EntitiesEnum.DashboardStartMembership });
      });
  }

  return next();
};

export default gymOwnerSubscription;
