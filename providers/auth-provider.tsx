"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, User, LoginSource } from '@/lib/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (source?: LoginSource) => void;
    logout: () => void;
    isAuthenticated: boolean;
    joinWaitlistIfAuthenticated: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuth();

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
} 