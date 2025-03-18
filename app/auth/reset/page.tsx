"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthReset() {
    const router = useRouter();
    const [message, setMessage] = useState<string>("Resetting auth state...");
    const [success, setSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        try {
            // Clear all auth-related localStorage items
            localStorage.removeItem('aidentity_user_data');
            localStorage.removeItem('aidentity_login_source');
            localStorage.removeItem('rikuu_user');
            localStorage.removeItem('rikuu_login_source');
            localStorage.removeItem('user');
            localStorage.removeItem('loginSource');

            // Dispatch auth changed event
            window.dispatchEvent(new Event('auth-changed'));

            setMessage("Auth state has been reset successfully. You can now try logging in again.");
            setSuccess(true);
        } catch (error) {
            console.error('Failed to reset auth state:', error);
            setMessage("Failed to reset auth state. Please try again or clear your browser's localStorage manually.");
            setSuccess(false);
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-card p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                <h1 className="text-2xl font-bold mb-4">Auth Reset</h1>

                <div className={`p-4 rounded-md mb-6 ${success === true ? 'bg-green-100 text-green-800' :
                        success === false ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                    }`}>
                    <p>{message}</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="/"
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg"
                    >
                        Return Home
                    </Link>

                    {success && (
                        <button
                            onClick={() => router.push('/api/auth/login/google')}
                            className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg"
                        >
                            Try Login Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
} 