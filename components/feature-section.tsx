"use client";

import React, { useState, useEffect, useRef } from 'react';
import { BentoGrid, BentoCard } from './magicui/bento-grid';
import {
    Wand2 as MagicIcon,
    Video as VideoIcon,
    Mic as MicIcon,
    Brain as BrainIcon,
    Code as CodeIcon,
    Image as ImageIcon,
    ChevronRight,
    MousePointerClick
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Custom hook to replace react-intersection-observer
function useCustomInView(options = { threshold: 0.1 }) {
    const [inView, setInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setInView(entry.isIntersecting);
        }, options);

        const currentElement = ref.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [options.threshold]);

    return { ref, inView };
}

// Feature animations - animated backgrounds for cards
const AIGenerationBackground = () => {
    const [cells, setCells] = useState<Array<{ visible: boolean, pulse: boolean, delay: number }>>([]);
    const { ref, inView } = useCustomInView({ threshold: 0.2 });

    useEffect(() => {
        // Only run this on the client side after hydration
        const newCells = Array.from({ length: 36 }, () => ({
            visible: Math.random() > 0.5,
            pulse: Math.random() > 0.6,
            delay: Math.random() * 2
        }));
        setCells(newCells);
    }, []);

    return (
        <div ref={ref} className="absolute inset-0 flex items-center justify-center opacity-10 transition-opacity duration-1000">
            <div className="h-full w-full bg-gradient-to-br from-primary/30 via-purple-500/20 to-indigo-500/30">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1">
                    {Array.from({ length: 36 }).map((_, i) => (
                        <div key={i} className="relative">
                            {cells[i]?.visible && (
                                <div
                                    className={`absolute bg-white/20 inset-1 rounded-sm transition-all duration-700`}
                                    style={{
                                        opacity: inView ? (cells[i]?.pulse ? '0.7' : '0.4') : '0',
                                        transform: inView ? 'scale(1)' : 'scale(0.8)',
                                        transitionDelay: `${cells[i]?.delay}s`
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const VideoEditingBackground = () => {
    const { ref, inView } = useCustomInView({ threshold: 0.2 });

    return (
        <div ref={ref} className="absolute inset-0 flex items-center justify-center opacity-20 transition-all duration-1000">
            <div
                className="h-[30%] w-[80%] bg-gradient-to-r from-purple-500/50 to-primary/50 rounded-md"
                style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateY(0)' : 'translateY(20px)'
                }}
            >
                <div className="absolute bottom-4 left-4 right-4 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-1500 ease-in-out"
                        style={{
                            width: inView ? '75%' : '0%',
                            transitionDelay: '0.5s'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const VoiceGenerationBackground = () => {
    const { ref, inView } = useCustomInView({ threshold: 0.2 });

    // Pre-calculate heights to avoid hydration mismatches
    const barHeights = Array.from({ length: 12 }, (_, i) => ({
        height: `${20 + Math.sin(i * 0.8) * 50}%`,
        opacity: 0.5 + Math.sin(i * 0.8) * 0.5,
        delay: i * 0.1
    }));

    return (
        <div ref={ref} className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="h-[60%] w-[80%] flex items-end justify-center gap-1">
                {barHeights.map((style, i) => (
                    <div
                        key={i}
                        className="bg-primary rounded-t-full transition-all duration-700"
                        style={{
                            height: inView ? style.height : '5%',
                            opacity: inView ? style.opacity : 0,
                            width: '0.5rem',
                            transitionDelay: `${style.delay}s`,
                            transform: inView ? 'translateY(0)' : 'translateY(10px)'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

const ContentBrainstormBackground = () => {
    const { ref, inView } = useCustomInView({ threshold: 0.2 });

    return (
        <div ref={ref} className="absolute inset-0 flex items-center justify-center opacity-10">
            <div
                className="h-[70%] w-[70%] rounded-full border-2 border-dashed border-primary/50 transition-all duration-1000"
                style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'scale(1)' : 'scale(0.8)'
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className="h-2/3 w-2/3 rounded-full border-2 border-dashed border-purple-400/50 transition-all duration-1000"
                        style={{
                            opacity: inView ? 1 : 0,
                            transform: inView ? 'scale(1)' : 'scale(0.8)',
                            transitionDelay: '0.3s'
                        }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className="h-1/2 w-1/2 rounded-full border-2 border-dashed border-indigo-300/50 transition-all duration-1000"
                                style={{
                                    opacity: inView ? 1 : 0,
                                    transform: inView ? 'scale(1)' : 'scale(0.8)',
                                    transitionDelay: '0.6s'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ImageCraftingBackground = () => {
    const { ref, inView } = useCustomInView({ threshold: 0.2 });

    return (
        <div ref={ref} className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[70%] w-[70%]">
                <div
                    className="bg-gradient-to-tr from-primary/40 to-purple-400/40 rounded-lg transition-all duration-700"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateY(0)' : 'translateY(-10px)',
                        transitionDelay: '0.1s'
                    }}
                />
                <div
                    className="bg-gradient-to-bl from-indigo-400/40 to-primary/40 rounded-lg transition-all duration-700"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateY(0)' : 'translateY(-10px)',
                        transitionDelay: '0.2s'
                    }}
                />
                <div
                    className="bg-gradient-to-tl from-violet-400/40 to-primary/40 rounded-lg transition-all duration-700"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateY(0)' : 'translateY(10px)',
                        transitionDelay: '0.3s'
                    }}
                />
                <div
                    className="bg-gradient-to-br from-primary/40 to-blue-400/40 rounded-lg transition-all duration-700"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateY(0)' : 'translateY(10px)',
                        transitionDelay: '0.4s'
                    }}
                />
            </div>
        </div>
    );
};

const AIDevBackground = () => {
    const { ref, inView } = useCustomInView({ threshold: 0.2 });
    const [textIndex, setTextIndex] = useState(0);
    const codeLines = [
        "$ AI generate component",
        "$ Analyzing requirements...",
        "$ Creating code scaffold...",
        "$ Building component...",
        "$ Optimizing performance...",
        "$ Component ready!"
    ];

    useEffect(() => {
        if (inView) {
            const interval = setInterval(() => {
                setTextIndex(prev => (prev < codeLines.length - 1 ? prev + 1 : prev));
            }, 800);
            return () => clearInterval(interval);
        } else {
            setTextIndex(0);
        }
    }, [inView, codeLines.length]);

    return (
        <div ref={ref} className="absolute inset-0 flex items-center justify-center opacity-20">
            <div
                className="w-[80%] h-[70%] rounded-lg border border-primary/30 overflow-hidden transition-all duration-700 bg-gradient-to-b from-card/50 to-transparent"
                style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateY(0)' : 'translateY(20px)'
                }}
            >
                <div className="h-6 w-full bg-primary/30 flex items-center px-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/70 mr-2" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70 mr-2" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="p-4 font-mono text-xs text-primary/70">
                    {codeLines.slice(0, textIndex + 1).map((line, i) => (
                        <div
                            key={i}
                            className={`transition-all duration-300 ${i === textIndex ? 'opacity-80' : 'opacity-100'}`}
                            style={{
                                transform: `translateY(${inView ? '0' : '10px'})`,
                                transitionDelay: `${i * 0.1}s`
                            }}
                        >
                            {line}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Enhanced Feature section with animations and improved UX
export function FeatureSection() {
    // Use state to control when we show the content (after hydration)
    const [isMounted, setIsMounted] = useState(false);
    const { ref, inView } = useCustomInView({
        threshold: 0.1
    });

    // After component mounts on client, set isMounted to true
    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <section ref={ref} className="py-24 px-6 md:px-8 lg:px-12 relative bg-background overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_70%)] blur-xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--secondary)/0.1),transparent_70%)] blur-xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="relative">
                    <div
                        className="text-center mb-16 transform transition-all duration-700"
                        style={{
                            opacity: inView ? 1 : 0,
                            transform: inView ? 'translateY(0)' : 'translateY(20px)'
                        }}
                    >
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            <div className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></div>
                            Discover Our Features
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary bg-size-200 animate-gradient">
                            AI-Powered Features
                        </h2>
                        <p className="text-foreground/70 max-w-2xl mx-auto">
                            Our platform combines cutting-edge AI technologies to transform how you create, edit, and publish content across different mediums.
                        </p>

                        <div className="mt-6 flex items-center justify-center text-sm">
                            <MousePointerClick className="w-4 h-4 mr-2 text-primary" />
                            <span className="text-foreground/60">Explore each feature by clicking on the cards</span>
                        </div>
                    </div>

                    {isMounted && (
                        <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[20rem] gap-6">
                            {/* Each card now has staggered animation and enhanced hover effects */}
                            <BentoCard
                                name="AI Video Generation"
                                description="Create professional videos in seconds with our AI video generator. Just enter your text prompt and get a complete video."
                                className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 feature-card"
                                background={<AIGenerationBackground />}
                                Icon={VideoIcon}
                                href="/features/video"
                                cta="Explore Video AI"
                                style={{
                                    opacity: inView ? 1 : 0,
                                    transform: inView ? 'translateY(0)' : 'translateY(30px)',
                                    transitionProperty: 'transform, opacity',
                                    transitionDuration: '0.7s',
                                    transitionDelay: '0.1s',
                                    transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)'
                                }}
                            />

                            <BentoCard
                                name="Voice Generator"
                                description="Transform text into natural-sounding speech with multiple voices, accents, and emotions."
                                className="col-span-1 row-span-1 feature-card"
                                background={<VoiceGenerationBackground />}
                                Icon={MicIcon}
                                href="/features/voice"
                                cta="Try Voice AI"
                                style={{
                                    opacity: inView ? 1 : 0,
                                    transform: inView ? 'translateY(0)' : 'translateY(30px)',
                                    transitionProperty: 'transform, opacity',
                                    transitionDuration: '0.7s',
                                    transitionDelay: '0.2s',
                                    transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)'
                                }}
                            />

                            <BentoCard
                                name="Content Brainstorming"
                                description="Overcome writer's block with AI-powered idea generation for blog posts, social media, and marketing campaigns."
                                className="col-span-1 row-span-1 feature-card"
                                background={<ContentBrainstormBackground />}
                                Icon={BrainIcon}
                                href="/features/brainstorm"
                                cta="Generate Ideas"
                                style={{
                                    opacity: inView ? 1 : 0,
                                    transform: inView ? 'translateY(0)' : 'translateY(30px)',
                                    transitionProperty: 'transform, opacity',
                                    transitionDuration: '0.7s',
                                    transitionDelay: '0.3s',
                                    transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)'
                                }}
                            />

                            <BentoCard
                                name="Image Crafting"
                                description="Create stunning visuals for your content with our AI image generation and editing tools."
                                className="col-span-1 row-span-1 feature-card"
                                background={<ImageCraftingBackground />}
                                Icon={ImageIcon}
                                href="/features/images"
                                cta="Create Images"
                                style={{
                                    opacity: inView ? 1 : 0,
                                    transform: inView ? 'translateY(0)' : 'translateY(30px)',
                                    transitionProperty: 'transform, opacity',
                                    transitionDuration: '0.7s',
                                    transitionDelay: '0.4s',
                                    transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)'
                                }}
                            />

                            <BentoCard
                                name="Video Editing Tools"
                                description="Powerful but simple editing tools for trimming, adding effects, transitions, and more - all powered by AI."
                                className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 feature-card"
                                background={<VideoEditingBackground />}
                                Icon={MagicIcon}
                                href="/features/editing"
                                cta="Edit Videos"
                                style={{
                                    opacity: inView ? 1 : 0,
                                    transform: inView ? 'translateY(0)' : 'translateY(30px)',
                                    transitionProperty: 'transform, opacity',
                                    transitionDuration: '0.7s',
                                    transitionDelay: '0.5s',
                                    transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)'
                                }}
                            />

                            <BentoCard
                                name="AI-Driven Development"
                                description="Automate creation of websites and apps from your content using our AI development platform."
                                className="col-span-1 row-span-1 feature-card"
                                background={<AIDevBackground />}
                                Icon={CodeIcon}
                                href="/features/development"
                                cta="Build with AI"
                                style={{
                                    opacity: inView ? 1 : 0,
                                    transform: inView ? 'translateY(0)' : 'translateY(30px)',
                                    transitionProperty: 'transform, opacity',
                                    transitionDuration: '0.7s',
                                    transitionDelay: '0.6s',
                                    transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)'
                                }}
                            />
                        </BentoGrid>
                    )}

                    {!isMounted && (
                        <div className="h-[20rem] flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
} 