# FastAPI Backend - RealEstate Platform

A comprehensive FastAPI backend for a real estate platform supporting builders and customers with complete project management, booking, and communication features.

## 📋 Table of Contents

-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Project Structure](#project-structure)
-   [Installation](#installation)
-   [Database Setup](#database-setup)
-   [Running the Application](#running-the-application)
-   [API Documentation](#api-documentation)
-   [Architecture Overview](#architecture-overview)

## ✨ Features

### Builder Portal

-   🏗️ Project Management (CRUD operations)
-   🏠 Unit Management with availability tracking
-   📊 Construction progress tracking
-   📝 Customer booking management
-   💬 Communication with customers
-   📈 Analytics and reporting

### Customer Portal

-   🔍 Property browsing with advanced filters
-   📅 Appointment scheduling
-   💰 Booking and payment tracking
-   📱 Real-time notifications
-   🏗️ Construction progress monitoring
-   🎨 Customization requests (Change Requests)
-   📧 Messaging system

### Core Features

-   🔐 JWT-based authentication
-   👥 Role-based access control (Builder/Customer)
-   📊 Pagination and filtering
-   🗄️ PostgreSQL database with SQLAlchemy ORM
-   📝 Comprehensive API documentation (Swagger/ReDoc)
-   🎨 3D model management
-   🔔 Multi-channel notifications

## 🛠️ Tech Stack

-   **Framework**: FastAPI 0.116.1
-   **Database**: PostgreSQL with SQLAlchemy 2.0
-   **Authentication**: JWT (python-jose)
-   **Password Hashing**: Bcrypt (passlib)
-   **Validation**: Pydantic 2.11
-   **Migrations**: Alembic
-   **Server**: Uvicorn
-   **Testing**: Pytest

## 📁 Project Structure

```
fastapi/
├── database/
│   ├── __init__.py
│   ├── database.py          # Database connection & session
│   ├── models.py            # SQLAlchemy ORM models
│   ├── schemas.py           # Pydantic schemas
│   ├── crud.py              # Database operations
│   └── main.py              # FastAPI application & routes
├── init_db.py               # Database initialization script
├── requirements.txt         # Original dependencies
├── requirements-full.txt    # Complete dependencies list
├── BACKEND_DOCUMENTATION.md # Comprehensive documentation
└── README.md               # This file
```

## 🚀 Installation

### Prerequisites

-   Python 3.10+
-   PostgreSQL 14+
-   pip or poetry

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd RealEstate/fastapi
```

### Step 2: Create Virtual Environment

```bash
# Using venv
python -m venv venv

# Activate on Linux/Mac
source venv/bin/activate

# Activate on Windows
venv\Scripts\activate
```

### Step 3: Install Dependencies

```bash
# Install all required packages
pip install -r requirements-full.txt
```

## 💾 Database Setup

### Step 1: Create PostgreSQL Database

```bash
# Using createdb command
createdb realestate

# Or using psql
psql -U postgres
CREATE DATABASE realestate;
\q
```

### Step 2: Configure Database Connection

Update the database URL in `database/database.py`:

```python
DATABASE_URL = "postgresql://username:password@localhost:5432/realestate"
```

Or use environment variables:

```bash
# Create .env file
echo "DATABASE_URL=postgresql://username:password@localhost:5432/realestate" > .env
```

### Step 3: Initialize Database Tables

```bash
# Run the initialization script
python init_db.py
```

Or use Alembic for migrations:

```bash
# Initialize Alembic
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migration
alembic upgrade head
```

## 🏃 Running the Application

### Development Mode

```bash
# Run with auto-reload
uvicorn database.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode

```bash
# Run with multiple workers
uvicorn database.main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at:

-   **API**: http://localhost:8000
-   **Swagger UI**: http://localhost:8000/api/docs
-   **ReDoc**: http://localhost:8000/api/redoc

## 📚 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "builder@example.com",
  "password": "securePassword123",
  "user_type": "builder",
  "builder_data": {
    "company_name": "ABC Construction",
    "license_number": "LIC123456",
    "phone": "+1234567890",
    "address": "123 Business St, City, State"
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "builder@example.com",
  "password": "securePassword123",
  "user_type": "builder"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

### Project Endpoints

#### Get All Projects

```http
GET /api/projects?page=1&limit=10&city=Bangalore&status=construction
```

#### Get Project by ID

```http
GET /api/projects/{project_id}
```

#### Create Project (Builder Only)

```http
POST /api/projects
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "builder_id": 1,
  "project_name": "Green Valley Residency",
  "project_type": "residential",
  "location_address": "123 Green Valley Road",
  "location_city": "Bangalore",
  "location_state": "Karnataka",
  "location_zipcode": "560001",
  "total_units": 150,
  "available_units": 150,
  "price_range_min": 5500000,
  "price_range_max": 12000000
}
```

#### Update Project (Builder Only)

```http
PATCH /api/projects/{project_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "construction",
  "available_units": 140
}
```

### Unit Endpoints

#### Get Units by Project

```http
GET /api/projects/{project_id}/units
```

#### Create Unit (Builder Only)

```http
POST /api/units
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "project_id": 1,
  "unit_number": "A-101",
  "unit_type": "2BHK",
  "floor_number": 1,
  "area_sqft": 1200.00,
  "price": 7500000,
  "bathrooms": 2
}
```

### Booking Endpoints

#### Create Booking (Customer Only)

```http
POST /api/bookings
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "customer_id": 1,
  "unit_id": 101,
  "total_amount": 7500000,
  "token_amount": 500000,
  "payment_plan": "installments"
}
```

#### Get Customer Bookings

```http
GET /api/bookings/customer/{customer_id}
Authorization: Bearer <access_token>
```

### Appointment Endpoints

#### Create Appointment

```http
POST /api/appointments
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "customer_id": 1,
  "project_id": 1,
  "appointment_type": "site_visit",
  "appointment_date": "2025-10-15T10:00:00Z",
  "meeting_location": "site",
  "created_by": "customer"
}
```

#### Get Customer Appointments

```http
GET /api/appointments/customer/{customer_id}
Authorization: Bearer <access_token>
```

#### Get Project Appointments (Builder)

```http
GET /api/appointments/project/{project_id}
Authorization: Bearer <access_token>
```

#### Update Appointment Status

```http
PATCH /api/appointments/{appointment_id}/status
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "confirmed"  // pending, confirmed, completed, cancelled
}
```

#### Get All Appointments (Builder - All Projects)

```http
GET /api/appointments?page=1&limit=10&status=confirmed&type=site_visit
Authorization: Bearer <access_token>
```

**Query Parameters:**

-   `page` - Page number (default: 1)
-   `limit` - Items per page (default: 10)
-   `status` - Filter by status: pending, confirmed, completed, cancelled
-   `type` - Filter by type: site_visit, virtual_tour, design_review, progress_update, documentation

### Message Endpoints

#### Get Conversations

```http
GET /api/messages/conversations
Authorization: Bearer <access_token>
```

**Response:**

```json
[
    {
        "id": 1,
        "customer_id": 101,
        "customer_name": "John Smith",
        "project_id": 1,
        "project_name": "Sunset Residences",
        "last_message": "When can I schedule the site visit?",
        "last_message_time": "2024-10-08T14:30:00Z",
        "unread_count": 2
    }
]
```

#### Get Messages in Conversation

```http
GET /api/messages/conversation/{customer_id}/{project_id}
Authorization: Bearer <access_token>
```

#### Send Message

```http
POST /api/messages
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "recipient_id": 101,
  "project_id": 1,
  "content": "Hello! I'd be happy to schedule a site visit.",
  "attachment_url": "https://example.com/file.pdf"  // optional
}
```

#### Mark Messages as Read

```http
PATCH /api/messages/conversation/{conversation_id}/read
Authorization: Bearer <access_token>
```

#### Get All Messages (Paginated)

```http
GET /api/messages?page=1&limit=20&conversation_id=1
Authorization: Bearer <access_token>
```

### Booking Management (Builder Endpoints)

#### Get All Bookings (Builder)

```http
GET /api/builder/bookings?page=1&limit=10&status=active&project_id=1
Authorization: Bearer <access_token>
```

**Query Parameters:**

-   `page` - Page number (default: 1)
-   `limit` - Items per page (default: 10)
-   `status` - Filter by status: pending, active, completed, cancelled
-   `project_id` - Filter by specific project

**Response:**

```json
{
    "total": 45,
    "page": 1,
    "limit": 10,
    "bookings": [
        {
            "id": 1,
            "booking_number": "BK-001",
            "customer": {
                "id": 101,
                "name": "John Smith",
                "email": "john@example.com",
                "phone": "+1234567890"
            },
            "project": {
                "id": 1,
                "name": "Sunset Residences"
            },
            "unit": {
                "id": 204,
                "number": "A-204",
                "type": "2BHK"
            },
            "total_amount": 7500000,
            "paid_amount": 2000000,
            "pending_amount": 5500000,
            "payment_plan": "installments",
            "booking_date": "2024-09-15",
            "status": "active",
            "payment_progress": 26.67
        }
    ]
}
```

#### Get Booking Details

```http
GET /api/bookings/{booking_id}
Authorization: Bearer <access_token>
```

#### Update Booking Status

```http
PATCH /api/bookings/{booking_id}/status
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "active"  // pending, active, completed, cancelled
}
```

#### Get Booking Payments

```http
GET /api/bookings/{booking_id}/payments
Authorization: Bearer <access_token>
```

#### Record Payment

```http
POST /api/payments
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "booking_id": 1,
  "payment_type": "token",
  "amount": 500000,
  "payment_method": "bank_transfer",
  "transaction_id": "TXN123456",
  "payment_date": "2024-10-08"
}
```

### Progress Tracking Endpoints

#### Get Project Progress

```http
GET /api/projects/{project_id}/progress
```

#### Get Construction Updates

```http
GET /api/projects/{project_id}/updates?limit=10
```

### Notification Endpoints

#### Get User Notifications

```http
GET /api/notifications?page=1&limit=10&is_read=false
Authorization: Bearer <access_token>
```

#### Mark Notification as Read

```http
PATCH /api/notifications/{notification_id}/read
Authorization: Bearer <access_token>
```

## 🏗️ Architecture Overview

### Database Models (15 Tables)

1. **users** - Core authentication
2. **builders** - Builder profiles
3. **customers** - Customer profiles
4. **projects** - Property projects
5. **units** - Individual apartments/units
6. **bookings** - Property bookings
7. **payments** - Payment transactions
8. **appointments** - Site visits & meetings
9. **project_progress** - Construction phases
10. **construction_updates** - Progress updates
11. **messages** - Internal messaging
12. **change_requests** - Customization requests
13. **models_3d** - 3D model files
14. **notifications** - User notifications
15. **system_settings** - App configuration

### Key Design Patterns

#### 1. Repository Pattern (CRUD)

All database operations are abstracted in `crud.py`:

```python
# Instead of direct queries in routes
project = crud.get_project_by_id(db, project_id)
```

#### 2. Dependency Injection

FastAPI's dependency system for database sessions and auth:

```python
@app.get("/api/projects")
def get_projects(db: Session = Depends(get_db)):
    return crud.get_projects(db)
```

#### 3. Role-Based Access Control

Protected routes with role requirements:

```python
@app.post("/api/projects")
def create_project(
    current_user: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    # Only builders can access
```

#### 4. Schema Validation

Pydantic ensures type safety:

```python
class ProjectCreate(ProjectBase):
    builder_id: int  # Required
    total_units: int  # Auto-validated
```

## 🔐 Security

-   **Password Hashing**: Bcrypt with salt rounds
-   **JWT Tokens**: HS256 algorithm with expiration
-   **Role-Based Access**: Builder/Customer separation
-   **SQL Injection Prevention**: SQLAlchemy ORM
-   **CORS**: Configured for Next.js frontend

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=database

# Run specific test file
pytest tests/test_crud.py
```

## 📝 Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/realestate

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password
```

## 📊 Database Relationships

```
User (1) ─── (1) Builder ─── (n) Projects ─── (n) Units
User (1) ─── (1) Customer ─── (n) Bookings ─── (1) Unit
                           └── (n) Appointments ─── (1) Project
```

## 🚀 Deployment

### Using Docker

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements-full.txt .
RUN pip install -r requirements-full.txt

COPY . .

CMD ["uvicorn", "database.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# Build
docker build -t realestate-api .

# Run
docker run -p 8000:8000 realestate-api
```

### Using Gunicorn (Production)

```bash
pip install gunicorn

gunicorn database.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

## 📖 Additional Documentation

-   **[BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md)** - Comprehensive guide to models, schemas, and CRUD operations
-   **[DATABASE_SCHEMA.md](../DATABASE_SCHEMA.md)** - Complete database schema and API specifications
-   **Swagger UI** - http://localhost:8000/api/docs (after starting server)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues and questions:

-   Open an issue on GitHub
-   Email: support@buildcraft.com
-   Documentation: /api/docs

---

**Built with ❤️ using FastAPI**
