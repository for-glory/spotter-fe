import { EntitiesEnum } from "@/const/entities";
import router from "../router";
import { paymentGatewaysStore } from "@/users/store/paymentGatewaysStore";
import { PurchasableProductsEnum } from "@/generated/graphql";

export const navigationToSuccessPage = (
  session: string,
  orderId: string,
  cartId: string
) => {
  if(session === EntitiesEnum.Workout.toLocaleLowerCase()){
    router.push({
      name: EntitiesEnum.UserWorkoutPaymentSuccess,
      params: { id: orderId },
      query: { session, cartId },
    });
  } else {
    router.push({
      name: EntitiesEnum.PaymentSuccess,
      params: { id: orderId },
      query: { session, cartId },
    });
  }
};

export const navigationAfterPaymentCompleted = (
  orderId: any,
  cartId: string
) => {
  const paymentProductsStore = paymentGatewaysStore();
  switch (paymentProductsStore.purchasable) {
    case PurchasableProductsEnum.FacilityItem:
      navigationToSuccessPage(
        EntitiesEnum.Facility.toLowerCase(),
        orderId,
        cartId
      );
      break;
    case PurchasableProductsEnum.Training:
      paymentProductsStore.setValue("isOpenWaitingModal", true);
      router.push({
        name: EntitiesEnum.ConfirmOrder,
        params: { id: orderId },
        query: {
          cartId,
          session: PurchasableProductsEnum.Training.toLowerCase(),
        },
      });
      break;
    case PurchasableProductsEnum.Event:
      navigationToSuccessPage(
        EntitiesEnum.Event.toLowerCase(),
        orderId,
        cartId
      );
      break;
    case PurchasableProductsEnum.Workout:
      // router.push({
      //   name: EntitiesEnum.UserExercisesList,
      //   params: {
      //     id: orderId,
      //   },
      // });
      navigationToSuccessPage(
        EntitiesEnum.Workout.toLowerCase(),
        orderId,
        cartId
      );
      break;
    default:
      break;
  }
};
