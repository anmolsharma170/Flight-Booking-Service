# ✈️ Flight Booking Service - Microservice Architecture

This repository hosts the **Flight Booking Service**, a robust, highly scalable microservice that handles ticketing, seat inventory management, and payment processing for an overarching **Airline Booking Backend Platform**. 

Built with enterprise-ready design patterns, this project demonstrates how to solve complex distributed systems engineering problems such as **race conditions**, **distributed transaction management**, **asynchronous event-driven communication**, and **resource cleanup**.

---

## 🚀 Key Engineering Problems Solved

This project is a showcase of backend engineering concepts, specifically focused on solving real-world challenges encountered at scale in a microservices ecosystem:

### 1. Distributed Inventory Management (Overbooking Prevention)
- **Problem**: When a user books a flight, how do we prevent two users from booking the same seat concurrently?
- **Solution**: The service uses **ACID-compliant transactions** (via Sequelize) to safely record the `INITIATED` booking. It then communicates synchronously with the external `Flight Search Service` to decrement seat capacity. If the flight service rejects the request due to concurrent depletion, the transaction instantly rolls back, guaranteeing zero overbooking.

### 2. Event-Driven Asynchronous Decoupling (Message Brokers)
- **Problem**: Sending notification emails/SMS takes time. If done during the booking/payment API request, it drastically increases latency and reduces system throughput.
- **Solution**: Implemented **RabbitMQ** (via `amqplib`). Once a payment is successful, the service instantly commits the transaction and pushes a structured event (payload) into a `noti-queue`. A separate Notification Microservice listens to this queue to process emails asynchronously, keeping the Booking API heavily optimized and highly responsive.

### 3. Automated State Recovery & Resource Garbage Collection
- **Problem**: Users often initiate a booking but fail to complete the payment. If we lock those seats indefinitely, the airline loses revenue on empty seats.
- **Solution**: Implemented a background **Cron Job** (via `node-cron`) that runs seamlessly every 30 minutes. It polls the database for bookings stuck in the `INITIATED` or `PENDING` states for more than 5 minutes. It automatically sweeps these stale bookings, updates their status to `CANCELLED`, and surgically makes a compensating API call back to the Flight Service to increment the seats back into the available pool.

### 4. Distributed Data Consistency (Saga-like Pattern)
- **Problem**: Payment can fail, or timestamps can expire after the inventory has been reserved in a separate microservice.
- **Solution**: Engineered a robust compensating transaction workflow. If the internal payment validation fails (e.g., incorrect amount, or 5-minute payment window expired), the service actively triggers a cancellation workflow that restores the exact number of seats securely back to the parent Flight Service.

---

## 🥰 Tech Stack & Ecosystem

- **Backend Runtime**: Node.js, Express.js
- **Database**: MySQL2
- **ORM**: Sequelize (Migrations, Database Modeling, Transactions)
- **Inter-service Communication**: Axios (Synchronous API calls to Flight Service)
- **Message Broker**: RabbitMQ (Asynchronous event publishing to Notification Service)
- **Background Tasks**: node-cron (Automated polling and cleanup operations)
- **Architecture Pattern**: MVC / Layered (Routes -> Controllers -> Middlewares -> Services -> Repositories -> Models)
- **Utilities**: Winston (Logging), dotenv, http-status-codes

---

## 𓇂 Project Architecture & Folder Structure

- **`src/config/`**: Contains core configurations for Server, Logger (Winston), Message Queue (RabbitMQ), and DB.
- **`src/controllers/`**: API handlers responsible for translating incoming HTTP requests, orchestrating services, and constructing standard JSON responses.
- *(`src/services/`**: Core business domain logic (`booking-service.js`), enforcing invariants, transaction boundaries, and executing inter-service HTTP interactions.
- **`src/repositories/`**: Abstracted data access layer (`crud-repository.js`, `booking-repository.js`) isolating raw ORM dependencies.
- *(`src/models/`` & **`src/migrations/`**: Code-first database schema definitions keeping the relational model tightly version controlled.
- **`src/utils/`**: Shared tools including Cron Jobs, Custom App Errors, Enums (Booking states), and standardization wrappers.

---

## ⚙️ Setup & Installation

**Prerequisites:** Node.js, MySQL, RabbitMQ (Running locally or via Docker)

1. **Clone & Install Dependencies**
   ```bash
   npm install
   ```
	2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   FLIGHT_SERVICE_PATH=http://localhost:<flight_service_port>
   RABBITMQ_URL=amqp://localhost
   ```

3. **Database Configuration**
   By default, Sequelize expects credentials in `src/config/config.json`. Update the `development` node with your `username`, `password`, `database` (e.g., `flight_booking_db`), and `dialect` (`mysql`).

4. **Initialize and Migrate**
   Inside the root folder, run:
   ```bash
   npx sequelize db:create
   npx sequelize db:migrate --migrations-path src/migrations --config src/config/config.json
   ```

5. **Start the Infrastructure & Server**
   Ensure RabbitMQ is running.
   ```bash
   npm run dev
   ```J
Note: The server automatically schedules background cron jobs on startup hooked into `clieanup-jobs`.

---

## 🗎 Future Enhancements
- Integration of **Redis** for distributed caching of seat availability to reduce cross-service network hops.
- Implementation of **Circuit Breakers** to handle external service outages gracefully.
- Horizontal scaling using **Kubernetes** to spin up multiple instances of the consumer worker nodes processing RabbitMQ queues.

---
_Built with ❤️ for backend engineering and solving distributed systems at scale._