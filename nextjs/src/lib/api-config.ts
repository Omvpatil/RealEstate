/**
 * API Configuration for BuildCraft RealEstate
 *
 * This file contains the base configuration for all API calls
 */

// Base API URL - can be configured via environment variable
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// API Endpoints
export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        ME: "/api/auth/me",
    },

    // Projects
    PROJECTS: {
        LIST: "/api/projects",
        GET: (id: number) => `/api/projects/${id}`,
        CREATE: "/api/projects",
        UPDATE: (id: number) => `/api/projects/${id}`,
        DELETE: (id: number) => `/api/projects/${id}`,
        UNITS: (id: number) => `/api/projects/${id}/units`,
        PROGRESS: (id: number) => `/api/projects/${id}/progress`,
        UPDATES: (id: number) => `/api/projects/${id}/updates`,
    },

    // Units
    UNITS: {
        CREATE: "/api/units",
    },

    // Bookings
    BOOKINGS: {
        CREATE: "/api/bookings",
        CUSTOMER: (customerId: number) => `/api/bookings/customer/${customerId}`,
        BUILDER: "/api/builder/bookings",
        GET: (id: number) => `/api/bookings/${id}`,
        UPDATE_STATUS: (id: number) => `/api/bookings/${id}/status`,
        PAYMENTS: (id: number) => `/api/bookings/${id}/payments`,
        GENERATE_AGREEMENT: (id: number) => `/api/bookings/${id}/generate-agreement`,
        DOWNLOAD_AGREEMENT: (id: number) => `/api/bookings/${id}/download-agreement`,
    },

    // Appointments
    APPOINTMENTS: {
        CREATE: "/api/appointments",
        CUSTOMER: (customerId: number) => `/api/appointments/customer/${customerId}`,
        PROJECT: (projectId: number) => `/api/appointments/project/${projectId}`,
        LIST: "/api/appointments",
        GET: (id: number) => `/api/appointments/${id}`,
        UPDATE_STATUS: (id: number) => `/api/appointments/${id}/status`,
        RESCHEDULE: (id: number) => `/api/appointments/${id}/reschedule`,
        CANCEL: (id: number) => `/api/appointments/${id}`,
    },

    // Messages
    MESSAGES: {
        CONVERSATIONS: "/api/messages/conversations",
        CONVERSATION: (customerId: number, projectId: number) =>
            `/api/messages/conversation/${customerId}/${projectId}`,
        SEND: "/api/messages",
        MARK_READ: (conversationId: number) => `/api/messages/conversation/${conversationId}/read`,
        LIST: "/api/messages",
    },

    // Payments
    PAYMENTS: {
        CREATE: "/api/payments",
    },

    // Notifications
    NOTIFICATIONS: {
        LIST: "/api/notifications",
        MARK_READ: (id: number) => `/api/notifications/${id}/read`,
    },

    // Change Requests
    CHANGE_REQUESTS: {
        LIST: "/api/change-requests",
        CREATE: "/api/change-requests",
        GET: (id: number) => `/api/change-requests/${id}`,
        UPDATE: (id: number) => `/api/change-requests/${id}`,
    },

    // Health
    HEALTH: "/health",
};

// Token storage keys
export const TOKEN_KEYS = {
    ACCESS_TOKEN: "buildcraft_access_token",
    REFRESH_TOKEN: "buildcraft_refresh_token",
    USER: "buildcraft_user",
};
