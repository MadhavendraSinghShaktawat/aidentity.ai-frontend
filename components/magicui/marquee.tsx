import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode;
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean;
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number;
  /**
   * Animation duration in seconds
   * @default 40
   */
  duration?: number;
  /**
   * Whether to fade in the marquee on mount
   * @default true
   */
  fadeIn?: boolean;
  /**
   * Whether to add a gradient overlay at the edges
   * @default false 
   */
  gradientEdges?: boolean;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  duration = 50,
  fadeIn = true,
  gradientEdges = false,
  ...props
}: MarqueeProps) {
  const [isVisible, setIsVisible] = useState(!fadeIn);

  useEffect(() => {
    if (fadeIn) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [fadeIn]);

  return (
    <div
      {...props}
      className={cn(
        "relative overflow-hidden",
        fadeIn && "transition-opacity duration-1000",
        fadeIn && (isVisible ? "opacity-100" : "opacity-0"),
        className
      )}
    >
      {/* Optional gradient edges for a cleaner look */}
      {gradientEdges && !vertical && (
        <>
          <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </>
      )}

      {gradientEdges && vertical && (
        <>
          <div className="absolute left-0 top-0 z-10 h-24 w-full bg-gradient-to-b from-background to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 z-10 h-24 w-full bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </>
      )}

      <div className="flex whitespace-nowrap">
        {/* First copy for seamless infinite scroll */}
        <div
          className={cn(
            "flex min-w-full shrink-0 gap-4 py-4",
            vertical ? "flex-col" : "flex-row",
          )}
          style={{
            animationDuration: `${duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationName: vertical ? "marquee-vertical" : "marquee",
            animationDirection: reverse ? "reverse" : "normal",
            animationPlayState: "running",
            ...(pauseOnHover && { "--hover-play-state": "paused" } as React.CSSProperties),
          }}
          onMouseEnter={pauseOnHover ? (e) => {
            e.currentTarget.style.animationPlayState = "paused";
          } : undefined}
          onMouseLeave={pauseOnHover ? (e) => {
            e.currentTarget.style.animationPlayState = "running";
          } : undefined}
        >
          {Array(repeat)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex shrink-0 items-center justify-center">
                {children}
              </div>
            ))}
        </div>

        {/* Duplicate for seamless looping */}
        <div
          className={cn(
            "flex min-w-full shrink-0 gap-4 py-4",
            vertical ? "flex-col" : "flex-row",
          )}
          style={{
            animationDuration: `${duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationName: vertical ? "marquee-vertical" : "marquee",
            animationDirection: reverse ? "reverse" : "normal",
            animationPlayState: "running",
            ...(pauseOnHover && { "--hover-play-state": "paused" } as React.CSSProperties),
          }}
          onMouseEnter={pauseOnHover ? (e) => {
            e.currentTarget.style.animationPlayState = "paused";
          } : undefined}
          onMouseLeave={pauseOnHover ? (e) => {
            e.currentTarget.style.animationPlayState = "running";
          } : undefined}
        >
          {Array(repeat)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex shrink-0 items-center justify-center">
                {children}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
