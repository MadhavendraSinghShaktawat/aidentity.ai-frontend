"use client";

import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface RetroGridProps {
  /**
   * Additional CSS classes to apply to the grid container
   */
  className?: string;
  /**
   * Rotation angle of the grid in degrees
   * @default 65
   */
  angle?: number;
  /**
   * Grid cell size in pixels
   * @default 60
   */
  cellSize?: number;
  /**
   * Grid opacity value between 0 and 1
   * @default 0.5
   */
  opacity?: number;
  /**
   * Grid line color in light mode
   * @default "gray"
   */
  lightLineColor?: string;
  /**
   * Grid line color in dark mode
   * @default "gray"
   */
  darkLineColor?: string;
  /**
   * Animation speed
   * @default 0.3
   */
  speed?: number;
  /**
   * Animation spacing
   * @default 50
   */
  spacing?: number;
  /**
   * Animation line width
   * @default 1
   */
  lineWidth?: number;
  /**
   * Animation line color
   * @default "hsl(var(--primary) / 0.3)"
   */
  lineColor?: string;
  /**
   * Animation blur
   * @default 0
   */
  blur?: number;
}

export const RetroGrid = ({
  className,
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
  lightLineColor = "red",
  darkLineColor = "gray",
  speed = 0.3,
  spacing = 50,
  lineWidth = 1,
  lineColor = "hsl(var(--primary) / 0.3)",
  blur = 0,
}: RetroGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number>();
  const perspectiveRef = useRef(800);
  const rotationRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Instead of rendering a complex animated grid, let's use a static grid image
  // This will dramatically improve performance
  useEffect(() => {
    // Performance optimization - only draw the grid once and then stop
    // This removes the continuous animation but dramatically improves performance
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = 1; // Force 1x resolution for performance
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const drawStaticGrid = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set line style
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;

      const { width, height } = canvas;
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw much fewer lines for better performance
      const gridSize = 1000;
      const step = spacing * 3; // Increased spacing for fewer lines

      // Draw static perspective grid with fewer lines
      for (let z = -gridSize; z < gridSize; z += step * 3) {
        const scale = perspectiveRef.current / (perspectiveRef.current - z + 50);

        // Draw only a few horizontal lines
        for (let x = -gridSize; x < gridSize; x += step * 3) {
          const px1 = (x - centerX) * scale + centerX;
          const py1 = (z - centerY) * scale + centerY;
          const px2 = (x + step * 3 - centerX) * scale + centerX;
          const py2 = (z - centerY) * scale + centerY;

          // Only draw if visible and every 3rd line
          if (px1 < width && px2 >= 0 && py1 < height && py1 >= 0) {
            ctx.beginPath();
            ctx.moveTo(px1, py1);
            ctx.lineTo(px2, py2);
            ctx.stroke();
          }
        }

        // Draw only a few vertical lines
        for (let x = -gridSize; x < gridSize; x += step * 3) {
          const px = (x - centerX) * scale + centerX;
          const py1 = (z - centerY) * scale + centerY;
          const py2 = (z + step * 3 - centerY) * scale + centerY;

          // Only draw if visible and every 3rd line
          if (px < width && px >= 0 && py1 < height && py2 >= 0) {
            ctx.beginPath();
            ctx.moveTo(px, py1);
            ctx.lineTo(px, py2);
            ctx.stroke();
          }
        }
      }
    };

    resizeCanvas();
    drawStaticGrid();

    // Simplified resize handling - no animation frames
    const handleResize = () => {
      resizeCanvas();
      drawStaticGrid();
    };

    // Use a more efficient resize observer approach
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [spacing, lineWidth, lineColor, blur]);

  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
    "--light-line": lightLineColor,
    "--dark-line": darkLineColor,
  } as React.CSSProperties;

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden [perspective:200px]",
        `opacity-[var(--opacity)]`,
        className,
      )}
      style={{
        ...gridStyles,
        background: 'transparent',
      }}
    />
  );
};
