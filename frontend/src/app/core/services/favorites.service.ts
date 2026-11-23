
import { Injectable, signal, inject } from '@angular/core';
import { Destination } from '../models/destination.model';
import { DestinationService } from './destination.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private readonly destinationService = inject(DestinationService);

  private readonly favoriteIds = signal<string[]>(
    this.loadFavorites()
  );

  readonly favoriteCount = this.favoriteIds.asReadonly();

  private loadFavorites(): string[] {
    try {
      const saved = localStorage.getItem('tripwise-favorites');
      return saved ? JSON.parse(saved) as string[] : [];
    } catch {
      return [];
    }
  }

  private saveFavorites(): void {
    localStorage.setItem(
      'tripwise-favorites',
      JSON.stringify(this.favoriteIds())
    );
  }

  isFavorite(destinationId: string): boolean {
    return this.favoriteIds().includes(destinationId);
  }

  toggleFavorite(destinationId: string): void {
    this.favoriteIds.update(ids =>
      ids.includes(destinationId)
        ? ids.filter(id => id !== destinationId)
        : [...ids, destinationId]
    );

    this.saveFavorites();
  }

  getFavorites(): Destination[] {
    const ids = this.favoriteIds();

    return this.destinationService.destinations$()
      .filter(destination => ids.includes(destination._id));
  }

  removeFavorite(destinationId: string): void {
    this.favoriteIds.update(ids =>
      ids.filter(id => id !== destinationId)
    );

    this.saveFavorites();
  }
}

