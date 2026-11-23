
import { Component, inject, OnInit } from '@angular/core';
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

  isLoading = true;
  errorMessage = '';
  successMessage = '';
  overallBudgetDraft = '';

  // Temporary values while the user is typing
  draftAmounts: Record<string, string> = {};

  ngOnInit(): void {
    this.tripService.getAll().subscribe({
      next: () => {
        this.budgetService.tripBudgets().forEach(trip => {
          this.draftAmounts[trip.tripId] = String(trip.spent);
        });

        const summary = this.budgetService.summary();
        this.overallBudgetDraft = summary.overallBudgetIsSet
          ? String(summary.totalBudget)
          : '';

        this.isLoading = false;
      },
      error: error => {
        console.error('Unable to load trips for budget:', error);
        this.errorMessage = 'Unable to load trip budgets.';
        this.isLoading = false;
      }
    });
  }

  saveOverallBudget(): void {
    const value = this.overallBudgetDraft.trim();
    const amount = Number(value);
    if (!value || !Number.isFinite(amount) || amount < 0) {
      this.errorMessage = 'Enter a valid total budget of zero or more.';
      this.successMessage = '';
      return;
    }

    this.budgetService.setOverallBudget(amount);
    this.errorMessage = '';
    this.successMessage = 'Overall travel budget saved.';
  }

  useTripBudgetsTotal(): void {
    this.budgetService.clearOverallBudget();
    this.overallBudgetDraft = '';
    this.errorMessage = '';
    this.successMessage = 'Total budget now follows the sum of your trip budgets.';
  }

  setDraftAmount(tripId: string, value: string): void {
    this.draftAmounts[tripId] = value;
    this.successMessage = '';
  }

  saveSpent(tripId: string): void {
    const amount = Number(this.draftAmounts[tripId]);

    if (
      this.draftAmounts[tripId].trim() === '' ||
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      this.errorMessage = 'Please enter a valid amount greater than or equal to 0.';
      this.successMessage = '';
      return;
    }

    this.budgetService.updateSpent(tripId, amount);

    this.errorMessage = '';
    this.successMessage = 'Spending amount saved successfully!';
  }

  getPercentage(spent: number, budget: number): number {
    return this.budgetService.getPercentage(spent, budget);
  }
}

