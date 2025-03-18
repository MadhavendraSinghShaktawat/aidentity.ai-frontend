import { useState, useEffect } from 'react';

// API URL - replace with your actual backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

// Storage keys - use more specific names to avoid conflicts
const USER_STORAGE_KEY = 'aidentity_user_data';
const LOGIN_SOURCE_KEY = 'aidentity_login_source';

// Login sources to track where the user initiated login from
export enum LoginSource {
    WAITLIST = 'waitlist',
    REGULAR = 'regular'
}

export interface User {
    id: string;
    name: string;
    email: string;
    picture?: string;
    accessToken: string;
}

// Debugging helper function - remove in production
const logDebug = (message: string, data?: any) => {
    console.log(`[Auth] ${message}`, data || '');
};

// Initialize auth from localStorage if available
export const getStoredAuth = (): User | null => {
    if (typeof window === 'undefined') return null;

    try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (!storedUser) return null;

        const userData = JSON.parse(storedUser) as User;
        logDebug('Retrieved stored user', userData);
        return userData;
    } catch (error) {
        console.error('Error retrieving stored auth:', error);
        return null;
    }
};

// Store auth data in localStorage
export const storeAuth = (user: User): void => {
    try {
        logDebug('Storing user data', user);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

        // Dispatch an event so other components can update
        window.dispatchEvent(new Event('auth-changed'));
    } catch (error) {
        console.error('Error storing auth:', error);
    }
};

// Clear auth data from localStorage
export const clearAuth = (): void => {
    try {
        logDebug('Clearing auth data');
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(LOGIN_SOURCE_KEY);

        // Dispatch an event so other components can update
        window.dispatchEvent(new Event('auth-changed'));
    } catch (error) {
        console.error('Error clearing auth:', error);
    }
};

// Store the login source
export const setLoginSource = (source: LoginSource): void => {
    try {
        logDebug('Setting login source', source);
        localStorage.setItem(LOGIN_SOURCE_KEY, source);
    } catch (error) {
        console.error('Error setting login source:', error);
    }
};

// Get the login source
export const getLoginSource = (): LoginSource | null => {
    if (typeof window === 'undefined') return null;

    try {
        const source = localStorage.getItem(LOGIN_SOURCE_KEY) as LoginSource;
        logDebug('Retrieved login source', source);
        return source || null;
    } catch (error) {
        console.error('Error getting login source:', error);
        return null;
    }
};

// Clear login source
export const clearLoginSource = (): void => {
    try {
        logDebug('Clearing login source');
        localStorage.removeItem(LOGIN_SOURCE_KEY);
    } catch (error) {
        console.error('Error clearing login source:', error);
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

// Join waitlist API call
export const joinWaitlist = async (email: string): Promise<boolean> => {
    try {
        logDebug('Joining waitlist for', email);
        const user = getStoredAuth();

        // If user is already authenticated, use their stored info
        const payload = {
            email: user?.email || email,
            name: user?.name || ''
        };

        const response = await fetchWithAuth(`${API_URL}/api/waitlist/join`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response.ok;
    } catch (error) {
        console.error('Failed to join waitlist:', error);
        return false;
    }
};

// Custom hook for auth state
export const useAuth = () => {
    const [user, setUser] = useState<User | null>(getStoredAuth());
    const [loading, setLoading] = useState(true);

    // Effect to handle auth changes from localStorage or other components
    useEffect(() => {
        // Update user state from localStorage
        const updateUserState = () => {
            const storedUser = getStoredAuth();
            logDebug('Updating user state from storage', storedUser);
            setUser(storedUser);
        };

        // Set up listener for auth changes
        window.addEventListener('auth-changed', updateUserState);

        // Initial load
        updateUserState();
        setLoading(false);

        // Clean up
        return () => {
            window.removeEventListener('auth-changed', updateUserState);
        };
    }, []);

    // Log the authentication state on changes (for debugging)
    useEffect(() => {
        logDebug('Auth state changed', { isAuthenticated: !!user, user });
    }, [user]);

    const login = (source: LoginSource = LoginSource.REGULAR) => {
        logDebug('Initiating login with source', source);

        // Store the login source
        setLoginSource(source);

        // Direct browser navigation to Google OAuth
        window.location.href = `${API_URL}/api/auth/login/google`;
    };

    const logout = () => {
        logDebug('Logging out');
        clearAuth();
        setUser(null);
    };

    const joinWaitlistIfAuthenticated = async (): Promise<boolean> => {
        logDebug('Join waitlist flow initiated', { isAuthenticated: !!user });

        // If not authenticated, need to login first with waitlist source
        if (!user) {
            login(LoginSource.WAITLIST);
            return false;
        }

        // Already authenticated, can join waitlist directly
        const success = await joinWaitlist(user.email);
        logDebug('Waitlist join result', { success });

        if (success) {
            // Redirect to waitlist success page
            window.location.href = '/waitlist-success';
        }
        return success;
    };

    return {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        joinWaitlistIfAuthenticated
    };
}; 