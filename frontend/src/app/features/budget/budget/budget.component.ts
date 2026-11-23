
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BudgetService } from '../../../core/services/budget.service';
import { TripService } from '../../../core/services/trip.service';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent implements OnInit {

  readonly budgetService = inject(BudgetService);
  private readonly tripService = inject(TripService);

  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly overallBudgetDraft = signal<number | null>(null);

  readonly draftAmounts = signal<Record<string, number | null>>({});

  ngOnInit(): void {
    this.tripService.getAll().subscribe({
      next: () => {
        this.draftAmounts.set(Object.fromEntries(
          this.budgetService.tripBudgets().map(trip => [trip.tripId, trip.spent])
        ));

        const summary = this.budgetService.summary();
        this.overallBudgetDraft.set(summary.overallBudgetIsSet ? summary.totalBudget : null);

        this.isLoading.set(false);
      },
      error: error => {
        console.error('Unable to load trips for budget:', error);
        this.errorMessage.set('Unable to load trip budgets.');
        this.isLoading.set(false);
      }
    });
  }

  saveOverallBudget(): void {
    const amount = this.overallBudgetDraft();
    if (amount === null || !Number.isFinite(amount) || amount < 0) {
      this.errorMessage.set('Enter a valid total budget of zero or more.');
      this.successMessage.set('');
      return;
    }

    this.budgetService.setOverallBudget(amount);
    this.errorMessage.set('');
    this.successMessage.set('Overall travel budget saved.');
  }

  useTripBudgetsTotal(): void {
    this.budgetService.clearOverallBudget();
    this.overallBudgetDraft.set(null);
    this.errorMessage.set('');
    this.successMessage.set('Total budget now follows the sum of your trip budgets.');
  }

  setDraftAmount(tripId: string, value: number | null): void {
    this.draftAmounts.update(amounts => ({ ...amounts, [tripId]: value }));
    this.successMessage.set('');
  }

  saveSpent(tripId: string): void {
    const amount = this.draftAmounts()[tripId];

    if (
      amount === null ||
      amount === undefined ||
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      this.errorMessage.set('Please enter a valid amount greater than or equal to 0.');
      this.successMessage.set('');
      return;
    }

    this.budgetService.updateSpent(tripId, amount);

    this.errorMessage.set('');
    this.successMessage.set('Spending amount saved successfully!');
  }

  getPercentage(spent: number, budget: number): number {
    return this.budgetService.getPercentage(spent, budget);
  }
}

