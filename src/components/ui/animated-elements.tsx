import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedCard({ children, className, delay = 0 }: AnimatedCardProps) {
  return (
    <div
      className={cn(
        "animate-fade-in opacity-0",
        className
      )}
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: "forwards"
      }}
    >
      {children}
    </div>
  );
}

interface HoverScaleProps {
  children: React.ReactNode;
  className?: string;
  scale?: "sm" | "md" | "lg";
}

export function HoverScale({ children, className, scale = "md" }: HoverScaleProps) {
  const scaleClasses = {
    sm: "hover:scale-102",
    md: "hover:scale-105", 
    lg: "hover:scale-110"
  };

  return (
    <div className={cn(
      "transition-transform duration-200 ease-out",
      scaleClasses[scale],
      className
    )}>
      {children}
    </div>
  );
}