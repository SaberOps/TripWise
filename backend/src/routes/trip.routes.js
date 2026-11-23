
import express from 'express';

import {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip
} from '../controllers/trip.controller.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       required:
 *         - title
 *         - destinationId
 *         - startDate
 *         - endDate
 *         - budget
 *         - travelers
 *       properties:
 *         _id:
 *           type: string
 *           example: 674a12345678901234567891
 *         title:
 *           type: string
 *           example: My Paris Holiday
 *         destinationId:
 *           type: string
 *           example: 674a12345678901234567890
 *         startDate:
 *           type: string
 *           format: date
 *           example: 2027-06-10
 *         endDate:
 *           type: string
 *           format: date
 *           example: 2027-06-20
 *         budget:
 *           type: number
 *           example: 2000
 *         travelers:
 *           type: integer
 *           example: 2
 *         status:
 *           type: string
 *           enum: [Planned, Ongoing, Completed]
 *           example: Planned
 *         notes:
 *           type: string
 *           example: Visit the Eiffel Tower.
 */

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Get all trips
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: List of trips with destination details
 */
router.get('/', getTrips);

/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Get a trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip found
 *       404:
 *         description: Trip not found
 */
router.get('/:id', getTripById);

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Create a trip
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *     responses:
 *       201:
 *         description: Trip created
 *       400:
 *         description: Invalid trip data
 *       404:
 *         description: Destination not found
 */
router.post('/', createTrip);

/**
 * @swagger
 * /api/trips/{id}:
 *   put:
 *     summary: Update a trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *     responses:
 *       200:
 *         description: Trip updated
 *       404:
 *         description: Trip or destination not found
 */
router.put('/:id', updateTrip);

/**
 * @swagger
 * /api/trips/{id}:
 *   delete:
 *     summary: Delete a trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip deleted
 *       404:
 *         description: Trip not found
 */
router.delete('/:id', deleteTrip);

export default router;

