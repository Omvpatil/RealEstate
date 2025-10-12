/**
 * Authentication Service
 * Handles user registration, login, and profile management
 */

import { api, tokenManager } from "../api-client";
import { API_ENDPOINTS } from "../api-config";

export interface RegisterData {
    email: string;
    password: string;
    user_type: "builder" | "customer";
    full_name: string;
    phone: string;
    company_name?: string;
    license_number?: string;
    address?: string;
}

export interface LoginData {
    email: string;
    password: string;
    user_type?: "builder" | "customer";
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: User;
}

export interface User {
    id: number;
    email: string;
    user_type: "builder" | "customer";
    full_name: string;
    phone: string;
    company_name?: string;
    license_number?: string;
    address?: string;
    created_at: string;
}

export const authService = {
    /**
     * Register a new user
     */
    async register(data: RegisterData) {
        // Transform data to match backend schema
        const payload: any = {
            email: data.email,
            password: data.password,
            user_type: data.user_type,
        };

        if (data.user_type === "builder") {
            payload.builder_data = {
                company_name: data.company_name || "",
                license_number: data.license_number || "",
                phone: data.phone,
                address: data.address || "",
            };
        } else {
            // For customer, split full_name into first_name and last_name
            const nameParts = data.full_name.split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            payload.customer_data = {
                first_name: firstName,
                last_name: lastName,
                phone: data.phone,
                address: data.address || "",
            };
        }

        const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, payload);

        if (response.data) {
            tokenManager.setTokens(response.data.access_token, response.data.refresh_token);
            tokenManager.setUser(response.data.user);
        }

        return response;
    },

    /**
     * Login user
     */
    async login(data: LoginData) {
        const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);

        if (response.data) {
            tokenManager.setTokens(response.data.access_token, response.data.refresh_token);
            tokenManager.setUser(response.data.user);
        }

        return response;
    },

    /**
     * Get current user profile
     */
    async getProfile() {
        return api.get<User>(API_ENDPOINTS.AUTH.ME);
    },

    /**
     * Logout user
     */
    logout() {
        tokenManager.clearTokens();
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!tokenManager.getAccessToken();
    },

    /**
     * Get current user from local storage
     */
    getCurrentUser(): User | null {
        return tokenManager.getUser();
    },
};
