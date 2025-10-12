# FastAPI Backend - Visual Architecture Guide

## 🏗️ Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS FRONTEND (PORT 3000)                 │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐            │
│  │   Builder   │  │  Customer   │  │    Login     │            │
│  │   Portal    │  │   Portal    │  │   Register   │            │
│  └─────────────┘  └─────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/HTTPS ↓
                        (JWT Token in Headers)
                              ↓          ↓
┌─────────────────────────────────────────────────────────────────┐
│                   FASTAPI BACKEND (PORT 8000)                    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      main.py                              │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────┐     │   │
│  │  │           Authentication Middleware              │     │   │
│  │  │  - JWT Token Validation                         │     │   │
│  │  │  - Role-Based Access Control                    │     │   │
│  │  │  - CORS Configuration                           │     │   │
│  │  └─────────────────────────────────────────────────┘     │   │
│  │                         ↓                                │   │
│  │  ┌─────────────────────────────────────────────────┐     │   │
│  │  │              API Routes (30+)                    │     │   │
│  │  │                                                  │     │   │
│  │  │  /api/auth/*        - Authentication            │     │   │
│  │  │  /api/projects/*    - Project Management        │     │   │
│  │  │  /api/units/*       - Unit Management           │     │   │
│  │  │  /api/bookings/*    - Booking System            │     │   │
│  │  │  /api/appointments/*- Appointment Scheduling    │     │   │
│  │  │  /api/notifications/*- Notification System      │     │   │
│  │  │  /api/messages/*    - Messaging                 │     │   │
│  │  └─────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      crud.py                              │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────┐     │   │
│  │  │         Database Operations (80+)                │     │   │
│  │  │                                                  │     │   │
│  │  │  • User CRUD          • Project CRUD             │     │   │
│  │  │  • Builder CRUD       • Unit CRUD                │     │   │
│  │  │  • Customer CRUD      • Booking CRUD             │     │   │
│  │  │  • Payment CRUD       • Appointment CRUD         │     │   │
│  │  │  • Message CRUD       • Notification CRUD        │     │   │
│  │  │  • Progress CRUD      • 3D Model CRUD            │     │   │
│  │  └─────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    schemas.py                             │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────┐     │   │
│  │  │        Pydantic Validation (60+ Schemas)         │     │   │
│  │  │                                                  │     │   │
│  │  │  Input Validation  →  Type Conversion  →  Output │     │   │
│  │  │                                                  │     │   │
│  │  │  UserCreate    ProjectCreate    BookingCreate    │     │   │
│  │  │  UserUpdate    ProjectUpdate    BookingUpdate    │     │   │
│  │  │  UserResponse  ProjectResponse  BookingResponse  │     │   │
│  │  └─────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     models.py                             │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────┐     │   │
│  │  │         SQLAlchemy ORM Models (15 Tables)        │     │   │
│  │  │                                                  │     │   │
│  │  │  1. users             9. project_progress        │     │   │
│  │  │  2. builders         10. construction_updates    │     │   │
│  │  │  3. customers        11. messages                │     │   │
│  │  │  4. projects         12. change_requests         │     │   │
│  │  │  5. units            13. models_3d               │     │   │
│  │  │  6. bookings         14. notifications           │     │   │
│  │  │  7. payments         15. system_settings         │     │   │
│  │  │  8. appointments                                 │     │   │
│  │  └─────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   database.py                             │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────┐     │   │
│  │  │          Database Connection Manager             │     │   │
│  │  │                                                  │     │   │
│  │  │  • SQLAlchemy Engine                            │     │   │
│  │  │  • Session Factory                              │     │   │
│  │  │  • Connection Pooling                           │     │   │
│  │  │  • Dependency Injection (get_db)                │     │   │
│  │  └─────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│               POSTGRESQL DATABASE (PORT 5432)                    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  15 Database Tables                      │    │
│  │                                                          │    │
│  │  Authentication    Property       Financial             │    │
│  │  ├── users         ├── projects   ├── payments          │    │
│  │  ├── builders      ├── units      └── bookings          │    │
│  │  └── customers     └── appointments                     │    │
│  │                                                          │    │
│  │  Communication     Progress       Media                 │    │
│  │  ├── messages      ├── progress   ├── models_3d         │    │
│  │  ├── notifications ├── updates    └── system_settings   │    │
│  │  └── change_requests                                    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

### 1. User Registration Flow

```
Frontend                  Backend                   Database
   │                         │                          │
   │  POST /api/auth/register                           │
   │ ──────────────────────→ │                          │
   │                         │                          │
   │                         │  Validate with Pydantic  │
   │                         │  (schemas.UserCreate)    │
   │                         │                          │
   │                         │  Hash password (bcrypt)  │
   │                         │                          │
   │                         │  Create user             │
   │                         │ ────────────────────────→│
   │                         │                          │
   │                         │  Create profile          │
   │                         │  (builder/customer)      │
   │                         │ ────────────────────────→│
   │                         │                          │
   │                         │  Return user + token     │
   │                         │←─────────────────────────│
   │                         │                          │
   │  JWT Token + User Data  │                          │
   │←─────────────────────── │                          │
   │                         │                          │
   │  Store token in         │                          │
   │  localStorage           │                          │
   │                         │                          │
```

### 2. Create Project Flow (Builder)

```
Frontend                  Backend                   Database
   │                         │                          │
   │  POST /api/projects     │                          │
   │  Authorization: Bearer  │                          │
   │ ──────────────────────→ │                          │
   │                         │                          │
   │                         │  Verify JWT token        │
   │                         │                          │
   │                         │  Check user is builder   │
   │                         │  (require_builder)       │
   │                         │                          │
   │                         │  Validate project data   │
   │                         │  (schemas.ProjectCreate) │
   │                         │                          │
   │                         │  Create project          │
   │                         │  (crud.create_project)   │
   │                         │ ────────────────────────→│
   │                         │                          │
   │                         │  Increment builder's     │
   │                         │  total_projects          │
   │                         │ ────────────────────────→│
   │                         │                          │
   │                         │  Return project          │
   │                         │←─────────────────────────│
   │                         │                          │
   │  Project data           │                          │
   │←─────────────────────── │                          │
   │                         │                          │
```

### 3. Create Booking Flow (Customer)

```
Frontend                  Backend                   Database
   │                         │                          │
   │  POST /api/bookings     │                          │
   │  Authorization: Bearer  │                          │
   │ ──────────────────────→ │                          │
   │                         │                          │
   │                         │  Verify JWT token        │
   │                         │                          │
   │                         │  Check user is customer  │
   │                         │  (require_customer)      │
   │                         │                          │
   │                         │  Validate booking data   │
   │                         │  (schemas.BookingCreate) │
   │                         │                          │
   │                         │  Check unit availability │
   │                         │ ────────────────────────→│
   │                         │←─────────────────────────│
   │                         │                          │
   │                         │  Create booking          │
   │                         │ ────────────────────────→│
   │                         │                          │
   │                         │  Update unit status      │
   │                         │  to 'booked'             │
   │                         │ ────────────────────────→│
   │                         │                          │
   │                         │  Decrement project's     │
   │                         │  available_units         │
   │                         │ ────────────────────────→│
   │                         │                          │
   │                         │  Create notification     │
   │                         │ ────────────────────────→│
   │                         │                          │
   │                         │  Return booking          │
   │                         │←─────────────────────────│
   │                         │                          │
   │  Booking confirmation   │                          │
   │←─────────────────────── │                          │
   │                         │                          │
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Layer 1: CORS Protection                          │     │
│  │  - Allowed origins configured                      │     │
│  │  - Credentials support enabled                     │     │
│  └────────────────────────────────────────────────────┘     │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Layer 2: JWT Authentication                       │     │
│  │  - Token verification on protected routes          │     │
│  │  - HS256 algorithm                                 │     │
│  │  - Configurable expiration                         │     │
│  └────────────────────────────────────────────────────┘     │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Layer 3: Role-Based Access Control                │     │
│  │  - require_builder() dependency                    │     │
│  │  - require_customer() dependency                   │     │
│  │  - Resource ownership validation                   │     │
│  └────────────────────────────────────────────────────┘     │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Layer 4: Input Validation                         │     │
│  │  - Pydantic schema validation                      │     │
│  │  - Type checking                                   │     │
│  │  - SQL injection prevention (ORM)                  │     │
│  └────────────────────────────────────────────────────┘     │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Layer 5: Password Security                        │     │
│  │  - Bcrypt hashing                                  │     │
│  │  - Salt rounds configured                          │     │
│  │  - Never store plain text                          │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Database Entity Relationships

```
┌─────────┐
│  User   │──────────┐
│         │          │
│ id (PK) │          │
│ email   │          │
│ type    │          │
└─────────┘          │
     │               │
     │ 1:1           │ 1:1
     ↓               ↓
┌──────────┐    ┌──────────┐
│ Builder  │    │ Customer │
│          │    │          │
│ id (PK)  │    │ id (PK)  │
│ user_id  │    │ user_id  │
└──────────┘    └──────────┘
     │               │
     │ 1:n           │ 1:n
     ↓               ↓
┌──────────┐    ┌──────────┐
│ Project  │    │ Booking  │
│          │    │          │
│ id (PK)  │    │ id (PK)  │
│builder_id│    │customer  │
└──────────┘    └──────────┘
     │               │
     │ 1:n           │ n:1
     ↓               ↓
┌──────────┐────────┘
│   Unit   │
│          │
│ id (PK)  │
│project_id│
└──────────┘
     │
     │ 1:n
     ↓
┌──────────────┐
│ Related Data │
├──────────────┤
│ • Payments   │
│ • Messages   │
│ • Changes    │
│ • Models 3D  │
│ • Progress   │
└──────────────┘
```

---

## 🎯 Request/Response Flow

### Example: Get Projects with Filters

```
1. CLIENT REQUEST
   ┌─────────────────────────────────────────────┐
   │ GET /api/projects?                          │
   │     page=1&                                 │
   │     limit=10&                               │
   │     city=Bangalore&                         │
   │     status=construction                     │
   │                                             │
   │ Headers:                                    │
   │   Authorization: Bearer eyJ...              │
   └─────────────────────────────────────────────┘
                      ↓
2. AUTHENTICATION
   ┌─────────────────────────────────────────────┐
   │ • Verify JWT token                          │
   │ • Extract user_id from token                │
   │ • Load user from database                   │
   └─────────────────────────────────────────────┘
                      ↓
3. VALIDATION
   ┌─────────────────────────────────────────────┐
   │ • Parse query parameters                    │
   │ • Validate with ProjectFilter schema        │
   │ • Convert types (int, enum, etc.)           │
   └─────────────────────────────────────────────┘
                      ↓
4. DATABASE QUERY
   ┌─────────────────────────────────────────────┐
   │ crud.get_projects(db, filters):             │
   │                                             │
   │ SELECT * FROM projects                      │
   │ JOIN builders ON ...                        │
   │ WHERE city ILIKE '%Bangalore%'              │
   │   AND status = 'construction'               │
   │ ORDER BY created_at DESC                    │
   │ LIMIT 10 OFFSET 0                           │
   └─────────────────────────────────────────────┘
                      ↓
5. RESPONSE FORMATTING
   ┌─────────────────────────────────────────────┐
   │ • Convert SQLAlchemy models to Pydantic     │
   │ • Format with ProjectResponse schema        │
   │ • Add pagination metadata                   │
   └─────────────────────────────────────────────┘
                      ↓
6. CLIENT RESPONSE
   ┌─────────────────────────────────────────────┐
   │ {                                           │
   │   "success": true,                          │
   │   "data": {                                 │
   │     "projects": [...],                      │
   │     "pagination": {                         │
   │       "currentPage": 1,                     │
   │       "totalPages": 5,                      │
   │       "totalItems": 45                      │
   │     }                                       │
   │   }                                         │
   │ }                                           │
   └─────────────────────────────────────────────┘
```

---

## 🛠️ Development Workflow

```
┌─────────────────────────────────────────────────────────┐
│                    Development Cycle                     │
│                                                          │
│  1. Define Model                                        │
│     ├── Create in models.py                            │
│     ├── Add relationships                              │
│     └── Add indexes                                    │
│                                                          │
│  2. Create Schemas                                      │
│     ├── ModelBase (shared fields)                      │
│     ├── ModelCreate (POST validation)                  │
│     ├── ModelUpdate (PATCH validation)                 │
│     └── ModelResponse (GET serialization)              │
│                                                          │
│  3. Implement CRUD                                      │
│     ├── create_model(db, data)                         │
│     ├── get_model_by_id(db, id)                        │
│     ├── get_models(db, filters)                        │
│     ├── update_model(db, id, data)                     │
│     └── delete_model(db, id)                           │
│                                                          │
│  4. Create API Routes                                   │
│     ├── POST   /api/models                             │
│     ├── GET    /api/models                             │
│     ├── GET    /api/models/{id}                        │
│     ├── PATCH  /api/models/{id}                        │
│     └── DELETE /api/models/{id}                        │
│                                                          │
│  5. Add Authentication                                  │
│     ├── Public routes (no auth)                        │
│     ├── Protected routes (require auth)                │
│     └── Role-specific routes (builder/customer)        │
│                                                          │
│  6. Test                                               │
│     ├── Unit tests (pytest)                            │
│     ├── Integration tests                              │
│     └── Manual testing (Swagger UI)                    │
│                                                          │
│  7. Document                                            │
│     ├── Add docstrings                                 │
│     ├── Update README                                  │
│     └── Auto-generated docs (FastAPI)                  │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Deployment Architecture

```
┌────────────────────────────────────────────────────────┐
│                    Production Setup                     │
│                                                         │
│  ┌──────────────────────────────────────────────┐     │
│  │             Load Balancer (Nginx)            │     │
│  │                                               │     │
│  │  • SSL/TLS termination                       │     │
│  │  • Request routing                           │     │
│  │  • Static file serving                       │     │
│  └──────────────────────────────────────────────┘     │
│                         │                              │
│        ┌────────────────┼────────────────┐            │
│        ↓                ↓                ↓            │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐        │
│  │ FastAPI  │    │ FastAPI  │    │ FastAPI  │        │
│  │ Worker 1 │    │ Worker 2 │    │ Worker 3 │        │
│  └──────────┘    └──────────┘    └──────────┘        │
│        │                │                │            │
│        └────────────────┴────────────────┘            │
│                         ↓                              │
│  ┌──────────────────────────────────────────────┐     │
│  │          PostgreSQL Database                 │     │
│  │                                               │     │
│  │  • Master-Slave replication                  │     │
│  │  • Automatic backups                         │     │
│  │  • Connection pooling                        │     │
│  └──────────────────────────────────────────────┘     │
│                                                         │
│  ┌──────────────────────────────────────────────┐     │
│  │              Redis Cache                      │     │
│  │                                               │     │
│  │  • Session storage                           │     │
│  │  • API response caching                      │     │
│  │  • Rate limiting                             │     │
│  └──────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────┘
```

---

## 🔍 Monitoring & Logging

```
┌────────────────────────────────────────────────────────┐
│                  Observability Stack                    │
│                                                         │
│  Application Logs                                      │
│  ┌──────────────────────────────────────────────┐     │
│  │ • Request/Response logging                   │     │
│  │ • Error tracking                             │     │
│  │ • Performance metrics                        │     │
│  │ • Database query logs                        │     │
│  └──────────────────────────────────────────────┘     │
│                         ↓                              │
│  ┌──────────────────────────────────────────────┐     │
│  │         Log Aggregation (ELK Stack)          │     │
│  │                                               │     │
│  │  Elasticsearch → Logstash → Kibana           │     │
│  └──────────────────────────────────────────────┘     │
│                                                         │
│  Metrics & Alerts                                      │
│  ┌──────────────────────────────────────────────┐     │
│  │ • API response times                         │     │
│  │ • Database query performance                 │     │
│  │ • Error rates                                │     │
│  │ • Resource utilization                       │     │
│  └──────────────────────────────────────────────┘     │
│                         ↓                              │
│  ┌──────────────────────────────────────────────┐     │
│  │      Monitoring (Prometheus + Grafana)       │     │
│  └──────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────┘
```

---

## 🎨 Code Organization Best Practices

```
fastapi/
│
├── database/
│   ├── __init__.py          # Package initialization
│   ├── database.py          # ✅ Database connection (single responsibility)
│   ├── models.py            # ✅ ORM models (data layer)
│   ├── schemas.py           # ✅ Pydantic schemas (validation layer)
│   ├── crud.py              # ✅ Database operations (business logic)
│   └── main.py              # ✅ API routes (presentation layer)
│
├── tests/                   # Test suite
│   ├── test_auth.py
│   ├── test_projects.py
│   └── test_bookings.py
│
├── alembic/                 # Database migrations
│   └── versions/
│
├── docs/                    # Documentation
│   ├── BACKEND_DOCUMENTATION.md
│   ├── QUICK_REFERENCE.md
│   └── ARCHITECTURE.md
│
├── .env                     # Environment variables (gitignored)
├── .env.example             # Example environment file
├── requirements.txt         # Dependencies
├── init_database.py         # DB initialization
├── README.md                # Main documentation
└── docker-compose.yml       # Docker setup
```

---

## 📚 Complete File Summary

| File               | Purpose       | Lines     | Key Features                    |
| ------------------ | ------------- | --------- | ------------------------------- |
| `database.py`      | DB Connection | ~30       | Session management, pooling     |
| `models.py`        | ORM Models    | ~650      | 15 tables, relationships, enums |
| `schemas.py`       | Validation    | ~550      | 60+ schemas, type safety        |
| `crud.py`          | DB Operations | ~700      | 80+ functions, optimizations    |
| `main.py`          | API Routes    | ~350      | 30+ endpoints, auth, RBAC       |
| `init_database.py` | DB Setup      | ~180      | Table creation, sample data     |
| **Total Core**     | **Backend**   | **~2460** | **Complete implementation**     |

---

**🎉 You now have a complete, production-ready FastAPI backend with comprehensive documentation and visual guides!**
