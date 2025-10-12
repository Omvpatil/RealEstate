/**
 * Bookings Service
 * Handles booking-related API calls
 */

import { api } from "../api-client";
import { API_ENDPOINTS } from "../api-config";

export interface Booking {
    id: number;
    customer_id: number;
    unit_id: number;
    project_id: number;
    total_amount: number;
    paid_amount: number;
    pending_amount: number;
    payment_plan: string;
    status: string;
    booking_date: string;
    agreement_url?: string;
}

export interface BookingCreate {
    unit_id: number;
    payment_plan: string;
    notes?: string;
}

export const bookingsService = {
    /**
     * Create a new booking (Customer only)
     */
    async createBooking(data: BookingCreate) {
        return api.post<Booking>(API_ENDPOINTS.BOOKINGS.CREATE, data);
    },

    /**
     * Get customer bookings
     */
    async getCustomerBookings(customerId: number) {
        return api.get<Booking[]>(API_ENDPOINTS.BOOKINGS.CUSTOMER(customerId));
    },

    /**
     * Get builder bookings with filters and stats
     */
    async getBuilderBookings(params?: {
        page?: number;
        limit?: number;
        status?: string;
        project_id?: number;
        payment_status?: string;
    }) {
        return api.get<{
            bookings: any[];
            total: number;
            page: number;
            limit: number;
            stats: {
                total_bookings: number;
                active_bookings: number;
                completed_bookings: number;
                total_revenue: number;
                pending_revenue: number;
            };
        }>(API_ENDPOINTS.BOOKINGS.BUILDER, params);
    },

    /**
     * Get booking details
     */
    async getBooking(id: number) {
        return api.get<Booking>(API_ENDPOINTS.BOOKINGS.GET(id));
    },

    /**
     * Update booking status (Builder only)
     */
    async updateBookingStatus(id: number, status: string) {
        return api.patch<Booking>(API_ENDPOINTS.BOOKINGS.UPDATE_STATUS(id), { status });
    },

    /**
     * Get booking payments
     */
    async getBookingPayments(id: number) {
        return api.get<{
            booking_id: number;
            payments: any[];
            total_paid: number;
            total_pending: number;
            payment_schedule: any[];
        }>(API_ENDPOINTS.BOOKINGS.PAYMENTS(id));
    },

    /**
     * Generate booking agreement
     */
    async generateAgreement(id: number) {
        return api.post<{
            message: string;
            agreement_url: string;
            generated_at: string;
        }>(API_ENDPOINTS.BOOKINGS.GENERATE_AGREEMENT(id));
    },

    /**
     * Download booking agreement
     */
    async downloadAgreement(id: number) {
        return api.get<any>(API_ENDPOINTS.BOOKINGS.DOWNLOAD_AGREEMENT(id));
    },
};
