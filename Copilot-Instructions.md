# Copilot Instructions – Polka.Search (Spring Boot Portfolio Project)

## Project Goal

Build a production-style Spring Boot monolith called **Polka.Search** that demonstrates backend engineering skills typical for Junior/Mid Java Developer roles.

The application is a **local business and event discovery system** with authentication, PostgreSQL persistence, search features, and REST API.

Focus is on:

* Clean architecture
* Spring Boot best practices
* Realistic CRUD + search system
* Professional code structure

---

## Tech Stack (mandatory)

* Java 21
* Spring Boot 3+
* Spring Web (MVC + REST)
* Spring Security (basic auth or form login)
* Spring Data JPA (Hibernate)
* PostgreSQL
* Thymeleaf (UI layer)
* Maven
* JUnit 5 + Mockito
* Docker + Docker Compose

Optional later:

* Testcontainers
* Map integration (OpenStreetMap)

---

## Core Domain

Entities:

### User

* id
* username
* email
* password
* roles

### Business

* id
* name
* description
* category
* address
* latitude
* longitude
* tags

### Event

* id
* name
* description
* category
* startDate
* endDate
* address
* latitude
* longitude

### Location (optional value object)

* latitude
* longitude

---

## Functional Requirements

### 1. Authentication

* User registration
* Login/logout
* Password encryption (BCrypt)
* Role support (USER / ADMIN)

---

### 2. Business Module

* Create business (ADMIN)
* View business list
* View business details
* Edit/delete (ADMIN)

---

### 3. Event Module

* Create event (ADMIN)
* List events
* View event details
* Filter by date

---

### 4. Search Engine (core feature)

Implement unified search across Business + Event.

Support:

* keyword search (name, description, tags)
* category filter
* location radius search (Haversine formula)
* sorting by distance

Search endpoint:

```
GET /search?q=&category=&lat=&lng=&radius=
```

---

### 5. Web UI (Thymeleaf)

Pages:

* /login
* /register
* /search
* /business/{id}
* /event/{id}
* /admin dashboard (optional)

Search page must include:

* search input
* category dropdown
* radius selector
* results list (business + events)

---

## Architecture Rules

### Package structure

```
controller/
service/
repository/
model/
dto/
security/
config/
exception/
mapper/
```

---

### Design rules

* Controllers must be thin
* Business logic must be in services
* Entities must not leak to UI directly (use DTOs)
* Use constructor injection only
* Avoid static utilities except for helpers like distance calculation

---

## Search Implementation Details

Use Haversine formula for distance:

* input: lat/lng user + lat/lng entity
* output: distance in km
* filter: radius parameter

---

## Security Requirements

* Passwords hashed with BCrypt
* Basic form login or Spring Security default login page
* Protect `/admin/**` endpoints
* Allow public access to `/search`, `/login`, `/register`

---

## Data Strategy

* Use PostgreSQL
* Initialize with sample data using `data.sql` or `CommandLineRunner`
* Include:

  * at least 10 businesses
  * at least 10 events
  * spread across different coordinates (simulate city)

---

## Testing Requirements

* Unit tests for:

  * SearchService
  * Distance calculation utility

* Integration tests:

  * Controller endpoints
  * Repository layer (optional with Testcontainers)

---

## Docker

Provide:

* Dockerfile for Spring Boot app
* docker-compose.yml with PostgreSQL

App must run with:

```bash
docker compose up
```

---

## Acceptance Criteria

Project is complete when:

* User can register and login
* Businesses and events exist in DB
* Search works with filters + radius
* UI displays results via Thymeleaf
* REST endpoints are working
* App runs via Docker

---

## Important Constraints

* Do NOT over-engineer (no microservices)
* Do NOT use Kafka, Redis, Kubernetes
* Keep monolith architecture
* Prioritize clean Spring Boot patterns
* Focus on readability and maintainability
