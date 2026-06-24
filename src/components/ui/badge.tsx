import React from "react";

interface BadgeProp {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "error" | "success" | "none";
}

const Badge = ({ children, className, variant = "primary" }: BadgeProp) => {
  const variants = {
    primary: "bg-primary text-white",
    secondary: "text-primary bg-surface-highest",
    ghost: " text-slate-3 bg-surface-highest",
    error: "text-error bg-error/20",
    success: "text-slate-3 bg-success",
    none: "",
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
