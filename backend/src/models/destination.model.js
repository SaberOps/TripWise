
import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      enum: ['Beach', 'Mountain', 'City', 'Adventure', 'Cultural'],
      required: true
    },
    estimatedBudget: {
      type: Number,
      required: true,
      min: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

const Destination = mongoose.model('Destination', destinationSchema);

export default Destination;
