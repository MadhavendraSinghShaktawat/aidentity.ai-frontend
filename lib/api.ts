import { getStoredAuth } from "./auth";

// API URL - replace with your actual backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Common headers for all API requests
const getHeaders = () => {
    const user = getStoredAuth();
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(user?.accessToken ? { 'Authorization': `Bearer ${user.accessToken}` } : {})
    };
};

// Generic API request function
const apiRequest = async <T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...getHeaders(),
                ...(options?.headers || {})
            },
            credentials: 'include'
        });

        // Handle HTTP errors
        if (!response.ok) {
            // Try to parse error details from FastAPI response
            const errorData = await response.json().catch(() => null);

            // FastAPI typically returns errors with 'detail' field
            if (errorData && errorData.detail) {
                throw new Error(errorData.detail);
            }

            // Generic error based on status
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        // Handle non-JSON responses
        return (await response.text()) as unknown as T;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Network error occurred');
    }
};

// API methods
export const api = {
    get: <T>(endpoint: string, options?: RequestInit) =>
        apiRequest<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, data?: any, options?: RequestInit) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined
        }),

    put: <T>(endpoint: string, data?: any, options?: RequestInit) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined
        }),

    patch: <T>(endpoint: string, data?: any, options?: RequestInit) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined
        }),

    delete: <T>(endpoint: string, options?: RequestInit) =>
        apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

// Common API endpoints for FastAPI backend
export const userApi = {
    // Get current user profile
    getProfile: () => api.get<{
        id: string;
        email: string;
        name: string;
        picture?: string;
    }>('/api/users/me'),

    // Update user settings
    updateSettings: (settings: Record<string, any>) =>
        api.put('/api/users/settings', settings),

    // Get user's waitlist status
    getWaitlistStatus: () =>
        api.get<{ status: string; position?: number }>('/api/users/waitlist')
}; 