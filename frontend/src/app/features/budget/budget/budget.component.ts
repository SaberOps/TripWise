
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../../core/services/budget.service';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent {
  readonly budgetService = inject(BudgetService);

  getPercentage(spent: number, budget: number): number {
    return this.budgetService.getPercentage(spent, budget);
  }

  updateSpent(tripId: number, amount: number): void {
    this.budgetService.updateSpent(tripId, amount);
  }
}

