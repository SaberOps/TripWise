
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Destination } from '../../../core/models/destination.model';
import { DestinationService } from '../../../core/services/destination.service';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-destination-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './destination-list.component.html',
  styleUrl: './destination-list.component.css'
})
export class DestinationListComponent implements OnInit {

  private readonly destinationService = inject(DestinationService);
  private readonly favoritesService = inject(FavoritesService);

  destinations: Destination[] = [];

  isLoading = true;
  errorMessage = '';

  searchTerm = '';
  selectedCategory = 'All';

  categories = [
    'All',
    'Beach',
    'Mountain',
    'City',
    'Adventure',
    'Cultural'
  ];

  ngOnInit(): void {
    this.loadDestinations();
  }

  loadDestinations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.destinationService.getAll().subscribe({
      next: (response) => {
        this.destinations = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading destinations:', error);
        this.errorMessage = 'Unable to load destinations. Please try again.';
        this.isLoading = false;
      }
    });
  }

  isFavorite(id: string): boolean {
    return this.favoritesService.isFavorite(id);
  }

  toggleFavorite(id: string): void {
    this.favoritesService.toggleFavorite(id);
  }

  get filteredDestinations(): Destination[] {
    return this.destinations.filter(destination => {
      const search = this.searchTerm.toLowerCase().trim();

      const matchesSearch =
        destination.name.toLowerCase().includes(search) ||
        destination.country.toLowerCase().includes(search);

      const matchesCategory =
        this.selectedCategory === 'All' ||
        destination.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory = select.value;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'All';
  }
}


