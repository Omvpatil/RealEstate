# Builder Pages - Backend API Integration Guide

This document provides comprehensive API documentation for integrating the Builder frontend pages with the FastAPI backend.

---

## 📋 Table of Contents

1. [Messages Page](#messages-page)
2. [Appointments Page](#appointments-page)
3. [Bookings Page](#bookings-page)
4. [API Authentication](#api-authentication)
5. [Error Handling](#error-handling)
6. [TypeScript Types](#typescript-types)

---

## 💬 Messages Page

### API Endpoints for Messages

#### 1. Get All Conversations

**Endpoint:** `GET /api/messages/conversations`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
    "conversations": [
        {
            "id": 1,
            "customer_id": 101,
            "customer_name": "Jreact-day-pickerohn Smith",
            "customer_avatar": "/avatars/john.jpg",
            "project_id": 1,
            "project_name": "Sunset Residences",
            "last_message": "When can I schedule the site visit?",
            "last_message_time": "2024-10-08T14:30:00Z",
            "unread_count": 2,
            "status": "active"
        }
    ],
    "total": 15
}
```

#### 2. Get Messages in a Conversation

**Endpoint:** `GET /api/messages/conversation/{customer_id}/{project_id}`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

-   `page` (optional): Page number (default: 1)
-   `limit` (optional): Messages per page (default: 50)

**Response:**

```json
{
    "messages": [
        {
            "id": 1,
            "sender_id": 101,
            "sender_type": "customer",
            "recipient_id": 1,
            "recipient_type": "builder",
            "content": "Hi, I'm interested in booking a unit",
            "attachment_url": null,
            "created_at": "2024-10-08T14:30:00Z",
            "is_read": true
        },
        {
            "id": 2,
            "sender_id": 1,
            "sender_type": "builder",
            "recipient_id": 101,
            "recipient_type": "customer",
            "content": "Hello! I'd be happy to help you.",
            "attachment_url": null,
            "created_at": "2024-10-08T14:35:00Z",
            "is_read": true
        }
    ],
    "total": 25,
    "page": 1,
    "limit": 50
}
```

#### 3. Send Message

**Endpoint:** `POST /api/messages`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "recipient_id": 101,
    "recipient_type": "customer",
    "project_id": 1,
    "content": "I can arrange a site visit this weekend.",
    "attachment_url": "https://example.com/floor-plan.pdf"
}
```

**Response:**

```json
{
    "id": 3,
    "sender_id": 1,
    "sender_type": "builder",
    "recipient_id": 101,
    "recipient_type": "customer",
    "content": "I can arrange a site visit this weekend.",
    "attachment_url": "https://example.com/floor-plan.pdf",
    "created_at": "2024-10-08T15:00:00Z",
    "is_read": false
}
```

#### 4. Mark Conversation as Read

**Endpoint:** `PATCH /api/messages/conversation/{conversation_id}/read`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
    "success": true,
    "marked_read": 2
}
```

#### 5. Upload Attachment

**Endpoint:** `POST /api/messages/upload-attachment`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**

-   `file`: File to upload

**Response:**

```json
{
    "url": "https://cdn.example.com/attachments/abc123.pdf",
    "filename": "floor-plan.pdf",
    "size": 1024567,
    "content_type": "application/pdf"
}
```

### Frontend Integration Example (Messages)

```typescript
// api/messages.ts
import { apiClient } from "./client";

export const messagesApi = {
    // Get all conversations
    getConversations: async () => {
        const response = await apiClient.get("/api/messages/conversations");
        return response.data;
    },

    // Get messages in conversation
    getConversationMessages: async (customerId: number, projectId: number, page = 1) => {
        const response = await apiClient.get(`/api/messages/conversation/${customerId}/${projectId}`, {
            params: { page, limit: 50 },
        });
        return response.data;
    },

    // Send message
    sendMessage: async (data: {
        recipient_id: number;
        recipient_type: "customer" | "builder";
        project_id: number;
        content: string;
        attachment_url?: string;
    }) => {
        const response = await apiClient.post("/api/messages", data);
        return response.data;
    },

    // Mark as read
    markAsRead: async (conversationId: number) => {
        const response = await apiClient.patch(`/api/messages/conversation/${conversationId}/read`);
        return response.data;
    },

    // Upload attachment
    uploadAttachment: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await apiClient.post("/api/messages/upload-attachment", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },
};
```

---

## 📅 Appointments Page

### API Endpoints for Appointments

#### 1. Get All Appointments (Builder)

**Endpoint:** `GET /api/appointments`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

-   `page` (optional): Page number (default: 1)
-   `limit` (optional): Appointments per page (default: 10)
-   `status` (optional): Filter by status (pending, confirmed, completed, cancelled)
-   `type` (optional): Filter by type (site_visit, virtual_tour, design_review, progress_update, documentation)
-   `project_id` (optional): Filter by project ID

**Response:**

```json
{
    "appointments": [
        {
            "id": 1,
            "customer": {
                "id": 101,
                "name": "John Smith",
                "email": "john@example.com",
                "phone": "+1-234-567-8901"
            },
            "project": {
                "id": 1,
                "name": "Sunset Residences"
            },
            "appointment_type": "site_visit",
            "appointment_date": "2024-10-10T10:00:00Z",
            "duration_minutes": 60,
            "meeting_location": "Project Site, Downtown",
            "status": "confirmed",
            "notes": "First-time visit, interested in 2BHK units",
            "created_by": "customer",
            "created_at": "2024-10-08T14:30:00Z"
        }
    ],
    "total": 25,
    "page": 1,
    "limit": 10,
    "stats": {
        "total": 25,
        "confirmed": 10,
        "pending": 8,
        "completed": 5,
        "cancelled": 2
    }
}
```

#### 2. Get Appointment by ID

**Endpoint:** `GET /api/appointments/{appointment_id}`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
    "id": 1,
    "customer": {
        "id": 101,
        "name": "John Smith",
        "email": "john@example.com",
        "phone": "+1-234-567-8901"
    },
    "project": {
        "id": 1,
        "name": "Sunset Residences",
        "location": "Downtown District"
    },
    "appointment_type": "site_visit",
    "appointment_date": "2024-10-10T10:00:00Z",
    "duration_minutes": 60,
    "meeting_location": "Project Site, Downtown",
    "status": "confirmed",
    "notes": "First-time visit, interested in 2BHK units",
    "created_by": "customer",
    "created_at": "2024-10-08T14:30:00Z",
    "updated_at": "2024-10-08T15:00:00Z"
}
```

#### 3. Create Appointment

**Endpoint:** `POST /api/appointments`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "customer_id": 101,
    "project_id": 1,
    "appointment_type": "site_visit",
    "appointment_date": "2024-10-10T10:00:00Z",
    "duration_minutes": 60,
    "meeting_location": "Project Site, Downtown",
    "notes": "Customer wants to see 2BHK units",
    "created_by": "builder"
}
```

**Response:**

```json
{
    "id": 1,
    "customer_id": 101,
    "project_id": 1,
    "appointment_type": "site_visit",
    "appointment_date": "2024-10-10T10:00:00Z",
    "duration_minutes": 60,
    "meeting_location": "Project Site, Downtown",
    "status": "pending",
    "notes": "Customer wants to see 2BHK units",
    "created_by": "builder",
    "created_at": "2024-10-08T15:00:00Z"
}
```

#### 4. Update Appointment Status

**Endpoint:** `PATCH /api/appointments/{appointment_id}/status`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "status": "confirmed"
}
```

**Response:**

```json
{
    "id": 1,
    "status": "confirmed",
    "updated_at": "2024-10-08T15:30:00Z"
}
```

#### 5. Reschedule Appointment

**Endpoint:** `PATCH /api/appointments/{appointment_id}/reschedule`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "appointment_date": "2024-10-12T14:00:00Z",
    "meeting_location": "Virtual - Zoom Link"
}
```

#### 6. Cancel Appointment

**Endpoint:** `DELETE /api/appointments/{appointment_id}`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
    "success": true,
    "message": "Appointment cancelled successfully"
}
```

### Frontend Integration Example (Appointments)

```typescript
// api/appointments.ts
import { apiClient } from "./client";

export const appointmentsApi = {
    // Get all appointments with filters
    getAppointments: async (filters?: {
        page?: number;
        limit?: number;
        status?: string;
        type?: string;
        project_id?: number;
    }) => {
        const response = await apiClient.get("/api/appointments", {
            params: filters,
        });
        return response.data;
    },

    // Get appointment by ID
    getAppointment: async (id: number) => {
        const response = await apiClient.get(`/api/appointments/${id}`);
        return response.data;
    },

    // Create appointment
    createAppointment: async (data: {
        customer_id: number;
        project_id: number;
        appointment_type: string;
        appointment_date: string;
        duration_minutes: number;
        meeting_location: string;
        notes?: string;
    }) => {
        const response = await apiClient.post("/api/appointments", data);
        return response.data;
    },

    // Update status
    updateStatus: async (id: number, status: string) => {
        const response = await apiClient.patch(`/api/appointments/${id}/status`, { status });
        return response.data;
    },

    // Reschedule
    reschedule: async (
        id: number,
        data: {
            appointment_date: string;
            meeting_location?: string;
        }
    ) => {
        const response = await apiClient.patch(`/api/appointments/${id}/reschedule`, data);
        return response.data;
    },

    // Cancel
    cancel: async (id: number) => {
        const response = await apiClient.delete(`/api/appointments/${id}`);
        return response.data;
    },
};
```

---

## 📝 Bookings Page

### API Endpoints for Bookings

#### 1. Get All Bookings (Builder)

**Endpoint:** `GET /api/builder/bookings`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

-   `page` (optional): Page number (default: 1)
-   `limit` (optional): Bookings per page (default: 10)
-   `status` (optional): Filter by status (pending, active, completed, cancelled)
-   `project_id` (optional): Filter by project ID
-   `payment_status` (optional): Filter by payment status (pending, partial, completed)

**Response:**

```json
{
    "bookings": [
        {
            "id": 1,
            "booking_number": "BK-001",
            "customer": {
                "id": 101,
                "name": "John Smith",
                "email": "john@example.com",
                "phone": "+1-234-567-8901"
            },
            "project": {
                "id": 1,
                "name": "Sunset Residences"
            },
            "unit": {
                "id": 204,
                "number": "A-204",
                "type": "2BHK",
                "floor": 2,
                "area_sqft": 1200
            },
            "total_amount": 7500000,
            "token_amount": 500000,
            "paid_amount": 2000000,
            "pending_amount": 5500000,
            "payment_plan": "installments",
            "booking_date": "2024-09-15",
            "status": "active",
            "payment_progress": 26.67,
            "next_payment_due": "2024-11-01",
            "next_payment_amount": 1500000
        }
    ],
    "total": 45,
    "page": 1,
    "limit": 10,
    "stats": {
        "total_bookings": 45,
        "active_bookings": 30,
        "completed_bookings": 12,
        "total_revenue": 125000000,
        "pending_revenue": 85000000
    }
}
```

#### 2. Get Booking Details

**Endpoint:** `GET /api/bookings/{booking_id}`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
    "id": 1,
    "booking_number": "BK-001",
    "customer": {
        "id": 101,
        "name": "John Smith",
        "email": "john@example.com",
        "phone": "+1-234-567-8901",
        "address": "123 Main St, City"
    },
    "project": {
        "id": 1,
        "name": "Sunset Residences",
        "location": "Downtown District"
    },
    "unit": {
        "id": 204,
        "number": "A-204",
        "type": "2BHK",
        "floor": 2,
        "area_sqft": 1200,
        "price": 7500000
    },
    "total_amount": 7500000,
    "token_amount": 500000,
    "paid_amount": 2000000,
    "pending_amount": 5500000,
    "payment_plan": "installments",
    "booking_date": "2024-09-15",
    "status": "active",
    "agreement_signed": true,
    "agreement_url": "https://cdn.example.com/agreements/BK-001.pdf",
    "payments": [
        {
            "id": 1,
            "payment_type": "token",
            "amount": 500000,
            "payment_date": "2024-09-15",
            "payment_method": "bank_transfer",
            "transaction_id": "TXN123456",
            "status": "completed"
        },
        {
            "id": 2,
            "payment_type": "installment",
            "amount": 1500000,
            "payment_date": "2024-09-30",
            "payment_method": "bank_transfer",
            "transaction_id": "TXN123457",
            "status": "completed"
        }
    ],
    "created_at": "2024-09-15T10:00:00Z",
    "updated_at": "2024-09-30T14:30:00Z"
}
```

#### 3. Create Booking

**Endpoint:** `POST /api/bookings`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "customer_id": 101,
    "unit_id": 204,
    "total_amount": 7500000,
    "token_amount": 500000,
    "payment_plan": "installments"
}
```

**Response:**

```json
{
    "id": 1,
    "booking_number": "BK-001",
    "customer_id": 101,
    "unit_id": 204,
    "total_amount": 7500000,
    "token_amount": 500000,
    "paid_amount": 0,
    "pending_amount": 7500000,
    "payment_plan": "installments",
    "status": "pending",
    "booking_date": "2024-10-08",
    "created_at": "2024-10-08T15:00:00Z"
}
```

#### 4. Update Booking Status

**Endpoint:** `PATCH /api/bookings/{booking_id}/status`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "status": "active"
}
```

**Response:**

```json
{
    "id": 1,
    "status": "active",
    "updated_at": "2024-10-08T16:00:00Z"
}
```

#### 5. Get Booking Payments

**Endpoint:** `GET /api/bookings/{booking_id}/payments`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
    "booking_id": 1,
    "payments": [
        {
            "id": 1,
            "payment_type": "token",
            "amount": 500000,
            "payment_date": "2024-09-15",
            "payment_method": "bank_transfer",
            "transaction_id": "TXN123456",
            "status": "completed",
            "receipt_url": "https://cdn.example.com/receipts/payment-1.pdf"
        }
    ],
    "total_paid": 2000000,
    "total_pending": 5500000,
    "payment_schedule": [
        {
            "installment_number": 3,
            "due_date": "2024-11-01",
            "amount": 1500000,
            "status": "pending"
        },
        {
            "installment_number": 4,
            "due_date": "2024-12-01",
            "amount": 1500000,
            "status": "pending"
        }
    ]
}
```

#### 6. Record Payment

**Endpoint:** `POST /api/payments`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "booking_id": 1,
    "payment_type": "installment",
    "amount": 1500000,
    "payment_method": "bank_transfer",
    "transaction_id": "TXN123458",
    "payment_date": "2024-10-08",
    "notes": "Third installment payment"
}
```

**Response:**

```json
{
    "id": 3,
    "booking_id": 1,
    "payment_type": "installment",
    "amount": 1500000,
    "payment_method": "bank_transfer",
    "transaction_id": "TXN123458",
    "payment_date": "2024-10-08",
    "status": "completed",
    "receipt_url": "https://cdn.example.com/receipts/payment-3.pdf",
    "created_at": "2024-10-08T16:30:00Z"
}
```

#### 7. Generate Booking Agreement

**Endpoint:** `POST /api/bookings/{booking_id}/generate-agreement`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
    "booking_id": 1,
    "agreement_url": "https://cdn.example.com/agreements/BK-001.pdf",
    "generated_at": "2024-10-08T17:00:00Z"
}
```

#### 8. Download Booking Agreement

**Endpoint:** `GET /api/bookings/{booking_id}/download-agreement`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:** PDF file download

### Frontend Integration Example (Bookings)

```typescript
// api/bookings.ts
import { apiClient } from "./client";

export const bookingsApi = {
    // Get all bookings with filters
    getBookings: async (filters?: {
        page?: number;
        limit?: number;
        status?: string;
        project_id?: number;
        payment_status?: string;
    }) => {
        const response = await apiClient.get("/api/builder/bookings", {
            params: filters,
        });
        return response.data;
    },

    // Get booking details
    getBooking: async (id: number) => {
        const response = await apiClient.get(`/api/bookings/${id}`);
        return response.data;
    },

    // Create booking
    createBooking: async (data: {
        customer_id: number;
        unit_id: number;
        total_amount: number;
        token_amount: number;
        payment_plan: string;
    }) => {
        const response = await apiClient.post("/api/bookings", data);
        return response.data;
    },

    // Update status
    updateStatus: async (id: number, status: string) => {
        const response = await apiClient.patch(`/api/bookings/${id}/status`, { status });
        return response.data;
    },

    // Get payments
    getPayments: async (bookingId: number) => {
        const response = await apiClient.get(`/api/bookings/${bookingId}/payments`);
        return response.data;
    },

    // Record payment
    recordPayment: async (data: {
        booking_id: number;
        payment_type: string;
        amount: number;
        payment_method: string;
        transaction_id: string;
        payment_date: string;
        notes?: string;
    }) => {
        const response = await apiClient.post("/api/payments", data);
        return response.data;
    },

    // Generate agreement
    generateAgreement: async (bookingId: number) => {
        const response = await apiClient.post(`/api/bookings/${bookingId}/generate-agreement`);
        return response.data;
    },

    // Download agreement
    downloadAgreement: async (bookingId: number) => {
        const response = await apiClient.get(`/api/bookings/${bookingId}/download-agreement`, { responseType: "blob" });
        return response.data;
    },
};
```

---

## 🔐 API Authentication

### Setting Up API Client

```typescript
// api/client.ts
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add authentication token to requests
apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Handle token refresh
apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh_token");
                const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
                    refresh_token: refreshToken,
                });

                const { access_token } = response.data;
                localStorage.setItem("access_token", access_token);

                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Redirect to login
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
```

---

## ⚠️ Error Handling

### Standard Error Response Format

```json
{
    "detail": "Error message",
    "error_code": "BOOKING_NOT_FOUND",
    "status_code": 404
}
```

### Common Error Codes

| Code                   | Status | Description              |
| ---------------------- | ------ | ------------------------ |
| `UNAUTHORIZED`         | 401    | Invalid or missing token |
| `FORBIDDEN`            | 403    | Insufficient permissions |
| `NOT_FOUND`            | 404    | Resource not found       |
| `VALIDATION_ERROR`     | 422    | Invalid request data     |
| `BOOKING_NOT_FOUND`    | 404    | Booking doesn't exist    |
| `APPOINTMENT_CONFLICT` | 409    | Time slot already booked |
| `PAYMENT_FAILED`       | 400    | Payment processing error |

### Frontend Error Handling

```typescript
// utils/errorHandler.ts
export const handleApiError = (error: any) => {
    if (error.response) {
        // Server responded with error
        const { status, data } = error.response;

        switch (status) {
            case 401:
                // Redirect to login
                window.location.href = "/login";
                break;
            case 403:
                toast.error("You do not have permission to perform this action");
                break;
            case 404:
                toast.error(data.detail || "Resource not found");
                break;
            case 422:
                // Validation errors
                const errors = data.detail.map((e: any) => e.msg).join(", ");
                toast.error(errors);
                break;
            default:
                toast.error(data.detail || "An error occurred");
        }
    } else if (error.request) {
        // Request made but no response
        toast.error("Network error. Please check your connection.");
    } else {
        // Other errors
        toast.error("An unexpected error occurred");
    }
};
```

---

## 📘 TypeScript Types

### Message Types

```typescript
export interface Conversation {
    id: number;
    customer_id: number;
    customer_name: string;
    customer_avatar: string;
    project_id: number;
    project_name: string;
    last_message: string;
    last_message_time: string;
    unread_count: number;
    status: "active" | "archived";
}

export interface Message {
    id: number;
    sender_id: number;
    sender_type: "customer" | "builder";
    recipient_id: number;
    recipient_type: "customer" | "builder";
    content: string;
    attachment_url?: string;
    created_at: string;
    is_read: boolean;
}
```

### Appointment Types

```typescript
export interface Appointment {
    id: number;
    customer: {
        id: number;
        name: string;
        email: string;
        phone: string;
    };
    project: {
        id: number;
        name: string;
        location?: string;
    };
    appointment_type: "site_visit" | "virtual_tour" | "design_review" | "progress_update" | "documentation";
    appointment_date: string;
    duration_minutes: number;
    meeting_location: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    notes?: string;
    created_by: "customer" | "builder";
    created_at: string;
    updated_at: string;
}

export interface AppointmentStats {
    total: number;
    confirmed: number;
    pending: number;
    completed: number;
    cancelled: number;
}
```

### Booking Types

```typescript
export interface Booking {
    id: number;
    booking_number: string;
    customer: {
        id: number;
        name: string;
        email: string;
        phone: string;
    };
    project: {
        id: number;
        name: string;
    };
    unit: {
        id: number;
        number: string;
        type: string;
        floor: number;
        area_sqft: number;
    };
    total_amount: number;
    token_amount: number;
    paid_amount: number;
    pending_amount: number;
    payment_plan: "one_time" | "installments" | "construction_linked";
    booking_date: string;
    status: "pending" | "active" | "completed" | "cancelled";
    payment_progress: number;
    next_payment_due?: string;
    next_payment_amount?: number;
}

export interface Payment {
    id: number;
    booking_id: number;
    payment_type: "token" | "installment" | "final" | "other";
    amount: number;
    payment_date: string;
    payment_method: "cash" | "bank_transfer" | "cheque" | "card" | "upi";
    transaction_id: string;
    status: "pending" | "completed" | "failed";
    receipt_url?: string;
    notes?: string;
}

export interface BookingStats {
    total_bookings: number;
    active_bookings: number;
    completed_bookings: number;
    total_revenue: number;
    pending_revenue: number;
}
```

---

## 🚀 Quick Integration Checklist

### Messages Page

-   [ ] Setup API client with authentication
-   [ ] Implement `getConversations()` on page load
-   [ ] Implement `getConversationMessages()` when conversation selected
-   [ ] Implement `sendMessage()` on form submit
-   [ ] Add real-time updates with WebSocket (optional)
-   [ ] Implement file upload for attachments
-   [ ] Add error handling with toast notifications

### Appointments Page

-   [ ] Fetch appointments with filters
-   [ ] Implement create appointment modal
-   [ ] Add status update functionality
-   [ ] Implement reschedule feature
-   [ ] Add calendar view (optional)
-   [ ] Show appointment stats
-   [ ] Add notification reminders

### Bookings Page

-   [ ] Fetch bookings with pagination
-   [ ] Display booking details in modal/drawer
-   [ ] Implement payment recording
-   [ ] Show payment progress
-   [ ] Add agreement generation
-   [ ] Implement booking status updates
-   [ ] Display revenue statistics

---

## 📞 Support

For backend API issues, refer to:

-   **API Documentation**: http://localhost:8000/api/docs
-   **Quick Reference**: `/fastapi/QUICK_REFERENCE.md`
-   **Full Documentation**: `/fastapi/README.md`
-   **Architecture Guide**: `/fastapi/ARCHITECTURE.md`
