
import express from 'express';

import {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
} from '../controllers/destination.controller.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Destination:
 *       type: object
 *       required:
 *         - name
 *         - country
 *         - description
 *         - category
 *         - estimatedBudget
 *       properties:
 *         _id:
 *           type: string
 *           example: 674a12345678901234567890
 *         name:
 *           type: string
 *           example: Santorini
 *         country:
 *           type: string
 *           example: Greece
 *         description:
 *           type: string
 *           example: Beautiful Greek island.
 *         imageUrl:
 *           type: string
 *           example: https://example.com/santorini.jpg
 *         category:
 *           type: string
 *           enum: [Beach, Mountain, City, Adventure, Cultural]
 *           example: Beach
 *         estimatedBudget:
 *           type: number
 *           example: 1500
 *         rating:
 *           type: number
 *           example: 4.8
 */

/**
 * @swagger
 * /api/destinations:
 *   get:
 *     summary: Get all destinations
 *     tags: [Destinations]
 *     responses:
 *       200:
 *         description: List of destinations
 */
router.get('/', getDestinations);

/**
 * @swagger
 * /api/destinations/{id}:
 *   get:
 *     summary: Get a destination by ID
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Destination found
 *       404:
 *         description: Destination not found
 */
router.get('/:id', getDestinationById);

/**
 * @swagger
 * /api/destinations:
 *   post:
 *     summary: Create a destination
 *     tags: [Destinations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Destination'
 *     responses:
 *       201:
 *         description: Destination created
 *       400:
 *         description: Invalid destination data
 */
router.post('/', createDestination);

/**
 * @swagger
 * /api/destinations/{id}:
 *   put:
 *     summary: Update a destination
 *     tags: [Destinations]
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
 *             $ref: '#/components/schemas/Destination'
 *     responses:
 *       200:
 *         description: Destination updated
 *       404:
 *         description: Destination not found
 */
router.put('/:id', updateDestination);

/**
 * @swagger
 * /api/destinations/{id}:
 *   delete:
 *     summary: Delete a destination
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Destination deleted
 *       404:
 *         description: Destination not found
 */
router.delete('/:id', deleteDestination);

export default router;

