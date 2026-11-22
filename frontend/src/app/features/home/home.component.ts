
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

import { DestinationService } from '../../core/services/destination.service';
import { TripService } from '../../core/services/trip.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { BudgetService } from '../../core/services/budget.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private readonly destinationService = inject(DestinationService);
  private readonly tripService = inject(TripService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly budgetService = inject(BudgetService);

  readonly destinations = computed(() =>
    this.destinationService.getAll().slice(0, 3)
  );

  readonly stats = computed(() => [
    {
      title: 'Total Trips',
      value: String(this.tripService.tripsList().length),
      icon: '✈',
      description: 'Trips planned',
      color: 'teal'
    },
    {
      title: 'Destinations',
      value: String(this.destinationService.getAll().length),
      icon: '◎',
      description: 'Places to explore',
      color: 'blue'
    },
    {
      title: 'Favorite Places',
      value: String(this.favoritesService.getFavorites().length),
      icon: '♡',
      description: 'Saved destinations',
      color: 'orange'
    },
    {
      title: 'Total Budget',
      value: this.budgetService.summary().totalBudget.toLocaleString(
        'en-US',
        { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }
      ),
      icon: '$',
      description: 'Budget across your trips',
      color: 'purple'
    }
  ]);

  readonly upcomingTrips = computed(() =>
    this.tripService.tripsList()
      .filter(trip => trip.status === 'Planned')
      .slice()
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, 3)
      .map(trip => {
        const destination = this.destinationService.getById(
          trip.destinationId
        );

        return {
          id: trip.id,
          destination: destination
            ? `${destination.name}, ${destination.country}`
            : trip.title,
          date: trip.startDate,
          status: trip.status
        };
      })
  );
}


