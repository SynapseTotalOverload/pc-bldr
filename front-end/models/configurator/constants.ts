import { BudgetTier, UseCase } from './types';

export const USE_CASES: UseCase[] = [
  { key: 'workstation', label: 'Workstation', desc: 'Content creation & rendering', icon: '💼' },
  { key: 'gaming', label: 'Gaming', desc: 'High FPS gaming & VR', icon: '🎮' },
  { key: 'office', label: 'Office', desc: 'Productivity & web browsing', icon: '📊' },
];

export const BUDGET_TIERS: BudgetTier[] = [
  { label: 'Entry', range: [500, 800], default: 650 },
  { label: 'Mid-Range', range: [800, 1500], default: 1400 },
  { label: 'High-End', range: [1500, 5000], default: 2000 },
];

export const MIN_BUDGET = 500;
export const MAX_BUDGET = 5000;
export const BUDGET_STEP = 50;
