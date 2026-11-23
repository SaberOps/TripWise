export interface BudgetSummary {
  totalBudget: number;
  allocatedBudget: number;
  unallocatedBudget: number;
  totalSpent: number;
  remainingBudget: number;
  tripsCount: number;
  overallBudgetIsSet: boolean;
}

export interface TripBudget {
  tripId: string;
  tripTitle: string;
  budget: number;
  spent: number;
}
