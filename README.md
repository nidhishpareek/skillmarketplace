# Skill Marketplace

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime for building the server.
- **Express.js**: Web framework for building RESTful APIs.
- **Prisma ORM**: Database ORM for PostgreSQL.
- **Yup**: Schema validation for request payloads.
- **JWT**: JSON Web Tokens for authentication.
- **Jest**: Testing framework for unit and integration tests.

### Frontend
- **Next.js**: React framework for building the web application.
- **React Context API**: State management for the frontend.
- **Yup**: Schema validation for forms.

### Database
- **PostgreSQL**: Relational database for storing application data.

### Dev Tools
- **pnpm**: Fast and efficient package manager.
- **TypeScript**: Typed superset of JavaScript for type safety.
- **ESLint**: Linting tool for maintaining code quality.
- **Prettier**: Code formatter for consistent styling.

## Overview
Skill Marketplace is a platform that connects individuals and companies with skilled professionals. It allows users to create profiles, list skills, and manage tasks efficiently. The project is divided into two main parts:

1. **Server**: Backend API built with Node.js, Express, and Prisma ORM.
2. **Web**: Frontend application built with Next.js.

## Features
- User authentication and authorization.
- Profile creation for individuals and companies.
- Skill and task management.
- API validation using Yup schemas.
- Database management with Prisma ORM.

## Folder Structure
```
skillmarketplace/
├── server/       # Backend API
├── web/          # Frontend application
```

### Server
```
server/
├── prisma/       # Prisma schema and migrations
├── src/          # Source code
│   ├── routes/   # API routes
│   ├── schemas/  # Yup validation schemas
│   ├── utils/    # Utility functions
│   ├── middleware/ # Express middleware
│   ├── libs/     # External libraries and configurations
├── tests/        # Unit tests
```

### Web
```
web/
├── src/          # Source code
│   ├── components/ # React components
│   ├── pages/    # Next.js pages
│   ├── utils/    # Utility functions
│   ├── constants/ # Environment variables and constants
│   ├── context/  # React context providers
│   ├── hooks/    # Custom React hooks
│   ├── styles/   # CSS styles
```

## Prerequisites
- Node.js (v16 or higher)
- pnpm (v7 or higher)
- PostgreSQL (for the database)

## Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd skillmarketplace
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `server/` and `web/` directories with the following variables:

#### Server
```
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
JWT_SECRET=<your-jwt-secret>
```

#### Web
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Run Migrations
Navigate to the `server/` directory and run:
```bash
pnpm prisma migrate dev
```

### 5. Start the Development Servers
#### Server
```bash
cd server
pnpm dev
```

#### Web
```bash
cd web
pnpm dev
```

## Testing
Run the tests for the server:
```bash
cd server
pnpm test
```

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Backend Endpoints

The backend API provides the following endpoints:

### Authentication
- **POST /login**: Authenticate a user and return a JWT token.
- **POST /verifyAuth**: Verify the validity of a JWT token.

### Profile Management
- **POST /profile**: Create a new profile for an individual or company.

### Skills
- **GET /skills**: Retrieve a list of skills.
- **POST /skills**: Add a new skill.

### Tasks
- **GET /tasks**: Retrieve a list of tasks.
- **POST /tasks**: Create a new task.
- **PUT /tasks/:id**: Update an existing task.
- **DELETE /tasks/:id**: Delete a task.

### Offers
- **POST /offers**: Create a new offer.
- **GET /offers**: Retrieve a list of offers.

### Progress Logs
- **POST /progressLog**: Add a progress log for a task.
- **GET /progressLog**: Retrieve progress logs for a task.
