/**
 * Messages Service
 * Handles messaging and conversations
 */

import { api } from "../api-client";
import { API_ENDPOINTS } from "../api-config";

export interface Message {
    id: number;
    sender_id: number;
    recipient_id: number;
    project_id: number;
    content: string;
    attachment_url?: string;
    is_read: boolean;
    created_at: string;
}

export interface Conversation {
    customer_id: number;
    project_id: number;
    customer_name: string;
    project_name: string;
    last_message: string;
    last_message_time: string;
    unread_count: number;
}

export interface MessageCreate {
    recipient_id: number;
    project_id: number;
    content: string;
    attachment_url?: string;
}

export const messagesService = {
    /**
     * Get all conversations
     */
    async getConversations() {
        return api.get<{ conversations: Conversation[] }>(API_ENDPOINTS.MESSAGES.CONVERSATIONS);
    },

    /**
     * Get conversation messages
     */
    async getConversationMessages(customerId: number, projectId: number, params?: { page?: number; limit?: number }) {
        return api.get<{
            messages: Message[];
            total: number;
            page: number;
            limit: number;
        }>(API_ENDPOINTS.MESSAGES.CONVERSATION(customerId, projectId), params);
    },

    /**
     * Send a message
     */
    async sendMessage(data: MessageCreate) {
        return api.post<Message>(API_ENDPOINTS.MESSAGES.SEND, data);
    },

    /**
     * Mark conversation as read
     */
    async markConversationAsRead(conversationId: number) {
        return api.patch<{ message: string; count: number }>(API_ENDPOINTS.MESSAGES.MARK_READ(conversationId));
    },

    /**
     * Get all messages
     */
    async getAllMessages(params?: { page?: number; limit?: number; conversation_id?: number }) {
        return api.get<{
            messages: Message[];
            total: number;
            page: number;
            limit: number;
        }>(API_ENDPOINTS.MESSAGES.LIST, params);
    },
};
