import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Trip title is required'],
      trim: true
    },
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    budget: {
      type: Number,
      required: true,
      min: 0
    },
    travelers: {
      type: Number,
      required: true,
      min: 1
    },
    status: {
      type: String,
      enum: ['Planned', 'Ongoing', 'Completed'],
      default: 'Planned'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

tripSchema.pre('validate', function () {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    this.invalidate('endDate', 'End date must be after or equal to start date');
  }
});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;