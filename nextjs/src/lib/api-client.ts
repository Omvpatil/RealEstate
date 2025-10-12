/**
 * API Client for BuildCraft RealEstate
 *
 * This module provides a centralized API client with authentication,
 * error handling, and type-safe methods for all backend endpoints.
 */

import { API_BASE_URL, TOKEN_KEYS } from "./api-config";

// Types
export interface ApiError {
    message: string;
    status: number;
    detail?: string;
}

export interface ApiResponse<T = any> {
    data?: T;
    error?: ApiError;
}

// Token management
export const tokenManager = {
    getAccessToken: (): string | null => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    },

    getRefreshToken: (): string | null => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    },

    setTokens: (accessToken: string, refreshToken: string) => {
        if (typeof window === "undefined") return;
        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
    },

    clearTokens: () => {
        if (typeof window === "undefined") return;
        localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.USER);
    },

    getUser: () => {
        if (typeof window === "undefined") return null;
        const userStr = localStorage.getItem(TOKEN_KEYS.USER);
        return userStr ? JSON.parse(userStr) : null;
    },

    setUser: (user: any) => {
        if (typeof window === "undefined") return;
        localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(user));
    },
};

// API Client class
class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        const token = tokenManager.getAccessToken();

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...(options.headers as Record<string, string>),
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    error: {
                        message: data.detail || "An error occurred",
                        status: response.status,
                        detail: data.detail,
                    },
                };
            }

            return { data };
        } catch (error) {
            return {
                error: {
                    message: error instanceof Error ? error.message : "Network error",
                    status: 0,
                },
            };
        }
    }

    // GET request
    async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
        // Filter out undefined/null values from params
        const filteredParams = params
            ? Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value !== null))
            : {};

        const queryString =
            Object.keys(filteredParams).length > 0 ? "?" + new URLSearchParams(filteredParams).toString() : "";

        return this.request<T>(`${endpoint}${queryString}`, {
            method: "GET",
        });
    }

    // POST request
    async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    // PATCH request
    async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "PATCH",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    // DELETE request
    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "DELETE",
        });
    }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export convenience functions
export const api = {
    get: <T>(endpoint: string, params?: Record<string, any>) => apiClient.get<T>(endpoint, params),
    post: <T>(endpoint: string, data?: any) => apiClient.post<T>(endpoint, data),
    patch: <T>(endpoint: string, data?: any) => apiClient.patch<T>(endpoint, data),
    delete: <T>(endpoint: string) => apiClient.delete<T>(endpoint),
};
