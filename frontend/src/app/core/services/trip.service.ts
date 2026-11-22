
import { Injectable, signal } from '@angular/core';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private readonly trips = signal<Trip[]>([
    {
      id: 1,
      title: 'Summer in Santorini',
      destinationId: 1,
      startDate: '2027-06-10',
      endDate: '2027-06-17',
      budget: 1500,
      travelers: 2,
      status: 'Planned',
      notes: 'Explore the beaches and enjoy the sunsets.'
    },
    {
      id: 2,
      title: 'Adventure in Bali',
      destinationId: 2,
      startDate: '2027-07-05',
      endDate: '2027-07-15',
      budget: 2200,
      travelers: 2,
      status: 'Planned',
      notes: 'Visit temples and rice terraces.'
    },
    {
      id: 3,
      title: 'Paris City Break',
      destinationId: 4,
      startDate: '2027-08-01',
      endDate: '2027-08-06',
      budget: 1200,
      travelers: 1,
      status: 'Planned',
      notes: 'Visit museums and famous monuments.'
    }
  ]);

  readonly tripsList = this.trips.asReadonly();

  getAll(): Trip[] {
    return this.trips();
  }

  getById(id: number): Trip | undefined {
    return this.trips().find(trip => trip.id === id);
  }

  add(trip: Omit<Trip, 'id'>): void {
    const newTrip: Trip = {
      ...trip,
      id: this.getNextId()
    };

    this.trips.update(current => [...current, newTrip]);
  }

  update(id: number, updatedTrip: Omit<Trip, 'id'>): void {
    this.trips.update(current =>
      current.map(trip =>
        trip.id === id ? { ...updatedTrip, id } : trip
      )
    );
  }

  delete(id: number): void {
    this.trips.update(current =>
      current.filter(trip => trip.id !== id)
    );
  }

  private getNextId(): number {
    return this.trips().length
      ? Math.max(...this.trips().map(trip => trip.id)) + 1
      : 1;
  }
}
