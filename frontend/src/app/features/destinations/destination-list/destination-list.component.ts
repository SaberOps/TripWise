import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Destination } from '../../../core/models/destination.model';
import { DestinationService } from '../../../core/services/destination.service';

@Component({
  selector: 'app-destination-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './destination-list.component.html',
  styleUrl: './destination-list.component.css'
})
export class DestinationListComponent {

  private readonly destinationService = inject(DestinationService);

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

  destinations: Destination[] = this.destinationService.getAll();

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

