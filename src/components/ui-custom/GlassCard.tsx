
import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "bg-white/80 backdrop-blur-md border border-white/20 rounded-lg shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
