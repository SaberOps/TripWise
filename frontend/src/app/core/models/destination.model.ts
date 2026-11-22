
export interface Destination {
  id: number;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  category: 'Beach' | 'Mountain' | 'City' | 'Adventure' | 'Cultural';
  estimatedBudget: number;
  rating: number;
}