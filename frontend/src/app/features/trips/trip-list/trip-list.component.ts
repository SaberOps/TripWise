
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TripService } from '../../../core/services/trip.service';
import { DestinationService } from '../../../core/services/destination.service';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './trip-list.component.html',
  styleUrl: './trip-list.component.css'
})
export class TripListComponent {

  private readonly tripService = inject(TripService);
  private readonly destinationService = inject(DestinationService);

  readonly trips = this.tripService.tripsList;

  getDestinationName(destinationId: number): string {
    return this.destinationService.getById(destinationId)?.name
      ?? 'Unknown destination';
  }

  deleteTrip(id: number): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this trip?'
    );

    if (confirmed) {
      this.tripService.delete(id);
    }
  }
}

