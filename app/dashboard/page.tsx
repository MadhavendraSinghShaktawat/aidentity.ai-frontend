"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/providers/auth-provider';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
    const { isAuthenticated, user, loading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // The useEffect will redirect
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-card rounded-lg shadow-lg p-8">
                <div className="flex items-center gap-4 mb-8">
                    {user?.picture && (
                        <img
                            src={user.picture}
                            alt={user.name}
                            className="w-16 h-16 rounded-full"
                        />
                    )}
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Welcome, {user?.name}</h1>
                        <p className="text-foreground/70">{user?.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-background p-6 rounded-lg border border-border">
                        <h3 className="text-xl font-medium mb-2">Your Projects</h3>
                        <p className="text-foreground/70">No projects yet. Start creating!</p>
                    </div>
                    <div className="bg-background p-6 rounded-lg border border-border">
                        <h3 className="text-xl font-medium mb-2">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full py-2 px-4 bg-primary/10 text-primary rounded-md text-sm">
                                Create New Project
                            </button>
                            <button className="w-full py-2 px-4 bg-background border border-border rounded-md text-sm">
                                Browse Templates
                            </button>
                        </div>
                    </div>
                    <div className="bg-background p-6 rounded-lg border border-border">
                        <h3 className="text-xl font-medium mb-2">Waitlist Status</h3>
                        <div className="mb-2">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Early Access
                            </span>
                        </div>
                        <p className="text-foreground/70">You have early access to all features!</p>
                    </div>
                </div>

                <div className="bg-background p-6 rounded-lg border border-border">
                    <h3 className="text-xl font-medium mb-4">Getting Started</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                                1
                            </div>
                            <div>
                                <h4 className="font-medium">Create your first project</h4>
                                <p className="text-sm text-foreground/70">
                                    Start with a blank canvas or choose from our templates.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                                2
                            </div>
                            <div>
                                <h4 className="font-medium">Add content with AI</h4>
                                <p className="text-sm text-foreground/70">
                                    Use our AI tools to generate images, text, and more.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                                3
                            </div>
                            <div>
                                <h4 className="font-medium">Share your creation</h4>
                                <p className="text-sm text-foreground/70">
                                    Export, publish, or share your project with others.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 