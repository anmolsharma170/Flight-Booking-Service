# Flight Booking Service

This repository contains the **Flight Booking Service**, a microservice which handles ticketing and seat booking functionality for an overarching **Airline Booking Backend Project**.

## Tech Stack
* **Node.js** & **Express.js** for the core server
* **Sequelize (ORM)** & **MySQL2** for database interaction
* **Winston** for logging and error tracking
* **Dotenv** for environment variable management

## Project Architecture
This service uses a layered architecture pattern:
* **Routes**: Intercepts requests and maps them to controllers.
* **Middlewares**: Request interceptors for validation and authentication.
* **Controllers**: Extracts request data, calls services, structures the API response, and sends the output.
* **Services**: Defines the core business logic.
* **Repositories**: Data access layer handles raw database queries and ORM methods.
* **Models / Migrations**: Defines database structure (using Sequelize).
* **Utils**: Helper methods, custom error classes (`AppError`), ENUMs, and standardized API JSON responses (`success-response`, `error-response`).

## Implemented So Far
* **Base Skeleton Structure**: A clean and robust boilerplate set up with routes, controllers, services, repositories, models, and custom utilities.
* **API Health Check**: Baseline endpoint `GET /api/v1/info` is configured.
* **Database Modeling**: Model and Migrations created for the `Bookings` table containing:
  * `id` (Primary Key)
  * `flightId`
  * `userId`
  * `status` (Enum restricted to: `BOOKED`, `CANCELLED`, `INITIATED`, `PENDING`)
  * `noOfSeats`
  * `totalCost`
* **Repository Pattern**: Extensible `crud-repository` base class configured, with `booking-repository` extending it.
* **Modular Setup**: Scaffolded `booking-service` and `booking-controller` ready for business logic integration.

## Setup the project

1. **Clone & Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory and add the port:
   ```env
   PORT=3000
   ```

3. **Database Configuration**
   By default, `Sequelize` setup expects DB credentials in `src/config/config.json`.
   Configure the `development` environment with your `username`, `password`, `database`, and `dialect` (e.g., `mysql`).

4. **Initialize and Migrate**
   Inside the **root folder**, create the database and run migrations:
   ```bash
   npx sequelize db:create
   ```
   *Note: If `npx sequelize db:migrate` fails to find config, ensure you run from `src/` directory:*
   ```bash
   cd src
   npx sequelize db:migrate
   ```

5. **Start the Server**
   ```bash
   npm run dev
   ``` 