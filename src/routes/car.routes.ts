import { Router } from 'express'
import { container } from 'tsyringe'
import CarController from '../controllers/car.controller'
import { carMiddleware } from '../middlewares/car.middleware'
import verifyToken from '../middlewares/auth.middleware';

const router = Router()
const carController = container.resolve(CarController)

//router.use('/car', verifyToken);

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: Endpoints related to cars
 */

/**
 * @swagger
 * /api/v1/car:
 *   post:
 *     summary: Create a new car
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *               color:
 *                 type: string
 *               year:
 *                 type: string
 *               value_per_day:
 *                 type: number
 *               accessories:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     description:
 *                       type: string
 *               number_of_passengers:
 *                 type: number
 *             required:
 *               - model
 *               - color
 *               - year
 *               - value_per_day
 *               - accessories
 *               - number_of_passengers
 *     responses:
 *       '200':
 *         description: Created car object
 *         content:
 *           application/json:
 *             example:
 *               model: "Civic S10 2.8"
 *               color: "Silver"
 *               year: "2020"
 *               value_per_day: 150
 *               accessories: [
 *                 { description: "GPS" },
 *                 { description: "Leather seats" }
 *               ]
 *               number_of_passengers: 5
 *       '400':
 *         description: Invalid input, validation error
 *         content:
 *           application/json:
 *             example:
 *               error: "Validation failed"
 *       '500':
 *         description: Internal server error
 */
router.post(
    '/car',
    carMiddleware,
    carController.createCar.bind(carController),
  )

/**
 * @swagger
 * /api/v1/car:
 *   get:
 *     summary: Search for cars
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *         description: Car model
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Car color
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         description: Car year
 *       - in: query
 *         name: value_per_day
 *         schema:
 *           type: number
 *         description: Daily rental value
 *       - in: query
 *         name: accessories
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: List of accessories
 *       - in: query
 *         name: number_of_passengers
 *         schema:
 *           type: number
 *         description: Number of passengers
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Limit of results per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *           default: 0
 *         description: Offset for pagination
 *     responses:
 *       '200':
 *         description: List of cars matching the criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cars:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       model:
 *                         type: string
 *                       color:
 *                         type: string
 *                       year:
 *                         type: string
 *                       value_per_day:
 *                         type: number
 *                       accessories:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             description:
 *                               type: string
 *                       number_of_passengers:
 *                         type: number
 *                 total:
 *                   type: number
 *                 limit:
 *                   type: number
 *                 offset:
 *                   type: number
 *                 offsets:
 *                   type: number
 *       '400':
 *         description: Invalid query parameters
 *       '500':
 *         description: Internal server error
 */
router.get(
    '/car',
    carController.findCars.bind(carController)
  );
  /**
 * @swagger
 * /api/v1/car/{id}:
 *   get:
 *     summary: Get car by ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Car ID
 *     responses:
 *       '200':
 *         description: Car object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 model:
 *                   type: string
 *                 color:
 *                   type: string
 *                 year:
 *                   type: string
 *                 value_per_day:
 *                   type: number
 *                 accessories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       description:
 *                         type: string
 *                 number_of_passengers:
 *                   type: number
 *       '404':
 *         description: Car not found
 *       '500':
 *         description: Internal server error
 */
router.get('/car/:id', carController.getCarById.bind(carController));
/**
 * @swagger
 * /api/v1/car/{id}:
 *   put:
 *     summary: Update a car by ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Car ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *               color:
 *                 type: string
 *               year:
 *                 type: string
 *               value_per_day:
 *                 type: number
 *               accessories:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     description:
 *                       type: string
 *               number_of_passengers:
 *                 type: number
 *             example:
 *               model: "Civic S10 2.8"
 *               color: "Silver"
 *               year: "2020"
 *               value_per_day: 150
 *               accessories: [
 *                 { description: "GPS" },
 *                 { description: "Leather seats" }
 *               ]
 *               number_of_passengers: 5
 *     responses:
 *       '200':
 *         description: Updated car object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 model:
 *                   type: string
 *                 color:
 *                   type: string
 *                 year:
 *                   type: string
 *                 value_per_day:
 *                   type: number
 *                 accessories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       description:
 *                         type: string
 *                 number_of_passengers:
 *                   type: number
 *       '404':
 *         description: Car not found
 *       '500':
 *         description: Internal server error
 */
router.put('/car/:id', carMiddleware, carController.updateCar.bind(carController));
/**
 * @swagger
 * /api/v1/car/{id}:
 *   delete:
 *     summary: Delete a car by ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Car ID
 *     responses:
 *       '200':
 *         description: Car deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Car deleted successfully"
 *       '404':
 *         description: Car not found
 *       '500':
 *         description: Internal server error
 */
router.delete('/car/:id', carMiddleware, carController.deleteCar.bind(carController));

export default router
