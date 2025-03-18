"use client";

import React, { useState, useEffect } from 'react';
import { BentoGrid, BentoCard } from './magicui/bento-grid';
import {
    Wand2 as MagicIcon,
    Video as VideoIcon,
    Mic as MicIcon,
    Brain as BrainIcon,
    Code as CodeIcon,
    Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Feature card background components
const AIGenerationBackground = () => {
    // Use useState and useEffect for client-side only rendering of random elements
    const [cells, setCells] = useState<Array<{ visible: boolean, pulse: boolean }>>([]);

    useEffect(() => {
        // Only run this on the client side after hydration
        const newCells = Array.from({ length: 24 }, () => ({
            visible: Math.random() > 1,
            pulse: Math.random() > 1
        }));
        setCells(newCells);
    }, []);

    return (
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="h-full w-full bg-gradient-to-br from-primary/30 to-purple-500/30">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="relative">
                            {cells[i]?.visible && (
                                <div className={`absolute ${cells[i]?.pulse ? 'animate-pulse' : ''} bg-white/20 inset-1 rounded-sm`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const VideoEditingBackground = () => (
    <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="h-[30%] w-[80%] bg-gradient-to-r from-purple-500/50 to-primary/50 rounded-md">
            <div className="absolute bottom-4 left-4 right-4 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-primary rounded-full" />
            </div>
        </div>
    </div>
);

const VoiceGenerationBackground = () => {
    // Pre-calculate heights to avoid hydration mismatches
    const barHeights = Array.from({ length: 12 }, (_, i) => ({
        height: `${20 + Math.sin(i * 0.8) * 50}%`,
        opacity: 0.5 + Math.sin(i * 0.8) * 0.5
    }));

    return (
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="h-[60%] w-[80%] flex items-end justify-center gap-1">
                {barHeights.map((style, i) => (
                    <div
                        key={i}
                        className="bg-primary w-2 rounded-t-full"
                        style={{
                            height: style.height,
                            opacity: style.opacity
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

const ContentBrainstormBackground = () => (
    <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="h-[70%] w-[70%] rounded-full border-2 border-dashed border-primary/50">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-2/3 w-2/3 rounded-full border-2 border-dashed border-purple-400/50">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-1/2 w-1/2 rounded-full border-2 border-dashed border-indigo-300/50" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ImageCraftingBackground = () => (
    <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[70%] w-[70%]">
            <div className="bg-gradient-to-tr from-primary/40 to-purple-400/40 rounded-lg" />
            <div className="bg-gradient-to-bl from-indigo-400/40 to-primary/40 rounded-lg" />
            <div className="bg-gradient-to-tl from-violet-400/40 to-primary/40 rounded-lg" />
            <div className="bg-gradient-to-br from-primary/40 to-blue-400/40 rounded-lg" />
        </div>
    </div>
);

const AIDevBackground = () => (
    <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="w-[80%] h-[70%] rounded-lg border border-primary/30 overflow-hidden">
            <div className="h-6 w-full bg-primary/30 flex items-center px-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70 mr-2" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70 mr-2" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="p-4 font-mono text-xs text-primary/70">
                <div>$ AI generate component</div>
                <div>$ Analyzing requirements...</div>
                <div>$ Creating code scaffold...</div>
                <div className="animate-pulse">$ Building component...</div>
            </div>
        </div>
    </div>
);

// Feature section component with client-side only rendering for dynamic elements
export function FeatureSection() {
    // Use state to control when we show the content (after hydration)
    const [isMounted, setIsMounted] = useState(false);

    // After component mounts on client, set isMounted to true
    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <section className="py-24 px-6 md:px-8 lg:px-12 relative bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="gradient-text">AI-Powered</span> Features
                    </h2>
                    <p className="text-foreground/70 max-w-2xl mx-auto">
                        Our platform combines cutting-edge AI technologies to transform how you create, edit, and publish content across different mediums.
                    </p>
                </div>

                {isMounted && (
                    <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[20rem]">
                        <BentoCard
                            name="AI Video Generation"
                            description="Create professional videos in seconds with our AI video generator. Just enter your text prompt and get a complete video."
                            className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1"
                            background={<AIGenerationBackground />}
                            Icon={VideoIcon}
                            href="/features/video"
                            cta="Explore Video AI"
                        />

                        <BentoCard
                            name="Voice Generator"
                            description="Transform text into natural-sounding speech with multiple voices, accents, and emotions."
                            className="col-span-1 row-span-1"
                            background={<VoiceGenerationBackground />}
                            Icon={MicIcon}
                            href="/features/voice"
                            cta="Try Voice AI"
                        />

                        <BentoCard
                            name="Content Brainstorming"
                            description="Overcome writer's block with AI-powered idea generation for blog posts, social media, and marketing campaigns."
                            className="col-span-1 row-span-1"
                            background={<ContentBrainstormBackground />}
                            Icon={BrainIcon}
                            href="/features/brainstorm"
                            cta="Generate Ideas"
                        />

                        <BentoCard
                            name="Image Crafting"
                            description="Create stunning visuals for your content with our AI image generation and editing tools."
                            className="col-span-1 row-span-1"
                            background={<ImageCraftingBackground />}
                            Icon={ImageIcon}
                            href="/features/images"
                            cta="Create Images"
                        />

                        <BentoCard
                            name="Video Editing Tools"
                            description="Powerful but simple editing tools for trimming, adding effects, transitions, and more - all powered by AI."
                            className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1"
                            background={<VideoEditingBackground />}
                            Icon={MagicIcon}
                            href="/features/editing"
                            cta="Edit Videos"
                        />

                        <BentoCard
                            name="AI-Driven Development"
                            description="Automate creation of websites and apps from your content using our AI development platform."
                            className="col-span-1 row-span-1"
                            background={<AIDevBackground />}
                            Icon={CodeIcon}
                            href="/features/development"
                            cta="Build with AI"
                        />
                    </BentoGrid>
                )}

                {!isMounted && (
                    <div className="h-[20rem] flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </section>
    );
} 