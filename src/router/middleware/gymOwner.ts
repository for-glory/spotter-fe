import { SubscriptionUserDocument } from "@/generated/graphql";
import { Middleware } from "@/ts/types/router";

import initializeApollo from "@/apollo";
import dayjs from "dayjs";
import { EntitiesEnum } from "@/const/entities";

export const getToken = () => {
  const accessToken = localStorage.getItem("access_token");
  const expiresIn = localStorage.getItem("expires_in");

  if (accessToken && dayjs().isBefore(expiresIn)) {
    return accessToken;
  }

  return "";
};

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

const gymOwner: Middleware = async ({ next, router }) => {
  if (localStorage.getItem("selectedGym")) {
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

export default gymOwner;
