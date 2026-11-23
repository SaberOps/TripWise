
import Destination from '../models/destination.model.js';

// GET /api/destinations
export const getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/destinations/:id
export const getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      success: true,
      data: destination
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid destination ID'
    });
  }
};

// POST /api/destinations
export const createDestination = async (req, res) => {
  try {
    const destination = await Destination.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      data: destination
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// PUT /api/destinations/:id
export const updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Destination updated successfully',
      data: destination
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE /api/destinations/:id
export const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid destination ID'
    });
  }
};
