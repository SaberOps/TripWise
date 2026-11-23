import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Destination from '../models/destination.model.js';

dotenv.config();

const destinations = [
  {
    name: 'Santorini', country: 'Greece', category: 'Beach', estimatedBudget: 1800, rating: 4.8,
    description: 'Whitewashed villages, volcanic beaches, and caldera views over the Aegean Sea.',
    imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200'
  },
  {
    name: 'Kyoto', country: 'Japan', category: 'Cultural', estimatedBudget: 2200, rating: 4.9,
    description: 'Historic temples, quiet gardens, traditional streets, and seasonal food markets.',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200'
  },
  {
    name: 'Marrakech', country: 'Morocco', category: 'Cultural', estimatedBudget: 950, rating: 4.7,
    description: 'Explore the medina, lively souks, courtyard riads, and the gardens of the Red City.',
    imageUrl: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200'
  },
  {
    name: 'Banff National Park', country: 'Canada', category: 'Adventure', estimatedBudget: 2400, rating: 4.9,
    description: 'Alpine lakes, mountain trails, and wildlife in the Canadian Rocky Mountains.',
    imageUrl: 'https://images.unsplash.com/photo-1503614472-8c93d56cdba4?w=1200'
  },
  {
    name: 'Rome', country: 'Italy', category: 'City', estimatedBudget: 1600, rating: 4.8,
    description: 'Ancient landmarks, neighborhood trattorias, and world-class art across the Eternal City.',
    imageUrl: 'https://images.unsplash.com/photo-1515542622106-78b0cba1a5b5?w=1200'
  },
  {
    name: 'Bali', country: 'Indonesia', category: 'Beach', estimatedBudget: 1450, rating: 4.7,
    description: 'Tropical coastlines, rice terraces, local craft, and temples across the island.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200'
  },
  {
    name: 'Paris', country: 'France', category: 'City', estimatedBudget: 2100, rating: 4.8,
    description: 'Museums, cafés, neighborhood walks, and riverfront landmarks in the French capital.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200'
  },
  {
    name: 'Swiss Alps', country: 'Switzerland', category: 'Mountain', estimatedBudget: 2900, rating: 4.9,
    description: 'Mountain railways, hiking routes, and lakeside villages in the Swiss Alps.',
    imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200'
  }
];

async function seedDestinations() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGO_URI (or MONGODB_URI) must be configured');

  await mongoose.connect(mongoUri);
  let inserted = 0;
  let updated = 0;

  for (const destination of destinations) {
    const result = await Destination.updateOne(
      { name: destination.name, country: destination.country },
      { $set: destination },
      { upsert: true, runValidators: true }
    );
    inserted += result.upsertedCount;
    updated += result.modifiedCount;
  }

  console.log(`Destination seed complete: ${inserted} inserted, ${updated} updated.`);
}

seedDestinations()
  .catch(error => {
    console.error('Destination seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
