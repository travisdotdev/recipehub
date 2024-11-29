# Public link to our video
https://media.heanet.ie/page/REDACTED

# Download link to our video:
https://media.heanet.ie/page/REDACTED

# Recipe Application

A full-stack web application for discovering and managing recipes using the Spoonacular API. Built with Spring Boot, React, and MySQL.

![alt text](image.png)


## Prerequisites

- Docker and Docker Compose
- Java 21
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

## Quick Start with Docker:
```bash
git clone https://gitlab.scss.tcd.ie/csu33012-2425-group19/csu33012-2425-project19.git
cd csu33012-2425-project19
docker-compose build
docker-compose up



The application will be available at:
- Frontend: http://localhost:3000

## Manual Setup

### Backend Setup

1. Configure MySQL database:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/recipe_db
spring.datasource.username=recipeHub_db
spring.datasource.password=RandomPassword
```

2. Set up Spoonacular API key in `docker-compose.yml`: REDACTED

Alternative API keys (if rate limit is reached):
REDACTED
REDACTED 

3. Build and run the backend:
```bash
mvn clean install
mvn spring:run
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

## API Documentation

The backend API is available at `http://localhost:8080/api/recipes` with the following endpoints:
- GET `/searchByIngredients` - Search recipes by ingredients
- GET `/complexSearch` - Advanced recipe search

## Testing

Run backend tests:
```bash
mvn test
```

Run frontend tests:
```bash
cd frontend
npm test
```

## Technologies Used

- Backend: Spring Boot 3.4.0, Java 21
- Frontend: React 18.3.1, TailwindCSS
- Database: MySQL 8.0
- API: Spoonacular
- Testing: JUnit, React Testing Library
- Containerization: Docker

## Project Structure
├── backend/
│   ├── src/main/java/
│   │   ├── controller/    # REST API endpoints
│   │   ├── service/       # Business logic and Spoonacular API integration
│   │   ├── dto/           # Data transfer objects
│   │   ├── entity/        # Database entities
│   │   ├── repository/    # Data access layer
│   │   └── config/        # Application configuration
│   └── pom.xml           # Maven dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components and routing
│   │   ├── services/     # API integration
│   │   └── hooks/        # Custom React hooks
│   └── package.json      # npm dependencies
│
└── docker-compose.yml    # Docker configuration

## Notes for Graders

- The application requires a Spoonacular API key to function. Multiple API keys are provided above in case of rate limiting. The limit is 150 tokens and we've added rate limiting so it shouldn't be an issue.
- The Docker setup includes all necessary dependencies and database configuration.
