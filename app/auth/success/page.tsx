"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getStoredAuth, storeAuth, getLoginSource, clearLoginSource, LoginSource, joinWaitlist } from '@/lib/auth';
import { Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AuthSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [debug, setDebug] = useState<string[]>([]);

    // Helper function for debugging
    const addDebug = (message: string) => {
        console.log(`[Auth Success] ${message}`);
        setDebug(prev => [...prev, message]);
    };

    useEffect(() => {
        const handleSuccess = async () => {
            try {
                addDebug("Auth success page loaded");

                // Check if we're actually authenticated
                let user = getStoredAuth();
                addDebug(`User from storage: ${user ? 'present' : 'missing'}`);

                const provider = searchParams.get('provider');
                addDebug(`Provider: ${provider || 'none'}`);

                if (provider !== 'google') {
                    setError(`Unsupported provider: ${provider}`);
                    setIsProcessing(false);
                    return;
                }

                // If user data is missing, try to fetch it from the backend
                if (!user) {
                    addDebug("No user data in storage, attempting to fetch from backend");

                    try {
                        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
                        // Try to get user data from API - use the correct endpoint /api/auth/me
                        const userResponse = await fetch(`${API_URL}/api/auth/me`, {
                            method: 'GET',
                            credentials: 'include',
                            headers: {
                                'Accept': 'application/json'
                            }
                        });

                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            addDebug(`Retrieved user data from API: ${JSON.stringify(userData)}`);

                            // Store the user information
                            storeAuth({
                                id: userData.id || userData.sub || '',
                                name: userData.name || '',
                                email: userData.email || '',
                                picture: userData.picture || null,
                                accessToken: userData.access_token || 'session-auth' // Use session-based auth
                            });

                            // Update our user variable
                            user = getStoredAuth();
                            addDebug(`User after API fetch: ${user ? 'present' : 'still missing'}`);
                        } else {
                            addDebug(`Failed to get user data: ${userResponse.status}`);
                        }
                    } catch (userError) {
                        const errorMessage = userError instanceof Error
                            ? userError.message
                            : 'Unknown error fetching user data';
                        addDebug(`Error fetching user data: ${errorMessage}`);
                    }
                }

                // If still no user data, error out
                if (!user) {
                    setError("Authentication failed: Could not retrieve user data. Please try logging in again.");
                    setIsProcessing(false);
                    return;
                }

                // Get the login source to determine where to redirect after login
                const loginSource = getLoginSource();
                addDebug(`Login source: ${loginSource || 'none'}`);

                // If they came from the waitlist flow, redirect to waitlist success
                if (loginSource === LoginSource.WAITLIST) {
                    addDebug("Joining waitlist");
                    // Join the waitlist
                    const success = await joinWaitlist(user.email);
                    addDebug(`Waitlist join result: ${success ? 'success' : 'failed'}`);

                    // Clear the login source
                    clearLoginSource();

                    // Redirect to waitlist success page
                    addDebug("Redirecting to waitlist success page");
                    router.push('/waitlist-success');
                } else {
                    // For regular login, redirect to dashboard
                    clearLoginSource();
                    addDebug("Redirecting to dashboard");
                    router.push('/dashboard');
                }
            } catch (err: any) {
                console.error('Auth success page error:', err);
                addDebug(`Error: ${err.message}`);
                setError(err.message || "There was an issue processing your login. Please try again.");
                setIsProcessing(false);
            }
        };

        handleSuccess();
    }, [router, searchParams]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-card p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h1>
                    <p className="text-foreground/70 mb-6">{error}</p>

                    {/* Always show debug info during authentication issues */}
                    {debug.length > 0 && (
                        <div className="mt-4 p-4 bg-slate-100 rounded text-left text-xs text-slate-800 overflow-auto max-h-60">
                            <h4 className="font-semibold mb-2">Debug Info:</h4>
                            <pre>
                                {debug.map((msg, i) => (
                                    <div key={i}>{msg}</div>
                                ))}
                            </pre>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Link
                            href="/"
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg inline-block mt-4"
                        >
                            Return Home
                        </Link>
                        <Link
                            href="/auth/reset"
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg inline-block mt-4"
                        >
                            Reset Auth & Try Again
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-card p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-4">Authentication Successful</h1>
                <p className="text-foreground/70 mb-6">You've successfully signed in! Redirecting you now...</p>

                {/* Always show debug info during authentication issues */}
                {debug.length > 0 && (
                    <div className="mt-4 p-4 bg-slate-100 rounded text-left text-xs text-slate-800 overflow-auto max-h-60">
                        <h4 className="font-semibold mb-2">Debug Info:</h4>
                        <pre>
                            {debug.map((msg, i) => (
                                <div key={i}>{msg}</div>
                            ))}
                        </pre>
                    </div>
                )}

                <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            </div>
        </div>
    );
} 