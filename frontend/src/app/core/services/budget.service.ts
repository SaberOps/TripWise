import { Injectable, computed, inject, signal } from '@angular/core';
import { TripService } from './trip.service';
import { BudgetSummary, TripBudget } from '../models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private readonly tripService = inject(TripService);

  // Demo spending data, to be replaced by real expenses later.
  private readonly spending = signal<Record<number, number>>({
    1: 900,
    2: 1200,
    3: 500
  });

  readonly tripBudgets = computed<TripBudget[]>(() =>
    this.tripService.tripsList().map(trip => ({
      tripId: trip.id,
      tripTitle: trip.title,
      budget: trip.budget,
      spent: this.spending()[trip.id] ?? 0
    }))
  );

  readonly summary = computed<BudgetSummary>(() => {
    const budgets = this.tripBudgets();

    const totalBudget = budgets.reduce(
      (total, trip) => total + trip.budget, 0
    );

    const totalSpent = budgets.reduce(
      (total, trip) => total + trip.spent, 0
    );

    return {
      totalBudget,
      totalSpent,
      remainingBudget: totalBudget - totalSpent,
      tripsCount: budgets.length
    };
  });

  updateSpent(tripId: number, amount: number): void {
    if (!Number.isFinite(amount) || amount < 0) {
      return;
    }

    this.spending.update(current => ({
      ...current,
      [tripId]: amount
    }));
  }

  getPercentage(spent: number, budget: number): number {
    if (budget <= 0) {
      return 0;
    }

    return Math.round((spent / budget) * 100);
  }
}