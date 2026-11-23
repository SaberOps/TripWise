

export type DestinationCategory =
  | 'Beach'
  | 'Mountain'
  | 'City'
  | 'Adventure'
  | 'Cultural';

export interface Destination {
  _id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  category: DestinationCategory;
  estimatedBudget: number;
  rating: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateDestination = Omit<
  Destination,
  '_id' | 'createdAt' | 'updatedAt'
>;

export type UpdateDestination = Partial<CreateDestination>;
