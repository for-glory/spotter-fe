export default class Card {
  public constructor(
    brand: string,
    exp_year: number,
    exp_month: number,
    is_default: boolean,
    id: number,
    pm_last_four: number,
    card_holder: string
  ) {
    this.brand = brand;
    this.exp_month = exp_month;
    this.exp_year = exp_year;
    this.is_default = is_default;
    this.id = id;
    this.pm_last_four = pm_last_four;
    this.card_holder = card_holder;
  }
  public brand = "";
  public exp_year = 0;
  public exp_month = 0;
  public is_default = false;
  public id = 0;
  public pm_last_four = 0;
  public card_holder = "";
}
