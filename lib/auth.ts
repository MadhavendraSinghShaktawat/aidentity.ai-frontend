import { useState, useEffect } from 'react';

// API URL - replace with your actual backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface User {
    id: string;
    name: string;
    email: string;
    picture?: string;
    accessToken: string;
}

// Interface for login response from FastAPI
interface GoogleLoginResponse {
    message: string;
    login_url: string;
}

// Interface for token response from FastAPI
export interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in?: number;
    refresh_token?: string;
    user?: {
        id: string;
        email: string;
        name: string;
        picture?: string;
        [key: string]: any;
    };
    // For when user info is at the top level
    id?: string;
    sub?: string;
    email?: string;
    name?: string;
    picture?: string;
}

// Initialize auth from localStorage if available
export const getStoredAuth = (): User | null => {
    if (typeof window === 'undefined') return null;

    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
};

// Store auth data in localStorage
export const storeAuth = (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
};

// Clear auth data from localStorage
export const clearAuth = (): void => {
    localStorage.removeItem('user');
};

// Initiate Google login
export const initiateGoogleLogin = async (): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/api/auth/login/google`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to initiate login');
        }

        const data: GoogleLoginResponse = await response.json();
        let loginUrl = data.login_url;

        // Ensure the response_type=token is included in the URL
        if (!loginUrl.includes('response_type=')) {
            // Add response_type=token to the URL
            const separator = loginUrl.includes('?') ? '&' : '?';
            loginUrl = `${loginUrl}${separator}response_type=token`;
        } else if (!loginUrl.includes('response_type=token')) {
            // Replace existing response_type with token
            loginUrl = loginUrl.replace(/response_type=[^&]+/, 'response_type=token');
        }

        return loginUrl;
    } catch (error) {
        console.error('Login initiation error:', error);
        throw error;
    }
};

// Handle Google callback
export const handleGoogleCallback = async (code: string): Promise<User> => {
    try {
        const response = await fetch(`${API_URL}/api/auth/callback/google?code=${code}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to complete authentication');
        }

        const tokenData: TokenResponse = await response.json();

        // Handle different FastAPI OAuth response formats
        let user: User;

        if (tokenData.user) {
            // If response has a user property
            user = {
                id: tokenData.user.id || tokenData.user.sub || '',
                name: tokenData.user.name || '',
                email: tokenData.user.email || '',
                picture: tokenData.user.picture,
                accessToken: tokenData.access_token,
            };
        } else {
            // If response has user info at the top level
            user = {
                id: tokenData.id || tokenData.sub || '',
                name: tokenData.name || '',
                email: tokenData.email || '',
                picture: tokenData.picture,
                accessToken: tokenData.access_token,
            };
        }

        // Store the user data
        storeAuth(user);

        return user;
    } catch (error) {
        console.error('Authentication error:', error);
        throw error;
    }
};

// Add auth token to any API request
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const user = getStoredAuth();
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(user?.accessToken ? { 'Authorization': `Bearer ${user.accessToken}` } : {}),
        ...(options.headers || {})
    };

    return fetch(url, {
        ...options,
        headers,
        credentials: 'include'
    });
};

// Custom hook for auth state
export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored auth on initial load
        const storedUser = getStoredAuth();
        setUser(storedUser);
        setLoading(false);
    }, []);

    const login = () => {
        // Direct browser navigation to the Google OAuth endpoint
        // This is important - we're not using fetch/AJAX, just direct browser navigation
        window.location.href = `${API_URL}/api/auth/login/google`;
    };

    const logout = () => {
        clearAuth();
        setUser(null);
        // Optional: Call logout endpoint on your backend
        // This could be implemented if your FastAPI backend has a logout endpoint
    };

    return {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };
}; 