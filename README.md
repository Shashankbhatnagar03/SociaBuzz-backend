# Sociabuzz Backend

Sociabuzz's backend is a powerful and scalable system, constructed with Node.js, Express, and MongoDB. It's designed to provide a robust and efficient server-side solution for the Sociabuzz social media platform.

## Key Features

- **TypeScript**: The backend leverages TypeScript, a statically typed superset of JavaScript, to ensure type safety. This enhances code reliability and maintainability.

- **JWT Authentication**: JSON Web Tokens (JWT) are used for secure user authentication. This ensures that user data is protected and that only authenticated requests can access certain routes.

- **Real-Time Communication**: The backend integrates Socket.IO, a library that enables real-time, bidirectional, and event-based communication. This allows for instantaneous interactions between users.

- **Data Validation**: Zod, a TypeScript-first schema declaration and validation library, is employed for robust data validation. This ensures the integrity and correctness of user data, providing an additional layer of security.

- **RESTful API Architecture**: The system is designed with a RESTful API architecture, promoting efficient data interaction between the client and server. This design also allows for scalability, accommodating an expanding user base.

## Getting Started

To get the backend running locally:

- Clone this repo
- `npm install` to install all required dependencies
- Create a MongoDB database and update the connection string in your `.env` file
- `npm run dev` to start the local server

## Code Overview

The application is structured based on the MVC architecture. The `models` directory contains the database schema definitions, the `controllers` directory contains the business logic of the application, and the `routes` directory contains the route definitions.
