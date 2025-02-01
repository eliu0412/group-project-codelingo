
# Codelingo: A Gamified Learning Platform

## Overview

Codelingo is an interactive and engaging web application designed to help users learn programming languages in a gamified environment. Inspired by the structure of Duolingo, this platform combines interactive lessons, real-time battles, and trackable progress to motivate users and enhance their learning experience. The application supports both learning and competition modes, allowing users to practice independently or engage with others in coding battles and quizzes.

## Motivation

In the world of programming, maintaining motivation and accountability is often a challenge. Many learners find it difficult to stay driven, especially when traditional learning resources lack engagement. The CodeLingo project aims to solve this problem by gamifying the learning experience. Not only does it teach programming concepts, but it also provides a platform for coding competitions, enabling users to test their skills under pressure. By integrating learning with competition, this platform keeps users engaged, motivated, and on track in their learning journey.

## Architecture

**Microservices**: Codelingo follows a microservices architecture to ensure modularity, scalability, and maintainability. Each core functionality, such as user authentication, coding battles, lesson tracking, and leaderboard management, is handled by separate microservices that communicate via event-driven messaging (Redis Pub/Sub) and RESTful APIs. An API Gateway centralizes client requests, improving security and request handling efficiency.

## Technologies Used

- **Frontend:** React (TypeScript), Tailwind, Redux, React Query
- **Backend:** Node.js Microservices
- **Database:** Firebase 
- **Sockets/Polling:** Socket.io, Server Sent Events
- **Queues:** Redis
- **Authentication:** JWT & Auth0 (Using OAuth2.0)
- **Deployment:** Docker, Github Actions (CI/CD), Nginx, AWS Lambda

### Why These Technologies?

1. **React (TypeScript):** Chosen for its component-based architecture, maintainability, and TypeScript’s static typing benefits.
2. **Node.js Microservices:** To ensure scalability and maintainability through a modular architecture.
3. **Firebase:** Provides real-time data synchronization and simplifies the backend infrastructure. We will also be storing images and programming files in the database(s).
4. **Socket.io & SSE:** Enables real-time interactions critical for live coding battles and competitive play.
5. **Redis:** Facilitates efficient message queuing for real-time operations and notifications.
6. **Docker & AWS Lambda:** Ensures a scalable and reliable deployment strategy.

## Installation

### Prerequisites

- [Docker](https://www.docker.com/get-started) installed
- [Node.js](https://nodejs.org/) version 14+ installed
- [AWS CLI](https://aws.amazon.com/cli/) configured (for deployment)
- [Git](https://git-scm.com/) installed

### Steps

1. **Clone the Repository:**

   ```bash
   git clonehttps://github.com/UTSC-CSCC01-Software-Engineering-I/term-group-project-c01w25-project-codelingo
   cd term-group-project-c01w25-project-codelingo
   ```

2. **Set Up Environment Variables:**

   Create `.env` files in both `frontend` and `backend` directories with necessary configurations like API keys.

3. **Running Locally:**

   Using Docker Compose to run both frontend and backend:

   ```bash
   docker-compose up --build
   ```

   (This will start the development server for both frontend and backend.)

4. **Access the Application:**

   Open your browser and navigate to `http://localhost:3000` for the application frontend.

## Design Patterns
![image](https://github.com/user-attachments/assets/d5545f82-d65e-440e-a10a-cf000e752958)

![image](https://github.com/user-attachments/assets/9fedb081-7fae-4ef1-90fc-4f84d1b993bc)


### Microservices Architecture

The backend of Codelingo utilizes a microservices architecture, ensuring modularity, scalability, and resilience. Here are key design patterns employed:

1. **Service Discovery:**
   - Allows dynamic lookup of service instances, enabling services to find each other and communicate directly, even when they scale across multiple instances.

2. **API Gateway:**
   - Acts as a single entry point for all frontend requests. The gateway routes requests to the appropriate microservice, handles request aggregation, and provides security features like authentication.

3. **Circuit Breaker:**
   - Protects services from cascading failures by detecting when a service becomes unavailable and preventing requests from overloading it.

4. **Event-Driven Architecture:**
   - Utilizes message queues (Redis Pub/Sub) for asynchronous communication between services, facilitating decoupling and improving system responsiveness.

5. **Database-per-Service:**
   - Each microservice manages its own database to ensure data encapsulation and isolation, reducing shared-state risks.

### Advantages

- **Scalability:** Individual microservices can be scaled independently based on demand, optimizing resource usage.
- **Resilience:** Failures in one microservice do not necessarily affect the others, enhancing system reliability.
- **Flexibility:** Services can be developed, deployed, and maintained independently, allowing for continuous integration and deployment (CI/CD).

## Contribution Process

1. **Git Flow:** We use Git Flow for branch management.

2. **Branch Naming:**
   - `feature/{descriptive_name}` for new features
   - `bugfix/{descriptive_name}` for bug fixes
   - `hotfix/{descriptive_name}` for urgent fixes in production code

3. **Issue Tracking:**
   - We use [GitHub Issues](https://github.com/yourusername/codelingo/issues) for tracking bugs and feature requests.

4. **Pull Requests:**
   - Ensure your code is well-documented and follows the project's coding style.
   - Open a pull request and briefly describe the purpose of the changes.
   - A project maintainer will review and merge your changes.

## Resources

- [How to Write a Good README](https://dev.to/merlos/how-to-write-a-good-readme-bog)
- [Make a README](https://www.makeareadme.com/)

## Conclusion

Codelingo aspires to transform the way programming is taught by integrating gamification elements with structured learning modules. By inspiring competitiveness and accountability, we aim to enhance motivation and create a thriving community of learners. Join us in our mission to make programming education more engaging and accessible to everyone.
