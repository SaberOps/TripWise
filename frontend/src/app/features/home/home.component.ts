
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  stats = [
    {
      title: 'Total Trips',
      value: '12',
      icon: '✈',
      description: 'Trips planned',
      color: 'teal'
    },
    {
      title: 'Countries Visited',
      value: '08',
      icon: '🌍',
      description: 'Amazing countries',
      color: 'blue'
    },
    {
      title: 'Favorite Places',
      value: '15',
      icon: '♡',
      description: 'Saved destinations',
      color: 'orange'
    },
    {
      title: 'Total Budget',
      value: '$4,250',
      icon: '◈',
      description: 'Travel budget',
      color: 'purple'
    }
  ];

  destinations = [
    {
      name: 'Santorini',
      country: 'Greece',
      category: 'Island',
      price: '$850',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800'
    },
    {
      name: 'Bali',
      country: 'Indonesia',
      category: 'Beach',
      price: '$720',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'
    },
    {
      name: 'Swiss Alps',
      country: 'Switzerland',
      category: 'Mountain',
      price: '$1,200',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800'
    }
  ];

  upcomingTrips = [
    {
      destination: 'Paris, France',
      date: '15 December 2026',
      duration: '5 days',
      status: 'Planned'
    },
    {
      destination: 'Rome, Italy',
      date: '10 January 2027',
      duration: '7 days',
      status: 'Planned'
    }
  ];
}

