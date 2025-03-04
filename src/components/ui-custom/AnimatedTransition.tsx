
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface AnimatedTransitionProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade" | "scale" | "slide" | "blur";
  duration?: number;
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  className,
  animation = "fade",
  duration = 300,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  const getAnimationClass = () => {
    switch (animation) {
      case "fade":
        return "animate-fade-in";
      case "scale":
        return "animate-scale-in";
      case "slide":
        return "animate-fade-up";
      case "blur":
        return "animate-blur-in";
      default:
        return "animate-fade-in";
    }
  };

  return (
    <div
      className={cn(
        "transition-all duration-300",
        isVisible ? "opacity-100" : "opacity-0",
        isVisible ? getAnimationClass() : "",
        className
      )}
      style={{
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;
