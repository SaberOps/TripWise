import { Injectable, signal } from '@angular/core';
import { Destination } from '../models/destination.model';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {

  private readonly destinations = signal<Destination[]>([
    {
      id: 1,
      name: 'Santorini',
      country: 'Greece',
      description: 'Discover white houses, blue domes and beautiful sunsets.',
      imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=900',
      category: 'Beach',
      estimatedBudget: 850,
      rating: 4.9
    },
    {
      id: 2,
      name: 'Bali',
      country: 'Indonesia',
      description: 'Explore tropical beaches, temples and green rice terraces.',
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900',
      category: 'Adventure',
      estimatedBudget: 720,
      rating: 4.8
    },
    {
      id: 3,
      name: 'Swiss Alps',
      country: 'Switzerland',
      description: 'Enjoy spectacular mountains and unforgettable landscapes.',
      imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900',
      category: 'Mountain',
      estimatedBudget: 1200,
      rating: 4.9
    },
    {
      id: 4,
      name: 'Paris',
      country: 'France',
      description: 'Experience iconic monuments, museums and French culture.',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900',
      category: 'City',
      estimatedBudget: 950,
      rating: 4.7
    },
    {
      id: 5,
      name: 'Marrakech',
      country: 'Morocco',
      description: 'Explore colorful markets, historic palaces and gardens.',
      imageUrl: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=900',
      category: 'Cultural',
      estimatedBudget: 600,
      rating: 4.8
    },
    {
      id: 6,
      name: 'Maldives',
      country: 'Maldives',
      description: 'Relax in turquoise waters and beautiful island resorts.',
      imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=900',
      category: 'Beach',
      estimatedBudget: 1500,
      rating: 5.0
    }
  ]);

  getAll(): Destination[] {
    return this.destinations();
  }

  getById(id: number): Destination | undefined {
    return this.destinations().find(destination => destination.id === id);
  }
}