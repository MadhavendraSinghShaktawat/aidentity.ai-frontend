import React from 'react';
import HeroSection from '@/components/hero-section';
import { FeatureSection } from '@/components/feature-section';

export const metadata = {
  title: 'rikuu.ai | AI Content Creation Platform',
  description: 'AI-powered platform that creates, researches, shoots, edits, and posts content for you',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeatureSection />
      {/* Additional sections can be added here */}
    </main>
  );
}
