import { Router } from 'express'
import { container } from 'tsyringe'
import UserController from '../controllers/user.controller'
import { userMiddleware } from '../middlewares/user.middleware'

const router = Router()
const userController = container.resolve(UserController)



/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints related to Users
 */
/**
 * @swagger
 * /api/v1/user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cpf:
 *                 type: string
 *                 example: "XXX.XXX.XXX-XX"
 *               birth:
 *                 type: string
 *                 example: "DD/MM/YYYY" 
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 example: "XXXXXX" 
 *                 minLength: 6
 *               cep:
 *                 type: string
 *                 example: "XXXXXXXX" 
 *                 minLength: 8
 *               qualified:
 *                 type: string
 *                 example: "yes/no" 
 *             required:
 *               - name
 *               - cpf
 *               - birth
 *               - email
 *               - password
 *               - cep
 *               - qualified
 *     responses:
 *       '200':
 *         description: Created user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of the created user
 *                 cpf:
 *                   type: string
 *                   description: CPF of the created user
 *                 birth:
 *                   type: string
 *                   format: date
 *                   description: Birthdate of the created user
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Email of the created user
 *                 cep:
 *                   type: string
 *                   description: CEP of the created user
 *                 qualified:
 *                   type: string
 *                   description: Qualification of the created user
 *             example:
 *               name: "John Doe"
 *               cpf: "778.146.327-73"
 *               birth: "03/03/2000"
 *               email: "john.doe@example.com"
 *               password: "123456"
 *               cep: "99010051"
 *               qualified: "yes"
 *       '400':
 *         description: Invalid input, validation error or  or CPF invalid
 *         content:
 *           application/json:
 *             example:
 *               error: "Validation failed/Invalid CPF"
 *       '404':
 *         description: Failed to fetch address information from ViaCEP
 *       '409':
 *         description: Email address is already registered
 *       '500':
 *         description: Internal server error
 */
router.post(
    '/user',
    userMiddleware,
    userController.createUser.bind(userController),
  );
  
/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: User ID
 *     responses:
 *       '200':
 *         description: User found
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.get('/user/:id', userController.getUserById.bind(userController));


/**
 * @swagger
 * /api/v1/user/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cpf:
 *                 type: string
 *                 example: "XXX.XXX.XXX-XX"
 *               birth:
 *                 type: string
 *                 example: "DD/MM/YYYY" 
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 example: "XXXXXX" 
 *                 minLength: 6
 *               cep:
 *                 type: string
 *                 example: "XXXXXXXX" 
 *                 minLength: 8
 *               qualified:
 *                 type: string
 *                 example: "yes/no" 
 *             required:
 *               - name
 *               - cpf
 *               - birth
 *               - email
 *               - password
 *               - cep
 *               - qualified
 *     responses:
 *       '200':
 *         description: Created user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of the created user
 *                 cpf:
 *                   type: string
 *                   description: CPF of the created user
 *                 birth:
 *                   type: string
 *                   format: date
 *                   description: Birthdate of the created user
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Email of the created user
 *                 cep:
 *                   type: string
 *                   description: CEP of the created user
 *                 qualified:
 *                   type: string
 *                   description: Qualification of the created user
 *             example:
 *               name: "John Doe"
 *               cpf: "778.146.327-73"
 *               birth: "03/03/2000"
 *               email: "john.doe@example.com"
 *               password: "123456"
 *               cep: "99010051"
 *               qualified: "yes"
 *       '400':
 *         description: Invalid input, validation error or  or CPF invalid
 *         content:
 *           application/json:
 *             example:
 *               error: "Validation failed/Invalid CPF"
 *       '404':
 *         description: Failed to fetch address information from ViaCEP
 *       '409':
 *         description: Email address is already registered
 *       '500':
 *         description: Internal server error
 */
router.put(
    '/user/:id',
    userMiddleware,
    userController.updateUser.bind(userController),
);

/**
 * @swagger
 * /api/v1/authenticate:
 *   post:
 *     summary: Authenticate user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: JWT token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       '401':
 *         description: Unauthorized, invalid credentials
 *       '404':
 *         description: Email and Password not found
 *       '500':
 *         description: Internal server error
 */
router.post('/authenticate',
  userController.authenticateUser.bind(userController),
);
/**
 * @swagger
 * /api/v1/user/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.delete('/user/:id', userController.deleteUser.bind(userController));
/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users with pagination and filters
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by user's name
 *       - in: query
 *         name: cpf
 *         schema:
 *           type: string
 *         description: Filter by user's CPF
 *       - in: query
 *         name: birth
 *         schema:
 *           type: string
 *         description: Filter by user's birthdate
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by user's email
 *       - in: query
 *         name: cep
 *         schema:
 *           type: string
 *         description: Filter by user's CEP
 *       - in: query
 *         name: qualified
 *         schema:
 *           type: string
 *         description: Filter by user's qualification status
 *       - in: query
 *         name: patio
 *         schema:
 *           type: string
 *         description: Filter by user's patio
 *       - in: query
 *         name: complement
 *         schema:
 *           type: string
 *         description: Filter by user's complement
 *       - in: query
 *         name: neighborhood
 *         schema:
 *           type: string
 *         description: Filter by user's neighborhood 
 *       - in: query
 *         name: locality
 *         schema:
 *           type: string
 *         description: Filter by user's locality
 *       - in: query
 *         name: uf
 *         schema:
 *           type: string
 *         description: Filter by user's uf
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Limit of results per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset for pagination
 *     responses:
 *       '200':
 *         description: List of users matching the criteria
 *         content:
 *           application/json:
 *                 total:
 *                   type: integer
 *                   description: Total number of users matching the criteria
 *                 limit:
 *                   type: integer
 *                   description: Limit of results per page
 *                 offset:
 *                   type: integer
 *                   description: Offset for pagination
 *                 offsets:
 *                   type: integer
 *                   description: Total number of pages
 *       '500':
 *         description: Internal server error
 */
router.get('/users', userController.getAllUsers.bind(userController));

  export default router;
  