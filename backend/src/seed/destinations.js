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
  },
  {
    name: 'Lisbon', country: 'Portugal', category: 'City', estimatedBudget: 1450, rating: 4.7,
    description: 'Explore hillside neighborhoods, tiled façades, historic trams, and riverside cafés.',
    imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200'
  },
  {
    name: 'Barcelona', country: 'Spain', category: 'City', estimatedBudget: 1750, rating: 4.8,
    description: 'Discover Catalan architecture, lively markets, city beaches, and late-night dining.',
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200'
  },
  {
    name: 'Prague', country: 'Czechia', category: 'Cultural', estimatedBudget: 1350, rating: 4.8,
    description: 'Walk across Charles Bridge, visit the castle district, and explore the old town.',
    imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=1200'
  },
  {
    name: 'London', country: 'United Kingdom', category: 'City', estimatedBudget: 2400, rating: 4.7,
    description: 'Combine royal landmarks, free museums, neighborhood markets, and West End shows.',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200'
  },
  {
    name: 'New York City', country: 'United States', category: 'City', estimatedBudget: 2800, rating: 4.8,
    description: 'See iconic skyline views, world-class museums, Broadway, and distinct city neighborhoods.',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200'
  },
  {
    name: 'Vancouver', country: 'Canada', category: 'Adventure', estimatedBudget: 2200, rating: 4.7,
    description: 'Pair waterfront city walks with forest trails, mountain views, and Pacific beaches.',
    imageUrl: 'https://images.unsplash.com/photo-1559511260-66a654ae982a?w=1200'
  },
  {
    name: 'Cape Town', country: 'South Africa', category: 'Adventure', estimatedBudget: 1900, rating: 4.8,
    description: 'Take in Table Mountain, coastal drives, botanical gardens, and the Cape Peninsula.',
    imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200'
  },
  {
    name: 'Dubai', country: 'United Arab Emirates', category: 'City', estimatedBudget: 2300, rating: 4.6,
    description: 'Experience modern architecture, historic creek districts, desert excursions, and souks.',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200'
  },
  {
    name: 'Istanbul', country: 'Türkiye', category: 'Cultural', estimatedBudget: 1550, rating: 4.8,
    description: 'Explore mosques, bazaars, waterfront neighborhoods, and food on both sides of the Bosphorus.',
    imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200'
  },
  {
    name: 'Cairo', country: 'Egypt', category: 'Cultural', estimatedBudget: 1250, rating: 4.6,
    description: 'Visit the Egyptian Museum, historic Cairo, and the Giza plateau near the city.',
    imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200'
  },
  {
    name: 'Petra', country: 'Jordan', category: 'Adventure', estimatedBudget: 1700, rating: 4.9,
    description: 'Hike through sandstone canyons to Petra’s ancient rock-cut monuments and viewpoints.',
    imageUrl: 'https://images.unsplash.com/photo-1579606032821-4e6161c81bd3?w=1200'
  },
  {
    name: 'Zanzibar', country: 'Tanzania', category: 'Beach', estimatedBudget: 1850, rating: 4.7,
    description: 'Unwind on Indian Ocean beaches and explore Stone Town’s Swahili heritage.',
    imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1200'
  },
  {
    name: 'Phuket', country: 'Thailand', category: 'Beach', estimatedBudget: 1350, rating: 4.6,
    description: 'Enjoy Andaman Sea beaches, island boat trips, and Phuket Old Town’s heritage streets.',
    imageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200'
  },
  {
    name: 'Hoi An', country: 'Vietnam', category: 'Cultural', estimatedBudget: 1100, rating: 4.8,
    description: 'Wander the lantern-lit old town, visit riverside markets, and cycle through nearby villages.',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7fceea108e0b?w=1200'
  },
  {
    name: 'Queenstown', country: 'New Zealand', category: 'Adventure', estimatedBudget: 2500, rating: 4.9,
    description: 'Explore Lake Wakatipu, alpine trails, and outdoor activities in a dramatic mountain setting.',
    imageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200'
  },
  {
    name: 'Patagonia', country: 'Argentina', category: 'Mountain', estimatedBudget: 2700, rating: 4.9,
    description: 'Plan for glacier viewpoints, long-distance hiking, and wide-open Patagonian landscapes.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200'
  },
  {
    name: 'Machu Picchu', country: 'Peru', category: 'Cultural', estimatedBudget: 1950, rating: 4.9,
    description: 'Discover Inca stonework and mountain scenery with time to acclimatize in the Sacred Valley.',
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200'
  },
  {
    name: 'Reykjavik', country: 'Iceland', category: 'Adventure', estimatedBudget: 2600, rating: 4.7,
    description: 'Use the capital as a base for geothermal pools, coastal scenery, and northern lights trips.',
    imageUrl: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1200'
  },
  {
    name: 'Amalfi Coast', country: 'Italy', category: 'Beach', estimatedBudget: 2350, rating: 4.8,
    description: 'Travel between cliffside villages, coastal paths, and small beaches along the Tyrrhenian Sea.',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200'
  },
  {
    name: 'Amsterdam', country: 'Netherlands', category: 'City', estimatedBudget: 1900, rating: 4.7,
    description: 'Explore canal districts, art museums, local markets, and the city by bicycle or ferry.',
    imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1200'
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
