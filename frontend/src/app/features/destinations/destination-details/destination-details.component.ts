
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Destination } from '../../../core/models/destination.model';
import { DestinationService } from '../../../core/services/destination.service';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-destination-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './destination-details.component.html',
  styleUrl: './destination-details.component.css'
})
export class DestinationDetailsComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly destinationService = inject(DestinationService);
  private readonly favoritesService = inject(FavoritesService);

  destination: Destination | undefined;

  isLoading = true;
  errorMessage = '';

  get isFavorite(): boolean {
    return this.destination
      ? this.favoritesService.isFavorite(this.destination._id)
      : false;
  }

  toggleFavorite(): void {
    if (this.destination) {
      this.favoritesService.toggleFavorite(this.destination._id);
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Destination not found.';
      this.isLoading = false;
      return;
    }

    this.destinationService.getById(id).subscribe({
      next: (response) => {
        this.destination = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading destination:', error);
        this.errorMessage = 'Unable to load destination details.';
        this.isLoading = false;
      }
    });
  }
}

