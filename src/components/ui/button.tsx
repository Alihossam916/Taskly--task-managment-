import React, { ButtonHTMLAttributes } from "react";

interface ButtonProp extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "disabled";
}

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProp) {
  const styles =
    "px-4 py-4 sm:py-3 font-semibold rounded-xl sm:rounded-sm transition-all duration-200 cursor-pointer";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-container",
    secondary: "text-primary hover:bg-surface-highest",
    ghost: " text-slate-2",
    disabled: "bg-surface-low",
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
