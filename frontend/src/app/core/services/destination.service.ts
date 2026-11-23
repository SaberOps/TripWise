
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import {
  Destination,
  CreateDestination,
  UpdateDestination
} from '../models/destination.model';

interface ApiResponse<T> {
  success: boolean;
  count?: number;
  message?: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class DestinationService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/destinations';

  private readonly destinations = signal<Destination[]>([]);

  readonly destinations$ = this.destinations.asReadonly();

  // GET: Retrieve all destinations
  getAll(): Observable<ApiResponse<Destination[]>> {
    return this.http.get<ApiResponse<Destination[]>>(this.apiUrl).pipe(
      tap(response => this.destinations.set(response.data))
    );
  }

  // GET: Retrieve one destination
  getById(id: string): Observable<ApiResponse<Destination>> {
    return this.http.get<ApiResponse<Destination>>(`${this.apiUrl}/${id}`);
  }

  // POST: Create a destination
  create(destination: CreateDestination): Observable<ApiResponse<Destination>> {
    return this.http.post<ApiResponse<Destination>>(
      this.apiUrl,
      destination
    ).pipe(
      tap(response => {
        this.destinations.update(current => [
          response.data,
          ...current
        ]);
      })
    );
  }

  // PUT: Update a destination
  update(
    id: string,
    destination: UpdateDestination
  ): Observable<ApiResponse<Destination>> {
    return this.http.put<ApiResponse<Destination>>(
      `${this.apiUrl}/${id}`,
      destination
    ).pipe(
      tap(response => {
        this.destinations.update(current =>
          current.map(item =>
            item._id === id ? response.data : item
          )
        );
      })
    );
  }

  // DELETE: Remove a destination
  delete(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}/${id}`
    ).pipe(
      tap(() => {
        this.destinations.update(current =>
          current.filter(item => item._id !== id)
        );
      })
    );
  }
}
