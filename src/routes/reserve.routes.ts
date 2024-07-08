import { Router } from 'express';
import { container } from 'tsyringe';
import ReserveController from '../controllers/reserve.controller';
import { reserveMiddleware } from '../middlewares/reserve.middleware';
import verifyToken from '../middlewares/auth.middleware';

const router = Router();
const reserveController = container.resolve(ReserveController);

router.use('/reserve', verifyToken);

/**
 * @swagger
 * tags:
 *   name: Reserves
 *   description: Endpoints related to reserves
 */
/**
 * @swagger
 * /api/v1/reserve:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reserves]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_user:
 *                 type: string
 *               id_car:
 *                 type: string
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *             example:
 *               id_user: "66841d6d983f8b0f66db46b0"
 *               id_car: "6685a207b7dd64c7d7e38b12"
 *               start_date: "20/04/2023"
 *               end_date: "30/04/2023"
 *     responses:
 *       '201':
 *         description: Successfully created a reservation
 *       '400':
 *         description: Invalid request body
 *       '404':
 *         description: Reservation or User not found
 *       '500':
 *         description: Internal server error
 */

router.post(
  '/reserve',
  reserveMiddleware,
  reserveController.createReserve.bind(reserveController),
);
export default router;
/**
 * @swagger
 * /api/v1/reserve/{id}:
 *   put:
 *     summary: Update a reservation by ID
 *     tags: [Reserves]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reservation to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_user:
 *                 type: string
 *               id_car:
 *                 type: string
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *             example:
 *               id_user: "66841d6d983f8b0f66db46b0"
 *               id_car: "6685a207b7dd64c7d7e38b12"
 *               start_date: "20/04/2023"
 *               end_date: "30/04/2023"
 *     responses:
 *       '200':
 *         description: Successfully updated the reservation
 *       '400':
 *         description: Invalid request body or reservation ID
 *       '404':
 *         description: Reservation not found
 *       '500':
 *         description: Internal server error
 */

router.put(
  '/reserve/:id',
  reserveMiddleware,
  reserveController.updateReserve.bind(reserveController),
);

/**
 * @swagger
 * /api/v1/reserve/{id}:
 *   delete:
 *     summary: Delete a reservation by ID
 *     tags: [Reserves]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reservation to delete
 *     responses:
 *       '204':
 *         description: Successfully deleted the reservation
 *       '404':
 *         description: Reservation not found
 *       '500':
 *         description: Internal server error
 */

router.delete(
  '/reserve/:id',
  reserveController.deleteReserve.bind(reserveController),
);
/**
 * @swagger
 * /api/v1/reserve:
 *   get:
 *     summary: Get a list of reservations with filtering and pagination
 *     tags: [Reserves]
 *     parameters:
 *       - in: query
 *         name: _id
 *         schema:
 *           type: string
 *         description: Filter by reservation ID
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *         example: "DD/MM/YYYY"
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *         example: "DD/MM/YYYY"
 *       - in: query
 *         name: id_user
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: id_car
 *         schema:
 *           type: string
 *         description: Filter by car ID
 *       - in: query
 *         name: final_value
 *         schema:
 *           type: number
 *         description: Filter by final value
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of items to skip
 *     responses:
 *       '200':
 *         description: List of reservations matching the criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservations:
 *                   type: array
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       '400':
 *         description: Invalid request parameters
 *       '500':
 *         description: Internal server error
 */

router.get('/reserve', reserveController.findReserves.bind(reserveController));
/**
 * @swagger
 * /api/v1/reserve/{id}:
 *   get:
 *     summary: Get a reservation by ID
 *     tags: [Reserves]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reservation to get
 *     responses:
 *       '200':
 *         description: Reserve found
 *       '404':
 *         description: Reserve not found
 *       '500':
 *         description: Internal server error
 */

router.get(
  '/reserve/:id',
  reserveController.getReserveById.bind(reserveController),
);
