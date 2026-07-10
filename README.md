
# Smart Tuition Management System

A full-stack enterprise-level tuition management system built with Angular and Spring Boot.

## Technology Stack

### Frontend
- Angular 21+
- TypeScript
- Bootstrap 5
- Angular Material
- Chart.js (Dashboard Analytics)

### Backend
- Java 17
- Spring Boot 3+
- Spring Security with JWT Authentication
- Spring Data JPA (Hibernate)
- REST API Architecture
- Maven

### Database
- MySQL

## Features

- User Authentication (Admin, Teacher, Student)
- Student Management
- Teacher Management
- Course Management
- Batch Management
- Attendance Tracking
- Fee Management
- Marks Management
- Notifications
- Reports

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven
- MySQL
- Node.js and npm
- Angular CLI

### Backend Setup

1. Navigate to the backend directory
```bash
cd backend
```

2. Configure MySQL database in `src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_tuition?createDatabaseIfNotExist=true&amp;useSSL=false&amp;serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
```

3. Run the Spring Boot application
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory
```bash
cd frontend/smart-tuition-frontend
```

2. Install dependencies
```bash
npm install
```

3. Run the Angular application
```bash
ng serve
```

The frontend will start on `http://localhost:4200`

## Default Credentials

- **Admin Username**: admin
- **Admin Password**: admin123

## Project Structure

```
smart-tuition-management-system/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/tuition/smarttuition/
│   │       │       ├── config/
│   │       │       ├── controller/
│   │       │       ├── dto/
│   │       │       ├── entity/
│   │       │       ├── exception/
│   │       │       ├── repository/
│   │       │       ├── security/
│   │       │       ├── service/
│   │       │       └── SmartTuitionManagementApplication.java
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
├── frontend/                # Angular frontend
│   └── smart-tuition-frontend/
│       └── src/
│           └── app/
│               ├── components/
│               ├── interceptors/
│               ├── services/
│               ├── app.config.ts
│               ├── app.routes.ts
│               └── app.ts
└── README.md
```
