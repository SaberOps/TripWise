export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  tripsCount: number;
}

export interface TripBudget {
  tripId: number;
  tripTitle: string;
  budget: number;
  spent: number;
}