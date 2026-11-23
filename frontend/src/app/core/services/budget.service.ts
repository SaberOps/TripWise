import { Injectable, computed, inject, signal } from '@angular/core';
import { TripService } from './trip.service';
import { BudgetSummary, TripBudget } from '../models/budget.model';

const STORAGE_KEY = 'tripwise_spending';
const TOTAL_BUDGET_KEY = 'tripwise_total_budget';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private readonly tripService = inject(TripService);
  private readonly spending = signal<Record<string, number>>(this.loadSpending());
  private readonly overallBudget = signal<number | null>(this.loadOverallBudget());

  readonly tripBudgets = computed<TripBudget[]>(() =>
    this.tripService.tripsList().map(trip => ({
      tripId: trip._id,
      tripTitle: trip.title,
      budget: trip.budget,
      spent: this.spending()[trip._id] ?? 0
    }))
  );

  readonly summary = computed<BudgetSummary>(() => {
    const budgets = this.tripBudgets();
    const allocatedBudget = budgets.reduce((sum, trip) => sum + trip.budget, 0);
    const totalBudget = this.overallBudget() ?? allocatedBudget;
    const totalSpent = budgets.reduce((sum, trip) => sum + trip.spent, 0);

    return {
      totalBudget,
      allocatedBudget,
      unallocatedBudget: totalBudget - allocatedBudget,
      totalSpent,
      remainingBudget: totalBudget - totalSpent,
      tripsCount: budgets.length,
      overallBudgetIsSet: this.overallBudget() !== null
    };
  });

  private loadOverallBudget(): number | null {
    try {
      const stored = localStorage.getItem(TOTAL_BUDGET_KEY);
      if (stored === null) return null;
      const amount = Number(stored);
      return Number.isFinite(amount) && amount >= 0 ? amount : null;
    } catch (error) {
      console.error('Could not load overall budget:', error);
      return null;
    }
  }

  setOverallBudget(amount: number): void {
    if (!Number.isFinite(amount) || amount < 0) return;
    this.overallBudget.set(amount);
    try {
      localStorage.setItem(TOTAL_BUDGET_KEY, String(amount));
    } catch (error) {
      console.error('Could not save overall budget:', error);
    }
  }

  clearOverallBudget(): void {
    this.overallBudget.set(null);
    try {
      localStorage.removeItem(TOTAL_BUDGET_KEY);
    } catch (error) {
      console.error('Could not clear overall budget:', error);
    }
  }

  private loadSpending(): Record<string, number> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return {};
      const parsed: unknown = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, number>;
      }
    } catch (error) {
      console.error('Could not load saved spending:', error);
    }
    return {};
  }

  private saveSpending(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.spending()));
    } catch (error) {
      console.error('Could not save spending:', error);
    }
  }

  updateSpent(tripId: string, amount: number): void {
    if (!Number.isFinite(amount) || amount < 0) return;
    this.spending.update(current => ({ ...current, [tripId]: amount }));
    this.saveSpending();
  }

  getPercentage(spent: number, budget: number): number {
    return budget > 0 ? Math.round((spent / budget) * 100) : 0;
  }

  removeTripSpending(tripId: string): void {
    this.spending.update(current => {
      const updated = { ...current };
      delete updated[tripId];
      return updated;
    });
    this.saveSpending();
  }
}
