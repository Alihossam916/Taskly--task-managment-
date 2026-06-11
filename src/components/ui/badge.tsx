import React from "react";

interface BadgeProp {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}

const Badge = ({ children, className, variant = "primary" }: BadgeProp) => {
  const variants = {
    primary: "bg-primary text-white",
    secondary: "text-primary bg-surface-highest",
    ghost: " text-slate-2 bg-slate-1",
  };

  return (
    <div
      className={`flex items-center justify-center py-1 w-20 rounded-l-full rounded-r-full uppercase label-sm ${className} ${variants[variant]}`}
    >
      {children}
    </div>
  );
};

export default Badge;
