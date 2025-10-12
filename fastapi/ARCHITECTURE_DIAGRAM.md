# 🏗️ FastAPI Architecture Visualization

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                       │
│                  http://localhost:3000                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │ (CORS Enabled)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI Application                     │
│                  http://localhost:8000                      │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │              main.py (Entry Point)                 │   │
│  │  • App initialization                              │   │
│  │  • CORS middleware                                 │   │
│  │  • Router registration                             │   │
│  │  • Health endpoints                                │   │
│  └────────────────────────────────────────────────────┘   │
│                            │                               │
│                            │ includes                      │
│                            ▼                               │
│  ┌────────────────────────────────────────────────────┐   │
│  │              Routes Module                         │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ auth.py        │ Authentication & Login      │ │   │
│  │  │ projects.py    │ Project Management          │ │   │
│  │  │ units.py       │ Unit Management             │ │   │
│  │  │ bookings.py    │ Booking & Reservations      │ │   │
│  │  │ appointments.py│ Appointment Scheduling      │ │   │
│  │  │ messages.py    │ Customer Communication      │ │   │
│  │  │ payments.py    │ Payment Processing          │ │   │
│  │  │ notifications.py│ User Notifications         │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  └────────────────────────────────────────────────────┘   │
│                            │                               │
│                            │ uses                          │
│                            ▼                               │
│  ┌────────────────────────────────────────────────────┐   │
│  │           Database Layer (database/)               │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ auth.py        │ JWT & Authentication        │ │   │
│  │  │ database.py    │ DB Connection & Session     │ │   │
│  │  │ models.py      │ SQLAlchemy ORM Models       │ │   │
│  │  │ schemas.py     │ Pydantic Request/Response   │ │   │
│  │  │ crud.py        │ Database Operations         │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ PostgreSQL Protocol
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                       │
│                                                             │
│  • Users         • Builders      • Customers               │
│  • Projects      • Units         • Bookings                │
│  • Appointments  • Messages      • Payments                │
│  • Notifications • Progress      • Updates                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow

### Example: User Login

```
1. Frontend Request
   │
   │  POST /api/auth/login
   │  { email, password }
   │
   ▼
2. FastAPI main.py
   │
   │  Receives request
   │  Routes to auth_router
   │
   ▼
3. routes/auth.py
   │
   │  login() function
   │  Validates input
   │
   ▼
4. database/crud.py
   │
   │  get_user_by_email()
   │  verify_password()
   │
   ▼
5. database/auth.py
   │
   │  create_access_token()
   │  create_refresh_token()
   │
   ▼
6. Response
   │
   │  { access_token, refresh_token, user }
   │
   ▼
7. Frontend
   │
   │  Store token
   │  Redirect to dashboard
```

---

## 🔐 Authentication Flow

```
┌─────────────┐
│   Client    │
└─────────────┘
       │
       │ 1. POST /api/auth/login
       │    { email, password }
       ▼
┌─────────────────────────────┐
│  routes/auth.py             │
│  • Validate credentials     │
│  • Call CRUD functions      │
└─────────────────────────────┘
       │
       │ 2. Query database
       ▼
┌─────────────────────────────┐
│  database/crud.py           │
│  • get_user_by_email()      │
│  • verify_password()        │
└─────────────────────────────┘
       │
       │ 3. User found & verified
       ▼
┌─────────────────────────────┐
│  database/auth.py           │
│  • create_access_token()    │
│  • create_refresh_token()   │
└─────────────────────────────┘
       │
       │ 4. Return tokens
       ▼
┌─────────────┐
│   Client    │
│  Store JWT  │
└─────────────┘
       │
       │ 5. Subsequent requests
       │    Headers: { Authorization: Bearer <token> }
       ▼
┌─────────────────────────────┐
│  database/auth.py           │
│  get_current_user()         │
│  • Decode JWT               │
│  • Validate token           │
│  • Return user object       │
└─────────────────────────────┘
       │
       │ 6. Authorized user
       ▼
┌─────────────────────────────┐
│  Route Handler              │
│  • Process request          │
│  • Access control check     │
│  • Return response          │
└─────────────────────────────┘
```

---

## 📁 File Organization

```
fastapi/
│
├── 🎯 ENTRY POINT
│   └── main.py ─────────────────┐
│                                │
├── 🚀 UTILITIES                 │
│   └── start.py                 │
│                                │
├── 📚 DOCUMENTATION              │
│   ├── QUICKSTART.md            │
│   ├── MODULAR_ARCHITECTURE.md  │
│   └── IMPLEMENTATION_SUMMARY.md│
│                                │
├── 📍 ROUTES ◄──────────────────┘
│   ├── __init__.py
│   ├── auth.py ──────┐
│   ├── projects.py   │
│   ├── units.py      │
│   ├── bookings.py   ├─── All import from ───┐
│   ├── appointments.py│                      │
│   ├── messages.py   │                       │
│   ├── payments.py   │                       │
│   └── notifications.py                      │
│                                              │
└── 💾 DATABASE ◄─────────────────────────────┘
    ├── __init__.py
    ├── auth.py      (JWT & Dependencies)
    ├── database.py  (DB Connection)
    ├── models.py    (ORM Models)
    ├── schemas.py   (Pydantic Schemas)
    └── crud.py      (DB Operations)
```

---

## 🔗 Dependency Graph

```
main.py
  │
  ├─► routes/__init__.py
  │     │
  │     ├─► routes/auth.py
  │     │     ├─► database/auth.py
  │     │     ├─► database/crud.py
  │     │     └─► database/schemas.py
  │     │
  │     ├─► routes/projects.py
  │     │     ├─► database/auth.py
  │     │     ├─► database/crud.py
  │     │     ├─► database/models.py
  │     │     └─► database/schemas.py
  │     │
  │     ├─► routes/bookings.py
  │     │     └─► (same dependencies)
  │     │
  │     └─► (other route modules...)
  │
  └─► database/database.py
        └─► PostgreSQL Database
```

---

## 🛡️ Security Layers

```
┌─────────────────────────────────────────┐
│         1. CORS Middleware              │
│  • Allow specific origins               │
│  • Credential support                   │
└─────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│         2. JWT Authentication           │
│  • Bearer token required                │
│  • Token validation                     │
│  • Expiry check                         │
└─────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│         3. Role-Based Access            │
│  • require_builder()                    │
│  • require_customer()                   │
│  • Resource ownership check             │
└─────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│         4. Business Logic               │
│  • Validate input data                  │
│  • Check resource availability          │
│  • Process request                      │
└─────────────────────────────────────────┘
```

---

## 🔄 Data Flow Example: Create Booking

```
Frontend                Routes              Database           PostgreSQL
   │                      │                    │                  │
   │ POST /api/bookings   │                    │                  │
   │ ─────────────────►   │                    │                  │
   │                      │                    │                  │
   │                      │ get_current_user() │                  │
   │                      │ ─────────────────► │                  │
   │                      │                    │ SELECT user      │
   │                      │                    │ ───────────────► │
   │                      │                    │ ◄─────────────── │
   │                      │ ◄───────────────── │                  │
   │                      │                    │                  │
   │                      │ require_customer() │                  │
   │                      │ (validate role)    │                  │
   │                      │                    │                  │
   │                      │ get_unit()         │                  │
   │                      │ ─────────────────► │                  │
   │                      │                    │ SELECT unit      │
   │                      │                    │ ───────────────► │
   │                      │                    │ ◄─────────────── │
   │                      │ ◄───────────────── │                  │
   │                      │                    │                  │
   │                      │ create_booking()   │                  │
   │                      │ ─────────────────► │                  │
   │                      │                    │ INSERT booking   │
   │                      │                    │ ───────────────► │
   │                      │                    │ UPDATE unit      │
   │                      │                    │ ───────────────► │
   │                      │                    │ ◄─────────────── │
   │                      │ ◄───────────────── │                  │
   │                      │                    │                  │
   │ ◄─────────────────── │                    │                  │
   │ { booking_details }  │                    │                  │
```

---

## 🎯 Route Module Pattern

Every route module follows this pattern:

```python
# 1. Imports
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import crud, schemas, models
from database.database import get_db
from database.auth import get_current_user, require_builder

# 2. Router initialization
router = APIRouter(prefix="/api/[domain]", tags=["[Domain]"])

# 3. Route handlers
@router.get("")
def get_items(db: Session = Depends(get_db)):
    """Get all items."""
    return crud.get_items(db)

@router.post("")
def create_item(
    item: schemas.ItemCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new item."""
    return crud.create_item(db, item, current_user.id)

@router.get("/{item_id}")
def get_item(item_id: int, db: Session = Depends(get_db)):
    """Get item by ID."""
    item = crud.get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item
```

---

## 🚦 API Endpoint Organization

```
/api
├── /auth              (Authentication)
│   ├── POST   /register
│   ├── POST   /login
│   └── GET    /me
│
├── /projects          (Projects)
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /{id}
│   ├── PATCH  /{id}
│   ├── GET    /{id}/units
│   ├── GET    /{id}/progress
│   └── GET    /{id}/updates
│
├── /units             (Units)
│   └── POST   /
│
├── /bookings          (Bookings)
│   ├── POST   /
│   ├── GET    /customer/{id}
│   ├── GET    /{id}
│   ├── PATCH  /{id}/status
│   ├── GET    /{id}/payments
│   ├── POST   /{id}/generate-agreement
│   └── GET    /{id}/download-agreement
│
├── /builder/bookings  (Builder Bookings)
│   └── GET    /
│
├── /appointments      (Appointments)
│   ├── POST   /
│   ├── GET    /
│   ├── GET    /customer/{id}
│   ├── GET    /project/{id}
│   ├── GET    /{id}
│   ├── PATCH  /{id}/status
│   ├── PATCH  /{id}/reschedule
│   └── DELETE /{id}
│
├── /messages          (Messages)
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /conversations
│   ├── GET    /conversation/{cust_id}/{proj_id}
│   └── PATCH  /conversation/{id}/read
│
├── /payments          (Payments)
│   └── POST   /
│
└── /notifications     (Notifications)
    ├── GET    /
    └── PATCH  /{id}/read
```

---

## 📊 Startup Sequence

```
1. Python interpreter starts
   │
   ▼
2. Import main.py
   │
   ├─► Import database.database (create engine, session)
   ├─► Import all route modules
   │   └─► Import database.auth, crud, schemas, models
   └─► Create database tables (Base.metadata.create_all)
   │
   ▼
3. Initialize FastAPI app
   │
   ├─► Set title, description, version
   ├─► Set docs URLs
   └─► Add CORS middleware
   │
   ▼
4. Register all routers
   │
   ├─► app.include_router(auth_router)
   ├─► app.include_router(projects_router)
   ├─► app.include_router(bookings_router)
   └─► ... (all other routers)
   │
   ▼
5. Add utility endpoints
   │
   ├─► GET /health
   └─► GET /
   │
   ▼
6. Start Uvicorn server
   │
   └─► Listen on 0.0.0.0:8000
```

---

## 🎨 Module Responsibilities

| Module                      | Responsibility                         | Key Functions                                |
| --------------------------- | -------------------------------------- | -------------------------------------------- |
| **main.py**                 | Application entry, router registration | `app`, startup/shutdown                      |
| **database/auth.py**        | Authentication & authorization         | `get_current_user()`, `require_builder()`    |
| **database/database.py**    | Database connection & session          | `engine`, `SessionLocal`, `get_db()`         |
| **database/models.py**      | ORM models (tables)                    | `User`, `Project`, `Booking`, etc.           |
| **database/schemas.py**     | Request/response schemas               | `UserCreate`, `ProjectResponse`, etc.        |
| **database/crud.py**        | Database operations                    | `create_*()`, `get_*()`, `update_*()`        |
| **routes/auth.py**          | Auth endpoints                         | `register()`, `login()`, `get_me()`          |
| **routes/projects.py**      | Project endpoints                      | `get_projects()`, `create_project()`         |
| **routes/bookings.py**      | Booking endpoints                      | `create_booking()`, `get_builder_bookings()` |
| **routes/appointments.py**  | Appointment endpoints                  | `create_appointment()`, `reschedule()`       |
| **routes/messages.py**      | Message endpoints                      | `get_conversations()`, `send_message()`      |
| **routes/payments.py**      | Payment endpoints                      | `create_payment()`                           |
| **routes/notifications.py** | Notification endpoints                 | `get_notifications()`, `mark_read()`         |

---

## 🔍 Quick Reference

### Starting Server

```bash
python start.py          # Easiest
python main.py           # Direct
uvicorn main:app --reload  # Manual
```

### API Documentation

```
http://localhost:8000/api/docs   # Swagger UI
http://localhost:8000/api/redoc  # ReDoc
http://localhost:8000/health     # Health check
```

### Adding New Route

1. Create `routes/new_feature.py`
2. Export in `routes/__init__.py`
3. Register in `main.py`

---

**This modular architecture provides a solid foundation for scalable API development!** 🚀
