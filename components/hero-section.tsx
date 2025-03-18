"use client";

import React, { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { MorphingText } from './magicui/morphing-text';
import { RetroGrid } from './magicui/retro-grid';
import { cn } from '@/lib/utils';
import { LoginButton } from './login-button';
import { useAuthContext } from '@/providers/auth-provider';

interface HeroSectionProps {
    className?: string;
}

// Memoize static content that doesn't need to re-render
const RatingCard = memo(({ rating, service, stars }: { rating: string; service: string; stars: number }) => (
    <div className="bg-card/40 p-4 rounded-lg flex flex-col items-center w-28">
        <p className="text-2xl font-bold text-foreground">{rating}</p>
        <div className="flex">
            {[...Array(5)].map((_, j) => (
                <svg key={j} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${j < stars ? "text-primary" : "text-gray-400"}`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
        <p className="text-xs text-foreground/50 mt-1">{service}</p>
    </div>
));

// Memoize product demo UI
const ProductDemo = memo(() => (
    <div className="product-shot bg-card p-4 rounded-xl shadow-xl">
        <div className="flex items-center mb-4 px-2">
            <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 text-center">
                <span className="text-xs text-foreground/50">rikuu.ai Product Demo</span>
            </div>
        </div>

        {/* Simplified Editor UI */}
        <div className="bg-card/70 rounded-lg p-4 border border-border/30">
            <div className="mb-4 flex justify-between items-center">
                <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-primary/10 text-primary rounded-md text-xs">Scenes</button>
                    <button className="px-3 py-1 bg-muted text-foreground/70 rounded-md text-xs">Export</button>
                </div>
                <button className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-xs">Play</button>
            </div>

            {/* Simplified Content Area */}
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1 space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-20 bg-muted rounded-md overflow-hidden">
                            <div className="h-2 w-1/2 bg-primary/20 rounded-full m-2"></div>
                        </div>
                    ))}
                </div>
                <div className="col-span-3 bg-background/50 rounded-md overflow-hidden">
                    <div className="h-64 flex items-center justify-center">
                        <div className="p-6 text-center">
                            <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1">AI-Generated Scene</p>
                            <p className="text-xl font-medium text-primary">Create a video in seconds with AI</p>
                            <p className="text-sm text-foreground/70 mt-2">Just enter your text and get a professional video instantly.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="mt-4 pt-4 border-t border-border/30 flex justify-between items-center">
                <div className="text-xs text-foreground/50">00:00:30 / 00:02:00</div>
                <div className="flex space-x-2">
                    <button className="p-1 rounded-full bg-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button className="p-1 rounded-full bg-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                        </svg>
                    </button>
                    <button className="p-1 rounded-full bg-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
));

// Main hero section with performance optimizations
export const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const { isAuthenticated, user, login } = useAuthContext();

    // Simple fade-in only - no complex animations
    useEffect(() => {
        // Use requestIdleCallback if available, otherwise setTimeout
        const showContent = () => setIsLoaded(true);

        if ('requestIdleCallback' in window) {
            // @ts-ignore - TypeScript doesn't have types for this by default
            window.requestIdleCallback(showContent);
        } else {
            setTimeout(showContent, 100);
        }
    }, []);

    // Static data for ratings
    const ratings = [
        { rating: "4.2", service: "Capterra", stars: 4 },
        { rating: "4.5", service: "Trustpilot", stars: 4 },
        { rating: "4.8", service: "G2", stars: 5 }
    ];

    return (
        <div className={cn("relative w-full overflow-hidden", className)}>
            {/* Static background with no animations */}
            <div className="absolute inset-0 z-0 opacity-10">
                <RetroGrid
                    className="opacity-30"
                    speed={0} // No animation speed
                    spacing={120} // Much larger spacing for fewer lines
                    lineWidth={0.8}
                    lineColor="hsl(var(--primary) / 0.6)"
                    blur={0}
                />
            </div>

            {/* Simple background with no gradients or complex effects */}
            <div className="absolute inset-0 bg-background bg-opacity-80"></div>

            {/* Navbar */}
            <header className="relative z-10 py-5 px-6 md:px-8 lg:px-12">
                <nav className="flex items-center justify-between max-w-7xl mx-auto">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl font-bold">
                            <span className="gradient-text highlight-dot">rikuu</span><span className="text-foreground">.ai</span>
                        </span>
                    </Link>

                    {/* Center Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-200">Home</Link>
                        <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-200">Features</Link>
                        <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-200">Pricing</Link>
                        <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-200">Blog</Link>
                    </div>

                    {/* Right Nav - Simplified: just one login/logout button */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <div className="hidden md:block text-sm">
                                    <span className="text-foreground/70">Hello, </span>
                                    <span className="text-foreground font-medium">{user?.name?.split(' ')[0]}</span>
                                </div>
                                <LoginButton />
                            </div>
                        ) : (
                            <LoginButton />
                        )}
                    </div>
                </nav>
            </header>

            {/* Hero Section with reduced complexity */}
            <section className="relative z-10 pt-10 pb-24 px-6 md:px-8 lg:px-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Text Content */}
                    <div className={cn(
                        "max-w-2xl",
                        isLoaded ? "opacity-100" : "opacity-0",
                        "transition-opacity duration-500" // Slower, simpler transition
                    )}>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 flex flex-wrap items-center gap-x-2">
                            <span className="text-foreground">AI </span>
                            <MorphingText
                                texts={["brainstorm", "shoot", "edit", "post"]}
                                className="gradient-text"
                                interval={3000} // Slower interval
                            />
                            <span className="text-foreground"> content for you</span>
                        </h1>

                        <p className="text-lg text-foreground/70 mb-8 max-w-lg">
                            Your One-Stop Solution for Content Creation, Audio Generation, Image Crafting & AI-Driven Development.
                        </p>

                        {/* UPDATED CTA SECTION - Direct login with the waitlist button */}
                        <div className="flex items-center gap-4 mb-10">
                            {isAuthenticated ? (
                                <Link href="/dashboard" className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium inline-block">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <button
                                    onClick={login} // Direct login on click
                                    className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium">
                                    Join Waitlist
                                </button>
                            )}
                            <span className="text-sm text-foreground/70">for early free access</span>
                        </div>

                        {/* Simplified Trust Indicators */}
                        <div className="mt-12">
                            <p className="text-sm text-foreground/50 mb-4 uppercase tracking-wider font-medium">Trustpilot rates our AI Video Generator an impressive ★</p>
                            <div className="flex flex-wrap gap-4">
                                {ratings.map((item, i) => (
                                    <RatingCard
                                        key={i}
                                        rating={item.rating}
                                        service={item.service}
                                        stars={item.stars}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Memoized Product Demo */}
                    <div className={cn(
                        isLoaded ? "opacity-100" : "opacity-0",
                        "transition-opacity duration-500" // Slower, simpler transition
                    )}>
                        <ProductDemo />
                    </div>
                </div>
            </section>

            {/* Features Banner - Static with no animations */}
            <section className="relative z-10 bg-card/30 border-y border-border/40 py-8">
                <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
                    <div className={cn(
                        "flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left",
                        isLoaded ? "opacity-100" : "opacity-0",
                        "transition-opacity duration-500" // Slower, simpler transition
                    )}>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Completely <span className="gradient-text">AI-Powered</span></h3>
                            <p className="text-sm text-foreground/70">Video Generator</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Generative <span className="gradient-text">AI Conference</span></h3>
                            <p className="text-sm text-foreground/70">Latest Technologies</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2"><span className="gradient-text">AI Voice</span> Generator</h3>
                            <p className="text-sm text-foreground/70">Natural Sounding</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HeroSection; 