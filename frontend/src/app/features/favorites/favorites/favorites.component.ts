
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FavoritesService } from '../../../core/services/favorites.service';
import { DestinationService } from '../../../core/services/destination.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {

  private readonly favoritesService = inject(FavoritesService);
  private readonly destinationService = inject(DestinationService);

  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.destinationService.getAll().subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading favorites:', error);
        this.errorMessage = 'Unable to load favorites.';
        this.isLoading = false;
      }
    });
  }

  get favorites() {
    return this.favoritesService.getFavorites();
  }

  removeFavorite(id: string): void {
    this.favoritesService.removeFavorite(id);
  }
}


