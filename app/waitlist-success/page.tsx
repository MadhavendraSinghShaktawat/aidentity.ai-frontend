"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/providers/auth-provider';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WaitlistSuccess() {
    const { isAuthenticated, user, loading } = useAuthContext();
    const router = useRouter();

    // If not authenticated, redirect to home
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
            <div className="bg-card p-8 md:p-12 rounded-xl shadow-lg max-w-2xl w-full text-center">
                <div className="flex justify-center mb-6">
                    <CheckCircle2 className="h-20 w-20 text-green-500" />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4">You're on the Waitlist!</h1>

                <p className="text-xl text-foreground/80 mb-8">
                    Thanks for joining, {user?.name?.split(' ')[0] || 'there'}! We're excited to have you.
                </p>

                <div className="bg-background/50 p-6 rounded-lg mb-8 text-left">
                    <h3 className="text-lg font-medium mb-3">What happens next:</h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm">
                                1
                            </div>
                            <div>
                                <p className="text-foreground/80">
                                    You're now on our early access waitlist. We're rolling out access in small batches.
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm">
                                2
                            </div>
                            <div>
                                <p className="text-foreground/80">
                                    You'll receive an email at <span className="font-medium">{user?.email}</span> when your access is granted.
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm">
                                3
                            </div>
                            <div>
                                <p className="text-foreground/80">
                                    In the meantime, check your dashboard for waitlist updates and early previews.
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/dashboard"
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium inline-flex items-center justify-center hover:bg-primary/90 transition-colors"
                    >
                        Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>

                    <Link
                        href="/"
                        className="px-6 py-3 bg-background border border-border rounded-lg font-medium inline-flex items-center justify-center hover:bg-card/50 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>

                <div className="mt-8 pt-6 border-t border-border/30">
                    <p className="text-sm text-foreground/60">
                        Invite friends to join the waitlist and move up in line! (Coming soon)
                    </p>
                </div>
            </div>
        </div>
    );
} 