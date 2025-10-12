# RealEstate Project - Complete Change Log

## Project Overview

Full-stack real estate management system with FastAPI backend and Next.js frontend.

---

## 🗓️ Session 1: Backend Modular Architecture

### Date: October 10, 2025

### Objective

Create a modular FastAPI backend structure with main routes in the root while maintaining the existing file structure.

### Changes Made

#### Backend Structure Created

1. **Root Entry Point: `/fastapi/main.py`**

    - FastAPI application initialization
    - CORS middleware configuration
    - Router registration for all modules
    - Health check endpoints

2. **Authentication Module: `/fastapi/database/auth.py`**

    - JWT token creation and validation
    - OAuth2PasswordBearer configuration
    - Access token expiry: 30 minutes
    - Refresh token expiry: 7 days
    - User dependency injection

3. **Route Modules: `/fastapi/routes/`**

    - `auth.py` - User registration, login, token refresh
    - `projects.py` - Project CRUD operations
    - `units.py` - Unit management
    - `bookings.py` - Booking creation and management
    - `appointments.py` - Appointment scheduling
    - `messages.py` - Messaging system
    - `payments.py` - Payment recording
    - `notifications.py` - Notification management

4. **Documentation Files**
    - `/fastapi/MODULAR_ARCHITECTURE.md` - Architecture overview
    - `/fastapi/QUICKSTART.md` - Quick start guide

### Technical Details

-   **Framework:** FastAPI 0.116.1
-   **Database:** PostgreSQL with SQLAlchemy 2.0
-   **Authentication:** JWT with OAuth2
-   **Validation:** Pydantic v2

---

## 🗓️ Session 2: Database Permission Issues

### Date: October 10, 2025

### Problem

PostgreSQL permission errors when creating ENUM types in the public schema:

```
psycopg2.errors.InsufficientPrivilege: permission denied for schema public
[SQL: CREATE TYPE usertype AS ENUM ('BUILDER', 'CUSTOMER')]
```

### Root Cause

-   User `om_patil` lacked CREATE permission on public schema
-   Default PostgreSQL 15+ security restrictions

### Solution

Created automated fix scripts:

1. **SQL Fix: `/fastapi/fix_permissions.sql`**

    ```sql
    GRANT CREATE ON SCHEMA public TO om_patil;
    GRANT USAGE ON SCHEMA public TO om_patil;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO om_patil;
    ```

2. **Bash Script: `/fastapi/fix_db_permissions.sh`**

    - Automated permission grant execution
    - Database connection handling

3. **Documentation**
    - `/fastapi/DATABASE_PERMISSION_FIX.md`
    - `/fastapi/PERMISSION_ERROR_FIX.md`

### Verification

✅ Database initialization successful
✅ All ENUM types created
✅ Tables created without errors

---

## 🗓️ Session 3: Frontend-Backend Integration

### Date: October 10, 2025

### Objective

Connect all Next.js frontend pages to FastAPI backend with proper API client and service layer.

### Changes Made

#### API Infrastructure

1. **API Configuration: `/nextjs/src/lib/api-config.ts`**

    - Base URL configuration
    - All endpoint definitions organized by domain
    - TypeScript constants for type safety

2. **API Client: `/nextjs/src/lib/api-client.ts`**

    - Axios-based HTTP client
    - Automatic auth token injection via interceptors
    - Request/response interceptors
    - Error handling with ApiResponse<T> pattern
    - Token management utilities

3. **Service Layer: `/nextjs/src/lib/services/`**
    - `auth.service.ts` - Registration, login, logout, token management
    - `projects.service.ts` - Project CRUD, filtering, pagination
    - `bookings.service.ts` - Booking creation, management, history
    - `appointments.service.ts` - Scheduling, reschedule, cancellation
    - `messages.service.ts` - Send messages, fetch conversations, mark read
    - `payments.service.ts` - Record payments, fetch history
    - `notifications.service.ts` - Fetch, mark read, notification preferences
    - `index.ts` - Centralized service exports

#### Page Integration

1. **Login Page: `/nextjs/src/app/login/page.tsx`**

    - Connected to `authService.login()`
    - Separate builder and customer tabs
    - Token storage in localStorage
    - Error handling with toast notifications
    - Loading states
    - Auto-redirect to respective dashboards

2. **Register Page: `/nextjs/src/app/register/page.tsx`**
    - Connected to `authService.register()`
    - Separate builder and customer forms
    - Form validation
    - Password confirmation
    - Error handling with toast notifications
    - Loading states

#### Environment Configuration

-   `/nextjs/.env.local` - API base URL configuration

#### Documentation

-   `/nextjs/FRONTEND_BACKEND_INTEGRATION.md` - Complete integration guide
-   `/nextjs/API_INTEGRATION_SUMMARY.md` - Quick reference

### Technical Details

-   **HTTP Client:** Axios with interceptors
-   **State Management:** React hooks (useState, useEffect)
-   **Type Safety:** Full TypeScript interfaces for all API responses
-   **Error Handling:** Consistent ApiResponse<T> pattern
-   **Token Storage:** localStorage with automatic injection

---

## 🗓️ Session 4: Enum Value Validation Fix (422 Error)

### Date: October 10, 2025

### Problem

Registration and login failing with `422 Unprocessable Content` error.

### Root Cause Analysis

Backend enum definition:

```python
class UserType(str, enum.Enum):
    BUILDER = "builder"      # Key uppercase, VALUE lowercase
    CUSTOMER = "customer"    # Key uppercase, VALUE lowercase
```

-   Pydantic validates against enum **values** (lowercase)
-   Frontend was sending uppercase: `"BUILDER"`, `"CUSTOMER"`
-   Validation failed: "Input should be 'builder' or 'customer'"

### Solution

#### Frontend Changes

1. **Type Definitions Updated**

    ```typescript
    // Before: "BUILDER" | "CUSTOMER"
    // After: "builder" | "customer"
    ```

2. **Files Modified:**

    - `/nextjs/src/lib/services/auth.service.ts`

        - Updated RegisterData interface
        - Updated LoginData interface
        - Updated User interface
        - Fixed comparison logic: `data.user_type === "builder"`

    - `/nextjs/src/app/login/page.tsx`

        - Builder login: `user_type: "builder"`
        - Customer login: `user_type: "customer"`
        - User type validation checks updated

    - `/nextjs/src/app/register/page.tsx`
        - Builder registration: `user_type: "builder"`
        - Customer registration: `user_type: "customer"`

#### Validation Testing

Created test script: `/fastapi/test_schema.py`

**Test Results:**

```
✓ Builder validation passed
  Input: { email, password, user_type: "builder", builder_data: {...} }

✓ Customer validation passed
  Input: { email, password, user_type: "customer", customer_data: {...} }
```

### Documentation

-   `/ENUM_VALUES_REFERENCE.md` - Complete enum reference for all 20+ backend enums
-   `/FIX_422_ERROR.md` - Detailed fix documentation

### Key Learnings

1. **All backend enums use lowercase values**
2. **Frontend must always send lowercase enum values**
3. **Pydantic validates values, not keys**

---

## 🗓️ Session 5: Password Hashing Fix

### Date: October 10, 2025

### Problem

```
ValueError: password cannot be longer than 72 bytes, truncate manually if necessary (e.g. my_password[:72])
```

Error occurred during user registration, even with short passwords like "1234".

### Root Cause

-   **Incompatibility:** `passlib` 1.7.4 + `bcrypt` 4.0+
-   `passlib` tries to detect bcrypt features during initialization
-   Tests bcrypt with a 73-byte password to detect "wrap bug"
-   Newer bcrypt versions (4.0+) strictly enforce 72-byte limit
-   Error happens during initialization, not actual password hashing

**Error Chain:**

```
passlib.handlers.bcrypt.py:620 - AttributeError: module 'bcrypt' has no attribute '__about__'
passlib.handlers.bcrypt.py:380 - ValueError: password cannot be longer than 72 bytes
```

### Solution

Replaced `passlib.context.CryptContext` with direct `bcrypt` usage.

#### Changes in `/fastapi/database/crud.py`

**Before (using passlib):**

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

**After (using bcrypt directly):**

```python
import bcrypt

def get_password_hash(password: str) -> str:
    """Hash a password for storing."""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a stored password against one provided by user."""
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)
```

### Benefits

1. ✅ No compatibility issues with any bcrypt version
2. ✅ Simpler implementation (no extra dependency layer)
3. ✅ Industry-standard security (bcrypt)
4. ✅ Future-proof with direct control

### Testing

Created test script: `/fastapi/test_bcrypt.py`

**Test Results:**

```
Original password: 1234
Hashed password: $2b$12$Nr0bqE2U1a8m0nlmtwlPpOJZLPhJOYWoRdvjbK3B7zzpMo5.nKzxO
Password verification: True
Wrong password verification: False

✅ Bcrypt is working correctly!
```

### Documentation

-   `/PASSWORD_HASHING_FIX.md` - Detailed fix explanation
-   `/fastapi/test_bcrypt.py` - Password hashing test script

---

## 🗓️ Session 6: Replace Hardcoded Data with API Integration

### Date: October 10, 2025

### Objective

Replace all predefined/hardcoded data in frontend pages with real API calls to backend.

### Pages with Hardcoded Data Identified

#### Builder Pages

1. `/nextjs/src/app/builder/dashboard/page.tsx` - ✅ **COMPLETED** - Dashboard stats and data
2. `/nextjs/src/app/builder/projects/page.tsx` - 🔄 Pending - Project listings
3. `/nextjs/src/app/builder/bookings/page.tsx` - 🔄 Pending - Booking management
4. `/nextjs/src/app/builder/appointments/page.tsx` - 🔄 Pending - Appointments
5. `/nextjs/src/app/builder/messages/page.tsx` - 🔄 Pending - Messages/conversations
6. `/nextjs/src/app/builder/progress/page.tsx` - 🔄 Pending - Progress updates
7. `/nextjs/src/app/builder/models/page.tsx` - 🔄 Pending - 3D models

#### Customer Pages

1. `/nextjs/src/app/customer/dashboard/page.tsx` - ✅ **COMPLETED** - Dashboard overview
2. `/nextjs/src/app/customer/projects/page.tsx` - 🔄 Pending - Available projects
3. `/nextjs/src/app/customer/bookings/page.tsx` - 🔄 Pending - User bookings
4. `/nextjs/src/app/customer/appointments/page.tsx` - 🔄 Pending - Appointments
5. `/nextjs/src/app/customer/messages/page.tsx` - 🔄 Pending - Messages
6. `/nextjs/src/app/customer/progress/page.tsx` - 🔄 Pending - Project progress
7. `/nextjs/src/app/customer/models/page.tsx` - 🔄 Pending - 3D models
8. `/nextjs/src/app/customer/notifications/page.tsx` - 🔄 Pending - Notifications
9. `/nextjs/src/app/customer/changes/page.tsx` - 🔄 Pending - Change requests

### Implementation Details

#### ✅ Builder Dashboard (`/builder/dashboard/page.tsx`)

**Changes Made:**

-   Converted to client component with `"use client"` directive
-   Added React hooks: `useState`, `useEffect` for state management
-   Integrated services: `projectsService`, `bookingsService`, `appointmentsService`
-   Replaced hardcoded stats with API calls:
    -   `totalProjects` - from projectsService.getProjects()
    -   `activeProjects` - filtered from projects (in_progress, approved)
    -   `pendingBookings` - from bookingsService.getBuilderBookings()
    -   `upcomingAppointments` - from appointmentsService.getAppointments()
-   Added loading states with Skeleton components
-   Implemented refresh functionality with toast notifications
-   Added error handling with try-catch and toast messages
-   Added RefreshCw button to manually refresh data

**API Integration:**

```typescript
// Fetch projects
const projectsResponse = await projectsService.getProjects({ page: 1, limit: 3 });
// Access: projectsResponse.data.projects, projectsResponse.data.total

// Fetch bookings
const bookingsResponse = await bookingsService.getBuilderBookings({
    page: 1,
    limit: 5,
    status: "pending",
});
// Access: bookingsResponse.data.bookings, bookingsResponse.data.total

// Fetch appointments
const appointmentsResponse = await appointmentsService.getAppointments({
    page: 1,
    limit: 3,
});
// Access: Array of appointments
```

#### ✅ Customer Dashboard (`/customer/dashboard/page.tsx`)

**Changes Made:**

-   Converted to client component with `"use client"` directive
-   Added React hooks for state management
-   Integrated services: `bookingsService`, `appointmentsService`, `notificationsService`
-   Replaced hardcoded data with API calls:
    -   `bookedProperties` - from bookingsService.getCustomerBookings(userId)
    -   `upcomingAppointments` - from appointmentsService.getAppointments()
    -   `recentNotifications` - from notificationsService.getNotifications()
-   Added loading skeletons for better UX
-   Implemented user info from localStorage
-   Added refresh functionality
-   Proper error handling with toast notifications
-   Added RefreshCw button for manual refresh

**API Integration:**

```typescript
// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

// Fetch bookings
const bookingsResponse = await bookingsService.getCustomerBookings(user.id);
// Access: Array of bookings

// Fetch appointments
const appointmentsResponse = await appointmentsService.getAppointments({
    page: 1,
    limit: 3,
});

// Fetch notifications
const notificationsResponse = await notificationsService.getNotifications({
    unread_only: false,
    limit: 3,
});
```

### Technical Patterns Implemented

1. **Loading States:**

    ```typescript
    const [isLoading, setIsLoading] = useState(true);

    if (isLoading) {
      return <Skeleton.../>;
    }
    ```

2. **Error Handling:**

    ```typescript
    try {
        const response = await service.getData();
    } catch (error) {
        toast({ title: "Error", description: "Failed", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
    ```

3. **Data Transformation:**

    ```typescript
    const transformed = rawData.map(item => ({
        id: item.id,
        displayName: item.project_name || "Unknown",
        date: new Date(item.created_at).toLocaleDateString(),
    }));
    ```

4. **Refresh Functionality:**
    ```typescript
    const refreshDashboard = () => {
        fetchDashboardData();
        toast({ title: "Refreshed", description: "Data updated" });
    };
    ```

### Components Added

-   Skeleton loading components for better UX
-   RefreshCw button in both dashboards
-   Error toast notifications
-   Empty state handling (no data scenarios)

### Status

🔄 **IN PROGRESS** - 2 of 16 pages completed

-   ✅ Builder Dashboard - Completed
-   ✅ Customer Dashboard - Completed
-   🔄 14 pages remaining

---

## 📊 Current Project Status

### ✅ Completed

-   [x] Modular backend architecture
-   [x] Database setup and permissions
-   [x] API client and service layer
-   [x] Login/Register pages with backend integration
-   [x] Enum value validation fix (422 error)
-   [x] Password hashing fix (bcrypt compatibility)
-   [x] JWT authentication flow
-   [x] Token management
-   [x] Error handling infrastructure

### 🔄 In Progress

-   [ ] Replace hardcoded data with API calls (Current)
-   [ ] Dashboard data integration
-   [ ] Real-time updates

### 📋 Pending

-   [ ] Protected routes implementation
-   [ ] Refresh token rotation
-   [ ] File upload functionality
-   [ ] WebSocket for real-time messaging
-   [ ] Notification system
-   [ ] Payment gateway integration
-   [ ] 3D model viewer integration

---

## 🛠️ Technical Stack

### Backend

-   **Framework:** FastAPI 0.116.1
-   **Database:** PostgreSQL
-   **ORM:** SQLAlchemy 2.0
-   **Validation:** Pydantic v2
-   **Authentication:** JWT (python-jose)
-   **Password Hashing:** bcrypt (direct)
-   **Server:** Uvicorn

### Frontend

-   **Framework:** Next.js 14 (App Router)
-   **Language:** TypeScript
-   **UI Library:** shadcn/ui
-   **Styling:** Tailwind CSS
-   **HTTP Client:** Axios
-   **State Management:** React Hooks
-   **Icons:** Lucide React

---

## 📁 Project Structure

```
RealEstate/
├── fastapi/
│   ├── main.py                 # Root entry point
│   ├── database/
│   │   ├── __init__.py
│   │   ├── auth.py            # JWT authentication
│   │   ├── crud.py            # Database operations
│   │   ├── database.py        # DB connection
│   │   ├── models.py          # SQLAlchemy models
│   │   └── schemas.py         # Pydantic schemas
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── projects.py
│   │   ├── units.py
│   │   ├── bookings.py
│   │   ├── appointments.py
│   │   ├── messages.py
│   │   ├── payments.py
│   │   └── notifications.py
│   └── tests/
│       ├── test_schema.py
│       └── test_bcrypt.py
│
├── nextjs/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── builder/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── projects/
│   │   │   │   ├── bookings/
│   │   │   │   └── ... (other pages)
│   │   │   └── customer/
│   │   │       ├── dashboard/
│   │   │       ├── projects/
│   │   │       ├── bookings/
│   │   │       └── ... (other pages)
│   │   ├── lib/
│   │   │   ├── api-config.ts
│   │   │   ├── api-client.ts
│   │   │   └── services/
│   │   │       ├── index.ts
│   │   │       ├── auth.service.ts
│   │   │       ├── projects.service.ts
│   │   │       ├── bookings.service.ts
│   │   │       ├── appointments.service.ts
│   │   │       ├── messages.service.ts
│   │   │       ├── payments.service.ts
│   │   │       └── notifications.service.ts
│   │   └── components/
│   │       ├── ui/ (shadcn components)
│   │       ├── builder/
│   │       └── customer/
│   └── .env.local
│
└── Documentation/
    └── CHANGELOG.md (this file)
```

---

## 🔑 Key Configuration

### Environment Variables

**Backend (.env):**

```env
DATABASE_URL=postgresql://om_patil:your_password@localhost/realestate_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

**Frontend (.env.local):**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🚀 Running the Application

### Backend

```bash
cd fastapi
python init_database.py  # First time only
uvicorn main:app --reload
```

Access API docs: http://localhost:8000/api/docs

### Frontend

```bash
cd nextjs
npm run dev
```

Access app: http://localhost:3000

---

## 🧪 Testing

### Backend Tests

```bash
cd fastapi
python test_schema.py     # Test Pydantic schemas
python test_bcrypt.py     # Test password hashing
```

### Manual Testing Checklist

-   [ ] Builder registration
-   [ ] Customer registration
-   [ ] Builder login
-   [ ] Customer login
-   [ ] Token refresh
-   [ ] Protected routes
-   [ ] API endpoints
-   [ ] Error handling

---

## 🐛 Known Issues & Solutions

### Issue: 422 Unprocessable Content

**Cause:** Uppercase enum values  
**Solution:** Use lowercase: `"builder"`, `"customer"`

### Issue: Password hashing ValueError

**Cause:** passlib + bcrypt 4.0+ incompatibility  
**Solution:** Use bcrypt directly (implemented)

### Issue: Database permission denied

**Cause:** PostgreSQL 15+ security  
**Solution:** Grant CREATE on schema public (fixed)

---

## 📝 Development Notes

### Enum Values Convention

-   **All backend enums use lowercase values**
-   Frontend must send lowercase values
-   Example: `user_type: "builder"` not `"BUILDER"`

### Authentication Flow

1. User registers → Server returns JWT + refresh token
2. Tokens stored in localStorage
3. API client auto-injects token in headers
4. Token expires → Use refresh token
5. Logout → Clear localStorage

### Data Structure Pattern

-   Backend expects nested objects: `builder_data: {...}` or `customer_data: {...}`
-   Frontend transforms flat form data to nested before sending
-   Customer names: split `full_name` → `first_name`, `last_name`

---

## 🔜 Next Steps

### Immediate (Current Session)

1. ✅ Create unified changelog (this file)
2. 🔄 Replace hardcoded data with API calls
3. 🔄 Implement loading states
4. 🔄 Add error boundaries

### Short Term

-   [ ] Protected route middleware
-   [ ] Refresh token rotation
-   [ ] Optimistic UI updates
-   [ ] Data caching strategy

### Medium Term

-   [ ] File upload for documents
-   [ ] Image optimization
-   [ ] Real-time messaging (WebSocket)
-   [ ] Push notifications
-   [ ] Payment integration

### Long Term

-   [ ] 3D model viewer
-   [ ] Virtual site tours
-   [ ] Mobile app (React Native)
-   [ ] Admin dashboard
-   [ ] Analytics & reporting

---

## 📚 Documentation Index

All documentation consolidated into this single CHANGELOG.md file.

**Previous Documentation Files (Now Merged):**

-   ~~MODULAR_ARCHITECTURE.md~~ → Section: Backend Modular Architecture
-   ~~QUICKSTART.md~~ → Section: Running the Application
-   ~~DATABASE_PERMISSION_FIX.md~~ → Section: Database Permission Issues
-   ~~PERMISSION_ERROR_FIX.md~~ → Section: Database Permission Issues
-   ~~FRONTEND_BACKEND_INTEGRATION.md~~ → Section: Frontend-Backend Integration
-   ~~API_INTEGRATION_SUMMARY.md~~ → Section: Frontend-Backend Integration
-   ~~ENUM_VALUES_REFERENCE.md~~ → Section: Enum Value Validation Fix
-   ~~FIX_422_ERROR.md~~ → Section: Enum Value Validation Fix
-   ~~PASSWORD_HASHING_FIX.md~~ → Section: Password Hashing Fix
-   ~~COMPLETE_FIX_SUMMARY.md~~ → Multiple sections

---

## 👥 Contributors

-   Development: AI Assistant + om_patil
-   Architecture: Modular FastAPI + Next.js App Router
-   Database: PostgreSQL with SQLAlchemy

---

## � Session 6: Frontend API Integration (Complete Data Replacement)

### Date: Current Session

### Objective

Replace all hardcoded/predefined frontend data with live API calls from the backend.

### Changes Made

#### 1. **Builder Dashboard Integration** ✅

**File:** `/nextjs/src/app/builder/dashboard/page.tsx`

-   **API Integration:**

    -   Projects: `projectsService.getProjects({ page: 1, limit: 3 })`
    -   Bookings: `bookingsService.getBuilderBookings({ page: 1, limit: 5, status: 'pending' })`
    -   Appointments: `appointmentsService.getAppointments({ page: 1, limit: 3 })`

-   **Features Added:**
    -   Loading states with Skeleton components
    -   Refresh button with `refreshDashboard()` function
    -   Toast notifications for errors
    -   Live stats calculation (total projects, active projects, pending bookings, upcoming appointments)
    -   Data transformation for display format

#### 2. **Customer Dashboard Integration** ✅

**File:** `/nextjs/src/app/customer/dashboard/page.tsx`

-   **API Integration:**

    -   User info from localStorage: `JSON.parse(localStorage.getItem('user'))`
    -   Bookings: `bookingsService.getCustomerBookings(userId)`
    -   Appointments: `appointmentsService.getAppointments({ page: 1, limit: 3 })`
    -   Notifications: `notificationsService.getNotifications({ unread_only: false, limit: 3 })`

-   **Features Added:**
    -   Loading states with Skeleton components
    -   Refresh button with toast notification
    -   Error handling with try/catch blocks
    -   Data transformation for recent activities

#### 3. **Customer Projects Page Integration** ✅

**File:** `/nextjs/src/app/customer/projects/page.tsx`

-   **Issue Fixed:** User reported "its still showing predefined projects in client projects section"

-   **Changes:**

    -   Removed 100+ lines of hardcoded project data
    -   Integrated `projectsService.getProjects()` with filter parameters
    -   Updated card rendering to use API field names:
        -   `project.name` → `project.project_name`
        -   `project.priceRange` → `price_range_start / price_range_end`
        -   `project.availableUnits` → `project.available_units`
    -   Removed non-API fields: `bedrooms`, `bathrooms`, `rating`, `reviews`
    -   Fixed status badge: `project.status?.replace('_', ' ')`

-   **Features Added:**
    -   Loading skeletons (6 project cards)
    -   Refresh button with `refreshProjects()` function
    -   Empty state with "No projects found" message
    -   Clear filters button in empty state
    -   Filter dependencies: useEffect triggers on `locationFilter`, `propertyType`, `priceRange` changes
    -   API filters: `location`, `project_type`, `min_price`, `max_price`
    -   Type annotations for amenities map: `(amenity: string) => ...`

### API Integration Pattern Established

```typescript
// Pattern used for all pages:
// 1. Add "use client" directive
// 2. Import services and hooks (useState, useEffect, useToast)
// 3. Add state: isLoading, data arrays
// 4. Create fetchData async function
// 5. useEffect(() => { fetchData() }, [dependencies])
// 6. Loading skeleton if isLoading
// 7. Update rendering to use API field names
// 8. Add refresh button
// 9. Error handling with toast notifications
```

### Progress Tracking

-   ✅ Builder Dashboard - Completed (projects, bookings, appointments)
-   ✅ Customer Dashboard - Completed (bookings, appointments, notifications)
-   ✅ Customer Projects Page - Completed (projects with filters, empty state)
-   ✅ Customer Bookings Page - Completed (bookings, pre-bookings with API integration)
-   🔄 Customer Appointments Page - In Progress (API integrated, rendering updates needed)
-   📋 Remaining Pages (11):
    -   Customer: 3D models, progress tracking, change requests, messages, notifications (5 pages)
    -   Builder: projects, bookings, appointments, messages, progress, models (6 pages)

### API Response Structures

-   `projectsService.getProjects()` → `{ projects: [], total, page, limit }`
-   `bookingsService.getBuilderBookings()` → `{ bookings: [], total, stats }`
-   `bookingsService.getCustomerBookings(userId)` → `Booking[]`
-   `appointmentsService.getAppointments()` → `Appointment[]`
-   `notificationsService.getNotifications()` → `Notification[]`

### Key Field Mappings

-   Project: `project_name`, `location`, `description`, `price_range_start/end`, `total_units`, `available_units`, `amenities[]`, `status`
-   User from localStorage: `{ id, full_name, email, user_type }`
-   All enum values are lowercase: `"builder"`, `"customer"`, `"in_progress"`, etc.

### Bug Fixes

### Bug Fixes

-   **TypeError in get_projects()**: Fixed `crud.get_projects()` expecting `ProjectFilter` schema object instead of individual parameters

    -   Route now creates `ProjectFilter` object with page, limit, city, project_type, status, min_price, max_price, builder_id
    -   Added `location` parameter as alias for `city` to maintain frontend compatibility
    -   Removed deprecated `skip` parameter and `get_projects_count()` call
    -   Returns structured response: `{ projects: [], pagination: {...} }`

-   **403 Forbidden on /api/appointments for customers**: Fixed appointments endpoint authorization

    -   Changed from `require_builder` (builder-only) to `get_current_user` (both user types)
    -   Builders see appointments for their projects
    -   Customers see their own appointments
    -   Both get appropriate stats and filtering
    -   Resolves "customer is not authorized to see appointments" error

-   **Missing CRUD functions in projects routes**: Fixed function name mismatches
    -   `/api/projects/{id}/progress` - Changed from `crud.get_project_progress()` to `crud.get_progress_by_project()`
    -   `/api/projects/{id}/updates` - Changed from `crud.get_construction_updates()` to `crud.get_updates_by_project()`
    -   Routes now call the correct CRUD functions that actually exist in database/crud.py

---

---

## �📄 License

[Add your license here]

---

**Last Updated:** October 10, 2025  
**Version:** 1.0.0  
**Status:** Active Development
