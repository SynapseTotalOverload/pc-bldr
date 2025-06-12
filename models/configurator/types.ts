export type UseCase = {
  key: 'workstation' | 'gaming' | 'office';
  label: string;
  desc: string;
  icon: string;
};

export type PCPart = {
  type: string;
  name: string;
  price: number;
};

export type BudgetTier = {
  label: string;
  range: [number, number];
  default: number;
};

export type ConfiguratorState = {
  budget: number;
  useCase: UseCase['key'];
  showExtras: boolean;
};
