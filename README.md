# Todo System

A microservices-based todo application with user authentication, built with Node.js, TypeScript, PostgreSQL, and Docker.

## Features

- User registration and authentication with JWT
- Personal todo list management (CRUD operations)
- Microservices architecture
- RESTful API design
- Comprehensive test coverage
- Docker containerization
- Simple web frontend

## Architecture

- **User Service** (Port 3001): Handles user registration and authentication
- **Todo Service** (Port 3002): Manages todo operations with JWT validation
- **Frontend** (Port 3000): Simple web interface
- **PostgreSQL Database** (Port 5432): Shared database for both services

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL (for local development)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-system
   ```

2. **Start all services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - User Service API: http://localhost:3001
   - Todo Service API: http://localhost:3002

## Development

### Frontend Development

To run the frontend in development mode:

```bash
cd frontend
npm install
npm start
```

The frontend will be available at http://localhost:3000.

### Backend Development

To run the backend services individually:

```bash
# User Service
cd user-service
npm install
npm run dev

# Todo Service (in another terminal)
cd todo-service
npm install
npm run dev
```

## Testing

### Running Tests Locally

```bash
# User Service Tests
cd user-service
npm test

# Todo Service Tests
cd todo-service
npm test

# Frontend Tests
cd frontend
npm test
```

### Running Tests with Docker

For testing with a dedicated test database:

```bash
# Run tests with test database
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Clean up test containers
docker-compose -f docker-compose.test.yml down
```

### Test Coverage

- **User Service**: Tests for registration, login, and JWT validation
- **Todo Service**: Tests for CRUD operations with authentication
- **Frontend**: React component tests (when implemented)

**Note**: Tests are skipped during Docker build to avoid database dependencies. Use the local test commands or the test Docker Compose configuration for running tests.