# 🏥 MedicoRe — Hospital Management System

**MedicoRe — Your Health, Connected.**

MedicoRe is a full-stack **Hospital Management System** designed to provide a centralized platform for managing patients, doctors, appointments, medicines, prescriptions, billing, users, and other hospital operations.

The application is built using **ASP.NET Core Web API, Angular, Entity Framework Core, and SQL Server**, with JWT-based authentication for securing the application.

---

## 🚀 Tech Stack

### Backend

* ASP.NET Core Web API
* C#
* .NET 10
* Entity Framework Core
* SQL Server
* JWT Authentication
* BCrypt Password Hashing
* RESTful APIs

### Frontend

* Angular
* TypeScript
* HTML5
* CSS3
* Angular Services
* Angular HTTP Client
* Authentication Interceptor
* Route-based navigation

### Database

* Microsoft SQL Server
* Entity Framework Core Code First
* EF Core Migrations

---

## ✨ Features

### 🔐 Authentication & Security

* User registration and login
* JWT-based authentication
* Password hashing using BCrypt
* Authentication interceptor
* Protected API endpoints
* Role-based user management

### 🏥 Hospital Management

* Patient management
* Doctor management
* Department management
* Appointment management
* Medicine management
* Prescription management
* Prescription medicine management
* Billing management
* User management
* Gender and role lookup management

### 🌐 Frontend

* Responsive healthcare interface
* MedicoRe branded login experience
* Dashboard
* Navigation sidebar
* Top navigation bar
* Angular services for API communication
* HTTP interceptor for authentication
* Component-based architecture

---

## 📂 Project Structure

```text
hospital-management-system/
│
├── backend/
│   ├── Controllers/
│   ├── Data/
│   ├── Migrations/
│   ├── Models/
│   ├── Services/
│   ├── Properties/
│   └── Program.cs
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
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## 🔑 Authentication Flow

MedicoRe uses **JWT (JSON Web Token)** authentication to secure communication between the Angular frontend and ASP.NET Core Web API.

```text
┌─────────────────────┐
│   Angular Login     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ ASP.NET Core API    │
│                     │
│ Validate User       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Generate JWT Token  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Angular Application │
│                     │
│ Authentication      │
│ State               │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ HTTP Interceptor    │
│                     │
│ Adds JWT Token      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Protected API       │
│ Endpoints           │
└─────────────────────┘
```

Passwords are hashed using **BCrypt** rather than being stored as plain text.

---

## 🗄️ Database

MedicoRe uses **Microsoft SQL Server** with **Entity Framework Core Code First**.

Database migrations are included in:

```text
backend/Migrations/
```

### Main Database Entities

```text
User
Role
Patient
Doctor
Department
Appointment
Medicine
Prescription
PrescriptionMedicine
Bill
Gender
```

The local database connection string and JWT secret are intentionally excluded from the GitHub repository through `.gitignore`.

---

## 🏗️ Application Architecture

```text
                 ┌───────────────────────┐
                 │    MedicoRe Frontend  │
                 │        Angular        │
                 └───────────┬───────────┘
                             │
                         HTTP / REST
                             │
                             ▼
                 ┌───────────────────────┐
                 │   ASP.NET Core Web    │
                 │         API           │
                 └───────────┬───────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │ Entity Framework Core │
                 │      Code First       │
                 └───────────┬───────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │      SQL Server       │
                 │  HospitalManagementDB │
                 └───────────────────────┘
```

---

# ⚙️ Getting Started

## Prerequisites

Make sure the following are installed:

* .NET SDK
* Node.js
* Angular CLI
* SQL Server / SQL Server LocalDB
* Visual Studio or Visual Studio Code

---

## 1. Clone the Repository

```bash
git clone https://github.com/shubhamp-001/hospital-management-system.git
```

Navigate into the project:

```bash
cd hospital-management-system
```

---

## 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Before running the backend, create your local `appsettings.json` configuration with your own database connection string and JWT settings.

**Do not upload your real `appsettings.json` if it contains private credentials or secrets.**

---

## 3. Apply Database Migrations

From the backend directory:

```bash
dotnet ef database update
```

This creates or updates the configured SQL Server database using the existing EF Core migrations.

---

## 4. Run the Backend

```bash
dotnet run
```

The ASP.NET Core Web API will start using the configured development URL.

---

## 5. Frontend Setup

Open another terminal.

Navigate to the frontend:

```bash
cd frontend
```

Install Angular dependencies:

```bash
npm install
```

---

## 6. Run Angular

Start the Angular development server:

```bash
ng serve
```

Open the application:

```text
http://localhost:4200
```

---

## 🔮 Future Improvements

* Role-specific dashboards
* Advanced search and filtering
* Appointment notifications
* Improved billing workflows
* Reports and analytics
* Automated testing
* Better validation and error handling
* Cloud deployment
* Production environment configuration

---

# 👨‍💻 Author

## Shubham Parashar

**Aspiring Full Stack .NET Developer**

Interested in building full-stack applications using **C#, ASP.NET Core, Angular, SQL Server, and modern web technologies**.

### Profiles

* GitHub: [@shubhamp-001](https://github.com/shubhamp-001)
* LinkedIn: [Shubham Parashar](https://linkedin.com/in/shubham-parashar-a189252a)

---

# 📄 License

This project is developed for **learning and portfolio purposes**.
