export type NavigationItem = {
  id?: string;
  name: string;
  label?: string;
  icon?: string;
  category?: string;
  isMainButton?: boolean;
  isActive?: boolean;
  notBasicSubscription?: boolean;
  queryParam?: string;
  queryKey?: string;
};
