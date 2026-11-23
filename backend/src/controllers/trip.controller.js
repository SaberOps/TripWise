
import Trip from '../models/trip.model.js';
import Destination from '../models/destination.model.js';

// GET /api/trips
export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate('destinationId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/trips/:id
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('destinationId');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid trip ID'
    });
  }
};

// POST /api/trips
export const createTrip = async (req, res) => {
  try {
    const destination = await Destination.findById(req.body.destinationId);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    const trip = await Trip.create(req.body);

    await trip.populate('destinationId');

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: trip
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// PUT /api/trips/:id
export const updateTrip = async (req, res) => {
  try {
    if (req.body.destinationId) {
      const destination = await Destination.findById(
        req.body.destinationId
      );

      if (!destination) {
        return res.status(404).json({
          success: false,
          message: 'Destination not found'
        });
      }
    }

    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('destinationId');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      data: trip
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE /api/trips/:id
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid trip ID'
    });
  }
};
