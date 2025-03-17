"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MorphingTextProps {
  texts: string[];
  className?: string;
  interval?: number;
}

export const MorphingText: React.FC<MorphingTextProps> = ({
  texts,
  className,
  interval = 3000, // Slower interval for better performance
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle empty texts array
  if (!texts || texts.length === 0) return null;

  // Use a non-updating version for single item arrays
  if (texts.length === 1) {
    return <span className={className}>{texts[0]}</span>;
  }

  // Performance optimized effect
  useEffect(() => {
    // Clean function to clear all timers
    const cleanTimers = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // Start the animation cycle
    const startCycle = () => {
      cleanTimers(); // Always clean before starting

      intervalRef.current = setInterval(() => {
        setIsAnimating(true);

        timeoutRef.current = setTimeout(() => {
          setCurrentIndex(prev => (prev + 1) % texts.length);
          setIsAnimating(false);
        }, 200);
      }, interval);
    };

    startCycle();

    // Clean up on unmount
    return cleanTimers;
  }, [texts.length, interval]);

  return (
    <span
      className={cn(
        "inline-block transition-opacity duration-200",
        isAnimating ? "opacity-0" : "opacity-100",
        className
      )}
    >
      {texts[currentIndex]}
    </span>
  );
};

export default MorphingText;
