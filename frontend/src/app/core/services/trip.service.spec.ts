/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { TripService } from './trip.service';
import { Trip } from '../models/trip.model';
import { provideRouter } from '@angular/router';

describe('TripService', () => {
  let service: TripService;

  const validTrip: Omit<Trip, 'id'> = {
    title: 'Test Trip',
    destinationId: 1,
    startDate: '2027-09-10',
    endDate: '2027-09-15',
    budget: 1000,
    travelers: 2,
    status: 'Planned',
    notes: 'A test trip'
  };

  beforeEach(() => {
    localStorage.removeItem('tripwise_trips');

    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });
    service = TestBed.inject(TripService);
  });

  afterEach(() => {
    localStorage.removeItem('tripwise_trips');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load default trips', () => {
    expect(service.getAll().length).toBe(3);
  });

  it('should add a valid trip', () => {
    service.add(validTrip);

    expect(service.getAll().length).toBe(4);
    expect(service.getAll()[3].title).toBe('Test Trip');
  });

  it('should reject a trip with an empty title', () => {
    service.add({ ...validTrip, title: '   ' });

    expect(service.getAll().length).toBe(3);
  });

  it('should reject a trip with a negative budget', () => {
    service.add({ ...validTrip, budget: -100 });

    expect(service.getAll().length).toBe(3);
  });

  it('should reject a trip with an invalid date range', () => {
    service.add({
      ...validTrip,
      startDate: '2027-09-20',
      endDate: '2027-09-10'
    });

    expect(service.getAll().length).toBe(3);
  });

  it('should update an existing trip', () => {
    service.update(1, {
      ...validTrip,
      title: 'Updated Trip'
    });

    expect(service.getById(1)?.title).toBe('Updated Trip');
  });

  it('should delete a trip', () => {
    service.delete(1);

    expect(service.getAll().length).toBe(2);
    expect(service.getById(1)).toBeUndefined();
  });

  it('should persist trips in localStorage', () => {
    service.add(validTrip);

    const savedTrips = JSON.parse(
      localStorage.getItem('tripwise_trips') || '[]'
    );

    expect(savedTrips.length).toBe(4);
  });
});
