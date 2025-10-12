/**
 * Appointments Service
 * Handles appointment-related API calls
 */

import { api } from "../api-client";
import { API_ENDPOINTS } from "../api-config";

export interface Appointment {
    id: number;
    customer_id: number;
    project_id: number;
    appointment_date: string;
    appointment_type: string;
    status: string;
    meeting_location: string;
    notes?: string;
    created_at: string;
}

export interface AppointmentCreate {
    project_id: number;
    appointment_date: string;
    appointment_type: string;
    meeting_location: string;
    notes?: string;
}

export const appointmentsService = {
    /**
     * Create a new appointment
     */
    async createAppointment(data: AppointmentCreate) {
        return api.post<Appointment>(API_ENDPOINTS.APPOINTMENTS.CREATE, data);
    },

    /**
     * Get customer appointments
     */
    async getCustomerAppointments(customerId: number) {
        return api.get<Appointment[]>(API_ENDPOINTS.APPOINTMENTS.CUSTOMER(customerId));
    },

    /**
     * Get project appointments (Builder only)
     */
    async getProjectAppointments(projectId: number) {
        return api.get<Appointment[]>(API_ENDPOINTS.APPOINTMENTS.PROJECT(projectId));
    },

    /**
     * Get all appointments with filters and stats
     */
    async getAppointments(params?: {
        page?: number;
        limit?: number;
        status?: string;
        type?: string;
        project_id?: number;
    }) {
        return api.get<{
            appointments: Appointment[];
            total: number;
            page: number;
            limit: number;
            stats: {
                total: number;
                confirmed: number;
                pending: number;
                completed: number;
                cancelled: number;
            };
        }>(API_ENDPOINTS.APPOINTMENTS.LIST, params);
    },

    /**
     * Get appointment by ID
     */
    async getAppointment(id: number) {
        return api.get<Appointment>(API_ENDPOINTS.APPOINTMENTS.GET(id));
    },

    /**
     * Update appointment status
     */
    async updateAppointmentStatus(id: number, status: string) {
        return api.patch<Appointment>(API_ENDPOINTS.APPOINTMENTS.UPDATE_STATUS(id), { status });
    },

    /**
     * Reschedule appointment
     */
    async rescheduleAppointment(id: number, data: { appointment_date: string; meeting_location?: string }) {
        return api.patch<Appointment>(API_ENDPOINTS.APPOINTMENTS.RESCHEDULE(id), data);
    },

    /**
     * Cancel appointment
     */
    async cancelAppointment(id: number) {
        return api.delete<{ message: string }>(API_ENDPOINTS.APPOINTMENTS.CANCEL(id));
    },
};
