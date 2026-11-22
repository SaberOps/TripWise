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

get isFavorite(): boolean {
  return this.destination
    ? this.favoritesService.isFavorite(this.destination.id)
    : false;
}

toggleFavorite(): void {
  if (this.destination) {
    this.favoritesService.toggleFavorite(this.destination.id);
  }
}

  destination: Destination | undefined;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.destination = this.destinationService.getById(id);
  }
}
