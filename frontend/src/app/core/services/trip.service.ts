
import { Injectable, signal } from '@angular/core';
import { Trip } from '../models/trip.model';

const STORAGE_KEY = 'tripwise_trips';

const DEFAULT_TRIPS: Trip[] = [
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
];

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private readonly trips = signal<Trip[]>(this.loadTrips());

  readonly tripsList = this.trips.asReadonly();
  readonly deletedTripId = signal<number | null>(null);

  private loadTrips(): Trip[] {
    try {
      const storedTrips = localStorage.getItem(STORAGE_KEY);

      if (storedTrips !== null) {
        const parsedTrips: unknown = JSON.parse(storedTrips);

        if (Array.isArray(parsedTrips)) {
          return parsedTrips as Trip[];
        }
      }
    } catch (error) {
      console.error('Could not load saved trips:', error);
    }

    return DEFAULT_TRIPS;
  }

  private saveTrips(trips: Trip[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch (error) {
      console.error('Could not save trips:', error);
    }
  }

  getAll(): Trip[] {
    return this.trips();
  }

  getById(id: number): Trip | undefined {
    return this.trips().find(trip => trip.id === id);
  }

private isValidTrip(trip: Omit<Trip, 'id'>): boolean {
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);

  return (
    typeof trip.title === 'string' &&
    trip.title.trim().length > 0 &&
    Number.isInteger(trip.destinationId) &&
    trip.destinationId > 0 &&
    !Number.isNaN(startDate.getTime()) &&
    !Number.isNaN(endDate.getTime()) &&
    trip.endDate >= trip.startDate &&
    Number.isFinite(trip.budget) &&
    trip.budget > 0 &&
    Number.isInteger(trip.travelers) &&
    trip.travelers > 0 &&
    ['Planned', 'Ongoing', 'Completed'].includes(trip.status)
  );
}



add(trip: Omit<Trip, 'id'>): void {
  if (!this.isValidTrip(trip)) {
    console.error('Invalid trip data. Trip was not created.');
    return;
  }

  const newTrip: Trip = {
    ...trip,
    title: trip.title.trim(),
    id: this.getNextId()
  };

  this.trips.update(current => [...current, newTrip]);
  this.saveTrips(this.trips());
}



update(id: number, updatedTrip: Omit<Trip, 'id'>): void {
  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    !this.getById(id) ||
    !this.isValidTrip(updatedTrip)
  ) {
    console.error('Invalid trip data. Trip was not updated.');
    return;
  }

  this.trips.update(current =>
    current.map(trip =>
      trip.id === id
        ? { ...updatedTrip, title: updatedTrip.title.trim(), id }
        : trip
    )
  );

  this.saveTrips(this.trips());
}



delete(id: number): void {
  if (!this.getById(id)) {
    return;
  }

  this.trips.update(current =>
    current.filter(trip => trip.id !== id)
  );

  this.saveTrips(this.trips());
  this.deletedTripId.set(id);
}


  private getNextId(): number {
    return this.trips().length
      ? Math.max(...this.trips().map(trip => trip.id)) + 1
      : 1;
  }
}

