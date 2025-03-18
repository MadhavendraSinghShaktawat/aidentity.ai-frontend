"use client";

import { useAuthContext } from '@/providers/auth-provider';
import { Button } from './ui/button';
import { Loader2, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';

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
    const { login, isAuthenticated, logout } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);

    const handleAuth = async () => {
        if (isAuthenticated) {
            logout();
            return;
        }

        try {
            setIsLoading(true);
            await login();
        } catch (error) {
            console.error('Login error:', error);
            setIsLoading(false);
        }
        // Note: We don't need to setIsLoading(false) here as the page will redirect
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
                    {showText && <span className="ml-2">Connecting...</span>}
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