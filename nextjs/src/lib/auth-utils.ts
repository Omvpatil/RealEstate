/**
 * Authentication Utilities
 * Helper functions for handling authentication and session management
 */

import { TOKEN_KEYS } from "./api-config";

export interface User {
    id: number;
    email: string;
    full_name: string;
    user_type: "builder" | "customer";
    builder_id?: number; // For builder users
    customer_id?: number; // For customer users
}

/**
 * Check if user session exists and is valid
 * Redirects to login if session is invalid
 */
export const checkUserSession = (
    router: any,
    showToast?: (options: { title: string; description: string; variant?: "default" | "destructive" }) => void
): User | null => {
    // Check if we're in the browser
    if (typeof window === "undefined") {
        return null;
    }

    const userStr = localStorage.getItem(TOKEN_KEYS.USER);

    if (!userStr) {
        showToast?.({
            title: "Session Expired",
            description: "Please login again to continue.",
            variant: "destructive",
        });
        router.push("/login");
        return null;
    }

    try {
        const user = JSON.parse(userStr);

        if (!user.id) {
            showToast?.({
                title: "Session Invalid",
                description: "Please login again to continue.",
                variant: "destructive",
            });
            router.push("/login");
            return null;
        }

        return user as User;
    } catch (error) {
        console.error("Error parsing user session:", error);
        showToast?.({
            title: "Session Error",
            description: "Please login again to continue.",
            variant: "destructive",
        });
        router.push("/login");
        return null;
    }
};

/**
 * Handle API errors, especially authentication errors
 * Redirects to login on 401 Unauthorized
 */
export const handleApiError = (
    error: any,
    router: any,
    showToast?: (options: { title: string; description: string; variant?: "default" | "destructive" }) => void
): boolean => {
    // Check if it's an authentication error
    if (error.response?.status === 401) {
        showToast?.({
            title: "Session Expired",
            description: "Your session has expired. Please login again.",
            variant: "destructive",
        });

        // Clear session data
        if (typeof window !== "undefined") {
            localStorage.removeItem(TOKEN_KEYS.USER);
            localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
        }

        // Redirect to login
        router.push("/login");
        return true; // Indicates auth error was handled
    }

    return false; // Not an auth error, caller should handle
};

/**
 * Clear user session and redirect to login
 */
export const logout = (router: any) => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(TOKEN_KEYS.USER);
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    router.push("/login");
};

/**
 * Check if user has specific user type
 */
export const checkUserType = (
    requiredType: "builder" | "customer",
    router: any,
    showToast?: (options: { title: string; description: string; variant?: "default" | "destructive" }) => void
): boolean => {
    const user = checkUserSession(router, showToast);

    if (!user) {
        return false;
    }

    if (user.user_type !== requiredType) {
        showToast?.({
            title: "Access Denied",
            description: `This page is only accessible to ${requiredType}s.`,
            variant: "destructive",
        });

        // Redirect to appropriate dashboard
        const redirectPath = user.user_type === "builder" ? "/builder/dashboard" : "/customer/dashboard";
        router.push(redirectPath);
        return false;
    }

    return true;
};
