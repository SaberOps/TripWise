import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { TripService } from '../../../core/services/trip.service';
import { BudgetService } from '../../../core/services/budget.service';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './trip-list.component.html',
  styleUrl: './trip-list.component.css'
})
export class TripListComponent implements OnInit {
  private readonly tripService = inject(TripService);
  private readonly budgetService = inject(BudgetService);

  readonly trips = this.tripService.tripsList;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.tripService.getAll().subscribe({
      next: () => this.isLoading = false,
      error: error => {
        console.error('Unable to load trips:', error);
        this.errorMessage = 'Unable to load trips. Please try again.';
        this.isLoading = false;
      }
    });
  }

  deleteTrip(id: string): void {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    this.tripService.delete(id).subscribe({
      next: () => this.budgetService.removeTripSpending(id),
      error: error => {
        console.error('Unable to delete trip:', error);
        this.errorMessage = 'Unable to delete this trip. Please try again.';
      }
    });
  }
}

