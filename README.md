# FlexiLease Autos API 🚗

FlexiLease Autos is a RESTful API for managing a car rental service, built using TypeScript and Node.js technologies.

## Features

- **TypeORM:** Object-Relational Mapping library for TypeScript and JavaScript.
- **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB:** NoSQL database for storing application data.
- **Zod:** TypeScript-first schema validation with a focus on developer experience.
- **JWT Token:** JSON Web Token for authentication and secure communication.
- **Controller-Service-Repository Pattern:** Organized application structure for scalability and maintainability.
- **Dependency Injection:** Utilized for injecting dependencies into classes, promoting loose coupling.
- **Tests:** Includes both End-to-End (E2E) and Integration tests using Jest, with an in-memory repository for testing.

## Technologies Used

- **Language:** TypeScript
- **Backend Framework:** Express.js
- **Database:** MongoDB with TypeORM
- **Validation:** Zod
- **Dependency Injection:** Tsyringe
- **Documentation:** Swagger
- **Authentication:** JWT Token
- **Automated Tests:** Jest
- **Code Maintenance:** Prettier/ESLint

## Project Structure

The project follows a structured approach for better organization and maintainability:

- **Middlewares:** Handle incoming requests, validating payloads with Zod.
- **Controllers:** Handle incoming requests, interact with services.
- **Services:** Implement business logic, orchestrate data flow between controllers and repositories.
- **Repositories:** Interface with the database, perform CRUD operations, manage entity interactions.
- **Dependency Injection:** Promotes decoupling, facilitates unit testing.

## Getting Started

To run the project locally:

1. Clone the repository:
    ```sh
    git clone https://github.com/RafGonzatto/FlexiLease-Autos-API.git
    ```

2. Install dependencies:
    ```sh
    cd FlexiLease-Autos-API
    npm install
    ```

3. Set up your MongoDB instance.

4. Set up environment variables:
    Create a `.env` file in the root directory and configure the necessary environment variables.
    ```env
    MONGODB_URI=mongodb://USER:PASSWORD@XXXXXXXX:XXXXX/
    MONGODB_DB=YOURDB
    MONGODB_TEST_DB=YOURTESTDB
    NODE_ENV=development/test
    JWT_SECRET=YOURJWTKEY
    ```

5. Compile the TypeScript files:
    ```sh
    npm run build
    ```

6. Start the server:
    ```sh
    npm start
    ```

    Alternatively:
    - For development mode: `npm run dev`
    - For testing with a separate database: `npm run testing`

## Testing
- Start the server in a terminal using: npm run testing to use the testing database declared in the .env 'MONGODB_TEST_DB' field.
- In another terminal,
- Run all tests using: npm run test

![Worker Animation](src/miscellaneous/testing.gif)

## Usage
All Cars and Reserves routes are protected by JWT Token.

![Worker Animation](src/miscellaneous/token.gif)

## API Documentation

API endpoints and usage are documented using Swagger. After starting the server, access the documentation at `/api-docs`.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your improvements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
