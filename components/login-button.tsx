"use client";

import { useAuthContext } from '@/providers/auth-provider';
import { Button } from './ui/button';
import { Loader2, LogIn, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LoginSource } from '@/lib/auth';

interface LoginButtonProps {
    className?: string;
    variant?: 'default' | 'outline' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    showText?: boolean;
}

export function LoginButton({
    className,
    variant = 'default',
    size = 'default',
    showText = true
}: LoginButtonProps) {
    const { login, isAuthenticated, logout, user } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);

    // Reset loading state if auth state changes
    useEffect(() => {
        setIsLoading(false);
    }, [isAuthenticated]);

    const handleAuth = async () => {
        if (isAuthenticated) {
            setIsLoading(true);
            logout();
            return;
        }

        try {
            setIsLoading(true);
            login(LoginSource.REGULAR);
            // Note: The page will be redirected, so we don't need to reset loading state
        } catch (error) {
            console.error('Login error:', error);
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleAuth}
            variant={variant}
            size={size}
            className={className}
            disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {showText && <span className="ml-2">
                        {isAuthenticated ? 'Logging out...' : 'Connecting...'}
                    </span>}
                </>
            ) : isAuthenticated ? (
                <>
                    <LogOut className="h-4 w-4" />
                    {showText && <span className="ml-2">Log out</span>}
                </>
            ) : (
                <>
                    <LogIn className="h-4 w-4" />
                    {showText && <span className="ml-2">Log in</span>}
                </>
            )}
        </Button>
    );
} 