/**
 * Projects Service
 * Handles project-related API calls
 */

import { api } from "../api-client";
import { API_ENDPOINTS } from "../api-config";

export interface Project {
    id: number;
    builder_id: number;
    project_name: string;
    description?: string;
    project_type: string;
    status: string;
    location_address: string;
    location_city: string;
    location_state: string;
    location_zipcode: string;
    total_units: number;
    available_units: number;
    price_range_min?: number;
    price_range_max?: number;
    project_area?: number;
    amenities?: string[];
    start_date?: string;
    expected_completion_date?: string;
    images?: string[];
    floor_plans?: string[];
    brochure_url?: string;
    created_at: string;
    updated_at?: string;
}

export interface ProjectCreate {
    builder_id: number;
    project_name: string;
    description?: string;
    project_type: string;
    location_address: string;
    location_city: string;
    location_state: string;
    location_zipcode: string;
    total_units: number;
    available_units: number;
    price_range_min?: number;
    price_range_max?: number;
    project_area?: number;
    amenities?: string[];
    start_date?: string;
    expected_completion_date?: string;
    images?: string[];
    floor_plans?: string[];
    brochure_url?: string;
}

export interface ProjectUpdate {
    project_name?: string;
    location?: string;
    status?: string;
    description?: string;
    amenities?: string[];
    images?: string[];
}

export const projectsService = {
    /**
     * Get all projects with filters
     */
    async getProjects(params?: {
        page?: number;
        limit?: number;
        location?: string;
        project_type?: string;
        status?: string;
        min_price?: number;
        max_price?: number;
    }) {
        return api.get<{ projects: Project[]; total: number; page: number; limit: number }>(
            API_ENDPOINTS.PROJECTS.LIST,
            params
        );
    },

    /**
     * Get project by ID
     */
    async getProject(id: number) {
        return api.get<Project>(API_ENDPOINTS.PROJECTS.GET(id));
    },

    /**
     * Create new project (Builder only)
     */
    async createProject(data: ProjectCreate) {
        return api.post<Project>(API_ENDPOINTS.PROJECTS.CREATE, data);
    },

    /**
     * Update project (Builder only)
     */
    async updateProject(id: number, data: ProjectUpdate) {
        return api.patch<Project>(API_ENDPOINTS.PROJECTS.UPDATE(id), data);
    },

    /**
     * Delete project (Builder only)
     */
    async deleteProject(id: number) {
        return api.delete<{ message: string }>(API_ENDPOINTS.PROJECTS.DELETE(id));
    },

    /**
     * Get project units
     */
    async getProjectUnits(id: number) {
        return api.get<any[]>(API_ENDPOINTS.PROJECTS.UNITS(id));
    },

    /**
     * Get project progress
     */
    async getProjectProgress(id: number) {
        return api.get<any[]>(API_ENDPOINTS.PROJECTS.PROGRESS(id));
    },

    /**
     * Get construction updates
     */
    async getConstructionUpdates(id: number) {
        return api.get<any[]>(API_ENDPOINTS.PROJECTS.UPDATES(id));
    },
};
