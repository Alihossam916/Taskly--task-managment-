import React, { ButtonHTMLAttributes } from "react";

interface ButtonProp extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProp) {
  const styles =
    "w-32 px-4 py-2 font-semibold rounded-sm transition-all duration-200 cursor-pointer";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-container",
    secondary: "bg-background text-primary hover:bg-surface-highest",
    ghost: " text-slate-2",
  };

  return (
    <button
      {...props}
      className={`${styles} ${className} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}
