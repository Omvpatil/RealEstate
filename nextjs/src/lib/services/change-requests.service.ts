/**
 * Change Requests Service
 * Handles change request operations
 */

import { api } from "../api-client";
import { API_ENDPOINTS } from "../api-config";

export interface ChangeRequest {
    id: number;
    booking_id: number;
    request_type: "layout" | "fixtures" | "finishes" | "electrical" | "plumbing" | "other";
    request_title: string;
    request_description: string;
    current_specification?: string;
    requested_specification?: string;
    estimated_cost?: number;
    estimated_timeline_days?: number;
    status: "submitted" | "under_review" | "approved" | "rejected" | "completed";
    builder_response?: string;
    rejection_reason?: string;
    approval_date?: string;
    completion_date?: string;
    final_cost?: number;
    attachments?: string[];
    created_at: string;
}

export interface ChangeRequestCreate {
    booking_id: number;
    request_type: "layout" | "fixtures" | "finishes" | "electrical" | "plumbing" | "other";
    request_title: string;
    request_description: string;
    current_specification?: string;
    requested_specification?: string;
    attachments?: string[];
}

export interface ChangeRequestUpdate {
    status?: "submitted" | "under_review" | "approved" | "rejected" | "completed";
    estimated_cost?: number;
    estimated_timeline_days?: number;
    builder_response?: string;
    rejection_reason?: string;
    approval_date?: string;
    completion_date?: string;
    final_cost?: number;
}

export const changeRequestsService = {
    /**
     * Get all change requests for the current user
     */
    async getChangeRequests(bookingId?: number) {
        const params = bookingId ? { booking_id: bookingId } : {};
        return api.get<ChangeRequest[]>(API_ENDPOINTS.CHANGE_REQUESTS.LIST, params);
    },

    /**
     * Get a specific change request by ID
     */
    async getChangeRequest(requestId: number) {
        return api.get<ChangeRequest>(`${API_ENDPOINTS.CHANGE_REQUESTS.LIST}/${requestId}`);
    },

    /**
     * Create a new change request
     */
    async createChangeRequest(data: ChangeRequestCreate) {
        return api.post<ChangeRequest>(API_ENDPOINTS.CHANGE_REQUESTS.CREATE, data);
    },

    /**
     * Update a change request (builder only)
     */
    async updateChangeRequest(requestId: number, data: ChangeRequestUpdate) {
        return api.patch<ChangeRequest>(`${API_ENDPOINTS.CHANGE_REQUESTS.LIST}/${requestId}`, data);
    },
};
