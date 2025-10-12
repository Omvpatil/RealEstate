# 🏗️ FastAPI Modular Architecture Guide

## 📁 New Project Structure

```
fastapi/
├── main.py                    # 🎯 Main application entry point (NEW - ROOT LEVEL)
├── database/
│   ├── __init__.py
│   ├── auth.py               # 🔐 Authentication utilities (NEW)
│   ├── database.py           # Database configuration
│   ├── models.py             # SQLAlchemy models
│   ├── schemas.py            # Pydantic schemas
│   ├── crud.py               # Database operations
│   └── main.py               # ⚠️ Legacy file (keep for reference)
├── routes/                    # 📍 Route modules (NEW)
│   ├── __init__.py
│   ├── auth.py               # Authentication routes
│   ├── projects.py           # Project routes
│   ├── units.py              # Unit routes
│   ├── bookings.py           # Booking routes
│   ├── appointments.py       # Appointment routes
│   ├── messages.py           # Message routes
│   ├── payments.py           # Payment routes
│   └── notifications.py      # Notification routes
├── requirements.txt
├── pyproject.toml
└── README.md
```

---

## 🚀 How to Run the Application

### Option 1: Using the new main.py (Recommended)

```bash
# From the fastapi directory
cd /home/om_patil/Desktop/Codes/projects/RealEstate/fastapi

# Run with uvicorn
uvicorn main:app --reload --port 8000

# Or run directly with Python
python main.py
```

### Option 2: Using the legacy database/main.py

```bash
# From the fastapi directory
cd /home/om_patil/Desktop/Codes/projects/RealEstate/fastapi

# Run the legacy main file
uvicorn database.main:app --reload --port 8000
```

---

## 🔄 What Changed?

### ✅ New Architecture Benefits

1. **Modular Routes**: Each domain (auth, projects, bookings, etc.) has its own route file
2. **Centralized Auth**: Authentication utilities are in `database/auth.py`
3. **Clean Main File**: The root `main.py` is clean and only handles app setup
4. **Easy to Extend**: Adding new features is now straightforward
5. **Better Organization**: Related code is grouped together
6. **Maintainability**: Easier to find and update code

### 📂 File Breakdown

#### **1. `/main.py` (Root Level)**

-   Main application entry point
-   FastAPI app initialization
-   CORS middleware configuration
-   Router registration
-   Health check endpoints
-   Can be run directly: `python main.py`

#### **2. `/database/auth.py`**

-   JWT token creation and validation
-   `create_access_token()` - Generate access tokens
-   `create_refresh_token()` - Generate refresh tokens
-   `get_current_user()` - Dependency to get authenticated user
-   `require_builder()` - Dependency for builder-only routes
-   `require_customer()` - Dependency for customer-only routes

#### **3. `/routes/__init__.py`**

-   Exports all routers for easy import
-   Single source of truth for all routes

#### **4. Route Modules (`/routes/*.py`)**

Each route module is a standalone APIRouter:

-   **`auth.py`**: Register, Login, Get Profile
-   **`projects.py`**: CRUD for projects, get units, progress
-   **`units.py`**: Create and manage units
-   **`bookings.py`**: Customer bookings, builder booking management, payments, agreements
-   **`appointments.py`**: Schedule, manage, reschedule appointments
-   **`messages.py`**: Conversations, send/receive messages
-   **`payments.py`**: Record and track payments
-   **`notifications.py`**: User notifications

---

## 🔌 API Endpoints

All endpoints remain the same, just organized better:

### Authentication (`/api/auth`)

-   `POST /api/auth/register` - Register new user
-   `POST /api/auth/login` - Login and get token
-   `GET /api/auth/me` - Get current user

### Projects (`/api/projects`)

-   `GET /api/projects` - List projects with filters
-   `GET /api/projects/{id}` - Get project details
-   `POST /api/projects` - Create project (builder only)
-   `PATCH /api/projects/{id}` - Update project (builder only)
-   `GET /api/projects/{id}/units` - Get project units
-   `GET /api/projects/{id}/progress` - Get construction progress
-   `GET /api/projects/{id}/updates` - Get construction updates

### Units (`/api/units`)

-   `POST /api/units` - Create unit (builder only)

### Bookings (`/api/bookings`)

-   `POST /api/bookings` - Create booking (customer)
-   `GET /api/bookings/customer/{id}` - Get customer bookings
-   `GET /api/builder/bookings` - Get builder bookings with stats
-   `GET /api/bookings/{id}` - Get booking details
-   `PATCH /api/bookings/{id}/status` - Update booking status
-   `GET /api/bookings/{id}/payments` - Get booking payments
-   `POST /api/bookings/{id}/generate-agreement` - Generate agreement
-   `GET /api/bookings/{id}/download-agreement` - Download agreement

### Appointments (`/api/appointments`)

-   `POST /api/appointments` - Create appointment
-   `GET /api/appointments/customer/{id}` - Get customer appointments
-   `GET /api/appointments/project/{id}` - Get project appointments
-   `GET /api/appointments` - Get all with filters and stats
-   `GET /api/appointments/{id}` - Get appointment details
-   `PATCH /api/appointments/{id}/status` - Update status
-   `PATCH /api/appointments/{id}/reschedule` - Reschedule
-   `DELETE /api/appointments/{id}` - Cancel appointment

### Messages (`/api/messages`)

-   `GET /api/messages/conversations` - Get all conversations
-   `GET /api/messages/conversation/{customer_id}/{project_id}` - Get conversation messages
-   `POST /api/messages` - Send message
-   `PATCH /api/messages/conversation/{id}/read` - Mark as read
-   `GET /api/messages` - Get all messages

### Payments (`/api/payments`)

-   `POST /api/payments` - Record payment (builder only)

### Notifications (`/api/notifications`)

-   `GET /api/notifications` - Get notifications
-   `PATCH /api/notifications/{id}/read` - Mark as read

---

## 🔧 How to Add New Routes

### Example: Adding a "Reviews" Feature

1. **Create route file**: `/routes/reviews.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import crud, schemas
from database.database import get_db
from database.auth import get_current_user

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])

@router.post("")
def create_review(
    review: schemas.ReviewCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.create_review(db, review, current_user.id)
```

2. **Export in `/routes/__init__.py`**

```python
from .reviews import router as reviews_router

__all__ = [..., "reviews_router"]
```

3. **Register in `/main.py`**

```python
from routes import (..., reviews_router)

app.include_router(reviews_router)
```

Done! Your new route is integrated. ✅

---

## 🔐 Authentication Flow

### 1. User Registration/Login

```
POST /api/auth/register or /api/auth/login
    ↓
Returns: { access_token, refresh_token, user }
```

### 2. Making Authenticated Requests

```
GET /api/projects (or any protected endpoint)
Headers: { Authorization: "Bearer <access_token>" }
    ↓
Middleware validates token → get_current_user()
    ↓
Route handler receives current_user
```

### 3. Role-Based Access

```
Builder-only routes: Depends(require_builder)
Customer-only routes: Depends(require_customer)
Any authenticated user: Depends(get_current_user)
```

---

## 📊 Database Integration

All routes use the same database setup:

-   **Database**: PostgreSQL via SQLAlchemy
-   **Session Management**: `get_db()` dependency
-   **Models**: Defined in `database/models.py`
-   **CRUD**: Operations in `database/crud.py`
-   **Schemas**: Pydantic models in `database/schemas.py`

---

## 🧪 Testing the API

### Using Swagger UI (Interactive)

1. Start the server: `uvicorn main:app --reload`
2. Open browser: http://localhost:8000/api/docs
3. Click "Authorize" → Enter token
4. Try out endpoints

### Using cURL

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Use token
curl http://localhost:8000/api/projects \
  -H "Authorization: Bearer <your-token>"
```

### Using Python Requests

```python
import requests

# Login
response = requests.post(
    "http://localhost:8000/api/auth/login",
    json={"email": "user@example.com", "password": "password"}
)
token = response.json()["access_token"]

# Make authenticated request
headers = {"Authorization": f"Bearer {token}"}
projects = requests.get(
    "http://localhost:8000/api/projects",
    headers=headers
)
```

---

## 📝 Environment Configuration

### Development (`.env` file)

```env
DATABASE_URL=postgresql://user:password@localhost/buildcraft_db
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Production Considerations

-   Use environment variables for sensitive data
-   Change `SECRET_KEY` to a strong random value
-   Update `CORS_ORIGINS` to your production domains
-   Set `reload=False` in production
-   Use a process manager like `gunicorn` or `supervisord`

---

## 🔄 Migration Guide

### If you want to keep using the old structure:

```bash
# Just use the old main file
uvicorn database.main:app --reload
```

### If you want to switch to the new structure:

```bash
# Use the new root main file
uvicorn main:app --reload

# Or
python main.py
```

### Both work! The new structure is recommended for:

-   ✅ Better organization
-   ✅ Easier maintenance
-   ✅ Scalability
-   ✅ Team collaboration

---

## 🐛 Troubleshooting

### Import Errors

```bash
# Make sure you're in the fastapi directory
cd /home/om_patil/Desktop/Codes/projects/RealEstate/fastapi

# If using new structure, run from fastapi root
uvicorn main:app --reload
```

### Port Already in Use

```bash
# Use a different port
uvicorn main:app --reload --port 8001
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Initialize database
python init_db.py
```

---

## 📚 Additional Resources

-   **FastAPI Docs**: https://fastapi.tiangolo.com
-   **SQLAlchemy Docs**: https://docs.sqlalchemy.org
-   **Pydantic Docs**: https://docs.pydantic.dev

---

## 🎯 Summary

### New Files Created

✅ `/main.py` - Main application entry point  
✅ `/database/auth.py` - Authentication utilities  
✅ `/routes/__init__.py` - Route exports  
✅ `/routes/auth.py` - Authentication routes  
✅ `/routes/projects.py` - Project routes  
✅ `/routes/units.py` - Unit routes  
✅ `/routes/bookings.py` - Booking routes  
✅ `/routes/appointments.py` - Appointment routes  
✅ `/routes/messages.py` - Message routes  
✅ `/routes/payments.py` - Payment routes  
✅ `/routes/notifications.py` - Notification routes

### Key Advantages

🚀 **Modular**: Easy to find and update code  
🔒 **Secure**: Centralized authentication  
📈 **Scalable**: Easy to add new features  
🧹 **Clean**: Well-organized codebase  
🤝 **Collaborative**: Multiple developers can work easily

---

**Your FastAPI application is now beautifully organized and ready for production!** 🎉
