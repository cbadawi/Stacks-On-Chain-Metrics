export interface IPlans {
  charts: IPlan[];
  api: IPlan[];
}

export interface IPlan {
  name: string;
  price: string;
  perks: string[];
}
