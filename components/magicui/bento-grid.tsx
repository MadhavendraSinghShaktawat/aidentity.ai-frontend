import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ComponentPropsWithoutRef, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  name: string;
  description: string;
  Icon?: React.ElementType;
  cta?: string;
  href?: string;
  background?: React.ReactNode;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      // dark styles
      "transform-gpu dark:bg-background dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      // enhanced hover effect
      "transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1",
      className,
    )}
    {...props}
  >
    <div className="transition-all duration-500 group-hover:scale-105 group-hover:blur-[1px]">{background}</div>

    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-2 p-6 transition-all duration-300 group-hover:-translate-y-10">
      {Icon && (
        <div className="transition-all duration-300 group-hover:bg-primary/10 group-hover:rounded-full group-hover:p-2 w-fit">
          <Icon className="h-10 w-10 origin-left transform-gpu text-primary transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:text-primary" />
        </div>
      )}
      <h3 className="text-xl font-bold text-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1">
        {name}
      </h3>
      <p className="max-w-lg text-muted-foreground transition-all duration-300 group-hover:text-foreground">
        {description}
      </p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Button variant="default" asChild size="sm" className="pointer-events-auto bg-primary/90 hover:bg-primary group-hover:animate-pulse">
        <a href={href} className="flex items-center gap-2">
          {cta}
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </Button>
    </div>

    {/* Enhanced background gradient effects */}
    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

    {/* Subtle border glow effect */}
    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-xl [box-shadow:inset_0_0_0_1px_rgba(var(--primary),0.2)]" />
  </div>
);

export { BentoCard, BentoGrid };
