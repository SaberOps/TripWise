import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DestinationService } from '../../core/services/destination.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { TripService } from '../../core/services/trip.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private readonly destinationService = inject(DestinationService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly tripService = inject(TripService);

  readonly destinations = this.destinationService.destinations$;
  readonly popularDestinations = computed(() => this.destinations().slice(0, 3));
  readonly trips = this.tripService.tripsList;
  readonly upcomingTrips = computed(() =>
    this.trips()
      .filter(trip => trip.status !== 'Completed')
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, 3)
  );
  readonly stats = computed(() => {
    const trips = this.trips();
    const visitedCountries = new Set(
      trips
        .filter(trip => trip.status === 'Completed')
        .map(trip => trip.destinationId.country)
    );

    return [
      { title: 'My Trips', value: String(trips.length), description: 'Trips planned', color: 'teal' },
      { title: 'Countries Visited', value: String(visitedCountries.size), description: 'From completed trips', color: 'blue' },
      { title: 'Favorite Places', value: String(this.favoritesService.favoriteCount().length), description: 'Saved destinations', color: 'orange' },
      { title: 'Trip Budgets', value: trips.reduce((sum, trip) => sum + trip.budget, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), description: 'Across planned trips', color: 'purple' }
    ];
  });

  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    let pendingRequests = 2;
    const finishRequest = (): void => {
      pendingRequests -= 1;
      this.isLoading = pendingRequests > 0;
    };

    this.destinationService.getAll().subscribe({
      error: error => {
        console.error('Unable to load destinations:', error);
        this.errorMessage = 'Unable to load destinations. Please try again from Explore Destinations.';
        finishRequest();
      },
      complete: finishRequest
    });

    this.tripService.getAll().subscribe({
      error: error => {
        console.error('Unable to load trips:', error);
        finishRequest();
      },
      complete: finishRequest
    });
  }
}
