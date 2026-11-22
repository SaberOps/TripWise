
import { Injectable, signal } from '@angular/core';
import { Destination } from '../models/destination.model';
import { DestinationService } from './destination.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private readonly favoriteIds = signal<number[]>(
    this.loadFavorites()
  );

  readonly favoriteCount = this.favoriteIds.asReadonly();

  constructor(
    private readonly destinationService: DestinationService
  ) {}

  private loadFavorites(): number[] {
    try {
      const saved = localStorage.getItem('tripwise-favorites');
      return saved ? JSON.parse(saved) as number[] : [];
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

  isFavorite(destinationId: number): boolean {
    return this.favoriteIds().includes(destinationId);
  }

  toggleFavorite(destinationId: number): void {
    this.favoriteIds.update(ids =>
      ids.includes(destinationId)
        ? ids.filter(id => id !== destinationId)
        : [...ids, destinationId]
    );

    this.saveFavorites();
  }

  getFavorites(): Destination[] {
    return this.favoriteIds()
      .map(id => this.destinationService.getById(id))
      .filter((destination): destination is Destination =>
        destination !== undefined
      );
  }

  removeFavorite(destinationId: number): void {
    this.favoriteIds.update(ids =>
      ids.filter(id => id !== destinationId)
    );

    this.saveFavorites();
  }
}
