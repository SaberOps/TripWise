
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {

  private readonly favoritesService = inject(FavoritesService);

  get favorites() {
    return this.favoritesService.getFavorites();
  }

  removeFavorite(id: number): void {
    this.favoritesService.removeFavorite(id);
  }
}

