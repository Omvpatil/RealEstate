# FastAPI Backend Documentation - RealEstate Platform

## Table of Contents

1. [Overview](#overview)
2. [Database Architecture](#database-architecture)
3. [Models Explained](#models-explained)
4. [Schemas (Pydantic) Explained](#schemas-pydantic-explained)
5. [CRUD Operations Explained](#crud-operations-explained)
6. [Database Setup](#database-setup)
7. [API Implementation Guide](#api-implementation-guide)
8. [Authentication & Security](#authentication--security)

---

## Overview

This FastAPI backend implements a comprehensive real estate platform supporting:

-   **Builder Portal**: Project management, unit management, customer bookings
-   **Customer Portal**: Property browsing, bookings, appointments, progress tracking
-   **Communication**: Messaging, notifications, change requests
-   **3D Models**: Interactive property visualization
-   **Progress Tracking**: Construction updates and milestones

---

## Database Architecture

### Database Connection (`database.py`)

**Purpose**: Establishes connection to PostgreSQL database and manages sessions.

**Key Components**:

```python
# Database URL - PostgreSQL connection string
DATABASE_URL = "postgresql://users:password@localhost:5432/realestate"

# SQLAlchemy Engine - Manages database connections
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# SessionLocal - Factory for creating database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base - Base class for all ORM models
Base = declarative_base()

# get_db() - Dependency injection for routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**Usage in FastAPI Routes**:

```python
@app.get("/projects")
def get_projects(db: Session = Depends(get_db)):
    # db session is automatically provided and closed
    return crud.get_projects(db)
```

---

## Models Explained

Models define the database schema using SQLAlchemy ORM. Each model represents a table.

### 1. **User Model** (`models.User`)

**Purpose**: Core authentication table for all users (builders and customers)

**Key Fields**:

-   `id`: Primary key
-   `email`: Unique email for login
-   `password_hash`: Hashed password (never store plain text!)
-   `user_type`: ENUM - "builder" or "customer"
-   `is_active`: Account active status
-   `is_verified`: Email verification status
-   `last_login`: Track user activity

**Relationships**:

-   One-to-One with `Builder` (if user_type = builder)
-   One-to-One with `Customer` (if user_type = customer)
-   One-to-Many with `Message` (sent and received)
-   One-to-Many with `Notification`

**Design Pattern**: Single Table Inheritance - One user table with type discriminator

---

### 2. **Builder Model** (`models.Builder`)

**Purpose**: Extended profile for builder users

**Key Fields**:

-   `user_id`: Foreign key to User (CASCADE delete)
-   `company_name`: Business name
-   `license_number`: Unique builder license
-   `rating`: Decimal(3,2) - e.g., 4.75/5.00
-   `total_projects`: Counter field
-   `verified`: Admin verification flag

**Relationships**:

-   Belongs to `User`
-   Has many `Projects`

**Business Logic**:

-   When a project is created, increment `total_projects`
-   Calculate `rating` from customer reviews

---

### 3. **Customer Model** (`models.Customer`)

**Purpose**: Extended profile for customer users

**Key Fields**:

-   `first_name`, `last_name`: Personal details
-   `preferred_contact_method`: ENUM - email/phone/both
-   `date_of_birth`: Optional, for age verification

**Relationships**:

-   Belongs to `User`
-   Has many `Bookings`
-   Has many `Appointments`

---

### 4. **Project Model** (`models.Project`)

**Purpose**: Real estate project/property listings

**Key Fields**:

-   `builder_id`: Foreign key to Builder
-   `project_name`: "Green Valley Residency"
-   `project_type`: ENUM - residential/commercial/mixed
-   `status`: ENUM - planning/construction/completed/delivered
-   `location_*`: Address fields with city/state indexes
-   `latitude`, `longitude`: For maps (Decimal for precision)
-   `total_units`, `available_units`: Inventory tracking
-   `price_range_min/max`: Filter optimization
-   `amenities`: JSON array - ["gym", "pool", "parking"]
-   `images`, `floor_plans`: JSON arrays of URLs
-   `is_featured`: Boolean for homepage display

**Indexes**:

-   `builder_id`, `status`, `location_city`, `price_range_min/max`
-   Optimized for filtering queries

**Relationships**:

-   Belongs to `Builder`
-   Has many `Units`
-   Has many `Appointments`
-   Has many `ProjectProgress` phases
-   Has many `ConstructionUpdate`
-   Has many `Model3D`

---

### 5. **Unit Model** (`models.Unit`)

**Purpose**: Individual apartments/units within a project

**Key Fields**:

-   `unit_number`: "A-101" (unique per project)
-   `unit_type`: ENUM - 1BHK/2BHK/3BHK/studio/penthouse
-   `area_sqft`: Decimal for precise measurements
-   `price`: Decimal(15,2) for currency
-   `status`: ENUM - available/booked/sold/reserved
-   `facing`: ENUM - north/south/east/west/etc
-   `features`: JSON - ["modular_kitchen", "false_ceiling"]

**Unique Constraint**: (project_id, unit_number)

**Relationships**:

-   Belongs to `Project`
-   Has many `Bookings` (history of bookings)
-   Has many `Model3D`

---

### 6. **Booking Model** (`models.Booking`)

**Purpose**: Customer property bookings/purchases

**Key Fields**:

-   `customer_id`, `unit_id`: Foreign keys
-   `booking_status`: ENUM workflow
    -   inquiry → site_visit_scheduled → token_paid → booking_confirmed → cancelled
-   `token_amount`: Initial payment
-   `total_amount`: Full price
-   `payment_plan`: ENUM - full_payment/installments/loan
-   `loan_approved`: Boolean
-   `loan_amount`: Bank loan amount
-   `special_requests`: Text field for customizations

**Relationships**:

-   Belongs to `Customer`
-   Belongs to `Unit`
-   Has many `Payments`
-   Has many `ChangeRequests`
-   Has many `Messages`

**Business Logic**:

-   On creation: Update unit.status to "booked"
-   On creation: Decrement project.available_units
-   On cancellation: Reverse above changes

---

### 7. **Payment Model** (`models.Payment`)

**Purpose**: Track all payment transactions

**Key Fields**:

-   `booking_id`: Foreign key
-   `payment_type`: ENUM - token/installment/final/maintenance/penalty
-   `amount`: Decimal(15,2)
-   `payment_method`: ENUM - cash/cheque/bank_transfer/online/loan
-   `payment_status`: ENUM - pending/completed/failed/refunded
-   `transaction_id`: Payment gateway reference
-   `due_date`, `paid_date`: Tracking
-   `receipt_url`: PDF receipt link

**Indexes**: booking_id, payment_type, payment_status, due_date

**Use Cases**:

-   Installment schedules
-   Payment reminders (due_date index)
-   Transaction history
-   Receipt generation

---

### 8. **Appointment Model** (`models.Appointment`)

**Purpose**: Site visits and meetings

**Key Fields**:

-   `appointment_type`: ENUM - site_visit/consultation/documentation/handover
-   `appointment_date`: DateTime with timezone
-   `duration_minutes`: Default 60
-   `status`: ENUM - scheduled/confirmed/completed/cancelled/rescheduled
-   `meeting_location`: ENUM - site/office/online
-   `attendees`: JSON - ["customer", "builder_representative"]
-   `reschedule_reason`: Audit trail

**Relationships**:

-   Belongs to `Customer`
-   Belongs to `Project`

**Indexes**: customer_id, project_id, appointment_date, status

---

### 9. **ProjectProgress Model** (`models.ProjectProgress`)

**Purpose**: Construction milestone tracking

**Key Fields**:

-   `phase_name`: "Foundation", "Structure", "Plumbing"
-   `start_date`, `expected_end_date`, `actual_end_date`: Timeline
-   `progress_percentage`: Decimal(5,2) - e.g., 78.50%
-   `status`: ENUM - not_started/in_progress/completed/delayed
-   `milestone_images`: JSON array of image URLs
-   `contractor_notes`: Internal notes
-   `customer_visible`: Boolean - hide internal phases

**Relationships**:

-   Belongs to `Project`

**Use Case**: Show construction timeline to customers

---

### 10. **ConstructionUpdate Model** (`models.ConstructionUpdate`)

**Purpose**: News feed of construction progress

**Key Fields**:

-   `update_title`: "5th Floor Slab Completed"
-   `update_content`: Detailed description
-   `update_type`: ENUM - milestone/delay/general/safety/quality
-   `priority`: ENUM - low/medium/high/critical
-   `images`, `videos`: JSON arrays
-   `weather_impact`: Boolean - weather delays
-   `estimated_delay_days`: Integer
-   `posted_by`: Foreign key to User (builder)
-   `tags`: JSON - ["foundation", "plumbing"]

**Indexes**: project_id, update_type, priority, created_at

---

### 11. **Message Model** (`models.Message`)

**Purpose**: Internal messaging system

**Key Fields**:

-   `sender_id`, `recipient_id`: User foreign keys
-   `project_id`, `booking_id`: Context (optional)
-   `subject`, `message_content`: Email-like format
-   `message_type`: ENUM - inquiry/complaint/update/general
-   `priority`: ENUM - low/medium/high
-   `is_read`: Boolean
-   `attachments`: JSON array of file URLs
-   `parent_message_id`: For threading/replies
-   `read_at`: Timestamp when read

**Self-Referencing Relationship**: parent_message_id → Message.id

**Indexes**: sender_id, recipient_id, project_id, is_read, created_at

---

### 12. **ChangeRequest Model** (`models.ChangeRequest`)

**Purpose**: Unit customization requests

**Key Fields**:

-   `booking_id`: Foreign key
-   `request_type`: ENUM - layout/fixtures/finishes/electrical/plumbing/other
-   `request_title`: "Upgrade bathroom fixtures"
-   `current_specification`: What exists now
-   `requested_specification`: What customer wants
-   `estimated_cost`, `final_cost`: Builder estimates
-   `estimated_timeline_days`: Days to complete
-   `status`: ENUM - submitted/under_review/approved/rejected/completed
-   `builder_response`: Response text
-   `rejection_reason`: If rejected
-   `approval_date`, `completion_date`: Audit trail

**Workflow**:

1. Customer submits: status = "submitted"
2. Builder reviews: status = "under_review"
3. Builder approves/rejects: status = "approved"/"rejected"
4. Work completed: status = "completed"

---

### 13. **Model3D Model** (`models.Model3D`)

**Purpose**: 3D model files for visualization

**Key Fields**:

-   `project_id`, `unit_id`: Can belong to project OR unit
-   `model_name`: "Project Overview Model"
-   `model_type`: ENUM - project_overview/unit_interior/floor_plan/amenities
-   `file_url`: CDN/S3 URL to .glb/.obj file
-   `file_size`: Bytes (for download estimates)
-   `file_format`: ENUM - obj/fbx/gltf/glb/blend
-   `thumbnail_url`: Preview image
-   `is_interactive`: Boolean - can user interact?
-   `viewer_config`: JSON - camera positions, lighting
-   `access_level`: ENUM - public/customers_only/booked_customers
-   `version`: "1.0" for version control

**Use Case**: 3D property visualization in browser

---

### 14. **Notification Model** (`models.Notification`)

**Purpose**: User notifications system

**Key Fields**:

-   `notification_type`: ENUM - booking_update/payment_due/appointment_reminder/etc
-   `title`: "Payment Due Reminder"
-   `message`: Full notification text
-   `related_entity_type`, `related_entity_id`: Link to booking/project/etc
-   `priority`: ENUM - low/medium/high
-   `is_read`, `is_sent`: Status flags
-   `send_via`: JSON - ["email", "sms", "push"]
-   `scheduled_send_time`: For delayed notifications
-   `action_url`: Deep link - "/customer/bookings/1001"

**Indexes**: user_id, notification_type, is_read, created_at

**Multi-Channel**: Can send via email, SMS, push, or in-app

---

### 15. **SystemSetting Model** (`models.SystemSetting`)

**Purpose**: Application configuration

**Key Fields**:

-   `setting_key`: Unique identifier
-   `setting_value`: JSON - flexible storage
-   `setting_type`: string/number/boolean/json/array
-   `category`: "payment", "notification", "general"
-   `is_public`: Boolean - expose to frontend?

**Examples**:

```json
{
    "setting_key": "payment.token_percentage",
    "setting_value": { "value": 10 },
    "setting_type": "number",
    "category": "payment"
}
```

---

## Schemas (Pydantic) Explained

Pydantic schemas validate input/output data and serialize database models to JSON.

### Schema Patterns

#### 1. **Base Schema**

Contains common fields shared between Create and Response

```python
class ProjectBase(BaseModel):
    project_name: str
    description: Optional[str] = None
    # ... common fields
```

#### 2. **Create Schema**

For POST requests - what client sends

```python
class ProjectCreate(ProjectBase):
    builder_id: int  # Additional required field
```

#### 3. **Update Schema**

For PATCH/PUT - all fields optional

```python
class ProjectUpdate(BaseModel):
    project_name: Optional[str] = None
    status: Optional[ProjectStatus] = None
    # ... all optional
```

#### 4. **Response Schema**

For GET responses - includes DB-generated fields

```python
class ProjectResponse(ProjectBase):
    id: int  # Generated by DB
    created_at: datetime  # Auto-timestamp
    builder: Optional[BuilderResponse] = None  # Nested data

    class Config:
        from_attributes = True  # Enable ORM mode
```

### Key Concepts

**1. Type Safety**: Pydantic validates types at runtime

```python
project = ProjectCreate(
    project_name="Test",  # ✓ str
    total_units="50"  # ✗ Will raise validation error (not int)
)
```

**2. Optional Fields**: Use `Optional[Type]` or `Type | None`

```python
description: Optional[str] = None  # Can be null
phone: str  # Required, cannot be null
```

**3. Nested Schemas**: Include related data

```python
class BookingResponse(BookingBase):
    unit: Optional[UnitResponse] = None  # Include unit data
```

**4. Enums**: Type-safe choices

```python
user_type: UserType  # Only accepts UserType.BUILDER or UserType.CUSTOMER
```

**5. Custom Validation**: Use validators

```python
@validator('email')
def email_must_be_lowercase(cls, v):
    return v.lower()
```

---

## CRUD Operations Explained

CRUD functions encapsulate all database operations. They are pure data access functions.

### Design Principles

1. **Separation of Concerns**: Business logic separate from routes
2. **Reusability**: Used by multiple routes
3. **Type Safety**: Use Pydantic schemas for validation
4. **Transaction Management**: Commit on success, rollback on error

### Common Patterns

#### 1. **Create Operations**

```python
def create_project(db: Session, project: schemas.ProjectCreate) -> models.Project:
    # Convert Pydantic schema to dict
    db_project = models.Project(**project.dict())

    # Add to session
    db.add(db_project)

    # Commit to database
    db.commit()

    # Refresh to get DB-generated fields (id, timestamps)
    db.refresh(db_project)

    return db_project
```

**With Side Effects** (e.g., creating booking):

```python
def create_booking(db: Session, booking: schemas.BookingCreate) -> models.Booking:
    db_booking = models.Booking(**booking.dict())
    db.add(db_booking)

    # Side effect 1: Update unit status
    db.query(models.Unit).filter(models.Unit.id == booking.unit_id).update({
        "status": models.UnitStatus.BOOKED
    })

    # Side effect 2: Decrement available units
    unit = get_unit_by_id(db, booking.unit_id)
    db.query(models.Project).filter(models.Project.id == unit.project_id).update({
        "available_units": models.Project.available_units - 1
    })

    db.commit()
    db.refresh(db_booking)
    return db_booking
```

#### 2. **Read Operations**

**Simple Get by ID**:

```python
def get_user_by_id(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()
```

**With Relationships (Eager Loading)**:

```python
def get_project_by_id(db: Session, project_id: int) -> Optional[models.Project]:
    return db.query(models.Project).options(
        joinedload(models.Project.builder)  # Prevent N+1 queries
    ).filter(models.Project.id == project_id).first()
```

**Filtering & Pagination**:

```python
def get_projects(db: Session, filters: schemas.ProjectFilter) -> Dict[str, Any]:
    # Start with base query
    query = db.query(models.Project).options(joinedload(models.Project.builder))

    # Apply filters conditionally
    if filters.status:
        query = query.filter(models.Project.status == filters.status)
    if filters.city:
        query = query.filter(models.Project.location_city.ilike(f"%{filters.city}%"))
    if filters.min_price:
        query = query.filter(models.Project.price_range_min >= filters.min_price)

    # Get total count BEFORE pagination
    total_items = query.count()

    # Apply pagination
    offset = (filters.page - 1) * filters.limit
    projects = query.offset(offset).limit(filters.limit).all()

    # Return data + metadata
    return {
        "projects": projects,
        "pagination": create_pagination_metadata(filters.page, filters.limit, total_items)
    }
```

#### 3. **Update Operations**

**Partial Update** (PATCH):

```python
def update_project(db: Session, project_id: int, project_update: schemas.ProjectUpdate) -> models.Project:
    # Only update fields that were provided (exclude_unset=True)
    db.query(models.Project).filter(models.Project.id == project_id).update(
        project_update.dict(exclude_unset=True)
    )
    db.commit()
    return get_project_by_id(db, project_id)
```

**Status Update** (common pattern):

```python
def update_booking_status(db: Session, booking_id: int, status: models.BookingStatus) -> models.Booking:
    db.query(models.Booking).filter(models.Booking.id == booking_id).update({
        "booking_status": status
    })
    db.commit()
    return get_booking_by_id(db, booking_id)
```

#### 4. **Delete Operations**

```python
def delete_project(db: Session, project_id: int) -> bool:
    result = db.query(models.Project).filter(models.Project.id == project_id).delete()
    db.commit()
    return result > 0  # Returns True if deleted
```

**Soft Delete** (preferred):

```python
def soft_delete_project(db: Session, project_id: int) -> models.Project:
    db.query(models.Project).filter(models.Project.id == project_id).update({
        "is_active": False,
        "deleted_at": datetime.utcnow()
    })
    db.commit()
    return get_project_by_id(db, project_id)
```

### Specialized Patterns

#### **Complex Queries** (Conversations):

```python
def get_conversations(db: Session, user_id: int) -> List[Dict[str, Any]]:
    # Get all messages involving user
    messages = db.query(models.Message).options(
        joinedload(models.Message.sender),
        joinedload(models.Message.recipient)
    ).filter(
        or_(  # OR condition
            models.Message.sender_id == user_id,
            models.Message.recipient_id == user_id
        )
    ).order_by(desc(models.Message.created_at)).all()

    return messages
```

#### **Aggregations**:

```python
def get_booking_statistics(db: Session, customer_id: int) -> Dict[str, Any]:
    total_bookings = db.query(models.Booking).filter(
        models.Booking.customer_id == customer_id
    ).count()

    total_spent = db.query(func.sum(models.Payment.amount)).join(models.Booking).filter(
        models.Booking.customer_id == customer_id,
        models.Payment.payment_status == models.PaymentStatus.COMPLETED
    ).scalar() or 0

    return {
        "total_bookings": total_bookings,
        "total_spent": total_spent
    }
```

---

## Database Setup

### 1. Install Dependencies

```bash
pip install sqlalchemy psycopg2-binary alembic pydantic[email] passlib[bcrypt] python-jose[cryptography]
```

### 2. Create Database

```bash
# PostgreSQL
createdb realestate

# Or using psql
psql -U postgres
CREATE DATABASE realestate;
```

### 3. Initialize Alembic (Migrations)

```bash
# Initialize
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Initial migration"

# Apply migration
alembic upgrade head
```

### 4. Create Tables Programmatically

```python
# init_db.py
from database.database import engine, Base
from database import models

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
```

Run:

```bash
python init_db.py
```

---

## API Implementation Guide

### 1. **Create FastAPI App** (`main.py`)

```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import crud, schemas, models
from database.database import get_db, engine

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="RealEstate API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
@app.post("/api/auth/register", response_model=schemas.TokenResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    db_user = crud.create_user(db, user)

    # Generate token (implement JWT)
    token = create_access_token(db_user.id)

    return {
        "access_token": token,
        "refresh_token": create_refresh_token(db_user.id),
        "token_type": "bearer",
        "expires_in": 3600,
        "user": db_user
    }

@app.get("/api/projects", response_model=schemas.ProjectListResponse)
def get_projects(
    page: int = 1,
    limit: int = 10,
    status: Optional[models.ProjectStatus] = None,
    city: Optional[str] = None,
    db: Session = Depends(get_db)
):
    filters = schemas.ProjectFilter(
        page=page,
        limit=limit,
        status=status,
        city=city
    )
    return crud.get_projects(db, filters)

@app.post("/api/bookings", response_model=schemas.BookingResponse)
def create_booking(
    booking: schemas.BookingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Verify customer owns the booking
    if booking.customer_id != current_user.customer.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Check unit availability
    unit = crud.get_unit_by_id(db, booking.unit_id)
    if not unit or unit.status != models.UnitStatus.AVAILABLE:
        raise HTTPException(status_code=400, detail="Unit not available")

    return crud.create_booking(db, booking)
```

### 2. **Authentication Middleware**

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

def create_access_token(user_id: int) -> str:
    to_encode = {"sub": str(user_id), "exp": datetime.utcnow() + timedelta(hours=1)}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = crud.get_user_by_id(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user
```

### 3. **Error Handling**

```python
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.status_code,
                "message": exc.detail
            },
            "timestamp": datetime.utcnow().isoformat(),
            "path": str(request.url)
        }
    )
```

---

## Authentication & Security

### Password Hashing

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
```

### JWT Tokens

```python
from jose import jwt
from datetime import datetime, timedelta

def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=1)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
```

### Role-Based Access Control

```python
def require_builder(current_user: models.User = Depends(get_current_user)):
    if current_user.user_type != models.UserType.BUILDER:
        raise HTTPException(status_code=403, detail="Builder access required")
    return current_user

@app.post("/api/projects", dependencies=[Depends(require_builder)])
def create_project(...):
    # Only builders can access
    pass
```

---

## Quick Start Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Create database
createdb realestate

# Initialize database
python init_db.py

# Run server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Access API docs
# http://localhost:8000/docs
```

---

## Testing Examples

```python
# test_crud.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import models, schemas, crud
from database.database import Base

# Test database
SQLALCHEMY_TEST_DATABASE_URL = "postgresql://test:test@localhost/test_realestate"
engine = create_engine(SQLALCHEMY_TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(bind=engine)

@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

def test_create_user(db):
    user_data = schemas.UserCreate(
        email="test@example.com",
        password="password123",
        user_type=models.UserType.CUSTOMER,
        customer_data=schemas.CustomerCreate(
            first_name="John",
            last_name="Doe",
            phone="1234567890"
        )
    )
    user = crud.create_user(db, user_data)
    assert user.email == "test@example.com"
    assert user.customer is not None
    assert user.customer.first_name == "John"
```

---

## Summary

This FastAPI backend provides:

✅ **Complete Database Schema**: 15 models covering all real estate platform needs
✅ **Type-Safe Schemas**: Pydantic validation for all inputs/outputs  
✅ **Comprehensive CRUD**: All database operations with optimizations  
✅ **Authentication**: JWT-based auth with password hashing  
✅ **Relationships**: Properly configured SQLAlchemy relationships  
✅ **Pagination**: Efficient data loading with metadata  
✅ **Filtering**: Dynamic query building  
✅ **Business Logic**: Side effects handled in CRUD layer  
✅ **Documentation**: Auto-generated API docs via FastAPI

**Next Steps**:

1. Implement remaining API routes
2. Add file upload for images/documents
3. Integrate payment gateway
4. Add email/SMS notifications
5. Implement WebSocket for real-time updates
6. Add caching (Redis)
7. Deploy to production

Happy Coding! 🚀
