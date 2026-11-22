
import { Injectable, computed, inject, signal } from '@angular/core';
import { TripService } from './trip.service';
import { BudgetSummary, TripBudget } from '../models/budget.model';

const STORAGE_KEY = 'tripwise_spending';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
    constructor() {
  // Clean up spending records when a trip is deleted.
  // The effect will be added in the next step.
}
  private readonly tripService = inject(TripService);

  private readonly spending = signal<Record<number, number>>(
    this.loadSpending()
  );

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

  private loadSpending(): Record<number, number> {
    try {
      const storedSpending = localStorage.getItem(STORAGE_KEY);

      if (storedSpending !== null) {
        const parsed: unknown = JSON.parse(storedSpending);

        if (
          parsed !== null &&
          typeof parsed === 'object' &&
          !Array.isArray(parsed)
        ) {
          return parsed as Record<number, number>;
        }
      }
    } catch (error) {
      console.error('Could not load saved spending:', error);
    }

    return {};
  }

  private saveSpending(): void {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(this.spending())
      );
    } catch (error) {
      console.error('Could not save spending:', error);
    }
  }

  updateSpent(tripId: number, amount: number): void {
    if (!Number.isFinite(amount) || amount < 0) {
      return;
    }

    this.spending.update(current => ({
      ...current,
      [tripId]: amount
    }));

    this.saveSpending();
  }

  getPercentage(spent: number, budget: number): number {
    if (budget <= 0) {
      return 0;
    }

    return Math.round((spent / budget) * 100);
  }

removeTripSpending(tripId: number): void {
  this.spending.update(current => {
    const updated = { ...current };
    delete updated[tripId];
    return updated;
  });

  this.saveSpending();
}

}
