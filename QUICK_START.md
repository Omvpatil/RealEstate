# 🎯 Quick Start Guide - Builder Pages

## ✅ What's Been Done

I've created **3 new builder pages** with matching styling and **comprehensive API documentation**:

1. **Messages Page** (`/builder/messages`) - Customer communication
2. **Appointments Page** (`/builder/appointments`) - Meeting scheduling
3. **Bookings Page** (`/builder/bookings`) - Payment tracking

---

## 📂 Files Created

### Frontend (6 files)

```
✅ nextjs/src/app/builder/messages/page.tsx
✅ nextjs/src/app/builder/messages/loading.tsx
✅ nextjs/src/app/builder/appointments/page.tsx
✅ nextjs/src/app/builder/appointments/loading.tsx
✅ nextjs/src/app/builder/bookings/page.tsx
✅ nextjs/src/app/builder/bookings/loading.tsx
```

### Documentation (3 files)

```
✅ BUILDER_PAGES_API.md        - API integration guide (600+ lines)
✅ BUILDER_PAGES_SUMMARY.md    - Implementation summary
✅ BUILDER_PAGES_FILES.md      - File structure overview
```

### Updated (2 files)

```
✏️ fastapi/README.md            - Added new endpoints
✏️ fastapi/QUICK_REFERENCE.md   - Added route references
```

---

## 🚀 View the Pages Now

```bash
cd /home/om_patil/Desktop/Codes/projects/RealEstate/nextjs
npm run dev
```

Then open:

-   **Messages**: http://localhost:3000/builder/messages
-   **Appointments**: http://localhost:3000/builder/appointments
-   **Bookings**: http://localhost:3000/builder/bookings

---

## 🔌 Connect to Backend API

### Step 1: Create API Client

Create `nextjs/src/lib/api/client.ts`:

```typescript
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// Add auth token
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

### Step 2: Create API Functions

Create `nextjs/src/lib/api/messages.ts`:

```typescript
import { apiClient } from "./client";

export const messagesApi = {
    getConversations: () => apiClient.get("/api/messages/conversations"),
    getMessages: (customerId: number, projectId: number) =>
        apiClient.get(`/api/messages/conversation/${customerId}/${projectId}`),
    sendMessage: (data: any) => apiClient.post("/api/messages", data),
};
```

### Step 3: Replace Mock Data

In each page, replace:

```typescript
// Replace this:
const mockData = [...];

// With this:
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await api.getData();
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

---

## 📚 Documentation Guide

### For Frontend Integration

👉 **Read**: `BUILDER_PAGES_API.md`

-   API endpoints for all 3 pages
-   TypeScript examples
-   Error handling
-   Authentication setup

### For Backend Reference

👉 **Read**: `fastapi/README.md`

-   Complete endpoint documentation
-   Request/response examples
-   Authentication flow

### For Quick Reference

👉 **Read**: `fastapi/QUICK_REFERENCE.md`

-   All routes at a glance
-   Common patterns
-   Quick commands

---

## 🎨 Page Features

### Messages Page

✅ Conversation list with search
✅ Message threading
✅ Send messages
✅ Attachment support
✅ Unread badges
✅ Archive/delete options

### Appointments Page

✅ Statistics (Total, Confirmed, Pending, Completed)
✅ Filter by status/type
✅ Create appointment modal
✅ Date picker
✅ Status management
✅ Customer & project details

### Bookings Page

✅ Revenue statistics
✅ Filter by status/project
✅ Payment progress bars
✅ Payment tracking
✅ Booking details
✅ Agreement download

---

## 🔗 API Endpoints Summary

### Messages (5 endpoints)

```
GET    /api/messages/conversations
GET    /api/messages/conversation/{customer_id}/{project_id}
POST   /api/messages
PATCH  /api/messages/conversation/{id}/read
POST   /api/messages/upload-attachment
```

### Appointments (6 endpoints)

```
GET    /api/appointments
GET    /api/appointments/{id}
POST   /api/appointments
PATCH  /api/appointments/{id}/status
PATCH  /api/appointments/{id}/reschedule
DELETE /api/appointments/{id}
```

### Bookings (8 endpoints)

```
GET    /api/builder/bookings
GET    /api/bookings/{id}
POST   /api/bookings
PATCH  /api/bookings/{id}/status
GET    /api/bookings/{id}/payments
POST   /api/payments
POST   /api/bookings/{id}/generate-agreement
GET    /api/bookings/{id}/download-agreement
```

---

## ⚙️ Environment Setup

Add to `nextjs/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## ✅ Integration Checklist

### Messages

-   [ ] Create `lib/api/messages.ts`
-   [ ] Replace mock data with API calls
-   [ ] Add loading states
-   [ ] Add error handling
-   [ ] Test send message
-   [ ] Test file upload

### Appointments

-   [ ] Create `lib/api/appointments.ts`
-   [ ] Replace mock data with API calls
-   [ ] Add loading states
-   [ ] Test create appointment
-   [ ] Test status updates
-   [ ] Test filters

### Bookings

-   [ ] Create `lib/api/bookings.ts`
-   [ ] Replace mock data with API calls
-   [ ] Add loading states
-   [ ] Test create booking
-   [ ] Test record payment
-   [ ] Test download agreement

---

## 🎯 Testing Flow

### 1. Start Backend

```bash
cd fastapi
uvicorn database.main:app --reload
```

API at: http://localhost:8000

### 2. Start Frontend

```bash
cd nextjs
npm run dev
```

App at: http://localhost:3000

### 3. Test Pages

1. Login as builder
2. Navigate to `/builder/messages`
3. Navigate to `/builder/appointments`
4. Navigate to `/builder/bookings`

---

## 📞 Need Help?

### Documentation

-   **BUILDER_PAGES_API.md** - Complete API guide
-   **BUILDER_PAGES_SUMMARY.md** - Full implementation details
-   **BUILDER_PAGES_FILES.md** - File structure
-   **fastapi/README.md** - Backend API docs

### API Docs

-   **Swagger**: http://localhost:8000/api/docs
-   **ReDoc**: http://localhost:8000/api/redoc

---

## 🎉 You're All Set!

All pages are created with:
✅ Consistent styling
✅ Mock data for testing
✅ Full documentation
✅ API integration ready

**Next**: Connect to real backend API using the guides! 🚀
