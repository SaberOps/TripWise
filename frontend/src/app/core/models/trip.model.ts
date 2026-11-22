
export type TripStatus = 'Planned' | 'Ongoing' | 'Completed';

export interface Trip {
  id: number;
  title: string;
  destinationId: number;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  status: TripStatus;
  notes?: string;
}
