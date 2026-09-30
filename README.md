🏥 Hospital Management System

A full-stack Hospital Management System built with ASP.NET Core Web API, Angular, Entity Framework Core, and SQL Server.

The application provides a centralized platform for managing patients, doctors, appointments, medicines, prescriptions, billing, users, and other hospital operations.

🚀 Tech Stack
Backend
ASP.NET Core Web API
C#
.NET 10
Entity Framework Core
SQL Server
JWT Authentication
BCrypt Password Hashing
RESTful APIs
Frontend
Angular
TypeScript
HTML5
CSS3
Angular Services
HTTP Client
Route Guards / Authentication Interceptor
Database
Microsoft SQL Server
Entity Framework Core Code First
EF Core Migrations
✨ Features
🔐 User authentication with JWT
👥 Role-based user management
🧑‍⚕️ Doctor management
🧑‍🤝‍🧑 Patient management
📅 Appointment management
💊 Medicine management
📋 Prescription management
💰 Billing management
🏥 Department management
🔎 Lookup and reference data management
🔒 Password hashing using BCrypt
🌐 Angular frontend connected with ASP.NET Core Web API
📂 Project Structure
hospital-management-system/
│
├── backend/
│   ├── Controllers/
│   ├── Data/
│   ├── Migrations/
│   ├── Models/
│   ├── Services/
│   ├── Properties/
│   ├── Program.cs
│   └── Hospital Management System.csproj
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── components/
│   │       ├── interceptors/
│   │       ├── models/
│   │       └── services/
│   ├── public/
│   ├── angular.json
│   ├── package.json
│   └── package-lock.json
│
└── .gitignore
🔑 Authentication

The backend uses JWT (JSON Web Token) authentication.

The authentication flow is:

Angular Login
     ↓
ASP.NET Core Web API
     ↓
Validate User
     ↓
Generate JWT Token
     ↓
Angular stores authentication state
     ↓
HTTP Interceptor sends JWT
     ↓
Protected API Endpoints

Passwords are securely hashed using BCrypt rather than storing plain-text passwords.

🗄️ Database

The project uses SQL Server with Entity Framework Core Code First.

Database migrations are included in:

backend/Migrations/

The actual local database connection and JWT secret are intentionally excluded from GitHub through .gitignore.

⚙️ Getting Started
Prerequisites

Make sure you have installed:

.NET SDK
Node.js
Angular CLI
SQL Server / SQL Server LocalDB
Visual Studio or Visual Studio Code
