/**
 * Notifications Service
 * Handles user notifications
 */

import { api } from "../api-client";
import { API_ENDPOINTS } from "../api-config";

export interface Notification {
    id: number;
    user_id: number;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
}

export const notificationsService = {
    /**
     * Get user notifications
     */
    async getNotifications(params?: { unread_only?: boolean; limit?: number }) {
        return api.get<{
            notifications: Notification[];
            unread_count: number;
        }>(API_ENDPOINTS.NOTIFICATIONS.LIST, params);
    },

    /**
     * Mark notification as read
     */
    async markAsRead(id: number) {
        return api.patch<Notification>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    },
};
