"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleGoogleCallback, storeAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface TokenInfo {
    access_token: string;
    token_type: string;
    expires_in?: string;
}

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);

    // Handle OAuth response which can either be code-based or token-based (implicit flow)
    useEffect(() => {
        const processAuth = async () => {
            try {
                // First, check if we have a token in the URL hash (implicit flow)
                if (typeof window !== 'undefined' && window.location.hash) {
                    // Extract token from URL hash fragment
                    const hashParams = new URLSearchParams(window.location.hash.substring(1));
                    const token = hashParams.get('access_token');
                    const tokenType = hashParams.get('token_type') || 'Bearer';
                    const expiresIn = hashParams.get('expires_in');

                    if (token) {
                        console.log('Received token via implicit flow');

                        try {
                            // Fetch user data using the token
                            const userResponse = await fetch('/api/users/me', {
                                headers: {
                                    'Authorization': `${tokenType} ${token}`
                                }
                            });

                            if (userResponse.ok) {
                                const userData = await userResponse.json();
                                // Store the user with the token
                                storeAuth({
                                    id: userData.id || userData.sub,
                                    name: userData.name,
                                    email: userData.email,
                                    picture: userData.picture,
                                    accessToken: token
                                });

                                // Redirect to dashboard
                                router.push('/dashboard');
                                return;
                            } else {
                                throw new Error('Failed to fetch user data with token');
                            }
                        } catch (err) {
                            console.error('Error fetching user data:', err);
                            setError('Authentication succeeded, but we could not fetch your profile. Please try again.');
                            setIsProcessing(false);
                            return;
                        }
                    }
                }

                // Otherwise, check for authorization code flow
                const code = searchParams.get('code');
                const state = searchParams.get('state'); // Some OAuth implementations require state validation
                const errorParam = searchParams.get('error');

                if (errorParam) {
                    setError(`Authentication error: ${errorParam}`);
                    setIsProcessing(false);
                    return;
                }

                if (!code) {
                    setError("Authentication failed: No authorization code or token received");
                    setIsProcessing(false);
                    return;
                }

                // Process the callback with authorization code
                await handleGoogleCallback(code);

                // Redirect to the dashboard
                router.push('/dashboard');
            } catch (err: any) {
                console.error('Auth callback error:', err);
                setError(err.message || "Authentication failed. Please try again.");
                setIsProcessing(false);
            }
        };

        processAuth();
    }, [router, searchParams]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-card p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h1>
                    <p className="text-foreground/70 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-card p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-4">Completing Login</h1>
                <p className="text-foreground/70">Please wait while we authenticate you with Google...</p>
            </div>
        </div>
    );
} 