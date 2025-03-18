"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { storeAuth, getLoginSource, clearLoginSource, LoginSource, joinWaitlist } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

// Define the structure of the FastAPI response
interface AuthCallbackResponse {
    access_token: string;
    token_type: string;
    user: {
        id: string;
        email: string;
        name: string;
        picture?: string;
    }
}

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);
    const [debug, setDebug] = useState<string[]>([]);

    // Helper function for debugging
    const addDebug = (message: string) => {
        console.log(`[Auth Callback] ${message}`);
        setDebug(prev => [...prev, message]);
    };

    useEffect(() => {
        const processAuth = async () => {
            try {
                addDebug("Auth callback page loaded");

                // Get the code from the URL
                const code = searchParams.get('code');
                const errorParam = searchParams.get('error');
                const loginSource = getLoginSource();

                addDebug(`Code: ${code ? 'present' : 'missing'}, Error: ${errorParam || 'none'}, Source: ${loginSource || 'none'}`);

                // Handle error parameter
                if (errorParam) {
                    setError(`Authentication error: ${errorParam}`);
                    setIsProcessing(false);
                    return;
                }

                // Ensure we have an authorization code
                if (!code) {
                    setError("Authentication failed: No authorization code received");
                    setIsProcessing(false);
                    return;
                }

                // Call the FastAPI endpoint directly with the code
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
                addDebug(`Calling backend: ${API_URL}/api/auth/callback/google`);

                let response;
                try {
                    response = await fetch(`${API_URL}/api/auth/callback/google?code=${code}`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                } catch (fetchError) {
                    const errorMessage = fetchError instanceof Error
                        ? fetchError.message
                        : 'Unknown network error';
                    addDebug(`Network error: ${errorMessage}`);
                    throw new Error(`Network error: ${errorMessage}`);
                }

                addDebug(`Response status: ${response.status} ${response.statusText}`);

                // Check if we got redirected (this means the backend is handling redirects differently)
                if (response.redirected) {
                    addDebug(`Redirected to: ${response.url}`);
                    // Follow the redirect manually, but first get the data from the backend

                    try {
                        // Try to directly get user data from a user info endpoint
                        const userResponse = await fetch(`${API_URL}/api/auth/me`, {
                            method: 'GET',
                            credentials: 'include',
                            headers: {
                                'Accept': 'application/json'
                            }
                        });

                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            addDebug(`Got user data from /api/auth/me: ${JSON.stringify(userData)}`);

                            // Store the user information
                            storeAuth({
                                id: userData.id || userData.sub || '',
                                name: userData.name || '',
                                email: userData.email || '',
                                picture: userData.picture || null,
                                accessToken: userData.access_token || 'session-auth' // Use session-based auth
                            });

                            // After storing, do the normal redirect flow
                            if (loginSource === LoginSource.WAITLIST) {
                                addDebug("Joining waitlist");
                                await joinWaitlist(userData.email);
                                clearLoginSource();
                                addDebug("Redirecting to waitlist success page");
                                router.push('/waitlist-success');
                            } else {
                                clearLoginSource();
                                addDebug("Redirecting to dashboard");
                                router.push('/dashboard');
                            }
                            return;
                        } else {
                            addDebug(`Failed to get user data: ${userResponse.status}`);
                        }
                    } catch (userError) {
                        const errorMessage = userError instanceof Error
                            ? userError.message
                            : 'Unknown error fetching user data';
                        addDebug(`Error fetching user data: ${errorMessage}`);
                    }

                    // Just follow the redirect
                    window.location.href = response.url;
                    return;
                }

                if (!response.ok) {
                    const statusText = response.statusText;
                    const errorData = await response.json().catch(() => ({}));
                    const errorDetail = errorData.detail || `API error: ${response.status} ${statusText}`;
                    addDebug(`API error: ${errorDetail}`);
                    throw new Error(errorDetail);
                }

                // Parse the response from FastAPI
                let authData: AuthCallbackResponse;
                try {
                    const text = await response.text();
                    addDebug(`Response text: ${text.substring(0, 200)}...`);
                    authData = JSON.parse(text);
                } catch (jsonError) {
                    const errorMessage = jsonError instanceof Error
                        ? jsonError.message
                        : 'Unknown JSON parse error';
                    addDebug(`JSON parse error: ${errorMessage}`);
                    throw new Error(`Failed to parse server response: ${errorMessage}`);
                }


                // Store the user information and token
                const userData = {
                    id: authData.user.id,
                    name: authData.user.name,
                    email: authData.user.email,
                    picture: authData.user.picture,
                    accessToken: authData.access_token
                };

                addDebug("Storing user data");
                storeAuth(userData);

                // Force a small delay to ensure storage is complete
                await new Promise(resolve => setTimeout(resolve, 100));

                // Verify the data was stored
                const storedUser = localStorage.getItem('aidentity_user_data');
                addDebug(`Verification - stored user: ${storedUser ? 'present' : 'missing'}`);

                addDebug(`Authentication successful, login source: ${loginSource}`);

                // Handle redirects based on login source
                if (loginSource === LoginSource.WAITLIST) {
                    // For waitlist, we automatically join and go to success page
                    addDebug("Joining waitlist");
                    await joinWaitlist(authData.user.email);
                    clearLoginSource();
                    addDebug("Redirecting to waitlist success page");
                    router.push('/waitlist-success');
                } else {
                    // For regular login, go to dashboard
                    clearLoginSource();
                    addDebug("Redirecting to dashboard");
                    router.push('/dashboard');
                }
            } catch (err: any) {
                console.error('Auth callback error:', err);
                addDebug(`Error: ${err.message}`);
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

                    {/* Only in development, show debug info */}
                    {process.env.NODE_ENV !== 'production' && debug.length > 0 && (
                        <div className="mt-4 p-4 bg-slate-100 rounded text-left text-xs text-slate-800 overflow-auto max-h-60">
                            <h4 className="font-semibold mb-2">Debug Info:</h4>
                            <pre>
                                {debug.map((msg, i) => (
                                    <div key={i}>{msg}</div>
                                ))}
                            </pre>
                        </div>
                    )}

                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg mt-4"
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
                <p className="text-foreground/70 mb-6">Please wait while we authenticate you with Google...</p>

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
            </div>
        </div>
    );
} 