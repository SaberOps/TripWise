
import { Destination } from './destination.model';

export type TripStatus = 'Planned' | 'Ongoing' | 'Completed';

export interface Trip {
  _id: string;
  title: string;
  destinationId: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  status: TripStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Trip returned by the API with its populated destination
export interface TripWithDestination extends Omit<Trip, 'destinationId'> {
  destinationId: Destination;
}

export type CreateTrip = Omit<
  Trip,
  '_id' | 'createdAt' | 'updatedAt'
>;

export type UpdateTrip = Partial<CreateTrip>;

