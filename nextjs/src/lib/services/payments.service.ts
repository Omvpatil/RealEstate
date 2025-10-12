/**
 * Payments Service
 * Handles payment operations
 */

import { api } from "../api-client";
import { API_ENDPOINTS } from "../api-config";

export interface Payment {
    id: number;
    booking_id: number;
    payment_type: string;
    amount: number;
    payment_method: string;
    transaction_id?: string;
    payment_date: string;
    notes?: string;
    created_at: string;
}

export interface PaymentCreate {
    booking_id: number;
    payment_type: string;
    amount: number;
    payment_method: string;
    transaction_id?: string;
    payment_date: string;
    notes?: string;
}

export const paymentsService = {
    /**
     * Record a payment (Builder only)
     */
    async createPayment(data: PaymentCreate) {
        return api.post<Payment>(API_ENDPOINTS.PAYMENTS.CREATE, data);
    },
};
