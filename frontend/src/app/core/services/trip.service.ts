
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import {
  Trip,
  TripWithDestination,
  CreateTrip,
  UpdateTrip
} from '../models/trip.model';

interface ApiResponse<T> {
  success: boolean;
  count?: number;
  message?: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/trips';

  private readonly trips = signal<TripWithDestination[]>([]);

  readonly tripsList = this.trips.asReadonly();

  readonly deletedTripId = signal<string | null>(null);

  // GET: Retrieve all trips
  getAll(): Observable<ApiResponse<TripWithDestination[]>> {
    return this.http
      .get<ApiResponse<TripWithDestination[]>>(this.apiUrl)
      .pipe(
        tap(response => {
          this.trips.set(response.data);
        })
      );
  }

  // GET: Retrieve one trip
  getById(id: string): Observable<ApiResponse<TripWithDestination>> {
    return this.http.get<ApiResponse<TripWithDestination>>(
      `${this.apiUrl}/${id}`
    );
  }

  // Validate trip data before creation
  private isValidTrip(trip: CreateTrip): boolean {
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);

    return (
      typeof trip.title === 'string' &&
      trip.title.trim().length > 0 &&
      typeof trip.destinationId === 'string' &&
      trip.destinationId.trim().length > 0 &&
      !Number.isNaN(startDate.getTime()) &&
      !Number.isNaN(endDate.getTime()) &&
      endDate >= startDate &&
      Number.isFinite(trip.budget) &&
      trip.budget > 0 &&
      Number.isInteger(trip.travelers) &&
      trip.travelers > 0 &&
      ['Planned', 'Ongoing', 'Completed'].includes(trip.status)
    );
  }

  // POST: Create a trip
  add(trip: CreateTrip): Observable<ApiResponse<TripWithDestination>> {
    if (!this.isValidTrip(trip)) {
      throw new Error('Invalid trip data. Trip was not created.');
    }

    const newTrip: CreateTrip = {
      ...trip,
      title: trip.title.trim()
    };

    return this.http.post<ApiResponse<TripWithDestination>>(
      this.apiUrl,
      newTrip
    ).pipe(
      tap(response => {
        this.trips.update(current => [
          ...current,
          response.data
        ]);
      })
    );
  }

  // PUT: Update a trip
  update(
    id: string,
    updatedTrip: UpdateTrip
  ): Observable<ApiResponse<TripWithDestination>> {

    return this.http.put<ApiResponse<TripWithDestination>>(
      `${this.apiUrl}/${id}`,
      updatedTrip
    ).pipe(
      tap(response => {
        this.trips.update(current =>
          current.map(trip =>
            trip._id === id ? response.data : trip
          )
        );
      })
    );
  }

  // DELETE: Remove a trip
  delete(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}/${id}`
    ).pipe(
      tap(() => {
        this.trips.update(current =>
          current.filter(trip => trip._id !== id)
        );

        this.deletedTripId.set(id);
      })
    );
  }
}


