# FastAPI Backend - Quick Reference Guide

## 📚 Overview of All Components

### 🗄️ Database Models (models.py)

| Model                  | Purpose                | Key Relationships                    |
| ---------------------- | ---------------------- | ------------------------------------ |
| **User**               | Core authentication    | → Builder (1:1), Customer (1:1)      |
| **Builder**            | Builder profile        | ← User, → Projects (1:n)             |
| **Customer**           | Customer profile       | ← User, → Bookings (1:n)             |
| **Project**            | Property projects      | ← Builder, → Units (1:n)             |
| **Unit**               | Individual apartments  | ← Project, → Bookings (1:n)          |
| **Booking**            | Property bookings      | ← Customer, ← Unit, → Payments (1:n) |
| **Payment**            | Payment transactions   | ← Booking                            |
| **Appointment**        | Site visits & meetings | ← Customer, ← Project                |
| **ProjectProgress**    | Construction phases    | ← Project                            |
| **ConstructionUpdate** | Progress news feed     | ← Project                            |
| **Message**            | Internal messaging     | ← User (sender), ← User (recipient)  |
| **ChangeRequest**      | Customization requests | ← Booking                            |
| **Model3D**            | 3D visualization files | ← Project or Unit                    |
| **Notification**       | User notifications     | ← User                               |
| **SystemSetting**      | App configuration      | -                                    |

---

## 🎯 Pydantic Schemas (schemas.py)

### Schema Pattern for Each Model

```
ModelBase       → Common fields (shared by Create & Response)
ModelCreate     → For POST requests (what client sends)
ModelUpdate     → For PATCH/PUT requests (all optional)
ModelResponse   → For GET responses (includes DB fields like id, timestamps)
```

### Example: Project Schemas

```python
ProjectBase        # name, type, status, location, etc.
ProjectCreate      # ProjectBase + builder_id
ProjectUpdate      # All fields optional
ProjectResponse    # ProjectBase + id, created_at, builder (nested)
```

---

## 🔧 CRUD Operations (crud.py)

### Common CRUD Patterns

| Operation    | Function Pattern               | Example                       |
| ------------ | ------------------------------ | ----------------------------- |
| **Create**   | `create_X(db, x_data)`         | `create_project(db, project)` |
| **Read One** | `get_X_by_id(db, x_id)`        | `get_project_by_id(db, 1)`    |
| **Read All** | `get_Xs(db, filters)`          | `get_projects(db, filters)`   |
| **Update**   | `update_X(db, x_id, x_update)` | `update_project(db, 1, data)` |
| **Delete**   | `delete_X(db, x_id)`           | `delete_project(db, 1)`       |

### Specialized CRUD Functions

```python
# User
get_user_by_email(db, email)
update_user_last_login(db, user_id)
verify_password(plain, hashed)

# Builder
get_builder_by_user_id(db, user_id)

# Customer
get_customer_by_user_id(db, user_id)

# Project
get_projects_by_builder(db, builder_id)
get_projects(db, filters)  # With pagination

# Unit
get_units_by_project(db, project_id)
get_available_units_by_project(db, project_id)
update_unit_status(db, unit_id, status)

# Booking
get_bookings_by_customer(db, customer_id)
get_bookings_by_unit(db, unit_id)
update_booking_status(db, booking_id, status)

# Payment
get_payments_by_booking(db, booking_id)
get_pending_payments_by_customer(db, customer_id)

# Appointment
get_appointments_by_customer(db, customer_id)
get_appointments_by_project(db, project_id)

# Progress
get_progress_by_project(db, project_id)
get_updates_by_project(db, project_id, limit)

# Message
get_messages_for_user(db, user_id)
get_conversations(db, user_id)
mark_message_as_read(db, message_id)

# Notification
get_notifications_for_user(db, user_id, filters)
mark_notification_as_read(db, notification_id)
mark_all_notifications_as_read(db, user_id)
```

---

## 🛣️ API Routes (main.py)

### Authentication Routes

```python
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # Login & get JWT token
GET    /api/auth/me             # Get current user info
```

### Project Routes

```python
GET    /api/projects                    # List all projects (with filters)
GET    /api/projects/{project_id}       # Get single project
POST   /api/projects                    # Create project (builder only)
PATCH  /api/projects/{project_id}       # Update project (builder only)
```

### Unit Routes

```python
GET    /api/projects/{project_id}/units  # Get units for project
POST   /api/units                         # Create unit (builder only)
```

### Booking Routes

```python
POST   /api/bookings                          # Create booking (customer only)
GET    /api/bookings/customer/{customer_id}   # Get customer bookings
GET    /api/builder/bookings                  # Get all bookings (builder)
GET    /api/bookings/{booking_id}             # Get booking details
PATCH  /api/bookings/{booking_id}/status      # Update booking status
GET    /api/bookings/{booking_id}/payments    # Get booking payments
POST   /api/payments                          # Record payment
```

### Appointment Routes

```python
POST   /api/appointments                          # Create appointment
GET    /api/appointments/customer/{customer_id}   # Get customer appointments
GET    /api/appointments/project/{project_id}     # Get project appointments (builder)
GET    /api/appointments                          # Get all appointments (builder)
PATCH  /api/appointments/{appointment_id}/status  # Update appointment status
```

### Message Routes

```python
GET    /api/messages/conversations                     # Get all conversations
GET    /api/messages/conversation/{customer_id}/{project_id}  # Get conversation messages
POST   /api/messages                                    # Send message
PATCH  /api/messages/conversation/{conversation_id}/read  # Mark as read
GET    /api/messages                                    # Get all messages (paginated)
```

### Progress Routes

```python
GET    /api/projects/{project_id}/progress  # Get progress phases
GET    /api/projects/{project_id}/updates   # Get construction updates
```

### Notification Routes

```python
GET    /api/notifications                        # Get user notifications
PATCH  /api/notifications/{id}/read              # Mark as read
```

### Utility Routes

```python
GET    /health                   # Health check
GET    /                         # Root info
GET    /api/docs                 # Swagger UI
GET    /api/redoc                # ReDoc
```

---

## 🔐 Authentication Flow

### 1. Register User

```python
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "user_type": "customer",  # or "builder"
  "customer_data": {        # or "builder_data"
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890"
  }
}

# Response
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": { ... }
}
```

### 2. Login

```python
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123",
  "user_type": "customer"
}

# Response: Same as register
```

### 3. Use Token

```python
GET /api/auth/me
Authorization: Bearer eyJ...

# Response: User object
```

---

## 🏗️ Database Connection (database.py)

```python
from database.database import get_db

# In routes
@app.get("/projects")
def get_projects(db: Session = Depends(get_db)):
    return crud.get_projects(db)
    # db is automatically provided and closed
```

---

## 🔒 Role-Based Access Control

### Require Builder Access

```python
from database.main import require_builder

@app.post("/api/projects")
def create_project(
    current_user: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    # Only builders can access this route
    pass
```

### Require Customer Access

```python
from database.main import require_customer

@app.post("/api/bookings")
def create_booking(
    current_user: models.User = Depends(require_customer),
    db: Session = Depends(get_db)
):
    # Only customers can access this route
    pass
```

### Require Any Authenticated User

```python
from database.main import get_current_user

@app.get("/api/profile")
def get_profile(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Any authenticated user can access
    pass
```

---

## 📊 Enums Reference

### UserType

-   `BUILDER`
-   `CUSTOMER`

### ProjectType

-   `RESIDENTIAL`
-   `COMMERCIAL`
-   `MIXED`

### ProjectStatus

-   `PLANNING`
-   `CONSTRUCTION`
-   `COMPLETED`
-   `DELIVERED`

### UnitType

-   `ONE_BHK` (1BHK)
-   `TWO_BHK` (2BHK)
-   `THREE_BHK` (3BHK)
-   `FOUR_BHK_PLUS` (4BHK+)
-   `STUDIO`
-   `PENTHOUSE`

### UnitStatus

-   `AVAILABLE`
-   `BOOKED`
-   `SOLD`
-   `RESERVED`

### BookingStatus

-   `INQUIRY`
-   `SITE_VISIT_SCHEDULED`
-   `TOKEN_PAID`
-   `BOOKING_CONFIRMED`
-   `CANCELLED`

### PaymentType

-   `TOKEN`
-   `INSTALLMENT`
-   `FINAL`
-   `MAINTENANCE`
-   `PENALTY`

### PaymentStatus

-   `PENDING`
-   `COMPLETED`
-   `FAILED`
-   `REFUNDED`

### AppointmentType

-   `SITE_VISIT`
-   `CONSULTATION`
-   `DOCUMENTATION`
-   `HANDOVER`

### AppointmentStatus

-   `SCHEDULED`
-   `CONFIRMED`
-   `COMPLETED`
-   `CANCELLED`
-   `RESCHEDULED`

### ProgressStatus

-   `NOT_STARTED`
-   `IN_PROGRESS`
-   `COMPLETED`
-   `DELAYED`

### NotificationType

-   `BOOKING_UPDATE`
-   `PAYMENT_DUE`
-   `APPOINTMENT_REMINDER`
-   `PROGRESS_UPDATE`
-   `MESSAGE_RECEIVED`
-   `CHANGE_REQUEST_UPDATE`

---

## 🧪 Testing Examples

### Test User Creation

```python
def test_create_user(db):
    user = schemas.UserCreate(
        email="test@test.com",
        password="password",
        user_type=models.UserType.CUSTOMER,
        customer_data=schemas.CustomerCreate(
            first_name="Test",
            last_name="User",
            phone="1234567890"
        )
    )

    created_user = crud.create_user(db, user)
    assert created_user.email == "test@test.com"
    assert created_user.customer is not None
```

### Test API Endpoint

```python
def test_get_projects(client):
    response = client.get("/api/projects")
    assert response.status_code == 200
    data = response.json()
    assert "projects" in data
    assert "pagination" in data
```

---

## 🚀 Quick Start Commands

```bash
# Setup
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements-full.txt

# Database
createdb realestate
python init_database.py

# Run Server
uvicorn database.main:app --reload --port 8000

# Access
http://localhost:8000/api/docs  # Swagger UI
http://localhost:8000/api/redoc # ReDoc
```

---

## 🐛 Common Issues & Solutions

### Issue: Import Errors

```bash
# Solution: Ensure you're in the right directory
cd /path/to/RealEstate/fastapi
python -m database.main
```

### Issue: Database Connection Error

```python
# Check database.py
DATABASE_URL = "postgresql://user:pass@localhost:5432/realestate"
# Ensure PostgreSQL is running and database exists
```

### Issue: JWT Token Invalid

```python
# Check SECRET_KEY in main.py
SECRET_KEY = "your-secret-key-change-in-production"
# Ensure it's the same across server restarts
```

### Issue: CORS Errors

```python
# Update CORS origins in main.py
allow_origins=["http://localhost:3000", "http://localhost:3001"]
```

---

## 📝 Environment Variables

Create `.env` file:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/realestate
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Load in `database.py`:

```python
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
```

---

## 🔍 Debugging Tips

### Enable SQL Query Logging

```python
# database.py
engine = create_engine(
    DATABASE_URL,
    echo=True  # Print all SQL queries
)
```

### Print Request/Response

```python
# main.py
@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    print(f"Response: {response.status_code}")
    return response
```

---

## 📚 Additional Resources

-   **FastAPI Docs**: https://fastapi.tiangolo.com
-   **SQLAlchemy Docs**: https://docs.sqlalchemy.org
-   **Pydantic Docs**: https://docs.pydantic.dev
-   **PostgreSQL Docs**: https://www.postgresql.org/docs

---

**Happy Coding! 🚀**
