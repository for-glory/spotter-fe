import Card from "./card";
import { StripeCard } from "@/generated/graphql";

export class Cards {
  public cards: Array<Card> = [];
  public init(rawCards: any) {
    this.cards = [];
    rawCards.forEach((element: StripeCard) => {
      const card = new Card(
        element.brand,
        element.exp_month,
        element.exp_year,
        element.is_default,
        element.id,
        element.pm_last_four,
        element.card_holder
      );
      this.cards.push(card);
    });
  }
}
