import React from 'react';
import HeroSection from '../components/hero-section';

export const metadata = {
  title: 'rikuu.ai | AI Content Creation Platform',
  description: 'AI-powered platform that creates, researches, shoots, edits, and posts content for you',
};

export default function Home() {
  return (
    <main>
      <HeroSection />

      {/* Add other landing page sections below */}
    </main>
  );
}
